#!/usr/bin/env node

import fs from "node:fs"
import { inspectCardChildSpacing } from "../bin/card-child-spacing.js"

for (const filePath of process.argv.slice(2)) {
  if (!filePath.endsWith(".tsx") || !fs.existsSync(filePath)) continue
  const source = fs.readFileSync(filePath, "utf8")
  for (const finding of inspectCardChildSpacing(source, filePath)) {
    process.stdout.write(
      `${filePath}:${finding.line}: <${finding.tag}> ${finding.spacingClass}\n`,
    )
  }
}
