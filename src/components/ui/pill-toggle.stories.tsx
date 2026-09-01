import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect } from "storybook/test"
import { PillToggle } from "./pill-toggle"

const meta: Meta<typeof PillToggle> = {
  title: "Components/PillToggle",
  component: PillToggle,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof PillToggle>

export const Default: Story = {
  render: () => {
    const [v, setV] = React.useState("all")
    return (
      <PillToggle
        options={[
          { label: "すべて", value: "all" },
          { label: "進行中", value: "active" },
          { label: "完了", value: "done" },
        ]}
        value={v}
        onChange={setV}
      />
    )
  },
}

export const TwoState: Story = {
  render: () => {
    const [v, setV] = React.useState("income")
    return (
      <PillToggle
        options={[
          { label: "収入", value: "income" },
          { label: "支出", value: "expense" },
        ]}
        value={v}
        onChange={setV}
      />
    )
  },
}

export const Small: Story = {
  render: () => {
    const [v, setV] = React.useState("week")
    return (
      <PillToggle
        size="sm"
        options={[
          { label: "週", value: "week" },
          { label: "月", value: "month" },
          { label: "年", value: "year" },
        ]}
        value={v}
        onChange={setV}
      />
    )
  },
}

/**
 * `fullWidth` は行いっぱいに広げ、各項目を等幅にする（issue #500）。
 * 既定（false）はラベル幅のままなので、既存の呼び出しは影響を受けない。
 */
export const FullWidthThree: Story = {
  tags: ["interaction"],
  render: () => {
    const [v, setV] = React.useState("all")
    return (
      <div className="w-[360px]">
        <PillToggle
          fullWidth
          options={[
            { label: "すべて", value: "all" },
            { label: "進行中のタスク（長いラベル）", value: "active" },
            { label: "完了", value: "done" },
          ]}
          value={v}
          onChange={setV}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const tabs = Array.from(canvasElement.querySelectorAll<HTMLElement>('[role="tab"]'))
    await expect(tabs).toHaveLength(3)
    const widths = tabs.map((t) => t.getBoundingClientRect().width)
    // flex-1（basis 0）なのでラベル長に関係なく等幅になる（丸め誤差 1px を許容）
    for (const w of widths) {
      await expect(Math.abs(w - widths[0])).toBeLessThanOrEqual(1)
    }
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="tabs-list"]')!
    // 親（360px）いっぱいに広がっている
    await expect(Math.round(list.getBoundingClientRect().width)).toBe(360)
    // 長いラベルでも折り返さず、trigger の高さは md の h-9(36px) のまま
    for (const t of tabs) {
      await expect(Math.round(t.getBoundingClientRect().height)).toBe(36)
    }
  },
}

export const FullWidthTwo: Story = {
  render: () => {
    const [v, setV] = React.useState("income")
    return (
      <div className="w-[360px]">
        <PillToggle
          fullWidth
          options={[
            { label: "収入", value: "income" },
            { label: "支出", value: "expense" },
          ]}
          value={v}
          onChange={setV}
        />
      </div>
    )
  },
}

export const FullWidthFour: Story = {
  render: () => {
    const [v, setV] = React.useState("day")
    return (
      <div className="w-[360px]">
        <PillToggle
          fullWidth
          size="sm"
          options={[
            { label: "日", value: "day" },
            { label: "週", value: "week" },
            { label: "月", value: "month" },
            { label: "年", value: "year" },
          ]}
          value={v}
          onChange={setV}
        />
      </div>
    )
  },
}
