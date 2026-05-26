import * as React from "react"
import { cn } from "@/lib/utils"
import { PriceDisplay } from "./price-display"
import { RatingDisplay } from "./rating-display"

// タグのバリアント定義
interface ProductCardTag {
  label: string
  variant?: "default" | "brand" | "caution" | "success"
}

// 商品カードのプロパティ定義
interface ProductCardProps extends React.ComponentProps<"div"> {
  name: string
  imageUrl: string
  imageAlt?: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  shopName?: string
  tags?: ProductCardTag[]
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  href?: string
  onCardClick?: () => void
  ranking?: number
  deliveryLabel?: string
  orientation?: "vertical" | "horizontal"
  showCartButton?: boolean
  onCartAdd?: () => void
  cartButtonLabel?: string
}

// お気に入りアイコン
function HeartIcon({ filled = false, size = 20 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "var(--Caution-Base)" : "none"}
      stroke={filled ? "var(--Caution-Base)" : "var(--Object-High-Emphasis)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

// タグバッジコンポーネント
function TagBadge({ label, variant = "default" }: ProductCardTag) {
  const variantClasses = {
    default:
      "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
    brand:
      "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
    caution:
      "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
    success:
      "bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 typo-label-xs",
        variantClasses[variant]
      )}
    >
      {label}
    </span>
  )
}

/**
 * ProductCard — 商品表示カード（EC 系の中核）。
 *
 * orientation:
 * - `vertical`（既定）: グリッド表示。商品一覧・カルーセル向け。
 * - `horizontal`: リスト表示。カート・検索結果・履歴向け。
 *
 * stretched-link パターン:
 *   `href` または `onCardClick` を渡すとカード全体が 1 つのクリッカブル領域に
 *   なる（`<a class="absolute inset-0">` を内側に重ねる）。
 *   FavoriteButton / CartButton は z-index で上に重ねつつ、
 *   `e.stopPropagation()` で外側リンクの伝播を止めている。
 *
 * 機能:
 * - `ranking`: ランキングバッジ表示（左上）
 * - `tags`: TagBadge を画像下部に表示
 * - `discountPercent`: `originalPrice > price` から自動算出
 * - `isFavorite` / `onFavoriteToggle`: ハート（重ね・トグル）
 * - `showCartButton`: カート追加 CTA（vertical のみ）
 */
function ProductCard({
  className,
  name,
  imageUrl,
  imageAlt,
  price,
  originalPrice,
  rating,
  reviewCount,
  shopName,
  tags = [],
  isFavorite = false,
  onFavoriteToggle,
  href,
  onCardClick,
  ranking,
  deliveryLabel,
  orientation = "vertical",
  showCartButton = false,
  onCartAdd,
  cartButtonLabel = "カートに追加",
  ...props
}: ProductCardProps) {
  // 割引率の計算
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  // カード全体のリンクまたはクリックエリア（stretched-link パターン）
  // - 画像・テキスト全体を 1 つのアクセシブルなリンク領域にする
  // - 内部の interactive 要素（FavoriteButton / CartButton）は z-index で上に重ねる
  //   (favorite z-[4] / cart z-10) → クリック時の e.stopPropagation() と併用
  const cardLink = href ? (
    <a
      href={href}
      data-slot="card-link"
      className="absolute inset-0 z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-lg"
      aria-label={name}
    >
      <span className="sr-only">{name}</span>
    </a>
  ) : onCardClick ? (
    <button
      type="button"
      data-slot="card-link"
      className="absolute inset-0 z-[1] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-lg"
      aria-label={name}
      onClick={onCardClick}
    >
      <span className="sr-only">{name}</span>
    </button>
  ) : null

  // 水平レイアウト
  if (orientation === "horizontal") {
    return (
      <div
        data-slot="product-card"
        data-orientation="horizontal"
        className={cn(
          "group relative flex rounded-lg bg-[var(--Surface-Primary)]",
          className
        )}
        {...props}
      >
        {cardLink}
        {/* 商品画像 */}
        <div className="relative h-auto w-28 shrink-0 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={imageAlt ?? name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {/* お気に入りボタン */}
          {onFavoriteToggle && (
            <div className="absolute bottom-1 right-1 z-10">
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onFavoriteToggle()
                }}
                aria-label={
                  isFavorite ? "お気に入りから削除" : "お気に入りに追加"
                }
              >
                <HeartIcon filled={isFavorite} size={16} />
              </button>
            </div>
          )}
        </div>
        {/* 商品情報 */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1 pl-3 pr-1">
          <div className="space-y-0.5">
            {shopName && (
              <p className="truncate typo-body-sm text-[var(--Text-Low-Emphasis)]">
                {shopName}
              </p>
            )}
            <h3 className="line-clamp-2 typo-body-md text-[var(--Text-High-Emphasis)]">
              {name}
            </h3>
          </div>
          <div className="mt-1 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              {rating != null && (
                <RatingDisplay
                  rating={rating}
                  reviewCount={reviewCount}
                  size="sm"
                />
              )}
              {deliveryLabel && (
                <p className="typo-body-xs text-[var(--Text-Medium-Emphasis)]">
                  {deliveryLabel}
                </p>
              )}
            </div>
            <PriceDisplay
              price={price}
              originalPrice={originalPrice}
              size="sm"
              showTaxLabel={false}
            />
          </div>
        </div>
      </div>
    )
  }

  // 垂直レイアウト（デフォルト）
  return (
    <div
      data-slot="product-card"
      data-orientation="vertical"
      className={cn(
        "group relative flex min-w-[140px] flex-col gap-1 bg-[var(--Surface-Primary)]",
        className
      )}
      {...props}
    >
      {cardLink}
      {/* 商品画像エリア */}
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={imageAlt ?? name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
          {/* タグ表示エリア */}
          {/* ランキングバッジ */}
          {ranking != null && (
            <span className="absolute left-1.5 top-1.5 z-[5] flex size-7 items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-xs text-[var(--Text-on-Inverse)] shadow-[var(--shadow-md)]">
              {ranking}
            </span>
          )}
          <div className="absolute inset-x-1 bottom-1 z-[3] flex flex-wrap gap-1">
            {discountPercent && (
              <TagBadge label={`${discountPercent}%OFF`} variant="caution" />
            )}
            {tags.map((tag) => (
              <TagBadge key={tag.label} {...tag} />
            ))}
          </div>
        </div>
        {/* お気に入りボタン */}
        {onFavoriteToggle && (
          <div className="absolute bottom-1.5 right-1.5 z-[4]">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]/80 backdrop-blur-sm transition-colors hover:bg-[var(--Surface-Tertiary)]"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onFavoriteToggle()
              }}
              aria-label={
                isFavorite ? "お気に入りから削除" : "お気に入りに追加"
              }
            >
              <HeartIcon filled={isFavorite} size={20} />
            </button>
          </div>
        )}
      </div>
      {/* 商品情報エリア */}
      <div className="flex flex-1 flex-col gap-0.5">
        {shopName && (
          <p className="truncate typo-body-sm text-[var(--Text-Low-Emphasis)]">
            {shopName}
          </p>
        )}
        <h3 className="line-clamp-2 typo-body-md text-[var(--Text-High-Emphasis)]">
          {name}
        </h3>
        {(rating != null || deliveryLabel) && (
          <div className="flex flex-wrap items-center gap-2">
            {rating != null && (
              <RatingDisplay
                rating={rating}
                reviewCount={reviewCount}
                size="sm"
              />
            )}
            {deliveryLabel && (
              <p className="typo-body-xs text-[var(--Text-Medium-Emphasis)]">
                {deliveryLabel}
              </p>
            )}
          </div>
        )}
        <PriceDisplay
          price={price}
          originalPrice={originalPrice}
          size="md"
          showTaxLabel={false}
        />
      </div>
      {/* カート追加ボタン */}
      {showCartButton && (
        <button
          type="button"
          data-slot="button"
          className="relative z-10 flex h-9 w-full items-center justify-center gap-1 rounded-full bg-[var(--Brand-Primary)] typo-label-md text-[var(--Text-on-Inverse)] transition-colors hover:bg-[var(--Hover-Primary-Button)] cursor-pointer"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onCartAdd?.()
          }}
        >
          {cartButtonLabel}
        </button>
      )}
    </div>
  )
}

export { ProductCard }
export type { ProductCardProps, ProductCardTag }
