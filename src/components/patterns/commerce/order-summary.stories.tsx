import type { Meta, StoryObj } from "@storybook/react"
import { OrderSummary } from "./order-summary"

const meta: Meta<typeof OrderSummary> = { title: "Components/Commerce/OrderSummary", component: OrderSummary }
export default meta
type Story = StoryObj<typeof OrderSummary>

export const Default: Story = {
  render: () => (
    <OrderSummary
      lineItems={[
        { label: "商品合計（3点）", value: "¥11,940" },
        { label: "送料", value: "¥880" },
        { label: "クーポン割引", value: "-¥500" },
      ]}
      totalValue="¥12,320"
      ctaLabel="注文を確定する"
    />
  ),
}

export const Simple: Story = {
  render: () => <OrderSummary totalValue="¥3,980" ctaLabel="カートに進む" />,
}

/**
 * 画面下に固定する例（issue #832）。fixed のときは中身の下余白が
 * `max(0.75rem, env(safe-area-inset-bottom))` になり、注文ボタンがホームインジケータより上に出る
 * （StickyActionBar と同じ）。`env(safe-area-inset-bottom)` は Storybook では 0 なので、ここでの
 * 下余白は 0.75rem。safe-area の効き方は `viewport-fit=cover` の iOS Safari / Capacitor で確認する。
 * 親の `transform` は、fixed をこの枠の中に閉じ込めるためだけのもの。
 */
export const FixedSafeArea: Story = {
  render: () => (
    <div className="relative h-[320px] bg-[var(--Surface-Secondary)]" style={{ transform: "translateZ(0)" }}>
      <OrderSummary
        fixed
        lineItems={[
          { label: "商品合計（1点）", value: "¥3,980" },
          { label: "送料", value: "無料" },
        ]}
        totalValue="¥3,980"
        ctaLabel="注文を確定する"
      />
    </div>
  ),
}
