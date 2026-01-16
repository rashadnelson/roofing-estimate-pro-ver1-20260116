import requests
import uuid

BASE_URL = "http://localhost:3001"
HEADERS_JSON = {"Content-Type": "application/json"}
TIMEOUT = 30


def test_better_auth_authentication_api_handles_signup_login_and_session():
    session = requests.Session()

    # Generate unique test user email to avoid conflicts
    test_email = f"testuser_{uuid.uuid4().hex}@example.com"
    test_password = "SecurePass123!"

    signup_url = f"{BASE_URL}/api/auth/signup"
    login_url = f"{BASE_URL}/api/auth/login"
    session_url = f"{BASE_URL}/api/auth/session"

    try:
        # 1. Successful signup
        signup_payload = {"email": test_email, "password": test_password}
        signup_resp = session.post(
            signup_url, json=signup_payload, headers=HEADERS_JSON, timeout=TIMEOUT
        )
        assert signup_resp.status_code == 200, f"Signup failed: {signup_resp.text}"
        # Expect JSON response (could contain user or token info)
        signup_json = signup_resp.json()
        assert isinstance(signup_json, dict)

        # 2. Signup with existing email - expect 400 (Bad request or conflict)
        signup_dup_resp = session.post(
            signup_url, json=signup_payload, headers=HEADERS_JSON, timeout=TIMEOUT
        )
        assert signup_dup_resp.status_code in (400, 409), (
            "Duplicate signup didn't fail with 400/409: " + signup_dup_resp.text
        )

        # 3. Login with correct credentials
        login_payload = {"email": test_email, "password": test_password}
        login_resp = session.post(
            login_url, json=login_payload, headers=HEADERS_JSON, timeout=TIMEOUT
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        login_json = login_resp.json()
        assert isinstance(login_json, dict)

        # Save cookies or auth token if provided (session should handle cookies)
        # Check if session cookie or token is set (depending on implementation)
        # Here assume cookie session management

        # 4. Login with invalid credentials - expect 401 Unauthorized
        bad_login_payload = {"email": test_email, "password": "WrongPassword!"}
        bad_login_resp = session.post(
            login_url, json=bad_login_payload, headers=HEADERS_JSON, timeout=TIMEOUT
        )
        assert bad_login_resp.status_code == 401, (
            "Invalid login did not return 401: " + bad_login_resp.text
        )

        # 5. Get session info with authenticated session - expect 200
        session_resp = session.get(
            session_url, headers=HEADERS_JSON, timeout=TIMEOUT
        )
        assert session_resp.status_code == 200, (
            "Session retrieval failed: " + session_resp.text
        )
        session_json = session_resp.json()
        assert isinstance(session_json, dict)
        # Check that session info contains email or user info matching test_email
        email_in_session = session_json.get("email") or session_json.get("user", {}).get("email")
        assert email_in_session == test_email, "Session email does not match logged-in user."

        # 6. Get session info without auth - expect 401 Unauthorized or empty session
        # Use a new session without cookies
        no_auth_resp = requests.get(session_url, headers=HEADERS_JSON, timeout=TIMEOUT)
        assert no_auth_resp.status_code in (401, 400), (
            f"Unauthenticated session retrieval returned unexpected status: {no_auth_resp.status_code}"
        )

        # 7. Signup with invalid payload - expect 400 Bad Request
        invalid_payloads = [
            {},  # empty
            {"email": "not-an-email", "password": test_password},
            {"email": test_email},  # missing password
            {"password": test_password},  # missing email
            {"email": "", "password": ""},  # empty fields
        ]
        for payload in invalid_payloads:
            resp = requests.post(
                signup_url, json=payload, headers=HEADERS_JSON, timeout=TIMEOUT
            )
            assert resp.status_code == 400, (
                f"Invalid signup payload did not return 400: {payload} got {resp.status_code}"
            )

        # 8. Login with invalid payload - expect 400 Bad Request
        for payload in invalid_payloads:
            resp = requests.post(
                login_url, json=payload, headers=HEADERS_JSON, timeout=TIMEOUT
            )
            # Expect 400 or 401 (depending on how missing fields are handled)
            assert resp.status_code in (400, 401), (
                f"Invalid login payload returned unexpected status: {resp.status_code}, payload: {payload}"
            )

    finally:
        # Cleanup: If there was an API to delete user, call it here.
        # Since not specified in PRD, no deletion step.
        pass


test_better_auth_authentication_api_handles_signup_login_and_session()
