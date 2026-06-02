import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const CATEGORY_NAMES: Record<string, string> = {
  surface: "Surface",
  text: "Text",
  object: "Object",
  border: "Border",
  brand: "Brand",
  hover: "Hover",
  active: "Active",
  overlay: "Overlay",
  focus: "Focus",
  caution: "Caution",
  success: "Success",
  warning: "Warning",
  info: "Info",
}

function roleToCssSegment(role: string) {
  return role
    .split("-")
    .map((part) => {
      if (part === "on") return "on"
      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    })
    .join("-")
}

function flattenSemanticTokenNames() {
  const tokens = JSON.parse(readFileSync("tokens.json", "utf8"))
  const semantic = tokens.colors.semantic as Record<string, unknown>
  const names = new Set<string>()

  for (const [category, value] of Object.entries(semantic)) {
    const cssCategory = CATEGORY_NAMES[category]
    if (!cssCategory || !value || typeof value !== "object" || Array.isArray(value)) continue

    for (const key of Object.keys(value)) {
      if (key.startsWith("_")) continue
      names.add(`${cssCategory}-${roleToCssSegment(key)}`)
    }
  }

  return names
}

function extractLightSemanticCssVariables() {
  const css = readFileSync("src/styles/semantic.css", "utf8")
  const rootBlock = css.match(/:root\s*{([\s\S]*?)\n}\n\n\/\* ─── Dark Mode ─── \*\//)?.[1] ?? ""
  return [...rootBlock.matchAll(/--([A-Za-z][A-Za-z0-9-]+)\s*:/g)].map((match) => match[1])
}

describe("tokens.json — semantic token contract", () => {
  it("semantic.css の light mode semantic tokens を機械可読 tokens.json にも持つ", () => {
    const tokenNames = flattenSemanticTokenNames()
    const missing = extractLightSemanticCssVariables().filter((name) => !tokenNames.has(name))

    expect(missing).toEqual([])
  })
})
