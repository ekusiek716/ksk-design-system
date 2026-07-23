import * as React from "react"
import {
  carouselControls as CarouselControls,
  useCarouselController,
} from "@/components/patterns/_internal/carousel-primitives"
import { cn } from "@/lib/utils"

interface ContentCarouselProps extends React.ComponentProps<"div"> {
  /** 任意の React コンテンツを 1 枚ずつ表示する。 */
  slides: React.ReactNode[]
  showDots?: boolean
  showArrows?: boolean
  /** 自動送りの間隔（ms）。0 で無効。 */
  autoPlay?: number
}

/**
 * ReactNode をスライドとして扱える汎用カルーセル。
 *
 * 矢印とドットは ImageCarousel と同じ内部プリミティブを使い、意匠と挙動を
 * 同期する。画像だけなら ImageCarousel、商品一覧なら ProductCarousel を使う。
 */
function ContentCarousel({
  slides,
  showDots = true,
  showArrows = true,
  autoPlay = 0,
  className,
  "aria-label": ariaLabel = "コンテンツカルーセル",
  onKeyDown,
  tabIndex = 0,
  ...props
}: ContentCarouselProps) {
  const normalizedSlides = React.Children.toArray(slides)
  const total = normalizedSlides.length
  const { active, goTo, next, previous, scrollRef } = useCarouselController({
    total,
    autoPlay,
  })

  if (!total) return null

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.target !== event.currentTarget) return
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      previous()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      next()
    }
  }

  return (
    <div
      {...props}
      data-slot="content-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      className={cn("group/carousel relative", className)}
    >
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {normalizedSlides.map((slide, index) => (
          <div
            key={index}
            data-slide
            data-index={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${total}`}
            tabIndex={0}
            className="w-full shrink-0 snap-start"
          >
            {slide}
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

export { ContentCarousel }
export type { ContentCarouselProps }
