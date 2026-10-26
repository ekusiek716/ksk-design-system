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
const kskLabelsSource = readFileSync(
  join(__dirname, "..", "src/components/ui/ksk-labels.tsx"),
  "utf8",
)
const overlaySource = readFileSync(
  join(__dirname, "..", "src/components/patterns/coach-mark-overlay.tsx"),
  "utf8",
)

describe("CoachMark のボタン文言 prop（#477）", () => {
  it("nextLabel / skipLabel を受け取り、既定は現行文言（後方互換）", () => {
    // 既定は KskLabelsProvider（useKskLabels）経由。Provider 無しの日本語は ksk-labels.tsx の ja が持つ
    expect(coachMarkSource).toContain("nextLabelProp ?? defaultLabels.coachMarkNext")
    expect(coachMarkSource).toContain("skipLabelProp ?? defaultLabels.coachMarkSkip")
    expect(kskLabelsSource).toContain('coachMarkNext: "次へ →"')
    expect(kskLabelsSource).toContain('coachMarkSkip: "スキップ"')
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
      "ariaLabelProp ?? (typeof content === \"string\" ? content : defaultLabels.coachMarkLabel)",
    )
    expect(kskLabelsSource).toContain('coachMarkLabel: "コーチマーク"')
  })
})

describe("CoachMarkOverlay の labels prop（#477）", () => {
  it("labels の未指定キーは KskLabelsProvider の既定で埋める（Provider 無しは従来の文言）", () => {
    expect(overlaySource).not.toContain("const DEFAULT_LABELS = {")
    expect(overlaySource).toContain("next: labels?.next ?? defaultLabels.coachMarkNext")
    expect(overlaySource).toContain("skip: labels?.skip ?? defaultLabels.coachMarkSkip")
    expect(overlaySource).toContain("ariaLabel: labels?.ariaLabel ?? defaultLabels.coachMarkOverlayLabel")
    // Provider 無しの文言は変えない（aria-label は従来どおり英語の "Onboarding coach mark"）
    expect(kskLabelsSource).toContain('coachMarkNext: "次へ →"')
    expect(kskLabelsSource).toContain('coachMarkSkip: "スキップ"')
    expect(kskLabelsSource).toContain('coachMarkOverlayLabel: "Onboarding coach mark"')
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
