/**
 * @file MonthCalendar のストーリー
 * @description 予定付きの月カレンダー（issue #679）。WAI-ARIA grid のキー操作・「+n件」・md 未満のドット表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, fn, userEvent } from "storybook/test"
import { MonthCalendar, type MonthCalendarEvent } from "./month-calendar"

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
