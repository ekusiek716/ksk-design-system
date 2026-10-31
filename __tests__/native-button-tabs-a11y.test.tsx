import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Button } from "../src/native/components/Button"
import { Tabs, TabsList, TabsTrigger } from "../src/native/components/Tabs"
import { NavigationBar } from "../src/native/components/NavigationBar"
import { BottomTabBar } from "../src/native/components/BottomTabBar"
import { SubNav } from "../src/native/components/SubNav"
import { CategoryNav } from "../src/native/components/CategoryNav"
import { CategoryScroll } from "../src/native/components/CategoryScroll"
import { Pagination } from "../src/native/components/Pagination"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

/**
 * native の Button とタブ・ナビ系の読み上げ既定値（issue #800）。
 *
 * IconButton / Chip / FloatingTabBar と同じく、役割（accessibilityRole）と
 * 選択状態（accessibilityState.selected / disabled）は部品が既定で持ち、
 * 呼び出し側の明示値が優先される。RN の host だけを差し替え、実物の部品が
 * host に渡す props を記録して確かめる（ソースの綴りではなく RN が受け取る値）。
 */
type HostProps = Record<string, unknown> & { children?: unknown; style?: unknown }
const hosts = vi.hoisted(() => ({
  records: [] as { host: string; props: Record<string, unknown> }[],
}))
vi.mock("react-native", async () => {
  const R = await import("react")
  const flat = (style: unknown): Record<string, unknown> =>
    Array.isArray(style) ? Object.assign({}, ...style.map(flat)) : (style as Record<string, unknown>) || {}
  const host = (name: string) => ({ children, style: _style, ...props }: HostProps) => {
    hosts.records.push({ host: name, props })
    const kids = typeof children === "function" ? children({ pressed: false }) : children
    return R.createElement(R.Fragment, null, kids as React.ReactNode)
  }
  return {
    View: host("View"),
    Text: host("Text"),
    Pressable: host("Pressable"),
    ScrollView: host("ScrollView"),
    ActivityIndicator: host("ActivityIndicator"),
    Keyboard: { addListener: () => ({ remove: () => {} }) },
    useColorScheme: () => "light",
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: 1 }),
    StyleSheet: { create: <T,>(s: T) => s, flatten: flat, hairlineWidth: 1 },
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o.ios ?? o.default },
  }
})

beforeEach(() => {
  hosts.records = []
})

const render = (node: React.ReactNode) => renderToStaticMarkup(<ThemeProvider>{node}</ThemeProvider>)
const pressables = () => hosts.records.filter((r) => r.host === "Pressable").map((r) => r.props)
const roleOf = (host: string) => hosts.records.filter((r) => r.host === host).map((r) => r.props.accessibilityRole)

describe("Button の既定の役割（#800）", () => {
  it("通常の variant は明示しなくても accessibilityRole=button", () => {
    render(<Button onPress={() => {}}>保存</Button>)
    expect(pressables()[0].accessibilityRole).toBe("button")
  })

  it("glass も明示しなくても accessibilityRole=button", () => {
    render(<Button variant="glass" onPress={() => {}}>始める</Button>)
    expect(pressables()[0].accessibilityRole).toBe("button")
  })

  it("呼び出し側が明示した accessibilityRole が優先される（通常・glass とも）", () => {
    render(<Button accessibilityRole="link">規約</Button>)
    render(<Button variant="glass" accessibilityRole="link">規約</Button>)
    expect(pressables().map((p) => p.accessibilityRole)).toEqual(["link", "link"])
  })

  it("disabled / busy の accessibilityState は従来どおり", () => {
    render(<Button loading>保存</Button>)
    expect(pressables()[0].accessibilityState).toMatchObject({ disabled: true, busy: true })
  })
})

describe("TabsTrigger / TabsList の既定（#800）", () => {
  const renderTabs = (value: string) =>
    render(
      <Tabs value={value} onChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">概要</TabsTrigger>
          <TabsTrigger value="b" disabled>
            詳細
          </TabsTrigger>
          <TabsTrigger value="c" accessibilityLabel="レビュー（3件）">
            レビュー
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    )

  it("TabsList は tablist、各 TabsTrigger は tab", () => {
    renderTabs("a")
    expect(roleOf("View")).toContain("tablist")
    expect(pressables().map((p) => p.accessibilityRole)).toEqual(["tab", "tab", "tab"])
  })

  it("現在のタブだけ selected、disabled も state に出る", () => {
    renderTabs("a")
    expect(pressables().map((p) => p.accessibilityState)).toEqual([
      { selected: true, disabled: false },
      { selected: false, disabled: true },
      { selected: false, disabled: false },
    ])
    hosts.records = []
    renderTabs("c")
    expect(pressables().map((p) => (p.accessibilityState as { selected: boolean }).selected)).toEqual([false, false, true])
  })

  it("読み上げ名は文字列の children を既定にし、accessibilityLabel の明示が優先される", () => {
    renderTabs("a")
    expect(pressables().map((p) => p.accessibilityLabel)).toEqual(["概要", "詳細", "レビュー（3件）"])
  })

  it("scrollable でも内側の行が tablist", () => {
    render(
      <Tabs value="a" onChange={() => {}}>
        <TabsList scrollable>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    expect(roleOf("View")).toContain("tablist")
  })
})

const navItems = [
  { key: "home", label: "ホーム" },
  { key: "inbox", label: "受信箱", badge: 3 },
  { key: "me", label: "マイページ", badge: 120 },
]

describe("NavigationBar / BottomTabBar の既定（#800）", () => {
  for (const [name, Comp] of [
    ["NavigationBar", NavigationBar],
    ["BottomTabBar", BottomTabBar],
  ] as const) {
    it(`${name}: 外枠は tablist、各項目は tab で現在の項目だけ selected`, () => {
      render(<Comp items={navItems} value="inbox" />)
      expect(roleOf("View")).toContain("tablist")
      expect(pressables().map((p) => p.accessibilityRole)).toEqual(["tab", "tab", "tab"])
      expect(pressables().map((p) => p.accessibilityState)).toEqual([
        { selected: false },
        { selected: true },
        { selected: false },
      ])
    })

    it(`${name}: 読み上げ名はラベル + 件数（Web の BottomTabBar と同じ「（N）」・100 以上は 99+）`, () => {
      render(<Comp items={navItems} value="home" />)
      expect(pressables().map((p) => p.accessibilityLabel)).toEqual(["ホーム", "受信箱（3）", "マイページ（99+）"])
    })
  }
})

describe("SubNav / CategoryNav / CategoryScroll の既定（#800）", () => {
  const items = [
    { key: "all", label: "すべて", count: 12 },
    { key: "new", label: "新着" },
  ]
  for (const [name, Comp] of [
    ["SubNav", SubNav],
    ["CategoryNav", CategoryNav],
    ["CategoryScroll", CategoryScroll],
  ] as const) {
    it(`${name}: コンテナは tablist、各項目は tab で selected が切り替わる`, () => {
      render(<Comp items={items} value="all" />)
      expect(roleOf("ScrollView")).toEqual(["tablist"])
      expect(pressables().map((p) => p.accessibilityRole)).toEqual(["tab", "tab"])
      expect(pressables().map((p) => p.accessibilityState)).toEqual([{ selected: true }, { selected: false }])
      hosts.records = []
      render(<Comp items={items} value="new" />)
      expect(pressables().map((p) => p.accessibilityState)).toEqual([{ selected: false }, { selected: true }])
    })
  }
})

describe("Pagination の既定（#800）", () => {
  it("各ボタンは button、現在ページだけ selected、押せないボタンは disabled", () => {
    render(<Pagination page={1} total={3} />)
    const ps = pressables()
    expect(ps.map((p) => p.accessibilityRole)).toEqual(["button", "button", "button", "button", "button"])
    expect(ps.map((p) => p.accessibilityState)).toEqual([
      { selected: false, disabled: true },
      { selected: true, disabled: false },
      { selected: false, disabled: false },
      { selected: false, disabled: false },
      { selected: false, disabled: false },
    ])
  })

  it("前後の矢印には読み上げ名、ページ番号はその番号、「…」は「その他のページ」", () => {
    render(<Pagination page={10} total={20} />)
    const labels = pressables().map((p) => p.accessibilityLabel)
    expect(labels[0]).toBe("前のページ")
    expect(labels[labels.length - 1]).toBe("次のページ")
    expect(labels).toContain("10")
    expect(labels.filter((l) => l === "その他のページ")).toHaveLength(2)
  })

  it("前後・省略の読み上げ名は props で差し替えられる", () => {
    render(<Pagination page={10} total={20} previousLabel="Previous page" nextLabel="Next page" ellipsisLabel="More pages" />)
    const labels = pressables().map((p) => p.accessibilityLabel)
    expect(labels[0]).toBe("Previous page")
    expect(labels[labels.length - 1]).toBe("Next page")
    expect(labels.filter((l) => l === "More pages")).toHaveLength(2)
  })
})
