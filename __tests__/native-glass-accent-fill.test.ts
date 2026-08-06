import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import {
  formatRgba,
  mixSrgb,
  parseHexColor,
  resolveGlassAccentFill,
  resolveGlassAccentHighlight,
  resolveGlassAccentRim,
} from "../src/native/glass-accent-fill"

const BRAND = "#2563EB" // themes.default.light.brand.primary

describe("parseHexColor", () => {
  it("#RRGGBB を解釈する", () => {
    expect(parseHexColor(BRAND)).toEqual({ r: 0x25, g: 0x63, b: 0xeb, a: 1 })
  })

  it("#RGB のショートハンドを展開する", () => {
    expect(parseHexColor("#f0a")).toEqual({ r: 255, g: 0, b: 170, a: 1 })
  })

  it("#RRGGBBAA のアルファを 0..1 に正規化する", () => {
    expect(parseHexColor("#00000080")?.a).toBeCloseTo(128 / 255, 5)
  })

  it("解釈できない文字列は null", () => {
    expect(parseHexColor("rgb(1,2,3)")).toBeNull()
    expect(parseHexColor("#12345")).toBeNull()
  })
})

describe("mixSrgb", () => {
  it("透明と混ぜると色はそのままでアルファだけ落ちる（color-mix の transparent 相当）", () => {
    const mixed = mixSrgb({ r: 10, g: 20, b: 30, a: 1 }, { r: 0, g: 0, b: 0, a: 0 }, 0.95)

    expect(mixed).toEqual({ r: 10, g: 20, b: 30, a: 0.95 })
  })

  it("半透明どうしは premultiplied で加重平均する", () => {
    const mixed = mixSrgb({ r: 100, g: 100, b: 100, a: 1 }, { r: 0, g: 0, b: 0, a: 0.6 }, 0.5)

    // alpha = 0.5*1 + 0.5*0.6 = 0.8 / channel = (100*0.5) / 0.8 = 62.5
    expect(mixed.a).toBeCloseTo(0.8, 5)
    expect(mixed.r).toBeCloseTo(62.5, 5)
  })
})

describe("resolveGlassAccentFill", () => {
  it("light はブランド色を 95% で敷く（web の color-mix と同値）", () => {
    expect(resolveGlassAccentFill({ brandPrimary: BRAND, mode: "light" })).toBe("rgba(37, 99, 235, 0.95)")
  })

  it("dark は暗色ベースを混ぜてもほぼ不透明のまま（白前景のコントラストを守る）", () => {
    const fill = resolveGlassAccentFill({ brandPrimary: BRAND, mode: "dark" })
    const alpha = Number(fill.match(/([\d.]+)\)$/)?.[1])

    expect(alpha).toBeGreaterThanOrEqual(0.9)
  })

  it("light / dark でブランド色に追従する（ハードコードしていない）", () => {
    const orange = resolveGlassAccentFill({ brandPrimary: "#F97316", mode: "light" })

    expect(orange).toBe("rgba(249, 115, 22, 0.95)")
  })

  it("解釈できない色はそのまま返してフォールバックする", () => {
    expect(resolveGlassAccentFill({ brandPrimary: "papayawhip", mode: "light" })).toBe("papayawhip")
  })
})

describe("rim / highlight", () => {
  it("light は dark より強い白（web の .glass-accent と同じ関係）", () => {
    expect(resolveGlassAccentRim("light")).toBe("rgba(255, 255, 255, 0.4)")
    expect(resolveGlassAccentRim("dark")).toBe("rgba(255, 255, 255, 0.25)")
    expect(resolveGlassAccentHighlight("light")).toBe("rgba(255, 255, 255, 0.9)")
  })
})

describe("formatRgba", () => {
  it("チャンネルは整数・アルファは最大3桁に丸める", () => {
    expect(formatRgba({ r: 62.5, g: 0.4, b: 255, a: 0.9524 })).toBe("rgba(63, 0, 255, 0.952)")
  })
})

describe("MobileFloatingActionButton (native)", () => {
  const source = readFileSync("src/native/components/MobileFloatingActionButton.tsx", "utf8")

  it("glass variant は GlassView にブランドティントを渡す", () => {
    expect(source).toContain("resolveGlassAccentFill")
    expect(source).toContain("<GlassView")
  })

  it("既定は default（ソリッド）で現行の見た目を変えない", () => {
    expect(source).toContain('variant = "default"')
  })

  it("native Liquid Glass が無い tier では塗りを style で明示し直す", () => {
    // GlassView の expo-blur 分岐は backgroundColor を transparent で上書きするため、
    // backgroundFill だけでは中立色ガラス＋白前景になりコントラストが落ちる。
    expect(source).toContain("isNativeLiquidGlassAvailable()")
    expect(source).toContain("needsExplicitFill && { backgroundColor: fill }")
  })
})
