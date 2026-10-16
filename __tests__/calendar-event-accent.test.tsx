/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { MonthCalendar, type MonthCalendarEvent } from "../src/components/patterns/month-calendar"
import { AgendaList } from "../src/components/patterns/agenda-list"

// issue #716: 予定ごとの分類の識別色
const events: MonthCalendarEvent[] = [
  { id: "a", date: "2026-10-03", label: "会場見学", accentColor: "var(--Categorical-3)" },
  { id: "b", date: "2026-10-03", label: "衣装", tone: "info" },
  { id: "c", date: "2026-10-05", label: "空文字", accentColor: "  " },
]
const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

describe("MonthCalendar accentColor（#716）", () => {
  it("md 以上のチップの先頭に識別色の点、チップの面は tone のまま", () => {
    const el = host(<MonthCalendar month="2026-10" events={events} today="2026-10-01" />)
    const chips = el.querySelectorAll<HTMLElement>('[data-slot="month-calendar-event"]')
    const dot = chips[0].querySelector<HTMLElement>('[data-slot="month-calendar-event-dot"]')!
    expect(dot.style.getPropertyValue("--ksk-calendar-accent")).toBe("var(--Categorical-3)")
    expect(dot.className).toContain("bg-[var(--ksk-calendar-accent)]")
    expect(dot.getAttribute("aria-hidden")).toBe("true")
    expect(chips[0].className).toContain("bg-[var(--Surface-Tertiary)]")
    expect(chips[0].textContent).toBe("会場見学")
    // 未指定・空白は従来どおり（点なし・テキスト直下）
    expect(chips[1].querySelector('[data-slot="month-calendar-event-dot"]')).toBeNull()
    expect(chips[1].innerHTML).toBe("衣装")
    expect(chips[2].querySelector('[data-slot="month-calendar-event-dot"]')).toBeNull()
  })

  it("md 未満の日付の下の点は識別色を tone より優先する", () => {
    const el = host(<MonthCalendar month="2026-10" events={events} today="2026-10-01" />)
    const accentDots = el.querySelectorAll<HTMLElement>("span[data-accent].size-1\\.5")
    expect(accentDots.length).toBe(1)
    expect(accentDots[0].style.getPropertyValue("--ksk-calendar-accent")).toBe("var(--Categorical-3)")
    expect(el.innerHTML).toContain("bg-[var(--Object-Info)]")
  })
})

describe("AgendaList accentColor（#716）", () => {
  it("予定の行の先頭に点を置き、未指定の行は従来どおり", () => {
    const el = host(<AgendaList events={events} today="2026-10-01" />)
    const rows = el.querySelectorAll<HTMLElement>('[data-slot="agenda-list-event"]')
    const dot = rows[0].querySelector<HTMLElement>('[data-slot="agenda-list-event-dot"]')!
    expect(dot.style.getPropertyValue("--ksk-calendar-accent")).toBe("var(--Categorical-3)")
    expect(rows[0].textContent).toBe("会場見学")
    expect(rows[1].querySelector('[data-slot="agenda-list-event-dot"]')).toBeNull()
    expect(rows[1].firstElementChild!.innerHTML).toBe("衣装")
  })
})

describe("accentColor のレビュー指摘（#716）", () => {
  it("前後の空白を除いた値を渡す", () => {
    const el = host(
      <MonthCalendar month="2026-10" today="2026-10-01" events={[{ id: "x", date: "2026-10-09", label: "前撮り", accentColor: "  var(--Categorical-2) " }]} />,
    )
    const dot = el.querySelector<HTMLElement>('[data-slot="month-calendar-event-dot"]')!
    expect(dot.style.getPropertyValue("--ksk-calendar-accent")).toBe("var(--Categorical-2)")
    const mobileDot = el.querySelector<HTMLElement>("span[data-accent].size-1\\.5")!
    expect(mobileDot.style.getPropertyValue("--ksk-calendar-accent")).toBe("var(--Categorical-2)")
    const agenda = host(<AgendaList today="2026-10-01" events={[{ id: "x", date: "2026-10-09", label: "前撮り", accentColor: " red " }]} />)
    expect(agenda.querySelector<HTMLElement>('[data-slot="agenda-list-event-dot"]')!.style.getPropertyValue("--ksk-calendar-accent")).toBe("red")
  })

  it("点は aria-hidden で、日のセルの読み上げ名に予定名が入っている", () => {
    const el = host(<MonthCalendar month="2026-10" events={events} today="2026-10-01" />)
    const cell = el.querySelector<HTMLElement>('[role="gridcell"][data-date="2026-10-03"]') ??
      [...el.querySelectorAll<HTMLElement>('[role="gridcell"]')].find((c) => (c.getAttribute("aria-label") ?? "").includes("会場見学"))!
    const name = cell.getAttribute("aria-label") ?? ""
    expect(name).toContain("会場見学")
    expect(name).toContain("衣装")
    for (const dot of cell.querySelectorAll('[data-slot="month-calendar-event-dot"]')) {
      expect(dot.closest('[aria-hidden="true"]')).not.toBeNull()
    }
  })
})
