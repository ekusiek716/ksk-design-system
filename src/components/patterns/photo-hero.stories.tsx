import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/ui/button"
import { PhotoHero } from "./photo-hero"

const meta = {
  title: "Components/PhotoHero",
  component: PhotoHero,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PhotoHero>

export default meta
type Story = StoryObj

const PHOTO_SRC = "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1600&q=80"

export const BottomAligned: Story = {
  render: () => (
    <PhotoHero src={PHOTO_SRC} overlay="dark" align="bottom">
      <PhotoHero.Eyebrow>Plan together</PhotoHero.Eyebrow>
      <PhotoHero.Title>大切な準備を、ふたりで同じ画面から</PhotoHero.Title>
      <PhotoHero.Body>
        予定、メモ、決めたことをひとつずつ残して、当日までの流れを見渡せます。
      </PhotoHero.Body>
      <PhotoHero.Actions>
        <Button variant="glass-inverse" size="xl" className="w-full">はじめる</Button>
        <Button variant="ghost-inverse" size="xl" className="w-full">あとで見る</Button>
      </PhotoHero.Actions>
    </PhotoHero>
  ),
}

export const CenterAligned: Story = {
  render: () => (
    <PhotoHero src={PHOTO_SRC} overlay="medium" align="center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <PhotoHero.Eyebrow>Milestone</PhotoHero.Eyebrow>
        <PhotoHero.Title>今日の一歩を記録する</PhotoHero.Title>
        <PhotoHero.Body>小さな区切りも残しておくと、あとから準備の進み具合がわかります。</PhotoHero.Body>
        <PhotoHero.Actions className="w-full">
          <Button variant="glass-inverse" size="xl" className="w-full">記録する</Button>
        </PhotoHero.Actions>
      </div>
    </PhotoHero>
  ),
}

export const NoOverlay: Story = {
  render: () => (
    <PhotoHero src={PHOTO_SRC} overlay="none" align="bottom">
      <PhotoHero.Eyebrow>Bright image</PhotoHero.Eyebrow>
      <PhotoHero.Title>画像側で十分な暗さを持つ場合</PhotoHero.Title>
      <PhotoHero.Body>夜景や暗めの写真には、余白を活かして短いメッセージを重ねられます。</PhotoHero.Body>
    </PhotoHero>
  ),
}
