import type { Meta, StoryObj } from "@storybook/react"
import { ReviewSummary } from "./review-summary"

const meta: Meta<typeof ReviewSummary> = {
  title: "Commerce/ReviewSummary",
  component: ReviewSummary,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ReviewSummary>

export const Default: Story = {
  args: {
    averageRating: 4.3,
    totalCount: 1284,
    distribution: [720, 340, 140, 60, 24],
  },
}

export const HighRating: Story = {
  args: {
    averageRating: 4.8,
    totalCount: 326,
    distribution: [280, 36, 6, 3, 1],
  },
}
