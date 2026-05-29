import { cn } from "@/lib/utils"

interface BannerItem {
  /** 背景画像URL（なければ gradient） */
  imageSrc?: string
  /** グラデーション色（imageSrcがない場合） */
  gradient?: string
  caption?: string
  subCaption?: string
  href?: string
  onClick?: () => void
}

interface BannerCarouselProps {
  title?: string
  items: BannerItem[]
  /** 「もっと見る」テキスト */
  moreLabel?: string
  onMore?: () => void
  /** バナーの縦横比 */
  itemAspectRatio?: "2/1" | "3/2" | "4/3"
  /** バナー幅（px） */
  itemWidth?: number
  className?: string
}

const DEFAULT_GRADIENTS = [
  "linear-gradient(135deg, #E8426B, #F9AABF)",
  "linear-gradient(135deg, #6366F1, #A5B4FC)",
  "linear-gradient(135deg, #F59E0B, #FDE68A)",
  "linear-gradient(135deg, #10B981, #6EE7B7)",
  "linear-gradient(135deg, #3B82F6, #93C5FD)",
]

const ASPECT: Record<string, string> = {
  "2/1": "aspect-[2/1]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
}

function BannerCarousel({
  title,
  items,
  moreLabel = "もっと見る",
  onMore,
  itemAspectRatio = "2/1",
  itemWidth = 200,
  className,
}: BannerCarouselProps) {
  return (
    <div data-slot="banner-carousel" className={cn("w-full", className)}>
      {/* Header */}
      {(title || onMore) && (
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          {title && (
            <h3 className="typo-label-md text-[var(--Text-High-Emphasis)] font-bold">{title}</h3>
          )}
          {onMore && (
            <button
              onClick={onMore}
              className="typo-label-xs text-[var(--Brand-Primary)] font-semibold hover:opacity-70 transition-opacity"
            >
              {moreLabel} →
            </button>
          )}
        </div>
      )}

      {/* Scroll strip */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
        {items.map((item, i) => {
          const gradient = item.gradient ?? DEFAULT_GRADIENTS[i % DEFAULT_GRADIENTS.length]
          const isLight = gradient.includes("FDE68A") // warn if text should be dark
          const Tag = item.href ? "a" : "div"

          return (
            <Tag
              key={i}
              href={item.href}
              onClick={item.onClick}
              style={{
                width: itemWidth,
                flexShrink: 0,
                background: item.imageSrc ? undefined : gradient,
              }}
              className={cn(
                "rounded-xl overflow-hidden flex flex-col justify-end p-3 cursor-pointer",
                "hover:opacity-95 active:scale-[.98] transition-transform",
                ASPECT[itemAspectRatio] ?? "aspect-[2/1]",
                item.href && "block",
                !item.imageSrc && (isLight ? "text-[#111]" : "text-white")
              )}
            >
              {item.imageSrc && (
                <img
                  src={item.imageSrc}
                  alt={item.caption ?? ""}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ position: "absolute" }}
                />
              )}
              {(item.caption || item.subCaption) && (
                <div className="relative z-10">
                  {item.caption && (
                    <p className="typo-label-xs font-bold leading-snug">{item.caption}</p>
                  )}
                  {item.subCaption && (
                    <p className="text-[10px] opacity-75 mt-0.5">{item.subCaption}</p>
                  )}
                </div>
              )}
            </Tag>
          )
        })}
      </div>
    </div>
  )
}

export { BannerCarousel }
export type { BannerCarouselProps, BannerItem }
