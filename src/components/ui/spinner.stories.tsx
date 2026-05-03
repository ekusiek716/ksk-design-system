import type { Meta, StoryObj } from "@storybook/react"
import { Spinner } from "./spinner"

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { size: "md" },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">lg</span>
      </div>
    </div>
  ),
}
