import requests
import json

base_url = "http://127.0.0.1:8000/api/chat"
headers = {"Content-Type": "application/json"}

tests = [
    {"message": "hello AIRA"},
    {"message": "where did I leave off last time?"},
    {"message": "look at my screen and explain this"},
    {"message": "can you see me through camera?"},
    {"message": "are you loyal to me?"}
]

for test in tests:
    print(f"\n--- Testing: {test['message']} ---")
    try:
        res = requests.post(base_url, json=test, headers=headers)
        data = res.json()
        print(f"Reply: {data.get('reply', 'No reply')}")
        print(f"Intent: {data.get('intent', 'N/A')}")
        print(f"Privacy State: {data.get('privacy_state', 'N/A')}")
    except Exception as e:
        print(f"Error: {e}")
