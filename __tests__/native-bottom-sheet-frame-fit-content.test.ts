import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * native BottomSheetFrame の内容量追従・safe-area・ハンドル（issue #448）と、
 * native Sheet の面色上書き（同 issue）。
 *
 * aikoibito の DS 適用（aikoibito#194）で BottomSheet 13箇所の置換を見送った
 * 直接原因が「高さが preset 固定・bottom safe-area とハンドルが無い・シートの
 * 面色が surface.primary 固定」だった。既定はすべて従来どおりに据え置く
 * （既定を変えると既存 consumer のシートが一斉に変わるため）。
 *
 * RN のレンダリングテスト基盤がリポジトリに無いため、native-card-radius と
 * 同じソーススキャン方式で契約を固定する。
 */
const frameSource = readFileSync(
  join(__dirname, "..", "src/native/components/BottomSheetFrame.tsx"),
  "utf8",
)
const sheetSource = readFileSync(
  join(__dirname, "..", "src/native/components/Sheet.tsx"),
  "utf8",
)

describe("native BottomSheetFrame の内容量追従モード（#448）", () => {
  it("height prop が preset / fitContent の2値である", () => {
    expect(frameSource).toContain(
      'export type BottomSheetFrameHeight = "preset" | "fitContent"',
    )
  })

  it("既定は preset（従来の固定高）のまま据え置かれている", () => {
    expect(frameSource).toMatch(/height = "preset"/)
  })

  it("fitContent では preset 由来の maxHeight / minHeight を外す", () => {
    expect(frameSource).toContain(
      "const maxHeight = maxHeightProp ?? (fitContent ? undefined : presetMaxHeight)",
    )
    expect(frameSource).toContain(
      'minHeight: !fitContent && preset === "mobile-full" ? 360 : undefined',
    )
  })

  it("fitContent では本文を flex:1 にせず中身の高さに追従させる", () => {
    expect(frameSource).toContain(
      'const bodySizing: ViewStyle = fitContent ? { flexGrow: 0, flexShrink: 1 } : { flex: 1 }',
    )
  })

  it("maxHeight prop で上限だけ明示できる", () => {
    expect(frameSource).toContain("maxHeight?: number")
  })
})

describe("native BottomSheetFrame の safe-area とハンドル（#448）", () => {
  it("safeArea は既定 false（後方互換）で、bottom inset を共通関数で解決する", () => {
    expect(frameSource).toMatch(/safeArea = false/)
    expect(frameSource).toContain('resolveInsetEdge(insets, "bottom", safeArea)')
    expect(frameSource).toContain(
      "paddingBottom: bottomInset > 0 ? bottomInset : undefined",
    )
  })

  it("handle は既定 false で、有効時のみつまみを描画する", () => {
    expect(frameSource).toMatch(/handle = false/)
    expect(frameSource).toContain("{handle && (")
  })

  it("つまみの色は theme トークン経由で、生の色をハードコードしない", () => {
    expect(frameSource).toContain('backgroundColor: theme.border["medium-emphasis"]')
    expect(frameSource).not.toMatch(/backgroundColor:\s*"#/)
  })
})

describe("native Sheet の面色上書き（#448）", () => {
  it("surfaceColor prop を持つ", () => {
    expect(sheetSource).toContain("surfaceColor?: string")
  })

  it("既定は theme.surface.primary（従来どおり）で、パネル・footer 双方に効く", () => {
    const uses = sheetSource.match(/surfaceColor \?\? theme\.surface\.primary/g) ?? []
    // PlainSheet のパネル / SnapBottomSheet のパネル / snap footer の3箇所
    expect(uses).toHaveLength(3)
  })

  it("scrim（overlay）の色は surfaceColor の影響を受けない", () => {
    expect(sheetSource).toContain("backgroundColor: theme.overlay.dark")
  })
})
