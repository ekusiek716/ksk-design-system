import { readFileSync } from "node:fs"
import { ImportType, init, parse } from "es-module-lexer"

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
const webBundle = readFileSync(new URL("../dist/index.js", import.meta.url), "utf8")
// Native entrypoints do not use react-dom. Web consumers install it explicitly
// alongside React, which is exercised by test-packed-web-consumer.mjs.
const explicitWebConsumerPeers = new Set(["react-dom"])

const packageName = (specifier) => {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/")
  return specifier.split("/")[0]
}

const staticImports = new Set()
await init
const [imports] = parse(webBundle)
for (const importSpecifier of imports) {
  if (
    importSpecifier.t !== ImportType.Static &&
    importSpecifier.t !== ImportType.StaticSourcePhase &&
    importSpecifier.t !== ImportType.StaticDeferPhase
  ) {
    continue
  }

  const specifier = importSpecifier.n
  if (!specifier) continue
  if (!specifier.startsWith(".") && !specifier.startsWith("node:")) {
    staticImports.add(packageName(specifier))
  }
}

const errors = []
for (const dependency of [...staticImports].sort()) {
  if (packageJson.dependencies?.[dependency]) continue

  if (packageJson.peerDependencies?.[dependency]) {
    if (
      packageJson.peerDependenciesMeta?.[dependency]?.optional &&
      !explicitWebConsumerPeers.has(dependency)
    ) {
      errors.push(`${dependency}: Web bundle が静的 import していますが optional peer のままです`)
    }
    continue
  }

  errors.push(`${dependency}: Web bundle が静的 import していますが dependencies / peerDependencies にありません`)
}

if (errors.length > 0) {
  console.error("✗ 公開 Web bundle の依存契約に違反があります")
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`✓ 公開 Web bundle の静的依存 ${staticImports.size} 件は install 契約と一致しています`)
