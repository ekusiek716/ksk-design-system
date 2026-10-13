#!/usr/bin/env node
// =============================================================
// KSK Design System — 例外台帳（test/known-exceptions.json）の検査
//
// - 全区分（a11y / contrast / visual）の形式と見直し期限（reviewBy）
// - a11y 区分とストーリー側の axe ルール無効化の双方向突き合わせ
//   （未登録の無効化・使われていない登録の両方を失敗にする）
//
// contrast 区分の「使われていない登録」は scripts/check-contrast.mjs が、
// visual 区分の「存在しない場面」は scripts/check-visual.mjs と
// test/visual/orphans.test.mjs が検査する（検査ペア・撮影場面の正本を
// 持っている側で判定するため）。
//
// 実行: node scripts/check-known-exceptions.mjs（npm run check に組み込み済み）
// =============================================================
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { LEDGER_PATH, WARN_WITHIN_DAYS, crossCheckA11y, loadKnownExceptions, scanStoryA11yOverrides, todayIso, upcomingReviews, validateSection } from "./lib/known-exceptions.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const today = todayIso()
const ledger = loadKnownExceptions(root)
const errors = [
  ...validateSection("a11y", ledger.a11y, today),
  ...validateSection("contrast", ledger.contrast, today),
  ...validateSection("visual", ledger.visual, today),
  ...crossCheckA11y(ledger.a11y, scanStoryA11yOverrides(root)),
]
for (const entry of ledger.visual) {
  if (!Number.isInteger(entry.maxChangedPixels) || entry.maxChangedPixels < 1) errors.push(`visual: ${entry.scenario} の maxChangedPixels は 1 以上の整数で書いてください`)
}

// 期限が近い登録は失敗にせず警告だけ出す（期限日に無関係な PR が一斉に止まらないように）。
const warnings = ["a11y", "contrast", "visual"].flatMap((s) => upcomingReviews(s, ledger[s], today))
for (const warning of warnings) console.warn(`⚠ 見直し期限が ${WARN_WITHIN_DAYS} 日以内: ${warning}`)

if (errors.length) {
  console.error(`✗ ${LEDGER_PATH} の検査で ${errors.length} 件の問題:`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}
const counts = ["a11y", "contrast", "visual"].map((s) => `${s} ${ledger[s].length}`).join(" / ")
console.log(`✓ 例外台帳 OK（${counts}・基準日 ${today} UTC・期限間近 ${warnings.length}）`)
