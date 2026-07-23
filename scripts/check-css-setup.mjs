import { readFileSync } from "node:fs"

const requiredFiles = [
  "README.md",
  "templates/AGENTS.md",
  "templates/CLAUDE.md",
]

const missing = []
for (const path of requiredFiles) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
  if (!source.includes('@import "tailwindcss"')) {
    missing.push(`${path}: @import "tailwindcss"`)
  }
  if (!source.includes('@import "ksk-design-system/preset"')) {
    missing.push(`${path}: @import "ksk-design-system/preset"`)
  }
  if (!source.includes("@source") || !source.includes("ksk-design-system/dist")) {
    missing.push(`${path}: @source .../ksk-design-system/dist`)
  }
}

if (missing.length > 0) {
  console.error("✗ Consumer CSS セットアップの正本がドリフトしています")
  for (const item of missing) console.error(`  - ${item}`)
  process.exit(1)
}

console.log(`✓ Consumer CSS セットアップ ${requiredFiles.length} ファイルが一致しています`)
