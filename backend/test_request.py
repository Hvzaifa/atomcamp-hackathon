"""Send a sample order to the running orchestrator and print the response.

Start the server first:  ./venv/bin/uvicorn main:app --reload
Then run:                ./venv/bin/python test_request.py
"""

import json

import requests

URL = "http://localhost:8000/orchestrate"

PAYLOAD = {
    "raw_input": "Bilal ne 5 samosay liye 50 rupay ke, cash de diya",
    "business_type": "food",
    "currency": "PKR",
    "inventory": []
}


def main():
    try:
        response = requests.post(URL, json=PAYLOAD, timeout=120)
    except requests.exceptions.ConnectionError:
        print(f"Could not connect to {URL}. Is the server running?")
        return

    print(f"HTTP {response.status_code}\n")
    try:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except ValueError:
        print(response.text)


if __name__ == "__main__":
    main()
