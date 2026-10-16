import * as React from "react"

/**
 * DS 部品が既定で出す文言（読み上げ名・バッジ等）の言語（issue #723）。
 * 既定は "ja"（Provider を置かないときの従来の文言）。
 */
type KskLocale = "ja" | "en"

/**
 * DS 部品の既定文言（issue #723）。部品に prop で文言を渡したときは常にそちらが勝つ。
 */
interface KskLabels {
  /** SkipLink / Screen / AppShell / MarketingShell / AdminShell のスキップリンク */
  skipLink: string
  /** AdminShell mobileDrawer のメニューボタンの読み上げ名 */
  mobileMenu: string
  /** AdminShell mobileDrawer のドロワーの見出し（読み上げ専用） */
  mobileDrawerTitle: string
  /** FormField requiredStyle="pill" の必須バッジ */
  required: string
  /** FormField requiredStyle="pill" の任意バッジ */
  optional: string
  /** DetailSheetHeader / DialogHeader の閉じるボタン（onClose 指定時・issue #722） */
  close: string
  /** MonthCalendarHeader の「今日へ」（issue #721） */
  calendarToday: string
  /** MonthCalendarHeader の前の月ボタンの読み上げ名 */
  calendarPrevMonth: string
  /** MonthCalendarHeader の次の月ボタンの読み上げ名 */
  calendarNextMonth: string
  /** MonthCalendarExpandToggle の読み上げ名（開閉で変えない。状態は aria-expanded） */
  calendarExpand: string
}

const KSK_DEFAULT_LABELS: Record<KskLocale, KskLabels> = {
  ja: {
    skipLink: "コンテンツへ移動",
    mobileMenu: "メニューを開く",
    mobileDrawerTitle: "メニュー",
    required: "必須",
    optional: "任意",
    close: "閉じる",
    calendarToday: "今日へ",
    calendarPrevMonth: "前の月",
    calendarNextMonth: "次の月",
    calendarExpand: "月全体を表示",
  },
  en: {
    skipLink: "Skip to content",
    mobileMenu: "Open menu",
    mobileDrawerTitle: "Menu",
    required: "Required",
    optional: "Optional",
    close: "Close",
    calendarToday: "Today",
    calendarPrevMonth: "Previous month",
    calendarNextMonth: "Next month",
    calendarExpand: "Show full month",
  },
}

interface KskLabelsContextValue {
  /** Provider が無いときは undefined（部品は自分の既定 locale を使う） */
  locale: KskLocale | undefined
  labels: KskLabels
}

const DEFAULT_CONTEXT: KskLabelsContextValue = {
  locale: undefined,
  labels: KSK_DEFAULT_LABELS.ja,
}

const KskLabelsContext = React.createContext<KskLabelsContextValue>(DEFAULT_CONTEXT)

interface KskLabelsProviderProps {
  /**
   * 既定文言の言語。"ja" | "en"。省略時は外側の Provider の locale（無ければ "ja"）。
   * MonthCalendar / AgendaList の `locale` の既定にもなる。
   */
  locale?: KskLocale
  /**
   * 個別に差し替える文言（i18n の t() の結果等）。locale の既定より優先される。
   * 部品に prop で渡した文言はさらに優先される。
   */
  labels?: Partial<KskLabels>
  children?: React.ReactNode
}

/**
 * KskLabelsProvider — DS 部品の既定文言をまとめて切り替える（issue #723）
 *
 * アプリの一番外側に 1 回置く。部品ごとに skipLinkLabel / mobileMenuLabel / closeLabel 等を
 * 渡さなくても、配下の DS 部品の既定文言がこの locale / labels になる。
 *
 * - 優先順位: 部品に渡した prop > この Provider の labels > locale の既定 > 日本語（Provider 無し）
 * - React context なので SSR でリクエスト間に共有されない（`configureToast()` のモジュール変数と違う）
 * - 入れ子にすると内側が外側を上書きする（labels は外側の値に重ねる）
 * - Provider を置かないときの文言は従来どおり日本語（後方互換）
 */
function KskLabelsProvider({ locale, labels, children }: KskLabelsProviderProps) {
  const parent = React.useContext(KskLabelsContext)
  const resolvedLocale = locale ?? parent.locale
  const value = React.useMemo<KskLabelsContextValue>(() => {
    // locale を明示したときはその言語の既定から組み直す。省略時は外側の値に重ねる
    const base = locale ? KSK_DEFAULT_LABELS[locale] : parent.labels
    return { locale: resolvedLocale, labels: { ...base, ...stripUndefined(labels) } }
  }, [locale, resolvedLocale, parent.labels, labels])
  return <KskLabelsContext.Provider value={value}>{children}</KskLabelsContext.Provider>
}

function stripUndefined(labels: Partial<KskLabels> | undefined): Partial<KskLabels> {
  if (!labels) return {}
  const out: Partial<KskLabels> = {}
  for (const key of Object.keys(labels) as (keyof KskLabels)[]) {
    const v = labels[key]
    if (v !== undefined) out[key] = v
  }
  return out
}

/** 配下の DS 既定文言（Provider が無ければ日本語）。 */
function useKskLabels(): KskLabels {
  return React.useContext(KskLabelsContext).labels
}

/** 配下の locale。Provider が無い（または locale を指定していない）ときは undefined。 */
function useKskLocale(): KskLocale | undefined {
  return React.useContext(KskLabelsContext).locale
}

export { KskLabelsProvider, useKskLabels, useKskLocale, KSK_DEFAULT_LABELS }
export type { KskLabels, KskLabelsProviderProps, KskLocale }
