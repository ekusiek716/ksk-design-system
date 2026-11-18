import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  createExpoRouterTabBar,
  LiquidBottomTabBar,
  type LiquidBottomTabBarProps,
} from "../src/native/components/BottomTabBar"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

/**
 * issue #862: native の LiquidBottomTabBar（createExpoRouterTabBar が使う）のタブ名は、
 * iOS の標準のタブバーと同じく文字の倍率に上限を持つ。上限が無いと幅 72 の 1 行に収まらず
 * 大きな文字で「ホ…」「寸…」になった。RN の host だけを差し替え、実物の部品が host に渡す
 * props を記録して確かめる。
 */
type HostProps = Record<string, unknown> & { children?: unknown; style?: unknown }
const hosts = vi.hoisted(() => ({
  records: [] as { host: string; props: Record<string, unknown>; style: Record<string, unknown>; text: string }[],
}))
vi.mock("react-native", async () => {
  const R = await import("react")
  const flat = (style: unknown): Record<string, unknown> =>
    Array.isArray(style) ? Object.assign({}, ...style.map(flat)) : (style as Record<string, unknown>) || {}
  const host = (name: string) => ({ children, style, ...props }: HostProps) => {
    const resolved = typeof style === "function" ? style({ pressed: false }) : style
    const kids = typeof children === "function" ? children({ pressed: false }) : children
    const text = typeof kids === "string" || typeof kids === "number" ? String(kids) : ""
    hosts.records.push({ host: name, props, style: flat(resolved), text })
    return R.createElement(R.Fragment, null, kids as React.ReactNode)
  }
  return {
    View: host("View"),
    Text: host("Text"),
    Pressable: host("Pressable"),
    ScrollView: host("ScrollView"),
    Keyboard: { addListener: () => ({ remove: () => {} }) },
    useColorScheme: () => "light",
    useWindowDimensions: () => ({ width: 393, height: 852, scale: 3, fontScale: 3.571 }),
    StyleSheet: { create: <T,>(s: T) => s, flatten: flat, hairlineWidth: 1 },
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o.ios ?? o.default },
  }
})

beforeEach(() => {
  hosts.records = []
})

const TABS = [
  { key: "index-1", name: "index", title: "ホーム" },
  { key: "search-1", name: "search", title: "寸法から", badge: 3 },
  { key: "build-1", name: "build", title: "作る" },
  { key: "mine-1", name: "mine", title: "マイ" },
]

function navProps(): Pick<LiquidBottomTabBarProps, "state" | "descriptors" | "navigation"> {
  const state = {
    index: 0,
    key: "tabs",
    routeNames: TABS.map((t) => t.name),
    routes: TABS.map((t) => ({ key: t.key, name: t.name, params: undefined })),
    stale: false,
    type: "tab",
    history: [],
    preloadedRouteKeys: [],
  } as unknown as LiquidBottomTabBarProps["state"]
  const descriptors = Object.fromEntries(
    TABS.map((t) => [t.key, { options: { title: t.title, tabBarBadge: t.badge } }]),
  ) as unknown as LiquidBottomTabBarProps["descriptors"]
  const navigation = {
    emit: () => ({ defaultPrevented: false }),
    navigate: () => {},
  } as unknown as LiquidBottomTabBarProps["navigation"]
  return { state, descriptors, navigation }
}

const texts = () => hosts.records.filter((r) => r.host === "Text")
const pressables = () => hosts.records.filter((r) => r.host === "Pressable")

describe("LiquidBottomTabBar のタブ名の文字の大きさ（#862）", () => {
  it("タブ名の文字の倍率に上限 1.35（iOS の標準の最大 1.353 付近）を付け、1 行のまま", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <LiquidBottomTabBar {...navProps()} glass={false} />
      </ThemeProvider>,
    )
    const labels = texts().filter((t) => TABS.some((tab) => tab.title === t.text))
    expect(labels.map((t) => t.text)).toEqual(TABS.map((t) => t.title))
    for (const label of labels) {
      expect(label.props.maxFontSizeMultiplier).toBe(1.35)
      expect(label.props.numberOfLines).toBe(1)
    }
  })

  it("4 文字の和文タブ名が上限の大きさでも幅 72 に収まる（body.xs 12px × 1.35 × 4 文字）", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <LiquidBottomTabBar {...navProps()} glass={false} />
      </ThemeProvider>,
    )
    const label = texts().find((t) => t.text === "寸法から")!
    const fontSize = label.style.fontSize as number
    const maxWidth = label.style.maxWidth as number
    expect(fontSize * (label.props.maxFontSizeMultiplier as number) * 4).toBeLessThanOrEqual(maxWidth)
  })

  it("読み上げ名は全文のまま、iOS の長押しの拡大表示（Large Content Viewer）にタブ名を渡す", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <LiquidBottomTabBar {...navProps()} glass={false} />
      </ThemeProvider>,
    )
    const items = pressables()
    expect(items.map((p) => p.props.accessibilityLabel)).toEqual(TABS.map((t) => t.title))
    expect(items.map((p) => p.props.accessibilityLargeContentTitle)).toEqual(TABS.map((t) => t.title))
    expect(items.every((p) => p.props.accessibilityShowsLargeContentViewer === true)).toBe(true)
    // 役割・選択状態（#800 / #808）は保つ
    expect(items[0].props).toMatchObject({ accessibilityRole: "button", accessibilityState: { selected: true } })
  })

  it("ラベルを出さない形では拡大表示を付けない（見えているのはアイコンだけ）", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <LiquidBottomTabBar {...navProps()} glass={false} showLabels={false} />
      </ThemeProvider>,
    )
    const items = pressables()
    expect(items.every((p) => p.props.accessibilityShowsLargeContentViewer === false)).toBe(true)
    expect(items.every((p) => p.props.accessibilityLargeContentTitle === undefined)).toBe(true)
  })

  it("件数バッジの文字も同じ上限にし、バッジの高さは固定せず下限にする", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <LiquidBottomTabBar {...navProps()} glass={false} />
      </ThemeProvider>,
    )
    const badgeText = texts().find((t) => t.text === "3")!
    expect(badgeText.props.maxFontSizeMultiplier).toBe(1.35)
    // バーの外枠（floating）も absolute なので、アイコンの右上に重ねるバッジ（top: -4）で探す
    const badge = hosts.records.find((r) => r.host === "View" && r.style.position === "absolute" && r.style.top === -4)!
    expect(badge.style.height).toBeUndefined()
    expect(badge.style.minHeight).toBe(16)
  })

  it("createExpoRouterTabBar 経由でも同じ上限が掛かる", () => {
    const TabBar = createExpoRouterTabBar({ glass: false })
    renderToStaticMarkup(
      <ThemeProvider>
        <TabBar {...navProps()} />
      </ThemeProvider>,
    )
    const labels = texts().filter((t) => TABS.some((tab) => tab.title === t.text))
    expect(labels).toHaveLength(TABS.length)
    expect(labels.every((t) => t.props.maxFontSizeMultiplier === 1.35)).toBe(true)
  })
})
