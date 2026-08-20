import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * サムネイルと本文の並び。
 * - `vertical`（既定）: サムネ上・本文下。横スクロールのストリップ / グリッド向け。
 * - `horizontal`      : サムネ左・本文右。縦積みのリスト向け。
 */
type ThumbnailCardOrientation = "vertical" | "horizontal"

/** サムネイルの比率。`horizontal` では常に正方形になる。 */
type ThumbnailCardAspect = "square" | "video" | "portrait"

interface ThumbnailCardCommonProps {
  /** サムネイル画像の URL。`thumbnail` を渡す場合は不要。 */
  imageUrl?: string
  imageAlt?: string
  /**
   * 画像そのものを差し替えるスロット（next/image・動画・スケルトン等）。
   * 指定時は `imageUrl` より優先される。
   */
  thumbnail?: React.ReactNode
  /** 見出し（2 行で省略）。カード全体リンクの accessible name になる。 */
  title: string
  /** 見出しの上に置く小さなラベル（カテゴリ・出典など）。 */
  eyebrow?: string
  /** 補足文（2 行で省略）。 */
  description?: string
  /**
   * 本文の最下段に置く補助情報（価格・距離・日時など）。
   * **押せる要素は置かない**（カード全体リンクに吸われる）。押せるものは `secondaryAction` へ。
   */
  meta?: React.ReactNode
  /**
   * カード全体リンクとは別の操作（お気に入り・メニュー等）。
   * サムネイルの右上に重ねて配置され、リンク面より前面に置かれるため
   * 押してもカードの遷移は起きない。`ImageOverlayAction` を渡すのが既定の想定。
   *
   * 実装は ListItem の secondaryAction と同じ「stretched link + 兄弟配置」構造で、
   * リンクの入れ子・button の入れ子にはならない。
   */
  secondaryAction?: React.ReactNode
  /** サムネイル上に重ねるバッジ等（順位・NEW・再生時間）。押せない表示専用。 */
  overlay?: React.ReactNode
  orientation?: ThumbnailCardOrientation
  aspect?: ThumbnailCardAspect
  className?: string
  disabled?: boolean
}

type ThumbnailCardLinkProps = ThumbnailCardCommonProps &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof ThumbnailCardCommonProps | "onClick"> & {
    href: string
    onClick?: never
  }

type ThumbnailCardButtonProps = ThumbnailCardCommonProps &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof ThumbnailCardCommonProps | "onClick"> & {
    href?: never
    onClick: React.MouseEventHandler<HTMLButtonElement>
  }

type ThumbnailCardProps = ThumbnailCardLinkProps | ThumbnailCardButtonProps

const ASPECT_CLASS: Record<ThumbnailCardAspect, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
}

/**
 * ThumbnailCard — サムネイル + テキストで、**カード全体が 1 つのリンク / ボタン**になるカード。
 *
 * ProductCard との役割分担:
 * - `ProductCard` は EC の商品カード。価格・割引率・レーティング・カート追加など
 *   **商品ドメインの情報構造を持つ**（PriceDisplay / RatingDisplay を内蔵）。
 * - `ThumbnailCard` はドメイン非依存。「サムネ + 見出し + 補足 + 任意の meta」だけを
 *   持ち、レコメンドストリップ・記事一覧・お知らせ・検索結果など
 *   価格やレーティングを持たないコンテンツに使う。
 *   価格・レーティングを表示したくなったら ProductCard へ寄せること
 *   （meta に価格文字列を手組みしない）。
 *
 * 構造（stretched link）:
 *   ルートは `<div class="relative">` で、カード全面を覆う不可視の `<a>` / `<button>`
 *   を兄弟として重ねる。テキスト側に別リンクを置かないこと（リンクの入れ子になる）。
 *   別操作は `secondaryAction` に渡すとリンク面の前に配置される。
 *
 * a11y:
 *   全面リンクの accessible name は `title`。サムネの `alt` は既定で空文字
 *   （リンク名の二重読み上げを避けるため）。画像自体に情報がある場合のみ
 *   `imageAlt` を明示する。
 */
function ThumbnailCard({
  imageUrl,
  imageAlt,
  thumbnail,
  title,
  eyebrow,
  description,
  meta,
  secondaryAction,
  overlay,
  orientation = "vertical",
  aspect = "square",
  className,
  disabled = false,
  href,
  onClick,
  ...props
}: ThumbnailCardProps) {
  const isHorizontal = orientation === "horizontal"

  const media = (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[var(--Radius-Surface)] bg-[var(--Surface-Secondary)]",
        isHorizontal ? "size-20" : cn("w-full", ASPECT_CLASS[aspect]),
      )}
    >
      {thumbnail ?? (
        imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? ""}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : null
      )}
      {overlay && <div className="absolute inset-x-1 bottom-1 flex flex-wrap gap-1">{overlay}</div>}
      {secondaryAction && (
        // stretched link より前面に置き、押しても遷移が起きないようにする。
        <div className="absolute inset-0 z-[2] pointer-events-none [&>*]:pointer-events-auto">
          {secondaryAction}
        </div>
      )}
    </div>
  )

  const overlayClassName = cn(
    "absolute inset-0 z-[1] rounded-[var(--Radius-Surface)]",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
  )

  return (
    <div
      {...(props as React.ComponentPropsWithoutRef<"div">)}
      data-slot="thumbnail-card"
      data-orientation={orientation}
      className={cn(
        "group relative flex bg-[var(--Surface-Primary)]",
        isHorizontal ? "flex-row items-start gap-3" : "min-w-[140px] flex-col gap-2",
        disabled && "opacity-50",
        className,
      )}
    >
      {media}
      <div className={cn("flex min-w-0 flex-col gap-0.5", isHorizontal && "flex-1")}>
        {eyebrow && (
          <p className="truncate typo-label-xs text-[var(--Text-Low-Emphasis)]">{eyebrow}</p>
        )}
        <h3 className="line-clamp-2 typo-label-md text-[var(--Text-High-Emphasis)]">{title}</h3>
        {description && (
          <p className="line-clamp-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">
            {description}
          </p>
        )}
        {meta && <div className="mt-0.5 typo-body-sm text-[var(--Text-Medium-Emphasis)]">{meta}</div>}
      </div>
      {href ? (
        <a
          href={href}
          data-slot="card-link"
          aria-label={title}
          aria-disabled={disabled || undefined}
          className={overlayClassName}
          onClick={(event) => {
            if (disabled) event.preventDefault()
          }}
        >
          <span className="sr-only">{title}</span>
        </a>
      ) : (
        <button
          type="button"
          data-slot="card-link"
          aria-label={title}
          disabled={disabled}
          className={overlayClassName}
          onClick={onClick}
        >
          <span className="sr-only">{title}</span>
        </button>
      )}
    </div>
  )
}

export { ThumbnailCard }
export type { ThumbnailCardAspect, ThumbnailCardOrientation, ThumbnailCardProps }
