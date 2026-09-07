import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { themes } from "../src/tokens/native/themes"

function luminance(color: string) {
  const rgb = color.startsWith("#")
    ? color.slice(1).match(/../g)!.map(c => parseInt(c, 16))
    : color.match(/[\d.]+/g)!.slice(0, 3).map(Number)
  return rgb.map(c => c / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    .reduce((n, c, i) => n + c * [0.2126, 0.7152, 0.0722][i]!, 0)
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a)
  return (values[0]! + 0.05) / (values[1]! + 0.05)
}

describe("native secondary dark label contrast", () => {
  it.each(Object.keys(themes) as (keyof typeof themes)[])("%s normal and pressed fill meet 4.5:1", name => {
    const dark = themes[name].dark
    for (const fill of [dark.surface["accent-primary-light"], dark.active["secondary-button"]]) {
      expect(contrast(dark.text["high-emphasis"], fill)).toBeGreaterThanOrEqual(4.5)
    }
  })
  it("uses high emphasis only for dark secondary, retaining light accent and public overrides", () => {
    const source = readFileSync("src/native/components/Button.tsx", "utf8")
    const secondary = source.split("secondary: {")[1]!.split("tertiary: {")[0]!
    expect(secondary).toContain('fg: mode === "dark" ? theme.text["high-emphasis"] : theme.text["accent-primary"]')
    expect(source).toContain("textStyle={textStyle}")
    expect(source).toContain("disabled={effectiveDisabled}")
  })
})
