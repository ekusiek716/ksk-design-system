import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[50]} min={0} max={100} step={1} />
    </div>
  ),
}

export const Range: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[20, 80]} min={0} max={100} step={1} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <div className="flex justify-between">
        <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">価格帯</span>
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">¥1,000〜¥5,000</span>
      </div>
      <Slider defaultValue={[1000, 5000]} min={0} max={10000} step={100} />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[30]} min={0} max={100} step={1} disabled />
    </div>
  ),
}
