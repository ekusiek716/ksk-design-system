/**
 * @file CommitTextarea のストーリー
 * @description IME (日本語変換) を壊さない Textarea の「確定時コミット」版。
 * 挙動の比較デモは commit-input.stories.tsx の TextareaCommitTiming にもあるが、
 * 本ファイルは CommitTextarea 単体の autodocs エントリを提供する。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "@/components/ui/label"
import { CommitTextarea } from "./commit-textarea"

const meta: Meta<typeof CommitTextarea> = {
  title: "Components/CommitTextarea",
  component: CommitTextarea,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof CommitTextarea>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("初期メモ")
    return (
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="commit-textarea-default">メモ</Label>
        <CommitTextarea
          id="commit-textarea-default"
          value={value}
          onCommit={setValue}
          placeholder="メモを入力"
        />
      </div>
    )
  },
}

export const Empty: Story = {
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="commit-textarea-empty">メモ</Label>
        <CommitTextarea
          id="commit-textarea-empty"
          value={value}
          onCommit={setValue}
          placeholder="メモを入力"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <Label htmlFor="commit-textarea-disabled">メモ（無効化）</Label>
      <CommitTextarea
        id="commit-textarea-disabled"
        value="編集できません"
        onCommit={() => {}}
        disabled
      />
    </div>
  ),
}
