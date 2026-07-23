import * as React from "react"
import { cn } from "@/lib/utils"
import {
  carouselControls as CarouselControls,
  useCarouselController,
} from "@/components/patterns/_internal/carousel-primitives"

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
  const total = images.length
  const { active, goTo, next, previous, scrollRef } = useCarouselController({
    total,
    autoPlay,
  })

  // アスペクト比のクラス
  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
        ? "aspect-video"
        : "aspect-[2/1]"

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
      <CarouselControls
        active={active}
        total={total}
        showArrows={showArrows}
        showDots={showDots}
        onPrevious={previous}
        onNext={next}
        onGoTo={goTo}
      />
    </div>
  )
}

export { ImageCarousel }
