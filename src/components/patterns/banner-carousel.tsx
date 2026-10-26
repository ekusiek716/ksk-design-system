import { cn } from "@/lib/utils"
import { OVERLAY_FOCUS_RING_INSET_OVER } from "@/lib/server-variants/overlay-focus-ring"
import { useKskLabels } from "../ui/ksk-labels"

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
  /** 「もっと見る」テキスト。省略時は KskLabelsProvider の `carouselMore`（Provider 無しは "もっと見る"。locale="en" で "See more"） */
  moreLabel?: string
  onMore?: () => void
  /** バナーの縦横比 */
  itemAspectRatio?: "2/1" | "3/2" | "4/3"
  /** バナー幅（px） */
  itemWidth?: number
  className?: string
  /** スクロール領域 (role="region") の aria-label。省略時は KskLabelsProvider の `bannerCarouselRegion`（Provider 無しは "バナー一覧"。locale="en" で "Banners"） */
  regionLabel?: string
}

// キャプション（Text-on-Inverse）を載せるため -Bold を使う。
// base（500 相当）は amber/teal 等で白文字が 2.1〜3.7:1 と AA 未達。
// -Bold はダークモードで 300 相当の明色に反転するが、文字側も
// Text-on-Inverse（dark では Gray-900）が連動して反転するため両モードで AA。
const DEFAULT_BACKGROUNDS = [
  "var(--Categorical-10-Bold)",
  "var(--Categorical-6-Bold)",
  "var(--Categorical-13-Bold)",
  "var(--Categorical-3-Bold)",
  "var(--Categorical-11-Bold)",
]

const ASPECT: Record<string, string> = {
  "2/1": "aspect-[2/1]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
}

function BannerCarousel({
  title,
  items,
  moreLabel: moreLabelProp,
  onMore,
  itemAspectRatio = "2/1",
  itemWidth = 200,
  className,
  regionLabel: regionLabelProp,
}: BannerCarouselProps) {
  const defaultLabels = useKskLabels()
  const moreLabel = moreLabelProp ?? defaultLabels.carouselMore
  const regionLabel = regionLabelProp ?? defaultLabels.bannerCarouselRegion
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

      {/* Scroll strip。項目が href/onClick 無し(div)構成のときは中に focusable な
          要素が無いため、キーボードで横スクロールできるようにする
          （axe: scrollable-region-focusable）。 */}
      <div
        className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]"
        tabIndex={0}
        role="region"
        aria-label={regionLabel}
      >
        {items.map((item, i) => {
          const background = item.gradient ?? DEFAULT_BACKGROUNDS[i % DEFAULT_BACKGROUNDS.length]
          // href があれば a、onClick だけなら button（キーボード操作可）、どちらも無ければ div
          const Tag = item.href ? "a" : item.onClick ? "button" : "div"

          return (
            <Tag
              key={i}
              href={item.href}
              type={Tag === "button" ? "button" : undefined}
              onClick={item.onClick}
              style={{
                width: itemWidth,
                flexShrink: 0,
                background: item.imageSrc ? undefined : background,
              }}
              className={cn(
                "relative rounded-xl overflow-hidden flex flex-col justify-end p-3 text-left",
                // 画像・グラデーションの上、かつ横スクロールの枠（overflow-x-auto は縦も切る）の中なので、
                // 内側の二重リング。画像（absolute inset-0）が自身の inset 影を隠すため ::after に描く
                OVERLAY_FOCUS_RING_INSET_OVER,
                (item.href || item.onClick) && "cursor-pointer",
                "hover:opacity-95 active:scale-[.98] transition-transform",
                ASPECT[itemAspectRatio] ?? "aspect-[2/1]",
                item.href && "block",
                // 既定背景（-Bold: ダークで明色化）は連動して反転する Text-on-Inverse、
                // 消費側指定の gradient は明暗不明のため常時白 + 影の Text-on-Media を維持
                !item.imageSrc && (item.gradient ? "text-[var(--Text-on-Media)]" : "text-[var(--Text-on-Inverse)]")
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
              {/* 画像・消費側 gradient は常時白（Text-on-Media）、既定の -Bold fill は
                  ダークモードで fill が明色化するのに合わせて反転する Text-on-Inverse */}
              {(item.caption || item.subCaption) && (
                <div className="relative z-10">
                  {item.caption && (
                    <p className={cn("typo-label-xs leading-snug", item.imageSrc || item.gradient ? "text-[var(--Text-on-Media)]" : "text-[var(--Text-on-Inverse)]")}>{item.caption}</p>
                  )}
                  {item.subCaption && (
                    <p className={cn("typo-label-xs mt-0.5", item.imageSrc || item.gradient ? "text-[var(--Text-on-Media)]" : "text-[var(--Text-on-Inverse)]")}>{item.subCaption}</p>
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
