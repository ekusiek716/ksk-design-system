import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ContentCarousel } from "./content-carousel"

const slides = [
  {
    eyebrow: "KSK Design System",
    title: "複数案件の UI を、速く一貫して届ける",
    body: "トークンと再利用可能なパターンで、設計から実装までの判断を揃えます。",
    badge: "Design + Code",
  },
  {
    eyebrow: "Multi-theme",
    title: "ブランドカラーの差し替えだけでテーマを展開",
    body: "Semantic Token を介して、コンポーネント全体へ安全に反映します。",
    badge: "4 themes",
  },
  {
    eyebrow: "Accessible by default",
    title: "キーボードと読み上げを標準装備",
    body: "各スライドへ移動でき、現在の構造を支援技術にも伝えます。",
    badge: "WCAG AA",
  },
].map((item) => (
  <div
    key={item.title}
    className="flex min-h-72 flex-col items-start justify-center gap-4 rounded-xl bg-[var(--Surface-Accent-Primary-Light)] px-6 py-10 md:px-12"
  >
    <Badge variant="subtle">{item.badge}</Badge>
    <div>
      <p className="typo-label-md text-[var(--Text-Accent-Primary)]">
        {item.eyebrow}
      </p>
      <h2 className="mt-2 max-w-2xl typo-display-sm text-[var(--Text-High-Emphasis)]">
        {item.title}
      </h2>
      <p className="mt-3 max-w-xl typo-body-lg text-[var(--Text-Medium-Emphasis)]">
        {item.body}
      </p>
    </div>
    <Button>詳しく見る</Button>
  </div>
))

const meta: Meta<typeof ContentCarousel> = {
  title: "Components/ContentCarousel",
  component: ContentCarousel,
  tags: ["autodocs"],
  args: {
    slides,
  },
}
export default meta

type Story = StoryObj<typeof ContentCarousel>

export const Default: Story = {}

export const AutoPlay: Story = {
  args: { autoPlay: 5000 },
}

export const WithoutControls: Story = {
  args: { showArrows: false, showDots: false },
}
