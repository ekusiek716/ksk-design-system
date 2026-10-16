/**
 * @file Highlight のストーリー
 * @description 本文中の検索一致を <mark> で強調する（issue #692）
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Highlight } from "./highlight"

const meta: Meta<typeof Highlight> = {
  title: "Components/Highlight",
  component: Highlight,
  tags: ["autodocs"],
  args: { text: "前撮りの衣装を決める・前撮りの日程を連絡する", query: "前撮り" },
  render: (args) => (
    <p className="typo-body-md text-[var(--Text-High-Emphasis)]">
      <Highlight {...args} />
    </p>
  ),
}
export default meta
type Story = StoryObj<typeof Highlight>

export const Default: Story = {}

export const NoMatch: Story = { args: { query: "招待状" } }

export const SpecialCharacters: Story = { args: { text: "予算 (税込) と (税抜) の差", query: "(税込)" } }
