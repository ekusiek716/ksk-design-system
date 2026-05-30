import type { Meta, StoryObj } from "@storybook/react"
import { CategoryScroll } from "./category-scroll"

const meta: Meta<typeof CategoryScroll> = {
  title: "Components/Commerce/CategoryScroll",
  component: CategoryScroll,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}

export default meta
type Story = StoryObj<typeof CategoryScroll>

const PLACEHOLDER_SQ = "https://placehold.co/100x100/f3f4f6/9ca3af?text=🛍"
const PLACEHOLDER_SM = "https://placehold.co/60x60/f3f4f6/9ca3af?text=🛍"

const categories = [
  { name: "トップス", href: "/category/tops", imageUrl: PLACEHOLDER_SQ },
  { name: "アウター", href: "/category/outer", imageUrl: PLACEHOLDER_SQ },
  { name: "ボトムス", href: "/category/bottoms", imageUrl: PLACEHOLDER_SQ },
  { name: "シューズ", href: "/category/shoes", imageUrl: PLACEHOLDER_SQ },
  { name: "バッグ", href: "/category/bags", imageUrl: PLACEHOLDER_SQ },
  { name: "アクセサリー", href: "/category/accessories", imageUrl: PLACEHOLDER_SQ },
  { name: "帽子", href: "/category/hats", imageUrl: PLACEHOLDER_SQ },
]

const circleCategories = categories.map((c) => ({ ...c, imageUrl: PLACEHOLDER_SM }))

export const Default: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <CategoryScroll
        title="カテゴリから探す"
        moreHref="/categories"
        items={categories}
      />
    </div>
  ),
}

export const CircleShape: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <CategoryScroll
        title="シーンから探す"
        items={circleCategories}
        thumbnailSize="sm"
        thumbnailShape="circle"
      />
    </div>
  ),
}

export const GridLayout: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <CategoryScroll
        title="カテゴリから探す"
        moreHref="/categories"
        items={categories}
        layout="grid"
        gridRows={2}
        thumbnailSize="sm"
      />
    </div>
  ),
}
