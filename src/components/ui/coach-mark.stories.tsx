import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { CoachMark } from "./coach-mark"
import { Button } from "./button"

const meta: Meta<typeof CoachMark> = {
  title: "Components/CoachMark",
  component: CoachMark,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CoachMark>

export const Default: Story = {
  render: () => (
    <CoachMark content="送料無料でお届けします" open>
      <Button variant="secondary">送料について</Button>
    </CoachMark>
  ),
}

export const Brand: Story = {
  render: () => (
    <CoachMark content="ここをタップして注文" variant="brand" open>
      <Button>カートに追加</Button>
    </CoachMark>
  ),
}

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-12 p-16">
      {(["top", "bottom", "left", "right"] as const).map((p) => (
        <CoachMark key={p} content={`${p} に表示`} placement={p} open>
          <Button variant="secondary" size="sm">{p}</Button>
        </CoachMark>
      ))}
    </div>
  ),
}

export const Onboarding: Story = {
  render: () => {
    const [step, setStep] = React.useState(1)
    if (step > 3) return (
      <div className="text-[var(--Text-Medium-Emphasis)] typo-body-sm">オンボーディング完了！</div>
    )
    const contents = [
      "プロフィールを設定しましょう",
      "おすすめの商品を確認してみてください",
      "カートに追加してご注文ください",
    ]
    return (
      <CoachMark
        content={contents[step - 1]}
        variant="brand"
        step={step}
        totalSteps={3}
        onNext={() => setStep((s) => s + 1)}
        showClose
        onClose={() => setStep(99)}
        open
      >
        <Button>ステップ {step}</Button>
      </CoachMark>
    )
  },
}

export const Hover: Story = {
  render: () => (
    <div className="flex gap-4">
      <CoachMark content="初回登録で10%OFF！" delayDuration={300}>
        <Button variant="secondary">クーポン</Button>
      </CoachMark>
      <CoachMark content="在庫が残りわずかです" variant="brand" delayDuration={200}>
        <Button>購入する</Button>
      </CoachMark>
    </div>
  ),
}
