import urllib.request
import json
import ssl

def test_proxy():
    url = "http://localhost:8000/api/proxy"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": "invalid_key"
    }
    data = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": "Hello"}]
            }
        ]
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.status}")
            print(f"Response: {response.read().decode()}")
    except Exception as e:
        print(f"Error: {e}")
        if hasattr(e, 'read'):
            print(f"Error Content: {e.read().decode()}")

if __name__ == "__main__":
    test_proxy()
