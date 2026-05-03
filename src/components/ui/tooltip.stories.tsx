/**
 * @file Tooltip のストーリー
 * @description ツールチップコンポーネント。ホバーで表示される補足テキスト
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip"
import { Button } from "./button"

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const HoverToShow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">ホバーしてください</Button>
      </TooltipTrigger>
      <TooltipContent>
        ツールチップのテキストです
      </TooltipContent>
    </Tooltip>
  ),
}

export const OnIconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="設定">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </Button>
      </TooltipTrigger>
      <TooltipContent>設定を開く</TooltipContent>
    </Tooltip>
  ),
}
