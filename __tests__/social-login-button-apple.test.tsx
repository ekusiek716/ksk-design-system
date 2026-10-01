import { readFileSync } from "node:fs"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { SocialLoginButton } from "../src/components/ui/social-login-button"
import { themes } from "../src/tokens/native"

// issue #595: apple ボタンは固定黒の面に、dark で黒系へ反転する --Text-on-Inverse を
// 載せていたため、ダークテーマで背景・枠・文字・ロゴがすべて黒になり見えなかった。
// Apple HIG（ライト=黒ボタン / ダーク=白ボタン）に沿って mode で反転する専用トークンを使う。

function cssBlock(selector: RegExp) {
  const css = readFileSync("src/styles/semantic.css", "utf8")
  return css.match(selector)?.[1] ?? ""
}

function tokenValue(block: string, name: string) {
  return block.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`))?.[1].trim()
}

describe("SocialLoginButton provider=apple", () => {
  it("面・枠・文字に Apple 専用トークンを使い、--Text-on-Inverse に頼らない", () => {
    const html = renderToStaticMarkup(<SocialLoginButton provider="apple" />)
    expect(html).toContain("Appleでログイン")
    expect(html).toContain("bg-[var(--Brand-Apple-Surface)]")
    expect(html).toContain("border-[var(--Brand-Apple-Surface)]")
    expect(html).toContain("text-[var(--Brand-on-Apple)]")
    expect(html).not.toContain("--Text-on-Inverse")
  })

  it("ロゴは文字色（currentColor）に追従する mono アイコン", () => {
    const html = renderToStaticMarkup(<SocialLoginButton provider="apple" />)
    expect(html).toContain('data-platform="apple"')
    expect(html).toContain('fill="currentColor"')
  })

  it("ライトは黒地に白、ダーク（.dark）は白地に黒へ反転する", () => {
    const light = cssBlock(/:root\s*{([\s\S]*?)\n}/)
    const dark = cssBlock(/\.dark\s*{([\s\S]*?)\n}/)
    expect(tokenValue(light, "Brand-Apple-Surface")).toBe("var(--Primitive-Black)")
    expect(tokenValue(light, "Brand-on-Apple")).toBe("var(--Primitive-White)")
    expect(tokenValue(dark, "Brand-Apple-Surface")).toBe("var(--Primitive-White)")
    expect(tokenValue(dark, "Brand-on-Apple")).toBe("var(--Primitive-Black)")
  })

  it("native トークンも全テーマで同じ反転を持つ", () => {
    for (const [name, modes] of Object.entries(themes)) {
      expect(modes.light.brand["apple-surface"], `${name}.light`).toBe("#000000")
      expect(modes.light.brand["on-apple"], `${name}.light`).toBe("#FFFFFF")
      expect(modes.dark.brand["apple-surface"], `${name}.dark`).toBe("#FFFFFF")
      expect(modes.dark.brand["on-apple"], `${name}.dark`).toBe("#000000")
    }
  })
})
