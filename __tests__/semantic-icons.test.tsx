import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { SemanticIcon } from "../src/components/ui/semantic-icon"
import { InfoCircleIcon } from "../src/components/icons/info-circle"

const render = (name: React.ComponentProps<typeof SemanticIcon>["name"]) => renderToStaticMarkup(<SemanticIcon name={name} />)
describe("semantic glyphs", () => {
  it("keeps the unframed selection tick rather than a checkbook or checkbox", () => {
    expect(render("selected")).toContain('d="M10 3L4.5 8.5L2 6"')
    expect(render("selected").match(/<path/g)).toHaveLength(1)
  })
  it("uses the existing i geometry, distinct from warning", () => {
    const info = renderToStaticMarkup(<InfoCircleIcon />).match(/d="[^"]+"/g)
    for (const path of info ?? []) expect(render("info")).toContain(path)
    expect(render("warning")).not.toContain('d="M11.995 8h.009"')
  })
  it("hides decoration but exposes an explicitly named image", () => {
    expect(render("close")).toContain('aria-hidden="true"')
    const labelled = renderToStaticMarkup(<SemanticIcon name="info" aria-label="補足情報" />)
    expect(labelled).toContain('role="img"')
    expect(labelled).not.toContain('aria-hidden="true"')
  })
})
