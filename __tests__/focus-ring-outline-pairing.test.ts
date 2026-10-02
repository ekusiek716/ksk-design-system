import { describe, expect, it } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * issue #597: `focus-visible:ring-*` / `focus:ring-*` で自前のフォーカスリングを
 * 出す箇所は、同じ className（`cn()`/`clsx()`/`cva()` 呼び出し、または単一の
 * 文字列リテラル）の中で outline を消す指定とセットにすること。無いと UA 既定の
 * outline と DS のリングが二重に表示される（ListItem / ShareButtons / SkipLink で
 * 実際に発生した）。
 *
 * - ring トリガー: `focus-visible:ring-<width>` / `focus:ring-<width>`
 *   （`<width>` は `[...]` の任意値か数字）。`ring-0` はリングを消す上書きであり
 *   新たなリングを出さないため対象外（button.tsx の JSDoc 例に実例あり）。
 * - outline 解除とみなすのは `outline-none` / `outline-hidden` そのもの、または
 *   `focus:` / `focus-visible:` を前置したもの。`hover:outline-none` のように
 *   無関係な pseudo-class を前置したものは対象外（効くタイミングが違う）。
 * - `cn("outline-none ...", cond && "...ring...")` のように、ペアが同じ呼び出し内で
 *   複数の文字列引数に分かれているケース（例: checkbox-card.tsx）も許容するため、
 *   判定単位は「文字列リテラル単体」ではなく「それを含む cn()/clsx()/cva() 呼び出し全体」。
 *   それらで包まれていない素の className="...ring..." は文字列リテラル単体で判定する。
 */

const ROOT = process.cwd()
const TARGET_DIRS = ["src/components", "src/lib/server-variants"]
const EXCLUDE_SUFFIXES = [".stories.tsx", ".test.tsx", ".test.ts", ".d.ts"]
const CALL_NAMES = ["cn", "clsx", "cva"]

function collectFiles(dir: string): string[] {
  const files: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      files.push(...collectFiles(full))
      continue
    }
    if (!/\.(tsx|ts)$/.test(name)) continue
    if (EXCLUDE_SUFFIXES.some((suffix) => name.endsWith(suffix))) continue
    files.push(full)
  }
  return files
}

// 行コメント・ブロックコメントを空白化する（文字列リテラルは保持）。
function stripComments(source: string): string {
  let out = ""
  let i = 0
  let inString: '"' | "'" | "`" | null = null
  while (i < source.length) {
    const ch = source[i]
    const next = source[i + 1]
    if (inString) {
      out += ch
      if (ch === "\\") {
        out += next ?? ""
        i += 2
        continue
      }
      if (ch === inString) inString = null
      i += 1
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch
      out += ch
      i += 1
      continue
    }
    if (ch === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") i += 1
      continue
    }
    if (ch === "/" && next === "*") {
      i += 2
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i += 1
      i += 2
      continue
    }
    out += ch
    i += 1
  }
  return out
}

interface Call {
  text: string
}

/** `cn(...)` / `clsx(...)` / `cva(...)` 呼び出しを、文字列中の括弧に惑わされずに丸ごと抽出する。 */
function extractCalls(source: string, names: string[]): Call[] {
  const calls: Call[] = []
  const callRe = new RegExp(`\\b(?:${names.join("|")})\\s*\\(`, "g")
  for (const match of source.matchAll(callRe)) {
    const start = match.index! + match[0].length - 1 // '(' の位置
    let depth = 0
    let i = start
    let inString: '"' | "'" | "`" | null = null
    for (; i < source.length; i += 1) {
      const ch = source[i]
      if (inString) {
        if (ch === "\\") {
          i += 1
          continue
        }
        if (ch === inString) inString = null
        continue
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch
        continue
      }
      if (ch === "(") depth += 1
      else if (ch === ")") {
        depth -= 1
        if (depth === 0) break
      }
    }
    calls.push({ text: source.slice(start, i + 1) })
  }
  return calls
}

/**
 * 深さ（`()` `[]` `{}`）を文字列を無視して追跡しながら、`,` で分割する汎用ヘルパー。
 * 文字列リテラル内の `,` やネストした括弧内の `,` では分割しない。
 */
function splitTopLevelByComma(text: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ""
  let inString: '"' | "'" | "`" | null = null
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    if (inString) {
      current += ch
      if (ch === "\\") {
        current += text[i + 1] ?? ""
        i += 1
        continue
      }
      if (ch === inString) inString = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch
      current += ch
      continue
    }
    if (ch === "(" || ch === "[" || ch === "{") depth += 1
    if (ch === ")" || ch === "]" || ch === "}") depth -= 1
    if (ch === "," && depth === 0) {
      parts.push(current)
      current = ""
      continue
    }
    current += ch
  }
  if (current.trim().length > 0) parts.push(current)
  return parts
}

/**
 * 1つの引数テキストから文字列リテラルをプレースホルダに置換し、
 * `? <string> : <string>` の三項演算子パターン（排他的に1つしか採用されない分岐）を
 * 検出する。三項演算子の分岐はベースライン（常に含まれる文字列）に含めず、
 * 分岐ごとに個別の組として返す（list-item.tsx の compact/通常ブランチのような、
 * 片方だけ outline-none を消しても検出できるようにするため）。
 */
function analyzeArgument(argText: string): { baseline: string; ternaryBranches: [string, string][] } {
  const literals: string[] = []
  const tokenized = argText.replace(STRING_LITERAL_RE, (literal) => {
    const id = literals.length
    literals.push(literal)
    return `__STR${id}__`
  })

  const ternaryBranches: [string, string][] = []
  const usedTokenIds = new Set<number>()
  const TERNARY_RE = /\?\s*__STR(\d+)__\s*:\s*__STR(\d+)__/g
  for (const match of tokenized.matchAll(TERNARY_RE)) {
    const idA = Number(match[1])
    const idB = Number(match[2])
    ternaryBranches.push([literals[idA], literals[idB]])
    usedTokenIds.add(idA)
    usedTokenIds.add(idB)
  }

  const baseline = literals.filter((_, id) => !usedTokenIds.has(id)).join(" ")
  return { baseline, ternaryBranches }
}

const STRING_LITERAL_RE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/gs

// focus(-visible):ring-<width> のうち、<width> が "0"（リングを消す上書き）のものは
// 新たなリングを出さないので対象外。[...] 任意値か数字のみを「幅」として扱う。
const RING_TRIGGER_RE = /\bfocus(?:-visible)?:ring-(\[[^\]]*\]|\d+)/g

// outline を消す指定。`focus:` / `focus-visible:` の前置は許容するが、
// `hover:outline-none` のような無関係な pseudo-class の前置は対象外にするため、
// 直前の文字が「境界」（文字列の先頭 / 空白 / クォート / カンマ / 開き括弧）であることを要求する。
const OUTLINE_RELEASE_RE = /(^|[\s"'`,(])(?:focus(?:-visible)?:)?outline-(?:none|hidden)\b/g

function hasRingTrigger(text: string): boolean {
  for (const match of text.matchAll(RING_TRIGGER_RE)) {
    if (match[1] !== "0") return true
  }
  return false
}

function hasOutlineRelease(text: string): boolean {
  // OUTLINE_RELEASE_RE は global フラグ付きの共有インスタンスなので、.test() を
  // 使うと lastIndex が呼び出しをまたいで残り、次の呼び出しで誤って false になる
  // （典型的な stateful global regex バグ）。毎回 lastIndex をリセットしてから使う。
  OUTLINE_RELEASE_RE.lastIndex = 0
  return OUTLINE_RELEASE_RE.test(text)
}

function hasRingWithoutOutline(text: string): boolean {
  if (!hasRingTrigger(text)) return false
  return !hasOutlineRelease(text)
}

/**
 * 1つの cn()/clsx()/cva() 呼び出し全体を検査する。
 *
 * 引数を分解し、三項演算子で排他的に分かれる分岐（例: `isCompact ? A : B`）は
 * 「常に両方含まれる」として単純結合せず、各分岐を「他の常時引数（ベースライン）+
 * その分岐」の組み合わせで個別に判定する。これにより、checkbox-card.tsx のように
 * `outline-none` と `ring` が cn() の別々の（常時含まれる）文字列引数に分かれている
 * ケースは許容しつつ、list-item.tsx のように三項演算子の片方の分岐だけ
 * `outline-none` が抜けているケースはその分岐単体で検出できる。
 */
function findCallViolations(callText: string): string[] {
  const inner = callText.slice(1, -1) // 前後の ( ) を除く
  const args = splitTopLevelByComma(inner)

  let baselineAll = ""
  const allTernaryBranches: [string, string][] = []
  for (const arg of args) {
    const { baseline, ternaryBranches } = analyzeArgument(arg)
    baselineAll += ` ${baseline}`
    allTernaryBranches.push(...ternaryBranches)
  }

  const violations: string[] = []
  if (allTernaryBranches.length === 0) {
    if (hasRingWithoutOutline(baselineAll)) violations.push(callText)
    return violations
  }

  for (const [branchA, branchB] of allTernaryBranches) {
    if (hasRingWithoutOutline(`${baselineAll} ${branchA}`)) violations.push(branchA)
    if (hasRingWithoutOutline(`${baselineAll} ${branchB}`)) violations.push(branchB)
  }
  return violations
}

function findViolations(rawSource: string): string[] {
  const source = stripComments(rawSource)
  const violations: string[] = []

  const calls = extractCalls(source, CALL_NAMES)
  for (const call of calls) {
    violations.push(...findCallViolations(call.text))
  }

  // cn()/clsx()/cva() の呼び出し区間を潰してから、素の文字列リテラル
  // （className="...ring..." 等）を判定する。
  let withoutCalls = source
  for (const call of calls) {
    withoutCalls = withoutCalls.split(call.text).join(" ".repeat(call.text.length))
  }
  for (const match of withoutCalls.matchAll(STRING_LITERAL_RE)) {
    if (hasRingWithoutOutline(match[0])) violations.push(match[0])
  }

  return violations
}

describe("focus-visible:ring / focus:ring と outline 解除のペア (issue #597)", () => {
  it("DS コンポーネント全体で ring だけ出して outline を消し忘れている箇所が無い", () => {
    const files = TARGET_DIRS.flatMap((dir) => collectFiles(join(ROOT, dir)))
    expect(files.length).toBeGreaterThan(0)

    const report: string[] = []
    for (const file of files) {
      const source = readFileSync(file, "utf8")
      const violations = findViolations(source)
      if (violations.length > 0) {
        const rel = file.replace(`${ROOT}/`, "")
        for (const v of violations) report.push(`${rel}: ${v.slice(0, 160)}`)
      }
    }

    expect(report).toEqual([])
  })

  it("リグレッション確認: outline-none の無い cn() 呼び出しは検出される", () => {
    const violations = findViolations(
      `cn("focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50")`,
    )
    expect(violations).toHaveLength(1)
  })

  it("list-item.tsx の実例を1か所 outline-none 無しに戻すと検出される", () => {
    const violations = findViolations(
      `const rootClassName = cn(
        "flex w-full",
        actionable && (
          isCompact
            ? "focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50"
            : "min-h-11 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50"
        ),
      )`,
    )
    expect(violations).toHaveLength(1)
  })

  it("focus:ring-*（focus-visible でない）も検出対象", () => {
    const violations = findViolations(`cn("focus:ring-2 focus:ring-[var(--X)]/50")`)
    expect(violations).toHaveLength(1)
  })

  it("focus:outline-none で対になっていれば focus:ring-* も許容する", () => {
    const violations = findViolations(`cn("focus:outline-none focus:ring-2")`)
    expect(violations).toHaveLength(0)
  })

  it("同じ cn() 呼び出し内で別の文字列引数に outline-none があれば許容する", () => {
    const violations = findViolations(
      `cn("focus-visible:outline-none", "focus-visible:ring-2 focus-visible:ring-[var(--X)]/20")`,
    )
    expect(violations).toHaveLength(0)
  })

  it("cva() の base 文字列で ring と outline-none がペアなら許容する", () => {
    const violations = findViolations(
      `const buttonVariants = cva(
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        { variants: { size: { sm: "h-8" } } },
      )`,
    )
    expect(violations).toHaveLength(0)
  })

  it("cva() で ring はあるが outline-none が無ければ検出する", () => {
    const violations = findViolations(
      `const buttonVariants = cva(
        "focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        { variants: { size: { sm: "h-8" } } },
      )`,
    )
    expect(violations).toHaveLength(1)
  })

  it("focus-visible:ring-0（リングを消す上書き）は ring として扱わない", () => {
    const violations = findViolations(`cn("focus-visible:ring-0")`)
    expect(violations).toHaveLength(0)
  })

  it("JSDoc コメント内の focus-visible:ring-0 は誤検出しない", () => {
    const violations = findViolations(
      `/** focus ring は className 側で \`focus-visible:ring-0\` 等を渡せば上書きできる。 */\nconst x = 1`,
    )
    expect(violations).toHaveLength(0)
  })

  it("outline-hidden が同居していれば検出しない（slider.tsx のパターン）", () => {
    expect(
      findViolations(`<div className="focus-visible:ring-4 focus-visible:outline-hidden" />`),
    ).toHaveLength(0)
  })

  it("hover:outline-none はペアとして数えない（無関係な pseudo-class）", () => {
    const violations = findViolations(`cn("hover:outline-none focus-visible:ring-2")`)
    expect(violations).toHaveLength(1)
  })
})
