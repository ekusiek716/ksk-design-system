import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PillToggle } from "../src/native/components/PillToggle"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { getTheme, themeNames, type ColorMode } from "../src/tokens/native"

// RN hosts only are replaced: the real PillToggle, provider and resolved tokens run.
// Capturing host props verifies what RN receives, not a source-code spelling.
const hosts = vi.hoisted(() => ({
  viewStyles: [] as Record<string, unknown>[],
  pressableStyles: [] as Record<string, unknown>[],
  pressableA11y: [] as { role?: string; state?: unknown; hitSlop?: unknown }[],
  textStyles: [] as Record<string, unknown>[],
}))

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {})
  }
  return (style as Record<string, unknown>) ?? {}
}

vi.mock("react-native", () => ({
  Platform: { select: (opts: Record<string, unknown>) => opts.default },
  View: ({ children, style }: { children: React.ReactNode; style?: unknown }) => {
    hosts.viewStyles.push(flattenStyle(style))
    return children
  },
  Text: ({ children, style }: { children: React.ReactNode; style?: unknown }) => {
    hosts.textStyles.push(flattenStyle(style))
    return children
  },
  Pressable: ({
    children,
    style,
    accessibilityRole,
    accessibilityState,
    hitSlop,
  }: {
    children: React.ReactNode
    style?: unknown
    accessibilityRole?: string
    accessibilityState?: unknown
    hitSlop?: unknown
  }) => {
    const resolved = typeof style === "function" ? style({ pressed: false }) : style
    hosts.pressableStyles.push(flattenStyle(resolved))
    hosts.pressableA11y.push({ role: accessibilityRole, state: accessibilityState, hitSlop })
    return children
  },
}))

beforeEach(() => {
  hosts.viewStyles = []
  hosts.pressableStyles = []
  hosts.pressableA11y = []
  hosts.textStyles = []
})

const options = [
  { value: "all", label: "すべて" },
  { value: "done", label: "完了" },
]

describe.each(themeNames)("native PillToggle parity — %s (#608)", (name) => {
  for (const mode of ["light", "dark"] as const satisfies readonly ColorMode[]) {
    it(`${mode} — container, selected/非選択の面と a11y 既定値`, () => {
      renderToStaticMarkup(
        <ThemeProvider initialName={name} initialMode={mode}>
          <PillToggle options={options} value="all" />
        </ThemeProvider>,
      )
      const theme = getTheme(name, mode)

      // コンテナ: Web の TabsList(variant="pill") と同じ面・形
      const container = hosts.viewStyles[0]
      expect(container).toMatchObject({
        backgroundColor: theme.surface.tertiary,
        borderRadius: 9999,
        alignSelf: "flex-start",
      })

      // a11y 既定値（issue #311 型の再発防止）
      expect(hosts.pressableA11y).toHaveLength(2)
      expect(hosts.pressableA11y[0]).toMatchObject({
        role: "button",
        state: { selected: true, disabled: false },
      })
      expect(hosts.pressableA11y[1]).toMatchObject({
        role: "button",
        state: { selected: false, disabled: false },
      })
      expect(hosts.pressableA11y[0].hitSlop).toMatchObject({ top: 4, bottom: 4 })

      // 選択中は surface.primary + 非選択は transparent（下地はコンテナの tertiary）
      expect(hosts.pressableStyles[0].backgroundColor).toBe(theme.surface.primary)
      expect(hosts.pressableStyles[1].backgroundColor).toBe("transparent")
      // 下地（tertiary）と選択面（primary）は常に区別できる
      expect(theme.surface.primary).not.toBe(theme.surface.tertiary)

      // 文字色: 選択中は high-emphasis、非選択は medium-emphasis
      expect(hosts.textStyles[0].color).toBe(theme.text["high-emphasis"])
      expect(hosts.textStyles[1].color).toBe(theme.text["medium-emphasis"])
    })
  }
})

describe("native PillToggle — disabled / count badge", () => {
  it("disabled を accessibilityState へ反映する", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <PillToggle options={options} value="all" disabled />
      </ThemeProvider>,
    )
    expect(hosts.pressableA11y[0].state).toMatchObject({ selected: true, disabled: true })
    expect(hosts.pressableA11y[1].state).toMatchObject({ selected: false, disabled: true })
  })

  it("count バッジは選択中/非選択のどちらでも項目面に埋没しない面を使う", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <PillToggle options={[{ value: "all", label: "すべて", count: 3 }]} value="all" />
      </ThemeProvider>,
    )
    const theme = getTheme("default", "light")
    // Pressable 自体の背景（選択中 = surface.primary）とバッジの背景は別の面
    const badgeView = hosts.viewStyles.find((s) => s.minWidth === 20)
    expect(badgeView).toBeDefined()
    expect(badgeView?.backgroundColor).not.toBe(theme.surface.primary)
  })
})
