import * as React from "react"
import { cn } from "@/lib/utils"

// 画像カルーセルのプロパティ定義
interface ImageCarouselProps extends React.ComponentProps<"div"> {
  images: Array<{ src: string; alt: string; href?: string }>
  aspectRatio?: "square" | "video" | "banner"
  showDots?: boolean
  showArrows?: boolean
  autoPlay?: number
}

// 汎用画像カルーセルコンポーネント（CSS scroll-snap使用）
function ImageCarousel({
  images,
  aspectRatio = "banner",
  showDots = true,
  showArrows = true,
  autoPlay = 0,
  className,
  ...props
}: ImageCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)
  const total = images.length

  // アスペクト比のクラス
  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
        ? "aspect-video"
        : "aspect-[2/1]"

  // IntersectionObserverでアクティブスライドを検出
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index)
            if (!isNaN(idx)) setActive(idx)
          }
        }
      },
      { root: el, threshold: 0.6 }
    )
    el.querySelectorAll("[data-slide]").forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [total])

  // 指定インデックスへスクロール
  const goTo = React.useCallback((i: number) => {
    const el = scrollRef.current?.children[i] as HTMLElement
    if (el)
      scrollRef.current!.scrollTo({
        left: el.offsetLeft,
        behavior: "smooth",
      })
  }, [])

  // 自動再生の制御
  React.useEffect(() => {
    if (autoPlay <= 0 || total <= 1) return
    const id = setInterval(() => goTo((active + 1) % total), autoPlay)
    return () => clearInterval(id)
  }, [autoPlay, active, total, goTo])

  if (!total) return null

  return (
    <div
      data-slot="image-carousel"
      className={cn("group/carousel relative", className)}
      {...props}
    >
      {/* スライドコンテナ */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            data-slide
            data-index={i}
            className="w-full shrink-0 snap-start px-4 lg:px-0"
          >
            {img.href ? (
              <a href={img.href} className="block">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={cn(
                    "w-full rounded-lg object-cover",
                    aspectClass
                  )}
                />
              </a>
            ) : (
              <img
                src={img.src}
                alt={img.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className={cn(
                  "w-full rounded-lg object-cover",
                  aspectClass
                )}
              />
            )}
          </div>
        ))}
      </div>
      {/* PC向け矢印ナビゲーション（ホバー時表示） */}
      {showArrows && total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active <= 0 ? total - 1 : active - 1)}
            aria-label="前へ"
            className="absolute left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-md)] transition-opacity lg:flex lg:opacity-0 lg:group-hover/carousel:opacity-100"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12 15L7 10L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() =>
              goTo(active >= total - 1 ? 0 : active + 1)
            }
            aria-label="次へ"
            className="absolute right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-md)] transition-opacity lg:flex lg:opacity-0 lg:group-hover/carousel:opacity-100"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M8 5L13 10L8 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
      {/* SP向けドットインジケーター */}
      {showDots && total > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5 lg:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`スライド ${i + 1}`}
              className={cn(
                "size-2 rounded-full transition-colors",
                i === active
                  ? "bg-[var(--Text-High-Emphasis)]"
                  : "bg-[var(--Surface-Tertiary)]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { ImageCarousel }
