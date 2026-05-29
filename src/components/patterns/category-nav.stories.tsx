import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { CategoryNav } from "./category-nav"

const meta: Meta<typeof CategoryNav> = {
  title: "Components/Commerce/CategoryNav",
  component: CategoryNav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}

export default meta
type Story = StoryObj<typeof CategoryNav>

const PLACEHOLDER = "https://placehold.co/40x40/f3f4f6/9ca3af?text=🎂"

const sampleItems = [
  { name: "バースデー", imageUrl: PLACEHOLDER },
  { name: "記念日", imageUrl: PLACEHOLDER },
  { name: "母の日", imageUrl: PLACEHOLDER },
  { name: "父の日", imageUrl: PLACEHOLDER },
  { name: "ウェディング", imageUrl: PLACEHOLDER },
  { name: "卒業・入学", imageUrl: PLACEHOLDER },
  { name: "クリスマス", imageUrl: PLACEHOLDER },
  { name: "その他", imageUrl: PLACEHOLDER },
]

export const Default: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <CategoryNav items={sampleItems} />
    </div>
  ),
}

export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState(0)
    return (
      <div className="bg-[var(--Surface-Primary)]">
        <CategoryNav
          items={sampleItems.map((item, i) => ({
            ...item,
            isSelected: i === selected,
            onClick: () => setSelected(i),
          }))}
        />
      </div>
    )
  },
}
