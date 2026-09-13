import { describe, expect, it } from "vitest"
import { readReadmeConsumerExample } from "../scripts/readme-consumer-example.mjs"
const example = (code: string) => `<!-- consumer-example:tsx:start -->\n\`\`\`tsx\n${code}\n\`\`\`\n<!-- consumer-example:tsx:end -->`
describe("README executable examples", () => {
  it("extracts only the marked example", () => {
    expect(readReadmeConsumerExample(`\`\`\`tsx\nignore\n\`\`\`\n${example("export const value = 1")}`, "tsx")).toContain("export const value = 1")
  })
  it("rejects an end marker before the start marker", () => {
    const reversed = "<!-- consumer-example:tsx:end -->\n<!-- consumer-example:tsx:start -->\n```tsx\nexport const value = 1\n```"
    expect(() => readReadmeConsumerExample(reversed, "tsx")).toThrow(/reversed/)
  })
  it.each(["", example(""), example("x") + example("y")])("rejects missing, empty, or duplicate examples", (markdown) => {
    expect(() => readReadmeConsumerExample(markdown, "tsx")).toThrow()
  })
})
