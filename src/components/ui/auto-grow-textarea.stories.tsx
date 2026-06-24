import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "@/components/ui/label"
import { AutoGrowTextarea } from "./auto-grow-textarea"

const meta: Meta<typeof AutoGrowTextarea> = {
  title: "Components/AutoGrowTextarea",
  component: AutoGrowTextarea,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof AutoGrowTextarea>

export const DefaultComment: Story = {
  render: () => {
    const [value, setValue] = React.useState("打ち合わせで確認した内容を残します。")

    return (
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="auto-grow-comment">メモ</Label>
        <AutoGrowTextarea
          id="auto-grow-comment"
          value={value}
          onChange={setValue}
          minRows={3}
          maxLength={200}
          placeholder="メモを入力"
        />
      </div>
    )
  },
}

export const CompactTitleEditor: Story = {
  render: () => {
    const [value, setValue] = React.useState("招待状の送付")

    return (
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="auto-grow-title">タイトル</Label>
        <AutoGrowTextarea
          id="auto-grow-title"
          value={value}
          onChange={setValue}
          minRows={1}
          density="compact"
          placeholder="タイトル"
          className="typo-heading-md"
        />
      </div>
    )
  },
}
