import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { ImportType, init, parse } from "es-module-lexer"

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
const webBundlePath = new URL("../dist/index.js", import.meta.url)
if (!existsSync(webBundlePath)) {
  // dist/ は git 追跡外のため、fresh checkout では存在しない。
  // `npm run check` や release.sh を単体で走らせても通るよう、その場でビルドする。
  console.log("dist/index.js がないため `npm run build:lib` を実行します（dist/ は git 追跡外）")
  const build = spawnSync("npm", ["run", "build:lib"], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdio: "inherit",
  })
  if (build.status !== 0 || !existsSync(webBundlePath)) {
    console.error("✗ build:lib に失敗し dist/index.js を生成できませんでした")
    process.exit(1)
  }
}
const webBundle = readFileSync(webBundlePath, "utf8")
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
