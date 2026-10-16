/**
 * @file AgendaList のストーリー
 * @description 予定がある日を時系列に並べる一覧（issue #704）。スマホのカレンダーで MonthCalendar の下に置く
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Calendar1 } from "iconsax-reactjs"
import { fn } from "storybook/test"
import { AgendaList } from "./agenda-list"
import { EmptyState } from "./empty-state"
import type { MonthCalendarEvent } from "./month-calendar"

const EVENTS: MonthCalendarEvent[] = [
  { id: "1", date: "2026-10-03", label: "前撮り", tone: "accent" },
  { id: "2", date: "2026-10-03", label: "衣装合わせ", tone: "info" },
  { id: "4", date: "2026-10-16", label: "会場打合せ", tone: "success" },
  { id: "5", date: "2026-10-24", label: "支払い期限", tone: "caution" },
  { id: "6", date: "2026-10-31", label: "リハーサル" },
]

const meta: Meta<typeof AgendaList> = {
  title: "Components/AgendaList",
  component: AgendaList,
  tags: ["autodocs"],
  args: { events: EVENTS, today: "2026-10-16", onSelectEvent: fn() },
  decorators: [(Story) => <div className="w-full max-w-sm"><Story /></div>],
}
export default meta
type Story = StoryObj<typeof AgendaList>

/** 予定がある日だけを昇順に。今日は日付が Text-Accent-Primary、行は aria-current="date" */
export const Default: Story = {}

/** 選択日の行を Surface-Accent-Primary-Light にする（MonthCalendar の選択と揃える） */
export const WithSelectedDate: Story = { args: { selectedDate: "2026-10-24" } }

/** `dates` で予定の無い日も並べる（その週の 7 日など）。予定の無い日は「予定なし」 */
export const FixedDates: Story = {
  args: {
    dates: ["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17", "2026-10-18"],
  },
}

/** 並べる日が無いときは `empty` を出す */
export const Empty: Story = {
  args: {
    events: [],
    empty: <EmptyState icon={<Calendar1 size={48} />} title="予定はまだありません" />,
  },
}

/** 押せない一覧（onSelectEvent なし）は読むだけの行になる */
export const ReadOnly: Story = { args: { onSelectEvent: undefined } }
