/**
 * @file MonthCalendar のストーリー
 * @description 予定付きの月カレンダー（issue #679）。WAI-ARIA grid のキー操作・「+n件」・md 未満のドット表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, fn, userEvent } from "storybook/test"
import { MonthCalendar, MonthCalendarExpandToggle, MonthCalendarHeader, type MonthCalendarEvent } from "./month-calendar"
import { AgendaList } from "./agenda-list"
import { Button } from "../ui/button"

const EVENTS: MonthCalendarEvent[] = [
  { id: "1", date: "2026-10-03", label: "前撮り", tone: "accent" },
  { id: "2", date: "2026-10-03", label: "衣装合わせ", tone: "info" },
  { id: "3", date: "2026-10-03", label: "招待状発送", tone: "warning" },
  { id: "4", date: "2026-10-16", label: "会場打合せ", tone: "success" },
  { id: "5", date: "2026-10-24", label: "支払い期限", tone: "caution" },
  { id: "6", date: "2026-10-31", label: "リハーサル" },
]

const meta: Meta<typeof MonthCalendar> = {
  title: "Components/MonthCalendar",
  component: MonthCalendar,
  tags: ["autodocs"],
  args: { month: "2026-10", today: "2026-10-16", events: EVENTS, onSelectDay: fn(), onSelectEvent: fn() },
  decorators: [(Story) => <div className="w-full max-w-3xl"><Story /></div>],
}
export default meta
type Story = StoryObj<typeof MonthCalendar>

export const Default: Story = {}

function Controlled(args: React.ComponentProps<typeof MonthCalendar>) {
  const [month, setMonth] = React.useState(new Date(2026, 9, 1))
  const [selected, setSelected] = React.useState<string | undefined>("2026-10-16")
  return (
    <div className="flex flex-col gap-2">
      <p className="typo-label-md text-[var(--Text-High-Emphasis)]">
        {month.getFullYear()}年{month.getMonth() + 1}月 / 選択: {selected ?? "なし"}
      </p>
      <MonthCalendar
        {...args}
        month={month}
        onMonthChange={setMonth}
        selectedDate={selected}
        onSelectDay={(d) => {
          setSelected(d)
          args.onSelectDay?.(d)
        }}
      />
    </div>
  )
}

/** 矢印・Home / End・PageUp / PageDown・Enter（WAI-ARIA grid）。タブストップは 1 つ */
export const Keyboard: Story = {
  tags: ["interaction"],
  render: (args) => <Controlled {...args} />,
  play: async ({ canvasElement, args }) => {
    const cell = (d: string) => canvasElement.querySelector<HTMLElement>(`[data-date="${d}"]`)!
    await expect(canvasElement.querySelectorAll('[role="gridcell"][tabindex="0"]').length).toBe(1)
    cell("2026-10-16").focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(document.activeElement).toBe(cell("2026-10-17"))
    await userEvent.keyboard("{ArrowDown}")
    await expect(document.activeElement).toBe(cell("2026-10-24"))
    await userEvent.keyboard("{Home}")
    await expect(document.activeElement).toBe(cell("2026-10-18"))
    await userEvent.keyboard("{Enter}")
    await expect(args.onSelectDay).toHaveBeenCalledWith("2026-10-18")
    await userEvent.keyboard("{PageDown}")
    await expect(document.activeElement?.getAttribute("data-date")).toBe("2026-11-18")
  },
}

export const MondayStart: Story = { args: { weekStartsOn: 1 } }

export const English: Story = { args: { locale: "en" } }

/**
 * スマホのカレンダー画面（issue #704）。`view="week"` の週の帯 + 月グリッドへの切り替え +
 * `AgendaList`（予定がある日の一覧）。consumer が週ストリップ・アジェンダを自作しなくてよい。
 * 帯の日を選ぶと AgendaList の選択日も揃う（`dayId` でその日の行へスクロールもできる）。
 */
function MobileAgendaDemo(args: React.ComponentProps<typeof MonthCalendar>) {
  const [view, setView] = React.useState<"week" | "month">("week")
  const [selected, setSelected] = React.useState<string | undefined>("2026-10-16")
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MonthCalendar
        {...args}
        view={view}
        selectedDate={selected}
        onSelectDay={(d) => {
          setSelected(d)
          args.onSelectDay?.(d)
          document.getElementById(`agenda-${d}`)?.scrollIntoView({ block: "nearest" })
        }}
      />
      <Button variant="ghost" size="sm" aria-expanded={view === "month"} onClick={() => setView((v) => (v === "week" ? "month" : "week"))}>
        {view === "week" ? "月を表示" : "週だけにする"}
      </Button>
      <AgendaList
        events={EVENTS}
        today="2026-10-16"
        selectedDate={selected}
        dayId={(d) => `agenda-${d}`}
        onSelectEvent={args.onSelectEvent}
      />
    </div>
  )
}

export const MobileWeekWithAgenda: Story = {
  tags: ["interaction"],
  render: (args) => <MobileAgendaDemo {...args} />,
  play: async ({ canvasElement, args }) => {
    // week は 1 行（10/16 を含む週）だけ
    const rows = () => canvasElement.querySelectorAll('[role="grid"] [role="row"]')
    await expect(rows().length).toBe(2) // 曜日の見出し行 + 1 週
    const cell = (d: string) => canvasElement.querySelector<HTMLElement>(`[data-date="${d}"][role="gridcell"]`)
    cell("2026-10-16")!.focus()
    // 下へ 1 週: 表示する週が移る
    await userEvent.keyboard("{ArrowDown}")
    await expect(document.activeElement).toBe(cell("2026-10-23"))
    await expect(cell("2026-10-16")).toBeNull()
    // AgendaList: 予定がある日だけ・今日に aria-current="date"
    const days = canvasElement.querySelectorAll('[data-slot="agenda-list-day"]')
    await expect([...days].map((d) => d.getAttribute("data-date"))).toEqual(["2026-10-03", "2026-10-16", "2026-10-24", "2026-10-31"])
    await expect(canvasElement.querySelector('[data-slot="agenda-list-day"][data-date="2026-10-16"]')!.getAttribute("aria-current")).toBe("date")
    const firstEvent = canvasElement.querySelector<HTMLButtonElement>('[data-slot="agenda-list-event"] button')!
    await userEvent.click(firstEvent)
    await expect(args.onSelectEvent).toHaveBeenCalledWith(EVENTS[0])
  },
}

/**
 * 分類の識別色（issue #716）。`accentColor` に `var(--Categorical-N)` を渡すと、md 以上はチップの先頭、
 * md 未満は日付の下の点がその色になる。チップの面と文字は tone のまま。renderEvent で点を自作しない。
 */
const CATEGORY_EVENTS: MonthCalendarEvent[] = [
  { id: "c1", date: "2026-10-03", label: "会場見学", accentColor: "var(--Categorical-1)" },
  { id: "c2", date: "2026-10-03", label: "衣装合わせ", accentColor: "var(--Categorical-4)" },
  { id: "c3", date: "2026-10-16", label: "写真の打合せ", accentColor: "var(--Categorical-7)" },
  { id: "c4", date: "2026-10-24", label: "支払い期限", tone: "caution" },
]

export const CategoryAccent: Story = {
  tags: ["interaction"],
  args: { events: CATEGORY_EVENTS },
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll<HTMLElement>('[data-slot="month-calendar-event-dot"]')
    await expect(dots.length).toBe(3)
    const color = getComputedStyle(dots[0]).backgroundColor
    await expect(color).not.toBe("rgba(0, 0, 0, 0)")
    await expect(color).not.toBe(getComputedStyle(dots[1]).backgroundColor)
  },
}

/**
 * 見出し（月名・今日へ・前後の月）と週 ⇄ 月の開閉（issue #721）。
 * `MonthCalendarHeader` を grid の上、`MonthCalendarExpandToggle` を下に置く。開閉の状態は consumer が持ち、
 * MonthCalendar の view に渡す。見出しと開閉ボタンを h2 + Button で自作しない。
 */
export const HeaderAndExpandToggle: Story = {
  tags: ["interaction"],
  render: function Render(args) {
    const [month, setMonth] = React.useState(new Date(2026, 9, 1))
    const [selected, setSelected] = React.useState<string | undefined>(undefined)
    const [expanded, setExpanded] = React.useState(false)
    const step = (delta: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))
    return (
      <div className="flex flex-col gap-2">
        <MonthCalendarHeader
          month={month}
          onToday={() => {
            setMonth(new Date(2026, 9, 1))
            setSelected("2026-10-16")
          }}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
        <MonthCalendar
          {...args}
          id="header-story-calendar"
          view={expanded ? "month" : "week"}
          month={month}
          selectedDate={selected}
          onSelectDay={setSelected}
          onMonthChange={setMonth}
        />
        <MonthCalendarExpandToggle
          expanded={expanded}
          onExpandedChange={setExpanded}
          aria-controls="header-story-calendar"
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector<HTMLElement>('[data-slot="month-calendar-header"] h2')!
    await expect(heading.textContent).toBe("2026年10月")
    await userEvent.click(canvasElement.querySelector<HTMLElement>('[aria-label="次の月"]')!)
    await expect(heading.textContent).toBe("2026年11月")
    await userEvent.click(canvasElement.querySelector<HTMLElement>('[data-slot="month-calendar-today"]')!)
    await expect(heading.textContent).toBe("2026年10月")
    const grid = canvasElement.querySelector<HTMLElement>('[data-slot="month-calendar"]')!
    await expect(grid.getAttribute("data-view")).toBe("week")
    const toggle = canvasElement.querySelector<HTMLElement>('[data-slot="month-calendar-expand-toggle"]')!
    await expect(toggle.getAttribute("aria-expanded")).toBe("false")
    await expect(toggle.getAttribute("aria-label")).toBe("月全体を表示")
    await userEvent.click(toggle)
    await expect(toggle.getAttribute("aria-expanded")).toBe("true")
    await expect(toggle.getAttribute("aria-label")).toBe("週だけを表示")
    await expect(grid.getAttribute("data-view")).toBe("month")
    await expect(toggle.getBoundingClientRect().width).toBe(grid.getBoundingClientRect().width)
  },
}
