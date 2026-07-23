/**
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ContentCarousel } from "../src/components/patterns/content-carousel"
import { ImageCarousel } from "../src/components/patterns/commerce/image-carousel"
import * as PublicApi from "../src/index"

const slides = [
  <article key="one">最初のスライド</article>,
  <article key="two">次のスライド</article>,
]

function parse(markup: string) {
  const container = document.createElement("div")
  container.innerHTML = markup
  return container
}

describe("ContentCarousel", () => {
  it("carousel region と到達可能な slide group を描画する", () => {
    const output = renderToStaticMarkup(
      <ContentCarousel slides={slides} aria-label="おすすめ" />,
    )
    const container = parse(output)
    const carousel = container.querySelector(
      '[role="region"][aria-roledescription="carousel"]',
    )
    const groups = container.querySelectorAll(
      '[role="group"][aria-roledescription="slide"]',
    )

    expect(carousel?.getAttribute("aria-label")).toBe("おすすめ")
    expect(carousel?.getAttribute("tabindex")).toBe("0")
    expect(groups).toHaveLength(2)
    expect(groups[0].getAttribute("aria-label")).toBe("1 / 2")
    expect(groups[0].getAttribute("tabindex")).toBe("0")
    expect(groups[1].getAttribute("aria-label")).toBe("2 / 2")
  })

  it("ImageCarousel と同一の矢印・ドット markup を共有する", () => {
    const content = parse(
      renderToStaticMarkup(<ContentCarousel slides={slides} />),
    )
    const images = parse(
      renderToStaticMarkup(
        <ImageCarousel
          images={[
            { src: "/one.jpg", alt: "1" },
            { src: "/two.jpg", alt: "2" },
          ]}
        />,
      ),
    )

    for (const label of ["前へ", "次へ", "スライド 1", "スライド 2"]) {
      const contentControl = content.querySelector(`[aria-label="${label}"]`)
      const imageControl = images.querySelector(`[aria-label="${label}"]`)
      expect(contentControl?.outerHTML).toBe(imageControl?.outerHTML)
    }

    const firstDot = content.querySelector('[aria-label="スライド 1"]')
    expect(firstDot?.className).toContain("size-11")
    expect(firstDot?.querySelector("span")?.className).toContain("size-2")
  })

  it("controls を個別に非表示にできる", () => {
    const output = renderToStaticMarkup(
      <ContentCarousel slides={slides} showArrows={false} showDots={false} />,
    )

    expect(output).not.toContain('aria-label="前へ"')
    expect(output).not.toContain('aria-label="スライド 1"')
  })

  it("描画されない ReactNode を slide 数に含めない", () => {
    const output = renderToStaticMarkup(
      <ContentCarousel slides={[null, false, <span key="only">表示</span>]} />,
    )

    expect(output).toContain('aria-label="1 / 1"')
    expect(output).not.toContain('aria-label="2 / 3"')
    expect(output).not.toContain('aria-label="前へ"')
  })

  it("空配列は描画せず、package root から公開する", () => {
    expect(renderToStaticMarkup(<ContentCarousel slides={[]} />)).toBe("")
    expect(PublicApi.ContentCarousel).toBe(ContentCarousel)
  })
})

describe("ContentCarousel keyboard navigation", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    )
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("ルートの左右矢印キーで前後へ移動する", () => {
    act(() => root.render(<ContentCarousel slides={slides} />))
    const carousel = container.querySelector<HTMLElement>(
      '[data-slot="content-carousel"]',
    )!
    const viewport = carousel.firstElementChild as HTMLDivElement
    const slideElements = viewport.querySelectorAll<HTMLElement>("[data-slide]")
    const scrollTo = vi.fn()
    viewport.scrollTo = scrollTo
    Object.defineProperty(slideElements[1], "offsetLeft", {
      configurable: true,
      value: 320,
    })

    act(() => {
      carousel.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(scrollTo).toHaveBeenCalledWith({
      left: 320,
      behavior: "smooth",
    })
  })

  it("フォーカス中は autoplay を停止する", () => {
    vi.useFakeTimers()
    act(() =>
      root.render(<ContentCarousel slides={slides} autoPlay={1000} />),
    )
    const carousel = container.querySelector<HTMLElement>(
      '[data-slot="content-carousel"]',
    )!
    const viewport = carousel.firstElementChild as HTMLDivElement
    const scrollTo = vi.fn()
    viewport.scrollTo = scrollTo

    act(() => carousel.focus())
    act(() => vi.advanceTimersByTime(2000))

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it("reduced motion では autoplay を開始しない", () => {
    vi.useFakeTimers()
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    act(() =>
      root.render(<ContentCarousel slides={slides} autoPlay={1000} />),
    )
    const carousel = container.querySelector<HTMLElement>(
      '[data-slot="content-carousel"]',
    )!
    const viewport = carousel.firstElementChild as HTMLDivElement
    const scrollTo = vi.fn()
    viewport.scrollTo = scrollTo

    act(() => vi.advanceTimersByTime(2000))

    expect(scrollTo).not.toHaveBeenCalled()
  })
})
