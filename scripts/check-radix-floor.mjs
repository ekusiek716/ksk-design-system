/**
 * Radix の ref churn 安全下限を守っているかの検査（issue #516 の残課題 / 案X）。
 *
 * 1. `package.json` の dependencies が {@link SAFE_FLOORS} 以上のレンジを宣言しているか
 * 2. 実際にインストールされた Radix（推移依存を含む）が {@link SAFE_FLOORS} 以上か
 *
 * 2 が要るのは、`radix-ui` メタパッケージがサブパッケージを exact で掴む＝
 * メタパッケージの版を上げないと focus-scope / presence が古いままになるため。
 * 逆にここが緑なら、consumer 側の npm も DS の依存として同じ下限以上を解決する。
 *
 * 背景・版ごとの差分は scripts/radix-ref-churn.mjs のヘッダ参照。
 */
import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { DIRECT_DEPENDENCIES, SAFE_FLOORS, compareVersions, rangeFloor } from "./radix-ref-churn.mjs"

const rootDir = fileURLToPath(new URL("..", import.meta.url))
const packageJson = JSON.parse(readFileSync(`${rootDir}package.json`, "utf8"))

const errors = []

for (const name of DIRECT_DEPENDENCIES) {
  const range = packageJson.dependencies?.[name]
  if (!range) {
    errors.push(`${name}: dependencies に宣言がありません（ref churn 下限を固定できません）`)
    continue
  }
  const floor = rangeFloor(range)
  if (!floor) {
    errors.push(`${name}: レンジ "${range}" から下限バージョンを読み取れません`)
    continue
  }
  if (compareVersions(floor, SAFE_FLOORS[name]) < 0) {
    errors.push(
      `${name}: 宣言レンジ "${range}"（下限 ${floor}）が ref churn 安全下限 ${SAFE_FLOORS[name]} を下回っています`,
    )
  }
}

/**
 * 実際に使われる版を求める。
 *
 * - 直接依存: インストール済み manifest の version をそのまま読む
 * - 推移依存: `radix-ui` が **exact** で宣言している版を読む。hoist されて
 *   node_modules 直下に居るか `node_modules/radix-ui/node_modules/` に
 *   ネストされるかは npm のツリー構築次第だが、exact 宣言はどちらでも同じ版を
 *   意味するので、ディレクトリ探索より確実。
 */
const metaManifestPath = `${rootDir}node_modules/radix-ui/package.json`
const metaManifest = existsSync(metaManifestPath)
  ? JSON.parse(readFileSync(metaManifestPath, "utf8"))
  : null

const resolved = []
for (const [name, floor] of Object.entries(SAFE_FLOORS)) {
  let version = null
  if (DIRECT_DEPENDENCIES.includes(name)) {
    const manifestPath = `${rootDir}node_modules/${name}/package.json`
    if (existsSync(manifestPath)) version = JSON.parse(readFileSync(manifestPath, "utf8")).version
  } else {
    version = metaManifest?.dependencies?.[name] ?? null
  }

  if (!version) {
    errors.push(`${name}: インストール済みの版を特定できません（\`npm install\` を実行してください）`)
    continue
  }
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    errors.push(`${name}: radix-ui が exact 以外（"${version}"）で宣言しています。下限を保証できません`)
    continue
  }
  if (compareVersions(version, floor) < 0) {
    errors.push(
      `${name}@${version}: ref churn 安全下限 ${floor} 未満です。合成 ref が毎 render 付け替わり、` +
        "面の node を state に持つ DS の hook が発散します（#516）",
    )
    continue
  }
  resolved.push(`${name}@${version}`)
}

if (errors.length > 0) {
  console.error("✗ Radix の ref churn 安全下限に違反しています")
  for (const error of errors) console.error(`  - ${error}`)
  console.error("  背景: scripts/radix-ref-churn.mjs / issue #516")
  process.exit(1)
}

console.log(`✓ Radix の ref churn 安全下限を満たしています（${resolved.join(", ")}）`)
