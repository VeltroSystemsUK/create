#!/bin/bash
# Production-ready server launcher

# Try Gunicorn first (better for production)
if command -v gunicorn &> /dev/null; then
    echo "Starting with Gunicorn..."
    gunicorn -w 4 -b 0.0.0.0:3003 --timeout 120 server:app
    exit $?
fi

# Fallback to Flask with optimizations
echo "Gunicorn not found, using Flask development server (single threaded)"
echo "For best results, install Gunicorn: pip3 install --break-system-packages gunicorn"
python3 server.py
