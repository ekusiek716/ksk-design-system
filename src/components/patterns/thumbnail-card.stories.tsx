/**
 * @file ThumbnailCard のストーリー
 * @description サムネ + テキストで、カード全体が 1 つのリンク / ボタンになるカード。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Heart } from "iconsax-reactjs"
import { ThumbnailCard } from "./thumbnail-card"
import { ImageOverlayAction } from "./image-overlay-action"

const meta: Meta<typeof ThumbnailCard> = {
  title: "Patterns/ThumbnailCard",
  component: ThumbnailCard,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof ThumbnailCard>

const PHOTO =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=640&q=60"

/** 縦型（既定）。横スクロールのレコメンドストリップ向け。 */
export const Vertical: Story = {
  args: {
    href: "#detail",
    imageUrl: PHOTO,
    eyebrow: "おすすめ",
    title: "駅徒歩5分・陽当たり良好のワンルーム",
    description: "内見予約なしで見学できます",
    meta: "渋谷区 / 8.2万円",
  },
  render: (args) => (
    <div className="w-44">
      <ThumbnailCard {...args} />
    </div>
  ),
}

/** 横型。縦積みリスト向け。 */
export const Horizontal: Story = {
  args: {
    href: "#detail",
    imageUrl: PHOTO,
    orientation: "horizontal",
    title: "駅徒歩5分・陽当たり良好のワンルーム",
    description: "内見予約なしで見学できます",
    meta: "渋谷区 / 8.2万円",
  },
  render: (args) => (
    <div className="w-80">
      <ThumbnailCard {...args} />
    </div>
  ),
}

/** カード全体クリック + サムネ上の副アクション（ImageOverlayAction）。 */
export const WithSecondaryAction: Story = {
  render: () => {
    const [fav, setFav] = React.useState(false)
    return (
      <div className="w-44">
        <ThumbnailCard
          href="#detail"
          imageUrl={PHOTO}
          title="駅徒歩5分・陽当たり良好のワンルーム"
          meta="渋谷区 / 8.2万円"
          secondaryAction={
            <ImageOverlayAction
              placement="top-right"
              size="sm"
              pressed={fav}
              aria-label={fav ? "お気に入りから削除" : "お気に入りに追加"}
              icon={<Heart size={16} variant={fav ? "Bold" : "Linear"} />}
              onClick={() => setFav((v) => !v)}
            />
          }
        />
      </div>
    )
  },
}

/** 横スクロールのストリップとして並べる。 */
export const Strip: Story = {
  render: () => (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {["A棟", "B棟", "C棟"].map((name) => (
        <div key={name} className="w-40 shrink-0">
          <ThumbnailCard
            href="#detail"
            imageUrl={PHOTO}
            title={`${name} 1K / 25㎡`}
            meta="8.2万円"
          />
        </div>
      ))}
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/** カード全体が 1 つの操作子で、副アクションはそれに吸われない。 */
export const WholeCardClickableWithSecondaryAction: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const [opened, setOpened] = React.useState(0)
    const [fav, setFav] = React.useState(false)
    return (
      <div className="w-44">
        <ThumbnailCard
          onClick={() => setOpened((c) => c + 1)}
          imageUrl={PHOTO}
          title="物件カード"
          meta={<span data-testid="opened">{opened}</span>}
          secondaryAction={
            <ImageOverlayAction
              placement="top-right"
              size="sm"
              pressed={fav}
              aria-label="お気に入り"
              icon={<Heart size={16} />}
              onClick={() => setFav((v) => !v)}
            />
          }
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const favorite = canvas.getByRole("button", { name: "お気に入り" })
    await userEvent.click(favorite)
    await expect(favorite).toHaveAttribute("aria-pressed", "true")
    // 副アクションでカードは開かない
    await expect(canvas.getByTestId("opened")).toHaveTextContent("0")

    const card = canvas.getByRole("button", { name: "物件カード" })
    await userEvent.click(card)
    await expect(canvas.getByTestId("opened")).toHaveTextContent("1")
  },
}
