import type { Meta, StoryObj } from "@storybook/react"
import { OrderSummary } from "./order-summary"

const meta: Meta<typeof OrderSummary> = { title: "Commerce/OrderSummary", component: OrderSummary }
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
