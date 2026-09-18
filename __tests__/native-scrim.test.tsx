/**
 * issue #555: RN Modal を生成しない単体スクリム `Scrim`。
 * - 濃さは Dialog と同じ `theme.overlay.dark`（値の重複ハードコードをしない）
 * - root は素の View（accessible にしない）。押下面 Pressable と children は兄弟。
 *   VoiceOver がパネル内のボタン・入力欄へ個別にフォーカスできるため。
 * - children は押下面より後ろの兄弟＝前面。パネル上のタップは押下面へ届かない
 * - 子へ背景・padding・maxWidth を強制しない（ViewShot のキャプチャ対象を置ける）
 */
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { View as RNView } from "react-native"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Scrim } from "../src/native/components/Scrim"
import { resolveScrimAlignment, resolveScrimContentStyle } from "../src/native/scrim-layout"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { getTheme, themeNames, type ColorMode } from "../src/tokens/native"

type HostRecord = {
  host: "View" | "Pressable"
  style: Record<string, unknown>
  props: Record<string, unknown>
  depth: number
}

const PANEL_MARKER = "panel-child"

const hosts = vi.hoisted(() => ({
  records: [] as {
    host: "View" | "Pressable"
    style: Record<string, unknown>
    props: Record<string, unknown>
    depth: number
  }[],
  modals: 0,
}))

function flatten(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flatten))
  return (style ?? {}) as Record<string, unknown>
}

// RN の host だけを差し替え、実際の Scrim / ThemeProvider / 解決済みトークンを動かす。
// 入れ子の深さは Context で測る（親子か兄弟かを構造として固定するため）。
vi.mock("react-native", async () => {
  const ReactModule = await import("react")
  const DepthContext = ReactModule.createContext(0)
  const record = (host: "View" | "Pressable") =>
    function Host({ children, style, ...props }: Record<string, unknown> & { children?: React.ReactNode }) {
      const depth = ReactModule.useContext(DepthContext)
      hosts.records.push({ host, style: flatten(style), props, depth })
      return ReactModule.createElement(
        DepthContext.Provider,
        { value: depth + 1 },
        children as React.ReactNode,
      )
    }
  return {
    Modal: ({ children }: { children: React.ReactNode }) => {
      hosts.modals += 1
      return children
    },
    Pressable: record("Pressable"),
    View: record("View"),
    Text: ({ children }: { children: React.ReactNode }) => children,
  }
})

function render(node: React.ReactElement, name = themeNames[0], mode: ColorMode = "light") {
  renderToStaticMarkup(
    <ThemeProvider initialName={name} initialMode={mode}>
      {node}
    </ThemeProvider>,
  )
}

/** テスト用パネル。native host の View として記録され、深さで親子を判定できる。 */
function Panel() {
  return <RNView testID={PANEL_MARKER} />
}

function records(): HostRecord[] {
  return hosts.records
}

beforeEach(() => {
  hosts.records = []
  hosts.modals = 0
})

describe("Scrim の純レイアウト解決", () => {
  it("align ごとの寄せ方", () => {
    expect(resolveScrimAlignment()).toEqual({ alignItems: "center", justifyContent: "center" })
    expect(resolveScrimAlignment("top")).toEqual({ alignItems: "center", justifyContent: "flex-start" })
    expect(resolveScrimAlignment("bottom")).toEqual({ alignItems: "center", justifyContent: "flex-end" })
    expect(resolveScrimAlignment("stretch")).toEqual({
      alignItems: "stretch",
      justifyContent: "flex-start",
    })
  })

  it("子ラッパは stretch のときだけ伸ばし、背景・padding・maxWidth を持たない", () => {
    expect(resolveScrimContentStyle("center")).toEqual({})
    expect(resolveScrimContentStyle("stretch")).toEqual({ flex: 1, alignSelf: "stretch" })
    for (const align of ["center", "top", "bottom", "stretch"] as const) {
      const style = resolveScrimContentStyle(align) as Record<string, unknown>
      expect(style).not.toHaveProperty("backgroundColor")
      expect(style).not.toHaveProperty("padding")
      expect(style).not.toHaveProperty("maxWidth")
      expect(style).not.toHaveProperty("overflow")
    }
  })
})

describe("Scrim のレンダー契約（#555）", () => {
  it("RN Modal を生成しない", () => {
    render(<Scrim onPress={() => {}} />)
    expect(hosts.modals).toBe(0)
  })

  it.each(themeNames)("背景は Dialog と同じ overlay.dark を root だけに塗る — %s", (name) => {
    for (const mode of ["light", "dark"] as const satisfies readonly ColorMode[]) {
      hosts.records = []
      render(<Scrim onPress={() => {}} />, name, mode)
      const [root, backdrop] = records()
      expect(root.style).toMatchObject({
        backgroundColor: getTheme(name, mode).overlay.dark,
        position: "absolute",
      })
      // 押下面は二重に塗らない
      expect(backdrop.style).not.toHaveProperty("backgroundColor")
    }
  })

  it("root は素の View で accessible にしない（VoiceOver がパネル内へ入れる）", () => {
    render(
      <Scrim onPress={() => {}}>
        <Panel />
      </Scrim>,
    )
    const root = records()[0]
    expect(root.host).toBe("View")
    expect(root.props).not.toHaveProperty("accessibilityRole")
    expect(root.props).not.toHaveProperty("accessibilityLabel")
    expect(root.props).not.toHaveProperty("accessible")
  })

  it("押下面 Pressable と children コンテナは兄弟で、children は押下面の子孫でない", () => {
    render(
      <Scrim onPress={() => {}}>
        <Panel />
      </Scrim>,
    )
    const [root, backdrop, content, panel] = records()
    expect(root.depth).toBe(0)
    expect(backdrop.host).toBe("Pressable")
    expect(backdrop.depth).toBe(1)
    expect(content.host).toBe("View")
    // 押下面と同じ深さ = 兄弟（押下面の子孫ではない）
    expect(content.depth).toBe(1)
    expect(panel.props.testID).toBe(PANEL_MARKER)
    expect(panel.depth).toBe(2)
    // 吸収用のダミー Pressable は作らない
    expect(records().filter((r) => r.host === "Pressable")).toHaveLength(1)
  })

  it("押下面だけが button ロールと既定ラベル「閉じる」を持つ", () => {
    render(
      <Scrim onPress={() => {}}>
        <Panel />
      </Scrim>,
    )
    const [, backdrop, content] = records()
    expect(backdrop.props).toMatchObject({
      accessibilityRole: "button",
      accessibilityLabel: "閉じる",
    })
    expect(content.props).not.toHaveProperty("accessibilityRole")
  })

  it("accessibilityLabel は上書きできる", () => {
    render(<Scrim onPress={() => {}} accessibilityLabel="報告を閉じる" />)
    expect(records()[1].props.accessibilityLabel).toBe("報告を閉じる")
  })

  it("onPress 未指定は押下面を描かないが、背面へのタッチは塞ぐ", () => {
    render(
      <Scrim>
        <Panel />
      </Scrim>,
    )
    expect(records().filter((r) => r.host === "Pressable")).toHaveLength(0)
    const root = records()[0]
    // root に box-none を付けない = 背面は触れない
    expect(root.props).not.toHaveProperty("pointerEvents")
  })

  it("children コンテナは box-none で、余白のタップは押下面へ抜ける", () => {
    render(
      <Scrim onPress={() => {}}>
        <Panel />
      </Scrim>,
    )
    expect(records()[2].props.pointerEvents).toBe("box-none")
  })

  it("align='stretch' でも兄弟構造のまま子が全面へ伸びる", () => {
    render(
      <Scrim onPress={() => {}} align="stretch">
        <Panel />
      </Scrim>,
    )
    const [root, backdrop, content] = records()
    expect(root.style).toMatchObject({ alignItems: "stretch", justifyContent: "flex-start" })
    expect(backdrop.depth).toBe(1)
    expect(content.depth).toBe(1)
    expect(content.style).toMatchObject({ flex: 1, alignSelf: "stretch" })
    expect(content.props.pointerEvents).toBe("box-none")
  })

  it("children コンテナは背景・padding・maxWidth を強制しない（ViewShot 用）", () => {
    render(
      <Scrim onPress={() => {}}>
        <Panel />
      </Scrim>,
    )
    const content = records()[2].style
    expect(content).not.toHaveProperty("backgroundColor")
    expect(content).not.toHaveProperty("padding")
    expect(content).not.toHaveProperty("maxWidth")
    expect(content).not.toHaveProperty("overflow")
  })

  it("style は root に、testID は root と押下面（派生）に付く", () => {
    render(<Scrim onPress={() => {}} style={{ zIndex: 10 }} testID="report-scrim" />)
    const [root, backdrop] = records()
    expect(root.style).toMatchObject({ zIndex: 10 })
    expect(root.props.testID).toBe("report-scrim")
    expect(backdrop.props.testID).toBe("report-scrim-backdrop")
  })

  it("testID 未指定なら押下面にも testID を付けない", () => {
    render(<Scrim onPress={() => {}} />)
    expect(records()[1].props.testID).toBeUndefined()
  })
})
