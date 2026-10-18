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
    expect(markup).toContain("[:where(&amp;)&gt;:where([data-slot=field-legend])]:mb-2")
    expect(markup).not.toContain(":mb-6")
    expect(markup).toContain('data-gap="sm"')
  })

  it('size="sm" は typo-label-md + Text-Medium-Emphasis', () => {
    const markup = renderToStaticMarkup(<FieldLegend size="sm">x</FieldLegend>)
    expect(markup).toContain("typo-label-md text-[var(--Text-Medium-Emphasis)]")
    expect(markup).not.toContain("typo-heading-md")
    expect(markup).toContain('data-size="sm"')
  })

  it("既定（gap 未指定）でも legend の下に子の間隔と同じ 24px を付ける（#747）", () => {
    expect(renderToStaticMarkup(<FieldSet>a</FieldSet>)).toBe(
      '<fieldset data-slot="field-set" class="m-0 flex min-w-0 flex-col border-0 p-0 gap-6 [:where(&amp;)&gt;:where([data-slot=field-legend])]:mb-6">a</fieldset>',
    )
    // gap 未指定は data-gap を出さない（従来どおり）
    expect(renderToStaticMarkup(<FieldSet>a</FieldSet>)).not.toContain("data-gap")
  })

  it("className の gap-* は子の間隔を上書きする（legend の余白は gap 指定で変える）", () => {
    const markup = renderToStaticMarkup(<FieldSet className="gap-3">a</FieldSet>)
    expect(markup).toContain("gap-3")
    expect(markup).not.toContain(" gap-6 ")
  })

  it("FieldLegend の既定は従来どおり", () => {
    expect(renderToStaticMarkup(<FieldLegend>a</FieldLegend>)).toBe(
      '<legend data-slot="field-legend" class="typo-heading-md text-[var(--Text-High-Emphasis)]">a</legend>',
    )
  })
})
