import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * CoachMark / CoachMarkOverlay のボタン文言 i18n（issue #477）。
 *
 * 「スキップ」「次へ →」がリテラル直書きで、consumer から差し替える口が
 * 無かった（本文の title/desc だけ i18n できる状態）。あわせて最終ステップ
 * でも「次へ →」のままだったため、labels prop と done フォールバックを追加した。
 *
 * CoachMark は Radix Tooltip Portal、CoachMarkOverlay は createPortal +
 * useSyncExternalStore（getServerSnapshot=false）に依存していて
 * react-dom/server では中身が出ない。リポジトリに jsdom 基盤が無いため、
 * native-search-bar-a11y と同じソーススキャン方式で契約を固定する。
 * 実際の表示は coach-mark-overlay.stories.tsx の LocalizedLabels ストーリーで確認する。
 */
const coachMarkSource = readFileSync(
  join(__dirname, "..", "src/components/ui/coach-mark.tsx"),
  "utf8",
)
const overlaySource = readFileSync(
  join(__dirname, "..", "src/components/patterns/coach-mark-overlay.tsx"),
  "utf8",
)

describe("CoachMark のボタン文言 prop（#477）", () => {
  it("nextLabel / skipLabel を受け取り、既定は現行文言（後方互換）", () => {
    expect(coachMarkSource).toContain('nextLabel = "次へ →"')
    expect(coachMarkSource).toContain('skipLabel = "スキップ"')
  })

  it("ボタンはリテラルではなく prop を描画する", () => {
    expect(coachMarkSource).toContain("{nextLabel}")
    expect(coachMarkSource).toContain("{skipLabel}")
    // リテラル直書きが復活していないこと（JSX テキストノードとしての出現）
    expect(coachMarkSource).not.toMatch(/^\s*次へ →\s*$/m)
    expect(coachMarkSource).not.toMatch(/^\s*スキップ\s*$/m)
  })

  it("ariaLabel prop で上書きでき、未指定時は従来のフォールバックを保つ", () => {
    expect(coachMarkSource).toContain(
      'ariaLabelProp ?? (typeof content === "string" ? content : "コーチマーク")',
    )
  })
})

describe("CoachMarkOverlay の labels prop（#477）", () => {
  it("labels の未指定キーは既定値で埋める", () => {
    expect(overlaySource).toContain("const DEFAULT_LABELS = {")
    expect(overlaySource).toContain('next: "次へ →"')
    expect(overlaySource).toContain('skip: "スキップ"')
    expect(overlaySource).toContain('ariaLabel: "Onboarding coach mark"')
    expect(overlaySource).toContain("const resolvedLabels = { ...DEFAULT_LABELS, ...labels }")
  })

  it("最終ステップは done（未指定なら next）を使う", () => {
    expect(overlaySource).toContain(
      "nextLabel={isLast ? (resolvedLabels.done ?? resolvedLabels.next) : resolvedLabels.next}",
    )
  })

  it("skip / aria-label も labels から渡す", () => {
    expect(overlaySource).toContain("skipLabel={resolvedLabels.skip}")
    expect(overlaySource).toContain("aria-label={resolvedLabels.ariaLabel}")
    expect(overlaySource).not.toContain('aria-label="Onboarding coach mark"')
  })
})
