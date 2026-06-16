// 焙煎コーヒー豆 EC の商品詳細ページ。
// SP=1列+下部固定バー / PC=2列・画像左（@container でホスト枠に追従）。
import { useState } from "react"
import { ArrowLeft2, ExportCurve, Heart, Coffee, Location } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/patterns/commerce/price-display"
import { RatingDisplay } from "@/components/patterns/commerce/rating-display"
import { QuantitySelector } from "@/components/patterns/commerce/quantity-selector"
import { ReviewCard } from "@/components/patterns/commerce/review-card"
import { ChipSelector } from "@/components/patterns/chip-selector"
import { Tag } from "@/components/patterns/tag"

export const meta = {
  title: "商品詳細：焙煎コーヒー豆",
  device: "SP/PC" as const,
  createdAt: "2026/06/16",
  description: "EC 商品詳細。画像ギャラリー / 会員価格 / 内容量 / 数量 / レビュー。SP1列・PC2列レスポンシブ。",
}

const images = [
  { src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=780&q=80", alt: "焙煎したコーヒー豆のパッケージ正面" },
  { src: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=780&q=80", alt: "ドリップ中のコーヒー" },
  { src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=780&q=80", alt: "コーヒー豆のクローズアップ" },
  { src: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=780&q=80", alt: "淹れたてのコーヒーカップ" },
  { src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=780&q=80", alt: "テーブルに置かれたコーヒーと豆" },
]

const sizeOptions = {
  "200g": { price: 1180, member: 1000 },
  "500g": { price: 2680, member: 2280 },
  "1kg": { price: 4980, member: 4230 },
} as const
type SizeKey = keyof typeof sizeOptions

const reviews = [
  { reviewer: "珈琲好きの田中", avatarChar: "田", rating: 5, title: "毎朝これじゃないと始まらない", body: "酸味は控えめでコクがしっかり。深煎りなのに後味がすっきりしていて、ミルクとの相性も抜群です。リピート3回目。", date: "2026/06/01", helpfulCount: 24 },
  { reviewer: "山本", avatarChar: "山", rating: 4, title: "香りが豊か", body: "袋を開けた瞬間の香りが良いです。豆のサイズも揃っていて挽きやすい。欲を言えばもう少し量があると嬉しい。", date: "2026/05/28", helpfulCount: 8 },
  { reviewer: "コーヒー初心者", avatarChar: "コ", rating: 5, title: "贈り物にも", body: "父の日に注文しました。パッケージがしっかりしていて高級感あり。中煎りも試してみたいです。", date: "2026/05/20", helpfulCount: 3 },
]

export default function CoffeeProductDetail() {
  const [size, setSize] = useState<SizeKey>("200g")
  const [qty, setQty] = useState(1)
  const [fav, setFav] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const current = sizeOptions[size]

  return (
    <div className="@container min-h-dvh bg-[var(--Surface-Secondary)] pb-24 @xl:pb-8">
      <div className="@xl:mx-auto @xl:max-w-5xl @xl:px-6 @xl:pt-6">
        {/* 上段: PC は 2 列（左=画像ギャラリー / 右=購入情報）、SP は縦積み */}
        <div className="@xl:grid @xl:grid-cols-2 @xl:items-start @xl:gap-8">
          {/* 画像ギャラリー（メイン + サムネイル列）— PC では左カラム */}
          <div className="bg-[var(--Surface-Primary)] pb-3 @xl:rounded-2xl @xl:pb-4">
            <div className="relative px-4 pt-4">
              <img
                src={images[activeImg].src}
                alt={images[activeImg].alt}
                className="aspect-square w-full rounded-lg object-cover"
              />
              <span className="absolute bottom-3 right-7 rounded-full bg-[var(--Overlay-Dark)] px-2 py-0.5">
                <span className="typo-label-xs text-[var(--Text-on-Inverse)]">
                  {activeImg + 1} / {images.length}
                </span>
              </span>
              {/* SP のみ: 写真に重なるグラス調ナビ。PC は右カラムに操作を集約 */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 @xl:hidden">
                <Button variant="glass" size="icon-lg" aria-label="戻る">
                  <ArrowLeft2 size={22} />
                </Button>
                <Button variant="glass" size="icon-lg" aria-label="シェア">
                  <ExportCurve size={20} />
                </Button>
              </div>
            </div>

            {/* サムネイル列 */}
            <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
              {images.map((img, i) => (
                <Button
                  key={img.src}
                  variant="ghost"
                  aria-label={`画像 ${i + 1} を表示`}
                  aria-pressed={activeImg === i}
                  onClick={() => setActiveImg(i)}
                  className={`!size-16 shrink-0 overflow-hidden !rounded-lg !p-0 ${
                    activeImg === i
                      ? "border-2 border-[var(--Brand-Primary)]"
                      : "border border-[var(--Border-Low-Emphasis)]"
                  }`}
                >
                  <img src={img.src} alt="" className="size-full object-cover" />
                </Button>
              ))}
            </div>
          </div>

          {/* 商品情報 — PC では右カラム */}
          <section className="bg-[var(--Surface-Primary)] px-5 pt-5 pb-6 @xl:rounded-2xl">
            <div className="flex items-center gap-2">
              <Tag variant="brand">深煎り</Tag>
              <Tag variant="success">送料無料</Tag>
            </div>
            <h1 className="typo-heading-md text-[var(--Text-High-Emphasis)] mt-3">
              スペシャルティ ブレンド「夜明け」自家焙煎
            </h1>
            <div className="mt-2">
              <RatingDisplay rating={4.7} reviewCount={312} size="md" />
            </div>

            {/* 会員価格 / 通常価格の2段 */}
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="typo-label-sm text-[var(--Text-on-Inverse)] bg-[var(--Brand-Primary)] rounded-sm px-1.5 py-0.5">
                    会員価格
                  </span>
                  <PriceDisplay price={current.member} size="xl" />
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">通常価格</span>
                  <PriceDisplay price={current.price} size="sm" showTaxLabel={false} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* PC のみ: シェア（SP は写真上のグラスナビにある） */}
                <Button variant="tertiary" size="icon-lg" aria-label="シェア" className="hidden @xl:flex">
                  <ExportCurve size={20} />
                </Button>
                <Button
                  variant={fav ? "secondary-switch" : "tertiary"}
                  size="icon-lg"
                  aria-label={fav ? "お気に入り解除" : "お気に入りに追加"}
                  aria-pressed={fav}
                  onClick={() => setFav((v) => !v)}
                >
                  <Heart size={22} variant={fav ? "Bold" : "Linear"} />
                </Button>
              </div>
            </div>

            {/* 内容量選択（単一選択なので multiple={false} 必須） */}
            <div className="mt-6">
              <p className="typo-label-md text-[var(--Text-High-Emphasis)] mb-2">内容量</p>
              <ChipSelector
                options={[
                  { label: "200g", value: "200g" },
                  { label: "500g", value: "500g" },
                  { label: "1kg", value: "1kg" },
                ]}
                value={[size]}
                onChange={(v) => v[0] && setSize(v[0] as SizeKey)}
                multiple={false}
                size="md"
              />
            </div>

            {/* 数量 */}
            <div className="mt-6 flex items-center justify-between">
              <p className="typo-label-md text-[var(--Text-High-Emphasis)]">数量</p>
              <QuantitySelector value={qty} min={1} max={10} onChange={setQty} size="md" />
            </div>

            {/* PC 専用インライン CTA（SP は画面下部の固定バーを使う） */}
            <div className="mt-6 hidden items-center gap-3 @xl:flex">
              <div className="shrink-0">
                <PriceDisplay price={current.member * qty} size="md" />
              </div>
              <Button variant="default" size="lg" className="flex-1" haptic="medium">
                <Coffee size={20} />
                カートに追加
              </Button>
            </div>
          </section>
        </div>

        {/* 成分・産地 */}
        <section className="mt-3 bg-[var(--Surface-Primary)] px-5 py-6 @xl:rounded-2xl">
          <h2 className="typo-heading-sm text-[var(--Text-High-Emphasis)]">商品について</h2>
          <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-3">
            エチオピア・イルガチェフェ産の豆を中心に、コクと甘みのバランスを追求したオリジナルブレンド。
            注文を受けてから焙煎し、鮮度の高い状態でお届けします。
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Location size={18} className="text-[var(--Text-Accent-Primary)] mt-0.5 shrink-0" />
              <div>
                <p className="typo-label-sm text-[var(--Text-High-Emphasis)]">産地</p>
                <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">エチオピア / ブラジル / グアテマラ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Coffee size={18} className="text-[var(--Text-Accent-Primary)] mt-0.5 shrink-0" />
              <div>
                <p className="typo-label-sm text-[var(--Text-High-Emphasis)]">焙煎度 / 挽き方</p>
                <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">深煎り（フルシティロースト）/ 豆のまま・粉から選択可</p>
              </div>
            </div>
          </div>
        </section>

        {/* レビュー */}
        <section className="mt-3 bg-[var(--Surface-Primary)] px-5 py-6 @xl:rounded-2xl">
          <div className="flex items-center justify-between">
            <h2 className="typo-heading-sm text-[var(--Text-High-Emphasis)]">レビュー</h2>
            <RatingDisplay rating={4.7} reviewCount={312} size="sm" />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {reviews.map((r) => (
              <ReviewCard key={r.reviewer} {...r} />
            ))}
          </div>
          <Button variant="tertiary" className="mt-4 w-full">
            すべてのレビューを見る
          </Button>
        </section>
      </div>

      {/* 固定カート追加バー — SP のみ。PC は右カラムのインライン CTA を使う */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-4 py-3 @xl:hidden">
        <div className="mx-auto flex max-w-[390px] items-center gap-3">
          <div className="shrink-0">
            <PriceDisplay price={current.member * qty} size="md" />
          </div>
          <Button variant="default" size="lg" className="flex-1" haptic="medium">
            <Coffee size={20} />
            カートに追加
          </Button>
        </div>
      </div>
    </div>
  )
}
