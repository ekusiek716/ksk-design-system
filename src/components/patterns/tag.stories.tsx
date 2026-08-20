/**
 * @file Tag のストーリー
 * @description 表示専用ラベルコンポーネント。6つのバリアント（default / brand / caution / success / warning / info）を網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Tag } from "./tag"

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "brand", "caution", "success", "warning", "info"],
    },
  },
}
export default meta

type Story = StoryObj<typeof Tag>

export const Default: Story = {
  args: { children: "Default", variant: "default" },
}

export const Brand: Story = {
  args: { children: "Brand", variant: "brand" },
}

export const Caution: Story = {
  args: { children: "Caution", variant: "caution" },
}

export const Success: Story = {
  args: { children: "Success", variant: "success" },
}

export const Warning: Story = {
  args: { children: "Warning", variant: "warning" },
}

export const Info: Story = {
  args: { children: "Info", variant: "info" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="default">Default</Tag>
      <Tag variant="brand">Brand</Tag>
      <Tag variant="caution">Caution</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="info">Info</Tag>
    </div>
  ),
}

/**
 * カテゴリ識別色（`--Categorical-1..16`）。Brand に連動しないテーマ非依存の
 * 質的パレットで、「N 番目のカテゴリ」を色で区別する用途にだけ使う。
 * 文字は必ず `-Bold`（base は明色相だと白背景でコントラスト不足）。
 */
export const Categorical: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const).map((n) => (
        <Tag key={n} categorical={n}>
          カテゴリ {n}
        </Tag>
      ))}
    </div>
  ),
}

/** `dot` で base 色のドットを添える（色だけに頼らない補助）。 */
export const CategoricalWithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag categorical={1} dot>打ち合わせ</Tag>
      <Tag categorical={6} dot>締め切り</Tag>
      <Tag categorical={12} dot>プライベート</Tag>
    </div>
  ),
}
