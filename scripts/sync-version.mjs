#!/usr/bin/env node
/**
 * バージョン同期スクリプト（issue #259）
 *
 * 目的:
 *   version bump のたびに手動更新していた付随ファイル
 *   （contracts/components.json の meta.version・token-hex-cache）を
 *   package.json の version から自動追従させる。
 *
 * 実行経路は2つ:
 *   1. npm version 経由（package.json に "scripts.version" として登録）。
 *      npm が package.json の version bump 後・コミット作成前に自動実行し、
 *      このスクリプトが変更したファイルは npm version のコミットに自動的に含まれる。
 *   2. 手動 bump（release PR 方式など npm version を使わない経路）向けに
 *      単体実行も可能: `node scripts/sync-version.mjs`
 *      この場合は自分で `git add` まで行う（npm version 経由では npm 自身が
 *      add してくれるが、単体実行時は npm が介在しないため）。
 *
 * やること:
 *   1. contracts/components.json の meta.version を package.json の version に更新
 *   2. node scripts/generate-token-hex-cache.mjs を再生成
 *   3. 変更したファイルを git add
 *
 * COMPONENT_LOOKUP.md 系（generate-component-lookup.mjs /
 * generate-native-component-lookup.mjs）は version 文字列を出力に含まないため
 * ここでは対象外（`npm run check` の generate:lookup --check が別途乖離を検出する）。
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const PACKAGE_JSON_PATH = join(ROOT, "package.json")
const COMPONENTS_JSON_PATH = join(ROOT, "contracts", "components.json")
const TOKEN_HEX_CACHE_PATH = join(ROOT, "contracts", "token-hex-cache.json")
const TOKEN_HEX_SCRIPT_PATH = join(ROOT, "scripts", "generate-token-hex-cache.mjs")

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function main() {
  const pkg = readJson(PACKAGE_JSON_PATH)
  const version = pkg.version
  if (!version) {
    console.error("✗ package.json に version がありません")
    process.exit(1)
  }

  const changedFiles = []

  // 1. contracts/components.json の meta.version を同期
  const components = readJson(COMPONENTS_JSON_PATH)
  if (components.meta?.version !== version) {
    const before = readFileSync(COMPONENTS_JSON_PATH, "utf8")
    components.meta.version = version
    const after = `${JSON.stringify(components, null, 2)}\n`
    if (before !== after) {
      writeFileSync(COMPONENTS_JSON_PATH, after)
      changedFiles.push(COMPONENTS_JSON_PATH)
      console.log(`✓ contracts/components.json の meta.version を ${version} に更新しました`)
    }
  } else {
    console.log(`✓ contracts/components.json の meta.version は既に ${version} です`)
  }

  // 2. token-hex-cache を再生成（meta.version を含む）
  const before = (() => {
    try {
      return readFileSync(TOKEN_HEX_CACHE_PATH, "utf8")
    } catch {
      return null
    }
  })()
  execFileSync(process.execPath, [TOKEN_HEX_SCRIPT_PATH], { cwd: ROOT, stdio: "inherit" })
  const after = readFileSync(TOKEN_HEX_CACHE_PATH, "utf8")
  if (before !== after) {
    changedFiles.push(TOKEN_HEX_CACHE_PATH)
  }

  // 3. git add（npm version 経由なら npm 自身が commit に含めるため冪等・害なし。
  //    手動 bump 経路ではこの add が唯一のステージング機会）
  if (changedFiles.length > 0) {
    execFileSync("git", ["add", ...changedFiles], { cwd: ROOT, stdio: "inherit" })
    console.log(`✓ git add: ${changedFiles.map((f) => f.replace(`${ROOT}/`, "")).join(", ")}`)
  } else {
    console.log("✓ 変更なし（既に同期済み）")
  }
}

main()
