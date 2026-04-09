import type { Meta, StoryObj } from "@storybook/react"
import { RatingDisplay } from "./rating-display"

const meta: Meta<typeof RatingDisplay> = { title: "Commerce/RatingDisplay", component: RatingDisplay }
export default meta
type Story = StoryObj<typeof RatingDisplay>

export const Default: Story = { render: () => <RatingDisplay rating={4.67} reviewCount={345} /> }
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <RatingDisplay rating={4.5} reviewCount={120} size="sm" />
      <RatingDisplay rating={4.5} reviewCount={120} size="md" />
      <RatingDisplay rating={4.5} reviewCount={120} size="lg" />
    </div>
  ),
}
export const ValueOnly: Story = { render: () => <RatingDisplay rating={3.8} showCount={false} /> }
