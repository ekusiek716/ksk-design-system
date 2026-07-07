/**
 * Bottom sheet キーボード追従の CSS フォールバック契約（Issue #150 / #149）
 *
 * DS の JS（visualViewport）検知は Android Chrome の
 * `interactive-widget=resizes-content` 環境で layout viewport 自体が縮み、
 * inset がほぼ 0 になって発火しないことがある。その端末でも
 *   #150: bottom lift + max-height 補正（snap は max-height 除外）
 *   #149: KeyboardAwareSheetFooter[data-behavior="hide"] の :has(:focus) 隠し
 * が効くよう、DS 同梱 CSS（styles/sheet-keyboard.css、preset から import）に
 * 検知非依存のフォールバックを持たせている。この契約が壊れていないか検証する。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(__dirname, "..")
const css = readFileSync(join(ROOT, "src/styles/sheet-keyboard.css"), "utf8")
const preset = readFileSync(join(ROOT, "src/preset.css"), "utf8")

describe("sheet-keyboard.css フォールバック契約", () => {
  it("preset.css から import されている（consumer が preset だけで有効化できる）", () => {
    expect(preset).toMatch(/@import\s+["'].\/styles\/sheet-keyboard\.css["']/)
  })

  it("#150: bottom lift を --kb-h ベースで bottom シートに適用する", () => {
    expect(css).toMatch(/data-kb-open/)
    expect(css).toMatch(/bottom:\s*var\(--kb-h/)
    expect(css).toMatch(/\[data-side="bottom"\]/)
  })

  it("#150: max-height 補正は snap モードを除外する（:not([data-snap-active])）", () => {
    expect(css).toMatch(/max-height:\s*calc\(100dvh\s*-\s*var\(--kb-h/)
    expect(css).toMatch(/:not\(\[data-snap-active\]\)/)
  })

  it("#149: :has(:focus) で footer[data-behavior=hide] を display:none にする", () => {
    expect(css).toMatch(/:has\(/)
    expect(css).toMatch(/\[data-slot="keyboard-aware-sheet-footer"\]\[data-behavior="hide"\]/)
    expect(css).toMatch(/display:\s*none/)
  })

  it("#149: モバイル幅ガード（PC 非適用）を持つ", () => {
    expect(css).toMatch(/@media\s*\(max-width:\s*767px\)/)
  })

  it("#149: テキスト系入力 / textarea / contenteditable の :focus をスコープする", () => {
    expect(css).toMatch(/input\[type="text"\]/)
    expect(css).toMatch(/textarea/)
    expect(css).toMatch(/\[contenteditable="true"\]/)
    expect(css).toMatch(/:focus/)
  })
})
