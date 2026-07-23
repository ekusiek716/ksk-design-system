import * as React from "react"
import { cn } from "@/lib/utils"

interface UseCarouselControllerOptions {
  total: number
  autoPlay: number
}

function useCarouselController({
  total,
  autoPlay,
}: UseCarouselControllerOptions) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index)
            if (!Number.isNaN(index)) setActive(index)
          }
        }
      },
      { root: el, threshold: 0.6 },
    )
    el.querySelectorAll("[data-slide]").forEach((slide) => obs.observe(slide))
    return () => obs.disconnect()
  }, [total])

  const goTo = React.useCallback((index: number) => {
    const slide = scrollRef.current?.children[index] as HTMLElement | undefined
    if (!slide) return
    scrollRef.current?.scrollTo({
      left: slide.offsetLeft,
      behavior: "smooth",
    })
  }, [])

  React.useEffect(() => {
    if (autoPlay <= 0 || total <= 1) return
    const id = window.setInterval(() => goTo((active + 1) % total), autoPlay)
    return () => window.clearInterval(id)
  }, [active, autoPlay, goTo, total])

  const previous = React.useCallback(
    () => goTo(active <= 0 ? total - 1 : active - 1),
    [active, goTo, total],
  )
  const next = React.useCallback(
    () => goTo(active >= total - 1 ? 0 : active + 1),
    [active, goTo, total],
  )

  return { active, goTo, next, previous, scrollRef }
}

interface CarouselControlsProps {
  active: number
  total: number
  showArrows: boolean
  showDots: boolean
  onPrevious: () => void
  onNext: () => void
  onGoTo: (index: number) => void
}

function carouselControls({
  active,
  total,
  showArrows,
  showDots,
  onPrevious,
  onNext,
  onGoTo,
}: CarouselControlsProps) {
  return (
    <>
      {showArrows && total > 1 && (
        <>
          <button
            type="button"
            onClick={onPrevious}
            aria-label="前へ"
            className="absolute left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-md)] transition-opacity lg:flex lg:opacity-0 lg:group-hover/carousel:opacity-100 lg:focus-visible:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
            onClick={onNext}
            aria-label="次へ"
            className="absolute right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-md)] transition-opacity lg:flex lg:opacity-0 lg:group-hover/carousel:opacity-100 lg:focus-visible:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
      {showDots && total > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5 lg:hidden">
          {Array.from({ length: total }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onGoTo(index)}
              aria-label={`スライド ${index + 1}`}
              className={cn(
                "size-2 rounded-full transition-colors",
                index === active
                  ? "bg-[var(--Text-High-Emphasis)]"
                  : "bg-[var(--Surface-Tertiary)]",
              )}
            />
          ))}
        </div>
      )}
    </>
  )
}

export { carouselControls, useCarouselController }
