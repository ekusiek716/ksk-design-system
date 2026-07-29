import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"
import * as React from "react"
import { ChipFilterBar } from "./chip-filter-bar"
import { Chip } from "./chip"

const meta: Meta<typeof ChipFilterBar> = {
  title: "Components/ChipFilterBar",
  component: ChipFilterBar,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ChipFilterBar>

function Demo({ resultCount, resultCountLabel }: { resultCount?: number; resultCountLabel?: (n: number) => string }) {
  const [selected, setSelected] = React.useState("all")
  const options = [
    { value: "all", label: "すべて" },
    { value: "work", label: "仕事" },
    { value: "family", label: "家族" },
    { value: "health", label: "健康" },
    { value: "hobby", label: "趣味" },
  ]
  return (
    <ChipFilterBar resultCount={resultCount} resultCountLabel={resultCountLabel}>
      {options.map((o) => (
        <Chip key={o.value} selected={selected === o.value} onClick={() => setSelected(o.value)}>
          {o.label}
        </Chip>
      ))}
    </ChipFilterBar>
  )
}

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Demo resultCount={42} />
    </div>
  ),
}

export const CustomResultCountLabel: Story = {
  render: () => (
    <div className="max-w-md">
      <Demo resultCount={42} resultCountLabel={(n) => `${n} results found`} />
    </div>
  ),
}

export const Sticky: Story = {
  render: () => (
    <div className="max-w-md h-64 overflow-y-auto border border-[var(--Border-Low-Emphasis)]">
      <div className="h-24 bg-[var(--Surface-Secondary)] flex items-center justify-center typo-label-sm text-[var(--Text-Medium-Emphasis)]">
        ヘッダー相当（この下にチップ行が sticky で貼り付く）
      </div>
      <ChipFilterBar sticky stickyOffset={0} resultCount={12}>
        {["すべて", "未着手", "進行中", "完了"].map((label) => (
          <Chip key={label}>{label}</Chip>
        ))}
      </ChipFilterBar>
      <div className="h-96 px-4 py-2 typo-body-md text-[var(--Text-High-Emphasis)]">
        スクロールするとチップ行が上部に固定表示される。
      </div>
    </div>
  ),
}

export const Bare: Story = {
  render: () => (
    <div className="max-w-md flex gap-2 overflow-x-auto scrollbar-hide px-2 py-2 bg-[var(--Surface-Secondary)]">
      <ChipFilterBar bare>
        {["A", "B", "C"].map((label) => (
          <Chip key={label}>{label}</Chip>
        ))}
      </ChipFilterBar>
    </div>
  ),
}

/**
 * Chip の 44px タッチターゲットが横スクロール行にクリップされないこと（issue #263）。
 *
 * Chip は見た目の高さ(28/32/36px)を保ったまま透明な before 擬似要素でタップ領域を
 * 44px に広げる。ところが `overflow-x-auto` は CSS 仕様上 overflow-y も auto に落ちる
 * （visible にできない）ため、行の高さがチップの実高のままだと擬似要素の上下が
 * クリップされ、当たり判定が 28〜36px に戻ってしまう。
 * ChipFilterBar は行側に min-h-11 + items-center を持つことでこれを防ぐ。
 */
export const TouchTargetNotClipped: Story = {
  tags: ["interaction"],
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const chip = canvasElement.querySelector('[data-slot="chip"]')!
    const row = chip.parentElement!
    const rowRect = row.getBoundingClientRect()
    const chipRect = chip.getBoundingClientRect()
    const before = getComputedStyle(chip, "::before")

    // 見た目の高さは据え置き（レイアウトを動かさない）
    await expect(Math.round(chipRect.height)).toBe(32)
    // 横方向は本体の min-w-11 で 44px を満たす（擬似要素だと隣と重なるため）
    await expect(chipRect.width).toBeGreaterThanOrEqual(44)
    // 擬似要素が 44px あり、行がそれを収めきれる高さを持つ
    await expect(Math.round(parseFloat(before.height))).toBe(44)
    await expect(rowRect.height).toBeGreaterThanOrEqual(44)

    // 擬似要素の上下端が行の可視領域からはみ出していない（＝クリップされない）
    const beforeH = parseFloat(before.height)
    const centerY = chipRect.top + chipRect.height / 2
    await expect(centerY - beforeH / 2).toBeGreaterThanOrEqual(rowRect.top - 0.5)
    await expect(centerY + beforeH / 2).toBeLessThanOrEqual(rowRect.bottom + 0.5)

    // 隣接チップの当たり判定が重なっていない（重なると誤タップになる）
    const chips = [...canvasElement.querySelectorAll('[data-slot="chip"]')]
    for (let i = 1; i < chips.length; i++) {
      const prev = chips[i - 1].getBoundingClientRect()
      const cur = chips[i].getBoundingClientRect()
      await expect(cur.left).toBeGreaterThanOrEqual(prev.right - 0.5)
    }
  },
}
