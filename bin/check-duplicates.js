import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { extname, join, relative, resolve } from "node:path"

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"])
const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
])

export function runCheckDuplicatesCli(
  argv,
  { cwd = process.cwd(), pkgRoot = resolve(".") } = {},
) {
  const options = parseArgs(argv)
  if (options.help) {
    printHelp()
    return 0
  }

  const contractsPath = resolve(pkgRoot, "contracts/components.json")
  if (!existsSync(contractsPath)) {
    console.error(`contracts/components.json が見つかりません: ${contractsPath}`)
    return 1
  }

  const target = resolve(cwd, options.target)
  if (!existsSync(target)) {
    console.error(`検査対象が見つかりません: ${target}`)
    return 1
  }

  const registry = loadComponentRegistry(contractsPath)
  const files = collectSourceFiles(target)
  const findings = files
    .flatMap((file) => findDuplicateExports(file, cwd, registry))
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.name.localeCompare(b.name))

  printFindings(findings, files.length, options.strict)
  return options.strict && findings.length > 0 ? 1 : 0
}

function parseArgs(argv) {
  let strict = false
  let help = false
  let target = "./src"

  for (const arg of argv) {
    if (arg === "--strict") {
      strict = true
      continue
    }
    if (arg === "--help" || arg === "-h") {
      help = true
      continue
    }
    if (!arg.startsWith("-")) target = arg
  }

  return { help, strict, target }
}

function loadComponentRegistry(contractsPath) {
  const contracts = JSON.parse(readFileSync(contractsPath, "utf8"))
  const registry = new Map()

  for (const tier of ["ui", "patterns", "commerce", "admin", "shells"]) {
    for (const component of contracts[tier] ?? []) {
      if (typeof component?.name !== "string" || typeof component?.path !== "string") continue
      const matches = registry.get(component.name) ?? []
      matches.push({ tier, path: component.path })
      registry.set(component.name, matches)
    }
  }

  return registry
}

function collectSourceFiles(target) {
  const files = []

  function walk(path) {
    const stat = statSync(path)
    if (stat.isDirectory()) {
      for (const entry of readdirSync(path, { withFileTypes: true })) {
        if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue
        walk(join(path, entry.name))
      }
      return
    }
    if (stat.isFile() && SOURCE_EXTENSIONS.has(extname(path))) files.push(path)
  }

  walk(target)
  return files.sort()
}

function findDuplicateExports(file, cwd, registry) {
  const source = readFileSync(file, "utf8")
  const lines = source.split(/\r?\n/)
  const findings = []
  const declarationPattern =
    /^\s*export\s+(?:default\s+)?(?:(?:async|declare)\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9]*)\b/

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(declarationPattern)
    if (!match) continue
    const name = match[1]
    const components = registry.get(name)
    if (!components) continue
    findings.push({
      components,
      file: normalize(relative(cwd, file)),
      line: index + 1,
      name,
    })
  }

  return findings
}

function printFindings(findings, scannedFiles, strict) {
  if (findings.length === 0) {
    console.log(`ksk-ds check-duplicates: 重複候補はありません（${scannedFiles} files）`)
    return
  }

  console.log(`ksk-ds check-duplicates: DS と同名のローカル実装を ${findings.length} 件検出しました`)
  for (const finding of findings) {
    console.log(`\n${finding.file}:${finding.line} ${finding.name}`)
    for (const component of finding.components) {
      console.log(`  DS: ${component.tier} / ${component.path}`)
    }
  }
  console.log("\nローカル実装を削除して ksk-design-system から import できないか確認してください。")
  console.log("DS に必要な機能が不足する場合は、ローカル台帳を作らず DS 側に Issue を登録してください。")
  console.log(
    strict
      ? "strict mode: 重複候補があるため終了コード 1"
      : "advice mode: 終了コード 0（CI で失敗させる場合は --strict）",
  )
}

function printHelp() {
  console.log(`ksk-ds check-duplicates

使い方:
  ksk-ds check-duplicates [DIR]
  ksk-ds check-duplicates [DIR] --strict

DIR の既定値:
  ./src

動作:
  export function / export const の PascalCase 宣言を
  contracts/components.json と名前の完全一致で照合します。
  既定は助言モード（常に exit 0）、--strict は検出時 exit 1 です。
`)
}

function normalize(path) {
  return path.split("\\").join("/")
}
