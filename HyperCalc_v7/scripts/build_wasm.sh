#!/usr/bin/env bash
set -e
cd ../wasm-src
wasm-pack build --target web --out-dir ../public/js/wasm
