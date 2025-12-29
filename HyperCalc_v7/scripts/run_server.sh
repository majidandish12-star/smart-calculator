#!/usr/bin/env bash
set -e
PORT=8080
echo "Starting local HyperCalc v7 server at http://localhost:$PORT"
python3 -m http.server $PORT --directory ../public
