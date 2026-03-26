import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os
import ssl

PORT = 8000

# SSL context for bypass (local dev support)
ssl_context = ssl._create_unverified_context()

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        return super().guess_type(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _send_error(self, status, message):
        self._send_json({'error': {'message': message}}, status)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b''

        if self.path == '/api/proxy':
            # API Selection Logic (Gemini is now default)
            api_key = self.headers.get('x-api-key', '')
            url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}'
            
            headers = {
                'Content-Type': 'application/json',
            }
            
            print(f"> Proxying request to Google Gemini API...")
            
            try:
                req = urllib.request.Request(url, data=post_data, headers=headers, method='POST')
                with urllib.request.urlopen(req, context=ssl_context) as response:
                    res_body = response.read()
                    print(f"< Success: {response.status}")
                    self.send_response(response.status)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(res_body)
            except urllib.error.HTTPError as e:
                res_body = e.read()
                print(f"< Gemini API Error: {e.code}")
                self._send_json(json.loads(res_body), e.code)
            except Exception as e:
                print(f"< Proxy Server Error: {str(e)}")
                self._send_error(500, str(e))

        elif self.path == '/api/files/read':
            try:
                args = json.loads(post_data)
                filename = args.get('path', '')
                # Safety check: No absolute paths, stay in current dir
                safe_path = os.path.join(os.getcwd(), filename)
                if not os.path.abspath(safe_path).startswith(os.getcwd()):
                    return self._send_error(403, "Access denied: Path outside workspace")
                
                if not os.path.exists(safe_path):
                    return self._send_error(404, f"File not found: {filename}")

                with open(safe_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                print(f"> Read file: {filename}")
                self._send_json({'content': content})
            except Exception as e:
                self._send_error(500, str(e))

        elif self.path == '/api/files/write':
            try:
                args = json.loads(post_data)
                filename = args.get('path', '')
                content = args.get('content', '')
                # Safety check
                safe_path = os.path.join(os.getcwd(), filename)
                if not os.path.abspath(safe_path).startswith(os.getcwd()):
                    return self._send_error(403, "Access denied: Path outside workspace")
                
                # Create directories if they don't exist
                os.makedirs(os.path.dirname(safe_path), exist_ok=True)
                
                with open(safe_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"> Wrote file: {filename}")
                self._send_json({'status': 'success', 'path': filename})
            except Exception as e:
                self._send_error(500, str(e))

        elif self.path == '/api/search':
            try:
                args = json.loads(post_data)
                query = args.get('query', '')
                print(f"> Web search: {query}")
                # Mock real search results for now
                results = [
                    f"Result 1 for '{query}': Found relevant information about your request.",
                    f"Result 2 for '{query}': Deep dive into the technical details of the topic.",
                    f"Insight: {query} is a common subject in modern development."
                ]
                self._send_json({'results': results})
            except Exception as e:
                self._send_error(500, str(e))

        else:
            super().do_POST()

# Set extensions_map globally
http.server.SimpleHTTPRequestHandler.extensions_map.update({
    '.js': 'application/javascript',
    '.jsx': 'application/javascript',
    '.css': 'text/css',
})

print(f"Starting server with Gemini API Proxy at http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
