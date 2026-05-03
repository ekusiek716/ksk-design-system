import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ReviewCard } from "./review-card"
import { ReviewSummary } from "./review-summary"

const meta: Meta<typeof ReviewCard> = {
  title: "Components/Commerce/ReviewCard",
  component: ReviewCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ReviewCard>

export const Default: Story = {
  args: {
    reviewer: "みかん様",
    rating: 5,
    title: "見た目も味も最高でした！",
    body: "結婚式で使いました。デザイン通りのケーキが届いて感動しました。味もとても美味しく、ゲストにも大好評でした。",
    date: "2025年3月7日",
    helpfulCount: 12,
  },
  render: (args) => {
    const [helpful, setHelpful] = React.useState(false)
    const [count, setCount] = React.useState(args.helpfulCount ?? 0)
    return (
      <div className="w-72">
        <ReviewCard
          {...args}
          helpful={helpful}
          helpfulCount={count}
          onHelpful={() => {
            setHelpful((h) => !h)
            setCount((c) => helpful ? c - 1 : c + 1)
          }}
        />
      </div>
    )
  },
}

export const LowRating: Story = {
  args: {
    reviewer: "購入者",
    rating: 2,
    title: "少し残念でした",
    body: "デザインは良かったのですが、届いた時に少し崩れていました。",
    date: "2025年1月20日",
    helpfulCount: 3,
  },
  render: (args) => <div className="w-72"><ReviewCard {...args} onHelpful={() => {}} /></div>,
}

export const WithSummary: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <ReviewSummary
        averageRating={4.7}
        totalCount={2341}
        distribution={[1590, 422, 164, 47, 70]}
      />
      <ReviewCard
        reviewer="みかん様"
        rating={5}
        title="見た目も味も最高でした！"
        body="結婚式で使いました。デザイン通りのケーキが届いて感動しました。"
        date="2025年3月7日"
        helpfulCount={12}
        onHelpful={() => {}}
      />
      <ReviewCard
        reviewer="さくら様"
        rating={4}
        body="味は最高でした。次回もリピートします。"
        date="2025年2月14日"
        helpfulCount={5}
        onHelpful={() => {}}
      />
    </div>
  ),
}
