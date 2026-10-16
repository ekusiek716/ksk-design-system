import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent } from "storybook/test"
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

/**
 * 押せるヒーロー（issue #672）。`onClick` を渡すとヒーロー全面を覆う不可視の `<button>` が重なり、
 * Enter / Space で発火、DS 標準のフォーカスリングと押下表現（押している間だけ薄くなる）を持つ。
 * 名前は表示中の文言（残り 42 days …）。操作の意味を足すなら `aria-label` を渡す。
 * 遷移なら `href`。呼び出し側で `<Button unstyled>` に包んだり `active:opacity-*` を足したりしない。
 */
export const Interactive: Story = {
  tags: ["interaction"],
  render: () => {
    const [count, setCount] = React.useState(0)
    return (
      <div className="max-w-sm p-4 space-y-2">
        <CountdownHero
          targetDate={daysFromNow(42)}
          dateLabel="2027.01.03 (日)"
          aria-label="挙式日を編集（残り 42 日）"
          onClick={() => setCount((c) => c + 1)}
          illustration={
            <div aria-hidden="true" className="h-[120px] w-[140px] rounded-lg bg-[var(--Categorical-4-Subtle)]" />
          }
        />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]" data-testid="count">
          押した回数: {count}
        </p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const action = canvasElement.querySelector<HTMLButtonElement>('[data-slot="countdown-hero-action"]')!
    await expect(action.tagName).toBe("BUTTON")
    await expect(action.getAttribute("aria-label")).toBe("挙式日を編集（残り 42 日）")
    await userEvent.click(action)
    await userEvent.tab()
    await userEvent.tab({ shift: true })
    action.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard(" ")
    await expect(canvasElement.querySelector('[data-testid="count"]')!.textContent).toContain("3")
  },
}
