import { describe, expect, it, afterEach } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import { userEvent } from "vitest/browser"
import { ImageOverlayAction } from "@/components/patterns/image-overlay-action"
import { MediaActionCluster } from "@/components/patterns/media-action-cluster"
import { BottomTabBar } from "@/components/patterns/commerce/bottom-tab-bar"
import { ImageGallery } from "@/components/ui/image-gallery"
import { ProductCard } from "@/components/patterns/commerce/product-card"
import { BannerCarousel } from "@/components/patterns/banner-carousel"
import "@/index.css"

/**
 * 写真・ガラス・任意色の上に乗る操作子のフォーカスリングは、単色の Focus リングではなく
 * 背景に依存しない二重リング（内側 2px 白 + 外側 2px Gray-900）にする。
 * 任意の下地で max(c/白, c/濃色) が 4.21:1 以上になる（数値の検査は scripts/check-contrast.mjs）。
 *
 * ここでは「実ブラウザで実際にその box-shadow が描かれるか」を computed style で固定する。
 * - 外側リング（OVERLAY_FOCUS_RING）: ring-2 + ring-offset-2 → 白 2px の内側 + Gray-900 4px の外側
 * - 内側リング（OVERLAY_FOCUS_RING_INSET）: overflow:hidden の親の中・面全体を覆う操作子用
 * 色は Primitive の白 (255,255,255) / Gray-900 (24,24,27) 固定で、ライト / ダークで変えない。
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(() => {
  document.documentElement.classList.remove("dark")
  if (root) {
    act(() => root!.unmount())
    root = undefined
  }
  container?.remove()
  container = undefined
})

function mount(node: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(node)
  })
}

const OUTER_WHITE = "rgb(255, 255, 255) 0px 0px 0px 2px"
const OUTER_DARK = "rgb(24, 24, 27) 0px 0px 0px 4px"
const INSET_DARK = "rgb(24, 24, 27) 0px 0px 0px 2px inset"
const INSET_WHITE = "rgb(255, 255, 255) 0px 0px 0px 4px inset"

function expectOuterRing(el: Element) {
  const shadow = getComputedStyle(el).boxShadow
  expect(shadow).toContain(OUTER_WHITE)
  expect(shadow).toContain(OUTER_DARK)
  // 単色の Focus リング（Brand-600 = rgb(37, 99, 235)）は残っていない
  expect(shadow).not.toContain("rgb(37, 99, 235)")
}

function expectInsetRing(el: Element) {
  const shadow = getComputedStyle(el).boxShadow
  expect(shadow).toContain(INSET_DARK)
  expect(shadow).toContain(INSET_WHITE)
  expect(shadow).not.toContain("rgb(37, 99, 235)")
}

describe("写真の上の操作子は二重リング（外側）", () => {
  it("ImageOverlayAction", async () => {
    mount(<ImageOverlayAction aria-label="お気に入りに追加" icon={<span />} placement="none" />)
    const button = container!.querySelector("button")!
    await userEvent.tab()
    expect(document.activeElement).toBe(button)
    expectOuterRing(button)
  })

  it("ImageOverlayAction はダークテーマでも同じ色（反転しない）", async () => {
    document.documentElement.classList.add("dark")
    mount(<ImageOverlayAction aria-label="お気に入りに追加" icon={<span />} placement="none" />)
    const button = container!.querySelector("button")!
    await userEvent.tab()
    expect(document.activeElement).toBe(button)
    expectOuterRing(button)
  })

  it("MediaActionCluster の項目", async () => {
    mount(
      <MediaActionCluster
        position="absolute"
        items={[{ id: "like", label: "いいね", icon: <span />, onClick: () => {} }]}
      />,
    )
    const item = container!.querySelector<HTMLElement>("button")!
    await userEvent.tab()
    expect(document.activeElement).toBe(item)
    expectOuterRing(item)
  })

  it("ImageGallery の前後の矢印（写真の上）", async () => {
    mount(
      <ImageGallery
        images={[
          { src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=", alt: "a" },
          { src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=", alt: "b" },
        ]}
      />,
    )
    // 先頭の画像では「前」が disabled。「次」へフォーカスが来る
    const next = container!.querySelector<HTMLElement>('button[aria-label="次の画像"]')!
    await userEvent.tab()
    expect(document.activeElement).toBe(next)
    expectOuterRing(next)
  })
})

describe("面全体を覆う・pill の中の操作子は二重リング（内側）", () => {
  it("ImageGallery の画像全面ボタン（overflow:hidden の枠の中）", async () => {
    mount(
      <ImageGallery
        images={[{ src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=", alt: "a" }]}
        onImageClick={() => {}}
      />,
    )
    const cover = container!.querySelector<HTMLElement>("button")!
    await userEvent.tab()
    expect(document.activeElement).toBe(cover)
    expectInsetRing(cover)
  })

  it("BottomTabBar のタブ（pill は overflow:hidden）", async () => {
    mount(
      <BottomTabBar
        variant="pill"
        pillPosition="absolute"
        items={[
          { label: "ホーム", icon: <span />, onClick: () => {}, tabKey: "home" },
          { label: "検索", icon: <span />, onClick: () => {}, tabKey: "search" },
        ]}
      />,
    )
    const tab = container!.querySelector<HTMLElement>('[data-tab-key="home"]')!
    await userEvent.tab()
    expect(document.activeElement).toBe(tab)
    expectInsetRing(tab)
    // 内側リングは pill の縁で切られない（要素の内側に描くため、外側へは 1px もはみ出さない）
    expect(getComputedStyle(tab).boxShadow).not.toContain(OUTER_DARK)
  })
})

describe("商品カードのお気に入りボタン・バナー項目（写真・グラデーションの上）", () => {
  const IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACw="

  it("ProductCard 縦: お気に入りは外側の二重リング（画像枠の外・角から 6px）", async () => {
    mount(<ProductCard name="商品" imageUrl={IMG} price={1000} onFavoriteToggle={() => {}} />)
    const fav = container!.querySelector<HTMLElement>('button[aria-label="お気に入りに追加"]')!
    await userEvent.tab()
    expect(document.activeElement).toBe(fav)
    expectOuterRing(fav)
  })

  it("ProductCard 横: お気に入りは内側の二重リング（overflow-hidden の画像枠の中）", async () => {
    mount(
      <ProductCard
        orientation="horizontal"
        name="商品"
        imageUrl={IMG}
        price={1000}
        onFavoriteToggle={() => {}}
      />,
    )
    const fav = container!.querySelector<HTMLElement>('button[aria-label="お気に入りに追加"]')!
    await userEvent.tab()
    expect(document.activeElement).toBe(fav)
    expectInsetRing(fav)
  })

  it("BannerCarousel: 画像バナー項目は ::after に内側の二重リング（画像が自身の inset 影を隠すため）", async () => {
    mount(<BannerCarousel items={[{ imageSrc: IMG, caption: "キャンペーン", onClick: () => {} }]} />)
    const item = container!.querySelector<HTMLElement>("button")!
    await userEvent.tab() // 先頭はスクロール枠（tabIndex=0）
    await userEvent.tab()
    expect(document.activeElement).toBe(item)
    const after = getComputedStyle(item, "::after")
    expect(after.boxShadow).toContain(INSET_DARK)
    expect(after.boxShadow).toContain(INSET_WHITE)
    // 覆いはクリックを奪わず、項目全面を覆う
    expect(after.pointerEvents).toBe("none")
    expect(after.position).toBe("absolute")
  })

  it("BannerCarousel: グラデーション背景の項目（a）も同じ", async () => {
    mount(
      <BannerCarousel
        items={[{ gradient: "linear-gradient(135deg, #ff0, #f0f)", caption: "特集", href: "#a" }]}
      />,
    )
    const item = container!.querySelector<HTMLElement>("a")!
    await userEvent.tab()
    await userEvent.tab()
    expect(document.activeElement).toBe(item)
    expect(getComputedStyle(item, "::after").boxShadow).toContain(INSET_DARK)
  })
})
