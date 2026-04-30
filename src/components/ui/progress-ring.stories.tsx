import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ProgressRing } from "./progress-ring"

const meta: Meta<typeof ProgressRing> = {
  title: "UI/ProgressRing",
  component: ProgressRing,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ProgressRing>

export const Default: Story = { render: () => <ProgressRing value={72} /> }
export const Empty: Story = { render: () => <ProgressRing value={0} /> }
export const Full: Story = { render: () => <ProgressRing value={100} /> }

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressRing value={60} size="sm" />
      <ProgressRing value={60} size="md" />
      <ProgressRing value={60} size="lg" />
      <ProgressRing value={60} size="xl" />
    </div>
  ),
}

export const CustomLabel: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressRing value={3} size="xl" label={<span className="flex flex-col items-center"><span className="typo-label-lg">3</span><span className="typo-label-xs text-[var(--Text-Medium-Emphasis)]">/ 10</span></span>} />
      <ProgressRing value={100} size="xl" label="✓" />
    </div>
  ),
}

export const Animated: Story = {
  render: () => {
    const [v, setV] = React.useState(0)
    React.useEffect(() => {
      const t = setTimeout(() => setV(75), 300)
      return () => clearTimeout(t)
    }, [])
    return <ProgressRing value={v} size="xl" />
  },
}
