import type { Meta, StoryObj } from "@storybook/react"
import { ShareButtons } from "./share-buttons"

const meta: Meta<typeof ShareButtons> = {
  title: "Components/ShareButtons",
  component: ShareButtons,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ShareButtons>

export const Circle: Story = {
  args: {
    url: "https://example.com/product/1",
    title: "この記事をシェアする",
    layout: "circle",
  },
}

export const Inline: Story = {
  args: {
    url: "https://example.com/product/1",
    title: "この記事をシェアする",
    layout: "inline",
  },
}

export const SelectiveProviders: Story = {
  args: {
    url: "https://example.com/product/1",
    providers: ["line", "x", "copy"],
    layout: "inline",
  },
}
