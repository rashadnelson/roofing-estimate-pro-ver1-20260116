import requests
from datetime import datetime
import re

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def test_health_check_api_returns_server_status_and_timestamp():
    url = f"{BASE_URL}/api/health"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request to {url} failed: {e}"

    assert response.status_code == 200, f"Expected 200 status code, got {response.status_code}"

    try:
        json_data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "status" in json_data, "Response JSON missing 'status' field"
    assert "timestamp" in json_data, "Response JSON missing 'timestamp' field"
    assert json_data["status"] == "ok", f"Expected status 'ok', got {json_data['status']}"

    timestamp = json_data["timestamp"]
    # Validate ISO 8601 format loosely with regex and try parsing
    iso8601_regex = (
        r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$"
    )
    assert re.match(iso8601_regex, timestamp), f"Timestamp '{timestamp}' is not a valid ISO 8601 UTC format"

    try:
        parsed_time = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        try:
            parsed_time = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
        except ValueError as e:
            assert False, f"Timestamp '{timestamp}' is not a valid ISO 8601 date-time: {e}"

    # If reached here, timestamp is valid
    assert isinstance(parsed_time, datetime)

test_health_check_api_returns_server_status_and_timestamp()