import { readFileSync } from "node:fs"
import { afterEach, describe, expect, it, vi } from "vitest"
import { startAnimationWithFallback } from "../src/native/modal-reveal-lifecycle"

const celebration = readFileSync("src/native/components/Celebration.tsx", "utf8")
const celebrationDialog = readFileSync(
  "src/native/components/CelebrationDialog.tsx",
  "utf8",
)

describe("native Celebration Modal lifecycle contract (#250)", () => {
  it("overlay 配置は Modal 表示完了後にカードの入口アニメーションを開始する", () => {
    expect(celebration).toContain("onShow={handleModalShow}")
    expect(celebration).toContain("revealLifecycle.onModalShow(startCardEntrance, revealCard)")
  })

  it("onShow 不達でもカードを表示する保険を張る", () => {
    expect(celebration).toContain("revealLifecycle.onOpen(revealCard)")
  })

  it("inline 配置は Modal を挟まないので即開始する", () => {
    expect(celebration).toContain("startCardEntrance(() => {})")
  })

  it("emoji bounce は完走しなかった場合に最終 scale へ復旧する", () => {
    for (const source of [celebration, celebrationDialog]) {
      expect(source).toContain("startAnimationWithFallback(")
      expect(source).toContain("() => emojiScale.setValue(1),")
    }
  })
})

describe("startAnimationWithFallback", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("完走したら保険を発火させない", () => {
    vi.useFakeTimers()
    const reveal = vi.fn()

    startAnimationWithFallback(1_000, (complete) => complete(true), reveal)
    vi.advanceTimersByTime(5_000)

    expect(reveal).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it("完了通知が来ない場合は fallbackDelay 後に最終状態へ復旧する", () => {
    vi.useFakeTimers()
    const reveal = vi.fn()

    startAnimationWithFallback(1_000, () => undefined, reveal)
    vi.advanceTimersByTime(999)
    expect(reveal).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(reveal).toHaveBeenCalledTimes(1)
  })

  it("中断された場合は直ちに復旧する", () => {
    vi.useFakeTimers()
    const reveal = vi.fn()

    startAnimationWithFallback(1_000, (complete) => complete(false), reveal)

    expect(reveal).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("cleanup 後は保険も中断復旧も走らない", () => {
    vi.useFakeTimers()
    const reveal = vi.fn()
    let complete: ((finished: boolean) => void) | undefined

    const cancel = startAnimationWithFallback(
      1_000,
      (callback) => {
        complete = callback
      },
      reveal,
    )
    cancel()
    complete?.(false)
    vi.advanceTimersByTime(5_000)

    expect(reveal).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})
