import type { Meta, StoryObj } from "@storybook/react"
import { ProductCarousel } from "./product-carousel"

const meta: Meta<typeof ProductCarousel> = {
  title: "Components/Commerce/ProductCarousel",
  component: ProductCarousel,
}
export default meta
type Story = StoryObj<typeof ProductCarousel>

const products = Array.from({ length: 8 }, (_, i) => ({
  name: `サンプル商品 ${i + 1}`,
  imageUrl: `https://picsum.photos/seed/carousel${i}/400/400`,
  price: 2000 + i * 500,
  rating: 4.0 + i * 0.1,
  reviewCount: 100 + i * 30,
  shopName: "ショップ名",
  href: "#",
}))

export const Default: Story = {
  render: () => <ProductCarousel title="おすすめ商品" products={products} moreHref="#" />,
}

export const WithRanking: Story = {
  render: () => <ProductCarousel title="人気ランキング" subtitle="今週の売れ筋" products={products} showRanking cardSize="md" moreHref="#" />,
}

export const WithCartButton: Story = {
  render: () => <ProductCarousel title="最近チェックした商品" products={products} showCartButton cardSize="md" />,
}

export const LargeCards: Story = {
  render: () => <ProductCarousel title="新着商品" products={products.slice(0, 5)} cardSize="lg" moreHref="#" />,
}
