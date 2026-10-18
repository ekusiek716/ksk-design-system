/** @vitest-environment jsdom */
import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { Banner } from "../src/components/patterns/banner"
import { DetailSheetHeader } from "../src/components/patterns/detail-sheet-scaffold"
import { FormField } from "../src/components/patterns/form-field"
import { MonthCalendarHeader } from "../src/components/patterns/month-calendar"
import { PillToggle } from "../src/components/ui/pill-toggle"
import { resetDevWarnings } from "../src/lib/dev-warn"

const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

describe("Banner live (#740)", () => {
  const role = (ui: React.ReactElement) => host(ui).querySelector('[data-slot="banner"]')!.getAttribute("role")

  it("既定は variant から決める: warning / caution は alert、info / success / 未指定は status", () => {
    expect(role(<Banner variant="warning" description="d" />)).toBe("alert")
    expect(role(<Banner variant="caution" description="d" />)).toBe("alert")
    expect(role(<Banner variant="info" description="d" />)).toBe("status")
    expect(role(<Banner variant="success" description="d" />)).toBe("status")
    expect(role(<Banner description="d" />)).toBe("status")
  })

  it("live で明示できる（assertive=alert / polite=status / off=role なし）", () => {
    expect(role(<Banner variant="info" live="assertive" description="d" />)).toBe("alert")
    expect(role(<Banner variant="warning" live="polite" description="d" />)).toBe("status")
    expect(role(<Banner variant="warning" live="off" description="d" />)).toBeNull()
  })

  it("consumer の role 明示は live より優先する（既存の上書きを壊さない）", () => {
    expect(role(<Banner variant="info" role="alert" description="d" />)).toBe("alert")
    expect(role(<Banner variant="warning" live="off" role="note" description="d" />)).toBe("note")
  })
})

describe("PillToggle の名前と semantics (#741)", () => {
  const OPTIONS = [
    { label: "週", value: "week" },
    { label: "月", value: "month" },
  ]
  afterEach(() => {
    resetDevWarnings()
    vi.restoreAllMocks()
  })

  it("既定（tabs）は従来どおり tablist で、aria-label / aria-labelledby を tablist へ渡す", () => {
    const el = host(<PillToggle aria-label="表示" options={OPTIONS} value="week" onChange={() => {}} />)
    const list = el.querySelector('[role="tablist"]')!
    expect(list.getAttribute("aria-label")).toBe("表示")
    expect(el.querySelectorAll('[role="tab"]')).toHaveLength(2)
    expect(el.querySelector('[role="radiogroup"]')).toBeNull()

    const el2 = host(<PillToggle aria-labelledby="h" options={OPTIONS} value="week" onChange={() => {}} />)
    expect(el2.querySelector('[role="tablist"]')!.getAttribute("aria-labelledby")).toBe("h")
  })

  it('semantics="radio" は radiogroup / radio で、選択中は aria-checked=true', () => {
    const el = host(<PillToggle semantics="radio" aria-label="単位" options={OPTIONS} value="month" onChange={() => {}} />)
    const group = el.querySelector('[role="radiogroup"]')!
    expect(group.getAttribute("aria-label")).toBe("単位")
    expect(group.getAttribute("data-slot")).toBe("pill-toggle")
    const radios = [...el.querySelectorAll('[role="radio"]')]
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["false", "true"])
    expect(el.querySelector('[role="tablist"]')).toBeNull()
    expect(el.querySelector('[role="tabpanel"]')).toBeNull()
  })

  it("FormField as=group の中では外側の group だけが名前を持ち（二重に結ばない）、警告も出さない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const html = renderToStaticMarkup(
      <FormField as="group" label="表示単位">
        <PillToggle semantics="radio" options={OPTIONS} value="week" onChange={() => {}} />
      </FormField>
    )
    const labelId = /<span id="([^"]+)"/.exec(html)![1]
    expect(html.split(`aria-labelledby="${labelId}"`).length - 1).toBe(1)
    expect(html).toContain('role="group"')
    expect(html).toContain('role="radiogroup"')
    expect(warn).not.toHaveBeenCalled()
  })
})

describe("DetailSheetHeader bordered (#742)", () => {
  const header = (ui: React.ReactElement) => host(ui).querySelector<HTMLElement>('[data-slot="detail-sheet-header"]')!
  const cls = (el: HTMLElement) => el.className.split(" ")

  it("title があるときは従来どおり下線と下余白を出す", () => {
    const el = header(<DetailSheetHeader title="予定" onClose={() => {}} />)
    expect(cls(el)).toEqual(expect.arrayContaining(["border-b", "pb-4"]))
    expect(el.dataset.bordered).toBe("true")
  })

  it("閉じるボタンだけ（trailing だけ）のときは下線と下余白を出さない", () => {
    for (const ui of [
      <DetailSheetHeader onClose={() => {}} />,
      <DetailSheetHeader trailing={<span>…</span>} onClose={() => {}} />,
    ]) {
      const el = header(ui)
      expect(cls(el)).not.toContain("border-b")
      expect(cls(el)).not.toContain("pb-4")
      expect(el.dataset.bordered).toBe("false")
      expect(el.querySelector('[data-slot="detail-sheet-header-close"]')).not.toBeNull()
    }
  })

  it("leading / description / children があれば自動判定は出す。bordered で強制できる", () => {
    expect(cls(header(<DetailSheetHeader leading={<span>L</span>} onClose={() => {}} />))).toContain("border-b")
    expect(cls(header(<DetailSheetHeader description="説明" />))).toContain("border-b")
    expect(cls(header(<DetailSheetHeader><span>x</span></DetailSheetHeader>))).toContain("border-b")
    expect(cls(header(<DetailSheetHeader bordered onClose={() => {}} />))).toEqual(expect.arrayContaining(["border-b", "pb-4"]))
    expect(cls(header(<DetailSheetHeader bordered={false} title="予定" />))).not.toContain("border-b")
  })
})

describe("MonthCalendarHeader trailing (#743)", () => {
  it("右側の並びの右端（次の月ボタンの後ろ）に置く", () => {
    const el = host(
      <MonthCalendarHeader month="2026-10-01" onPrev={() => {}} onNext={() => {}} trailing={<span data-testid="t">追加</span>} />
    )
    const actions = el.querySelector('[data-slot="month-calendar-header-actions"]')!
    const children = [...actions.children]
    expect(children.at(-1)!.getAttribute("data-testid")).toBe("t")
    expect(children.at(-2)!.getAttribute("data-slot")).toBe("month-calendar-next")
  })

  it("前後ボタンが無くても trailing だけで右側の並びを出す。無ければ出さない（従来どおり）", () => {
    const el = host(<MonthCalendarHeader month="2026-10-01" trailing={<span data-testid="t">追加</span>} />)
    expect(el.querySelector('[data-slot="month-calendar-header-actions"] [data-testid="t"]')).not.toBeNull()
    expect(host(<MonthCalendarHeader month="2026-10-01" />).querySelector('[data-slot="month-calendar-header-actions"]')).toBeNull()
  })
})
