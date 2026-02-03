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

NEEDS_BUILD=0
if [ ! -d dist ] || [ ! -f dist/index.js ]; then
  NEEDS_BUILD=1
else
  for SRC in src/*.ts; do
    if [ "$SRC" -nt dist/index.js ]; then
      NEEDS_BUILD=1
      break
    fi
  done
fi

if [ "$NEEDS_BUILD" -eq 1 ]; then
  npm run build
fi

NODE_BIN="/Users/E054116/.nvm/versions/node/v22.12.0/bin/node"
"$NODE_BIN" dist/index.js "$@"
