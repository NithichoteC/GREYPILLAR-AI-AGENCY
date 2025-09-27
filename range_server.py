#!/usr/bin/env python3
"""
Simple HTTP server with byte-range support for video files
"""
import os
import re
import http.server
import socketserver
from urllib.parse import unquote
import mimetypes

class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler that supports byte-range requests for video seeking"""

    def do_GET(self):
        """Handle GET requests with Range header support"""
        path = self.translate_path(self.path)

        if not os.path.exists(path):
            self.send_error(404, "File not found")
            return

        if os.path.isdir(path):
            # For directories, use default behavior
            return super().do_GET()

        # Get file info
        file_size = os.path.getsize(path)

        # Check for Range header
        range_header = self.headers.get('Range')

        if range_header:
            # Parse range header
            range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if range_match:
                start = int(range_match.group(1))
                end = int(range_match.group(2)) if range_match.group(2) else file_size - 1

                # Validate range
                if start >= file_size or end >= file_size:
                    self.send_error(416, "Range not satisfiable")
                    return

                # Send partial content
                self.send_partial_content(path, start, end, file_size)
                return

        # Send full file
        self.send_full_file(path, file_size)

    def send_partial_content(self, path, start, end, file_size):
        """Send partial content for range requests"""
        content_length = end - start + 1

        # Send response headers
        self.send_response(206, "Partial Content")
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Length", str(content_length))
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()

        # Send file content
        with open(path, 'rb') as f:
            f.seek(start)
            remaining = content_length
            while remaining > 0:
                chunk_size = min(8192, remaining)
                data = f.read(chunk_size)
                if not data:
                    break
                self.wfile.write(data)
                remaining -= len(data)

    def send_full_file(self, path, file_size):
        """Send full file"""
        # Send response headers
        self.send_response(200, "OK")
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Length", str(file_size))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()

        # Send file content
        with open(path, 'rb') as f:
            while True:
                data = f.read(8192)
                if not data:
                    break
                self.wfile.write(data)

def run_server(port=8082):
    """Run the range-supporting HTTP server"""
    handler = RangeRequestHandler

    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"🎬 Range HTTP Server running on http://localhost:{port}/")
        print(f"📁 Serving files from: {os.getcwd()}")
        print(f"🎯 Open: http://localhost:{port}/prep.html")
        print("Press Ctrl+C to stop")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")

if __name__ == "__main__":
    run_server()