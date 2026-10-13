#!/usr/bin/env bash
set -euo pipefail
# Run only in the pinned Playwright container; preserve host node_modules.
ROOT="$(pwd)"
UPDATE=false
for ARG in "$@"; do
  if [[ "$ARG" == "--update" ]]; then UPDATE=true; fi
done
TASK_DIR="$(mktemp -d)"
trap 'kill ${SERVER_PID:-} 2>/dev/null || true; rm -rf "$TASK_DIR"' EXIT
cp package.json package-lock.json "$TASK_DIR/"
cp -R scripts test "$TASK_DIR/"
cd "$TASK_DIR"
npm ci --ignore-scripts --no-audit --no-fund
# Port 0 = OS-assigned free port, so concurrent runs (e.g. --network host or a
# bare Linux host) never collide on 6010. The server prints the bound URL.
SERVER_LOG="$TASK_DIR/storybook-server.log"
node "$ROOT/scripts/serve-storybook.mjs" "$ROOT/storybook-static" 0 > "$SERVER_LOG" 2>&1 &
SERVER_PID=$!
STORYBOOK_URL=""
for _ in $(seq 1 60); do
  STORYBOOK_URL="$(sed -n 's/^KSK_STORYBOOK_URL=//p' "$SERVER_LOG" | head -n 1)"
  if [[ -n "$STORYBOOK_URL" ]]; then break; fi
  sleep 0.5
done
if [[ -z "$STORYBOOK_URL" ]]; then
  echo "Static Storybook server did not start:" >&2
  cat "$SERVER_LOG" >&2
  exit 1
fi
export STORYBOOK_URL
STATUS=0
node scripts/check-visual.mjs "$@" || STATUS=$?
cp -R artifacts "$ROOT/"
if [[ "$STATUS" -eq 0 && "$UPDATE" == true ]]; then
  node --input-type=module - "$ROOT" <<'JS'
import fs from 'node:fs/promises'
import path from 'node:path'
import { replaceBaselines } from './scripts/lib/visual-baselines.mjs'
const source = 'test/visual/baselines'
const names = (await fs.readdir(source)).filter(name => name.endsWith('.png'))
const images = new Map(await Promise.all(names.map(async name => [name, await fs.readFile(path.join(source, name))])))
const manifest = JSON.parse(await fs.readFile(path.join(source, 'environment.json')))
await replaceBaselines(path.join(process.argv[2], source), images, manifest)
JS
fi

exit "$STATUS"
