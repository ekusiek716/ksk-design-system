// issue #746 レビュー: KskLabels に後から足したキー（ratingGroup / ratingValue / ratingStar）は optional。
// v2.17.0 までのキーだけで型付けした完全な翻訳オブジェクトが、そのまま KskLabels として型チェックを通ること
// （tsconfig.type-tests.json → npm run check で検査）。
import * as React from "react"
import type { KskLabels, ResolvedKskLabels } from "../../src/index"
import { KskLabelsProvider, KSK_DEFAULT_LABELS, useKskLabels } from "../../src/index"

// v2.17.0 時点の全キー（新キーなし）
const v217Labels = {
  skipLink: "Skip to content",
  mobileMenu: "Open menu",
  mobileDrawerTitle: "Menu",
  required: "Required",
  optional: "Optional",
  close: "Close",
  back: "Back",
  share: "Share",
  calendarToday: "Today",
  calendarPrevMonth: "Previous month",
  calendarNextMonth: "Next month",
  calendarExpand: "Show full month",
}

// consumer が「完全な翻訳オブジェクト」として型付けしていた書き方
export const typed: KskLabels = v217Labels
export const record: Record<"fr", KskLabels> = { fr: v217Labels }
export const provider = <KskLabelsProvider labels={v217Labels}>x</KskLabelsProvider>

// 既定値と hook の戻り値は全キー解決済み（新キーも string）
export const defaults: ResolvedKskLabels = KSK_DEFAULT_LABELS.en
export function useRatingGroup(): string {
  return useKskLabels().ratingGroup
}
export const fromDefaults: KskLabels = KSK_DEFAULT_LABELS.ja

// 既存キーは従来どおり必須（新キーだけ optional）
const { skipLink: _omitted, ...withoutSkipLink } = v217Labels
// @ts-expect-error skipLink が無い
export const missingOld: KskLabels = withoutSkipLink
export const _unused = _omitted

export const _react = React
