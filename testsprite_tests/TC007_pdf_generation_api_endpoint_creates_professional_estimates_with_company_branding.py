import requests
import re
import io

try:
    from PyPDF2 import PdfReader
except ImportError:
    import subprocess
    import sys

    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    from PyPDF2 import PdfReader

BASE_URL = "http://localhost:3001"
TIMEOUT = 30


def test_pdf_generation_api_endpoint_creates_professional_estimates_with_company_branding():
    session = requests.Session()
    headers = {"Content-Type": "application/json"}

    # 1. Sign up new user
    signup_data = {
        "email": "testuser_tc007@example.com",
        "password": "StrongPassw0rd!",
        "name": "Test User TC007"
    }
    r = session.post(f"{BASE_URL}/api/auth/sign-up/email", json=signup_data, timeout=TIMEOUT)
    assert r.status_code == 200, f"Signup failed: {r.status_code} {r.text}"

    # 2. Sign in user
    signin_data = {
        "email": signup_data["email"],
        "password": signup_data["password"]
    }
    r = session.post(f"{BASE_URL}/api/auth/sign-in/email", json=signin_data, timeout=TIMEOUT)
    assert r.status_code == 200, f"Signin failed: {r.status_code} {r.text}"

    # 3. Activate subscription for the user
    r = session.post(f"{BASE_URL}/api/test/activate-subscription", timeout=TIMEOUT)
    assert r.status_code == 200, f"Subscription activation failed: {r.status_code} {r.text}"

    created_estimate_id = None

    # Helper to sanitize estimate title for filename matching
    def sanitize_filename(text):
        return re.sub(r'[^A-Za-z0-9_-]', '_', text)

    try:
        # 4. Create an estimate to own and test PDF generation
        # We create the estimate via POST /api/estimates (not documented but assuming)
        # Since creation is necessary, try to create an estimate with clientName, items etc.
        estimate_payload = {
            "title": "Professional Estimate TC007",
            "clientName": "John Doe",
            "clientPhone": "123-456-7890",
            "clientAddress": "123 Plumbing St, Pipe City, PC 12345",
            "items": [
                {
                    "description": "Pipe Replacement",
                    "quantity": 2,
                    "unitPrice": 150.00,
                    "type": "material"
                },
                {
                    "description": "Labor Charge",
                    "quantity": 3,
                    "unitPrice": 50.00,
                    "type": "labor"
                }
            ]
        }
        # We must create estimate using POST /api/estimates
        r = session.post(f"{BASE_URL}/api/estimates", json=estimate_payload, timeout=TIMEOUT)
        assert r.status_code == 200, f"Estimate creation failed: {r.status_code} {r.text}"
        estimate = r.json().get("estimate")
        assert estimate and isinstance(estimate.get("id"), int), "Estimate id missing in creation response"
        created_estimate_id = estimate["id"]

        # 5. Upload company logo and set company name (to test branding)
        # Assuming PUT /api/settings to update company settings
        logo_payload = {
            "companyName": "PlumbPro Inc.",
            # For logo we assume an image file upload endpoint, but lacking details,
            # we skip actual upload and rely on companyName setting only.
        }
        # Update company name setting
        r = session.put(f"{BASE_URL}/api/settings", json=logo_payload, timeout=TIMEOUT)
        assert r.status_code == 200, f"Settings update failed: {r.status_code} {r.text}"

        # 6. Test error cases first

        # 6a. Unauthenticated request -> POST /api/pdf/generate without session
        r = requests.post(f"{BASE_URL}/api/pdf/generate", json={"estimateId": created_estimate_id}, timeout=TIMEOUT)
        assert r.status_code == 401, f"Unauthenticated request should fail with 401, got {r.status_code}"

        # 6b. Missing estimateId
        r = session.post(f"{BASE_URL}/api/pdf/generate", json={}, timeout=TIMEOUT)
        assert r.status_code == 400, f"Missing estimateId should fail with 400, got {r.status_code}"

        # 6c. Non-numeric estimateId
        r = session.post(f"{BASE_URL}/api/pdf/generate", json={"estimateId": "abc"}, timeout=TIMEOUT)
        assert r.status_code == 400, f"Non-numeric estimateId should fail with 400, got {r.status_code}"

        # 6d. Invalid (negative) estimateId
        r = session.post(f"{BASE_URL}/api/pdf/generate", json={"estimateId": -1}, timeout=TIMEOUT)
        # Could be 400 due to invalid id or 404 if not found
        assert r.status_code in (400, 404), f"Invalid estimateId should fail with 400 or 404, got {r.status_code}"

        # 6e. Estimate not found - large unused estimate id
        r = session.post(f"{BASE_URL}/api/pdf/generate", json={"estimateId": 99999999}, timeout=TIMEOUT)
        assert r.status_code == 404, f"Non-existent estimateId should fail with 404, got {r.status_code}"

        # 6f. Estimate belongs to different user
        # Create second user and create their estimate
        second_session = requests.Session()

        second_signup_data = {
            "email": "otheruser_tc007@example.com",
            "password": "StrongPassw0rd!",
            "name": "Other User"
        }
        r2 = second_session.post(f"{BASE_URL}/api/auth/sign-up/email", json=second_signup_data, timeout=TIMEOUT)
        assert r2.status_code == 200

        r2 = second_session.post(f"{BASE_URL}/api/auth/sign-in/email", json={
            "email": second_signup_data["email"],
            "password": second_signup_data["password"]
        }, timeout=TIMEOUT)
        assert r2.status_code == 200

        r2 = second_session.post(f"{BASE_URL}/api/test/activate-subscription", timeout=TIMEOUT)
        assert r2.status_code == 200

        estimate_payload2 = {
            "title": "Other User Estimate",
            "clientName": "Jane Smith",
            "clientPhone": "987-654-3210",
            "clientAddress": "456 Faucet Ave, Water Town, WT 67890",
            "items": [
                {
                    "description": "Equipment Rental",
                    "quantity": 1,
                    "unitPrice": 200.00,
                    "type": "equipment"
                }
            ]
        }
        r2 = second_session.post(f"{BASE_URL}/api/estimates", json=estimate_payload2, timeout=TIMEOUT)
        assert r2.status_code == 200
        estimate2 = r2.json().get("estimate")
        assert estimate2 and isinstance(estimate2.get("id"), int)
        other_estimate_id = estimate2["id"]

        # Try to generate PDF for other user's estimate with first user's session
        r = session.post(f"{BASE_URL}/api/pdf/generate", json={"estimateId": other_estimate_id}, timeout=TIMEOUT)
        assert r.status_code == 404, f"Accessing other's estimate should return 404, got {r.status_code}"

        # 6g. Inactive subscription (simulate by creating new user without activating subscription)
        inactive_session = requests.Session()
        inactive_signup_data = {
            "email": "inactiveuser_tc007@example.com",
            "password": "StrongPassw0rd!",
            "name": "Inactive User"
        }
        r = inactive_session.post(f"{BASE_URL}/api/auth/sign-up/email", json=inactive_signup_data, timeout=TIMEOUT)
        assert r.status_code == 200
        r = inactive_session.post(f"{BASE_URL}/api/auth/sign-in/email", json={
            "email": inactive_signup_data["email"],
            "password": inactive_signup_data["password"]
        }, timeout=TIMEOUT)
        assert r.status_code == 200

        # Create an estimate under inactive user
        estimate_payload_inactive = {
            "title": "Inactive User Estimate",
            "clientName": "Inactive Client",
            "clientPhone": "000-000-0000",
            "clientAddress": "Nowhere",
            "items": [
                {
                    "description": "Test Item",
                    "quantity": 1,
                    "unitPrice": 10.00,
                    "type": "material"
                }
            ]
        }
        r = inactive_session.post(f"{BASE_URL}/api/estimates", json=estimate_payload_inactive, timeout=TIMEOUT)
        assert r.status_code == 200
        estimate_inactive = r.json().get("estimate")
        assert estimate_inactive and isinstance(estimate_inactive.get("id"), int)
        inactive_estimate_id = estimate_inactive["id"]

        r = inactive_session.post(f"{BASE_URL}/api/pdf/generate", json={"estimateId": inactive_estimate_id}, timeout=TIMEOUT)
        assert r.status_code == 403, f"Inactive subscription should get 403, got {r.status_code}"

        # 7. Successful PDF generation
        r = session.post(f"{BASE_URL}/api/pdf/generate", json={"estimateId": created_estimate_id}, timeout=TIMEOUT)
        assert r.status_code == 200, f"PDF generation failed: {r.status_code} {r.text}"
        assert r.headers.get("Content-Type") == "application/pdf", "Content-Type is not application/pdf"

        content_disp = r.headers.get("Content-Disposition")
        assert content_disp, "Content-Disposition header missing"
        # Expected format: estimate_{sanitized_title}_{id}.pdf
        title_sanitized = sanitize_filename(estimate["title"])
        expected_filename = f"estimate_{title_sanitized}_{created_estimate_id}.pdf"
        assert expected_filename in content_disp, f"Filename {expected_filename} not in Content-Disposition: {content_disp}"

        pdf_content = r.content
        assert pdf_content.startswith(b"%PDF"), "PDF file signature missing"

        # Parse PDF and verify content
        pdf_stream = io.BytesIO(pdf_content)
        try:
            reader = PdfReader(pdf_stream)
        except Exception as e:
            assert False, f"Failed to parse PDF: {e}"

        # Extract text from all pages and verify key contents
        full_text = ""
        for page in reader.pages:
            try:
                full_text += page.extract_text() or ""
            except Exception:
                # Could fail silently on some content extraction issues, not fatal for test
                pass

        # Check for company name
        assert "PlumbPro Inc." in full_text, "Company name missing in PDF"

        # Check for estimate title
        assert estimate["title"] in full_text, "Estimate title missing in PDF"

        # Check for client information
        client_name = estimate_payload["clientName"]
        client_phone = estimate_payload["clientPhone"]
        client_address = estimate_payload["clientAddress"]
        assert client_name in full_text, "Client name missing in PDF"
        assert client_phone in full_text, "Client phone missing in PDF"
        assert client_address in full_text, "Client address missing in PDF"

        # Check for line items table headings
        for heading in [
            "Description", "Qty", "Unit Price", "Type", "Subtotal", "Total"
        ]:
            assert heading in full_text, f"Missing line items table heading '{heading}' in PDF"

        # Check that each item description is present
        for item in estimate_payload["items"]:
            assert item["description"] in full_text, f"Item description '{item['description']}' missing in PDF"

        # Check currency formatting with 2 decimals and $ sign e.g. $150.00
        currency_pattern = r"\$\d+\.\d{2}"
        matches = re.findall(currency_pattern, full_text)
        assert matches, "No currency formatted values with two decimals found in PDF"

        # Additional simple sanity checks for professional layout terms (e.g., margins, layout)
        # Since this is PDF text extraction, check for margin or layout text might not be possible.
        # We trust here that format is professional if required elements exist.

    finally:
        # Clean up - delete created estimates and users
        # Delete created estimate by owner
        if created_estimate_id is not None:
            session.delete(f"{BASE_URL}/api/estimates/{created_estimate_id}", timeout=TIMEOUT)
        # Delete second user estimate
        if 'other_estimate_id' in locals():
            second_session.delete(f"{BASE_URL}/api/estimates/{other_estimate_id}", timeout=TIMEOUT)
        # Delete inactive user estimate
        if 'inactive_estimate_id' in locals():
            inactive_session.delete(f"{BASE_URL}/api/estimates/{inactive_estimate_id}", timeout=TIMEOUT)

        # Optionally, delete users if API supports - not specified in PRD


test_pdf_generation_api_endpoint_creates_professional_estimates_with_company_branding()