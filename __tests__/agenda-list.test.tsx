/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { AgendaList } from "../src/components/patterns/agenda-list"
import { MonthCalendar } from "../src/components/patterns/month-calendar"

// issue #704: スマホのカレンダー（MonthCalendar view="week" + AgendaList）
const events = [
  { id: "a", date: "2026-10-24", label: "支払い期限", tone: "caution" as const },
  { id: "b", date: "2026-10-03", label: "前撮り" },
  { id: "c", date: "2026-10-03", label: "衣装合わせ", tone: "info" as const },
]
const html = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host
}

describe("AgendaList（#704）", () => {
  it("予定がある日を昇順に並べ、日ごとに読み上げ用の見出しを持つ", () => {
    const host = html(<AgendaList events={events} today="2026-10-24" />)
    const days = [...host.querySelectorAll<HTMLElement>('[data-slot="agenda-list-day"]')]
    expect(days.map((d) => d.dataset.date)).toEqual(["2026-10-03", "2026-10-24"])
    expect(days[0].querySelector("h3")!.textContent).toBe("10月3日（土）")
    expect(days[1].querySelector("h3")!.textContent).toBe("10月24日（土）、今日")
    expect(days[1].getAttribute("aria-current")).toBe("date")
    expect(days[0].hasAttribute("aria-current")).toBe(false)
    expect(days[0].querySelectorAll('[data-slot="agenda-list-event"]').length).toBe(2)
  })

  it("onSelectEvent が無ければ行は button にしない", () => {
    const host = html(<AgendaList events={events} today="2026-10-01" />)
    expect(host.querySelector("button")).toBeNull()
  })

  it("onSelectEvent を渡すと行が button になり、押すとその予定を渡す", () => {
    const onSelectEvent = vi.fn()
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    act(() => root.render(<AgendaList events={events} today="2026-10-01" onSelectEvent={onSelectEvent} />))
    const buttons = container.querySelectorAll<HTMLButtonElement>('[data-slot="agenda-list-event"] button')
    expect(buttons.length).toBe(3)
    expect(buttons[0].type).toBe("button")
    act(() => buttons[2].click())
    expect(onSelectEvent).toHaveBeenCalledWith(events[0])
    act(() => root.unmount())
    container.remove()
  })

  it("dates で予定の無い日も並べ、選択日・dayId を出す", () => {
    const host = html(
      <AgendaList
        events={events}
        today="2026-10-01"
        dates={["2026-10-02", "2026-10-03"]}
        selectedDate="2026-10-02"
        dayId={(d) => `agenda-${d}`}
      />,
    )
    const empty = host.querySelector<HTMLElement>('[data-date="2026-10-02"]')!
    expect(empty.id).toBe("agenda-2026-10-02")
    expect(empty.dataset.selected).toBe("true")
    expect(empty.textContent).toContain("予定なし")
    expect(host.querySelectorAll('[data-slot="agenda-list-day"]').length).toBe(2)
  })

  it("headingLevel で見出しのレベルを変えられる（既定 h3）", () => {
    expect(html(<AgendaList events={events} today="2026-10-01" />).querySelectorAll("h3").length).toBe(2)
    const host = html(<AgendaList events={events} today="2026-10-01" headingLevel={2} />)
    expect(host.querySelectorAll("h3").length).toBe(0)
    expect(host.querySelectorAll("h2").length).toBe(2)
  })

  it("dates の重複は 1 行にまとめる", () => {
    const host = html(<AgendaList events={events} today="2026-10-01" dates={["2026-10-03", "2026-10-03", "2026-10-24"]} />)
    expect([...host.querySelectorAll<HTMLElement>('[data-slot="agenda-list-day"]')].map((d) => d.dataset.date)).toEqual([
      "2026-10-03",
      "2026-10-24",
    ])
  })

  it("並べる日が無ければ empty を出す", () => {
    const host = html(<AgendaList events={[]} empty={<p>予定はまだありません</p>} />)
    expect(host.querySelector("ul")).toBeNull()
    expect(host.textContent).toBe("予定はまだありません")
  })

  it("en は曜日と見出しを英語にする", () => {
    const host = html(<AgendaList events={events} today="2026-10-01" locale="en" />)
    expect(host.querySelector("h3")!.textContent).toBe("Sat, Oct 3")
  })
})

describe("MonthCalendar view=\"week\"（#704）", () => {
  it("既定（month）は月の全週を出す", () => {
    const host = html(<MonthCalendar month="2026-10" today="2026-10-16" />)
    expect(host.querySelector('[role="grid"]')!.getAttribute("data-view")).toBe("month")
    // 見出し行 + 5 週
    expect(host.querySelectorAll('[role="row"]').length).toBe(6)
  })

  it("week はフォーカス中の日（選択日 → 今日）を含む 1 週だけを出す", () => {
    const today = html(<MonthCalendar month="2026-10" today="2026-10-16" view="week" />)
    expect(today.querySelectorAll('[role="row"]').length).toBe(2)
    expect([...today.querySelectorAll("[data-date]")].map((c) => c.getAttribute("data-date"))).toEqual([
      "2026-10-11",
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
    ])
    const selected = html(<MonthCalendar month="2026-10" today="2026-10-16" selectedDate="2026-10-28" view="week" />)
    expect(selected.querySelector('[role="gridcell"][tabindex="0"]')!.getAttribute("data-date")).toBe("2026-10-28")
    expect(selected.querySelector('[data-date="2026-10-16"]')).toBeNull()
  })

  it("選択日が外から変わると、表示する週とタブストップがそこへ移る", () => {
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    act(() => root.render(<MonthCalendar month="2026-10" today="2026-10-16" selectedDate="2026-10-16" view="week" />))
    expect(container.querySelector('[data-date="2026-10-30"]')).toBeNull()
    act(() => root.render(<MonthCalendar month="2026-10" today="2026-10-16" selectedDate="2026-10-30" view="week" />))
    expect(container.querySelector('[role="gridcell"][tabindex="0"]')!.getAttribute("data-date")).toBe("2026-10-30")
    act(() => root.unmount())
    container.remove()
  })

  it("月をまたぐ週は月外の日も描く（空きセルにしない）", () => {
    const host = html(<MonthCalendar month="2026-10" today="2026-10-01" view="week" />)
    const cells = [...host.querySelectorAll<HTMLElement>('[role="gridcell"]')]
    expect(cells.map((c) => c.dataset.date)).toEqual([
      "2026-09-27", "2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03",
    ])
    expect(cells[0].dataset.outsideMonth).toBe("true")
    expect(cells[4].hasAttribute("data-outside-month")).toBe(false)
  })

  it("onMonthChange が無くても矢印で月の端を越えて隣の週へ移る", () => {
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    act(() => root.render(<MonthCalendar month="2026-10" today="2026-10-01" view="week" />))
    const cell = (d: string) => container.querySelector<HTMLElement>(`[data-date="${d}"]`)
    act(() => cell("2026-10-01")!.focus())
    act(() => {
      cell("2026-10-01")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }))
    })
    // 9/24 の週（9/20〜9/26）へ
    expect(cell("2026-09-24")).not.toBeNull()
    expect(document.activeElement).toBe(cell("2026-09-24"))
    expect(cell("2026-10-01")).toBeNull()
    act(() => root.unmount())
    container.remove()
  })

  it("onMonthChange があれば月をまたいだときに呼び、表示月が変わってもフォーカス先を保つ", () => {
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    const onMonthChange = vi.fn()
    act(() => root.render(<MonthCalendar month="2026-10" today="2026-10-01" view="week" onMonthChange={onMonthChange} />))
    const cell = (d: string) => container.querySelector<HTMLElement>(`[data-date="${d}"]`)
    act(() => {
      cell("2026-10-01")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }))
    })
    expect(onMonthChange).toHaveBeenCalledTimes(1)
    expect(onMonthChange.mock.calls[0][0].getMonth()).toBe(8)
    act(() => root.render(<MonthCalendar month="2026-09" today="2026-10-01" view="week" onMonthChange={onMonthChange} />))
    expect(container.querySelector('[role="gridcell"][tabindex="0"]')!.getAttribute("data-date")).toBe("2026-09-30")
    // 外から別の月へ切り替えたら、その月の中へ移る
    act(() => root.render(<MonthCalendar month="2026-12" today="2026-10-01" view="week" onMonthChange={onMonthChange} />))
    expect(container.querySelector('[role="gridcell"][tabindex="0"]')!.getAttribute("data-date")).toBe("2026-12-01")
    act(() => root.unmount())
    container.remove()
  })
})
