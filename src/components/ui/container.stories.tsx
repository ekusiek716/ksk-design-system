import type { Meta, StoryObj } from "@storybook/react"
import { Container } from "./container"

const meta: Meta<typeof Container> = {
  title: "Components/Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof Container>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 py-8">
      {(["narrow", "page", "wide", "fluid"] as const).map((size) => (
        <Container key={size} size={size}>
          <div className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-6">
            <p className="typo-label-md text-[var(--Text-High-Emphasis)]">{size}</p>
          </div>
        </Container>
      ))}
    </div>
  ),
}
