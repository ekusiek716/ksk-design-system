/**
 * @file CodeDisplay のストーリー
 * @description 招待コード・ログインコードを等幅・広めの字間で見せ、ワンタップでコピーする（issue #686）
 */
import type { Meta, StoryObj } from "@storybook/react"
import { CodeDisplay } from "./code-display"

const meta: Meta<typeof CodeDisplay> = {
  title: "Components/CodeDisplay",
  component: CodeDisplay,
  tags: ["autodocs"],
  args: { code: "AB12-CD34", label: "招待コード" },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}
export default meta
type Story = StoryObj<typeof CodeDisplay>

export const Default: Story = {}

export const Large: Story = { args: { size: "lg" } }

export const Accent: Story = { args: { tone: "accent", size: "lg" } }

/** 長いコード（24 桁の招待コード等）は途中で折り返す */
export const LongCode: Story = { args: { code: "K7Q2-M9XA-4RT8-ZP3W-H6NC-2YBD", label: "ログインコード" } }

export const WithoutCopy: Story = { args: { copyable: false } }
