import type { Meta, StoryObj } from "@storybook/react"
import { CategoryScroll } from "./category-scroll"

const meta = {
  title: "Components/Commerce/CategoryScroll",
  component: CategoryScroll,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CategoryScroll>

export default meta
type Story = StoryObj<typeof meta>

const PLACEHOLDER_SQ = "https://placehold.co/100x100/f3f4f6/9ca3af?text=🎂"
const PLACEHOLDER_SM = "https://placehold.co/60x60/f3f4f6/9ca3af?text=🎂"

const categories = [
  { name: "バースデーケーキ", href: "/category/birthday", imageUrl: PLACEHOLDER_SQ },
  { name: "記念日ケーキ", href: "/category/anniversary", imageUrl: PLACEHOLDER_SQ },
  { name: "ウェディングケーキ", href: "/category/wedding", imageUrl: PLACEHOLDER_SQ },
  { name: "クリスマスケーキ", href: "/category/christmas", imageUrl: PLACEHOLDER_SQ },
  { name: "母の日ケーキ", href: "/category/mothers-day", imageUrl: PLACEHOLDER_SQ },
  { name: "父の日ケーキ", href: "/category/fathers-day", imageUrl: PLACEHOLDER_SQ },
  { name: "卒業・入学", href: "/category/graduation", imageUrl: PLACEHOLDER_SQ },
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
