import urllib.request
import json
import ssl

def list_models(api_key):
    url = f'https://generativelanguage.googleapis.com/v1beta/models?key={api_key}'
    try:
        # Bypass SSL verification for local dev if needed (though Google should be fine)
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(url, context=context) as response:
            data = json.loads(response.read().decode())
            print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Using the key provided by the user (I'll extract it from App.js if needed, but I have it from the logs)
    api_key = "AIzaSyB1zVEjuu9Ksweu6w58LyeCj8JtEDs1_jU"
    list_models(api_key)
