/**
 * native ProgressRing の線の太さ prop 名（issue #495）。
 *
 * Web は `strokeWidth`、Native は `thickness` という命名ドリフトが #480 以前から
 * 残っていた。Native 側に `strokeWidth` を追加して語彙を揃え、`thickness` は
 * ChipSelector.multiple（#352）と同じく @deprecated + 台帳管理で段階移行する。
 *
 * RN のレンダリングテスト基盤がリポジトリに無いため、native-chip-selector-selection-mode と
 * 同じソーススキャン方式で契約を固定する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const nativeSource = readFileSync(
  join(__dirname, "..", "src/native/components/ProgressRing.tsx"),
  "utf8",
)

const webSource = readFileSync(
  join(__dirname, "..", "src/components/ui/progress-ring.tsx"),
  "utf8",
)

const deprecations = JSON.parse(
  readFileSync(join(__dirname, "..", "contracts/deprecations.json"), "utf8"),
) as {
  deprecations: Array<{
    id: string
    kind: string
    component?: string
    prop?: string
    replacement: string
    removeIn: string
    sources: string[]
  }>
}

describe("native ProgressRing の strokeWidth（#495）", () => {
  it("Web と同じ名前の strokeWidth を宣言している", () => {
    expect(nativeSource).toMatch(/strokeWidth\?: number/)
    expect(webSource).toMatch(/strokeWidth\?: number/)
  })

  it("thickness は @deprecated として型に残す（後方互換）", () => {
    expect(nativeSource).toMatch(/thickness\?: number/)
    expect(nativeSource).toMatch(/@deprecated issue #495/)
  })

  it("両方渡されたら strokeWidth を優先する", () => {
    expect(nativeSource).toContain("strokeWidth ?? thickness ?? 6")
  })

  it("描画は解決後の値だけを参照し、thickness を直接読まない", () => {
    // 本体で thickness を直接使うと、strokeWidth 指定時に古い値で描画される。
    const body = nativeSource.slice(nativeSource.indexOf("const resolvedStrokeWidth"))
    expect(body).not.toMatch(/size - thickness/)
    expect(body).toContain("size - resolvedStrokeWidth * 2")
  })

  it("非推奨の警告は開発ビルドでのみ出す", () => {
    expect(nativeSource).toContain("function isDev()")
    expect(nativeSource).toMatch(/isDev\(\) && thickness !== undefined/)
  })

  it("台帳（contracts/deprecations.json）に登録されている", () => {
    const entry = deprecations.deprecations.find((d) => d.id === "ProgressRing.thickness")
    expect(entry).toBeDefined()
    expect(entry!.kind).toBe("prop")
    expect(entry!.prop).toBe("thickness")
    expect(entry!.replacement).toContain("strokeWidth")
    expect(entry!.removeIn).toBe("2.0.0")
    expect(entry!.sources).toContain("src/native/components/ProgressRing.tsx")
  })
})
