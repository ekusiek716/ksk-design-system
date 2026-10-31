/**
 * issue #816: native の Select / DropdownFilter は、通常版 Sheet の中に全 options を素の View で
 * 並べるだけで、高さの上限もスクロールも持っていなかった。選択肢が画面に収まらない数になると、
 * パネルが画面の上へはみ出し、見出しや先頭の選択肢（DropdownFilter の「すべて」を含む）を
 * 押せず、スクロールもできなかった。
 * 一覧を ScrollView で包み、「画面高 × 0.6 − safe-area 上下」の maxHeight を付けることを固定する。
 * 少ないときは maxHeight が上限になるだけで、固定の高さは付けない（内容の高さに合う）。
 */
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

type HostProps = Record<string, unknown> & { children?: React.ReactNode }
type Rec = { host: string; props: HostProps; text: unknown; parent: Rec | null }
const hosts = vi.hoisted(() => ({ records: [] as Rec[], height: 667 }))
vi.mock("react-native", async () => {
  const R = await import("react")
  const Parent = R.createContext<Rec | null>(null)
  const host = (name: string) => ({ children, ...props }: HostProps) => {
    const rec: Rec = { host: name, props, text: children, parent: R.useContext(Parent) }
    hosts.records.push(rec)
    return R.createElement(Parent.Provider, { value: rec }, children)
  }
  return {
    View: host("View"),
    Text: host("Text"),
    Pressable: host("Pressable"),
    ScrollView: host("ScrollView"),
    useWindowDimensions: () => ({ width: 375, height: hosts.height, scale: 2, fontScale: 1 }),
  }
})
// Sheet は Modal / Animated を使うため、中身をそのまま描く代用品にする（open に関係なく描く）
vi.mock("../src/native/components/Sheet", () => ({
  Sheet: ({ children }: { children?: React.ReactNode }) => children,
}))

import { DropdownFilter } from "../src/native/components/DropdownFilter"
import { Select } from "../src/native/components/Select"
import {
  SHEET_LIST_MAX_HEIGHT_RATIO,
  SHEET_LIST_MIN_HEIGHT,
  resolveSheetListMaxHeight,
} from "../src/native/sheet-list-max-height"
import { SafeAreaInsetsProvider } from "../src/native/theme/SafeAreaInsetsProvider"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import type { SafeAreaInsets } from "../src/native/safe-area"

const prefectures = Array.from({ length: 47 }, (_, i) => ({ value: String(i), label: `都道府県${i}` }))
const few = prefectures.slice(0, 3)

beforeEach(() => {
  hosts.records = []
  hosts.height = 667
})

function render(node: React.ReactElement, insets?: SafeAreaInsets) {
  renderToStaticMarkup(
    <ThemeProvider>
      <SafeAreaInsetsProvider insets={insets}>{node}</SafeAreaInsetsProvider>
    </ThemeProvider>,
  )
}

const flatten = (style: unknown): Record<string, unknown> =>
  Array.isArray(style) ? Object.assign({}, ...style.map(flatten)) : ((style as Record<string, unknown>) ?? {})
const scrollViews = () => hosts.records.filter((r) => r.host === "ScrollView")
const isInside = (r: Rec, ancestor: Rec) => {
  for (let p = r.parent; p; p = p.parent) if (p === ancestor) return true
  return false
}
/** 選択肢の文字（Text）が、ScrollView の中に描かれているか */
const labelInsideScroll = (label: string, scroll: Rec) =>
  hosts.records.some((r) => r.host === "Text" && r.text === label && isInside(r, scroll))

describe("resolveSheetListMaxHeight (#816)", () => {
  it("画面高 × 0.6 から safe-area の上下を引いた値", () => {
    expect(SHEET_LIST_MAX_HEIGHT_RATIO).toBe(0.6)
    expect(resolveSheetListMaxHeight(667, null)).toBe(Math.floor(667 * 0.6))
    expect(resolveSheetListMaxHeight(874, { top: 62, bottom: 34 })).toBe(Math.floor(874 * 0.6 - 96))
  })

  it("小さすぎる画面・寸法が 0 の瞬間（RN-web の初回描画）でも下限を下回らない", () => {
    expect(resolveSheetListMaxHeight(0, null)).toBe(SHEET_LIST_MIN_HEIGHT)
    expect(resolveSheetListMaxHeight(320, { top: 50, bottom: 50 })).toBe(SHEET_LIST_MIN_HEIGHT)
  })

  it("不正な inset（負値・非有限）は 0 として扱う", () => {
    expect(resolveSheetListMaxHeight(667, { top: -10, bottom: Number.NaN })).toBe(Math.floor(667 * 0.6))
  })
})

describe("native Select: 選択肢が多くても一覧がスクロールして全項目に届く (#816)", () => {
  it("47 件の options が maxHeight 付きの ScrollView の中に並ぶ", () => {
    render(<Select options={prefectures} />)
    const [scroll] = scrollViews()
    expect(scrollViews()).toHaveLength(1)
    expect(flatten(scroll.props.style).maxHeight).toBe(resolveSheetListMaxHeight(667, null))
    expect(labelInsideScroll("都道府県0", scroll)).toBe(true)
    expect(labelInsideScroll("都道府県46", scroll)).toBe(true)
  })

  it("safe-area の inset が供給されていれば、その分だけ上限を下げる", () => {
    hosts.height = 874
    render(<Select options={prefectures} />, { top: 62, bottom: 34 })
    expect(flatten(scrollViews()[0].props.style).maxHeight).toBe(resolveSheetListMaxHeight(874, { top: 62, bottom: 34 }))
  })

  it("3 件のときは上限だけを付け、固定の高さで内容を伸ばしたり切ったりしない", () => {
    render(<Select options={few} />)
    const style = flatten(scrollViews()[0].props.style)
    expect(style.maxHeight).toBe(resolveSheetListMaxHeight(667, null))
    expect(style.height).toBeUndefined()
    expect(style.flex).toBeUndefined()
    expect(style.flexGrow).toBeUndefined()
  })
})

describe("native DropdownFilter: 「すべて」と全 options が同じスクロール領域に入る (#816)", () => {
  it("47 件でも「すべて」から末尾まで maxHeight 付きの ScrollView の中にある", () => {
    render(<DropdownFilter label="都道府県" options={prefectures} />)
    const [scroll] = scrollViews()
    expect(scrollViews()).toHaveLength(1)
    expect(flatten(scroll.props.style).maxHeight).toBe(resolveSheetListMaxHeight(667, null))
    expect(labelInsideScroll("すべて", scroll)).toBe(true)
    expect(labelInsideScroll("都道府県46", scroll)).toBe(true)
  })

  it("3 件のときは上限だけを付ける", () => {
    render(<DropdownFilter label="都道府県" options={few} />)
    const style = flatten(scrollViews()[0].props.style)
    expect(style.maxHeight).toBe(resolveSheetListMaxHeight(667, null))
    expect(style.height).toBeUndefined()
    expect(style.flex).toBeUndefined()
  })
})
