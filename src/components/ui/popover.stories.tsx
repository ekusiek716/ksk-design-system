/**
 * @file Popover のストーリー
 * @description ポップオーバーコンポーネント。クリックでコンテンツを表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
}
export default meta

type Story = StoryObj<typeof Popover>

export const ClickToShow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">ポップオーバーを開く</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <p className="typo-label-md text-[var(--Text-High-Emphasis)]">表示設定</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="width">幅</Label>
            <Input id="width" defaultValue="100%" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="height">高さ</Label>
            <Input id="height" defaultValue="auto" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const SimpleContent: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="情報">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M8 7V11M8 5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          この項目に関する補足情報がここに表示されます。
        </p>
      </PopoverContent>
    </Popover>
  ),
}
