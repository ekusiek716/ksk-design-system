/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Avatar, type AvatarProps } from "../src/native/components/Avatar"

/**
 * native Avatar の fallback（issue #825）。
 *
 * source が truthy なら Image だけを返していたため、`{ uri: undefined }` / `{ uri: "" }` や
 * 読み込み失敗（404・オフライン）のとき fallback が出ず空の丸になっていた。
 * Web（Radix Avatar）と同じく、画像が得られないときは fallback を描画する。
 */
type Props = Record<string, unknown> & { children?: React.ReactNode }
const hosts = vi.hoisted(() => ({ images: [] as Props[] }))
vi.mock("react-native", async () => {
  const R = await import("react")
  return {
    View: (props: Props) => R.createElement("div", { "data-host": "view" }, props.children),
    Text: (props: Props) => R.createElement("span", null, props.children),
    Image: (props: Props) => { hosts.images.push(props); return R.createElement("img", { "data-host": "image" }) },
  }
})
vi.mock("../src/native/theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: { surface: { tertiary: "#eee" }, text: { "medium-emphasis": "#666" } },
    scales: { borderRadius: { lg: 8, xl: 12, "2xl": 16 } },
  }),
}))

let host: HTMLDivElement
let root: Root
let cleanup: (() => void) | null = null
afterEach(() => { cleanup?.(); cleanup = null; hosts.images = [] })
function mount(props: AvatarProps) {
  host = document.createElement("div"); document.body.append(host)
  root = createRoot(host)
  act(() => root.render(<Avatar {...props} />))
  cleanup = () => { act(() => root.unmount()); host.remove() }
}
const rerender = (props: AvatarProps) => act(() => root.render(<Avatar {...props} />))
const showsImage = () => host.querySelector('[data-host="image"]') !== null
const lastImage = () => hosts.images[hosts.images.length - 1]
const fail = () => act(() => { (lastImage().onError as (e: unknown) => void)({ nativeEvent: { error: "404" } }) })

describe("native Avatar の fallback（#825）", () => {
  it.each([
    ["{ uri: undefined }", { uri: undefined }],
    ['{ uri: "" }', { uri: "" }],
  ])("source=%s のとき fallback を描画する", (_label, source) => {
    mount({ source: source as AvatarProps["source"], fallback: "K" })
    expect(showsImage()).toBe(false)
    expect(host.textContent).toBe("K")
  })

  it("画像の読み込みに失敗したら fallback へ切り替わる", () => {
    mount({ source: "https://example.invalid/x.png", fallback: "K" })
    expect(showsImage()).toBe(true)
    expect(lastImage().source).toEqual({ uri: "https://example.invalid/x.png" })
    fail()
    expect(showsImage()).toBe(false)
    expect(host.textContent).toBe("K")
  })

  it("失敗後に source を差し替えると再び画像を試す", () => {
    mount({ source: { uri: "https://example.invalid/a.png" }, fallback: "K" })
    fail()
    expect(showsImage()).toBe(false)
    rerender({ source: { uri: "https://example.com/b.png" }, fallback: "K" })
    expect(showsImage()).toBe(true)
    expect(lastImage().source).toEqual({ uri: "https://example.com/b.png" })
  })

  it("A で失敗 → B → A と戻したら、A をもう一度読み込む", () => {
    mount({ source: { uri: "https://example.invalid/a.png" }, fallback: "K" })
    fail()
    rerender({ source: { uri: "https://example.com/b.png" }, fallback: "K" })
    rerender({ source: { uri: "https://example.invalid/a.png" }, fallback: "K" })
    expect(showsImage()).toBe(true)
    expect(lastImage().source).toEqual({ uri: "https://example.invalid/a.png" })
  })

  it("A で失敗 → 画像なし → A と戻しても、A をもう一度読み込む", () => {
    mount({ source: { uri: "https://example.invalid/a.png" }, fallback: "K" })
    fail()
    rerender({ source: { uri: undefined }, fallback: "K" })
    expect(showsImage()).toBe(false)
    rerender({ source: { uri: "https://example.invalid/a.png" }, fallback: "K" })
    expect(showsImage()).toBe(true)
  })

  it("同じ uri を描画し直しても失敗の記録は保たれる", () => {
    mount({ source: { uri: "https://example.invalid/a.png" }, fallback: "K" })
    fail()
    rerender({ source: { uri: "https://example.invalid/a.png" }, fallback: "K" })
    expect(showsImage()).toBe(false)
  })

  it("ReactNode の fallback も失敗時に描画する", () => {
    mount({ source: "https://example.invalid/x.png", fallback: <b>emoji</b> })
    fail()
    expect(host.querySelector("b")?.textContent).toBe("emoji")
  })

  it("正常な画像・require(...)（数値 ID）は従来どおり Image を描画する", () => {
    mount({ source: { uri: "https://example.com/ok.png" }, fallback: "K" })
    expect(showsImage()).toBe(true)
    cleanup?.(); cleanup = null
    mount({ source: 42, fallback: "K" })
    expect(showsImage()).toBe(true)
    expect(lastImage().source).toBe(42)
  })

  it("source 未指定の従来経路は変わらない（fallback 未指定なら ?）", () => {
    mount({ fallback: "K" })
    expect(host.textContent).toBe("K")
    cleanup?.(); cleanup = null
    mount({})
    expect(host.textContent).toBe("?")
  })
})
