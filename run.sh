#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
  echo "Missing .env. Copy .env.example and fill it." >&2
  exit 1
fi

# Load env vars
set -a
source .env
set +a

if [ ! -d dist ]; then
  npm run build
fi

node dist/index.js
