import * as React from "react"
import { cn } from "@/lib/utils"
import { ProductCard, type ProductCardProps } from "./product-card"

// カードサイズごとの幅クラス
const cardSizeClasses = {
  sm: "w-40",
  md: "w-[200px]",
  lg: "w-[240px]",
} as const

// 商品カルーセルのプロパティ定義
interface ProductCarouselProps extends React.ComponentProps<"section"> {
  title: string
  subtitle?: string
  moreHref?: string
  moreLabel?: string
  onMoreClick?: () => void
  products: ProductCardProps[]
  cardSize?: "sm" | "md" | "lg"
  showRanking?: boolean
  showCartButton?: boolean
}

// 汎用商品カルーセルコンポーネント
function ProductCarousel({
  className,
  title,
  subtitle,
  moreHref,
  moreLabel = "もっと見る",
  onMoreClick,
  products,
  cardSize = "sm",
  showRanking = false,
  showCartButton = false,
  ...props
}: ProductCarouselProps) {
  return (
    <section
      data-slot="product-carousel"
      className={cn("py-4", className)}
      {...props}
    >
      {/* セクションヘッダー */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div>
          <h2 className="typo-heading-lg text-[var(--Text-High-Emphasis)]">
            {title}
          </h2>
          {subtitle && (
            <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {/* 「もっと見る」リンク */}
        {(moreHref || onMoreClick) && (
          <a
            href={moreHref}
            onClick={onMoreClick}
            className="typo-label-sm text-[var(--Text-Accent-Primary)] shrink-0 cursor-pointer hover:underline"
          >
            {moreLabel} →
          </a>
        )}
      </div>
      {/* 横スクロール商品リスト */}
      <div
        className={cn(
          "flex overflow-x-auto pl-4 pb-2 gap-3 scrollbar-hide",
          showCartButton && "items-stretch"
        )}
      >
        {products.map((product, i) => (
          <div
            key={product.name + i}
            className={cn("shrink-0", cardSizeClasses[cardSize])}
          >
            <ProductCard
              {...product}
              ranking={showRanking ? i + 1 : product.ranking}
              showCartButton={showCartButton}
              className={cn(
                product.className,
                showCartButton && "h-full"
              )}
            />
          </div>
        ))}
        {/* 右端のパディング用スペーサー */}
        <div className="shrink-0 w-4" aria-hidden />
      </div>
    </section>
  )
}

export { ProductCarousel }
