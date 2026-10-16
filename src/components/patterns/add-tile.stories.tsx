/**
 * @file AddTile のストーリー
 * @description 一覧の末尾・空カラム・グリッドの空き枠に置く「＋追加」の点線タイル（issue #678）
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent } from "storybook/test"
import { People } from "iconsax-reactjs"
import { AddTile } from "./add-tile"
import { Card, CardTitle, CardDescription } from "../ui/card"

const meta: Meta<typeof AddTile> = {
  title: "Components/AddTile",
  component: AddTile,
  tags: ["autodocs"],
  args: { label: "タスクを追加", onClick: fn() },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}
export default meta
type Story = StoryObj<typeof AddTile>

export const Default: Story = {
  tags: ["interaction"],
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole("button", { name: "タスクを追加" })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const Small: Story = { args: { size: "sm", label: "項目を追加" } }

export const CustomIcon: Story = { args: { icon: <People />, label: "卓を追加" } }

// disabled の button は axe の color-contrast の対象外（WCAG 1.4.3 の inactive 例外）なので除外指定は不要
export const Disabled: Story = { args: { disabled: true } }

/** グリッドの空き枠に置く例 */
export const InGrid: Story = {
  decorators: [(Story) => <div className="w-[28rem]"><Story /></div>],
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      <Card elevation="none"><CardTitle>卓 A</CardTitle><CardDescription>8 席</CardDescription></Card>
      <AddTile label="卓を追加" className="h-full" />
    </div>
  ),
}
