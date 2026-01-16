import requests
import uuid

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def test_TC004_subscription_status_and_access_control():
    headers_json = {"Content-Type": "application/json"}
    session = requests.Session()

    # Generate unique test user credentials
    test_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "TestPassword123!"
    test_name = f"Test User {uuid.uuid4().hex[:4]}"

    try:
        # 1. Sign up the user
        signup_payload = {"name": test_name, "email": test_email, "password": test_password}
        resp = session.post(f"{BASE_URL}/api/auth/sign-up/email", json=signup_payload, headers=headers_json, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Signup failed: {resp.status_code} - {resp.text}"

        # 2. Sign in the user
        signin_payload = {"email": test_email, "password": test_password}
        resp = session.post(f"{BASE_URL}/api/auth/sign-in/email", json=signin_payload, headers=headers_json, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Signin failed: {resp.status_code} - {resp.text}"

        # 3. Get session to confirm authentication
        resp = session.get(f"{BASE_URL}/api/auth/get-session", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Get session failed: {resp.status_code} - {resp.text}"
        session_json = resp.json()
        assert "user" in session_json and "email" in session_json["user"] and session_json["user"]["email"] == test_email, "Session user email mismatch"

        # 4. Check initial subscription status (expect inactive or not subscribed)
        resp = session.get(f"{BASE_URL}/api/subscription/status", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Subscription status GET failed: {resp.status_code} - {resp.text}"
        status_json = resp.json()
        assert "isActive" in status_json, f"Subscription status response missing 'isActive' field: {status_json}"
        assert status_json["isActive"] is False, f"New user should not have active subscription initially: {status_json}"

        # Define protected routes to test
        protected_routes = [
            ("/api/estimates", "GET"),
            ("/api/settings", "GET"),
            ("/api/pdf/generate", "POST"),
        ]

        # 5. Access protected routes without active subscription, expect 403 Forbidden
        for path, method in protected_routes:
            if method == "GET":
                resp = session.get(f"{BASE_URL}{path}", timeout=TIMEOUT)
            else:  # POST
                resp = session.post(f"{BASE_URL}{path}", timeout=TIMEOUT)
            assert resp.status_code == 403, f"Expected 403 for protected route {method} {path} without subscription, got {resp.status_code}"

        # 6. Manually verify subscription using POST /api/subscription/verify
        # This endpoint likely activates subscription for testing
        resp = session.post(f"{BASE_URL}/api/subscription/verify", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Subscription manual verification failed: {resp.status_code} - {resp.text}"
        verify_json = resp.json()
        assert "isActive" in verify_json and verify_json["isActive"] == True, "Subscription verify response does not indicate active subscription"

        # 7. Confirm subscription status is active now via GET /api/subscription/status
        resp = session.get(f"{BASE_URL}/api/subscription/status", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Subscription status GET after verify failed: {resp.status_code} - {resp.text}"
        status_json = resp.json()
        assert status_json.get("isActive") == True, f"Subscription status is not active after verify: {status_json}"

        # 8. Access protected routes again, expect success (200 or appropriate success status)
        for path, method in protected_routes:
            if method == "GET":
                resp = session.get(f"{BASE_URL}{path}", timeout=TIMEOUT)
            else:  # POST
                # For /api/pdf/generate POST, send minimal valid payload to avoid bad request errors
                if path == "/api/pdf/generate":
                    # Provide minimal valid JSON (empty or minimal structure)
                    resp = session.post(f"{BASE_URL}{path}", json={}, timeout=TIMEOUT)
                else:
                    resp = session.post(f"{BASE_URL}{path}", timeout=TIMEOUT)
            assert resp.status_code in (200, 201), f"Expected success status for protected route {method} {path} with active subscription, got {resp.status_code}"

    finally:
        # Clean up: No user deletion endpoint described, so leaving test user in system.
        # If deletion API existed, implement here.
        # Logout session if needed
        session.close()

test_TC004_subscription_status_and_access_control()