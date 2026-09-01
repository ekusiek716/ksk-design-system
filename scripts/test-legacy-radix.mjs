/**
 * 旧 Radix（belle-todo が実際に解決していた版）を固定インストールし、
 * その Radix で DS のオーバーレイ面が収束することを検証する（issue #516 / 案Y）。
 *
 * DS 自身の node_modules は ref churn 修正済みの Radix を解決するため、
 * 通常の `npm test` では #516 の回帰を原理的に再現できない。ここでは
 * {@link LEGACY_PINS} を専用ディレクトリへ install し、vitest の
 * `resolve.alias` でそちらを掴ませて `npm run test` と同じテストコードを回す。
 *
 * fixture は `node_modules/` 配下（gitignore 済み・`npm ci` で消える）へ置き、
 * React は入れない（上位＝本体の node_modules から解決させ、二重ロードを避ける）。
 *
 * 実行: `npm run test:legacy-radix`
 */
import { execFileSync, spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { LEGACY_FIXTURE_DIR, LEGACY_PINS } from "./radix-ref-churn.mjs"

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)))
const fixtureDir = join(root, LEGACY_FIXTURE_DIR)

const installedVersion = (name) => {
  const manifest = join(fixtureDir, "node_modules", name, "package.json")
  if (!existsSync(manifest)) return null
  return JSON.parse(readFileSync(manifest, "utf8")).version
}

const upToDate = Object.entries(LEGACY_PINS).every(([name, version]) => installedVersion(name) === version)

if (upToDate) {
  console.log("• 旧 Radix fixture は最新（install をスキップします）")
} else {
  console.log(`• 旧 Radix fixture を ${LEGACY_FIXTURE_DIR} に install します`)
  rmSync(fixtureDir, { recursive: true, force: true })
  mkdirSync(fixtureDir, { recursive: true })
  writeFileSync(
    join(fixtureDir, "package.json"),
    `${JSON.stringify({ name: "ksk-legacy-radix-fixture", private: true, version: "0.0.0" }, null, 2)}\n`,
  )
  execFileSync(
    "npm",
    [
      "install",
      "--prefix",
      fixtureDir,
      "--ignore-scripts",
      // peer の React をここへ入れさせない（本体の node_modules から解決させる）。
      "--legacy-peer-deps",
      ...Object.entries(LEGACY_PINS).map(([name, version]) => `${name}@${version}`),
    ],
    {
      cwd: root,
      env: { ...process.env, npm_config_audit: "false", npm_config_fund: "false" },
      stdio: "inherit",
    },
  )
}

for (const [name, version] of Object.entries(LEGACY_PINS)) {
  const actual = installedVersion(name)
  if (actual !== version) {
    console.error(`✗ ${name} が ${version} ではなく ${actual ?? "未インストール"} です`)
    process.exit(1)
  }
}

// execFileSync だと失敗時に Node のスタックが被さって vitest の出力が読みにくいので、
// spawnSync で終了コードだけを引き継ぐ。
const { status } = spawnSync(
  process.execPath,
  [join(root, "node_modules/vitest/vitest.mjs"), "run", "--config", "vitest.legacy-radix.config.ts"],
  { cwd: root, stdio: "inherit" },
)
process.exit(status ?? 1)
