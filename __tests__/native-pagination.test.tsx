/**
 * @vitest-environment jsdom
 *
 * native Pagination の並び（issue #813）。
 *
 * 前後の「…」が同じ key（ラベル "…"）だったため、前後の「…」が同時に出る中間ページを
 * 経由して先頭付近へ戻ると、React の差分計算が古い「…」を消せずに先頭側へ溜まった。
 * 静的描画（renderToStaticMarkup）では毎回作り直すので再現しない。react-dom/client で
 * 同じ root に page を変えて再描画し、実際の差分計算を通して並びを確かめる。
 * RN の host（View / Pressable / Text）だけを DOM 要素に差し替え、部品本体はそのまま動かす。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Pagination } from "../src/native/components/Pagination"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

vi.mock("react-native", async () => {
  const R = await import("react")
  type HostProps = { children?: unknown }
  return {
    View: ({ children }: HostProps) => R.createElement("div", { "data-host": "View" }, children as React.ReactNode),
    Text: ({ children }: HostProps) => R.createElement(R.Fragment, null, children as React.ReactNode),
    Pressable: ({ children }: HostProps) => {
      const kids = typeof children === "function" ? children({ pressed: false }) : children
      return R.createElement("span", { "data-host": "Pressable" }, kids as React.ReactNode)
    },
    useColorScheme: () => "light",
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: 1 }),
    StyleSheet: { create: <T,>(s: T) => s, flatten: (s: unknown) => s, hairlineWidth: 1 },
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o.ios ?? o.default },
  }
})

let container: HTMLElement
let root: Root
let errorSpy: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})

const show = (page: number, total = 20) =>
  act(() =>
    root.render(
      <ThemeProvider>
        <Pagination page={page} total={total} />
      </ThemeProvider>,
    ),
  )
const labels = () =>
  Array.from(container.querySelectorAll('[data-host="Pressable"]')).map((el) => el.textContent ?? "")
const ellipses = () => labels().filter((l) => l === "…").length
const duplicateKeyWarnings = () =>
  errorSpy.mock.calls.filter((args) => args.some((a) => typeof a === "string" && /same key/.test(a)))

/** total=20・windowSize=5 で、そのページ単独なら出るはずの「…」の数 */
const expectedEllipses = (page: number) => {
  const start = Math.max(1, Math.min(page - 2, 16))
  const end = start + 4
  return (start > 2 ? 1 : 0) + (end < 19 ? 1 : 0)
}

describe("native Pagination の並び（#813）", () => {
  it("page=1 は ‹ | 1 2 3 4 5 | … | 20 | ›", () => {
    show(1)
    expect(labels()).toEqual(["‹", "1", "2", "3", "4", "5", "…", "20", "›"])
  })

  it("前後の「…」が同時に出るページ（5・10）は「…」が 2 個で、重複 key の警告が出ない", () => {
    show(5)
    expect(ellipses()).toBe(2)
    show(10)
    expect(labels()).toEqual(["‹", "1", "…", "8", "9", "10", "11", "12", "…", "20", "›"])
    expect(duplicateKeyWarnings()).toEqual([])
  })

  it("1 → 7 → 1 と 1 ページずつ行き来しても「…」が溜まらない", () => {
    const seq = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1]
    for (const p of seq) {
      show(p)
      expect(ellipses(), `page=${p}`).toBe(expectedEllipses(p))
    }
    expect(labels()).toEqual(["‹", "1", "2", "3", "4", "5", "…", "20", "›"])
    expect(duplicateKeyWarnings()).toEqual([])
  })

  it("1 → 10 → 1 のようにジャンプしても「…」が溜まらない", () => {
    const seq = [1, 10, 3, 10, 18, 10, 20, 9, 2, 12, 1]
    for (const p of seq) {
      show(p)
      expect(ellipses(), `page=${p}`).toBe(expectedEllipses(p))
    }
    expect(labels()).toEqual(["‹", "1", "2", "3", "4", "5", "…", "20", "›"])
    expect(duplicateKeyWarnings()).toEqual([])
  })
})
