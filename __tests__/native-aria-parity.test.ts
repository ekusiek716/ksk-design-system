/**
 * issue #808: react-native-web 0.21 は `accessibilityState` を `aria-*` に変換しない。
 * native 部品が状態を `accessibilityState` だけで渡すと、Web ビルドでは状態が読み上げに伝わらない。
 *
 * src/native/components で `accessibilityState` を要素へ渡している箇所ごとに、
 * すぐ近くで `webAriaFromState(...)`（src/native/web-aria.ts）か `aria-*` を併記していることを検査する。
 * 新しい部品で併記を忘れたらここで落ちる。やむを得ない例外は ALLOWLIST に理由付きで足す。
 */
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { webAriaFromState } from "../src/native/web-aria"

const DIR = join(__dirname, "../src/native/components")

/** `ファイル名:行の中身（trim 後）` → 例外の理由 */
const ALLOWLIST: Record<string, string> = {
  "ChipSelector.tsx:accessibilityState={isRadio ? { checked: selected, selected: undefined } : undefined}":
    "渡し先は DS の Chip。Chip が受け取った role / state から aria-checked / aria-pressed を作る（native-web-aria-state.test.tsx で固定）",
  "CollapsibleChipField.tsx:accessibilityState={":
    "渡し先は DS の Chip。Chip が受け取った role / state から aria-checked / aria-expanded を作る（native-web-aria-state.test.tsx の CollapsibleChipField 節で固定）",
}

/** 要素へ渡している箇所（JSX 属性 / props オブジェクトのプロパティ）だけを拾う。分割代入の `accessibilityState,` は対象外 */
const PASS_SITE = /^\s*accessibilityState(=\{|:\s)/
const ARIA_NEARBY = /webAriaFromState\(|aria-(checked|pressed|selected|current|expanded|disabled|busy)\b/
const WINDOW_AFTER = 8
const WINDOW_BEFORE = 3
/** JSX の開きタグの始まり（`<Pressable` 等）。ここより前は別の要素なので見ない */
const TAG_START = /<[A-Za-z]/
/** JSX の開きタグの終わり（`>` / `/>`。`=>` は除く）。ここより後は子要素なので見ない */
const TAG_END = /(^|[^=])\/?>\s*$/
/** props オブジェクト（`accessibilityState: ...` の形）の閉じ */
const OBJECT_END = /^\s*\}/

/**
 * コメントを空白に置き換える（行番号は保つ）。コメントに書いた `aria-checked` 等の
 * 文字列で検査をすり抜けないようにするため。文字列中の `//`（URL 等）は `:` 直後なら残す。
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .split("\n")
    .map((l) => l.replace(/(^|[^:'"`\\])\/\/.*$/, "$1"))
    .join("\n")
}

/**
 * 1 ファイル分の併記漏れを返す。照合範囲は「同じ要素の中」に絞る:
 * - JSX 属性（`accessibilityState={...}`）は、直前の開きタグ `<X` から、開きタグの終わり `>` / `/>` まで
 * - props オブジェクト（`accessibilityState: ...`）は、オブジェクトの閉じ `}` まで
 * いずれも WINDOW_BEFORE / WINDOW_AFTER 行を上限とする。隣の別要素の aria-* では合格にしない。
 */
function scanSource(file: string, src: string, allowlist: Record<string, string> = ALLOWLIST): string[] {
  const missing: string[] = []
  const raw = src.split("\n")
  const lines = stripComments(src).split("\n")
  lines.forEach((line, i) => {
    if (!PASS_SITE.test(line)) return
    const isJsx = /^\s*accessibilityState=\{/.test(line)

    let start = i
    if (isJsx) {
      for (let j = i; j >= Math.max(0, i - WINDOW_BEFORE); j--) {
        start = j
        if (TAG_START.test(lines[j])) break
      }
    } else {
      start = Math.max(0, i - WINDOW_BEFORE)
    }

    let end = i
    for (let j = i; j <= Math.min(lines.length - 1, i + WINDOW_AFTER); j++) {
      if (j > i && TAG_START.test(lines[j]) && isJsx) break
      end = j
      if (isJsx ? TAG_END.test(lines[j]) : j > i && OBJECT_END.test(lines[j])) break
    }

    const near = lines.slice(start, end + 1).join("\n")
    if (ARIA_NEARBY.test(near)) return
    const key = `${file}:${raw[i].trim()}`
    if (key in allowlist) return
    missing.push(`${file}:${i + 1} ${raw[i].trim()}`)
  })
  return missing
}

function findMissing(): string[] {
  const missing: string[] = []
  for (const file of readdirSync(DIR).filter((f) => f.endsWith(".tsx")).sort()) {
    missing.push(...scanSource(file, readFileSync(join(DIR, file), "utf8")))
  }
  return missing
}

describe("native: accessibilityState を渡す箇所は Web 用の aria-* も併記する（#808）", () => {
  it("併記漏れが無い", () => {
    expect(findMissing()).toEqual([])
  })

  it("許可リストに理由が書いてある", () => {
    for (const [key, reason] of Object.entries(ALLOWLIST)) {
      expect(reason.trim().length, key).toBeGreaterThan(0)
    }
  })

  it("許可リストに使われていない（実ソースに無い）行が無い", () => {
    const sources = readdirSync(DIR)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => readFileSync(join(DIR, f), "utf8").split("\n").map((l) => `${f}:${l.trim()}`))
      .flat()
    for (const key of Object.keys(ALLOWLIST)) {
      expect(sources, key).toContain(key)
    }
  })
})

describe("併記検査そのもの（すり抜けの防止）", () => {
  it("コメントに書いた aria-* では合格にしない", () => {
    const src = [
      "      <Pressable",
      "        accessibilityState={{ selected }}",
      "        // aria-pressed と同じ意味論",
      "        {/* aria-checked */}",
      "      >",
    ].join("\n")
    expect(scanSource("X.tsx", src, {})).toEqual(["X.tsx:2 accessibilityState={{ selected }}"])
  })

  it("隣の別要素の aria-* では合格にしない", () => {
    const src = [
      '      <Pressable aria-pressed={on} onPress={a} />',
      "      <Pressable",
      "        accessibilityState={{ selected }}",
      "      >",
      "        <Inner aria-selected />",
      "      </Pressable>",
    ].join("\n")
    expect(scanSource("X.tsx", src, {})).toEqual(["X.tsx:3 accessibilityState={{ selected }}"])
  })

  it("同じ開きタグの中の webAriaFromState / aria-* は合格", () => {
    const src = [
      "      <Pressable",
      '        accessibilityRole="button"',
      "        accessibilityState={{ selected }}",
      '        {...webAriaFromState("button", { selected })}',
      "        style={({ pressed }) => [base]}",
      "      >",
    ].join("\n")
    expect(scanSource("X.tsx", src, {})).toEqual([])
    const obj = ["  const p = {", "    accessibilityState: { disabled },", "    ...webAriaFromState(undefined, { disabled }),", "  }"].join("\n")
    expect(scanSource("X.tsx", obj, {})).toEqual([])
  })

  it("文字列中の // は残す（URL をコメント扱いしない）", () => {
    expect(stripComments('const u = "https://example.com" // 説明')).toBe('const u = "https://example.com" ')
  })
})

describe("webAriaFromState の対応表（#808）", () => {
  it("checkbox / radio / switch は aria-checked を必ず出す（必須属性）", () => {
    expect(webAriaFromState("switch", { checked: true })).toEqual({ "aria-checked": true })
    expect(webAriaFromState("checkbox", { checked: "mixed" })).toEqual({ "aria-checked": "mixed" })
    expect(webAriaFromState("radio", { selected: true })).toEqual({ "aria-checked": true })
    expect(webAriaFromState("radio", {})).toEqual({ "aria-checked": false })
    expect(webAriaFromState("radio", { checked: false, selected: true })).toEqual({ "aria-checked": false })
  })

  it("button は selected / checked を aria-pressed にし、aria-selected / aria-checked は出さない", () => {
    expect(webAriaFromState("button", { selected: true })).toEqual({ "aria-pressed": true })
    expect(webAriaFromState("button", { checked: false, selected: true })).toEqual({ "aria-pressed": false })
    expect(webAriaFromState("button", { selected: undefined, expanded: false })).toEqual({ "aria-expanded": false })
  })

  it("tab は aria-selected", () => {
    expect(webAriaFromState("tab", { selected: false })).toEqual({ "aria-selected": false })
  })

  it('selectedAs: "current" は選択中だけ aria-current="page"', () => {
    expect(webAriaFromState("button", { selected: true }, { selectedAs: "current" })).toEqual({ "aria-current": "page" })
    expect(webAriaFromState("button", { selected: false }, { selectedAs: "current" })).toEqual({})
  })

  it("disabled / busy は true のときだけ出す", () => {
    expect(webAriaFromState("button", { disabled: false, busy: false })).toEqual({})
    expect(webAriaFromState("button", { disabled: true, busy: true })).toEqual({ "aria-disabled": true, "aria-busy": true })
  })

  it("role 不明・state 無しでは何も出さない", () => {
    expect(webAriaFromState(undefined, undefined)).toEqual({})
    expect(webAriaFromState("link", { selected: true })).toEqual({})
  })
})
