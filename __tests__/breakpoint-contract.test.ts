import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const tokens = JSON.parse(readFileSync("tokens.json", "utf8"))

describe("responsive breakpoint contract", () => {
  it("Tailwind v4 viewport の切替段とコンテンツ上限を固定する", () => {
    expect(tokens.breakpoints.viewport.sm).toMatchObject({ value: "640px", role: "switch" })
    expect(tokens.breakpoints.viewport.md).toMatchObject({ value: "768px", role: "switch" })
    expect(tokens.breakpoints.viewport.lg).toMatchObject({ value: "1024px", role: "switch" })
    expect(tokens.breakpoints.viewport.xl).toMatchObject({
      value: "1280px",
      role: "content-max",
    })
    expect(tokens.breakpoints.viewport.xl.rule).toContain("レイアウト変形を追加せず")
  })

  it("viewport と container query の同名段を別値として明示する", () => {
    expect(tokens.breakpoints.viewport.md.value).toBe("768px")
    expect(tokens.breakpoints.container.md.value).toBe("448px")
    expect(tokens.breakpoints.viewport.xl.value).toBe("1280px")
    expect(tokens.breakpoints.container.xl.value).toBe("576px")
    expect(tokens.breakpoints.container["4xl"].value).toBe("896px")
  })

  it("使用中の container query 値を配布 preset に固定する", () => {
    const preset = readFileSync("src/preset.css", "utf8")

    for (const [name, breakpoint] of Object.entries(tokens.breakpoints.container)) {
      if (name === "_doc") continue
      const rem = Number.parseInt(breakpoint.value, 10) / 16
      expect(preset).toContain(`--container-${name}: ${rem}rem;`)
    }
  })

  it("wide Container の上限が xl contract と一致する", () => {
    const containerSource = readFileSync("src/components/ui/container.tsx", "utf8")
    expect(tokens.breakpoints.viewport.xl.value).toBe("1280px")
    expect(containerSource).toContain('wide: "max-w-7xl"')
  })
})
