/**
 * @file Checkbox のストーリー
 * @description ポリモーフィック Checkbox（label prop で行レイアウトに自動切替）の全パターン。
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {},
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
}

/** label prop を渡すと行レイアウト（`<label>` でラップ・行全体クリッカブル） */
export const WithLabel: Story = {
  render: () => (
    <div className="w-72">
      <Checkbox label="利用規約に同意する" />
    </div>
  ),
}

/** 複数オプション。すべて label prop で行レイアウト統一 */
export const MultipleOptions: Story = {
  render: () => (
    <div className="flex flex-col w-72">
      <Checkbox label="メール通知を受け取る" defaultChecked />
      <Checkbox label="SMS通知を受け取る" />
      <Checkbox label="プッシュ通知を受け取る（準備中）" disabled />
    </div>
  ),
}

/**
 * 行型レイアウトの全機能（label / description / count）。
 */
export const RowLayout: Story = {
  name: "Row Layout (label/description/count)",
  render: () => (
    <div className="flex flex-col w-72 rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-2">
      <Checkbox label="標準" />
      <Checkbox label="サブテキスト付き" description="補足の説明文" />
      <Checkbox label="カウント付き" count={1234} defaultChecked />
      <Checkbox
        label="全部入り"
        description="3 行構成: ラベル + サブ + カウント"
        count={56}
      />
      <Checkbox label="無効" disabled />
    </div>
  ),
}

/**
 * リアル UI 寄りストーリー：求人検索のフィルタサイドバー再現。
 *
 * ポイント:
 * - `fieldset` 自体に `px-3 py-3` の内パディングを持たせる
 * - `legend` は `-ml-1 px-1` で border に少しだけ被せて読みやすく
 * - 各 Checkbox は `containerClassName="-mx-3"` で fieldset の px-3 を打ち消し、
 *   hover 背景を border 端まで伸ばしつつ、チェックボックス本体は legend と
 *   同じ x 位置に揃える。
 */
export const FilterSidebar: Story = {
  name: "Real UI — Filter Sidebar",
  render: () => (
    <fieldset className="w-72 rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-3 py-3">
      <legend className="typo-label-md text-[var(--Text-High-Emphasis)] -ml-1 px-1">
        雇用形態
      </legend>
      <div className="flex flex-col gap-0.5">
        <Checkbox label="正社員" count={1234} defaultChecked containerClassName="-mx-3" />
        <Checkbox label="契約社員" count={456} containerClassName="-mx-3" />
        <Checkbox label="業務委託" count={789} containerClassName="-mx-3" />
        <Checkbox label="アルバイト・パート" count={234} containerClassName="-mx-3" />
        <Checkbox
          label="その他"
          description="インターン / 派遣 等"
          count={56}
          containerClassName="-mx-3"
        />
      </div>
    </fieldset>
  ),
}
