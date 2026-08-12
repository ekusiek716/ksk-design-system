import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Add, Heart, NoteText, Star1 } from "iconsax-reactjs"
import { IconBadge } from "@/components/ui/icon-badge"
import { ActionTile, QuickActionGrid } from "./quick-action-grid"

const meta: Meta<typeof QuickActionGrid> = {
  title: "Components/QuickActionGrid",
  component: QuickActionGrid,
}
export default meta

type Story = StoryObj<typeof QuickActionGrid>

export const EmojiOnly: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={4} gap="sm">
      <ActionTile emoji="😀" label="元気" selected />
      <ActionTile emoji="😌" label="普通" />
      <ActionTile emoji="😵" label="疲れ" />
      <ActionTile emoji="😭" label="つらい" />
    </QuickActionGrid>
  ),
}

export const IconAndLabel: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={3}>
      <ActionTile icon={<Add size={20} />} label="記録" description="今日のログ" variant="info" />
      <ActionTile icon={<Heart size={20} />} label="体調" description="気分を残す" variant="success" />
      <ActionTile icon={<NoteText size={20} />} label="メモ" description="あとで確認" />
    </QuickActionGrid>
  ),
}

export const WithMeta: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={2}>
      <ActionTile label="キック" description="胎動カウント" meta="12" selected />
      <ActionTile label="水分" description="今日の目標" meta="80%" />
      <ActionTile label="薬" description="服薬チェック" meta="未" variant="caution" />
      <ActionTile label="同期" description="クラウド保存" loading />
    </QuickActionGrid>
  ),
}

/**
 * issue #309: 選択状態は既定でラベル行右端にチェックを表示する（色だけで伝えない）。
 * `indicator` を渡すと表示を差し替えられ、`loading` は `indicator` / 既定チェックより優先される。
 */
export const IndicatorOverride: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={2}>
      <ActionTile label="デフォルト選択" description="既定のチェックが出る" selected />
      <ActionTile label="未選択" description="インジケータなし" />
      <ActionTile
        label="カスタム表示"
        description="indicator で差し替え"
        selected
        indicator={
          <IconBadge appearance="plain" className="size-5 text-[var(--Brand-Primary)]">
            <Star1 size={16} variant="Bold" />
          </IconBadge>
        }
      />
      <ActionTile
        label="読み込み中優先"
        description="loading は indicator より優先"
        selected
        loading
        indicator={<span className="typo-label-md text-[var(--Text-High-Emphasis)]">差し替え表示</span>}
      />
      {/* 契約: null / false は「指定なし」として既定チェックへフォールバックする（消す口ではない） */}
      <ActionTile label="null は既定へ" description="indicator={null}" selected indicator={null} />
      <ActionTile
        label="false も既定へ"
        description="indicator={cond && <X/>} の false"
        selected
        indicator={false}
      />
      {/* native では文字列・数値を Text にラップする。web も同じ typo になることを確認する */}
      <ActionTile label="文字列 indicator" description='indicator="✓"' selected indicator="✓" />
      <ActionTile label="数値 indicator" description="indicator={3}" selected indicator={3} />
    </QuickActionGrid>
  ),
}

/**
 * issue #309 の再現条件: description を渡さない 1 行タイルでも既定チェックがラベル行右端に出ること、
 * meta と selected の同時指定で下段 meta と上段チェックが共存すること、
 * variant="selected" のみ（selected prop 無し）でもチェックと選択の読み上げが付くこと。
 */
export const SelectedWithoutDescription: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={2}>
      <ActionTile label="ラベルのみ" selected />
      <ActionTile label="meta と併用" meta="要確認" selected />
      <ActionTile label="variant のみ" variant="selected" />
    </QuickActionGrid>
  ),
}

/** issue #293: 狭いタイルで長い meta と 2 行 description を併用しても description が潰れない */
export const NarrowWithLongMeta: Story = {
  render: () => (
    <QuickActionGrid className="max-w-sm" columns={2}>
      <ActionTile
        label="丸テーブル"
        description="親族・友人をバランスよく配置できる定番レイアウト"
        meta="登録ゲスト数におすすめ"
        selected
      />
      <ActionTile
        label="長テーブル"
        description="カジュアルな少人数パーティー向け"
        meta="〜30名"
      />
    </QuickActionGrid>
  ),
}

const PURPOSES = [
  { value: "career", label: "転職のため" },
  { value: "skill", label: "スキル証明" },
  { value: "hobby", label: "趣味・教養" },
  { value: "school", label: "進学のため" },
]

function SingleSelectionDemo() {
  const [value, setValue] = React.useState("skill")
  return (
    <QuickActionGrid
      className="max-w-md"
      columns={2}
      selectionMode="single"
      aria-label="なんのために合格したい？"
    >
      {PURPOSES.map((p) => (
        <ActionTile
          key={p.value}
          label={p.label}
          selected={value === p.value}
          onClick={() => setValue(p.value)}
        />
      ))}
    </QuickActionGrid>
  )
}

/**
 * issue #318: 単一選択（アンケートの単一回答など）。grid が `role="radiogroup"`、
 * タイルが `role="radio"` + `aria-checked` になり、roving tabindex と矢印キー移動が有効になる。
 */
export const SingleSelection: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => <SingleSelectionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole("radiogroup")
    const radios = canvas.getAllByRole("radio")

    // 初期状態: 選択中のタイルだけが aria-checked=true かつ tabIndex=0（roving tabindex）
    await expect(group).toBeInTheDocument()
    await expect(radios[1]).toHaveAttribute("aria-checked", "true")
    await expect(radios[0]).toHaveAttribute("aria-checked", "false")
    await expect(radios[1]).toHaveAttribute("tabindex", "0")
    await expect(radios[0]).toHaveAttribute("tabindex", "-1")

    // 右矢印で次のタイルへ移動し、移動先が選択される
    radios[1].focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(radios[2]).toHaveFocus()
    await expect(radios[2]).toHaveAttribute("aria-checked", "true")
    await expect(radios[1]).toHaveAttribute("aria-checked", "false")

    // 下矢印も「次へ」（2 軸レイアウトのため上下左右すべてを受ける）
    await userEvent.keyboard("{ArrowDown}")
    await expect(radios[3]).toHaveAttribute("aria-checked", "true")

    // 端では折り返す（WAI-ARIA APG の radio group パターン）
    await userEvent.keyboard("{ArrowRight}")
    await expect(radios[0]).toHaveFocus()
    await expect(radios[0]).toHaveAttribute("aria-checked", "true")

    // 左矢印で戻る
    await userEvent.keyboard("{ArrowLeft}")
    await expect(radios[3]).toHaveAttribute("aria-checked", "true")
    await expect(radios[3]).toHaveAttribute("tabindex", "0")
    await expect(radios[0]).toHaveAttribute("tabindex", "-1")
  },
}

/**
 * issue #318: 複数選択。タイルは従来どおり `aria-pressed`（トグルボタン）で、
 * 「複数選択であること」を API 上で明示した状態。
 */
export const MultipleSelection: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={2} selectionMode="multiple">
      <ActionTile label="通知" description="複数選べる" selected />
      <ActionTile label="同期" description="複数選べる" selected />
      <ActionTile label="バックアップ" description="複数選べる" />
    </QuickActionGrid>
  ),
}

/**
 * issue #318: `selectionMode` 未指定（既定）はクイックアクションの起動ボタン。
 * grid は role を持たず、タイルは `aria-pressed` のみ（従来と同じ出力）。
 */
export const LaunchersWithoutSelectionMode: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={3}>
      <ActionTile icon={<Add size={20} />} label="記録する" />
      <ActionTile icon={<Heart size={20} />} label="体調を残す" />
      <ActionTile icon={<NoteText size={20} />} label="メモを書く" />
    </QuickActionGrid>
  ),
}
