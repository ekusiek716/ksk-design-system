import * as React from "react"
import { cn } from "@/lib/utils"
import { OVERLAY_FOCUS_RING, OVERLAY_FOCUS_RING_INSET } from "@/lib/server-variants/overlay-focus-ring"
import { formatKskLabel, useKskLabels } from "./ksk-labels"

interface GalleryImage {
  src: string
  alt?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  indicatorType?: "thumbnail" | "dot"
  aspectRatio?: "square" | "4/3" | "16/9" | "3/4"
  onImageClick?: (index: number) => void
  className?: string
  /**
   * 前の画像ボタンの aria-label。省略時は KskLabelsProvider の `imageGalleryPrev`（Provider 無しは "前の画像"。locale="en" で "Previous image"）。
   */
  prevLabel?: string
  /**
   * 次の画像ボタンの aria-label。省略時は KskLabelsProvider の `imageGalleryNext`（Provider 無しは "次の画像"。locale="en" で "Next image"）。
   */
  nextLabel?: string
  /**
   * 画像インデックスラベル生成関数。サムネイル / ドットの aria-label と alt テキストに使用。
   * 省略時は KskLabelsProvider の `imageGalleryImage`（`{index}` を 1 始まりの番号に置換。
   * Provider 無しは "画像 N"。locale="en" で "Image N"）。
   */
  imageLabel?: (index: number) => string
}

const ASPECT: Record<string, string> = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "3/4": "aspect-[3/4]",
}

function ImageGallery({
  images,
  indicatorType = "thumbnail",
  aspectRatio = "4/3",
  onImageClick,
  className,
  prevLabel: prevLabelProp,
  nextLabel: nextLabelProp,
  imageLabel: imageLabelProp,
}: ImageGalleryProps) {
  const defaultLabels = useKskLabels()
  const prevLabel = prevLabelProp ?? defaultLabels.imageGalleryPrev
  const nextLabel = nextLabelProp ?? defaultLabels.imageGalleryNext
  const imageLabel =
    imageLabelProp ?? ((i: number) => formatKskLabel(defaultLabels.imageGalleryImage, { index: i + 1 }))
  const [active, setActive] = React.useState(0)

  const handlePrev = () => setActive((i) => Math.max(0, i - 1))
  const handleNext = () => setActive((i) => Math.min(images.length - 1, i + 1))

  // Touch swipe
  const touchStart = React.useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) handleNext()
      else handlePrev()
    }
    touchStart.current = null
  }

  const current = images[active]

  return (
    <div data-slot="image-gallery" className={cn("flex flex-col gap-2", className)}>
      {/* Main */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-[var(--Surface-Tertiary)]",
          onImageClick && "cursor-pointer",
          ASPECT[aspectRatio] ?? "aspect-[4/3]"
        )}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {current && (
          <img
            key={active}
            src={current.src}
            alt={current.alt ?? imageLabel(active)}
            className="w-full h-full object-cover transition-opacity duration-[var(--Motion-Duration-Base)]"
          />
        )}

        {/* 画像クリックの主操作。矢印ボタン・カウントバッジより DOM 順で先に置き、
            それらの後方に来る要素が重なり上で優先してクリックを受けるようにする
            （矢印側の stopPropagation は本 button が親でなくなったため不要だが、
            他要素への影響を避けるため既存のまま残す）。issue #461 */}
        {onImageClick && (
          <button
            type="button"
            className={cn("absolute inset-0 z-0 h-full w-full cursor-pointer appearance-none", OVERLAY_FOCUS_RING_INSET)}
            aria-label={imageLabel(active)}
            onClick={() => onImageClick(active)}
          />
        )}

        {/* Count badge — 写真上の固定黒オーバーレイのため静的白（--Text-on-Inverse はダークで反転するため不可） */}
        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-[var(--Overlay-Medium)] text-[var(--Text-on-Media)] typo-label-xs px-2 py-0.5 rounded-full">
            {active + 1} / {images.length}
          </span>
        )}

        {/* Arrow buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev() }}
              disabled={active === 0}
              aria-label={prevLabel}
              className={cn("absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--Overlay-Light)] text-[var(--Text-on-Media)] flex items-center justify-center disabled:opacity-0 transition-opacity hover:bg-[var(--Overlay-Medium)]", OVERLAY_FOCUS_RING)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext() }}
              disabled={active === images.length - 1}
              aria-label={nextLabel}
              className={cn("absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--Overlay-Light)] text-[var(--Text-on-Media)] flex items-center justify-center disabled:opacity-0 transition-opacity hover:bg-[var(--Overlay-Medium)]", OVERLAY_FOCUS_RING)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {indicatorType === "thumbnail" && images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={imageLabel(i)}
              aria-pressed={i === active}
              className={cn(
                "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-transparent transition-colors bg-[var(--Surface-Tertiary)]",
                i === active
                  ? "border-[var(--Brand-Primary)]"
                  : "border-transparent hover:border-[var(--Border-Medium-Emphasis)]"
              )}
            >
              <img src={img.src} alt={img.alt ?? imageLabel(i)} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Dots */}
      {indicatorType === "dot" && images.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={imageLabel(i)}
              className={cn(
                "shrink-0 rounded-full transition-all",
                i === active
                  ? "w-4 h-1.5 bg-[var(--Brand-Primary)]"
                  : "w-1.5 h-1.5 bg-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Text-Low-Emphasis)]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { ImageGallery }
export type { ImageGalleryProps, GalleryImage }
