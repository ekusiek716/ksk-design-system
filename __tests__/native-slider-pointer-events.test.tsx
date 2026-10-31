/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Slider } from "../src/native/components/Slider"

/**
 * native Slider のタッチ座標（issue #817）。
 *
 * RN の nativeEvent.locationX は「タッチされた一番内側の要素」の左端基準。
 * つまみ（絶対配置の 20pt の丸）がタッチ対象になると、locationX が 0〜20 になり
 * 値が最小値付近へ飛んでいた。子 View（溝・塗り・つまみ）を pointerEvents="none" に
 * して、タッチ対象を常に外側コンテナへそろえる。
 */
type ViewProps = Record<string, unknown> & { children?: React.ReactNode }
const hosts = vi.hoisted(() => ({ views: [] as ViewProps[] }))
vi.mock("react-native", async () => {
  const R = await import("react")
  return {
    View: (props: ViewProps) => {
      hosts.views.push(props)
      return R.createElement("div", null, props.children)
    },
  }
})
vi.mock("../src/native/theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: { surface: { tertiary: "#eee", primary: "#fff" }, brand: { primary: "#00f" } },
    scales: { borderRadius: { full: 9999 } },
  }),
}))

let cleanup: (() => void) | null = null
afterEach(() => { cleanup?.(); cleanup = null; hosts.views = [] })

function mount(ui: React.ReactElement) {
  const host = document.createElement("div"); document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(ui))
  cleanup = () => { act(() => root.unmount()); host.remove() }
  return root
}

/** 直近 1 回分の render の View（外側 + 子 3 つ）。 */
const lastRender = () => hosts.views.slice(-4)
const layout = (width: number) => ({ nativeEvent: { layout: { width } } })
const touch = (locationX: number) => ({ nativeEvent: { locationX } })

describe("native Slider のタッチ対象（#817）", () => {
  it("溝・塗り・つまみは pointerEvents=none で、外側だけが responder を持つ", () => {
    mount(<Slider value={50} />)
    const [outer, ...children] = lastRender()
    expect(outer.onStartShouldSetResponder).toBeTypeOf("function")
    expect(outer.onResponderGrant).toBeTypeOf("function")
    expect(outer.pointerEvents).toBeUndefined()
    expect(children).toHaveLength(3)
    for (const child of children) {
      expect(child.pointerEvents).toBe("none")
      expect(child.onStartShouldSetResponder).toBeUndefined()
    }
  })

  it("つまみの中心を押しても値は変わらず、ドラッグで指に追従する", () => {
    const onChange = vi.fn()
    mount(<Slider value={50} onChange={onChange} />)
    act(() => { (lastRender()[0].onLayout as (e: unknown) => void)(layout(300)) })
    const outer = lastRender()[0]
    // コンテナ基準ではつまみの中心は 150。
    act(() => { (outer.onResponderGrant as (e: unknown) => void)(touch(150)) })
    expect(onChange).toHaveBeenLastCalledWith(50)
    act(() => { (outer.onResponderMove as (e: unknown) => void)(touch(240)) })
    expect(onChange).toHaveBeenLastCalledWith(80)
  })

  it("幅が測れる前のタッチでは onChange を呼ばない", () => {
    const onChange = vi.fn()
    mount(<Slider value={50} onChange={onChange} />)
    act(() => { (lastRender()[0].onResponderGrant as (e: unknown) => void)(touch(10)) })
    expect(onChange).not.toHaveBeenCalled()
  })

  it("min === max でもつまみの位置が NaN にならない", () => {
    mount(<Slider value={5} min={5} max={5} />)
    act(() => { (lastRender()[0].onLayout as (e: unknown) => void)(layout(300)) })
    const thumb = lastRender()[3].style as { left: number }
    expect(Number.isNaN(thumb.left)).toBe(false)
  })
})
