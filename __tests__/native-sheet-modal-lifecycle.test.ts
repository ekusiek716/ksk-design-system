import { readFileSync } from "node:fs"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createSheetRevealLifecycle } from "../src/native/sheet-reveal-lifecycle"

const source = readFileSync("src/native/components/Sheet.tsx", "utf8")

describe("native Sheet snap mode Modal lifecycle (#248)", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("Modal表示完了後に入口アニメーションを開始する", () => {
    expect(source).toContain("onShow={handleModalShow}")
    expect(source).toContain("revealLifecycle.onModalShow(")
  })

  it("onShowが遅れても、その前にはfallbackを開始しない", () => {
    vi.useFakeTimers()
    const lifecycle = createSheetRevealLifecycle(300)
    const reveal = vi.fn()
    let complete: ((finished: boolean) => void) | undefined

    vi.advanceTimersByTime(1_000)
    expect(reveal).not.toHaveBeenCalled()

    lifecycle.onModalShow((callback) => {
      complete = callback
    }, reveal)
    vi.advanceTimersByTime(299)
    expect(reveal).not.toHaveBeenCalled()

    complete?.(true)
    vi.advanceTimersByTime(1)
    expect(reveal).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it("native animationが完了しない場合だけ初期snapへ復旧する", () => {
    vi.useFakeTimers()
    const lifecycle = createSheetRevealLifecycle(300)
    const reveal = vi.fn()

    lifecycle.onModalShow(() => undefined, reveal)
    vi.advanceTimersByTime(300)

    expect(reveal).toHaveBeenCalledTimes(1)
  })

  it("native animationが中断された場合は直ちに復旧してtimerを解除する", () => {
    vi.useFakeTimers()
    const lifecycle = createSheetRevealLifecycle(300)
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

  it("closeやunmount相当のcancel後は古いfallbackを実行しない", () => {
    vi.useFakeTimers()
    const lifecycle = createSheetRevealLifecycle(300)
    const reveal = vi.fn()

    lifecycle.onModalShow(() => undefined, reveal)
    lifecycle.cancel()
    vi.advanceTimersByTime(300)

    expect(reveal).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})
