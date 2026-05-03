/**
 * @file Progress のストーリー
 * @description プログレスバーコンポーネント。0%、50%、100%の進行状態を網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "./progress"

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
  },
}
export default meta

type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: { value: 50 },
}

export const Empty: Story = {
  args: { value: 0 },
}

export const Half: Story = {
  args: { value: 50 },
}

export const Full: Story = {
  args: { value: 100 },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">0%</span>
        <Progress value={0} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">25%</span>
        <Progress value={25} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">50%</span>
        <Progress value={50} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">75%</span>
        <Progress value={75} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">100%</span>
        <Progress value={100} />
      </div>
    </div>
  ),
}
