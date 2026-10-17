import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { Banner } from "../src/components/patterns/banner"
import { ChipSelector } from "../src/components/patterns/chip-selector"
import { FormField } from "../src/components/patterns/form-field"
import { FieldGroup } from "../src/components/patterns/field"
import { MonthCalendarHeader } from "../src/components/patterns/month-calendar"
import { AdminShell } from "../src/components/patterns/shells/admin-shell"

const OPTIONS = [
  { value: "a", label: "親族" },
  { value: "b", label: "友人" },
]

describe("FieldGroup rows の余白 (#733)", () => {
  it("FormField 以外の直下にも py-3 を付け、CollapsibleChipField は除く", () => {
    const html = renderToStaticMarkup(<FieldGroup variant="rows"><div>x</div></FieldGroup>)
    expect(html.replace(/&amp;/g, "&").replace(/&gt;/g, ">")).toContain("[&>:where(:not([data-slot=collapsible-chip-field]))]:py-3")
    expect(renderToStaticMarkup(<FieldGroup><div>x</div></FieldGroup>)).not.toContain("py-3")
  })
})

describe("FormField as=group → ChipSelector (#734)", () => {
  it("名前の指定が無ければグループのラベル id を aria-labelledby に使う", () => {
    const html = renderToStaticMarkup(
      <FormField as="group" label="種別">
        <ChipSelector selectionMode="single" options={OPTIONS} value="a" onChange={() => {}} />
      </FormField>
    )
    const labelId = /<span id="([^"]+)"/.exec(html)![1]
    expect(html).toContain(`role="radiogroup"`)
    // radiogroup 側にも同じ id が結ばれる
    expect(html.split(`aria-labelledby="${labelId}"`).length - 1).toBe(2)
  })

  it("明示した aria-label / aria-labelledby が優先で、警告も出ない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const html = renderToStaticMarkup(
      <FormField as="group" label="種別">
        <ChipSelector selectionMode="single" options={OPTIONS} value="a" onChange={() => {}} aria-label="独自" />
      </FormField>
    )
    expect(html).toContain('aria-label="独自"')
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("FormField の外では従来どおり（名前を足さない）", () => {
    const html = renderToStaticMarkup(
      <ChipSelector selectionMode="single" options={OPTIONS} value="a" onChange={() => {}} aria-label="x" />
    )
    expect(html).not.toContain("aria-labelledby")
  })
})

describe("Banner の閉じるボタン (#735)", () => {
  it("onDismiss が無ければ出さない", () => {
    expect(renderToStaticMarkup(<Banner description="x" />)).not.toContain("banner-dismiss")
  })
  it("onDismiss で出し、既定の名前は「閉じる」、dismissLabel で変えられる", () => {
    const html = renderToStaticMarkup(<Banner description="x" onDismiss={() => {}} />)
    expect(html).toContain('data-slot="banner-dismiss"')
    expect(html).toContain('aria-label="閉じる"')
    expect(renderToStaticMarkup(<Banner description="x" onDismiss={() => {}} dismissLabel="消す" />)).toContain('aria-label="消す"')
  })
})

describe("MonthCalendarHeader の live (#736)", () => {
  it("既定は aria-live=polite、live={false} で外す", () => {
    const on = renderToStaticMarkup(<MonthCalendarHeader month={new Date(2026, 9, 1)} />)
    expect(on).toContain('aria-live="polite"')
    const off = renderToStaticMarkup(<MonthCalendarHeader month={new Date(2026, 9, 1)} live={false} />)
    expect(off).not.toContain("aria-live")
    expect(off).not.toContain("aria-atomic")
  })
})

describe("AdminShell の overlay (#737)", () => {
  it("overlay で fixed inset-0 z-Modal h-full、既定は h-screen のまま", () => {
    const on = renderToStaticMarkup(<AdminShell overlay sidebar={<nav />}>x</AdminShell>)
    expect(on).toContain("fixed inset-0 z-[var(--Z-Modal)] h-full")
    expect(on).not.toContain("h-screen")
    const off = renderToStaticMarkup(<AdminShell sidebar={<nav />}>x</AdminShell>)
    expect(off).toContain("h-screen")
    expect(off).not.toContain("fixed inset-0")
  })
})
