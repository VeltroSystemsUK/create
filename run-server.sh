#!/bin/bash
# Production-ready server launcher

# Try simple HTTP server first (most reliable - no frameworks)
if command -v node &> /dev/null; then
    echo "Starting with Node.js HTTP server..."
    node simple-server.cjs
    exit $?
fi

# Fallback to Gunicorn if Node.js not available
if command -v gunicorn &> /dev/null; then
    echo "Node.js not found, falling back to Gunicorn..."
    gunicorn -w 4 -b 0.0.0.0:3003 --timeout 300 --keep-alive 300 server:app
    exit $?
fi

# Final fallback to Flask development server
echo "Gunicorn not found, using Flask development server"
python3 server.py
