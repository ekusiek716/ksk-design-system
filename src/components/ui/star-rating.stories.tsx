import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { StarRating } from "./star-rating"

const meta: Meta<typeof StarRating> = {
  title: "UI/StarRating",
  component: StarRating,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof StarRating>

export const Interactive: Story = {
  render: () => {
    const [v, setV] = React.useState(3)
    return (
      <div className="flex flex-col gap-4 p-4">
        <StarRating value={v} onChange={setV} />
        <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">{v} / 5</p>
      </div>
    )
  },
}

export const ReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      <StarRating value={5} />
      <StarRating value={3.5} />
      <StarRating value={1} />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <StarRating value={4} size="sm" />
      <StarRating value={4} size="md" />
      <StarRating value={4} size="lg" />
    </div>
  ),
}
