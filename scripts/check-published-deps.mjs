import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { ImportType, init, parse } from "es-module-lexer"

const rootDir = fileURLToPath(new URL("..", import.meta.url))
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
const webBundlePath = new URL("../dist/index.js", import.meta.url)

// dist/ は git 追跡外のため、fresh checkout では存在せず、ローカルでは前回ビルドの
// 残骸が stale になり得る。ソース（src/ と build 設定）より古い場合は再ビルドして
// から検証する（stale な bundle を検証しても契約違反を見逃すため）。
const newestSourceMtime = (path) => {
  let newest = 0
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue
    const full = `${path}/${entry.name}`
    newest = Math.max(newest, entry.isDirectory() ? newestSourceMtime(full) : statSync(full).mtimeMs)
  }
  return newest
}
const bundleMtime = existsSync(webBundlePath) ? statSync(webBundlePath).mtimeMs : 0
const sourceMtime = Math.max(
  newestSourceMtime(`${rootDir}src`),
  ...["package.json", "package-lock.json", "vite.config.lib.ts", "tsconfig.lib.json"].map(
    (file) => statSync(`${rootDir}${file}`).mtimeMs,
  ),
)
if (bundleMtime < sourceMtime) {
  console.log("dist/index.js が無いかソースより古いため `npm run build:lib` を実行します（dist/ は git 追跡外）")
  const build = spawnSync("npm", ["run", "build:lib"], { cwd: rootDir, stdio: "inherit" })
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
