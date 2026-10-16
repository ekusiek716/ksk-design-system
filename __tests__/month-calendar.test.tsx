/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { MonthCalendar, buildMonthWeeks } from "../src/components/patterns/month-calendar"
import { KanbanColumn } from "../src/components/patterns/kanban-column"

// issue #679: 予定付きの月カレンダーとカンバンの列。
const events = [
  { id: "1", date: "2026-10-03", label: "前撮り", tone: "accent" as const },
  { id: "2", date: "2026-10-03", label: "衣装合わせ" },
  { id: "3", date: "2026-10-03", label: "招待状発送" },
]
const html = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host
}

describe("buildMonthWeeks", () => {
  it("2026-10 は木曜始まり。日曜始まりで先頭 4 つが空、月曜始まりで 3 つが空", () => {
    expect(buildMonthWeeks("2026-10", 0)[0].slice(0, 5)).toEqual([null, null, null, null, "2026-10-01"])
    expect(buildMonthWeeks("2026-10", 1)[0].slice(0, 4)).toEqual([null, null, null, "2026-10-01"])
    expect(buildMonthWeeks("2026-10", 0).flat().filter(Boolean).length).toBe(31)
  })
})

describe("MonthCalendar（#679）", () => {
  it("WAI-ARIA grid の構造で、タブストップは 1 つ（今日）", () => {
    const host = html(<MonthCalendar month="2026-10" today="2026-10-16" events={events} />)
    const grid = host.querySelector('[role="grid"]')!
    expect(grid.getAttribute("aria-label")).toBe("2026年10月")
    expect(grid.querySelectorAll('[role="columnheader"]').length).toBe(7)
    const focusable = grid.querySelectorAll('[role="gridcell"][tabindex="0"]')
    expect(focusable.length).toBe(1)
    expect(focusable[0].getAttribute("data-date")).toBe("2026-10-16")
  })
  it("セルの読み上げ名に日付・今日・予定件数と予定名を含む", () => {
    const host = html(<MonthCalendar month="2026-10" today="2026-10-03" events={events} />)
    expect(host.querySelector('[data-date="2026-10-03"]')!.getAttribute("aria-label")).toBe(
      "10月3日（土）、今日、予定3件: 前撮り、衣装合わせ、招待状発送",
    )
  })
  it("maxEventsPerDay を超えた分は「+n件」、チップと「+n件」はタブストップにならない", () => {
    const host = html(<MonthCalendar month="2026-10" today="2026-10-16" events={events} />)
    const cell = host.querySelector('[data-date="2026-10-03"]')!
    expect(cell.querySelectorAll('[data-slot="month-calendar-event"]').length).toBe(2)
    const more = cell.querySelector('[data-slot="month-calendar-more"]')!
    expect(more.textContent).toBe("+1件")
    expect(more.getAttribute("tabindex")).toBe("-1")
  })
  it("今日・選択日・土日の見た目を DS が決める", () => {
    const host = html(<MonthCalendar month="2026-10" today="2026-10-16" selectedDate="2026-10-20" events={[]} />)
    expect(host.querySelector('[data-date="2026-10-16"] span')!.className).toContain("bg-[var(--Brand-Primary)]")
    const selected = host.querySelector('[data-date="2026-10-20"]')!
    expect(selected.getAttribute("aria-selected")).toBe("true")
    expect(selected.className).toContain("bg-[var(--Surface-Accent-Primary-Light)]")
    expect(host.querySelector('[data-date="2026-10-18"] span')!.className).toContain("text-[var(--Text-Caution)]")
    expect(host.querySelector('[data-date="2026-10-17"] span')!.className).toContain("text-[var(--Text-Accent-Primary)]")
    // 選択日があればタブストップは選択日
    expect(host.querySelector('[tabindex="0"]')!.getAttribute("data-date")).toBe("2026-10-20")
  })
  it("矢印キーで移動し Enter で onSelectDay、月の端は onMonthChange が無ければ止まる", () => {
    const onSelectDay = vi.fn()
    const host = document.createElement("div")
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<MonthCalendar month="2026-10" today="2026-10-31" events={[]} onSelectDay={onSelectDay} />))
    const cell = (d: string) => host.querySelector<HTMLElement>(`[data-date="${d}"]`)!
    act(() => cell("2026-10-31").focus())
    act(() => { cell("2026-10-31").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })) })
    expect(document.activeElement).toBe(cell("2026-10-31"))
    act(() => { cell("2026-10-31").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })) })
    expect(document.activeElement).toBe(cell("2026-10-24"))
    act(() => { cell("2026-10-24").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })) })
    expect(onSelectDay).toHaveBeenCalledWith("2026-10-24")
    act(() => root.unmount())
    host.remove()
  })
  it("月の端で onMonthChange があれば次の月の 1 日を渡す", () => {
    const onMonthChange = vi.fn()
    const host = document.createElement("div")
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<MonthCalendar month="2026-10" today="2026-10-31" onMonthChange={onMonthChange} />))
    const cell = host.querySelector<HTMLElement>('[data-date="2026-10-31"]')!
    act(() => { cell.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })) })
    const next = onMonthChange.mock.calls[0][0] as Date
    expect([next.getFullYear(), next.getMonth(), next.getDate()]).toEqual([2026, 10, 1])
    act(() => root.unmount())
    host.remove()
  })
})

describe("KanbanColumn（#679）", () => {
  it("見出しで名前の付いた section、件数は読み上げにも入る", () => {
    const host = html(<KanbanColumn title="未着手" count={2} tone="info"><div>card</div></KanbanColumn>)
    const section = host.querySelector("section")!
    const h = host.querySelector("h3")!
    expect(section.getAttribute("aria-labelledby")).toBe(h.id)
    expect(h.textContent).toBe("未着手（2件）")
    expect(host.querySelector('[data-slot="kanban-column-count"]')!.getAttribute("aria-hidden")).toBe("true")
    expect(section.className).not.toMatch(/border-t-\d/)
  })
})
