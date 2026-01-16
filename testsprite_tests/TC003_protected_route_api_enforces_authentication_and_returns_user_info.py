import requests

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def test_protected_route_api_enforces_authentication_and_returns_user_info():
    # Helper function to authenticate and get a valid bearer token
    def get_valid_token():
        headers = {"Content-Type": "application/json"}
        test_email = "testuser@example.com"
        test_password = "TestPass123!"

        auth_signup_url = f"{BASE_URL}/api/auth/signup"
        auth_login_url = f"{BASE_URL}/api/auth/login"

        # Try signup (ignore if user exists)
        try:
            resp = requests.post(
                auth_signup_url,
                json={"email": test_email, "password": test_password},
                headers=headers,
                timeout=TIMEOUT,
            )
            if resp.status_code not in (200, 400):
                resp.raise_for_status()
        except requests.RequestException:
            pass  # Continue to login

        # Login to get token
        resp = requests.post(
            auth_login_url,
            json={"email": test_email, "password": test_password},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert resp.status_code == 200, f"Login failed with status {resp.status_code}"
        data = resp.json()
        token = data.get("token") or data.get("accessToken") or data.get("access_token")
        assert token, "Bearer token not found in login response"
        return token

    # Test case step 1: access /api/protected with valid token
    token = get_valid_token()
    headers_valid = {"Authorization": f"Bearer {token}"}
    resp_valid = requests.get(f"{BASE_URL}/api/protected", headers=headers_valid, timeout=TIMEOUT)
    assert resp_valid.status_code == 200, f"Expected 200, got {resp_valid.status_code}"
    data_valid = resp_valid.json()
    assert "user" in data_valid, "Response JSON missing 'user' field"
    user = data_valid["user"]
    assert isinstance(user, dict), "'user' should be a dict"
    assert "id" in user and isinstance(user["id"], str) and user["id"], "'user.id' missing or invalid"
    assert "email" in user and isinstance(user["email"], str) and user["email"], "'user.email' missing or invalid"
    assert "message" in data_valid and data_valid["message"] == "Protected route", "Invalid 'message' field"

    # Test case step 2: access /api/protected with no token
    resp_no_token = requests.get(f"{BASE_URL}/api/protected", timeout=TIMEOUT)
    assert resp_no_token.status_code == 401, f"Expected 401 for no token, got {resp_no_token.status_code}"
    data_no_token = resp_no_token.json()
    assert "error" in data_no_token and data_no_token["error"].lower() == "unauthorized", "Expected 'Unauthorized' error message for no token"

    # Test case step 3: access /api/protected with invalid token
    headers_invalid = {"Authorization": "Bearer InvalidToken12345"}
    resp_invalid = requests.get(f"{BASE_URL}/api/protected", headers=headers_invalid, timeout=TIMEOUT)
    assert resp_invalid.status_code == 401, f"Expected 401 for invalid token, got {resp_invalid.status_code}"
    data_invalid = resp_invalid.json()
    assert "error" in data_invalid and data_invalid["error"].lower() == "unauthorized", "Expected 'Unauthorized' error message for invalid token"


test_protected_route_api_enforces_authentication_and_returns_user_info()
