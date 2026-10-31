/**
 * @vitest-environment jsdom
 *
 * issue #802: native の Celebration / CelebrationDialog / Skeleton が OS の
 * 「視差効果を減らす」設定を見ず、紙吹雪・カードの弾み・明滅を続けていた。
 * use-reduce-motion の約束（!resolved || reduceMotion の間は演出を始めない。
 * 実行中なら止めて元の表示に戻す）に部品自身が従うことを、react-native-web で描いて確かめる。
 * OS 設定はモックで差し替え、取得前（resolved=false）も再現する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const motion = vi.hoisted(() => {
  let state = { reduceMotion: false, resolved: false }
  const listeners = new Set<() => void>()
  return {
    get: () => state,
    set(next: { reduceMotion: boolean; resolved: boolean }) {
      state = next
      listeners.forEach((fn) => fn())
    },
    subscribe(fn: () => void) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
})

vi.mock("react-native", async () => await vi.importActual("react-native-web"))
vi.mock("../src/native/components/use-reduce-motion", async () => {
  const { useSyncExternalStore } = await vi.importActual<typeof import("react")>("react")
  const useReduceMotionState = () => useSyncExternalStore(motion.subscribe, motion.get, motion.get)
  return { useReduceMotionState, useReduceMotion: () => useReduceMotionState().reduceMotion }
})

import { Animated } from "react-native"
import { Celebration } from "../src/native/components/Celebration"
import { CelebrationDialog } from "../src/native/components/CelebrationDialog"
import { Skeleton } from "../src/native/components/Skeleton"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

const TITLE = "達成しました"
const REDUCED = { reduceMotion: true, resolved: true }
const ALLOWED = { reduceMotion: false, resolved: true }
const UNRESOLVED = { reduceMotion: false, resolved: false }

let host: HTMLDivElement
let root: Root
let timing: ReturnType<typeof vi.spyOn>
let spring: ReturnType<typeof vi.spyOn>
let loop: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  vi.useFakeTimers()
  motion.set(UNRESOLVED)
  timing = vi.spyOn(Animated, "timing")
  spring = vi.spyOn(Animated, "spring")
  loop = vi.spyOn(Animated, "loop")
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function render(node: React.ReactNode) {
  act(() => root.render(<ThemeProvider>{node}</ThemeProvider>))
}

function setMotion(next: { reduceMotion: boolean; resolved: boolean }) {
  act(() => motion.set(next))
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

/** タイトルの文字を含む要素から、inline style に opacity を持つ最も近い祖先（カード）の不透明度 */
function cardOpacity(): number {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.nodeValue?.includes(TITLE)) break
  }
  let el = node?.parentElement ?? null
  while (el && !el.style.opacity) el = el.parentElement
  if (!el) throw new Error("カードの opacity が見つからない")
  return Number(el.style.opacity)
}

const PARTICLES = 6
const variants = [
  { trigger: "confetti", effect: "fall" },
  { trigger: "confetti", effect: "burst" },
  { trigger: "both", effect: "fall" },
  { trigger: "both", effect: "burst" },
] as const

describe("native Celebration: 視差効果を減らす設定に従う（#802）", () => {
  for (const placement of ["inline", "overlay"] as const) {
    for (const { trigger, effect } of variants) {
      it(`${placement} / ${trigger} / ${effect}: 設定オンでは紙吹雪もカードの弾みも始めず、カードは最終状態で見える`, () => {
        motion.set(REDUCED)
        render(
          <Celebration
            active
            placement={placement}
            trigger={trigger}
            effect={effect}
            particleCount={PARTICLES}
            title={TITLE}
          />,
        )
        expect(timing).not.toHaveBeenCalled()
        expect(spring).not.toHaveBeenCalled()
        expect(cardOpacity()).toBe(1)
      })
    }
  }

  it("設定の取得前は始めず、取得して設定オフと分かってから紙吹雪とカードの入場を始める", () => {
    render(<Celebration active placement="inline" particleCount={PARTICLES} title={TITLE} />)
    expect(timing).not.toHaveBeenCalled()
    expect(spring).not.toHaveBeenCalled()

    setMotion(ALLOWED)
    // 紙吹雪 PARTICLES 粒 + カードの不透明度 1 本
    expect(timing).toHaveBeenCalledTimes(PARTICLES + 1)
    expect(spring).toHaveBeenCalledTimes(1)
  })

  it("設定の取得前に onShow が来た overlay も、取得後に入場を始める", () => {
    render(<Celebration active placement="overlay" particleCount={PARTICLES} title={TITLE} />)
    expect(spring).not.toHaveBeenCalled()
    setMotion(ALLOWED)
    expect(spring).toHaveBeenCalledTimes(1)
  })

  it("設定を取得できないままでも、保険の時間でカードを最終状態で出す", () => {
    render(<Celebration active placement="inline" particleCount={PARTICLES} title={TITLE} />)
    advance(800)
    expect(cardOpacity()).toBe(1)
    expect(timing).not.toHaveBeenCalled()
    expect(spring).not.toHaveBeenCalled()
  })

  it("取得前に設定オンと分かったらカードは最終状態で、何も動かさない", () => {
    render(<Celebration active placement="inline" particleCount={PARTICLES} title={TITLE} />)
    setMotion(REDUCED)
    expect(cardOpacity()).toBe(1)
    expect(timing).not.toHaveBeenCalled()
    expect(spring).not.toHaveBeenCalled()
  })

  it("設定オフでは従来どおり紙吹雪とカードの入場が動く", () => {
    motion.set(ALLOWED)
    render(<Celebration active placement="inline" particleCount={PARTICLES} title={TITLE} />)
    expect(timing).toHaveBeenCalledTimes(PARTICLES + 1)
    expect(spring).toHaveBeenCalledTimes(1)
  })
})

describe("native CelebrationDialog: 視差効果を減らす設定に従う（#802）", () => {
  it("設定オンでは背面の紙吹雪を始めない", () => {
    motion.set(REDUCED)
    render(<CelebrationDialog open onOpenChange={() => {}} title={TITLE} particleCount={PARTICLES} />)
    expect(timing).not.toHaveBeenCalled()
  })

  it("設定オフでは従来どおり紙吹雪が動く", () => {
    motion.set(ALLOWED)
    render(<CelebrationDialog open onOpenChange={() => {}} title={TITLE} particleCount={PARTICLES} />)
    expect(timing.mock.calls.length).toBeGreaterThanOrEqual(PARTICLES)
  })
})

describe("native Skeleton: 視差効果を減らす設定に従う（#802）", () => {
  it("設定オンでは明滅のループを始めない", () => {
    motion.set(REDUCED)
    render(<Skeleton />)
    expect(loop).not.toHaveBeenCalled()
  })

  it("設定の取得前は始めず、設定オフと分かってから始める", () => {
    render(<Skeleton />)
    expect(loop).not.toHaveBeenCalled()
    setMotion(ALLOWED)
    expect(loop).toHaveBeenCalledTimes(1)
  })

  it("表示中に設定がオンになったらループを止める", () => {
    motion.set(ALLOWED)
    render(<Skeleton />)
    const started = loop.mock.results[0]?.value as { stop: () => void }
    const stop = vi.spyOn(started, "stop")
    setMotion(REDUCED)
    expect(stop).toHaveBeenCalled()
    expect(loop).toHaveBeenCalledTimes(1)
  })
})
