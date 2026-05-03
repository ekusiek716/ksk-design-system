import * as React from "react"
import { cn } from "@/lib/utils"

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
   * 前の画像ボタンの aria-label。i18n 対応: 英語では "Previous image" を渡す。@default "前の画像"
   */
  prevLabel?: string
  /**
   * 次の画像ボタンの aria-label。i18n 対応: 英語では "Next image" を渡す。@default "次の画像"
   */
  nextLabel?: string
  /**
   * 画像インデックスラベル生成関数。サムネイル / ドットの aria-label と alt テキストに使用。
   * i18n 対応: 英語では `(i) => \`Image ${i + 1}\`` を渡す。
   * @default (i) => `画像 ${i + 1}`
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
  prevLabel = "前の画像",
  nextLabel = "次の画像",
  imageLabel = (i) => `画像 ${i + 1}`,
}: ImageGalleryProps) {
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
      delta < 0 ? handleNext() : handlePrev()
    }
    touchStart.current = null
  }

  const current = images[active]

  return (
    <div data-slot="image-gallery" className={cn("flex flex-col gap-2", className)}>
      {/* Main */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-[var(--Surface-Tertiary)] cursor-pointer",
          ASPECT[aspectRatio] ?? "aspect-[4/3]"
        )}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => onImageClick?.(active)}
      >
        {current && (
          <img
            key={active}
            src={current.src}
            alt={current.alt ?? imageLabel(active)}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
        )}

        {/* Count badge */}
        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/50 text-white typo-label-xs px-2 py-0.5 rounded-full">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center disabled:opacity-0 transition-opacity hover:bg-black/60"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext() }}
              disabled={active === images.length - 1}
              aria-label={nextLabel}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center disabled:opacity-0 transition-opacity hover:bg-black/60"
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
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={imageLabel(i)}
              aria-pressed={i === active}
              className={cn(
                "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors bg-[var(--Surface-Tertiary)]",
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
        <div className="flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={imageLabel(i)}
              className={cn(
                "rounded-full transition-all",
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
