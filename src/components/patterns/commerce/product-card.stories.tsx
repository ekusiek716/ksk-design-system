import type { Meta, StoryObj } from "@storybook/react"
import { ProductCard } from "./product-card"

const meta: Meta<typeof ProductCard> = {
  title: "Commerce/ProductCard",
  component: ProductCard,
}
export default meta
type Story = StoryObj<typeof ProductCard>

const sampleProduct = {
  name: "有機抹茶ロールケーキ",
  imageUrl: "https://picsum.photos/seed/prod1/400/400",
  price: 3980,
  rating: 4.67,
  reviewCount: 345,
  shopName: "サンプルショップ",
  deliveryLabel: "最短 4/10",
}

export const Vertical: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <ProductCard {...sampleProduct} href="#" onFavoriteToggle={() => {}} />
    </div>
  ),
}

export const VerticalWithDiscount: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <ProductCard {...sampleProduct} originalPrice={4980} tags={[{ label: "送料無料", variant: "success" }]} href="#" onFavoriteToggle={() => {}} />
    </div>
  ),
}

export const VerticalWithCart: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <ProductCard {...sampleProduct} showCartButton onCartAdd={() => {}} href="#" onFavoriteToggle={() => {}} />
    </div>
  ),
}

export const VerticalWithRanking: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <ProductCard {...sampleProduct} ranking={1} href="#" />
    </div>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ProductCard {...sampleProduct} orientation="horizontal" href="#" onFavoriteToggle={() => {}} />
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
      {[1,2,3,4].map(i => (
        <ProductCard key={i} name={`商品名 ${i}`} imageUrl={`https://picsum.photos/seed/p${i}/400/400`} price={1980 + i * 500} rating={4 + i * 0.1} reviewCount={i * 50} shopName="ショップ名" href="#" onFavoriteToggle={() => {}} />
      ))}
    </div>
  ),
}
