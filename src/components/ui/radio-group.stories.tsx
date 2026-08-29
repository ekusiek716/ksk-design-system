/**
 * @file RadioGroup のストーリー
 * @description ラジオボタングループコンポーネント。3つの選択肢を表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "./label"

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
}
export default meta

type Story = StoryObj<typeof RadioGroup>

export const ThreeOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <RadioGroupItem value="option-1">メール通知</RadioGroupItem>
      <RadioGroupItem value="option-2">SMS通知</RadioGroupItem>
      <RadioGroupItem value="option-3">通知なし</RadioGroupItem>
    </RadioGroup>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="small">
      <RadioGroupItem value="small">Small</RadioGroupItem>
      <RadioGroupItem value="medium">Medium</RadioGroupItem>
      <RadioGroupItem value="large" disabled>
        Large（選択不可）
      </RadioGroupItem>
    </RadioGroup>
  ),
}

/**
 * `description` を渡すと、ラベルの下に補足テキストを表示する。
 */
export const WithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <RadioGroupItem value="standard" description="3〜5 営業日でお届け">
        通常配送
      </RadioGroupItem>
      <RadioGroupItem value="express" description="翌営業日にお届け（+500円）">
        速達配送
      </RadioGroupItem>
    </RadioGroup>
  ),
}

/**
 * 未チェックの項目にホバーすると枠線がアクセント色に変わる（クリック可能の
 * アフォーダンス）。チェック済み・disabled の項目はホバーしても変化しない。
 * 各項目にカーソルを合わせて確認してください。
 */
export const HoverState: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="h1" />
        <Label htmlFor="h1">選択中（ホバーしても変化なし）</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="h2" />
        <Label htmlFor="h2">未選択（ホバーで枠線がアクセント色に）</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="h3" disabled />
        <Label htmlFor="h3">無効（ホバーしても変化なし）</Label>
      </div>
    </RadioGroup>
  ),
}

/**
 * 当たり判定の回帰テスト（issue #470）。
 *
 * 見た目の円は 20×20px のまま、透明な `::before` 擬似要素で実効 44×44px の
 * タップ領域を内蔵する。素のラジオ（children 無し）とラベル内包の両方で検証する。
 *
 * 消費側で `[role="radio"] { min-height: 44px }` のようなグローバル上書きを
 * 足してはいけない（円が縦長に潰れ、ChipSelector など他の radio 系も壊れる）。
 */
export const HitTarget: Story = {
  tags: ["interaction"],
  render: () => (
    // 上端の判定点がビューポート外に出ないよう余白を確保する
    <div className="p-6">
      <RadioGroup defaultValue="bare-1">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="bare-1" id="hit-bare" />
          <Label htmlFor="hit-bare">素のラジオ（外側 Label）</Label>
        </div>
        <RadioGroupItem value="labeled-1" description="補足テキスト">
          ラベル内包
        </RadioGroupItem>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radios = canvas.getAllByRole("radio")
    await expect(radios).toHaveLength(2)

    for (const radio of radios) {
      // 見た目の円は 20×20px の真円のまま
      const rect = radio.getBoundingClientRect()
      await expect(Math.round(rect.width)).toBe(20)
      await expect(Math.round(rect.height)).toBe(20)
      await expect(
        parseFloat(getComputedStyle(radio).borderRadius)
      ).toBeGreaterThanOrEqual(rect.width / 2)

      // 当たり判定は擬似要素で 44×44px
      const before = getComputedStyle(radio, "::before")
      await expect(before.width).toBe("44px")
      await expect(before.height).toBe("44px")
      await expect(before.content).not.toBe("none")

      // 円の外側 18px 地点でもラジオ本体がヒットする
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const hit = document.elementFromPoint(cx, cy - 18)
      await expect(radio.contains(hit)).toBe(true)
    }
  },
}
