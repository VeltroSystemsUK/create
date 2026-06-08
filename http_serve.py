#!/usr/bin/env python3
import http.server
import socketserver
import os
from pathlib import Path

os.chdir(Path(__file__).parent)

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path if self.path != '/' else '/framework-builder.html'
        
        # Try dist first, then root
        for base in ['dist', '.']:
            file_path = Path(base) / path.lstrip('/')
            if file_path.is_file():
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Connection', 'keep-alive')
                
                # Content type
                if file_path.suffix == '.js':
                    self.send_header('Content-Type', 'text/javascript')
                elif file_path.suffix == '.css':
                    self.send_header('Content-Type', 'text/css')
                elif file_path.suffix == '.html':
                    self.send_header('Content-Type', 'text/html')
                
                data = file_path.read_bytes()
                self.send_header('Content-Length', len(data))
                self.end_headers()
                self.wfile.write(data)
                return
        
        self.send_response(404)
        self.end_headers()

with socketserver.TCPServer(('', 3003), Handler) as httpd:
    print('Server on port 3003')
    httpd.serve_forever()
