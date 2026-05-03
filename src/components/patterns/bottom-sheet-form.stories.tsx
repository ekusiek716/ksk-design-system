import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { BottomSheetForm } from "./bottom-sheet-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof BottomSheetForm> = {
  title: "Components/BottomSheetForm",
  component: BottomSheetForm,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof BottomSheetForm>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>フォームを開く</Button>
        <BottomSheetForm
          open={open}
          onOpenChange={setOpen}
          title="タスクを追加"
          description="新しいタスクを入力してください。"
          onSubmit={() => {}}
        >
          <div className="space-y-2">
            <Label htmlFor="task-title">タイトル</Label>
            <Input id="task-title" placeholder="タスク名を入力" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-note">メモ</Label>
            <Input id="task-note" placeholder="任意のメモ" />
          </div>
        </BottomSheetForm>
      </div>
    )
  },
}

export const WithLoading: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>非同期保存</Button>
        <BottomSheetForm
          open={open}
          onOpenChange={setOpen}
          title="プロフィール編集"
          submitLabel="更新する"
          onSubmit={() => new Promise((r) => setTimeout(r, 2000))}
        >
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input id="name" defaultValue="山田 太郎" />
          </div>
        </BottomSheetForm>
      </div>
    )
  },
}
