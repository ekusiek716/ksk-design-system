import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"
import * as React from "react"
import { ChipSelector } from "./chip-selector"

const meta: Meta<typeof ChipSelector> = {
  title: "Components/ChipSelector",
  component: ChipSelector,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ChipSelector>

const CATEGORIES = [
  { label: "仕事", value: "work" },
  { label: "家族", value: "family" },
  { label: "健康", value: "health" },
  { label: "趣味", value: "hobby" },
  { label: "買い物", value: "shopping" },
  { label: "その他", value: "other" },
]

export const MultiSelect: Story = {
  render: () => {
    const [v, setV] = React.useState<string[]>(["work"])
    return (
      <div className="p-4 space-y-3">
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">選択: {v.join(", ") || "なし"}</p>
      </div>
    )
  },
}

export const SingleSelect: Story = {
  render: () => {
    const [v, setV] = React.useState<string[]>([])
    return (
      <div className="p-4 space-y-3">
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} multiple={false} />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">選択: {v[0] ?? "なし"}</p>
      </div>
    )
  },
}

export const WithMax: Story = {
  render: () => {
    const [v, setV] = React.useState<string[]>([])
    return (
      <div className="p-4 space-y-3">
        <p className="typo-label-sm text-[var(--Text-High-Emphasis)]">最大3つまで選択</p>
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} max={3} />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">{v.length}/3 選択中</p>
      </div>
    )
  },
}

/**
 * 折り返した行同士でタッチターゲットが重ならないこと（issue #263）。
 *
 * Chip は透明な before 擬似要素で当たり判定を 44px に広げるが、それだけだと
 * `flex-wrap gap-2` の md チップは行間 40px（32px + 8px）に対し当たり判定 44px となり
 * 上下の行が 4px 重なる。重なった帯では後に描画されたチップが隣の行へのタップを
 * 奪ってしまう。Chip 側で「44px - 本体の高さ」の縦 margin を持ち、
 * 行そのものに 44px を予約することで防いでいる。
 */
export const WrappedRowsDoNotOverlap: Story = {
  tags: ["interaction"],
  render: () => (
    <div style={{ width: 220 }}>
      <ChipSelector options={CATEGORIES} value={[]} onChange={() => {}} multiple />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const targets = [
      ...canvasElement.querySelectorAll(
        '[data-slot="chip"] button, [data-slot="chip"] a, button[data-slot="chip"], a[data-slot="chip"]'
      ),
    ]
    await expect(targets.length).toBeGreaterThan(1)

    const boxes = targets.map((el) => {
      const r = el.getBoundingClientRect()
      const hit = parseFloat(getComputedStyle(el, "::before").height) || 0
      const cy = r.top + r.height / 2
      return { cy, top: cy - hit / 2, bottom: cy + hit / 2, left: r.left, right: r.right, hit, h: r.height }
    })

    // 折り返して 2 行以上になっていること（前提が崩れたら検査の意味が無くなる）
    const rows = new Set(boxes.map((b) => Math.round(b.cy)))
    await expect(rows.size).toBeGreaterThan(1)

    // 見た目の高さは 32px のまま、当たり判定だけ 44px
    await expect(Math.round(boxes[0].h)).toBe(32)
    await expect(Math.round(boxes[0].hit)).toBe(44)

    // 別の行にあるチップ同士で当たり判定が重なっていない
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i]
        const b = boxes[j]
        if (Math.abs(a.cy - b.cy) <= 1) continue
        const verticallyOverlaps = a.bottom > b.top + 0.5 && b.bottom > a.top + 0.5
        const horizontallyOverlaps = a.right > b.left + 0.5 && b.right > a.left + 0.5
        await expect(verticallyOverlaps && horizontallyOverlaps).toBe(false)
      }
    }
  },
}
