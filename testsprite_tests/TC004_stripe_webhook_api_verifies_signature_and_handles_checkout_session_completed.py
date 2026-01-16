"""
Test TC004: Stripe Webhook API Signature Verification and Checkout Session Handling

This test verifies Task #4 implementation:
- Webhook signature verification using stripe.webhooks.constructEvent()
- Handling of checkout.session.completed events
- User subscription status updates
- Error handling for various scenarios

SETUP REQUIRED:
1. Ensure your server is running on http://localhost:3001
2. Set STRIPE_WEBHOOK_SECRET environment variable to match your server's webhook secret:
   
   Windows PowerShell:
   $env:STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
   
   Windows CMD:
   set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   
   Linux/Mac:
   export STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

3. For development, get the webhook secret from Stripe CLI:
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   (Copy the "whsec_..." secret from the output)

4. The webhook secret must match STRIPE_WEBHOOK_SECRET in your server's .env file
"""

import requests
import json
import hmac
import hashlib
import time
import os

BASE_URL = "http://localhost:3001"
WEBHOOK_ENDPOINT = "/api/webhooks/stripe"
WEBHOOK_URL = BASE_URL + WEBHOOK_ENDPOINT
TIMEOUT = 30

# Test user setup using Better-Auth endpoints
# Note: User verification requires database access or protected route
# For this test, we'll create users via Better-Auth signup


def create_test_user(email, password="TestPassword123!", name="Test User"):
    # Create user using Better-Auth signup endpoint
    resp = requests.post(
        f"{BASE_URL}/api/auth/sign-up/email",
        json={"email": email, "password": password, "name": name},
        timeout=TIMEOUT,
    )
    resp.raise_for_status()
    # Better-Auth returns user data, extract user ID if available
    user_data = resp.json()
    # Note: Better-Auth response structure may vary, adjust as needed
    return user_data.get("user", {}).get("id") or email


def verify_user_subscription_via_protected_route(email, password="TestPassword123!"):
    # Login to get session cookie
    login_resp = requests.post(
        f"{BASE_URL}/api/auth/sign-in/email",
        json={"email": email, "password": password},
        timeout=TIMEOUT,
    )
    if login_resp.status_code != 200:
        return None
    
    # Get session cookies
    cookies = login_resp.cookies
    
    # Access protected route to verify user exists
    # Note: Protected route doesn't return subscription_status, 
    # so we can only verify user exists, not subscription status
    protected_resp = requests.get(
        f"{BASE_URL}/api/protected",
        cookies=cookies,
        timeout=TIMEOUT,
    )
    if protected_resp.status_code == 200:
        return protected_resp.json().get("user")
    return None


def sign_stripe_payload(payload: bytes, secret: str, timestamp: int = None) -> str:
    if timestamp is None:
        timestamp = int(time.time())
    signed_payload = f"{timestamp}.{payload.decode()}"
    signature = hmac.new(secret.encode(), signed_payload.encode(), hashlib.sha256).hexdigest()
    header = f"t={timestamp},v1={signature}"
    return header


def test_tc004_stripe_webhook_signature_and_checkout_session():
    # Environment setup
    # Read webhook secret from environment variable (matches server STRIPE_WEBHOOK_SECRET)
    # For development: Get from Stripe CLI output: stripe listen --forward-to localhost:3001/api/webhooks/stripe
    stripe_webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "whsec_testsecret123")
    
    if stripe_webhook_secret == "whsec_testsecret123":
        print("⚠️  WARNING: Using default test secret. Set STRIPE_WEBHOOK_SECRET environment variable to match your server's webhook secret.")
        print("   For development: Use the secret from 'stripe listen' command output")
    
    if not stripe_webhook_secret or not stripe_webhook_secret.startswith("whsec_"):
        raise ValueError(
            f"Invalid STRIPE_WEBHOOK_SECRET: {stripe_webhook_secret}. "
            "Must start with 'whsec_' and match the server's STRIPE_WEBHOOK_SECRET environment variable."
        )
    
    test_email = f"testuser_{int(time.time())}@example.com"  # Unique email to avoid conflicts
    test_password = "TestPassword123!"
    test_stripe_session_id = "cs_test_1234567890"

    # Prepare test user
    user_id = None
    try:
        # Create test user via Better-Auth signup (default subscription_status is "pending")
        user_id = create_test_user(test_email, test_password)

        # Prepare webhook payload for checkout.session.completed event
        webhook_payload = {
            "id": "evt_test_checkout_session_completed",
            "object": "event",
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": test_stripe_session_id,
                    "object": "checkout.session",
                    "customer_email": test_email,
                    # other session data omitted for brevity
                }
            }
        }
        payload_bytes = json.dumps(webhook_payload).encode()

        # 1) Success case: valid signature, valid payload, user exists
        sig_header = sign_stripe_payload(payload_bytes, stripe_webhook_secret)
        headers = {
            "Stripe-Signature": sig_header,
            "Content-Type": "application/json",
        }
        resp = requests.post(
            WEBHOOK_URL, data=payload_bytes, headers=headers, timeout=TIMEOUT
        )
        assert resp.status_code == 200, f"Expected 200 got {resp.status_code}: {resp.text}"
        resp_json = resp.json()
        assert "received" in resp_json or "message" in resp_json, f"Response missing received/message: {resp_json}"
        
        # Verify response contains expected fields
        if "message" in resp_json:
            assert "Subscription activated" in resp_json["message"] or "activated" in resp_json["message"].lower()
        if "userId" in resp_json:
            assert resp_json["userId"] is not None
        if "email" in resp_json:
            assert resp_json["email"] == test_email

        # Note: Subscription status verification requires database access or a new endpoint
        # For now, we verify the webhook response indicates success
        # Manual verification: Check database or use Stripe Dashboard to verify subscription_status updated

        # 2) Error case: missing Stripe-Signature header (400)
        headers_bad = {
            "Content-Type": "application/json",
        }
        resp_bad_sig = requests.post(
            WEBHOOK_URL, data=payload_bytes, headers=headers_bad, timeout=TIMEOUT
        )
        assert resp_bad_sig.status_code == 400, f"Expected 400 missing signature got {resp_bad_sig.status_code}"
        resp_bad_json = resp_bad_sig.json()
        assert "error" in resp_bad_json, "Error message missing with missing signature"

        # 3) Error case: invalid signature (400)
        invalid_sig_header = "t=1234567890,v1=invalidsignature"
        headers_invalid = {
            "Stripe-Signature": invalid_sig_header,
            "Content-Type": "application/json",
        }
        resp_invalid_sig = requests.post(
            WEBHOOK_URL, data=payload_bytes, headers=headers_invalid, timeout=TIMEOUT
        )
        assert resp_invalid_sig.status_code == 400, f"Expected 400 invalid signature got {resp_invalid_sig.status_code}"
        resp_invalid_json = resp_invalid_sig.json()
        assert "error" in resp_invalid_json, "Error message missing with invalid signature"

        # 4) Error case: missing webhook secret config (simulate by sending a request with wrong secret env is tough from client)
        # So simulate by sending with payload that triggers internal error or using special header if API supports, else skip this test
        # We'll try sending a special header X-Strip-Webhook-Secret: empty to simulate missing secret scenario (only if server supports)
        # Otherwise can't simulate from client side; skip.

        # 5) Error case: user not found (404)
        webhook_payload_no_user = {
            "id": "evt_test_checkout_session_completed_no_user",
            "object": "event",
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": test_stripe_session_id,
                    "object": "checkout.session",
                    "customer_email": "nonexistentuser@example.com",
                }
            }
        }
        payload_no_user_bytes = json.dumps(webhook_payload_no_user).encode()
        sig_header_no_user = sign_stripe_payload(payload_no_user_bytes, stripe_webhook_secret)
        headers_no_user = {
            "Stripe-Signature": sig_header_no_user,
            "Content-Type": "application/json",
        }
        resp_no_user = requests.post(
            WEBHOOK_URL, data=payload_no_user_bytes, headers=headers_no_user, timeout=TIMEOUT
        )
        assert resp_no_user.status_code == 404, f"Expected 404 user not found got {resp_no_user.status_code}"
        resp_no_user_json = resp_no_user.json()
        assert "error" in resp_no_user_json, "Error message missing user not found case"

        # 6) Error case: missing customer_email (400)
        webhook_payload_no_email = {
            "id": "evt_test_checkout_session_completed_no_email",
            "object": "event",
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": test_stripe_session_id,
                    "object": "checkout.session",
                    # missing customer_email
                }
            }
        }
        payload_no_email_bytes = json.dumps(webhook_payload_no_email).encode()
        sig_header_no_email = sign_stripe_payload(payload_no_email_bytes, stripe_webhook_secret)
        headers_no_email = {
            "Stripe-Signature": sig_header_no_email,
            "Content-Type": "application/json",
        }
        resp_no_email = requests.post(
            WEBHOOK_URL, data=payload_no_email_bytes, headers=headers_no_email, timeout=TIMEOUT
        )
        assert resp_no_email.status_code == 400, f"Expected 400 missing customer_email got {resp_no_email.status_code}"
        resp_no_email_json = resp_no_email.json()
        assert "error" in resp_no_email_json, "Error message missing for missing customer_email"

    finally:
        # Note: User cleanup would require a delete endpoint or manual database cleanup
        # For now, test users remain in database (can be cleaned up manually if needed)
        pass


test_tc004_stripe_webhook_signature_and_checkout_session()