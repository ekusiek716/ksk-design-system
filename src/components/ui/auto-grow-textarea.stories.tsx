import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, waitFor } from "storybook/test"
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
  tags: ["interaction"],
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector("textarea")!
    const container = textarea.closest('[data-slot="auto-grow-textarea"]')!.parentElement!
    const previousWidth = container.style.width
    const observerErrors: string[] = []
    const onError = (event: ErrorEvent) => {
      if (event.message.includes("ResizeObserver loop")) observerErrors.push(event.message)
    }
    const settleFrames = () => new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    })
    window.addEventListener("error", onError)
    try {
      container.style.width = "400px"
      await waitFor(() => expect(textarea.clientWidth).toBeGreaterThan(300))
      await settleFrames()
      const viewportWidth = window.innerWidth
      const wideHeight = textarea.getBoundingClientRect().height
      container.style.width = "140px"
      await waitFor(() => expect(textarea.getBoundingClientRect().height).toBeGreaterThan(wideHeight))
      expect(window.innerWidth).toBe(viewportWidth)
      expect(textarea.scrollHeight).toBeLessThanOrEqual(textarea.clientHeight)
      container.style.width = "400px"
      await waitFor(() => expect(textarea.getBoundingClientRect().height).toBe(wideHeight))
    } finally {
      container.style.width = previousWidth
      try {
        await settleFrames()
        expect(observerErrors).toEqual([])
      } finally {
        window.removeEventListener("error", onError)
      }
    }
  },
  render: () => {
    const [value, setValue] = React.useState("打ち合わせで確認した内容を残します。次回までに必要な準備と担当者、確認したいことを記録します。参加者へ共有する資料と議題もあわせて整理します。")

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
