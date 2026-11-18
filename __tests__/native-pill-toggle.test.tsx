import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PillToggle } from "../src/native/components/PillToggle"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { getTheme, themeNames, type ColorMode } from "../src/tokens/native"
import { PILL_TOGGLE_ITEM_MIN_HEIGHT, shouldStackPillToggle } from "../src/native/pill-toggle-layout"

// RN hosts only are replaced: the real PillToggle, provider and resolved tokens run.
// Capturing host props verifies what RN receives, not a source-code spelling.
const hosts = vi.hoisted(() => ({
  viewStyles: [] as Record<string, unknown>[],
  pressableStyles: [] as Record<string, unknown>[],
  pressableA11y: [] as { role?: string; state?: unknown; hitSlop?: unknown }[],
  textStyles: [] as Record<string, unknown>[],
  textProps: [] as { numberOfLines?: number; ellipsizeMode?: string }[],
  fontScale: 1,
}))

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {})
  }
  return (style as Record<string, unknown>) ?? {}
}

// WCAG の相対輝度（#RRGGBB）。テーマの面の明暗の向きと 3:1 を確かめる
function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

vi.mock("react-native", () => ({
  Platform: { select: (opts: Record<string, unknown>) => opts.default },
  useWindowDimensions: () => ({ width: 393, height: 852, scale: 3, fontScale: hosts.fontScale }),
  View: ({ children, style }: { children: React.ReactNode; style?: unknown }) => {
    hosts.viewStyles.push(flattenStyle(style))
    return children
  },
  Text: ({
    children,
    style,
    numberOfLines,
    ellipsizeMode,
  }: {
    children: React.ReactNode
    style?: unknown
    numberOfLines?: number
    ellipsizeMode?: string
  }) => {
    hosts.textStyles.push(flattenStyle(style))
    hosts.textProps.push({ numberOfLines, ellipsizeMode })
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
  hosts.textProps = []
  hosts.fontScale = 1
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

      // コンテナ: Web の TabsList(variant="pill") と同じ面・形（切り替え専用の面。issue #863）
      const container = hosts.viewStyles[0]
      expect(container).toMatchObject({
        backgroundColor: theme.surface["pill-track"],
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

      // 選択中は pill-selected + 非選択は transparent（下地はコンテナの pill-track）
      expect(hosts.pressableStyles[0].backgroundColor).toBe(theme.surface["pill-selected"])
      expect(hosts.pressableStyles[1].backgroundColor).toBe("transparent")
      // 選んだ側は外枠より明るい（light / dark とも。dark で明暗が逆になった #863 の再発防止）
      expect(luminance(theme.surface["pill-selected"])).toBeGreaterThan(luminance(theme.surface["pill-track"]))
      // light は従来の Surface-Tertiary / Surface-Primary と同じ色（見た目を変えない）
      if (mode === "light") {
        expect(theme.surface["pill-track"]).toBe(theme.surface.tertiary)
        expect(theme.surface["pill-selected"]).toBe(theme.surface.primary)
      } else {
        // dark は面どうし 3:1 以上（WCAG 1.4.11）
        expect(contrast(theme.surface["pill-selected"], theme.surface["pill-track"])).toBeGreaterThanOrEqual(3)
      }

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

// issue #861: OS の文字の倍率（iOS の実測 fontScale。iPhone 16e シミュレーター・2026-11-13）。
// 標準 1.0 / 標準の最大 1.353 / アクセシビリティ 中 1.786・大 2.143・特大 2.643・最大 3.571
const FONT_SCALES = [
  { fontScale: 1, stacked: false },
  { fontScale: 1.353, stacked: false },
  { fontScale: 1.786, stacked: false },
  { fontScale: 2.143, stacked: true },
  { fontScale: 2.643, stacked: true },
  { fontScale: 3.571, stacked: true },
] as const

const OPTION_SETS = {
  2: [
    { value: "box", label: "入る箱を探す" },
    { value: "shelf", label: "入る棚を探す" },
  ],
  3: [
    { value: "fit", label: "ぴったり" },
    { value: "normal", label: "ふつう" },
    { value: "loose", label: "ゆったり" },
  ],
  4: [
    { value: "fit", label: "ぴったり" },
    { value: "normal", label: "ふつう" },
    { value: "loose", label: "ゆったり" },
    { value: "custom", label: "カスタム" },
  ],
} as const

describe("native PillToggle — 文字の大きさ（#861）", () => {
  it("縦に積む境界は label.sm の行の高さ 18 × fontScale が 36 を超えたとき", () => {
    expect(PILL_TOGGLE_ITEM_MIN_HEIGHT).toBe(36)
    expect(shouldStackPillToggle(2, 18)).toBe(false) // ちょうど 36 は横のまま
    expect(shouldStackPillToggle(2.01, 18)).toBe(true)
    // 倍率が取れない環境（0 / NaN）は従来どおり横
    expect(shouldStackPillToggle(0, 18)).toBe(false)
    expect(shouldStackPillToggle(Number.NaN, 18)).toBe(false)
  })

  for (const { fontScale, stacked } of FONT_SCALES) {
    for (const [count, opts] of Object.entries(OPTION_SETS)) {
      for (const fullWidth of [false, true]) {
        it(`fontScale ${fontScale} / ${count} 択 / fullWidth=${fullWidth}: 省略せず、高さを固定せず、${stacked ? "縦に積む" : "横に並べる"}`, () => {
          hosts.fontScale = fontScale
          renderToStaticMarkup(
            <ThemeProvider>
              <PillToggle options={[...opts]} value={opts[0].value} fullWidth={fullWidth} />
            </ThemeProvider>,
          )
          const container = hosts.viewStyles[0]
          expect(container.flexDirection).toBe(stacked ? "column" : "row")
          if (stacked) {
            expect(container.alignSelf).toBe("stretch")
            expect(container.flexWrap).toBe("nowrap")
          } else {
            expect(container.alignSelf).toBe(fullWidth ? "stretch" : "flex-start")
            expect(container.flexWrap).toBe(fullWidth ? "nowrap" : "wrap")
          }

          expect(hosts.pressableStyles).toHaveLength(opts.length)
          for (const item of hosts.pressableStyles) {
            // 高さは固定しない（旧 height: 36 で文字が枠からはみ出した）。36 は下限
            expect(item.height).toBeUndefined()
            expect(item.minHeight).toBe(36)
            expect(item.paddingVertical).toBeGreaterThan(0)
            if (stacked) {
              expect(item.alignSelf).toBe("stretch")
              expect(item.flex).toBeUndefined()
            } else if (fullWidth) {
              expect(item).toMatchObject({ flex: 1, minWidth: 0 })
            } else {
              // 行より長いラベルは行の幅まで縮めて折り返す（RN の flexShrink 既定 0 だと横にはみ出す）
              expect(item).toMatchObject({ flexShrink: 1 })
            }
          }

          // ラベルは 1 行固定・省略記号にしない（旧: fullWidth で「ぴっ…」）
          for (const t of hosts.textProps) {
            expect(t.numberOfLines).toBeUndefined()
            expect(t.ellipsizeMode).toBeUndefined()
          }
          const labels = hosts.textStyles.slice(0, opts.length)
          for (const label of labels) expect(label).toMatchObject({ flexShrink: 1, textAlign: "center" })

          // 読み上げ（role button・selected）は文字の大きさに関係なく保つ
          expect(hosts.pressableA11y.map((a) => a.role)).toEqual(opts.map(() => "button"))
          expect(hosts.pressableA11y[0].state).toMatchObject({ selected: true })
          // 当たり判定: 横は 36 + 上下 4 で 44。縦に積むと項目自体が 44 超なので隣と重ねない
          for (const a of hosts.pressableA11y) {
            if (stacked) expect(a.hitSlop).toBeUndefined()
            else expect(a.hitSlop).toMatchObject({ top: 4, bottom: 4 })
          }
        })
      }
    }
  }

  it("縦に積むと角丸を全丸から同心の xl / lg に替える（横長の大きな面で角の文字が欠けないように）", () => {
    hosts.fontScale = 3.571
    renderToStaticMarkup(
      <ThemeProvider>
        <PillToggle options={[...OPTION_SETS[2]]} value="box" />
      </ThemeProvider>,
    )
    expect(hosts.viewStyles[0].borderRadius).toBe(18)
    expect(hosts.pressableStyles[0].borderRadius).toBe(14)
  })

  it("count 付きでも、大きな文字で省略せずバッジを残す", () => {
    for (const fontScale of [1, 2.643]) {
      hosts.viewStyles = []
      hosts.textProps = []
      hosts.textStyles = []
      hosts.fontScale = fontScale
      renderToStaticMarkup(
        <ThemeProvider>
          <PillToggle
            fullWidth
            options={[
              { value: "fit", label: "入る", count: 12 },
              { value: "tight", label: "ぎりぎり", count: 3 },
              { value: "no", label: "入らない", count: 0 },
            ]}
            value="fit"
          />
        </ThemeProvider>,
      )
      expect(hosts.viewStyles.filter((s) => s.minWidth === 20)).toHaveLength(3)
      expect(hosts.textProps.every((t) => t.numberOfLines === undefined)).toBe(true)
    }
  })
})
