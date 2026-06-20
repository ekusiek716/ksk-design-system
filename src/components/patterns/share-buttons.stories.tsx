import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
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

export const JapanDefault: Story = {
  args: {
    url: "https://example.com/product/1",
    title: "この記事をシェアする",
    region: "jp",
    layout: "inline",
  },
}

export const ExtendedProviders: Story = {
  args: {
    url: "https://example.com/product/1",
    title: "この記事をシェアする",
    providers: ["instagram", "email", "whatsapp", "telegram", "copy"],
    layout: "inline",
  },
}

export const WithShareTracking: Story = {
  name: "With onShare tracking",
  render: () => {
    const [lastProvider, setLastProvider] = React.useState<string>("未実行")

    return (
      <div className="flex flex-col items-center gap-4">
        <ShareButtons
          url="https://example.com/product/1"
          title="この記事をシェアする"
          region="jp"
          layout="inline"
          onShare={(provider) => setLastProvider(provider)}
          onCopy={() => setLastProvider("copy:onCopy")}
        />
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          last event: <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">{lastProvider}</span>
        </p>
      </div>
    )
  },
}
