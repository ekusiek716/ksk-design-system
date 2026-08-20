#!/usr/bin/env node

// ksk-ds check-migration
// contracts/deprecations.json（正本台帳）に載っている非推奨 API が
// consumer のソースにどれだけ残っているかを数える read-only CLI。
//
//   npx ksk-ds check-migration ./src
//
// 検出は TypeScript の AST で行う（正規表現ではない）。
//   - kind=prop  : DS 由来のコンポーネントに付いた JSX 属性
//   - kind=export: DS 由来の import 指定子 / re-export 指定子
// コメント・文字列リテラル中の同名は AST 上そもそも識別子ではないため誤検出しない。
//
// 「DS 由来」の判定はローカル束縛を追う:
//   1. ksk-design-system（旧名 @ksk/design-system・サブパス含む）からの import
//   2. 相対 import 先のモジュールが DS からの re-export で同名を出している場合
//      （移行期に consumer が置く互換バレルを取りこぼさないため。import だけでなく
//        re-export も残件として数える、が要件）

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path"
import ts from "typescript"

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"])
const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
])

/** DS のパッケージ名（改名前も拾う）。サブパス import も対象。 */
const DS_PACKAGE_RE = /^(?:ksk-design-system|@ksk\/design-system)(?:\/.*)?$/

export function isDsSpecifier(specifier) {
  return DS_PACKAGE_RE.test(specifier)
}

// ─── 台帳 ───────────────────────────────────────────────────

export function loadDeprecations(pkgRoot) {
  const ledgerPath = resolve(pkgRoot, "contracts/deprecations.json")
  if (!existsSync(ledgerPath)) {
    throw new Error(`contracts/deprecations.json が見つかりません: ${ledgerPath}`)
  }
  const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"))
  return ledger.deprecations ?? []
}

// ─── ファイル収集 ───────────────────────────────────────────

export function collectSourceFiles(target) {
  const results = []
  const stat = statSync(target)
  if (stat.isFile()) return SOURCE_EXTENSIONS.has(extname(target)) ? [target] : []

  const stack = [target]
  while (stack.length > 0) {
    const current = stack.pop()
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) continue
        stack.push(full)
        continue
      }
      if (SOURCE_EXTENSIONS.has(extname(entry.name))) results.push(full)
    }
  }
  return results.sort()
}

function parse(file, source) {
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind(file))
}

function scriptKind(file) {
  const ext = extname(file)
  if (ext === ".tsx" || ext === ".jsx") return ts.ScriptKind.TSX
  if (ext === ".js" || ext === ".mjs" || ext === ".cjs") return ts.ScriptKind.JS
  return ts.ScriptKind.TS
}

// ─── 相対 import の解決 ─────────────────────────────────────

const RESOLVE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]

function resolveRelative(fromFile, specifier) {
  const base = resolve(dirname(fromFile), specifier)
  const stripped = base.replace(/\.(m|c)?jsx?$/, "")
  const candidates = [
    base,
    ...RESOLVE_EXTENSIONS.map((ext) => `${stripped}${ext}`),
    ...RESOLVE_EXTENSIONS.map((ext) => join(base, `index${ext}`)),
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

// ─── モジュールごとの「DS 由来 re-export」解析 ──────────────

/**
 * ファイルが「その名前を DS 由来として外へ出している」かを判定できるようにする。
 *
 * 返り値:
 *   { names: Set<string>, wildcardFromDs: boolean, wildcardRelative: string[] }
 */
function analyzeReExports(file, sourceFile) {
  const names = new Set()
  const relativeReExports = [] // { local: string|null, exported: string, from: string }
  let wildcardFromDs = false
  const wildcardRelative = []
  const dsImportedLocals = new Map() // local 名 → 元の export 名（DS からの import）

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const spec = statement.moduleSpecifier.text
      if (!isDsSpecifier(spec)) continue
      const bindings = statement.importClause?.namedBindings
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) {
          dsImportedLocals.set(
            element.name.text,
            (element.propertyName ?? element.name).text,
          )
        }
      }
      continue
    }

    if (!ts.isExportDeclaration(statement)) continue
    const spec =
      statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
        ? statement.moduleSpecifier.text
        : null

    // export * from "..."
    if (!statement.exportClause) {
      if (spec && isDsSpecifier(spec)) wildcardFromDs = true
      else if (spec && spec.startsWith(".")) wildcardRelative.push(spec)
      continue
    }
    if (!ts.isNamedExports(statement.exportClause)) continue

    for (const element of statement.exportClause.elements) {
      const original = (element.propertyName ?? element.name).text
      if (spec && isDsSpecifier(spec)) {
        names.add(original)
        names.add(element.name.text)
      } else if (spec && spec.startsWith(".")) {
        relativeReExports.push({ original, exported: element.name.text, from: spec })
      } else if (!spec && dsImportedLocals.has(original)) {
        // import { X } from "ksk-design-system"; export { X }
        names.add(dsImportedLocals.get(original))
        names.add(element.name.text)
      }
    }
  }

  return { file, names, wildcardFromDs, wildcardRelative, relativeReExports }
}

/**
 * モジュールが name を DS 由来で re-export しているかを、相対経路を辿って判定する。
 * 循環は visited で打ち切る。
 */
function reExportsFromDs(file, name, modules, visited = new Set()) {
  if (visited.has(file)) return false
  visited.add(file)
  const info = modules.get(file)
  if (!info) return false
  if (info.wildcardFromDs) return true
  if (info.names.has(name)) return true
  for (const entry of info.relativeReExports) {
    if (entry.exported !== name) continue
    const target = resolveRelative(file, entry.from)
    if (target && reExportsFromDs(target, entry.original, modules, visited)) return true
  }
  for (const spec of info.wildcardRelative) {
    const target = resolveRelative(file, spec)
    if (target && reExportsFromDs(target, name, modules, visited)) return true
  }
  return false
}

// ─── 1 ファイルの検査 ───────────────────────────────────────

/**
 * ファイル内の「DS 由来として束縛されたローカル名 → DS の export 名」を作る。
 */
function dsBindings(file, sourceFile, modules) {
  const bindings = new Map()
  const namespaces = new Set()

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue
    const spec = statement.moduleSpecifier.text
    const fromDs = isDsSpecifier(spec)
    const relativeTarget = spec.startsWith(".") ? resolveRelative(file, spec) : null
    if (!fromDs && !relativeTarget) continue

    const clause = statement.importClause
    if (!clause) continue
    const named = clause.namedBindings

    if (named && ts.isNamespaceImport(named)) {
      if (fromDs) namespaces.add(named.name.text)
      continue
    }
    if (named && ts.isNamedImports(named)) {
      for (const element of named.elements) {
        const original = (element.propertyName ?? element.name).text
        if (fromDs) {
          bindings.set(element.name.text, original)
        } else if (relativeTarget && reExportsFromDs(relativeTarget, original, modules)) {
          bindings.set(element.name.text, original)
        }
      }
    }
  }

  return { bindings, namespaces }
}

/** `<Foo.Bar prop />` の基底名（Foo）と全体名を返す */
function tagNames(tagName) {
  if (ts.isIdentifier(tagName)) return { base: tagName.text, full: tagName.text }
  if (ts.isPropertyAccessExpression(tagName)) {
    let node = tagName
    while (ts.isPropertyAccessExpression(node.expression)) node = node.expression
    const base = ts.isIdentifier(node.expression) ? node.expression.text : null
    return { base, full: tagName.getText() }
  }
  return { base: null, full: null }
}

function scanFile(file, sourceFile, deprecations, modules) {
  const { bindings, namespaces } = dsBindings(file, sourceFile, modules)
  const findings = []

  const propEntries = deprecations.filter((d) => d.kind === "prop")
  const exportEntries = deprecations.filter((d) => d.kind === "export")

  const lineOf = (node) =>
    sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1

  // ── kind=prop: JSX 属性 ──────────────────────────────
  const visitJsx = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const { base, full } = tagNames(node.tagName)
      if (base) {
        // Foo / DS.Foo のどちらでも、DS の export 名に解決した名前で照合する
        let dsName = null
        if (bindings.has(base) && full === base) dsName = bindings.get(base)
        else if (namespaces.has(base) && full) dsName = full.slice(base.length + 1)

        if (dsName) {
          for (const attr of node.attributes.properties) {
            if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) continue
            for (const entry of propEntries) {
              if (entry.component !== dsName || entry.prop !== attr.name.text) continue
              findings.push({ file, line: lineOf(attr), id: entry.id, usage: "prop", entry })
            }
          }
        }
      }
    }
    ts.forEachChild(node, visitJsx)
  }
  ts.forEachChild(sourceFile, visitJsx)

  // ── kind=export: import / re-export ──────────────────
  if (exportEntries.length > 0) {
    const byIdentifier = new Map(exportEntries.map((e) => [e.identifier, e]))

    for (const statement of sourceFile.statements) {
      if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
        const spec = statement.moduleSpecifier.text
        const relativeTarget = spec.startsWith(".") ? resolveRelative(file, spec) : null
        if (!isDsSpecifier(spec) && !relativeTarget) continue
        const named = statement.importClause?.namedBindings
        if (!named || !ts.isNamedImports(named)) continue
        for (const element of named.elements) {
          const original = (element.propertyName ?? element.name).text
          const entry = byIdentifier.get(original)
          if (!entry) continue
          if (
            isDsSpecifier(spec) ||
            (relativeTarget && reExportsFromDs(relativeTarget, original, modules))
          ) {
            findings.push({ file, line: lineOf(element), id: entry.id, usage: "import", entry })
          }
        }
        continue
      }

      if (!ts.isExportDeclaration(statement)) continue
      const spec =
        statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
          ? statement.moduleSpecifier.text
          : null
      if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue
      for (const element of statement.exportClause.elements) {
        const original = (element.propertyName ?? element.name).text
        const entry = byIdentifier.get(original)
        if (!entry) continue
        const relativeTarget = spec && spec.startsWith(".") ? resolveRelative(file, spec) : null
        const fromDs =
          (spec && isDsSpecifier(spec)) ||
          (relativeTarget && reExportsFromDs(relativeTarget, original, modules)) ||
          (!spec && bindings.has(original))
        if (fromDs) {
          findings.push({ file, line: lineOf(element), id: entry.id, usage: "re-export", entry })
        }
      }
    }
  }

  return findings
}

// ─── 検査本体 ───────────────────────────────────────────────

/**
 * @returns {{ total: number, findings: Array, byIdentifier: Array<{id, count, replacement, removeIn}>, byFile: Array<{file, count}>, filesScanned: number }}
 */
export function checkMigration(target, deprecations, { cwd = process.cwd() } = {}) {
  const files = collectSourceFiles(target)
  const parsed = new Map()
  const modules = new Map()

  for (const file of files) {
    const sourceFile = parse(file, readFileSync(file, "utf8"))
    parsed.set(file, sourceFile)
    modules.set(file, analyzeReExports(file, sourceFile))
  }

  const findings = []
  for (const file of files) {
    findings.push(...scanFile(file, parsed.get(file), deprecations, modules))
  }

  const counts = new Map()
  for (const finding of findings) {
    counts.set(finding.id, (counts.get(finding.id) ?? 0) + 1)
  }
  const byIdentifier = deprecations
    .filter((d) => counts.has(d.id))
    .map((d) => ({
      id: d.id,
      count: counts.get(d.id),
      replacement: d.replacement,
      removeIn: d.removeIn,
    }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))

  const fileCounts = new Map()
  for (const finding of findings) {
    const rel = displayPath(finding.file, cwd)
    fileCounts.set(rel, (fileCounts.get(rel) ?? 0) + 1)
  }
  const byFile = [...fileCounts.entries()]
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file))

  return {
    total: findings.length,
    findings,
    byIdentifier,
    byFile,
    filesScanned: files.length,
  }
}

function displayPath(file, cwd) {
  const rel = relative(cwd, file)
  return rel.startsWith("..") || isAbsolute(rel) ? file : rel
}

// ─── CLI ────────────────────────────────────────────────────

export function runCheckMigrationCli(
  argv,
  { cwd = process.cwd(), pkgRoot = resolve("."), deprecations } = {},
) {
  const options = parseArgs(argv)
  if (options.help) {
    printHelp()
    return 0
  }

  const target = resolve(cwd, options.target)
  if (!existsSync(target)) {
    console.error(`検査対象が見つかりません: ${target}`)
    return 1
  }

  let entries
  try {
    entries = deprecations ?? loadDeprecations(pkgRoot)
  } catch (error) {
    console.error(String(error.message ?? error))
    return 1
  }

  const result = checkMigration(target, entries, { cwd })

  if (options.format === "json") {
    console.log(
      JSON.stringify(
        {
          total: result.total,
          filesScanned: result.filesScanned,
          byIdentifier: result.byIdentifier,
          byFile: result.byFile,
          findings: result.findings.map((f) => ({
            file: displayPath(f.file, cwd),
            line: f.line,
            id: f.id,
            usage: f.usage,
          })),
        },
        null,
        2,
      ),
    )
    return result.total > 0 ? 1 : 0
  }

  printFindings(result, entries, cwd)
  return result.total > 0 ? 1 : 0
}

function parseArgs(argv) {
  let help = false
  let format = "text"
  let target = "./src"

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      help = true
      continue
    }
    if (arg === "--format=json" || arg === "--json") {
      format = "json"
      continue
    }
    if (!arg.startsWith("-")) target = arg
  }

  return { help, format, target }
}

function printFindings(result, entries, cwd) {
  if (result.total === 0) {
    console.log(
      `ksk-ds check-migration: 非推奨 API の残存はありません（${result.filesScanned} files / 台帳 ${entries.length} 件）`,
    )
    return
  }

  console.log(
    `ksk-ds check-migration: 非推奨 API の残存を ${result.total} 件検出しました（${result.filesScanned} files）`,
  )

  console.log(`\n識別子別:`)
  for (const item of result.byIdentifier) {
    console.log(`  ${String(item.count).padStart(4)}  ${item.id}`)
    console.log(`        → ${item.replacement}（v${item.removeIn} で削除予定）`)
  }

  console.log(`\nファイル別:`)
  for (const item of result.byFile) {
    console.log(`  ${String(item.count).padStart(4)}  ${item.file}`)
  }

  console.log(`\n検出箇所:`)
  for (const finding of result.findings) {
    console.log(`  ${displayPath(finding.file, cwd)}:${finding.line} ${finding.id} (${finding.usage})`)
  }

  console.log(`\n移行手順は MIGRATION.md の「非推奨 API 一覧」節を参照してください。`)
  console.log(`残件が 0 になったバージョンで DS 側の互換コードを削除できます。`)
}

function printHelp() {
  console.log(`ksk-ds check-migration

使い方:
  ksk-ds check-migration [DIR]
  ksk-ds check-migration [DIR] --format=json

DIR の既定値:
  ./src

動作:
  contracts/deprecations.json の非推奨 API が DIR 配下に残っていないかを
  TypeScript の AST で数えます（コメント・文字列は誤検出しません）。
  DS からの import に加え、相対 import 経由の re-export も残件として数えます。
  完全 read-only。残件があれば終了コード 1（CI で使えます）。
`)
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)

if (invokedDirectly) {
  const pkgRoot = resolve(dirname(new URL(import.meta.url).pathname), "..")
  // process.exit() は stdout がパイプのとき未フラッシュ分を捨てる（issue #394）。
  // ここはモジュール末尾なので exitCode を立てれば、自然終了時に出力が掃かれる。
  process.exitCode = runCheckMigrationCli(process.argv.slice(2), { cwd: process.cwd(), pkgRoot })
}
