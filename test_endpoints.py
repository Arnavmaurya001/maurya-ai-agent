import json, urllib.request, urllib.error, os

def test_endpoint(path, payload):
    url = f"http://localhost:8000{path}"
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"--- Testing {path} ---")
            print("Status:", resp.status)
            print("Response:", resp.read().decode())
    except Exception as e:
        print(f"Error testing {path}: {e}")

# Test File Read
test_endpoint("/api/files/read", {"path": "README.md"})

# Test File Write
test_endpoint("/api/files/write", {"path": "test_output.txt", "content": "Hello from Maurya AI backend!"})

# Test Search
test_endpoint("/api/search", {"query": "React coding agent"})

# Test Safety (Should fail)
test_endpoint("/api/files/read", {"path": "../secret.txt"})
