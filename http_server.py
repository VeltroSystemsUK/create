#!/usr/bin/env python3

import http.server
import socketserver
import os
from pathlib import Path

PORT = 3003
BASE_DIR = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # CORS headers
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        # Normalize path
        path = self.path
        if path == '/':
            path = '/framework-builder.html'

        # Try to find file
        file_path = None

        # Try dist first
        potential = BASE_DIR / 'dist' / path.lstrip('/')
        if potential.is_file():
            file_path = potential

        # Try root
        if not file_path:
            potential = BASE_DIR / path.lstrip('/')
            if potential.is_file():
                file_path = potential

        if not file_path or not file_path.is_file():
            self.send_error(404)
            return

        # Serve the file
        try:
            with open(file_path, 'rb') as f:
                content = f.read()

            # Determine content type
            ext = file_path.suffix.lower()
            content_types = {
                '.html': 'text/html; charset=utf-8',
                '.js': 'text/javascript; charset=utf-8',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
            }
            content_type = content_types.get(ext, 'application/octet-stream')

            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', len(content))
            self.send_header('Cache-Control', 'public, max-age=31536000')
            self.send_header('Connection', 'keep-alive')
            self.end_headers()

            self.wfile.write(content)
            print(f"✓ {self.command} {path} -> 200 ({len(content)} bytes)")
        except Exception as e:
            print(f"✗ Error serving {path}: {e}")
            self.send_error(500)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    os.chdir(BASE_DIR)

    with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
        print(f"""
✓ Python HTTP Server
  URL: http://localhost:{PORT}
  Port: {PORT}
  Base: {BASE_DIR}

Press Ctrl+C to stop
""")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
