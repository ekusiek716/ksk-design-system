import { readFileSync } from "node:fs"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createRevealLifecycle } from "../src/native/modal-reveal-lifecycle"

const source = readFileSync("src/native/components/Sheet.tsx", "utf8")

const DELAYS = { animationFallbackDelay: 300, showFallbackDelay: 800 }

describe("native Sheet Modal lifecycle contract (#248 / #250)", () => {
  it("snap mode / plain mode の両方が Modal 表示完了後に入口アニメーションを開始する", () => {
    expect(source.match(/onShow=\{handleModalShow\}/g)).toHaveLength(2)
    expect(source.match(/revealLifecycle\.onModalShow\(/g)).toHaveLength(2)
  })

  it("open 検知時に onShow 不達の保険を張る", () => {
    expect(source.match(/revealLifecycle\.onOpen\(/g)).toHaveLength(2)
  })

  it("gesture の開始位置に Animated.Value の内部値 (_value) を使わない", () => {
    // native driver 実行中は内部値が更新されないため、JS 側ミラーを正本にする
    expect(source).not.toContain("_value")
    expect(source).toContain("startTYRef.current = translateYRef.current")
  })

  it("アニメーション中は gesture を受け取らない", () => {
    expect(source).toContain("animating: animatingRef.current")
  })

  it("open のたびにスクロール位置の記憶を捨てる", () => {
    expect(source).toContain("scrollTopRef.current = 0")
  })

  it("gesture から見える props は configRef 経由で最新を読む", () => {
    expect(source).toContain(
      "configRef.current = { points, minSnap, maxSnap, panelH, H, dismissible, onClose }",
    )
    expect(source).toContain("config.onClose()")
  })
})

describe("createRevealLifecycle", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("onOpen も onModalShow も呼ばれなければ何も起きない", () => {
    vi.useFakeTimers()
    createRevealLifecycle(DELAYS)

    vi.advanceTimersByTime(10_000)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("onShow が届けば入口アニメーションを開始し、show 保険を解除する", () => {
    vi.useFakeTimers()
    const lifecycle = createRevealLifecycle(DELAYS)
    const reveal = vi.fn()
    let complete: ((finished: boolean) => void) | undefined

    lifecycle.onOpen(reveal)
    vi.advanceTimersByTime(200)
    lifecycle.onModalShow((callback) => {
      complete = callback
    }, reveal)

    vi.advanceTimersByTime(299)
    expect(reveal).not.toHaveBeenCalled()

    complete?.(true)
    vi.advanceTimersByTime(10_000)
    expect(reveal).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it("onShow が届かない場合は showFallbackDelay 後に最終状態へ復旧する", () => {
    vi.useFakeTimers()
    const lifecycle = createRevealLifecycle(DELAYS)
    const reveal = vi.fn()

    lifecycle.onOpen(reveal)
    vi.advanceTimersByTime(799)
    expect(reveal).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(reveal).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("show 保険で復旧した後に onShow が来ても入口アニメーションを巻き戻さない", () => {
    vi.useFakeTimers()
    const lifecycle = createRevealLifecycle(DELAYS)
    const reveal = vi.fn()
    const startAnimation = vi.fn()

    lifecycle.onOpen(reveal)
    vi.advanceTimersByTime(800)
    lifecycle.onModalShow(startAnimation, reveal)

    expect(startAnimation).not.toHaveBeenCalled()
    expect(reveal).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("native animation が完了しない場合だけ初期 snap へ復旧する", () => {
    vi.useFakeTimers()
    const lifecycle = createRevealLifecycle(DELAYS)
    const reveal = vi.fn()

    lifecycle.onModalShow(() => undefined, reveal)
    vi.advanceTimersByTime(300)

    expect(reveal).toHaveBeenCalledTimes(1)
  })

  it("native animation が中断された場合は直ちに復旧して timer を解除する", () => {
    vi.useFakeTimers()
    const lifecycle = createRevealLifecycle(DELAYS)
    const reveal = vi.fn()
    let complete: ((finished: boolean) => void) | undefined

    lifecycle.onModalShow((callback) => {
      complete = callback
    }, reveal)
    complete?.(false)

    expect(reveal).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(300)
    expect(reveal).toHaveBeenCalledTimes(1)
  })

  it("close や unmount 相当の cancel 後は古い fallback を実行しない", () => {
    vi.useFakeTimers()
    const lifecycle = createRevealLifecycle(DELAYS)
    const reveal = vi.fn()

    lifecycle.onModalShow(() => undefined, reveal)
    lifecycle.cancel()
    vi.advanceTimersByTime(300)

    expect(reveal).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it("cancel 後は show 保険も発火しない", () => {
    vi.useFakeTimers()
    const lifecycle = createRevealLifecycle(DELAYS)
    const reveal = vi.fn()

    lifecycle.onOpen(reveal)
    lifecycle.cancel()
    vi.advanceTimersByTime(10_000)

    expect(reveal).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it("cancel 後の再 open では入口アニメーションをやり直せる", () => {
    vi.useFakeTimers()
    const lifecycle = createRevealLifecycle(DELAYS)
    const reveal = vi.fn()

    lifecycle.onOpen(reveal)
    vi.advanceTimersByTime(800)
    expect(reveal).toHaveBeenCalledTimes(1)

    // 「保険で復旧済み」状態を次の open へ持ち越さない
    lifecycle.cancel()
    lifecycle.onOpen(reveal)
    const startAnimation = vi.fn()
    lifecycle.onModalShow(startAnimation, reveal)

    expect(startAnimation).toHaveBeenCalledTimes(1)
  })
})
