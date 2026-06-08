#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3003;
const BASE_DIR = __dirname;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

  // Normalize path
  if (pathname === '/') {
    pathname = '/framework-builder.html';
  }

  // Build file path - try dist first, then root
  let filePath;

  // If requesting assets or js, look in dist or root
  if (pathname.startsWith('/assets/')) {
    filePath = path.join(BASE_DIR, 'dist', pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(BASE_DIR, pathname);
    }
  } else if (pathname.startsWith('/js/')) {
    filePath = path.join(BASE_DIR, pathname);
  } else if (pathname.endsWith('.html')) {
    filePath = path.join(BASE_DIR, 'dist', pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(BASE_DIR, pathname);
    }
  } else {
    filePath = path.join(BASE_DIR, 'dist', pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(BASE_DIR, pathname);
    }
  }

  // Security: prevent directory traversal
  try {
    const realPath = fs.realpathSync(BASE_DIR);
    const realFile = fs.realpathSync(path.dirname(filePath));
    if (!realFile.startsWith(realPath)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
  } catch (e) {
    // Directory doesn't exist yet, will be caught by fs.stat below
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log(`  -> NOT FOUND: ${filePath}`);
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Set response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Connection', 'keep-alive');
    console.log(`  -> 200 OK (${stats.size} bytes)`);
    res.writeHead(200);

    // Read file and send (buffer for reliability)
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err.message}`);
        res.destroy();
        return;
      }
      res.end(data);
    });
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
✓ Simple HTTP Server
  URL: http://localhost:${PORT}
  Port: ${PORT}

Press Ctrl+C to stop
`);
});
