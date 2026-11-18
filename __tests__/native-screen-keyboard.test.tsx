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
/** 入力中の欄。contentY は中身の View からの位置。windowY を省くと「中身の View の window 位置 + contentY」 */
type Focused = { contentY: number; height: number; inside: boolean; windowY?: number }

const rn = vi.hoisted(() => {
  const state = {
    os: "ios" as string,
    listeners: new Map<string, Set<(event?: unknown) => void>>(),
    scrollRenders: [] as { props: Record<string, unknown> }[],
    scrollTo: [] as { y: number; animated?: boolean }[],
    keyboardVisible: false,
    keyboardMetrics: undefined as { screenY: number; height: number } | undefined,
    /** window 座標。本文（ScrollView の枠）と、中身の View の上端（= 本文の上端 − スクロール位置） */
    scroll: { y: 100, height: 700 },
    innerY: 100,
    focused: null as null | { contentY: number; height: number; inside: boolean; windowY?: number },
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
    rn.state.scrollRenders.push({ props })
    return R.createElement(R.Fragment, null, children)
  })
  const focusedInput = {
    // RN は途中に Modal があると Modal を境に計算を打ち切り、Modal の中での位置を「成功」で返す。
    // 別画面など子孫でない欄だけ onFail になる
    measureLayout: (
      relativeTo: unknown,
      onSuccess: (x: number, y: number, w: number, h: number) => void,
      onFail: () => void,
    ) => {
      const f = rn.state.focused
      if (!f || !f.inside || relativeTo !== rn.hostInner) return onFail()
      onSuccess(0, f.contentY, 300, f.height)
    },
    measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => {
      const f = rn.state.focused!
      cb(24, f.windowY ?? rn.state.innerY + f.contentY, 300, f.height)
    },
  }
  type StyleValue = Record<string, unknown> | null | undefined | false | StyleValue[]
  const flatten = (style: StyleValue): Record<string, unknown> =>
    Array.isArray(style) ? Object.assign({}, ...style.map(flatten)) : style ? { ...style } : {}
  return {
    View: host,
    Text: host,
    ScrollView,
    StyleSheet: { flatten },
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
import {
  isInsideScrollContent,
  resolveFocusedInputScrollDelta,
  resolveKeyboardOverlap,
  resolveKeyboardPaddingBottom,
} from "../src/native/screen-keyboard"
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
const focus = (f: Focused | null) => {
  rn.state.focused = f
}
const lastScroll = () => rn.state.scrollRenders[rn.state.scrollRenders.length - 1]
const handler = (name: string) => () => act(() => (lastScroll().props[name] as () => void)())
/** 本文の中身の下の余白（Yoga と同じ優先順） */
const contentPaddingBottom = () => {
  const flat = [lastScroll().props.contentContainerStyle].flat(Infinity).reduce<Record<string, unknown>>(
    (acc, s) => (s && typeof s === "object" ? { ...acc, ...(s as Record<string, unknown>) } : acc),
    {},
  )
  return (flat.paddingBottom ?? flat.paddingVertical ?? flat.padding ?? 0) as number
}
const listenerCount = () => [...rn.state.listeners.values()].reduce((n, set) => n + set.size, 0)

const form = (
  <>
    <p>上の欄</p>
    <p>下の欄</p>
  </>
)
/** 中身の 600〜644（window 700〜744）。キーボードの上端 500 の下に隠れる */
const lowerField: Focused = { contentY: 600, height: 44, inside: true }
/** 中身の 200〜244（window 300〜344）。キーボードの上に見えている */
const upperField: Focused = { contentY: 200, height: 44, inside: true }
const REVEAL_LOWER = { y: 744 + 24 - 500, animated: true }

describe("Screen（scroll）の既定: キーボードを避ける（iOS）", () => {
  it("本文の ScrollView に automaticallyAdjustKeyboardInsets を渡し、キーボードの出入りを購読する", () => {
    render(<Screen>{form}</Screen>)
    expect(lastScroll().props.automaticallyAdjustKeyboardInsets).toBe(true)
    expect(lastScroll().props.keyboardShouldPersistTaps).toBe("handled")
    expect(rn.state.listeners.get("keyboardDidShow")?.size).toBe(1)
    expect(rn.state.listeners.get("keyboardDidHide")?.size).toBe(1)
  })

  it("キーボードの下に隠れた欄を、下端がキーボードの上端から 24 上に来るまで送る", () => {
    render(<Screen>{form}</Screen>)
    focus(lowerField)
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([REVEAL_LOWER])
    // 既定の余白（page = 24）で最後の欄まで届くので、下の余白は変えない（重なりの分は RN の inset が持つ）
    expect(contentPaddingBottom()).toBe(24)
  })

  it("いまのスクロール位置に足して送る（中身の上端が本文より 150 上 = 150 スクロール済み）", () => {
    render(<Screen>{form}</Screen>)
    rn.state.innerY = -50
    focus({ contentY: 700, height: 44, inside: true }) // window 650〜694
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([{ y: 150 + (694 + 24 - 500), animated: true }])
  })

  it("すでにキーボードの上に見えている欄は送らない", () => {
    render(<Screen>{form}</Screen>)
    focus(upperField)
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
  })

  it("padding=\"none\" でも、最後の欄を送れるよう、キーボードが出ている間だけ下の余白を 24 にする", () => {
    render(<Screen padding="none">{form}</Screen>)
    expect(contentPaddingBottom()).toBe(0)
    focus(lowerField)
    showKeyboard()
    flushFrames()
    expect(contentPaddingBottom()).toBe(24)
    emit("keyboardDidHide")
    expect(contentPaddingBottom()).toBe(0)
  })

  it("利用側の contentContainerStyle の下の余白は残す（小さければ 24 まで広げ、大きければそのまま）", () => {
    render(<Screen padding="none" contentContainerStyle={{ gap: 16, paddingBottom: 8 }}>{form}</Screen>)
    focus(lowerField)
    showKeyboard()
    flushFrames()
    expect(contentPaddingBottom()).toBe(24)

    render(<Screen padding="none" contentContainerStyle={{ paddingBottom: 40 }}>{form}</Screen>)
    flushFrames()
    expect(contentPaddingBottom()).toBe(40)
  })

  it("別の画面など、本文の外の欄では送らず、余白も足さない", () => {
    render(<Screen padding="none">{form}</Screen>)
    focus({ ...lowerField, inside: false })
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    expect(contentPaddingBottom()).toBe(0)
  })

  it("children の中に置いた Sheet・Dialog（RN の Modal）の欄では送らない（位置が Modal 基準で返るため）", () => {
    render(<Screen padding="none">{form}</Screen>)
    // RN は Modal を境に計算を打ち切り、Modal の中での位置（600）を返す。本当の window 位置も 600
    focus({ contentY: 600, height: 44, inside: true, windowY: 600 })
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    expect(contentPaddingBottom()).toBe(0)
  })

  it("位置が 0 で届くキーボード（クロスフェード優先の設定）では何もしない", () => {
    render(<Screen padding="none">{form}</Screen>)
    focus(lowerField)
    emit("keyboardDidShow", { endCoordinates: { screenY: 0, height: 0 } })
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    expect(contentPaddingBottom()).toBe(0)
  })

  it("キーボードが出たまま別の欄へ移ったら（focus が本文へ伝わる）、その欄も送る", () => {
    render(<Screen>{form}</Screen>)
    focus(upperField)
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    focus(lowerField)
    handler("onFocus")()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([REVEAL_LOWER])
  })

  it("指で本文を動かした後は、中身の高さが変わっても欄へ引き戻さない（次に欄へ入ったら送る）", () => {
    render(<Screen>{form}</Screen>)
    focus(upperField)
    showKeyboard()
    flushFrames()
    handler("onScrollBeginDrag")()
    focus(lowerField) // 指で動かした結果、欄がキーボードの下へ
    handler("onContentSizeChange")()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    handler("onFocus")()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([REVEAL_LOWER])
  })

  it("入力で中身の高さが変わったら（指で動かしていなければ）、入力中の欄を見える位置に保つ", () => {
    render(<Screen>{form}</Screen>)
    focus(upperField)
    showKeyboard()
    flushFrames()
    focus(lowerField) // 上にエラー文が出て欄が下がった
    handler("onContentSizeChange")()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([REVEAL_LOWER])
  })

  it("キーボードが出たまま画面に入ってきたときも避ける", () => {
    rn.state.keyboardVisible = true
    rn.state.keyboardMetrics = { screenY: 500, height: 374 }
    focus(lowerField)
    render(<Screen>{form}</Screen>)
    flushFrames()
    expect(rn.state.scrollTo).toEqual([REVEAL_LOWER])
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

  it("automaticallyAdjustKeyboardInsets は渡さず、本文とキーボードの重なりぶん下の余白を足して送る", () => {
    render(<Screen>{form}</Screen>)
    expect(lastScroll().props.automaticallyAdjustKeyboardInsets).toBeUndefined()
    focus(lowerField)
    showKeyboard()
    flushFrames()
    // 本文の下端 800、キーボードの上端 500 → 300 重なる。page の余白 24 に足す
    expect(contentPaddingBottom()).toBe(24 + 300)
    expect(rn.state.scrollTo).toEqual([REVEAL_LOWER])
    // 余白を足した後の中身の高さの変化でも送り直す（足す前は送り先まで届かないため）
    handler("onContentSizeChange")()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([REVEAL_LOWER, REVEAL_LOWER])
    emit("keyboardDidHide")
    expect(contentPaddingBottom()).toBe(24)
  })

  it("画面が縮む環境（本文の下端がキーボードより上）では重なりを足さない（二重に送らない）", () => {
    rn.state.scroll = { y: 100, height: 400 }
    render(<Screen>{form}</Screen>)
    focus(upperField)
    showKeyboard()
    flushFrames()
    expect(contentPaddingBottom()).toBe(24)
  })

  it("キーボードが出た後に本文が縮んだら（onLayout）、重なりを測り直す", () => {
    render(<Screen>{form}</Screen>)
    focus(upperField)
    showKeyboard()
    flushFrames()
    expect(contentPaddingBottom()).toBe(324)
    rn.state.scroll = { y: 100, height: 400 }
    handler("onLayout")()
    expect(contentPaddingBottom()).toBe(24)
  })

  it("同じキーボードのまま下の欄へ移ったら（keyboardDidShow は来ない）、focus で送る", () => {
    render(<Screen>{form}</Screen>)
    focus({ contentY: 100, height: 44, inside: true })
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    focus(lowerField)
    handler("onFocus")()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([REVEAL_LOWER])
  })

  it("本文の外（Sheet 等）の欄でキーボードが出ても、重なりの余白は足さない", () => {
    render(<Screen>{form}</Screen>)
    focus({ ...lowerField, inside: false })
    showKeyboard()
    flushFrames()
    expect(contentPaddingBottom()).toBe(24)
    expect(rn.state.scrollTo).toEqual([])
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
    expect(props.onScrollBeginDrag).toBeUndefined()
    expect(listenerCount()).toBe(0)
    focus(lowerField)
    showKeyboard()
    flushFrames()
    expect(rn.state.scrollTo).toEqual([])
    expect(contentPaddingBottom()).toBe(24)
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

  it("本文の欄かどうか: window 位置が「中身の View の位置 + 相対位置」と 1 以内で一致するとき", () => {
    expect(isInsideScrollContent(700, 100, 600)).toBe(true)
    expect(isInsideScrollContent(700.5, 100, 600)).toBe(true)
    expect(isInsideScrollContent(600, 100, 600)).toBe(false)
  })

  it("キーボードが出ている間の下の余白: 元の余白と gap の大きい方 + 重なり", () => {
    expect(resolveKeyboardPaddingBottom(24, 24, 0)).toBe(24)
    expect(resolveKeyboardPaddingBottom(0, 24, 0)).toBe(24)
    expect(resolveKeyboardPaddingBottom(40, 24, 300)).toBe(340)
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
