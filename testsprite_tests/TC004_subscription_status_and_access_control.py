import requests
import uuid

BASE_URL = "http://localhost:3001"
TIMEOUT = 30


def test_subscription_status_and_access_control():
    """
    Test Task #12: Subscription Status and Access Control
    
    Tests:
    1. GET /api/subscription/status - Returns subscription status for authenticated user
    2. POST /api/subscription/verify - Manual subscription verification
    3. Protected routes (estimates, settings) require active subscription
    4. Returns 403 for users without active subscription
    """
    session = requests.Session()
    user_email = f"testsubscription_{uuid.uuid4().hex[:8]}@example.com"
    user_password = "TestPass123!"
    user_name = "Test Subscription User"

    headers_json = {"Content-Type": "application/json", "Accept": "application/json"}

    # Step 1: Sign up a new user
    signup_payload = {
        "email": user_email,
        "password": user_password,
        "name": user_name
    }
    signup_resp = session.post(
        f"{BASE_URL}/api/auth/sign-up/email",
        json=signup_payload,
        headers=headers_json,
        timeout=TIMEOUT,
    )
    assert signup_resp.status_code == 200, f"Signup failed: {signup_resp.status_code} - {signup_resp.text}"
    print(f"✅ Signup successful for {user_email}")

    # Step 2: Log in user
    login_payload = {"email": user_email, "password": user_password}
    login_resp = session.post(
        f"{BASE_URL}/api/auth/sign-in/email",
        json=login_payload,
        headers=headers_json,
        timeout=TIMEOUT,
    )
    assert login_resp.status_code == 200, f"Login failed: {login_resp.status_code} - {login_resp.text}"
    print(f"✅ Login successful for {user_email}")

    # Step 3: Test GET /api/subscription/status (requires auth)
    status_resp = session.get(
        f"{BASE_URL}/api/subscription/status",
        headers=headers_json,
        timeout=TIMEOUT,
    )
    assert status_resp.status_code == 200, f"Subscription status failed: {status_resp.status_code} - {status_resp.text}"
    status_json = status_resp.json()
    
    # Verify response structure
    assert "subscriptionStatus" in status_json, "Missing subscriptionStatus in response"
    assert "isActive" in status_json, "Missing isActive in response"
    assert "userId" in status_json, "Missing userId in response"
    assert "email" in status_json, "Missing email in response"
    
    # New users should have pending subscription
    assert status_json["subscriptionStatus"] == "pending", f"Expected 'pending' status, got: {status_json['subscriptionStatus']}"
    assert status_json["isActive"] == False, f"Expected isActive=False for new user"
    assert status_json["email"] == user_email, f"Email mismatch in subscription status"
    print(f"✅ Subscription status returned correctly: {status_json['subscriptionStatus']}")

    # Step 4: Test subscription status without auth (should return 401)
    unauth_status_resp = requests.get(
        f"{BASE_URL}/api/subscription/status",
        headers=headers_json,
        timeout=TIMEOUT,
    )
    assert unauth_status_resp.status_code == 401, f"Expected 401 for unauthenticated subscription status, got {unauth_status_resp.status_code}"
    print(f"✅ Subscription status correctly requires authentication")

    # Step 5: Test POST /api/subscription/verify (manual verification)
    verify_resp = session.post(
        f"{BASE_URL}/api/subscription/verify",
        headers=headers_json,
        timeout=TIMEOUT,
    )
    assert verify_resp.status_code == 200, f"Subscription verify failed: {verify_resp.status_code} - {verify_resp.text}"
    verify_json = verify_resp.json()
    
    # Verify response structure
    assert "message" in verify_json, "Missing message in verify response"
    assert "subscriptionStatus" in verify_json, "Missing subscriptionStatus in verify response"
    assert "isActive" in verify_json, "Missing isActive in verify response"
    
    # Without Stripe payment, should indicate requires payment
    assert verify_json["isActive"] == False, "Should not be active without payment"
    print(f"✅ Subscription verify returned: {verify_json['message']}")

    # Step 6: Test protected routes require subscription (GET /api/estimates should return 403)
    estimates_resp = session.get(
        f"{BASE_URL}/api/estimates",
        headers=headers_json,
        timeout=TIMEOUT,
    )
    assert estimates_resp.status_code == 403, f"Expected 403 for user without subscription, got {estimates_resp.status_code}"
    estimates_json = estimates_resp.json()
    assert "error" in estimates_json, "Missing error in 403 response"
    assert "Subscription required" in estimates_json.get("error", ""), f"Expected 'Subscription required' error, got: {estimates_json.get('error')}"
    print(f"✅ Estimates API correctly requires subscription (403)")

    # Step 7: Test settings API requires subscription (GET /api/settings should return 403)
    settings_resp = session.get(
        f"{BASE_URL}/api/settings",
        headers=headers_json,
        timeout=TIMEOUT,
    )
    assert settings_resp.status_code == 403, f"Expected 403 for user without subscription on settings, got {settings_resp.status_code}"
    print(f"✅ Settings API correctly requires subscription (403)")

    # Step 8: Test PDF generation requires subscription
    pdf_resp = session.post(
        f"{BASE_URL}/api/pdf/generate",
        json={"estimateId": 1},
        headers=headers_json,
        timeout=TIMEOUT,
    )
    assert pdf_resp.status_code == 403, f"Expected 403 for PDF generation without subscription, got {pdf_resp.status_code}"
    print(f"✅ PDF generation correctly requires subscription (403)")

    # Step 9: Activate subscription using test endpoint (development only)
    activate_resp = session.post(
        f"{BASE_URL}/api/test/activate-subscription",
        headers=headers_json,
        timeout=TIMEOUT,
    )
    if activate_resp.status_code == 200:
        activate_json = activate_resp.json()
        assert activate_json.get("subscriptionStatus") == "active", "Subscription should be active after activation"
        print(f"✅ Test subscription activation successful")
        
        # Step 10: Verify subscription is now active
        status_resp2 = session.get(
            f"{BASE_URL}/api/subscription/status",
            headers=headers_json,
            timeout=TIMEOUT,
        )
        assert status_resp2.status_code == 200
        status_json2 = status_resp2.json()
        assert status_json2["subscriptionStatus"] == "active", f"Expected 'active' status after activation"
        assert status_json2["isActive"] == True, "isActive should be True after activation"
        print(f"✅ Subscription status updated to active")

        # Step 11: Test that protected routes now work
        estimates_resp2 = session.get(
            f"{BASE_URL}/api/estimates",
            headers=headers_json,
            timeout=TIMEOUT,
        )
        assert estimates_resp2.status_code == 200, f"Estimates should work with active subscription, got {estimates_resp2.status_code}"
        print(f"✅ Estimates API accessible with active subscription")
        
        settings_resp2 = session.get(
            f"{BASE_URL}/api/settings",
            headers=headers_json,
            timeout=TIMEOUT,
        )
        assert settings_resp2.status_code == 200, f"Settings should work with active subscription, got {settings_resp2.status_code}"
        print(f"✅ Settings API accessible with active subscription")
    else:
        print(f"⚠️ Test activation endpoint not available (status: {activate_resp.status_code}) - skipping activation tests")

    print("\n✅ All subscription status and access control tests passed!")


test_subscription_status_and_access_control()
