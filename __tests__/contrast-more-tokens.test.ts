import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

/**
 * issue #636: 入力系の枠（--Border-Control）とスイッチ（オフ）の地（--Surface-Switch-Off*）を
 * prefers-contrast: more / data-contrast="more" のときだけ 3:1 以上へ切り替える。
 * 既定の見た目は不変であることと、CSS・tokens.json・部品の参照がずれないことを固定する。
 */

const css = readFileSync("src/styles/semantic.css", "utf8")
const tokens = JSON.parse(readFileSync("tokens.json", "utf8"))
const more = tokens.colors.semanticContrastMore as Record<
  "light" | "dark",
  { border: { control: string }; surface: Record<string, string> }
>

const NAMES = ["Border-Control", "Surface-Switch-Off", "Surface-Switch-Off-Hover"] as const

/** `selector { ... }` の最初の本体を取り出し、対象 3 変数だけを Map にする。 */
function declarations(body: string) {
  const map = new Map<string, string>()
  for (const m of body.matchAll(/--([A-Za-z][A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) {
    if ((NAMES as readonly string[]).includes(m[1])) map.set(m[1], m[2].trim())
  }
  return map
}

function blockAfter(source: string, selectorPattern: RegExp) {
  const match = source.match(selectorPattern)
  if (!match) throw new Error(`selector not found: ${selectorPattern}`)
  return declarations(match[1])
}

const mediaBlock = css.match(/@media \(prefers-contrast: more\) \{([\s\S]*?)\n\}\n/)?.[1] ?? ""

function expected(mode: "light" | "dark") {
  return new Map<string, string>([
    ["Border-Control", more[mode].border.control],
    ["Surface-Switch-Off", more[mode].surface["switch-off"]],
    ["Surface-Switch-Off-Hover", more[mode].surface["switch-off-hover"]],
  ])
}

describe("既定値は据え置き（issue #636）", () => {
  it("light / dark とも Border-Control = Border-Medium-Emphasis、Switch-Off = Quaternary", () => {
    const lightRoot = css.match(/:root\s*\{([\s\S]*?)\n\}\n\n\/\* ─── Dark Mode ─── \*\//)?.[1] ?? ""
    const darkRoot = css.match(/\n\.dark\s*\{([\s\S]*?)\n\}/)?.[1] ?? ""
    for (const body of [lightRoot, darkRoot]) {
      const d = declarations(body)
      expect(d.get("Border-Control")).toBe("var(--Border-Medium-Emphasis)")
      expect(d.get("Surface-Switch-Off")).toBe("var(--Surface-Quaternary)")
      expect(d.get("Surface-Switch-Off-Hover")).toBe("var(--Object-Disable)")
    }
  })
})

describe("prefers-contrast: more / data-contrast=\"more\" の値", () => {
  it("@media (prefers-contrast: more) の :root / .dark が tokens.json と一致する", () => {
    expect(mediaBlock).not.toBe("")
    expect(blockAfter(mediaBlock, /:root\s*\{([\s\S]*?)\}/)).toEqual(expected("light"))
    expect(blockAfter(mediaBlock, /\.dark\s*\{([\s\S]*?)\}/)).toEqual(expected("dark"))
  })

  it("[data-contrast=\"more\"] が media と同じ値になる（opt-in）", () => {
    expect(blockAfter(css, /\n\[data-contrast="more"\]\s*\{([\s\S]*?)\}/)).toEqual(expected("light"))
    const darkSelector =
      /\.dark\[data-contrast="more"\],\s*\.dark \[data-contrast="more"\],\s*\[data-contrast="more"\] \.dark\s*\{([\s\S]*?)\}/
    expect(blockAfter(css, darkSelector)).toEqual(expected("dark"))
  })

  it("High Contrast 節は .dark の既定ブロックより後ろにある（同じ詳細度で dark が勝つ）", () => {
    const darkDefault = css.indexOf("\n.dark {")
    expect(darkDefault).toBeGreaterThan(0)
    expect(css.indexOf("@media (prefers-contrast: more)")).toBeGreaterThan(darkDefault)
    expect(css.indexOf('[data-contrast="more"] {')).toBeGreaterThan(darkDefault)
  })
})

describe("部品の参照", () => {
  const controlFiles = [
    "ui/input",
    "ui/textarea",
    "ui/select",
    "ui/checkbox",
    "ui/radio-group",
    "ui/combobox",
    "ui/multi-select",
    "ui/date-picker",
    "ui/time-picker",
    "ui/number-input",
    "ui/checkbox-card",
    "patterns/search-bar",
    "patterns/tag-input",
    "patterns/chip",
    "patterns/file-upload",
    "patterns/admin/image-uploader",
    "patterns/admin/chart-controls",
    "patterns/commerce/quantity-selector",
  ]

  it.each(controlFiles)("%s の操作部品の枠は --Border-Control を参照し、border に --Border-Medium-Emphasis を直接使わない", (name) => {
    const source = readFileSync(`src/components/${name}.tsx`, "utf8")
    expect(source).toContain("var(--Border-Control)")
    // 区切り線（border-t）は非操作要素なので対象外
    const withoutDivider = source.replace("border-t border-[var(--Border-Medium-Emphasis)]", "")
    expect(withoutDivider).not.toMatch(/border[a-z-]*-\[var\(--Border-Medium-Emphasis\)\]/)
  })

  it("非操作要素（CheckboxCard の展開部の区切り線）は --Border-Medium-Emphasis のまま", () => {
    const source = readFileSync("src/components/ui/checkbox-card.tsx", "utf8")
    expect(source).toContain("border-t border-[var(--Border-Medium-Emphasis)]")
  })

  it("switch の off 地は --Surface-Switch-Off / -Hover を参照する", () => {
    const source = readFileSync("src/components/ui/switch.tsx", "utf8")
    expect(source).toContain("data-[state=unchecked]:bg-[var(--Surface-Switch-Off)]")
    expect(source).toContain("hover:data-[state=unchecked]:bg-[var(--Surface-Switch-Off-Hover)]")
    expect(source).not.toContain("var(--Surface-Quaternary)")
  })
})
