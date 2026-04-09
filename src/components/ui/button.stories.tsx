/**
 * @file Button のストーリー
 * @description 7つのバリアント（default / secondary / secondary-switch / tertiary / ghost / destructive / link）と8つのサイズを網羅するボタンコンポーネント
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "secondary-switch", "tertiary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl", "icon", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: "ボタン", variant: "default", size: "default" },
}

export const Secondary: Story = {
  args: { children: "ボタン", variant: "secondary" },
}

export const SecondarySwitch: Story = {
  args: { children: "ボタン", variant: "secondary-switch" },
}

export const Tertiary: Story = {
  args: { children: "ボタン", variant: "tertiary" },
}

export const Ghost: Story = {
  args: { children: "ボタン", variant: "ghost" },
}

export const Destructive: Story = {
  args: { children: "削除する", variant: "destructive" },
}

export const Link: Story = {
  args: { children: "リンクボタン", variant: "link" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="secondary-switch">Sec-Switch</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="default">Default</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { children: "無効", disabled: true },
}

export const DisabledAllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default" disabled>Default</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="tertiary" disabled>Tertiary</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="destructive" disabled>Destructive</Button>
      <Button variant="link" disabled>Link</Button>
    </div>
  ),
}

export const IconButton: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon-sm" variant="ghost" aria-label="設定">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </Button>
      <Button size="icon" variant="secondary" aria-label="編集">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
      </Button>
      <Button size="icon-lg" variant="default" aria-label="追加">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        追加する
      </Button>
      <Button variant="destructive">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5H13M5 5V13H11V5M7 7V11M9 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        削除する
      </Button>
    </div>
  ),
}
