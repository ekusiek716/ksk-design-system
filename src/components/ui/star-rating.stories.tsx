import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"
import { StarRating } from "./star-rating"

const meta: Meta<typeof StarRating> = {
  title: "Components/StarRating",
  component: StarRating,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof StarRating>

export const Interactive: Story = {
  tags: ["interaction"],
  render: () => {
    const [v, setV] = React.useState(3)
    return (
      <div className="flex flex-col gap-4 p-4">
        <StarRating value={v} onChange={setV} />
        <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">{v} / 5</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radios = canvas.getAllByRole("radio")

    await expect(radios[2]).toHaveAttribute("tabindex", "0")
    await expect(radios[0]).toHaveAttribute("tabindex", "-1")

    radios[2].focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(radios[3]).toHaveFocus()
    await expect(radios[3]).toHaveAttribute("aria-checked", "true")

    await userEvent.keyboard("{Home}")
    await expect(radios[0]).toHaveFocus()
    await expect(radios[0]).toHaveAttribute("aria-checked", "true")

    await userEvent.keyboard("{End}")
    await expect(radios[4]).toHaveFocus()
    await expect(radios[4]).toHaveAttribute("aria-checked", "true")
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
