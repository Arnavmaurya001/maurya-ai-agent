import json, urllib.request, urllib.error, ssl

api_key = "AIzaSyAcb1v-yEIpcdbqUbVvv3YszNSsBrbXrNQ"
url = "http://localhost:8000/api/proxy"

payload = {
    "contents": [{"role": "user", "parts": [{"text": "Hello!"}]}]
}

headers = {
    "Content-Type": "application/json",
    "x-api-key": api_key
}

data = json.dumps(payload).encode()
req = urllib.request.Request(url, data=data, headers=headers, method="POST")
ctx = ssl._create_unverified_context()
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        print("Status:", resp.status)
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print(e.read().decode())
except Exception as e:
    print("Error:", e)
