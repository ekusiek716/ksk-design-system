/**
 * native ActionTile / QuickActionGrid の選択意味論（issue #318）。
 *
 * web と同じく、selectionMode="single" のときだけ radiogroup / radio +
 * accessibilityState.checked へ切り替え、未指定なら従来の button + selected を保つ。
 * RN のレンダリングテスト基盤がリポジトリに無いため、native-swipe-row-a11y と同じ
 * ソーススキャン方式で契約を固定する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const source = readFileSync(
  join(__dirname, "..", "src/native/components/QuickActionGrid.tsx"),
  "utf8",
)

const indexSource = readFileSync(
  join(__dirname, "..", "src/native/components/index.ts"),
  "utf8",
)

describe("native QuickActionGrid の selectionMode（#318）", () => {
  it("web と同じ語彙の型を持ち、export されている", () => {
    expect(source).toContain('export type QuickActionGridSelectionMode = "single" | "multiple"')
    expect(source).toMatch(/selectionMode\?: QuickActionGridSelectionMode/)
    expect(indexSource).toContain("type QuickActionGridSelectionMode,")
  })

  it("grid → tile の受け渡しは Context で行い、grid 外の tile は従来挙動になる", () => {
    expect(source).toContain(
      "const QuickActionGridSelectionContext = React.createContext<QuickActionGridSelectionMode | null>(null)",
    )
    // 未指定でも必ず Provider を置いて null を流す（置かないと入れ子の内側グリッドが
    // 外側の single 文脈を引き継いで勝手に radio 化する）
    expect(source).toContain(
      "QuickActionGridSelectionContext.Provider value={selectionMode ?? null}",
    )
    expect(source).not.toContain("if (!selectionMode) return grid")
  })

  it("tile の明示 prop が親 grid より優先される", () => {
    expect(source).toContain(
      'const isRadio = (selectionMode ?? contextSelectionMode) === "single"',
    )
  })

  it("single のとき radio ロール、それ以外は従来どおり button", () => {
    expect(source).toContain(
      'accessibilityRole={accessibilityRole ?? (isRadio ? "radio" : "button")}',
    )
  })

  it("single では checked、それ以外は selected を出す（意味論を二重化しない）", () => {
    expect(source).toContain(
      "...(isRadio ? { checked: isSelected } : { selected: isSelected }),",
    )
  })

  it("grid は single のとき radiogroup ロールを持つ", () => {
    expect(source).toContain(
      'accessibilityRole={selectionMode === "single" ? "radiogroup" : undefined}',
    )
  })

  it("single で選択中の子が 2 つ以上あるとき開発ビルドで警告する", () => {
    expect(source).toContain('if (isDev() && selectionMode === "single")')
    expect(source).toContain('child.props.selected === true || child.props.variant === "selected"')
    expect(source).toContain("if (selectedCount > 1)")
    // proc の存在を先に必須にする。省略すると process 自体が無い環境で
    // undefined との比較が true になり、本番でも警告が出続ける
    expect(source).toMatch(/Boolean\(proc\) && proc!\.env\?\.NODE_ENV !== "production"/)
  })

  it("呼び出し側の accessibilityRole / accessibilityState は既定より優先される（非破壊）", () => {
    expect(source).toMatch(/accessibilityRole \?\?/)
    expect(source).toMatch(/\.\.\.accessibilityState,/)
  })
})
