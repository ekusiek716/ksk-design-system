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
node "$ROOT/scripts/serve-storybook.mjs" "$ROOT/storybook-static" 6010 > /tmp/ksk-visual-server.log 2>&1 &
SERVER_PID=$!
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
