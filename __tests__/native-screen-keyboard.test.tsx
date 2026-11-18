/**
 * @vitest-environment jsdom
 *
 * native の Screen（scroll）は、本文の ScrollView にキーボードの高さぶん中身を送る口が無く、
 * 画面の下半分にある入力欄に触れると欄がキーボードの下に隠れた（ぴたDIY「柱2本＋棚」の「段数」。
 * 標準の文字の大きさでも起きた。2026-11-14 のシミュレーター確認）。
 * 隣の欄では、キーボードの上の「完了」が欄の右下に重なった。
 *
 * jsdom ではキーボードもネイティブの ScrollView も動かないため、RN をモックして
 * - iOS は ScrollView に automaticallyAdjustKeyboardInsets を渡すこと
 * - キーボードが出たら、入力中の欄の下端がキーボード（上の帯を含む）の上端から 24 離れる位置まで送ること
 * - Android は本文とキーボードの重なりぶん末尾に余白を足すこと（画面が縮む環境では足さない）
 * - 本文の外の欄・avoidKeyboard={false}・scroll={false}・web では何もしないこと
 * を固定する。実機の確認手順は contracts/native-device-verification.json の keyboard 項目に置く。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

type Props = Record<string, unknown> & { children?: React.ReactNode }
type Listener = (event?: unknown) => void

const rn = vi.hoisted(() => {
  const state = {
    os: "ios" as string,
    listeners: new Map<string, Set<(event?: unknown) => void>>(),
    scrollRenders: [] as { props: Record<string, unknown>; children: unknown[] }[],
    scrollTo: [] as { y: number; animated?: boolean }[],
    keyboardVisible: false,
    keyboardMetrics: undefined as { screenY: number; height: number } | undefined,
    /** window 座標。本文（ScrollView の枠）と、中身の View の上端（= 本文の上端 − スクロール位置） */
    scroll: { y: 100, height: 700 },
    innerY: 100,
    focused: null as null | { contentY: number; height: number; inside: boolean },
  }
  const hostInner = {
    measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => cb(0, state.innerY, 402, 2000),
  }
  const hostScroll = {
    measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(0, state.scroll.y, 402, state.scroll.height),
  }
  return { state, hostInner, hostScroll }
})

vi.mock("react-native", async () => {
  const R = await import("react")
  const host = ({ children }: Props) => R.createElement(R.Fragment, null, children)
  const ScrollView = R.forwardRef(function ScrollView({ children, ...props }: Props, ref: React.Ref<unknown>) {
    R.useImperativeHandle(ref, () => ({
      scrollTo: (options: { y: number; animated?: boolean }) => rn.state.scrollTo.push(options),
      getNativeScrollRef: () => rn.hostScroll,
      getInnerViewRef: () => rn.hostInner,
    }))
    rn.state.scrollRenders.push({ props, children: R.Children.toArray(children) })
    return R.createElement(R.Fragment, null, children)
  })
  const focusedInput = {
    measureLayout: (
      relativeTo: unknown,
      onSuccess: (x: number, y: number, w: number, h: number) => void,
      onFail: () => void,
    ) => {
      const f = rn.state.focused
      if (!f || !f.inside || relativeTo !== rn.hostInner) return onFail()
      onSuccess(0, f.contentY, 300, f.height)
    },
  }
  return {
    View: host,
    Text: host,
    ScrollView,
    TextInput: { State: { currentlyFocusedInput: () => (rn.state.focused ? focusedInput : null) } },
    Keyboard: {
      addListener: (name: string, listener: Listener) => {
        const set = rn.state.listeners.get(name) ?? new Set()
        set.add(listener)
        rn.state.listeners.set(name, set)
        return { remove: () => set.delete(listener) }
      },
      isVisible: () => rn.state.keyboardVisible,
      metrics: () => rn.state.keyboardMetrics,
    },
    Platform: {
      get OS() {
        return rn.state.os
      },
    },
  }
})

import { Screen } from "../src/native/components/Screen"
import { resolveFocusedInputScrollDelta, resolveKeyboardOverlap } from "../src/native/screen-keyboard"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

let container: HTMLElement
let root: Root
let frames: FrameRequestCallback[] = []

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  Object.assign(rn.state, {
    os: "ios",
    listeners: new Map(),
    scrollRenders: [],
    scrollTo: [],
    keyboardVisible: false,
    keyboardMetrics: undefined,
    scroll: { y: 100, height: 700 },
    innerY: 100,
    focused: null,
  })
  frames = []
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb))
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    frames[id - 1] = () => {}
  })
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

const render = (node: React.ReactElement) => act(() => root.render(<ThemeProvider>{node}</ThemeProvider>))
const flushFrames = () =>
  act(() => {
    const pending = frames
    frames = []
    pending.forEach((cb) => cb(0))
  })
const emit = (name: string, event?: unknown) =>
  act(() => {
    rn.state.listeners.get(name)?.forEach((listener) => listener(event))
  })
/** 画面の下 374pt にキーボード（「完了」の帯を含む）が出た。上端は y=500 */
const showKeyboard = () => emit("keyboardDidShow", { endCoordinates: { screenY: 500, height: 374 } })
const lastScroll = () => rn.state.scrollRenders[rn.state.scrollRenders.length - 1]
/** 本文の末尾に足した余白の高さ（無ければ 0） */
const spacerHeight = () => {
  const last = lastScroll().children[lastScroll().children.length - 1] as { props?: { style?: { height?: number } } }
  return last?.props?.style?.height ?? 0
}
const listenerCount = () => [...rn.state.listeners.values()].reduce((n, set) => n + set.size, 0)

const form = (
  <>
    <p>上の欄</p>
    <p>下の欄</p>
  </>
)

describe("Screen（scroll）の既定: キーボードを避ける", () => {
  it("iOS は本文の ScrollView に automaticallyAdjustKeyboardInsets を渡し、キーボードの出入りを購読する", () => {
    render(<Screen>{form}</Screen>)
    expect(lastScroll().props.automaticallyAdjustKeyboardInsets).toBe(true)
    expect(lastScroll().props.keyboardShouldPersistTaps).toBe("handled")
    expect(rn.state.listeners.get("keyboardDidShow")?.size).toBe(1)
    expect(rn.state.listeners.get("keyboardDidHide")?.size).toBe(1)
    expect(spacerHeight()).toBe(0)
  })

  it("iOS: キーボードの下に隠れた欄を、下端がキーボードの上端から 24 上に来るまで送る", () => {
    render(<Screen>{form}</Screen>)
    // 欄は中身の 600〜644（window 700〜744）。キーボードの上端は 500
    rn.state.focused = { contentY: 600, height: 44, inside: true }
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([{ y: 744 + 24 - 500, animated: true }])
    // 最後の欄も送れるよう、キーボードが出ている間だけ末尾に 24 を足す（重なりの分は RN の inset が持つ）
    expect(spacerHeight()).toBe(24)
  })

  it("いまのスクロール位置に足して送る（中身の上端が本文より 150 上 = 150 スクロール済み）", () => {
    render(<Screen>{form}</Screen>)
    rn.state.innerY = -50
    rn.state.focused = { contentY: 700, height: 44, inside: true } // window 650〜694
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([{ y: 150 + (694 + 24 - 500), animated: true }])
  })

  it("すでにキーボードの上に見えている欄は送らない", () => {
    render(<Screen>{form}</Screen>)
    rn.state.focused = { contentY: 200, height: 44, inside: true } // window 300〜344
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
  })

  it("入力中の欄がこの本文の外（Sheet・Dialog・別画面）なら送らない", () => {
    render(<Screen>{form}</Screen>)
    rn.state.focused = { contentY: 600, height: 44, inside: false }
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
  })

  it("位置が 0 で届くキーボード（クロスフェード優先の設定）では何もしない", () => {
    render(<Screen>{form}</Screen>)
    rn.state.focused = { contentY: 600, height: 44, inside: true }
    emit("keyboardDidShow", { endCoordinates: { screenY: 0, height: 0 } })
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    expect(spacerHeight()).toBe(0)
  })

  it("キーボードが閉じたら末尾の余白を外す", () => {
    render(<Screen>{form}</Screen>)
    showKeyboard()
    flushFrames()
    expect(spacerHeight()).toBe(24)
    emit("keyboardDidHide")
    expect(spacerHeight()).toBe(0)
  })

  it("キーボードが出たまま別の欄へ移ったら（focus が本文へ伝わる）、その欄も送る", () => {
    render(<Screen>{form}</Screen>)
    rn.state.focused = { contentY: 200, height: 44, inside: true }
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    rn.state.focused = { contentY: 600, height: 44, inside: true }
    act(() => (lastScroll().props.onFocus as () => void)())
    flushFrames()
    expect(rn.state.scrollTo).toEqual([{ y: 268, animated: true }])
  })

  it("キーボードが出たまま画面に入ってきたときも避ける", () => {
    rn.state.keyboardVisible = true
    rn.state.keyboardMetrics = { screenY: 500, height: 374 }
    rn.state.focused = { contentY: 600, height: 44, inside: true }
    render(<Screen>{form}</Screen>)
    flushFrames()
    expect(rn.state.scrollTo).toEqual([{ y: 268, animated: true }])
  })

  it("外れたら購読をやめる", () => {
    render(<Screen>{form}</Screen>)
    expect(listenerCount()).toBe(2)
    act(() => root.render(<ThemeProvider>{null}</ThemeProvider>))
    expect(listenerCount()).toBe(0)
  })
})

describe("Android（edge-to-edge ではキーボードで画面が縮まない）", () => {
  beforeEach(() => {
    rn.state.os = "android"
  })

  it("automaticallyAdjustKeyboardInsets は渡さず、本文とキーボードの重なり + 24 を末尾に足して送る", () => {
    render(<Screen>{form}</Screen>)
    expect(lastScroll().props.automaticallyAdjustKeyboardInsets).toBeUndefined()
    rn.state.focused = { contentY: 600, height: 44, inside: true }
    showKeyboard()
    // 本文の下端 800、キーボードの上端 500 → 300 重なる
    expect(spacerHeight()).toBe(300 + 24)
    flushFrames()
    expect(rn.state.scrollTo).toEqual([{ y: 268, animated: true }])
  })

  it("画面が縮む環境（本文の下端がキーボードより上）では重なりを足さない（二重に送らない）", () => {
    rn.state.scroll = { y: 100, height: 400 }
    render(<Screen>{form}</Screen>)
    showKeyboard()
    expect(spacerHeight()).toBe(24)
  })

  it("キーボードが出た後に本文が縮んだら（onLayout）、重なりを測り直す", () => {
    render(<Screen>{form}</Screen>)
    showKeyboard()
    expect(spacerHeight()).toBe(324)
    rn.state.scroll = { y: 100, height: 400 }
    act(() => (lastScroll().props.onLayout as () => void)())
    expect(spacerHeight()).toBe(24)
  })

  it("同じキーボードのまま下の欄へ移ったら（keyboardDidShow は来ない）、focus で送る", () => {
    render(<Screen>{form}</Screen>)
    rn.state.focused = { contentY: 100, height: 44, inside: true }
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    rn.state.focused = { contentY: 600, height: 44, inside: true }
    act(() => (lastScroll().props.onFocus as () => void)())
    flushFrames()
    expect(rn.state.scrollTo).toEqual([{ y: 268, animated: true }])
  })
})

describe("避けないとき（従来どおり）", () => {
  it.each([["ios"], ["android"]])("%s: avoidKeyboard={false} は何も渡さず、購読もしない", (os) => {
    rn.state.os = os
    render(<Screen avoidKeyboard={false}>{form}</Screen>)
    const { props } = lastScroll()
    expect(props.automaticallyAdjustKeyboardInsets).toBeUndefined()
    expect(props.onFocus).toBeUndefined()
    expect(props.onLayout).toBeUndefined()
    expect(props.onContentSizeChange).toBeUndefined()
    expect(listenerCount()).toBe(0)
    rn.state.focused = { contentY: 600, height: 44, inside: true }
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    expect(spacerHeight()).toBe(0)
  })

  it("scroll={false} は ScrollView を作らず、購読もしない", () => {
    render(<Screen scroll={false}>{form}</Screen>)
    expect(rn.state.scrollRenders).toHaveLength(0)
    expect(listenerCount()).toBe(0)
  })

  it("web（react-native-web）はブラウザに任せ、何も渡さない", () => {
    rn.state.os = "web"
    render(<Screen>{form}</Screen>)
    expect(lastScroll().props.automaticallyAdjustKeyboardInsets).toBeUndefined()
    expect(lastScroll().props.onFocus).toBeUndefined()
    expect(listenerCount()).toBe(0)
  })
})

describe("計算（screen-keyboard）", () => {
  const scroll = { y: 100, height: 700 }
  const base = { scroll, keyboardTop: 500, gap: 24, tallInput: "leave" as const }

  it("本文とキーボードの重なり。潜っていなければ 0", () => {
    expect(resolveKeyboardOverlap(scroll, 500)).toBe(300)
    expect(resolveKeyboardOverlap({ y: 100, height: 400 }, 500)).toBe(0)
    expect(resolveKeyboardOverlap({ y: 76, height: 400 }, 500)).toBe(0)
  })

  it("キーボードの上端から gap 以内に入った欄は、gap 上まで送る", () => {
    expect(resolveFocusedInputScrollDelta({ ...base, input: { y: 440, height: 44 } })).toBe(440 + 44 + 24 - 500)
    expect(resolveFocusedInputScrollDelta({ ...base, input: { y: 432, height: 44 } })).toBe(0)
  })

  it("本文の上端より上に隠れた欄は、上端から gap 下まで戻す（負）", () => {
    expect(resolveFocusedInputScrollDelta({ ...base, input: { y: 60, height: 44 } })).toBe(60 - 24 - 100)
  })

  it("見える範囲より高い欄（複数行の長文）は、iOS では送らず、Android では上端を合わせる", () => {
    const tall = { y: 300, height: 380 }
    expect(resolveFocusedInputScrollDelta({ ...base, input: tall })).toBe(0)
    expect(resolveFocusedInputScrollDelta({ ...base, input: tall, tallInput: "align-top" })).toBe(300 - 24 - 100)
  })

  it("見える範囲が無い（キーボードが本文の上端より上）ときは送らない", () => {
    expect(resolveFocusedInputScrollDelta({ ...base, keyboardTop: 90, input: { y: 440, height: 44 } })).toBe(0)
  })
})
