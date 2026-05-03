import type { Meta, StoryObj } from "@storybook/react"
import { BannerCarousel } from "./banner-carousel"

const meta: Meta<typeof BannerCarousel> = {
  title: "Components/BannerCarousel",
  component: BannerCarousel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof BannerCarousel>

const SAMPLE_ITEMS = [
  { caption: "春の早割キャンペーン", subCaption: "最大30% OFF" },
  { caption: "新郎新婦様へ", subCaption: "特別プラン公開中" },
  { caption: "GW限定セール", subCaption: "5/3〜5/6開催" },
  { caption: "記念日ケーキ特集", subCaption: "全品送料無料" },
]

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <BannerCarousel
        title="今週のキャンペーン"
        items={SAMPLE_ITEMS}
        onMore={() => alert("もっと見る")}
      />
    </div>
  ),
}

export const NoHeader: Story = {
  render: () => (
    <div className="w-80">
      <BannerCarousel items={SAMPLE_ITEMS} />
    </div>
  ),
}

export const Tall: Story = {
  render: () => (
    <div className="w-80">
      <BannerCarousel
        title="特集"
        items={SAMPLE_ITEMS.slice(0, 3)}
        itemAspectRatio="3/2"
        itemWidth={160}
      />
    </div>
  ),
}
