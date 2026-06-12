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

function flattenSemanticTokenMap(group: "semantic" | "semanticDark" = "semantic") {
  const tokens = JSON.parse(readFileSync("tokens.json", "utf8"))
  const semantic = tokens.colors[group] as Record<string, unknown>
  const tokenMap = new Map<string, string>()

  for (const [category, value] of Object.entries(semantic)) {
    const cssCategory = CATEGORY_NAMES[category]
    if (!cssCategory || !value || typeof value !== "object" || Array.isArray(value)) continue

    for (const [key, tokenValue] of Object.entries(value)) {
      if (key.startsWith("_")) continue
      if (typeof tokenValue !== "string") continue
      tokenMap.set(`${cssCategory}-${roleToCssSegment(key)}`, tokenValue)
    }
  }

  return tokenMap
}

function extractLightSemanticCssVariableMap() {
  const css = readFileSync("src/styles/semantic.css", "utf8")
  const rootBlock = css.match(/:root\s*{([\s\S]*?)\n}\n\n\/\* ─── Dark Mode ─── \*\//)?.[1] ?? ""
  return new Map(
    [...rootBlock.matchAll(/--([A-Za-z][A-Za-z0-9-]+)\s*:\s*([^;]+);/g)]
      .map((match) => [match[1], match[2].trim()])
  )
}

function extractDarkSemanticCssVariableMap() {
  const css = readFileSync("src/styles/semantic.css", "utf8")
  const darkBlock = css.match(/\.dark\s*{([\s\S]*?)\n}/)?.[1] ?? ""
  return new Map(
    [...darkBlock.matchAll(/--([A-Za-z][A-Za-z0-9-]+)\s*:\s*([^;]+);/g)]
      .map((match) => [match[1], match[2].trim()])
  )
}

describe("tokens.json — semantic token contract", () => {
  it("semantic.css の light mode semantic tokens を機械可読 tokens.json にも持つ", () => {
    const tokenMap = flattenSemanticTokenMap()
    const cssMap = extractLightSemanticCssVariableMap()
    const missing = [...cssMap.keys()].filter((name) => !tokenMap.has(name))
    const mismatched = [...cssMap.entries()].flatMap(([name, cssValue]) => {
      const tokenValue = tokenMap.get(name)
      return tokenValue !== undefined && tokenValue !== cssValue
        ? [{ name, cssValue, tokenValue }]
        : []
    })

    expect(cssMap.size).toBeGreaterThan(50)
    expect(missing).toEqual([])
    expect(mismatched).toEqual([])
  })

  it("semantic.css の dark mode semantic tokens を機械可読 tokens.json (semanticDark) にも持つ", () => {
    const tokenMap = flattenSemanticTokenMap("semanticDark")
    const cssMap = extractDarkSemanticCssVariableMap()
    const missing = [...cssMap.keys()].filter((name) => !tokenMap.has(name))
    const mismatched = [...cssMap.entries()].flatMap(([name, cssValue]) => {
      const tokenValue = tokenMap.get(name)
      return tokenValue !== undefined && tokenValue !== cssValue
        ? [{ name, cssValue, tokenValue }]
        : []
    })

    expect(cssMap.size).toBeGreaterThan(50)
    expect(missing).toEqual([])
    expect(mismatched).toEqual([])
  })
})
