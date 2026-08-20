import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor } from "storybook/test"
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

/** 支出カテゴリ相当の 9 択（issue #418）。1 行に収まらず折り返す前提の選択肢数。 */
const EXPENSE_CATEGORIES = [
  { label: "食費", value: "food" },
  { label: "交通費", value: "transport" },
  { label: "宿泊", value: "lodging" },
  { label: "観光", value: "sightseeing" },
  { label: "買い物", value: "shopping" },
  { label: "通信", value: "telecom" },
  { label: "医療", value: "medical" },
  { label: "交際費", value: "social" },
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

/**
 * `selectionMode="single"`（issue #352）。`multiple={false}` と同じ挙動だが、
 * 語彙が `QuickActionGrid` / `ActionTile`（#318）と揃う。
 * グループが `role="radiogroup"`、チップが `role="radio"` + `aria-checked` になり、
 * 矢印キーで移動・選択できる。
 */
export const SelectionModeSingle: Story = {
  tags: ["interaction"],
  render: () => {
    const [v, setV] = React.useState<string[]>(["work"])
    return (
      <div className="p-4 space-y-3">
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} selectionMode="single" />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">選択: {v[0] ?? "なし"}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="chip-selector"]')!
    await expect(group.getAttribute("role")).toBe("radiogroup")
    const chips = [...canvasElement.querySelectorAll<HTMLButtonElement>('button[data-slot="chip"]')]
    await expect(chips[0].getAttribute("role")).toBe("radio")
    await expect(chips[0].getAttribute("aria-checked")).toBe("true")
    await expect(chips[1].getAttribute("aria-checked")).toBe("false")
    await expect(chips[0].hasAttribute("aria-pressed")).toBe(false)
    // roving tabindex: 選択中だけ 0
    await expect(chips.map((c) => c.tabIndex)).toEqual([0, -1, -1, -1, -1, -1])
  },
}

/**
 * `selectionMode="multiple"`（issue #352）。従来の `multiple`（既定）と同じ
 * トグルボタン意味論で、グループは `role="group"`、チップは `aria-pressed`。
 */
export const SelectionModeMultiple: Story = {
  render: () => {
    const [v, setV] = React.useState<string[]>(["work", "health"])
    return (
      <div className="p-4 space-y-3">
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} selectionMode="multiple" />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">選択: {v.join(", ") || "なし"}</p>
      </div>
    )
  },
}

/**
 * `selectionMode` 未指定（既定）。従来どおり `multiple`（既定 `true`）から導出され、
 * `role="group"` + `aria-pressed` のまま変わらない（非破壊）。
 */
export const SelectionModeUnspecified: Story = {
  tags: ["interaction"],
  render: () => {
    const [v, setV] = React.useState<string[]>(["work"])
    return (
      <div className="p-4">
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="chip-selector"]')!
    await expect(group.getAttribute("role")).toBe("group")
    const chips = [...canvasElement.querySelectorAll<HTMLButtonElement>('button[data-slot="chip"]')]
    await expect(chips.some((c) => c.hasAttribute("role"))).toBe(false)
    await expect(chips.some((c) => c.hasAttribute("aria-checked"))).toBe(false)
    await expect(chips[chips.length - 1].getAttribute("aria-pressed")).toBe("false")
    // roving tabindex は single 専用
    await expect(chips.some((c) => c.hasAttribute("tabindex"))).toBe(false)
  },
}

/**
 * **単一選択のスカラー API**（issue #418）。`value` は `T | null`、`onChange` も
 * スカラーを受け取る。`useState<T[]>` を挟まずそのまま state に繋げられる。
 *
 * `PillToggle` は 1 行固定の segmented control で 2〜4 択専用。支出カテゴリのような
 * **9 択の単一選択は折り返せるこちらを使う**（`flex-wrap` で自動的に複数行になる）。
 */
export const SingleSelectScalar: Story = {
  tags: ["interaction"],
  render: () => {
    const [v, setV] = React.useState<string | null>("food")
    return (
      <div className="p-4 space-y-3" style={{ maxWidth: 360 }}>
        <ChipSelector
          selectionMode="single"
          options={EXPENSE_CATEGORIES}
          value={v}
          onChange={setV}
        />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">選択: {v ?? "なし"}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="chip-selector"]')!
    await expect(group.getAttribute("role")).toBe("radiogroup")
    const chips = () => [
      ...canvasElement.querySelectorAll<HTMLButtonElement>('button[data-slot="chip"]'),
    ]
    await expect(chips().length).toBe(9)

    // 9 択が 1 行に収まらず折り返していること（PillToggle で表現できない理由）
    const rows = new Set(chips().map((c) => Math.round(c.getBoundingClientRect().top)))
    await expect(rows.size).toBeGreaterThan(1)

    // 排他選択: 別のチップを押すと前の選択が外れる
    await expect(chips()[0].getAttribute("aria-checked")).toBe("true")
    await userEvent.click(chips()[3])
    await waitFor(async () => {
      await expect(chips()[3].getAttribute("aria-checked")).toBe("true")
    })
    await expect(chips()[0].getAttribute("aria-checked")).toBe("false")

    // 選択中を再タップすると解除（スカラー API では null が流れる）
    await userEvent.click(chips()[3])
    await waitFor(async () => {
      await expect(canvasElement.textContent).toContain("選択: なし")
    })
    await expect(chips().every((c) => c.getAttribute("aria-checked") === "false")).toBe(true)
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
