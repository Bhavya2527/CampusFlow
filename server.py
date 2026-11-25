"""
CampusFlow Development Server
=============================================================================
Serves the CampusFlow Student Ride Booking Dashboard on http://localhost:3001
(master workspace port; override with: python server.py <port>)
"""

import http.server
import socketserver
import os
import sys

PORT = int(os.environ.get("PORT", 3001))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching during local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def main():
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    # Allow address reuse to prevent "address already in use" errors on quick restarts
    socketserver.TCPServer.allow_reuse_address = True

    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            print(f"============================================================")
            print(f"  CampusFlow Student Dashboard Running Locally")
            print(f"  URL: http://localhost:{port}")
            print(f"  Directory: {DIRECTORY}")
            print(f"  Press Ctrl+C to stop the server")
            print(f"============================================================")
            httpd.serve_forever()
    except OSError as e:
        print(f"Port {port} may be in use, trying {port + 1}...")
        with socketserver.TCPServer(("", port + 1), Handler) as httpd:
            print(f"============================================================")
            print(f"  CampusFlow Student Dashboard Running Locally")
            print(f"  URL: http://localhost:{port + 1}")
            print(f"============================================================")
            httpd.serve_forever()

if __name__ == "__main__":
    main()
