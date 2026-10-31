import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { MobileAppShell } from "../src/native/components/MobileAppShell"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { getTheme, scales } from "../src/tokens/native"

// RN hosts only are replaced: the real MobileAppShell, provider and tokens run.
// Capturing host props verifies what RN receives (issue #824).
const hosts = vi.hoisted(() => ({
  scrollViews: [] as { style: Record<string, unknown>; contentContainerStyle: Record<string, unknown> }[],
  viewStyles: [] as Record<string, unknown>[],
}))

vi.mock("react-native", () => {
  function flatten(style: unknown): Record<string, unknown> {
    if (Array.isArray(style)) {
      return style.filter(Boolean).reduce<Record<string, unknown>>((acc, s) => ({ ...acc, ...flatten(s) }), {})
    }
    return (style as Record<string, unknown>) ?? {}
  }
  return {
    StyleSheet: { flatten },
    View: ({ children, style }: { children?: React.ReactNode; style?: unknown }) => {
      hosts.viewStyles.push(flatten(style))
      return <>{children}</>
    },
    ScrollView: ({
      children,
      style,
      contentContainerStyle,
    }: {
      children?: React.ReactNode
      style?: unknown
      contentContainerStyle?: unknown
    }) => {
      hosts.scrollViews.push({ style: flatten(style), contentContainerStyle: flatten(contentContainerStyle) })
      return <>{children}</>
    },
  }
})

beforeEach(() => {
  hosts.scrollViews = []
  hosts.viewStyles = []
})

function render(node: React.ReactElement) {
  return renderToStaticMarkup(<ThemeProvider>{node}</ThemeProvider>)
}

const fab = <span>FAB</span>
const nav = <span>nav</span>

describe("native MobileAppShell — 下余白はスクロール範囲に入れる (#824)", () => {
  it("scrollable では paddingBottom を contentContainerStyle に入れ、ScrollView の style には入れない", () => {
    render(
      <MobileAppShell fab={fab}>
        <span>本文</span>
      </MobileAppShell>,
    )
    expect(hosts.scrollViews).toHaveLength(1)
    const [scroll] = hosts.scrollViews
    expect(scroll.contentContainerStyle.paddingBottom).toBe(scales.spacing.scale[15])
    expect(scroll.style.paddingBottom).toBeUndefined()
    expect(scroll.style).toMatchObject({ flex: 1, backgroundColor: getTheme("default", "light").surface.secondary })
  })

  it("bottomPadding ごとの余白: none=0 / bottom-nav=spacing[12] / bottom-nav-fab=spacing[15]", () => {
    const cases = [
      [<MobileAppShell key="none">{null}</MobileAppShell>, 0],
      [<MobileAppShell key="nav" bottomNav={nav}>{null}</MobileAppShell>, scales.spacing.scale[12]],
      [<MobileAppShell key="fab" bottomNav={nav} fab={fab}>{null}</MobileAppShell>, scales.spacing.scale[15]],
      [<MobileAppShell key="explicit" fab={fab} bottomPadding="none">{null}</MobileAppShell>, 0],
    ] as const
    for (const [node, expected] of cases) {
      hosts.scrollViews = []
      render(node)
      expect(hosts.scrollViews[0].contentContainerStyle.paddingBottom).toBe(expected)
    }
  })

  it("contentStyle の padding は中身側（スクロール範囲）に入り、既定の余白を上書きできる", () => {
    render(
      <MobileAppShell fab={fab} contentStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}>
        <span>本文</span>
      </MobileAppShell>,
    )
    const [scroll] = hosts.scrollViews
    expect(scroll.contentContainerStyle).toMatchObject({ paddingBottom: 120, paddingHorizontal: 16 })
    expect(scroll.style.paddingBottom).toBeUndefined()
    expect(scroll.style.paddingHorizontal).toBeUndefined()
  })

  it("contentStyle の背景色は従来どおり本文全体（ScrollView の style）を塗る", () => {
    render(
      <MobileAppShell contentStyle={{ backgroundColor: "transparent", paddingTop: 8 }}>
        <span>本文</span>
      </MobileAppShell>,
    )
    const [scroll] = hosts.scrollViews
    expect(scroll.style.backgroundColor).toBe("transparent")
    expect(scroll.contentContainerStyle.backgroundColor).toBeUndefined()
    expect(scroll.contentContainerStyle.paddingTop).toBe(8)
  })

  it("scrollable={false} は従来どおり View の style に余白と contentStyle を入れる", () => {
    render(
      <MobileAppShell scrollable={false} fab={fab} contentStyle={{ paddingTop: 8 }}>
        <span>本文</span>
      </MobileAppShell>,
    )
    expect(hosts.scrollViews).toHaveLength(0)
    const body = hosts.viewStyles.find((s) => s.paddingBottom === scales.spacing.scale[15])
    expect(body).toMatchObject({
      flex: 1,
      backgroundColor: getTheme("default", "light").surface.secondary,
      paddingBottom: scales.spacing.scale[15],
      paddingTop: 8,
    })
  })
})
