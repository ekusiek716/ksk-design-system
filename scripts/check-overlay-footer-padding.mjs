#!/usr/bin/env node

// P051（issue #619）: ResponsiveOverlayFrame（plain / float 系）+ ResponsiveOverlayFooter の
// padding={false} 付け忘れ。判定本体は公開 CLI と共通の bin/overlay-footer-padding.js。
import fs from "node:fs"
import { inspectOverlayFooterPadding } from "../bin/overlay-footer-padding.js"

for (const filePath of process.argv.slice(2)) {
  if (!filePath.endsWith(".tsx") || !fs.existsSync(filePath)) continue
  const source = fs.readFileSync(filePath, "utf8")
  for (const finding of inspectOverlayFooterPadding(source, filePath)) {
    process.stdout.write(`${filePath}:${finding.line}: <${finding.tag}> padding={false} が無い\n`)
  }
}
