#!/usr/bin/env node
// =============================================================
// KSK Design System — flex row の潰れ/はみ出し検査（issue #293 系）
//
// flex 行（flex-col でない flex コンテナ）では、各アイテムの基準幅が
// 内容幅 (auto) のため、兄弟の幅次第でテキストが min-content 未満まで
// 潰れて 1 文字ずつ折り返したり、固定サイズ要素が縮んで歪んだりする。
//
// 検査ルール:
//   KFX001 (error)   flex 行内に shrink-0 のアイテムがあるとき、min-w-0 を
//                    持つ兄弟テキストアイテムに flex-1 / grow / basis が無い
//                    （= #293 の ActionTile description 潰れの再発パターン）
//   KFX002 (advisory) flex 行内の固定サイズ要素（size-* / h-* / w-*）に
//                    shrink-0 / flex-none が無い（stract-ui CGC003 逆輸入）
//
// className は TypeScript AST で解析し、三項演算子・&&・cn() の分岐を
// 展開した各バリアントに対して検査する（grep では条件分岐内を見逃すため）。
//
// 例外は対象行の直前に理由付きコメントを置く:
//   {/* ksk-lint-ignore KFX001 -- meta はアイコン1文字で潰れ得ない */}
//   // ksk-lint-ignore KFX002 -- 装飾ドットは縮んでよい
//
// 実行: node scripts/check-flex-shrink.mjs [--strict]
//   advisory (KFX002) は表示のみで CI は通過。--strict で fail させる。
// =============================================================
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, dirname, relative } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const strict = process.argv.includes("--strict")
const cliFiles = process.argv.slice(2).filter((a) => !a.startsWith("--"))

const tsxFiles = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      walk(p)
      continue
    }
    // .stories.tsx はデモ専用（極端な値の実演を含む）ため対象外。
    if (/\.tsx$/.test(name) && !/\.stories\.tsx$/.test(name)) tsxFiles.push(p)
  }
}
if (cliFiles.length) tsxFiles.push(...cliFiles)
else walk(join(root, "src"))

// ─── className の静的バリアント展開 ───
// 条件分岐（三項 / && / cn() / cva の直引数）を展開し、取りうるクラス列の
// 組み合わせを返す。動的合成（`bg-${x}`）は generate-source-safelist が
// 別途エラーにするためここでは無視する。
function classVariants(node) {
  if (!node) return [""]
  if (ts.isJsxExpression(node)) return classVariants(node.expression)
  if (ts.isParenthesizedExpression(node)) return classVariants(node.expression)
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [node.text]
  if (ts.isConditionalExpression(node)) {
    return [...classVariants(node.whenTrue), ...classVariants(node.whenFalse)]
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) {
    return ["", ...classVariants(node.right)]
  }
  if (ts.isCallExpression(node)) {
    return node.arguments.reduce(
      (variants, arg) => variants.flatMap((base) => classVariants(arg).map((v) => `${base} ${v}`)),
      [""],
    )
  }
  return [""]
}

function classAttrOf(opening) {
  return opening.attributes?.properties.find(
    (p) => ts.isJsxAttribute(p) && p.name.getText() === "className",
  )
}

function variantsOf(opening) {
  const attr = classAttrOf(opening)
  return attr?.initializer ? classVariants(attr.initializer) : [""]
}

const has = (variant, re) => re.test(variant)
const FLEX = /(?:^|\s)(?:inline-)?flex(?=\s|$)/
const FLEX_COL = /(?:^|\s)flex-col(?:-reverse)?(?=\s|$)/
const FLEX_WRAP = /(?:^|\s)flex-wrap(?=\s|$)/
const SHRINK0 = /(?:^|\s)(?:shrink-0|flex-none)(?=\s|$)/
const MIN_W_0 = /(?:^|\s)min-w-0(?=\s|$)/
const GROWS = /(?:^|\s)(?:flex-1|flex-auto|grow(?:-\[?[1-9])?|grow(?=\s|$)|basis-(?!auto)[\w[\]%/.-]+|min-w-\[[^\]]+\]|w-full)(?=\s|$)/
const FIXED_SIZE = /(?:^|\s)(?:size|h|w)-(?:[1-9]\d*(?:\.5)?|px|\[[^\]]+\])(?=\s|$)/

// ─── 理由付き ignore ───
function isIgnored(lines, lineIdx, rule) {
  for (let i = lineIdx - 1; i >= Math.max(0, lineIdx - 2); i--) {
    const l = lines[i]
    if (l.includes("ksk-lint-ignore") && l.includes(rule)) {
      if (!l.includes("--")) return "missing-reason"
      return "ignored"
    }
  }
  return null
}

const findings = []
function report(file, lines, line, rule, severity, message) {
  const ig = isIgnored(lines, line - 1, rule)
  if (ig === "ignored") return
  if (ig === "missing-reason") {
    findings.push({ file, line, rule, severity: "error", message: `ksk-lint-ignore に理由（-- 以降）が必要: ${message}` })
    return
  }
  findings.push({ file, line, rule, severity, message })
}

for (const file of tsxFiles) {
  const text = readFileSync(file, "utf8")
  const lines = text.split(/\r?\n/)
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const rel = relative(root, file)

  function visit(node) {
    if (ts.isJsxElement(node)) {
      const parentVariants = variantsOf(node.openingElement)
      const isRow = parentVariants.some(
        (v) => has(v, FLEX) && !has(v, FLEX_COL) && !has(v, FLEX_WRAP),
      )
      if (isRow) {
        const children = node.children.filter(
          (c) => ts.isJsxElement(c) || ts.isJsxSelfClosingElement(c),
        )
        const childInfo = children.map((c) => {
          const opening = ts.isJsxElement(c) ? c.openingElement : c
          const variants = variantsOf(opening)
          const line = source.getLineAndCharacterOfPosition(c.getStart(source)).line + 1
          return { variants, line }
        })
        const hasShrink0Sibling = childInfo.some((c) => c.variants.some((v) => has(v, SHRINK0)))
        for (const c of childInfo) {
          // KFX001: shrink-0 兄弟がいる行で min-w-0 だけのアイテムは
          // min-content 未満まで潰され 1 文字折り返しになる (#293)。
          if (
            hasShrink0Sibling &&
            c.variants.some((v) => has(v, MIN_W_0) && !has(v, SHRINK0) && !has(v, GROWS))
          ) {
            report(rel, lines, c.line, "KFX001", "error",
              "shrink-0 の兄弟がいる flex 行で min-w-0 のみの要素は潰れる。flex-1（または min-w-[...] 下限）を併記する")
          }
          // KFX002: 固定サイズ要素は縮むと歪む。shrink-0 を明示する。
          if (
            c.variants.some((v) => has(v, FIXED_SIZE) && !has(v, SHRINK0) && !has(v, GROWS))
          ) {
            report(rel, lines, c.line, "KFX002", "advisory",
              "flex 行内の固定サイズ要素に shrink-0 が必要か確認する")
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}

for (const f of findings) {
  const label = f.severity === "error" ? "ERROR" : "ADVISORY"
  console.error(`[${label}] ${f.file}:${f.line} ${f.rule} ${f.message}`)
}
const errors = findings.filter((f) => f.severity === "error")
const advisories = findings.length - errors.length
if (errors.length || (strict && advisories)) {
  console.error(`\n✗ flex-shrink: error ${errors.length}件 / advisory ${advisories}件${strict ? "（--strict）" : ""}`)
  process.exit(1)
}
console.log(`✓ flex-shrink: error 0件 / advisory ${advisories}件（advisory は助言モード / CI は通過）`)
