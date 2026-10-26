import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Button } from "../src/native/components/Button"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { flattenViewStyle, resolveGlassHitSlop, splitGlassContainerStyle } from "../src/native/button-glass-style"

// issue #754: native Button variant="glass" も containerStyle / pressedContainerStyle を読む。
type HostProps = Record<string, unknown> & { children?: unknown; style?: unknown }
const hosts = vi.hoisted(() => ({
  pressed: false,
  records: [] as { host: string; props: Record<string, unknown>; style: Record<string, unknown> }[],
}))
vi.mock("react-native", async () => {
  const R = await import("react")
  const flat = (style: unknown): Record<string, unknown> =>
    Array.isArray(style) ? Object.assign({}, ...style.map(flat)) : (style as Record<string, unknown>) || {}
  const host = (name: string) => ({ children, style, ...props }: HostProps) => {
    const resolved = typeof style === "function" ? style({ pressed: hosts.pressed }) : style
    hosts.records.push({ host: name, props, style: flat(resolved) })
    const kids = typeof children === "function" ? children({ pressed: hosts.pressed }) : children
    return R.createElement(R.Fragment, null, kids as React.ReactNode)
  }
  return {
    View: host("View"), Text: host("Text"), Pressable: host("Pressable"), ActivityIndicator: host("ActivityIndicator"),
    useColorScheme: () => "light",
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: 1 }),
    StyleSheet: { create: <T,>(s: T) => s, flatten: flat, hairlineWidth: 1 },
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o.ios ?? o.default },
  }
})

beforeEach(() => { hosts.records = []; hosts.pressed = false })

const render = (node: React.ReactNode) => renderToStaticMarkup(<ThemeProvider>{node}</ThemeProvider>)
/** 外側の Pressable と、内側のぼかし面（flexGrow を持つ View）を取り出す */
const layers = () => ({
  outer: hosts.records.find((r) => r.host === "Pressable")!,
  inner: hosts.records.find((r) => r.host === "View" && r.style.flexGrow === 1)!,
})

describe("native Button variant=glass の containerStyle（#754）", () => {
  it("containerStyle を渡さない既定は従来どおり（minHeight 44・角丸 full・左右余白・hitSlop なし）", () => {
    render(<Button variant="glass">始める</Button>)
    const { outer, inner } = layers()
    expect(outer.style).toMatchObject({ minHeight: 44, overflow: "hidden", opacity: 1 })
    expect(outer.style.borderRadius).toBeGreaterThan(100)
    expect(outer.props.hitSlop).toBeUndefined()
    expect(inner.style).toMatchObject({ minHeight: 44, paddingHorizontal: 20 })
  })

  it("丸い 40x40 の補助ボタン: 寸法は外側、余白は内側、角丸は両方。既定の minHeight 44 は height を押し上げない", () => {
    render(
      <Button
        variant="glass"
        accessibilityLabel="ブックマーク"
        containerStyle={{ width: 40, height: 40, paddingHorizontal: 0, borderRadius: 20 }}
      />,
    )
    const { outer, inner } = layers()
    expect(outer.style).toMatchObject({ width: 40, height: 40, borderRadius: 20, overflow: "hidden" })
    expect(outer.style.minHeight).toBeUndefined()
    expect(outer.style.paddingHorizontal).toBeUndefined()
    expect(inner.style.paddingHorizontal).toBe(0)
    expect(inner.style.minHeight).toBeUndefined()
    expect(inner.style.borderRadius).toBe(20)
    // 見た目 40 でも実タップ領域は 44 以上（40 + 2 + 2）
    expect(outer.props.hitSlop).toEqual({ top: 2, bottom: 2, left: 2, right: 2 })
  })

  it("minHeight / paddingHorizontal / borderRadius: 999 の小さい補助ボタン（issue の再現条件）", () => {
    render(<Button variant="glass" containerStyle={{ minHeight: 32, paddingHorizontal: 12, borderRadius: 999 }}>報告</Button>)
    const { outer, inner } = layers()
    expect(outer.style).toMatchObject({ minHeight: 32, borderRadius: 999 })
    expect(inner.style).toMatchObject({ minHeight: 32, paddingHorizontal: 12 })
    expect(inner.style.borderRadius).toBe(999)
  })

  it("利用側の hitSlop が優先される", () => {
    render(<Button variant="glass" hitSlop={10} containerStyle={{ width: 32, height: 32 }} />)
    expect(layers().outer.props.hitSlop).toBe(10)
  })

  it("pressedContainerStyle は押下中だけ反映され、disabled では無視される", () => {
    const pressedContainerStyle = { backgroundColor: "#123456", paddingHorizontal: 4 }
    render(<Button variant="glass" pressedContainerStyle={pressedContainerStyle}>A</Button>)
    expect(layers().outer.style.backgroundColor).toBeUndefined()
    expect(layers().inner.style.paddingHorizontal).toBe(20)

    hosts.records = []
    hosts.pressed = true
    render(<Button variant="glass" pressedContainerStyle={pressedContainerStyle}>A</Button>)
    expect(layers().outer.style.backgroundColor).toBe("#123456")
    expect(layers().inner.style).toMatchObject({ paddingHorizontal: 4, transform: [{ scale: 0.96 }] })

    hosts.records = []
    render(<Button variant="glass" disabled pressedContainerStyle={pressedContainerStyle}>A</Button>)
    expect(layers().outer.style.backgroundColor).toBeUndefined()
    expect(layers().outer.style.opacity).toBe(0.56)
  })

  it("配列・falsy の containerStyle もまとめて解釈する", () => {
    render(<Button variant="glass" containerStyle={[{ width: 40 }, false, null, { height: 40, borderRadius: 20 }]} />)
    expect(layers().outer.style).toMatchObject({ width: 40, height: 40, borderRadius: 20 })
  })
})

describe("button-glass-style の純関数", () => {
  it("flatten: 配列・falsy・入れ子を後勝ちで畳む", () => {
    expect(flattenViewStyle([{ width: 1 }, [false, { height: 2 }], undefined, { width: 3 }])).toEqual({ width: 3, height: 2 })
    expect(flattenViewStyle(undefined)).toEqual({})
  })
  it("split: padding 系だけ内側、それ以外（borderRadius 含む）は外側", () => {
    const { outer, inner } = splitGlassContainerStyle({ padding: 1, paddingEnd: 2, width: 40, margin: 3, borderRadius: 20, alignSelf: "flex-end" })
    expect(inner).toEqual({ padding: 1, paddingEnd: 2 })
    expect(outer).toEqual({ width: 40, margin: 3, borderRadius: 20, alignSelf: "flex-end" })
  })
  it("hitSlop: 44 未満の数値寸法だけ補い、44 以上・未指定・% は補わない", () => {
    expect(resolveGlassHitSlop({ width: 32, height: 44 }, 44)).toEqual({ top: 0, bottom: 0, left: 6, right: 6 })
    expect(resolveGlassHitSlop({ width: 44, height: 48 }, 44)).toBeUndefined()
    expect(resolveGlassHitSlop({ height: "100%" }, 44)).toBeUndefined()
    expect(resolveGlassHitSlop({}, 44)).toBeUndefined()
  })
})
