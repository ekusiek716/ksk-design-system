#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..")
const typesDir = join(rootDir, "dist", "types")
const failures = []

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      walk(path)
      continue
    }
    if (!name.endsWith(".d.ts")) continue

    readFileSync(path, "utf8").split("\n").forEach((line, index) => {
      if (/(?:from\s+|import\()["']@\//.test(line)) {
        failures.push({
          file: relative(rootDir, path),
          line: index + 1,
          source: line.trim(),
        })
      }
    })
  }
}

walk(typesDir)

if (failures.length > 0) {
  console.error("✗ 公開型宣言に consumer から解決できない @/ import が残っています")
  for (const failure of failures) {
    console.error(`  ${failure.file}:${failure.line} ${failure.source}`)
  }
  process.exit(1)
}

console.log("✓ 公開型宣言に repo 内部 @/ import はありません")
