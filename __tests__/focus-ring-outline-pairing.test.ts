import { describe, expect, it } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * issue #597: `focus-visible:ring-*` で自前のフォーカスリングを出す箇所は、
 * 同じ className（`cn()`/`clsx()` 呼び出し、または単一の文字列リテラル）の中で
 * `focus-visible:outline-none`（または `outline-hidden`）とセットにすること。
 * 無いと UA 既定の outline と DS のリングが二重に表示される
 * （ListItem / ShareButtons / SkipLink で実際に発生した）。
 *
 * `cn("outline-none ...", cond && "...ring...")` のように、ペアが同じ呼び出し内で
 * 複数の文字列引数に分かれているケース（例: checkbox-card.tsx）も許容するため、
 * 判定単位は「文字列リテラル単体」ではなく「それを含む cn()/clsx() 呼び出し全体」。
 * cn()/clsx() で包まれていない素の className="...ring..." は文字列リテラル単体で判定する。
 */

const ROOT = process.cwd()
const TARGET_DIRS = ["src/components", "src/lib/server-variants"]
const EXCLUDE_SUFFIXES = [".stories.tsx", ".test.tsx", ".test.ts", ".d.ts"]

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

/** `cn(...)` / `clsx(...)` 呼び出しを、文字列中の括弧に惑わされずに丸ごと抽出する。 */
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

const STRING_LITERAL_RE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/gs

function hasRingWithoutOutline(text: string): boolean {
  if (!text.includes("focus-visible:ring")) return false
  return !(text.includes("outline-none") || text.includes("outline-hidden"))
}

function findViolations(rawSource: string): string[] {
  const source = stripComments(rawSource)
  const violations: string[] = []

  const calls = extractCalls(source, ["cn", "clsx"])
  for (const call of calls) {
    if (hasRingWithoutOutline(call.text)) violations.push(call.text)
  }

  // cn()/clsx() の呼び出し区間を潰してから、素の文字列リテラル（className="...ring..." 等）を判定する。
  let withoutCalls = source
  for (const call of calls) {
    withoutCalls = withoutCalls.split(call.text).join(" ".repeat(call.text.length))
  }
  for (const match of withoutCalls.matchAll(STRING_LITERAL_RE)) {
    if (hasRingWithoutOutline(match[0])) violations.push(match[0])
  }

  return violations
}

describe("focus-visible:ring と outline-none/outline-hidden のペア (issue #597)", () => {
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

  it("同じ cn() 呼び出し内で別の文字列引数に outline-none があれば許容する", () => {
    const violations = findViolations(
      `cn("focus-visible:outline-none", "focus-visible:ring-2 focus-visible:ring-[var(--X)]/20")`,
    )
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
})
