import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { FieldLegend, FieldSet } from "../src/components/patterns/field"

// issue #714: FieldLegend の小さいサイズと FieldSet の間隔
describe("FieldSet gap / FieldLegend size（#714）", () => {
  it("gap を指定すると子の間隔と legend の下の間隔を同じ段にする", () => {
    const markup = renderToStaticMarkup(<FieldSet gap="sm"><FieldLegend>x</FieldLegend></FieldSet>)
    expect(markup).toContain("gap-2")
    expect(markup).not.toContain("gap-6")
    expect(markup).toContain("[&amp;&gt;[data-slot=field-legend]]:mb-2")
    expect(markup).toContain('data-gap="sm"')
  })

  it('size="sm" は typo-label-md + Text-Medium-Emphasis', () => {
    const markup = renderToStaticMarkup(<FieldLegend size="sm">x</FieldLegend>)
    expect(markup).toContain("typo-label-md text-[var(--Text-Medium-Emphasis)]")
    expect(markup).not.toContain("typo-heading-md")
    expect(markup).toContain('data-size="sm"')
  })

  it("既定は従来どおり", () => {
    expect(renderToStaticMarkup(<FieldSet>a</FieldSet>)).toBe(
      '<fieldset data-slot="field-set" class="m-0 flex min-w-0 flex-col gap-6 border-0 p-0">a</fieldset>',
    )
    expect(renderToStaticMarkup(<FieldLegend>a</FieldLegend>)).toBe(
      '<legend data-slot="field-legend" class="typo-heading-md text-[var(--Text-High-Emphasis)]">a</legend>',
    )
  })
})
