import requests
import io
import uuid
import os

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def test_user_settings_api_routes_handle_retrieval_and_updates_with_auth_and_file_validation():
    session = requests.Session()

    # Helper function to sign up a user
    def sign_up(email, password, name):
        url = f"{BASE_URL}/api/auth/sign-up/email"
        payload = {
            "email": email,
            "password": password,
            "name": name
        }
        resp = session.post(url, json=payload, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Sign up failed: {resp.text}"

    # Helper function to sign in a user
    def sign_in(email, password):
        url = f"{BASE_URL}/api/auth/sign-in/email"
        payload = {
            "email": email,
            "password": password
        }
        resp = session.post(url, json=payload, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Sign in failed: {resp.text}"

    # Helper function to activate subscription
    def activate_subscription():
        url = f"{BASE_URL}/api/test/activate-subscription"
        resp = session.post(url, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Subscription activation failed: {resp.text}"

    # Generate unique email for testing to avoid collisions
    user_email = f"test.user.{uuid.uuid4()}@example.com"
    user_password = "TestPass123!"
    user_name = "Test User"

    # Sign up user
    sign_up(user_email, user_password, user_name)

    # Sign in user
    sign_in(user_email, user_password)

    # Test unauthenticated request returns 401 on GET /api/settings
    unauth_session = requests.Session()
    r_unauth_get = unauth_session.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
    assert r_unauth_get.status_code == 401, f"Expected 401 for unauthenticated GET, got {r_unauth_get.status_code}"

    # Test unauthenticated request returns 401 on PUT /api/settings
    r_unauth_put = unauth_session.put(f"{BASE_URL}/api/settings", json={}, timeout=TIMEOUT)
    assert r_unauth_put.status_code == 401, f"Expected 401 for unauthenticated PUT, got {r_unauth_put.status_code}"

    # Test access before subscription activated returns 403
    r_get_before_sub = session.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
    assert r_get_before_sub.status_code == 403, f"Expected 403 before subscription on GET, got {r_get_before_sub.status_code}"

    r_put_before_sub = session.put(f"{BASE_URL}/api/settings", json={"companyName": "Any"}, timeout=TIMEOUT)
    assert r_put_before_sub.status_code == 403, f"Expected 403 before subscription on PUT, got {r_put_before_sub.status_code}"

    # Activate subscription
    activate_subscription()

    # Now test GET /api/settings returns default settings if none exist
    r_get = session.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
    assert r_get.status_code == 200, f"GET /api/settings failed: {r_get.status_code}"
    data = r_get.json()
    assert "settings" in data and isinstance(data["settings"], dict), "GET /api/settings missing 'settings'"
    settings = data["settings"]
    assert "userId" in settings, "Settings missing 'userId'"
    assert "companyName" in settings, "Settings missing 'companyName'"
    assert "companyLogo" in settings, "Settings missing 'companyLogo'"

    user_id = settings["userId"]

    # Test PUT /api/settings with JSON - update companyName only
    company_name_valid = "A" * 255
    payload_valid = {"companyName": company_name_valid}
    r_put_valid = session.put(f"{BASE_URL}/api/settings", json=payload_valid, timeout=TIMEOUT)
    assert r_put_valid.status_code == 200, f"PUT valid settings failed: {r_put_valid.status_code}"
    data_put_valid = r_put_valid.json()
    assert "settings" in data_put_valid and isinstance(data_put_valid["settings"], dict), "PUT valid response missing settings"
    s = data_put_valid["settings"]
    assert s.get("companyName") == company_name_valid, "PUT valid companyName incorrect"

    # Test PUT /api/settings with multipart/form-data - upload logo file
    # Create a small PNG image file (1x1 transparent PNG)
    png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82'
    logo_file = io.BytesIO(png_data)
    logo_file.name = "test-logo.png"
    
    # Upload logo with multipart/form-data
    files = {"companyLogo": ("test-logo.png", logo_file, "image/png")}
    data_form = {"companyName": "Test Company"}
    r_put_logo = session.put(f"{BASE_URL}/api/settings", files=files, data=data_form, timeout=TIMEOUT)
    assert r_put_logo.status_code == 200, f"PUT logo upload failed: {r_put_logo.status_code}"
    data_logo = r_put_logo.json()
    assert "settings" in data_logo, "PUT logo response missing settings"
    s_logo = data_logo["settings"]
    assert s_logo.get("companyName") == "Test Company", "Company name not updated with logo"
    assert s_logo.get("companyLogo") is not None, "Logo URL not returned"
    assert s_logo.get("companyLogo").startswith("/uploads/"), f"Logo URL should start with /uploads/, got {s_logo.get('companyLogo')}"
    
    logo_url = s_logo.get("companyLogo")

    # Verify logo file exists and is accessible
    r_logo_file = requests.get(f"{BASE_URL}{logo_url}", timeout=TIMEOUT)
    assert r_logo_file.status_code == 200, f"Logo file not accessible at {logo_url}"
    assert r_logo_file.headers.get("content-type") in ["image/png", "image/png; charset=utf-8"], "Logo file content type incorrect"

    # Test validation: empty companyName (400) - JSON
    payload_empty_name = {"companyName": ""}
    r_put_empty_name = session.put(f"{BASE_URL}/api/settings", json=payload_empty_name, timeout=TIMEOUT)
    assert r_put_empty_name.status_code == 400, f"Expected 400 for empty companyName, got {r_put_empty_name.status_code}"

    # Test validation: companyName too long (>255 chars) - JSON
    payload_long_name = {"companyName": "A" * 256}
    r_put_long_name = session.put(f"{BASE_URL}/api/settings", json=payload_long_name, timeout=TIMEOUT)
    assert r_put_long_name.status_code == 400, f"Expected 400 for too long companyName, got {r_put_long_name.status_code}"

    # Test validation: invalid file type (not PNG, JPEG, WebP)
    gif_data = b'GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00;'
    invalid_file = io.BytesIO(gif_data)
    invalid_file.name = "test.gif"
    files_invalid_type = {"companyLogo": ("test.gif", invalid_file, "image/gif")}
    r_put_invalid_type = session.put(f"{BASE_URL}/api/settings", files=files_invalid_type, timeout=TIMEOUT)
    assert r_put_invalid_type.status_code == 400, f"Expected 400 for invalid file type, got {r_put_invalid_type.status_code}"

    # Test validation: file too large (>2MB)
    large_file_data = b"0" * (2 * 1024 * 1024 + 1)  # 2MB + 1 byte
    large_file = io.BytesIO(large_file_data)
    large_file.name = "large.png"
    files_too_large = {"companyLogo": ("large.png", large_file, "image/png")}
    r_put_too_large = session.put(f"{BASE_URL}/api/settings", files=files_too_large, timeout=TIMEOUT)
    assert r_put_too_large.status_code == 400, f"Expected 400 for file too large, got {r_put_too_large.status_code}"

    # Test updating logo URL via JSON (removing logo by setting to null)
    r_remove_logo = session.put(f"{BASE_URL}/api/settings", json={"companyLogo": None}, timeout=TIMEOUT)
    assert r_remove_logo.status_code == 200, f"Remove logo failed: {r_remove_logo.status_code}"
    data_remove = r_remove_logo.json()
    assert data_remove["settings"].get("companyLogo") is None, "Logo should be removed"

    # Test authentication required on GET and PUT by clearing session cookies
    session_cleared = requests.Session()
    r_get_no_auth = session_cleared.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
    assert r_get_no_auth.status_code == 401, f"Expected 401 for GET no auth, got {r_get_no_auth.status_code}"
    r_put_no_auth = session_cleared.put(f"{BASE_URL}/api/settings", json={"companyName": "Test"}, timeout=TIMEOUT)
    assert r_put_no_auth.status_code == 401, f"Expected 401 for PUT no auth, got {r_put_no_auth.status_code}"

    # Test subscription required: create new user w/o subscription
    session2 = requests.Session()
    user2_email = f"test.user2.{uuid.uuid4()}@example.com"
    user2_password = "Pass1234!"
    user2_name = "User Two"
    ## sign up user 2
    resp_su2 = session2.post(f"{BASE_URL}/api/auth/sign-up/email",
                             json={"email": user2_email, "password": user2_password, "name": user2_name},
                             timeout=TIMEOUT)
    assert resp_su2.status_code == 200, f"User2 sign-up failed: {resp_su2.text}"
    resp_si2 = session2.post(f"{BASE_URL}/api/auth/sign-in/email",
                             json={"email": user2_email, "password": user2_password},
                             timeout=TIMEOUT)
    assert resp_si2.status_code == 200, f"User2 sign-in failed: {resp_si2.text}"

    # User 2 tries GET settings without subscription (should get 403)
    r2_get = session2.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
    assert r2_get.status_code == 403, f"Expected 403 for user2 GET without subscription, got {r2_get.status_code}"
    # User 2 tries PUT settings without subscription (403)
    r2_put = session2.put(f"{BASE_URL}/api/settings", json={"companyName": "Test"}, timeout=TIMEOUT)
    assert r2_put.status_code == 403, f"Expected 403 for user2 PUT without subscription, got {r2_put.status_code}"

    # Activate subscription for user 2
    resp_sub2 = session2.post(f"{BASE_URL}/api/test/activate-subscription", timeout=TIMEOUT)
    assert resp_sub2.status_code == 200, f"User2 subscription activation failed: {resp_sub2.text}"

    # User 2 GET settings: should succeed and create default settings
    r2_get_after_sub = session2.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
    assert r2_get_after_sub.status_code == 200, f"User2 GET after subscription failed: {r2_get_after_sub.status_code}"
    settings2 = r2_get_after_sub.json().get("settings", {})
    user2_id = settings2.get("userId")
    assert user2_id, "User2 settings missing userId"

    # Verify user1's and user2's settings are distinct
    assert user_id != user2_id, "User settings userId collision - should be distinct users"

    # User2 update settings with valid data (JSON)
    company_name_2 = "User2 Company"
    r2_put_valid = session2.put(f"{BASE_URL}/api/settings",
                               json={"companyName": company_name_2},
                               timeout=TIMEOUT)
    assert r2_put_valid.status_code == 200, f"User2 PUT valid settings failed: {r2_put_valid.status_code}"
    s2 = r2_put_valid.json().get("settings", {})
    assert s2.get("companyName") == company_name_2

    # User2 upload logo
    logo_file_2 = io.BytesIO(png_data)
    logo_file_2.name = "user2-logo.png"
    files_2 = {"companyLogo": ("user2-logo.png", logo_file_2, "image/png")}
    r2_put_logo = session2.put(f"{BASE_URL}/api/settings", files=files_2, timeout=TIMEOUT)
    assert r2_put_logo.status_code == 200, f"User2 logo upload failed: {r2_put_logo.status_code}"
    logo_url_2 = r2_put_logo.json()["settings"].get("companyLogo")
    assert logo_url_2 is not None and logo_url_2.startswith("/uploads/"), "User2 logo URL invalid"

    # Verify user1 cannot see user2's settings
    r1_get_latest = session.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
    settings1_latest = r1_get_latest.json().get("settings", {})
    # User1's companyName should not match user2's companyName
    assert settings1_latest.get("companyName") != company_name_2, "User1 sees user2's settings, violation of user scope"

    # Verify user2 cannot see user1's settings
    r2_get_latest = session2.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
    settings2_latest = r2_get_latest.json().get("settings", {})
    assert settings2_latest.get("companyName") == company_name_2, "User2 settings changed unexpectedly"
    assert settings2_latest.get("companyLogo") == logo_url_2, "User2 logo changed unexpectedly"

    # Test updating companyName via multipart/form-data without logo
    data_name_only = {"companyName": "Updated Name"}
    r_update_name_multipart = session.put(f"{BASE_URL}/api/settings", data=data_name_only, timeout=TIMEOUT)
    assert r_update_name_multipart.status_code == 200, f"Update name via multipart failed: {r_update_name_multipart.status_code}"
    assert r_update_name_multipart.json()["settings"].get("companyName") == "Updated Name"

    # Test JPEG file upload
    jpeg_data = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xaa\xff\xd9'
    jpeg_file = io.BytesIO(jpeg_data)
    jpeg_file.name = "test.jpg"
    files_jpeg = {"companyLogo": ("test.jpg", jpeg_file, "image/jpeg")}
    r_put_jpeg = session.put(f"{BASE_URL}/api/settings", files=files_jpeg, timeout=TIMEOUT)
    assert r_put_jpeg.status_code == 200, f"JPEG upload failed: {r_put_jpeg.status_code}"
    jpeg_url = r_put_jpeg.json()["settings"].get("companyLogo")
    assert jpeg_url is not None and jpeg_url.startswith("/uploads/"), "JPEG URL invalid"

    print("✅ All tests passed!")

test_user_settings_api_routes_handle_retrieval_and_updates_with_auth_and_file_validation()
