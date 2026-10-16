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
})
