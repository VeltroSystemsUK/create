#!/usr/bin/env node

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3003;

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files from dist first (built assets)
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
  maxAge: '1y',
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// Serve JS files from js directory
app.use('/js', express.static(path.join(__dirname, 'js'), {
  maxAge: '1h',
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

// Serve media files
app.use('/media', express.static(path.join(__dirname, 'media')));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'framework-builder.html'));
});

app.get('/:filename.html', (req, res) => {
  const file = path.join(__dirname, 'dist', req.params.filename + '.html');
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Fallback - serve dist folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname)));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
✓ Veltro Create Server (Node.js/Express)
  URL: http://localhost:${PORT}
  Port: ${PORT}

Press Ctrl+C to stop
`);
});
