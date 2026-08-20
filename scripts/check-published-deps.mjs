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

// ─── bin/ の CLI スクリプト（issue #409） ──────────────────────
// dist/index.js とは別系統のエントリポイント。bin/ の import はここまで対象外だった
// （bin/lint.js・bin/check-migration.js が typescript を無条件 import していても
// 検出できていなかった）。static import は dist と同じ契約（dependencies /
// peerDependencies いずれかに存在必須）で検査する。dynamic import（`await import(...)`）は
// 「実行時に無くても起動は落とさない optional 扱い」として区別し、dependencies /
// peerDependencies のどちらにも無ければ別カテゴリで報告する（エラーにはしない — 完全に
// 未インストールな optional 依存はあり得る設計のため）。
const binDir = new URL("../bin/", import.meta.url)
const binFiles = existsSync(binDir)
  ? readdirSync(binDir).filter((name) => name.endsWith(".js")).sort()
  : []

const binStaticImports = new Set()
const binDynamicImports = new Set()
for (const name of binFiles) {
  const source = readFileSync(new URL(name, binDir), "utf8")
  const [binImports] = parse(source)
  for (const importSpecifier of binImports) {
    const specifier = importSpecifier.n
    if (!specifier) continue
    if (specifier.startsWith(".") || specifier.startsWith("node:")) continue
    const dependency = packageName(specifier)
    if (importSpecifier.d >= 0) {
      // `d` は dynamic import の開始位置（>= 0 なら `import()` 呼び出し）。
      binDynamicImports.add(dependency)
    } else {
      binStaticImports.add(dependency)
    }
  }
}

const binOptionalOnly = []
for (const dependency of [...binStaticImports].sort()) {
  if (packageJson.dependencies?.[dependency]) continue
  if (packageJson.peerDependencies?.[dependency]) continue
  errors.push(`${dependency}: bin/ が静的 import していますが dependencies / peerDependencies にありません`)
}
for (const dependency of [...binDynamicImports].sort()) {
  if (binStaticImports.has(dependency)) continue // 静的 import 側で既に検査済み
  if (packageJson.dependencies?.[dependency] || packageJson.peerDependencies?.[dependency]) continue
  binOptionalOnly.push(dependency)
}

if (errors.length > 0) {
  console.error("✗ 公開 Web bundle の依存契約に違反があります")
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`✓ 公開 Web bundle の静的依存 ${staticImports.size} 件は install 契約と一致しています`)
console.log(
  `✓ bin/ の静的依存 ${binStaticImports.size} 件は install 契約と一致しています` +
    (binDynamicImports.size > 0 ? `（dynamic import ${binDynamicImports.size} 件は optional 扱い）` : ""),
)
if (binOptionalOnly.length > 0) {
  console.log(
    `  optional（dependencies / peerDependencies 未記載の dynamic import）: ${binOptionalOnly.join(", ")}`,
  )
}
