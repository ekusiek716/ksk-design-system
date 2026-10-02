import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

// issue #618: ダークモードの Button variant=destructive の hover / active 背景が、
// 文字色（--Text-on-Inverse = Gray-900）との組み合わせで WCAG AA（4.5:1）を
// 満たすこと。#616 の info / warning / success と同じく「dark は押すほど
// 明るくする」方向で揃えた回帰テスト（scripts/check-contrast.mjs のペア追加と対）。

const root = join(__dirname, "..")

const PRIMITIVE_RED: Record<string, string> = {
  "50": "#FEF2F2",
  "100": "#FEE2E2",
  "200": "#FECACA",
  "300": "#FCA5A5",
  "400": "#F87171",
  "500": "#EF4444",
  "600": "#DC2626",
  "700": "#B91C1C",
  "800": "#991B1B",
  "900": "#7F1D1D",
}
const GRAY_900 = "#18181B"

function srgbToLinear(c: number) {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
function luminance(hex: string) {
  const h = hex.replace("#", "")
  const [r, g, b] = [0, 2, 4].map((i) => srgbToLinear(Number.parseInt(h.slice(i, i + 2), 16)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(a: string, b: string) {
  const L1 = luminance(a)
  const L2 = luminance(b)
  const hi = Math.max(L1, L2)
  const lo = Math.min(L1, L2)
  return (hi + 0.05) / (lo + 0.05)
}

function readDarkTokenShade(name: string) {
  const css = readFileSync(join(root, "src/styles/semantic.css"), "utf8")
  // .dark ブロック（2つ目の定義）を対象にする
  const defs = [...css.matchAll(new RegExp(`${name}:\\s*var\\(--Primitive-Red-(\\d+)\\)`, "g"))]
  expect(defs.length, `${name} は light / dark の2回定義されているはず`).toBe(2)
  return defs[1][1]
}

describe("Button variant=destructive のダーク hover/active コントラスト（#618）", () => {
  it("Hover-Destructive-Button（dark）は Text-on-Inverse との組み合わせで AA を満たす", () => {
    const shade = readDarkTokenShade("--Hover-Destructive-Button")
    const ratio = contrast(GRAY_900, PRIMITIVE_RED[shade])
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it("Active-Destructive-Button（dark）は Text-on-Inverse との組み合わせで AA を満たす", () => {
    const shade = readDarkTokenShade("--Active-Destructive-Button")
    const ratio = contrast(GRAY_900, PRIMITIVE_RED[shade])
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it("tokens.json の semanticDark.hover/active.destructive-button も同じ値を指す", () => {
    const tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8")).colors
    expect(tokens.semanticDark.hover["destructive-button"]).toMatch(/^var\(--Primitive-Red-\d+\)/)
    expect(tokens.semanticDark.active["destructive-button"]).toMatch(/^var\(--Primitive-Red-\d+\)/)
    const hoverShade = tokens.semanticDark.hover["destructive-button"].match(/Red-(\d+)/)[1]
    const activeShade = tokens.semanticDark.active["destructive-button"].match(/Red-(\d+)/)[1]
    expect(contrast(GRAY_900, PRIMITIVE_RED[hoverShade])).toBeGreaterThanOrEqual(4.5)
    expect(contrast(GRAY_900, PRIMITIVE_RED[activeShade])).toBeGreaterThanOrEqual(4.5)
  })
})
