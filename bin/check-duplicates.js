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
  const results = files.map((file) => findDuplicateExports(file, cwd, registry))
  const findings = results
    .flatMap((result) => result.findings)
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.name.localeCompare(b.name))
  const wrapperExclusions = results
    .flatMap((result) => result.wrapperExclusions)
    .sort((a, b) => a.file.localeCompare(b.file) || a.name.localeCompare(b.name))

  printFindings(findings, wrapperExclusions, files.length, options.strict)
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

  const add = (name, tier, path) => {
    if (typeof name !== "string" || name.length === 0) return
    const matches = registry.get(name) ?? []
    matches.push({ tier, path })
    registry.set(name, matches)
  }

  for (const tier of ["ui", "patterns", "commerce", "admin", "shells"]) {
    for (const component of contracts[tier] ?? []) {
      if (typeof component?.name !== "string" || typeof component?.path !== "string") continue

      // contracts の name は「import できる名前」とは限らない。
      // `exported: false` は実装ファイル名 / グループ名 / 型のみの export で、
      // その名前で import することはできない。ここに登録してしまうと、
      // consumer のローカル実装を「DS にある」と誤検知し、存在しない export を
      // import しろと案内してしまう。実際に import できる名前だけを登録する。
      if (component.exported === false) {
        for (const sub of component.subcomponents ?? []) add(sub, tier, component.path)
        continue
      }

      add(component.exportedAs ?? component.name, tier, component.path)
      for (const alias of component.aliases ?? []) add(alias, tier, component.path)
      for (const alias of component.deprecatedAliases ?? []) add(alias, tier, component.path)
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

// ksk-design-system 本体（サブパス含む）からの named import/re-export かどうか。
// 例: "ksk-design-system", "ksk-design-system/native", "ksk-design-system/native/ui"
function isDsModuleSpecifier(moduleSpecifier) {
  return moduleSpecifier === "ksk-design-system" || moduleSpecifier.startsWith("ksk-design-system/")
}

// `{ A, B as C, type D }` のような specifier リストを
// [{ sourceName: "A", localName: "A" }, { sourceName: "B", localName: "C" }, ...] に分解する。
// エイリアス判定は「import 指定子の imported 名（sourceName）」を用いる。ローカル名（localName）は問わない。
function parseSpecifierList(specifierList) {
  return specifierList
    .split(",")
    .map((spec) => spec.trim())
    .filter((spec) => spec.length > 0)
    .map((spec) => {
      const withoutTypeModifier = spec.replace(/^type\s+/, "")
      const [sourceName, localName] = withoutTypeModifier.split(/\s+as\s+/).map((part) => part.trim())
      return { sourceName, localName: localName ?? sourceName }
    })
    .filter((entry) => entry.sourceName)
}

// import/re-export 検出はコメントを除外してから行う（JSDoc の使用例コメント
// `* import { X } from "ksk-design-system"` を実コードの import と誤認しないため）。
// 文字列リテラル内の `/* `等までは考慮しないが、このファイル全体の regex ベース方針と
// 整合する範囲の簡易対応とする。
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")
}

// このファイルが ksk-design-system から named import している「imported 名（sourceName）」の集合。
// `import { EmptyState as DSEmptyState } from 'ksk-design-system/native/ui'` なら "EmptyState"。
// ローカルの alias 名（DSEmptyState）ではなく、パッケージ側の元の名前で判定する。
function collectDsImportSourceNames(source) {
  const names = new Set()
  const importPattern = /import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g

  for (const match of source.matchAll(importPattern)) {
    const [, specifierList, moduleSpecifier] = match
    if (!isDsModuleSpecifier(moduleSpecifier)) continue
    for (const { sourceName } of parseSpecifierList(specifierList)) {
      names.add(sourceName)
    }
  }

  return names
}

// `export { X as Y } from 'ksk-design-system/...'` のような re-export 形式。
// これは常に DS の実装をそのまま右から左へ渡すだけなので、localName が
// registry と一致する場合は無条件でラッパー（除外対象）として扱う。
function collectDsReExports(source) {
  const reExports = []
  const reExportPattern = /export\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g

  for (const match of source.matchAll(reExportPattern)) {
    const [, specifierList, moduleSpecifier] = match
    if (!isDsModuleSpecifier(moduleSpecifier)) continue
    for (const { localName } of parseSpecifierList(specifierList)) {
      reExports.push(localName)
    }
  }

  return reExports
}

function findDuplicateExports(file, cwd, registry) {
  const source = readFileSync(file, "utf8")
  const lines = source.split(/\r?\n/)
  const findings = []
  const wrapperExclusions = []
  const relFile = normalize(relative(cwd, file))

  const codeForImportScan = stripComments(source)
  const dsImportSourceNames = collectDsImportSourceNames(codeForImportScan)
  const dsReExportLocalNames = collectDsReExports(codeForImportScan)

  const declarationPattern =
    /^\s*export\s+(?:default\s+)?(?:(?:async|declare)\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9]*)\b/

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(declarationPattern)
    if (!match) continue
    const name = match[1]
    const components = registry.get(name)
    if (!components) continue

    // 同名のローカル宣言があっても、同ファイルが ksk-design-system から同名（元の
    // export 名基準。ローカル alias は問わない）を import して使っているなら、
    // DS 委譲ラッパーとして重複報告から除外する（DS が推奨する段階移行の型のため）。
    if (dsImportSourceNames.has(name)) {
      wrapperExclusions.push({ file: relFile, name })
      continue
    }

    findings.push({
      components,
      file: relFile,
      line: index + 1,
      name,
    })
  }

  // `export { X as Y } from 'ksk-design-system/...'` 形式の re-export。
  // registry と一致する localName だけを対象にする（DS に無い名前の re-export は無関係）。
  for (const localName of dsReExportLocalNames) {
    if (!registry.get(localName)) continue
    wrapperExclusions.push({ file: relFile, name: localName })
  }

  return { findings, wrapperExclusions }
}

function printFindings(findings, wrapperExclusions, scannedFiles, strict) {
  if (findings.length === 0) {
    console.log(`ksk-ds check-duplicates: 重複候補はありません（${scannedFiles} files）`)
  } else {
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

  if (wrapperExclusions.length > 0) {
    console.log(`\nℹ ラッパー（DS 委譲済み）として除外: ${wrapperExclusions.length} 件`)
    for (const wrapper of wrapperExclusions) {
      console.log(`  ℹ ラッパー（DS 委譲済み）として除外: ${wrapper.name} (${wrapper.file})`)
    }
  }
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
  ただし、同ファイルが ksk-design-system から同名（alias 可）を import/re-export して
  使っているものは DS 委譲ラッパーとみなし、重複報告から除外します（info 行で件数報告）。
  既定は助言モード（常に exit 0）、--strict は検出時 exit 1 です。
`)
}

function normalize(path) {
  return path.split("\\").join("/")
}
