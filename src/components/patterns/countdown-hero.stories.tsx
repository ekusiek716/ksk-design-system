import type { Meta, StoryObj } from "@storybook/react"
import { CountdownHero } from "./countdown-hero"

const meta: Meta<typeof CountdownHero> = {
  title: "Components/CountdownHero",
  component: CountdownHero,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof CountdownHero>

function daysFromNow(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

export const Upcoming: Story = {
  render: () => (
    <div className="max-w-sm p-4">
      <CountdownHero targetDate={daysFromNow(42)} />
    </div>
  ),
}

export const Today: Story = {
  render: () => (
    <div className="max-w-sm p-4">
      <CountdownHero targetDate={daysFromNow(0)} />
    </div>
  ),
}

export const Past: Story = {
  render: () => (
    <div className="max-w-sm p-4">
      <CountdownHero targetDate={daysFromNow(-5)} />
    </div>
  ),
}

export const WithIllustrationSlot: Story = {
  name: "With Illustration Slot",
  render: () => (
    <div className="max-w-sm p-4">
      <CountdownHero
        targetDate={daysFromNow(100)}
        illustration={
          <div
            aria-hidden="true"
            className="h-[144px] w-[160px] rounded-lg bg-[var(--Categorical-4-Subtle)]"
          />
        }
      />
    </div>
  ),
}

export const ISOStringTarget: Story = {
  name: "ISO String targetDate",
  render: () => (
    <div className="max-w-sm p-4">
      <CountdownHero targetDate="2026-12-31" label="年内残り" />
    </div>
  ),
}

export const WithDateLabel: Story = {
  name: "With dateLabel (目標日を数字の下に)",
  render: () => (
    <div className="max-w-sm p-4">
      <CountdownHero
        targetDate="2027-01-03"
        label="式まであと"
        dateLabel="2027.01.03 (日)"
      />
    </div>
  ),
}

export const TodayWithValue: Story = {
  name: "Today with todayValue (0 の代わりに文字)",
  render: () => (
    <div className="max-w-sm p-4">
      <CountdownHero
        targetDate={daysFromNow(0)}
        todayLabel="今日が本番!"
        todayValue="本日"
        dateLabel="2026.06.20 (土)"
      />
    </div>
  ),
}
