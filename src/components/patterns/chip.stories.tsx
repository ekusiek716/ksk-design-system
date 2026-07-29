/**
 * @file Chip のストーリー
 * @description フィルター / キーワード用チップコンポーネント。全バリアント、サイズ、選択状態、削除可能を網羅
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Chip } from "./chip"

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "accent", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: "select",
      options: ["pill", "square", "tile"],
    },
    selected: { control: "boolean" },
    removable: { control: "boolean" },
    soldOut: { control: "boolean" },
    href: { control: "text" },
    count: { control: "number" },
  },
}
export default meta

type Story = StoryObj<typeof Chip>

const TOUCH_FILTERS = ["すべて", "未完了", "今日", "重要"]

export const Filled: Story = {
  args: { children: "Filled", variant: "filled" },
}

export const Accent: Story = {
  args: { children: "Accent", variant: "accent" },
}

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="filled">Filled</Chip>
      <Chip variant="accent">Accent</Chip>
      <Chip variant="outline">Outline</Chip>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
}

export const Selected: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip selected>選択済み</Chip>
      <Chip>未選択</Chip>
      <Chip>未選択</Chip>
    </div>
  ),
}

export const Removable: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip removable onRemove={() => alert("削除: React")}>React</Chip>
      <Chip removable onRemove={() => alert("削除: TypeScript")}>TypeScript</Chip>
      <Chip removable onRemove={() => alert("削除: Tailwind")}>Tailwind</Chip>
    </div>
  ),
}

export const SquareShape: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip shape="square" variant="filled">Filled</Chip>
      <Chip shape="square" variant="accent">Accent</Chip>
      <Chip shape="square" variant="outline">Outline</Chip>
    </div>
  ),
}

/** カウントバッジ：選択時は brand 反転、非選択は淡色 */
export const WithCount: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip selected count={156}>すべて</Chip>
      <Chip count={89}>新着</Chip>
      <Chip count={42}>進行中</Chip>
      <Chip count={12}>完了</Chip>
    </div>
  ),
}

/** タイル型サイズ + 売り切れ表示（斜線オーバーレイ） */
export const TileAndSoldOut: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip shape="square" size="tile" selected>S</Chip>
      <Chip shape="square" size="tile">M</Chip>
      <Chip shape="square" size="tile" soldOut>L</Chip>
      <Chip shape="square" size="tile" soldOut>XL</Chip>
    </div>
  ),
}

/** href を渡すと `<a>` でレンダリング（リンク化 Chip） */
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip href="#react">React</Chip>
      <Chip href="#typescript">TypeScript</Chip>
      <Chip href="#tailwind">Tailwind</Chip>
    </div>
  ),
}

/**
 * リアル UI 寄りストーリー：絞り込みフィルタ + ステータスタブ + サイズ選択。
 * 上段: 削除可能タグ。中段: ステータス別件数。下段: サイズ選択（売り切れ含む）。
 */
export const RealWorldFilters: Story = {
  name: "Real UI — Filters & Status",
  render: () => {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <div>
          <div className="typo-label-sm text-[var(--Text-Medium-Emphasis)] mb-2">
            選択中の絞り込み
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip removable onRemove={() => {}}>正社員</Chip>
            <Chip removable onRemove={() => {}}>東京都</Chip>
            <Chip removable onRemove={() => {}}>年収 600 万円〜</Chip>
            <Chip removable onRemove={() => {}}>リモート可</Chip>
          </div>
        </div>
        <div>
          <div className="typo-label-sm text-[var(--Text-Medium-Emphasis)] mb-2">
            ステータス
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip selected count={156}>すべて</Chip>
            <Chip count={89}>新着</Chip>
            <Chip count={42}>進行中</Chip>
            <Chip count={12}>完了</Chip>
          </div>
        </div>
        <div>
          <div className="typo-label-sm text-[var(--Text-Medium-Emphasis)] mb-2">
            サイズ
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip shape="square" size="tile" selected>S</Chip>
            <Chip shape="square" size="tile">M</Chip>
            <Chip shape="square" size="tile" soldOut>L</Chip>
            <Chip shape="square" size="tile" soldOut>XL</Chip>
          </div>
        </div>
      </div>
    )
  },
}

export const TouchSelectionStable: Story = {
  name: "Touch selection stable",
  render: () => {
    const [selected, setSelected] = React.useState("すべて")

    return (
      <div className="flex flex-wrap gap-2">
        {TOUCH_FILTERS.map((filter) => (
          <Chip
            key={filter}
            selected={selected === filter}
            onClick={() => setSelected(filter)}
          >
            {filter}
          </Chip>
        ))}
      </div>
    )
  },
}

/**
 * tile サイズが flex row 内で潰れないことの回帰テスト。
 *
 * 由来: `size-12` は width を指定するが flex item の既定 `flex-shrink: 1` +
 * `min-width: auto` により min-content 幅（9〜19px）まで潰れ、48px の
 * タッチターゲットが崩れていた（shrink-0 で修正）。
 */
export const TileTouchTargetNotShrunk: Story = {
  tags: ["interaction", "!autodocs"],
  // w-40(160px) < tile4枚+gap(216px): shrink-0 が無いと必ず潰れる幅にして回帰を検出する
  render: () => (
    <div className="flex w-40 gap-2">
      <Chip data-testid="tile-s" shape="square" size="tile" selected>S</Chip>
      <Chip data-testid="tile-m" shape="square" size="tile">M</Chip>
      <Chip data-testid="tile-l" shape="square" size="tile" soldOut>L</Chip>
      <Chip data-testid="tile-xl" shape="square" size="tile" soldOut>XL</Chip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const id of ["tile-s", "tile-m", "tile-l", "tile-xl"]) {
      const chip = canvas.getByTestId(id)
      const rect = chip.getBoundingClientRect()
      await expect(
        rect.width,
        `${id}: flex row 内で幅が潰れている（${rect.width}px）`
      ).toBeGreaterThanOrEqual(44)
      await expect(
        rect.height,
        `${id}: 高さがタッチターゲット未満（${rect.height}px）`
      ).toBeGreaterThanOrEqual(44)
    }
  },
}
