/**
 * @file CommitAutoGrowTextarea のストーリー
 * @description IME (日本語変換) を壊さない AutoGrowTextarea の「確定時コミット」版。
 * 挙動の比較デモは commit-input.stories.tsx の AutoGrowCommitTiming にもあるが、
 * 本ファイルは CommitAutoGrowTextarea 単体の autodocs エントリを提供する。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "@/components/ui/label"
import { CommitAutoGrowTextarea } from "./commit-auto-grow-textarea"

const meta: Meta<typeof CommitAutoGrowTextarea> = {
  title: "Components/CommitAutoGrowTextarea",
  component: CommitAutoGrowTextarea,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof CommitAutoGrowTextarea>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("自動で高さが伸びるメモ")
    return (
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="commit-autogrow-default">メモ</Label>
        <CommitAutoGrowTextarea
          id="commit-autogrow-default"
          value={value}
          onCommit={setValue}
          minRows={2}
          placeholder="メモを入力"
        />
      </div>
    )
  },
}

export const MinRows: Story = {
  render: () => {
    const [value, setValue] = React.useState(
      "1行目\n2行目\n3行目\n4行目\nこのように長文でも自動伸縮する"
    )
    return (
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="commit-autogrow-minrows">メモ（最小4行）</Label>
        <CommitAutoGrowTextarea
          id="commit-autogrow-minrows"
          value={value}
          onCommit={setValue}
          minRows={4}
        />
      </div>
    )
  },
}
