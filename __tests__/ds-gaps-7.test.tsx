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
    const cls = html.replace(/&amp;/g, "&").replace(/&gt;/g, ">")
    // 詳細度 0（:where）なので子の py-* が勝つ。CollapsibleChipField / Separator / Legend / Description / Error は除く
    expect(cls).toContain("[:where(&)>:where(:not(")
    for (const slot of ["collapsible-chip-field", "field-separator", "field-legend", "field-description", "field-error"]) {
      expect(cls).toContain(`[data-slot=${slot}]`)
    }
    expect(renderToStaticMarkup(<FieldGroup><div>x</div></FieldGroup>)).not.toContain("py-3")
  })
})

describe("FormField as=group → ChipSelector (#734)", () => {
  const render = (chip: React.ReactNode) =>
    renderToStaticMarkup(<FormField as="group" label="種別">{chip}</FormField>)

  it("単一選択（radiogroup）は外側の group と同じラベルで名付ける（radiogroup は名前必須。#741 で方針変更）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const html = render(<ChipSelector selectionMode="single" options={OPTIONS} value="a" onChange={() => {}} />)
    const labelId = /<span id="([^"]+)"/.exec(html)![1]
    // 外側の group と内側の radiogroup の 2 か所
    expect(html.split(`aria-labelledby="${labelId}"`).length - 1).toBe(2)
    expect(html).toMatch(new RegExp(`aria-labelledby="${labelId}"[^>]*role="radiogroup"|role="radiogroup"[^>]*aria-labelledby="${labelId}"`))
    expect(html).toContain('role="group"')
    // 名前なしの警告は出ない
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("同じ group 内の複数の ChipSelector（単一選択）はどちらも同じラベルで名付け、警告なし", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const html = render(
      <>
        <ChipSelector selectionMode="single" options={OPTIONS} value="a" onChange={() => {}} />
        <ChipSelector selectionMode="single" options={OPTIONS} value="b" onChange={() => {}} />
      </>
    )
    expect(html.split('role="radiogroup"').length - 1).toBe(2)
    expect(html.split("aria-labelledby=").length - 1).toBe(3)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("multiple モードは従来どおり（role=group・名前を足さない）", () => {
    const html = render(<ChipSelector selectionMode="multiple" options={OPTIONS} value={["a"]} onChange={() => {}} />)
    expect(html.split("aria-labelledby=").length - 1).toBe(1)
    expect(html).not.toContain("radiogroup")
  })

  it("明示した aria-labelledby / aria-label は優先される", () => {
    const html = render(
      <ChipSelector selectionMode="single" options={OPTIONS} value="a" onChange={() => {}} aria-labelledby="mine" />
    )
    expect(html).toContain('aria-labelledby="mine"')
    const labelled = render(<ChipSelector selectionMode="single" options={OPTIONS} value="a" onChange={() => {}} aria-label="独自" />)
    expect(labelled).toContain('aria-label="独自"')
    // aria-label を明示したら group のラベルは結ばない（外側の group の 1 か所だけ）
    expect(labelled.split("aria-labelledby=").length - 1).toBe(1)
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
  it("overlay で fixed inset-0 z-Overlay h-full、既定は h-screen のまま", () => {
    const on = renderToStaticMarkup(<AdminShell overlay sidebar={<nav />}>x</AdminShell>)
    expect(on).toContain("fixed inset-0 z-[var(--Z-Overlay)] h-full")
    expect(on).not.toContain("h-screen")
    const off = renderToStaticMarkup(<AdminShell sidebar={<nav />}>x</AdminShell>)
    expect(off).toContain("h-screen")
    expect(off).not.toContain("fixed inset-0")
  })
})
