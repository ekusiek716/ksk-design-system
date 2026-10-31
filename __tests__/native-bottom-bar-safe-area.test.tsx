import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { StickyActionBar } from "../src/native/components/StickyActionBar"
import { NavigationBar } from "../src/native/components/NavigationBar"
import { BottomTabBar } from "../src/native/components/BottomTabBar"
import { SafeAreaInsetsProvider } from "../src/native/theme/SafeAreaInsetsProvider"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import type { SafeAreaInsets } from "../src/native/safe-area"

/**
 * 画面下に固定するバーの下端余白（issue #804）。
 *
 * StickyActionBar / NavigationBar（BottomTabBar 経由を含む）が、SafeAreaInsetsProvider で
 * 供給された下端 inset を余白に反映し、未供給なら従来の決め打ち（iOS 32 / 24、Android 16 / 0）の
 * ままであること、safeArea={false} で inset を無視できることを、RN の host が受け取る
 * style で確かめる（部品本体・Provider・テーマはそのまま動かす）。
 */
const env = vi.hoisted(() => ({ os: "ios" as "ios" | "android", viewStyles: [] as Record<string, unknown>[] }))

vi.mock("react-native", async () => {
  const R = await import("react")
  const flat = (style: unknown): Record<string, unknown> =>
    Array.isArray(style) ? Object.assign({}, ...style.map(flat)) : (style as Record<string, unknown>) || {}
  type HostProps = { children?: unknown; style?: unknown }
  const passthrough = ({ children }: HostProps) => {
    const kids = typeof children === "function" ? children({ pressed: false }) : children
    return R.createElement(R.Fragment, null, kids as React.ReactNode)
  }
  return {
    View: ({ children, style }: HostProps) => {
      env.viewStyles.push(flat(style))
      return R.createElement(R.Fragment, null, children as React.ReactNode)
    },
    Text: passthrough,
    Pressable: passthrough,
    Keyboard: { addListener: () => ({ remove: () => {} }) },
    useColorScheme: () => "light",
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: 1 }),
    StyleSheet: { create: <T,>(s: T) => s, flatten: flat, hairlineWidth: 1 },
    Platform: {
      get OS() {
        return env.os
      },
      select: (o: Record<string, unknown>) => (env.os in o ? o[env.os] : o.default),
    },
  }
})

beforeEach(() => {
  env.viewStyles = []
  env.os = "ios"
})

const items = [
  { key: "home", label: "ホーム" },
  { key: "me", label: "マイページ" },
]

type Bar = "StickyActionBar" | "NavigationBar" | "BottomTabBar"
const renderBar = (bar: Bar, insets?: SafeAreaInsets | null, safeArea?: boolean) => {
  const node =
    bar === "StickyActionBar" ? (
      <StickyActionBar safeArea={safeArea}>購入</StickyActionBar>
    ) : bar === "NavigationBar" ? (
      <NavigationBar items={items} value="home" safeArea={safeArea} />
    ) : (
      <BottomTabBar items={items} value="home" safeArea={safeArea} />
    )
  renderToStaticMarkup(
    <ThemeProvider>
      {insets === undefined ? node : <SafeAreaInsetsProvider insets={insets}>{node}</SafeAreaInsetsProvider>}
    </ThemeProvider>,
  )
  // バー本体の下余白（BottomTabBar はキーボード追従用の View で包むので、paddingBottom を持つ最初の View）
  return env.viewStyles.find((s) => "paddingBottom" in s)?.paddingBottom
}

describe("下端に固定するバーの下余白（#804）", () => {
  const cases: { bar: Bar; base: number; ios: number; android: number }[] = [
    { bar: "StickyActionBar", base: 16, ios: 32, android: 16 },
    { bar: "NavigationBar", base: 0, ios: 24, android: 0 },
    { bar: "BottomTabBar", base: 0, ios: 24, android: 0 },
  ]

  for (const { bar, base, ios, android } of cases) {
    it(`${bar}: 下端 inset を供給すると base + inset になる（iOS / Android）`, () => {
      env.os = "ios"
      expect(renderBar(bar, { bottom: 34 })).toBe(base + 34)
      env.viewStyles = []
      env.os = "android"
      expect(renderBar(bar, { bottom: 48 })).toBe(base + 48)
    })

    it(`${bar}: 【後方互換】未供給なら従来値（iOS ${ios} / Android ${android}）`, () => {
      env.os = "ios"
      expect(renderBar(bar)).toBe(ios)
      env.viewStyles = []
      env.os = "android"
      expect(renderBar(bar)).toBe(android)
      env.viewStyles = []
      // Provider はあるが下端が無い（上端だけ供給）も未供給扱い
      expect(renderBar(bar, { top: 24 })).toBe(android)
    })

    it(`${bar}: safeArea={false} は inset を無視して従来値`, () => {
      env.os = "android"
      expect(renderBar(bar, { bottom: 48 }, false)).toBe(android)
      env.viewStyles = []
      env.os = "ios"
      expect(renderBar(bar, { bottom: 34 }, false)).toBe(ios)
    })
  }
})
