import requests
import time


BASE_URL = "http://localhost:3001"


def test_estimates_crud_api_routes_handle_all_operations_with_auth_and_validation():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    timeout = 30

    timestamp_suffix = str(int(time.time() * 1000))

    # Helper user data with unique emails
    user1 = {
        "email": f"user1_{timestamp_suffix}@example.com",
        "password": "Password123!",
        "name": "User One"
    }
    user2 = {
        "email": f"user2_{timestamp_suffix}@example.com",
        "password": "Password123!",
        "name": "User Two"
    }

    estimate_payload_valid = {
        "title": "Test Estimate",
        "clientName": "Client A",
        "items": [
            {
                "description": "Pipe fitting",
                "quantity": 10,
                "unitPrice": 5.5,
                "type": "material"
            },
            {
                "description": "Labor charge",
                "quantity": 3,
                "unitPrice": 50,
                "type": "labor"
            }
        ]
    }

    estimate_payload_invalid = {
        # Missing required fields and invalid items array
        "title": "",
        "clientName": "",
        "items": [
            {
                "description": "",
                "quantity": "three",  # invalid type
                "unitPrice": -5,      # invalid value
                "type": "invalidtype" # invalid type value
            }
        ]
    }

    def sign_up_and_activate_subscription(user_session, user):
        # Sign up with three fields: email, password, name
        r = user_session.post(
            f"{BASE_URL}/api/auth/sign-up/email",
            json=user,
            timeout=timeout
        )
        assert r.status_code == 200, f"Sign up failed: {r.text}"

        # Sign in
        r = user_session.post(
            f"{BASE_URL}/api/auth/sign-in/email",
            json={"email": user["email"], "password": user["password"]},
            timeout=timeout
        )
        assert r.status_code == 200, f"Sign in failed: {r.text}"

        # Activate subscription using test helper endpoint
        r = user_session.post(
            f"{BASE_URL}/api/test/activate-subscription",
            timeout=timeout
        )
        assert r.status_code == 200, f"Activate subscription failed: {r.text}"

    def sign_up_without_activation(user_session, user):
        # Sign up with three fields: email, password, name
        r = user_session.post(
            f"{BASE_URL}/api/auth/sign-up/email",
            json=user,
            timeout=timeout
        )
        assert r.status_code == 200, f"Sign up failed: {r.text}"

        # Sign in
        r = user_session.post(
            f"{BASE_URL}/api/auth/sign-in/email",
            json={"email": user["email"], "password": user["password"]},
            timeout=timeout
        )
        assert r.status_code == 200, f"Sign in failed: {r.text}"

    # Test unauthenticated requests to all estimate routes expect 401
    unauth_paths = [
        (session.get, f"{BASE_URL}/api/estimates"),
        (session.post, f"{BASE_URL}/api/estimates", estimate_payload_valid),
        (session.get, f"{BASE_URL}/api/estimates/1"),
        (session.put, f"{BASE_URL}/api/estimates/1", estimate_payload_valid),
        (session.delete, f"{BASE_URL}/api/estimates/1"),
    ]
    for entry in unauth_paths:
        method = entry[0]
        url = entry[1]
        if len(entry) == 3:
            data = entry[2]
            r = method(url, json=data, timeout=timeout)
        else:
            r = method(url, timeout=timeout)
        assert r.status_code == 401, f"Expected 401 for unauthenticated on {url}, got {r.status_code}"

    # Create two separate sessions for two users, user1 active subscription, user2 no subscription
    session_user1 = requests.Session()
    session_user1.headers.update({"Content-Type": "application/json"})
    sign_up_and_activate_subscription(session_user1, user1)

    session_user2 = requests.Session()
    session_user2.headers.update({"Content-Type": "application/json"})
    sign_up_without_activation(session_user2, user2)

    # Check access for user2 (no active subscription) - expect 403 on protected estimate routes
    paths_with_methods = [
        ("get", f"{BASE_URL}/api/estimates", None),
        ("post", f"{BASE_URL}/api/estimates", estimate_payload_valid),
        ("get", f"{BASE_URL}/api/estimates/1", None),
        ("put", f"{BASE_URL}/api/estimates/1", estimate_payload_valid),
        ("delete", f"{BASE_URL}/api/estimates/1", None),
    ]
    for method, url, data in paths_with_methods:
        if data is not None:
            r = getattr(session_user2, method)(url, json=data, timeout=timeout)
        else:
            r = getattr(session_user2, method)(url, timeout=timeout)
        assert r.status_code == 403, f"Expected 403 for inactive subscription on {url}, got {r.status_code}"

    # Now, with user1 (active subscription), perform full CRUD flow including validation checks and ownership checks
    # 1. List estimates (should be empty initially)
    r = session_user1.get(f"{BASE_URL}/api/estimates", timeout=timeout)
    assert r.status_code == 200
    json_data = r.json()
    assert "estimates" in json_data and isinstance(json_data["estimates"], list)

    # 2. Create estimate with invalid data - expect 400
    r = session_user1.post(f"{BASE_URL}/api/estimates", json=estimate_payload_invalid, timeout=timeout)
    assert r.status_code == 400

    # 3. Create estimate with valid data - expect 201 with estimate object
    r = session_user1.post(f"{BASE_URL}/api/estimates", json=estimate_payload_valid, timeout=timeout)
    assert r.status_code == 201
    json_data = r.json()
    assert "estimate" in json_data and isinstance(json_data["estimate"], dict)
    estimate = json_data["estimate"]
    assert isinstance(estimate.get("id"), int)
    estimate_id = estimate["id"]

    # 4. Get single estimate by id - expect 200 and correct estimate data
    r = session_user1.get(f"{BASE_URL}/api/estimates/{estimate_id}", timeout=timeout)
    assert r.status_code == 200
    json_data = r.json()
    assert "estimate" in json_data and json_data["estimate"]["id"] == estimate_id

    # 5. Attempt to get non-existent estimate - expect 404
    r = session_user1.get(f"{BASE_URL}/api/estimates/9999999", timeout=timeout)
    assert r.status_code == 404

    # 6. Update estimate with invalid data - expect 400
    r = session_user1.put(f"{BASE_URL}/api/estimates/{estimate_id}", json=estimate_payload_invalid, timeout=timeout)
    assert r.status_code == 400

    # 7. Update estimate with valid data - expect 200 and updated estimate data
    updated_payload = {
        "title": "Updated Estimate Title",
        "clientName": "Client B",
        "items": [
            {
                "description": "Updated item",
                "quantity": 5,
                "unitPrice": 20,
                "type": "equipment"
            }
        ]
    }
    r = session_user1.put(f"{BASE_URL}/api/estimates/{estimate_id}", json=updated_payload, timeout=timeout)
    assert r.status_code == 200
    json_data = r.json()
    assert "estimate" in json_data
    updated_estimate = json_data["estimate"]
    assert updated_estimate["title"] == "Updated Estimate Title"
    assert updated_estimate["clientName"] == "Client B"
    assert isinstance(updated_estimate["items"], list) and len(updated_estimate["items"]) == 1
    assert updated_estimate["items"][0]["type"] == "equipment"

    # 8. Ownership validation: user2 should not access user1's estimate - expect 404 or 403
    r = session_user2.get(f"{BASE_URL}/api/estimates/{estimate_id}", timeout=timeout)
    assert r.status_code == 403 or r.status_code == 404

    r = session_user2.put(f"{BASE_URL}/api/estimates/{estimate_id}", json=updated_payload, timeout=timeout)
    assert r.status_code == 403 or r.status_code == 404

    r = session_user2.delete(f"{BASE_URL}/api/estimates/{estimate_id}", timeout=timeout)
    assert r.status_code == 403 or r.status_code == 404

    # 9. Delete estimate - expect 200
    r = session_user1.delete(f"{BASE_URL}/api/estimates/{estimate_id}", timeout=timeout)
    assert r.status_code == 200

    # 10. Delete non-existent estimate - expect 404
    r = session_user1.delete(f"{BASE_URL}/api/estimates/{estimate_id}", timeout=timeout)
    assert r.status_code == 404

    # 11. After deletion, get estimate should be 404
    r = session_user1.get(f"{BASE_URL}/api/estimates/{estimate_id}", timeout=timeout)
    assert r.status_code == 404


test_estimates_crud_api_routes_handle_all_operations_with_auth_and_validation()
