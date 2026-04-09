import type { Meta, StoryObj } from "@storybook/react"
import { PriceDisplay } from "./price-display"

const meta: Meta<typeof PriceDisplay> = { title: "Commerce/PriceDisplay", component: PriceDisplay }
export default meta
type Story = StoryObj<typeof PriceDisplay>

export const Default: Story = { render: () => <PriceDisplay price={3980} /> }
export const Sale: Story = { render: () => <PriceDisplay price={2980} originalPrice={4980} /> }
export const Range: Story = { render: () => <PriceDisplay price={2500} maxPrice={4000} /> }
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PriceDisplay price={3980} size="sm" />
      <PriceDisplay price={3980} size="md" />
      <PriceDisplay price={3980} size="lg" />
      <PriceDisplay price={3980} size="xl" />
    </div>
  ),
}
