/**
 * @vitest-environment jsdom
 *
 * Screen の上端 safe-area・高さ・PC の中央カード・ランドマーク（issue #701）。
 * jsdom は Tailwind を解決しないため、クラス文字列と DOM 構造の contract テストとして行う。
 * 既定（何も渡さない）の DOM が従来と同じであることも固定する。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Screen } from "../src/components/patterns/screen"

const render = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host
}
const SAFE_TOP = "pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]"

describe("Screen 既定は従来どおり（#701 の後方互換）", () => {
  it("h-[100dvh]・main#main-content・スキップリンク・背景ラッパー無し・safe-area 無し", () => {
    const host = render(<Screen header={<p>h</p>}>本文</Screen>)
    const screen = host.firstElementChild as HTMLElement
    expect(screen.dataset.slot).toBe("screen")
    expect(screen.className).toContain("h-[100dvh]")
    expect(screen.className).not.toContain("md:rounded-2xl")
    const main = host.querySelector("main")!
    expect(main.id).toBe("main-content")
    expect(main.getAttribute("tabindex")).toBe("-1")
    expect(host.querySelector('a[href="#main-content"]')).not.toBeNull()
    expect(host.querySelector('[data-slot="screen-header"]')!.className).not.toContain(SAFE_TOP)
    expect(host.querySelector('[data-slot="screen-backdrop"]')).toBeNull()
  })
})

describe("safeAreaTop（#701）", () => {
  it("header があれば header に上端 safe-area の余白を付ける", () => {
    const host = render(<Screen safeAreaTop header={<p>h</p>}>本文</Screen>)
    expect(host.querySelector('[data-slot="screen-header"]')!.className).toContain(SAFE_TOP)
    expect((host.querySelector('[data-slot="screen"]') as HTMLElement).className).not.toContain(SAFE_TOP)
  })
  it("header が無ければ画面の上端に付ける", () => {
    const host = render(<Screen safeAreaTop>本文</Screen>)
    expect((host.querySelector('[data-slot="screen"]') as HTMLElement).className).toContain(SAFE_TOP)
  })
  it("PC の中央カードでは md 以上で 0 に戻す", () => {
    const host = render(<Screen safeAreaTop desktopLayout="card" header={<p>h</p>}>本文</Screen>)
    expect(host.querySelector('[data-slot="screen-header"]')!.className).toContain("md:pt-0")
  })
})

describe("height（#701）", () => {
  it.each([
    ["svh", "h-[100svh]"],
    ["fill", "h-full"],
  ] as const)("%s は %s", (height, cls) => {
    const screen = render(<Screen height={height}>本文</Screen>).querySelector<HTMLElement>('[data-slot="screen"]')!
    expect(screen.className.split(" ")).toContain(cls)
    expect(screen.className).not.toContain("h-[100dvh]")
    expect(screen.dataset.height).toBe(height)
  })
})

describe("desktopLayout=\"card\"（#701）", () => {
  it("背景ラッパーの中に、md 以上で枠・角丸のカードとして置く", () => {
    const host = render(<Screen desktopLayout="card">本文</Screen>)
    const backdrop = host.querySelector<HTMLElement>('[data-slot="screen-backdrop"]')!
    expect(backdrop.className).toContain("md:bg-[var(--Surface-Secondary)]")
    expect(backdrop.className).toContain("md:items-center")
    const screen = backdrop.querySelector<HTMLElement>('[data-slot="screen"]')!
    expect(screen.dataset.desktopLayout).toBe("card")
    expect(screen.className).toContain("md:max-w-[var(--ksk-screen-card-max-width,30rem)]")
    expect(screen.className).toContain("md:h-[min(var(--ksk-screen-card-max-height,47.5rem),calc(100dvh_-_4rem))]")
    expect(screen.className).toContain("md:border")
    // 未指定なら inline の変数は出さない（フォールバックの既定値が効く）
    expect(screen.getAttribute("style") ?? "").not.toContain("--ksk-screen-card")
  })
  it("height=\"fill\" はラッパーにも h-full を付け、md 未満で親の高さを伝える", () => {
    const backdrop = render(<Screen desktopLayout="card" height="fill">本文</Screen>).querySelector<HTMLElement>(
      '[data-slot="screen-backdrop"]',
    )!
    expect(backdrop.className.split(" ")).toContain("h-full")
    const screen = backdrop.querySelector<HTMLElement>('[data-slot="screen"]')!
    expect(screen.className.split(" ")).toContain("h-full")
    // 既定（dvh）のラッパーは高さを持たない（中の 100dvh がそのまま効く）
    const dvh = render(<Screen desktopLayout="card">本文</Screen>).querySelector<HTMLElement>('[data-slot="screen-backdrop"]')!
    expect(dvh.className.split(" ")).not.toContain("h-full")
  })

  it("fill の card は viewport の最小高さ・固定高さを使わず親の高さを継承する", () => {
    const host = render(<Screen desktopLayout="card" height="fill">本文</Screen>)
    const backdrop = host.querySelector<HTMLElement>('[data-slot="screen-backdrop"]')!
    const screen = host.querySelector<HTMLElement>('[data-slot="screen"]')!
    expect(backdrop.className).not.toContain("100dvh")
    expect(backdrop.className).not.toContain("md:p-8")
    expect(screen.className).toContain("md:h-full")
    expect(screen.className).toContain("md:max-h-[var(--ksk-screen-card-max-height,47.5rem)]")
    expect(screen.className).not.toContain("calc(100dvh")
  })

  it("svh card は中央カードと背景も小さい viewport の高さを維持する", () => {
    const host = render(<Screen desktopLayout="card" height="svh">本文</Screen>)
    const backdrop = host.querySelector<HTMLElement>('[data-slot="screen-backdrop"]')!
    const screen = host.querySelector<HTMLElement>('[data-slot="screen"]')!
    expect(backdrop.className).toContain("md:min-h-[100svh]")
    expect(screen.className).toContain("md:h-[min(var(--ksk-screen-card-max-height,47.5rem),calc(100svh_-_4rem))]")
    expect(backdrop.className).not.toContain("100dvh")
    expect(screen.className).not.toContain("100dvh")
  })

  it("cardMaxWidth / cardMaxHeight を inline の変数で渡す", () => {
    const screen = render(
      <Screen desktopLayout="card" cardMaxWidth="32rem" cardMaxHeight="44rem">本文</Screen>,
    ).querySelector<HTMLElement>('[data-slot="screen"]')!
    const style = screen.getAttribute("style") ?? ""
    expect(style).toContain("--ksk-screen-card-max-width:32rem")
    expect(style).toContain("--ksk-screen-card-max-height:44rem")
  })
})

describe("landmark=\"none\"（#701）", () => {
  it("本文を div にし、id・tabIndex・スキップリンクを既定で付けない", () => {
    const host = render(<Screen landmark="none">本文</Screen>)
    expect(host.querySelector("main")).toBeNull()
    const body = host.querySelector<HTMLElement>('[data-slot="screen-body"]')!
    expect(body.tagName).toBe("DIV")
    expect(body.hasAttribute("id")).toBe(false)
    expect(body.hasAttribute("tabindex")).toBe(false)
    expect(host.querySelector("a")).toBeNull()
  })
  it("mainId と skipLink を明示すれば出せる", () => {
    const host = render(<Screen landmark="none" mainId="step-body" skipLink>本文</Screen>)
    expect(host.querySelector<HTMLElement>('[data-slot="screen-body"]')!.id).toBe("step-body")
    expect(host.querySelector('a[href="#step-body"]')).not.toBeNull()
  })
})
