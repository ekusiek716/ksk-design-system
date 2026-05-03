import type { Meta, StoryObj } from "@storybook/react"
import { CountdownTimer } from "./countdown-timer"

const meta: Meta<typeof CountdownTimer> = {
  title: "Components/CountdownTimer",
  component: CountdownTimer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CountdownTimer>

const inTwoHours = () => new Date(Date.now() + 2 * 60 * 60 * 1000 + 48 * 60 * 1000 + 33 * 1000)
const inThreeMin = () => new Date(Date.now() + 3 * 60 * 1000 + 12 * 1000)
const past = () => new Date(Date.now() - 1000)

export const Filled: Story = {
  render: () => <CountdownTimer targetDate={inTwoHours()} />,
}

export const Ghost: Story = {
  render: () => <CountdownTimer targetDate={inTwoHours()} variant="ghost" />,
}

export const Compact: Story = {
  render: () => <CountdownTimer targetDate={inThreeMin()} compact label="締切まで" />,
}

export const Ended: Story = {
  render: () => <CountdownTimer targetDate={past()} endedLabel="受付終了" />,
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <CountdownTimer targetDate={inTwoHours()} label="セール終了まで" />
      <CountdownTimer targetDate={inTwoHours()} variant="ghost" label="残り" />
      <CountdownTimer targetDate={inThreeMin()} compact label="締切" />
      <CountdownTimer targetDate={past()} />
    </div>
  ),
}
