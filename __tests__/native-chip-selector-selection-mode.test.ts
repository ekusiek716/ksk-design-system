/**
 * native ChipSelector の選択意味論（issue #352）。
 *
 * web と同じく、単一選択のときだけ radiogroup / radio + accessibilityState.checked へ
 * 切り替え、`selectionMode` 未指定なら従来の `multiple`（既定 true）から導出する。
 * RN のレンダリングテスト基盤がリポジトリに無いため、native-action-tile-selection-mode と
 * 同じソーススキャン方式で契約を固定する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const source = readFileSync(
  join(__dirname, "..", "src/native/components/ChipSelector.tsx"),
  "utf8",
)

const indexSource = readFileSync(
  join(__dirname, "..", "src/native/components/index.ts"),
  "utf8",
)

describe("native ChipSelector の selectionMode（#352）", () => {
  it("web / QuickActionGrid と同じ語彙の型を持ち、export されている", () => {
    expect(source).toContain('export type ChipSelectorSelectionMode = "single" | "multiple"')
    expect(source).toMatch(/selectionMode\?: ChipSelectorSelectionMode/)
    expect(indexSource).toContain("type ChipSelectorSelectionMode,")
  })

  it("multiple は @deprecated として型に残す（後方互換）", () => {
    expect(source).toContain("multiple?: boolean")
    expect(source).toMatch(/@deprecated issue #352/)
  })

  it("selectionMode があればそれが正本、無ければ multiple から導出する", () => {
    expect(source).toContain(
      'const isMultiple = selectionMode ? selectionMode === "multiple" : multiple',
    )
    expect(source).toContain("multiple = true,")
  })

  it("単一選択のときグループが radiogroup ロールを持つ", () => {
    expect(source).toContain('accessibilityRole={isRadio ? "radiogroup" : undefined}')
  })

  it("単一選択のチップは radio ロール + checked（selected と二重化しない）", () => {
    expect(source).toContain('accessibilityRole={isRadio ? "radio" : undefined}')
    expect(source).toContain(
      "accessibilityState={isRadio ? { checked: selected, selected: undefined } : undefined}",
    )
  })

  it("単一選択で選択中の値が 2 つ以上あるとき開発ビルドで警告する", () => {
    expect(source).toContain("if (isDev() && isRadio && values.length > 1)")
    // proc の存在を先に必須にする。省略すると process 自体が無い環境で
    // undefined との比較が true になり、本番でも警告が出続ける
    expect(source).toMatch(/Boolean\(proc\) && proc!\.env\?\.NODE_ENV !== "production"/)
  })
})
