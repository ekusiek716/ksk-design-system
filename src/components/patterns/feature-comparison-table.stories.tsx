/**
 * @file FeatureComparisonTable のストーリー
 * @description プランの機能比較表（issue #687）。✓ / — に読み上げ文言を持つ
 */
import type { Meta, StoryObj } from "@storybook/react"
import { FeatureComparisonTable } from "./feature-comparison-table"

const meta: Meta<typeof FeatureComparisonTable> = {
  title: "Components/FeatureComparisonTable",
  component: FeatureComparisonTable,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-full max-w-sm"><Story /></div>],
  args: {
    caption: "Free と Plus の機能比較",
    columns: [
      { key: "free", label: "Free" },
      { key: "plus", label: "Plus", highlight: true },
    ],
    rows: [
      { label: "やることリスト", values: { free: true, plus: true } },
      { label: "テンプレート", values: { free: "80 件", plus: "153 件" } },
      { label: "パートナーと共有", values: { free: false, plus: true } },
      { label: "広告なし", values: { free: false, plus: true } },
    ],
  },
}
export default meta
type Story = StoryObj<typeof FeatureComparisonTable>

export const Default: Story = {}

export const ThreeColumns: Story = {
  args: {
    columns: [
      { key: "free", label: "Free" },
      { key: "plus", label: "Plus", highlight: true },
      { key: "pro", label: "Pro" },
    ],
    rows: [
      { label: "プロジェクト数", values: { free: "1", plus: "10", pro: "無制限" } },
      { label: "書き出し", values: { free: false, plus: true, pro: true } },
    ],
  },
}
