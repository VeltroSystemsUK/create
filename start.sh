#!/bin/bash
# Start Framework Builder with Firecrawl + Playwright page import
echo "Killing old servers..."
# Kill ANY python process on port 8899
fuser -k 8899/tcp 2>/dev/null
sleep 1
echo "Framework Builder starting at http://localhost:8899"
echo "Features: Website Import (preserves design), Template Manager, Animations"
echo "Press Ctrl+C to stop"
python3 server.py
