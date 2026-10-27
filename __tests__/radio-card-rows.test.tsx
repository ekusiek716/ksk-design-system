import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { RadioGroup, RadioGroupItem } from "../src/components/ui/radio-group"

describe("RadioGroup card rows", () => {
  it("uses one full-row radio per option with explicit label and description references", () => {
    const html = renderToStaticMarkup(<RadioGroup variant="card" defaultValue="a" aria-label="目標">
      <RadioGroupItem value="a" description="説明">3日</RadioGroupItem>
      <RadioGroupItem value="b" disabled>7日</RadioGroupItem>
    </RadioGroup>)
    expect(html.match(/role="radio"/g)).toHaveLength(2)
    expect(html.match(/data-slot="radio-group-card"/g)).toHaveLength(2)
    expect(html).toContain('aria-label="目標"')
    expect(html).toMatch(/aria-labelledby="[^"]+-label"/)
    expect(html).toMatch(/aria-describedby="[^"]+-description"/)
    expect(html).toContain('aria-checked="true"')
    expect(html).toContain('disabled=""')
    expect(html).toContain("Surface-Secondary")
    expect(html).toContain("Focus-High-Emphasis")
  })
  it("respects explicit accessible names instead of overriding them with the automatic label", () => {
    const html = renderToStaticMarkup(<RadioGroup variant="card" aria-label="目標">
      <RadioGroupItem value="a" aria-label="明示した名前">3日</RadioGroupItem>
      <RadioGroupItem value="b" aria-labelledby="custom-heading" aria-describedby="custom-help">7日</RadioGroupItem>
    </RadioGroup>)
    expect(html).toContain('aria-label="明示した名前"')
    expect(html).not.toMatch(/aria-labelledby="[^"]+-label"/)
    expect(html).toContain('aria-labelledby="custom-heading"')
    expect(html).toContain('aria-describedby="custom-help"')
  })
  it("default and bare-circle usages retain the existing circle and row slots", () => {
    const html = renderToStaticMarkup(<RadioGroup aria-label="目標">
      <RadioGroupItem value="a">3日</RadioGroupItem>
      <RadioGroupItem value="b" aria-label="7日" />
    </RadioGroup>)
    expect(html).not.toContain('data-slot="radio-group-card"')
    expect(html.match(/data-slot="radio-group-item"/g)).toHaveLength(2)
    expect(html).toContain('data-slot="radio-group-item-row"')
  })
})
