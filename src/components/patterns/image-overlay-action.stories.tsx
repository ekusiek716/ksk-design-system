/**
 * @file ImageOverlayAction のストーリー
 * @description 画像に重ねるアクションボタン。44px のタップ領域と視認できる面を常に持つ。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { ArrowLeft2, ArrowRight2, Heart } from "iconsax-reactjs"
import { ImageOverlayAction } from "./image-overlay-action"

const meta: Meta<typeof ImageOverlayAction> = {
  title: "Patterns/ImageOverlayAction",
  component: ImageOverlayAction,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof ImageOverlayAction>

const PHOTO =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=640&q=60"

function Photo({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-64 overflow-hidden rounded-[var(--Radius-Surface)]">
      <img src={PHOTO} alt="" className="aspect-square w-full object-cover" />
      {children}
    </div>
  )
}

/** お気に入りトグル（surface トーン・右上）。 */
export const FavoriteToggle: Story = {
  render: () => {
    const [fav, setFav] = React.useState(false)
    return (
      <Photo>
        <ImageOverlayAction
          placement="top-right"
          pressed={fav}
          aria-label={fav ? "お気に入りから削除" : "お気に入りに追加"}
          icon={
            <Heart
              size={20}
              variant={fav ? "Bold" : "Linear"}
              color={fav ? "var(--Caution-Base)" : "currentColor"}
            />
          }
          onClick={() => setFav((v) => !v)}
        />
      </Photo>
    )
  },
}

/** カルーセル矢印（scrim トーン・左右中央）。 */
export const CarouselArrows: Story = {
  render: () => (
    <Photo>
      <ImageOverlayAction
        placement="center-left"
        tone="scrim"
        aria-label="前の写真"
        icon={<ArrowLeft2 size={20} />}
      />
      <ImageOverlayAction
        placement="center-right"
        tone="scrim"
        aria-label="次の写真"
        icon={<ArrowRight2 size={20} />}
      />
    </Photo>
  ),
}

/** サイズ違い。見た目の円は縮むが、タップ領域は常に 44px。 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ImageOverlayAction placement="none" size="sm" aria-label="小" icon={<Heart size={16} />} />
      <ImageOverlayAction placement="none" size="md" aria-label="中" icon={<Heart size={20} />} />
      <ImageOverlayAction
        placement="none"
        size="md"
        tone="scrim"
        aria-label="無効"
        disabled
        icon={<Heart size={20} />}
      />
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/** タップ領域 44px・aria-pressed の切替・親リンクへ伝播しないことを固定する。 */
export const KeepsHitAreaAndStopsPropagation: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const [fav, setFav] = React.useState(false)
    const [cardClicks, setCardClicks] = React.useState(0)
    return (
      <div className="relative w-64" onClick={() => setCardClicks((c) => c + 1)}>
        <div className="aspect-square w-full bg-[var(--Surface-Secondary)]" />
        <ImageOverlayAction
          placement="top-right"
          size="sm"
          pressed={fav}
          aria-label="お気に入り"
          icon={<Heart size={16} />}
          onClick={() => setFav((v) => !v)}
        />
        <p data-testid="card-clicks">{cardClicks}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: "お気に入り" })

    // 見た目 sm でもヒットエリアは 44px（min 44pt 要件）
    const rect = button.getBoundingClientRect()
    await expect(rect.width).toBeGreaterThanOrEqual(44)
    await expect(rect.height).toBeGreaterThanOrEqual(44)

    await expect(button).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(button)
    await expect(button).toHaveAttribute("aria-pressed", "true")

    // 親（カード全体クリック）へ伝播しない
    await expect(canvas.getByTestId("card-clicks")).toHaveTextContent("0")
  },
}
