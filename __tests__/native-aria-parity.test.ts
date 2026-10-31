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
}

/** 要素へ渡している箇所（JSX 属性 / props オブジェクトのプロパティ）だけを拾う。分割代入の `accessibilityState,` は対象外 */
const PASS_SITE = /^\s*accessibilityState(=\{|:\s)/
const ARIA_NEARBY = /webAriaFromState\(|aria-(checked|pressed|selected|current|expanded|disabled|busy)\b/
const WINDOW_AFTER = 8
const WINDOW_BEFORE = 3

function findMissing(): string[] {
  const missing: string[] = []
  for (const file of readdirSync(DIR).filter((f) => f.endsWith(".tsx")).sort()) {
    const lines = readFileSync(join(DIR, file), "utf8").split("\n")
    lines.forEach((line, i) => {
      if (!PASS_SITE.test(line)) return
      const near = lines.slice(Math.max(0, i - WINDOW_BEFORE), i + WINDOW_AFTER + 1).join("\n")
      if (ARIA_NEARBY.test(near)) return
      const key = `${file}:${line.trim()}`
      if (key in ALLOWLIST) return
      missing.push(`${file}:${i + 1} ${line.trim()}`)
    })
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
