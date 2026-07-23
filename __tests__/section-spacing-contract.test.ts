import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const tokens = JSON.parse(readFileSync("tokens.json", "utf8"))
const preset = readFileSync("src/preset.css", "utf8")
const sectionSource = readFileSync("src/components/ui/section.tsx", "utf8")

const expected = {
  xs: "32px",
  sm: "40px",
  md: "48px",
  lg: "56px",
  xl: "64px",
  "2xl": "80px",
}

describe("section spacing token contract", () => {
  it("tokens.json と Tailwind 非依存の preset CSS が一致する", () => {
    expect(tokens.spacing.section).toEqual(expected)

    for (const [name, value] of Object.entries(expected)) {
      expect(preset).toMatch(
        new RegExp(`--Space-Section-${name}:\\s+${value.replace(".", "\\.")}`),
      )
    }
  })

  it("Section の spacing variants は semantic token を参照する", () => {
    expect(sectionSource).toContain('sm: "py-[var(--Space-Section-xs)]"')
    expect(sectionSource).toContain('md: "py-[var(--Space-Section-md)]"')
    expect(sectionSource).toContain('lg: "py-[var(--Space-Section-xl)]"')
    expect(sectionSource).toContain('xl: "py-[var(--Space-Section-2xl)]"')
    expect(sectionSource).not.toMatch(/\b(?:sm|md|lg|xl):\s*"py-\d/)
  })
})
