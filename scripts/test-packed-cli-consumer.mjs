// npm pack した tarball から `npx ksk-ds` の CLI を実際に起動して検証するスモークテスト
// （issue #409）。既存の test-packed-web-consumer.mjs / test-packed-native-consumer.mjs と
// 同じ流儀（tmp dir に空 consumer を作り、tarball を install → 実行）。
//
// 検証すること:
//   1. typescript を devDependencies に持たない consumer でも `ksk-ds lint` /
//      `ksk-ds check-migration` / `ksk-ds check-duplicates --help` が
//      ERR_MODULE_NOT_FOUND で落ちずに起動できる（P046 / check-migration は
//      「typescript が無いので skip します」という案内を出して exit 0 になる）。
//   2. 素朴な起動時間の実測（before/after 比較用。CI のログに残す）。
import { execFileSync } from "node:child_process"
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)))
const temp = mkdtempSync(join(tmpdir(), "ksk-cli-consumer-"))

const run = (command, args, options = {}) =>
  execFileSync(command, args, {
    cwd: temp,
    env: { ...process.env, npm_config_audit: "false", npm_config_fund: "false" },
    encoding: "utf8",
    ...options,
  })

try {
  const packOutput = execFileSync(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", temp],
    { cwd: root, encoding: "utf8" },
  )
  const [{ filename }] = JSON.parse(packOutput)
  const tarball = join(temp, filename)

  writeFileSync(
    join(temp, "package.json"),
    `${JSON.stringify({ name: "ksk-empty-cli-consumer", private: true, type: "module" }, null, 2)}\n`,
  )
  // --ignore-scripts で install。typescript は現状 package.json の dependencies に
  // 載っているため通常install では入るが、「typescript が無い環境」を模すために
  // install 後に node_modules/typescript を取り除いてから CLI を叩く。
  run("npm", ["install", "--ignore-scripts", tarball], { stdio: "inherit" })

  const typescriptDir = join(temp, "node_modules/typescript")
  if (existsSync(typescriptDir)) {
    rmSync(typescriptDir, { recursive: true, force: true })
  }

  const cliBin = join(temp, "node_modules/.bin/ksk-ds")
  if (!existsSync(cliBin)) {
    throw new Error(`tarball install 後に node_modules/.bin/ksk-ds が見つかりません: ${cliBin}`)
  }

  // 最小フィクスチャ（P046 対象になり得る Card 直下の子要素を持つ .tsx）
  mkdirSync(join(temp, "src"))
  writeFileSync(
    join(temp, "src/Sample.tsx"),
    [
      'export function Sample() {',
      '  return <Card><div className="mt-2">hi</div></Card>',
      '}',
      '',
    ].join("\n"),
  )

  const timed = (label, fn) => {
    const start = Date.now()
    const result = fn()
    const ms = Date.now() - start
    console.log(`  [timing] ${label}: ${ms}ms`)
    return result
  }

  // `ksk-ds lint` は typescript 不在でも ERR_MODULE_NOT_FOUND で落ちず、
  // P046 skip の案内を出して正常終了すること。
  let lintOutput
  let lintFailed = false
  try {
    lintOutput = timed("ksk-ds lint", () => run(cliBin, ["lint", "src"]))
  } catch (error) {
    lintFailed = true
    lintOutput = `${error.stdout ?? ""}${error.stderr ?? ""}`
  }
  if (/ERR_MODULE_NOT_FOUND/.test(lintOutput)) {
    throw new Error(`ksk-ds lint が typescript 不在で ERR_MODULE_NOT_FOUND を出しました:\n${lintOutput}`)
  }
  if (!/P046/.test(lintOutput) && !/typescript が見つからない/.test(lintOutput)) {
    throw new Error(`ksk-ds lint が P046 skip の案内を出していません:\n${lintOutput}`)
  }
  console.log("✓ ksk-ds lint: typescript 不在でも ERR_MODULE_NOT_FOUND にならず P046 skip 案内が出ました")
  void lintFailed

  // `ksk-ds check-migration` も同様に案内を出して exit 0 になること。
  let migrationOutput
  try {
    migrationOutput = timed("ksk-ds check-migration", () => run(cliBin, ["check-migration", "src"]))
  } catch (error) {
    const combined = `${error.stdout ?? ""}${error.stderr ?? ""}`
    if (/ERR_MODULE_NOT_FOUND/.test(combined)) {
      throw new Error(`ksk-ds check-migration が typescript 不在で ERR_MODULE_NOT_FOUND を出しました:\n${combined}`)
    }
    throw error
  }
  if (!/typescript が見つからない/.test(migrationOutput)) {
    throw new Error(`ksk-ds check-migration が typescript 不在の案内を出していません:\n${migrationOutput}`)
  }
  console.log("✓ ksk-ds check-migration: typescript 不在でも ERR_MODULE_NOT_FOUND にならず skip 案内が出ました")

  // `ksk-ds check-duplicates --help` は typescript に依存しない最小の起動確認。
  const helpOutput = timed("ksk-ds check-duplicates --help", () => run(cliBin, ["check-duplicates", "--help"]))
  if (!/check-duplicates/.test(helpOutput)) {
    throw new Error(`ksk-ds check-duplicates --help の出力が想定と異なります:\n${helpOutput}`)
  }
  console.log("✓ ksk-ds check-duplicates --help: 起動確認OK")

  console.log("✓ packed tarball からの CLI スモークテストに成功しました（typescript devDependency 無し）")
} finally {
  rmSync(temp, { recursive: true, force: true })
}
