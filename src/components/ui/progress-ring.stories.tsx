import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ProgressRing } from "./progress-ring"

const meta: Meta<typeof ProgressRing> = {
  title: "Components/ProgressRing",
  component: ProgressRing,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ProgressRing>

export const Default: Story = { render: () => <ProgressRing value={72} /> }
export const Empty: Story = { render: () => <ProgressRing value={0} /> }
export const Full: Story = { render: () => <ProgressRing value={100} /> }

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressRing value={60} size="sm" />
      <ProgressRing value={60} size="md" />
      <ProgressRing value={60} size="lg" />
      <ProgressRing value={60} size="xl" />
    </div>
  ),
}

export const CustomLabel: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressRing value={3} size="xl" label={<span className="flex flex-col items-center"><span className="typo-label-lg">3</span><span className="typo-label-xs text-[var(--Text-Medium-Emphasis)]">/ 10</span></span>} />
      {/* "✓" は視覚的な記号で、そのまま読み上げても意味が通らないため
          aria-label で正しいアクセシブルネームを明示する。 */}
      <ProgressRing value={100} size="xl" label="✓" aria-label="アップロード完了" />
    </div>
  ),
}

export const Animated: Story = {
  render: () => {
    const [v, setV] = React.useState(0)
    React.useEffect(() => {
      const t = setTimeout(() => setV(75), 300)
      return () => clearTimeout(t)
    }, [])
    return <ProgressRing value={v} size="xl" />
  },
}

export const CustomSizeAndStroke: Story = {
  name: "任意サイズ・ストローク",
  render: () => (
    <div className="flex items-end gap-6">
      {/* 消費側の bespoke リング（88px / ストローク 6.9px）を視覚同一で置換できる */}
      <ProgressRing value={65} size={88} strokeWidth={6.9} />
      <ProgressRing value={65} size={88} />
      <ProgressRing value={65} size={120} strokeWidth={12} />
    </div>
  ),
}

export const CustomColors: Story = {
  name: "配色のカスタマイズ",
  render: () => (
    <div className="flex items-center gap-6">
      {/* Brand-100 相当のトラック + Brand-600 相当の進捗（いずれも semantic トークン） */}
      <ProgressRing value={65} size={88} strokeWidth={6.9} color="var(--Brand-Primary)" trackColor="var(--Brand-Light)" />
      <ProgressRing value={40} size="lg" color="var(--Caution-Base)" trackColor="var(--Surface-Caution)" />
      <ProgressRing value={90} size="lg" color="var(--Success-Base)" trackColor="var(--Surface-Success)" />
      <ProgressRing value={55} size="lg" color="var(--Categorical-3-Bold)" trackColor="var(--Categorical-3-Subtle)" />
    </div>
  ),
}

export const StrokeClamped: Story = {
  name: "過大なストロークの丸め",
  render: () => (
    // 径の半分を超える strokeWidth を渡しても描画が消えず、描ける最大に丸められる
    <ProgressRing value={70} size={64} strokeWidth={60} />
  ),
}
