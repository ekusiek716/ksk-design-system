import * as React from "react"

/**
 * DS 部品が既定で出す文言（読み上げ名・バッジ等）の言語（issue #723）。
 * 既定は "ja"（Provider を置かないときの従来の文言）。
 */
type KskLocale = "ja" | "en"

/**
 * DS 部品の既定文言（issue #723）。部品に prop で文言を渡したときは常にそちらが勝つ。
 * v2.17.0 より後に足したキーは optional（consumer が型付けした完全な翻訳オブジェクトを minor アップで壊さないため。
 * 省略時は locale の既定 → 日本語で補う）。部品の中では `ResolvedKskLabels`（全キー必須）で扱う。
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
  /** DetailSheetHeader / DialogHeader の閉じるボタン（onClose 指定時・issue #722）・NavigationBar leftIcon="close" */
  close: string
  /** NavigationBar の戻るボタン（leftIcon="back"） */
  back: string
  /** NavigationBar のシェアボタン */
  share: string
  /** MonthCalendarHeader の「今日へ」（issue #721） */
  calendarToday: string
  /** MonthCalendarHeader の前の月ボタンの読み上げ名 */
  calendarPrevMonth: string
  /** MonthCalendarHeader の次の月ボタンの読み上げ名 */
  calendarNextMonth: string
  /** MonthCalendarExpandToggle の読み上げ名（開閉で変えない。状態は aria-expanded） */
  calendarExpand: string
  /** StarRating（入力用）の radiogroup の読み上げ名。FormField as="group" の中では使わず見出しで名付ける（issue #746） */
  ratingGroup?: string
  /** StarRating（表示専用・role="img"）の読み上げ名。`{value}` / `{max}` を値に置き換える（issue #746） */
  ratingValue?: string
  /** StarRating（入力用）の各星（radio）の読み上げ名。`{value}` / `{max}` を値に置き換える（issue #746） */
  ratingStar?: string
  /** KebabMenu のトリガー（縦三点ボタン）の読み上げ名（issue #752） */
  menu?: string
  /** Pagination の nav の読み上げ名（aria-label） */
  paginationNav?: string
  /** PaginationPrevious の読み上げ名とボタン文言 */
  paginationPrevious?: string
  /** PaginationNext の読み上げ名とボタン文言 */
  paginationNext?: string
  /** PaginationEllipsis（省略記号）の読み上げ名 */
  paginationEllipsis?: string
  /** SimplePagination の nav の読み上げ名（aria-label） */
  simplePaginationNav?: string
  /** SimplePagination の「前へ」ボタンの文言と読み上げ名 */
  simplePaginationPrevious?: string
  /** SimplePagination の「次へ」ボタンの文言と読み上げ名 */
  simplePaginationNext?: string
  /** Spinner の読み上げ名（role="status"） */
  spinnerLoading?: string
  /** Breadcrumb の nav の読み上げ名（aria-label） */
  breadcrumbNav?: string
  /** Combobox の候補が 0 件のときの表示 */
  comboboxEmpty?: string
  /** MultiSelect の候補が 0 件のときの表示 */
  multiSelectEmpty?: string
  /** MultiSelect の選択クリアボタンの読み上げ名 */
  multiSelectClear?: string
  /** NumberInput の減らすボタンの読み上げ名 */
  numberInputDecrement?: string
  /** NumberInput の増やすボタンの読み上げ名 */
  numberInputIncrement?: string
  /** ImageGallery のメイン画像・サムネイル・ドットの読み上げ名と alt の既定。`{index}` を 1 始まりの番号に置き換える */
  imageGalleryImage?: string
  /** ImageGallery の前の画像ボタンの読み上げ名 */
  imageGalleryPrev?: string
  /** ImageGallery の次の画像ボタンの読み上げ名 */
  imageGalleryNext?: string
  /** DropdownFilter の「すべて」（絞り込み解除）の文言 */
  dropdownFilterAll?: string
  /** SectionNav の nav の読み上げ名（aria-label） */
  sectionNav?: string
  /** SyncStatusBadge の同期中の文言 */
  syncStatusSyncing?: string
  /** SyncStatusBadge のエラー件数の文言。`{count}` を件数に置き換える。英語の単複（1 error / 2 errors）は文言では出し分けられないので、必要なら errorLabel（関数 prop）で渡す */
  syncStatusError?: string
  /** SyncStatusBadge の保存済みの文言 */
  syncStatusSaved?: string
  /** SyncStatusBadge のオフラインの文言 */
  syncStatusOffline?: string
  /** SyncStatusBadge の再試行ボタンの文言 */
  syncStatusRetry?: string
  /** CountdownTimer / CountdownHero の「残り」の見出し */
  countdownRemaining?: string
  /** CountdownTimer の終了後の文言 */
  countdownEnded?: string
  /** CountdownTimer / CountdownHero の当日の文言 */
  countdownToday?: string
  /** CountdownHero の期日を過ぎたあとの文言 */
  countdownPast?: string
  /** CoachMark の次へボタンの文言 */
  coachMarkNext?: string
  /** CoachMark のバルーンの読み上げ名（content が string でないときの既定） */
  coachMarkLabel?: string
  /** CoachMark のスキップボタンの文言 */
  coachMarkSkip?: string
  /** ShareButtons の email ボタンの文言 */
  shareEmail?: string
  /** ShareButtons の copy（リンクをコピー）ボタンの文言 */
  shareLink?: string
  /** ShareButtons のコピー成功の文言 */
  shareCopied?: string
  /** ShareButtons のコピー失敗の文言 */
  shareCopyError?: string
  /** BottomSheetForm の保存（送信）ボタンの文言 */
  bottomSheetFormSubmit?: string
  /** BottomSheetForm の保存中（送信中）の文言 */
  bottomSheetFormSaving?: string
  /** BottomSheetForm のキャンセルボタンの文言 */
  bottomSheetFormCancel?: string
  /** CodeDisplay のコピーボタンの文言 */
  codeDisplayCopy?: string
  /** CodeDisplay のコピー成功の文言 */
  codeDisplayCopied?: string
  /** CodeDisplay のコピー失敗の文言 */
  codeDisplayCopyError?: string
  /** ErrorState の再試行ボタンの文言 */
  errorStateRetry?: string
  /** Celebration の閉じるボタンの文言と読み上げ名 */
  celebrationDismiss?: string
}

/** 全キーを解決済みの文言（部品の中・既定値で使う）。 */
type ResolvedKskLabels = Required<KskLabels>

const KSK_DEFAULT_LABELS: Record<KskLocale, ResolvedKskLabels> = {
  ja: {
    skipLink: "コンテンツへ移動",
    mobileMenu: "メニューを開く",
    mobileDrawerTitle: "メニュー",
    required: "必須",
    optional: "任意",
    close: "閉じる",
    back: "戻る",
    share: "シェア",
    calendarToday: "今日へ",
    calendarPrevMonth: "前の月",
    calendarNextMonth: "次の月",
    calendarExpand: "月全体を表示",
    ratingGroup: "評価",
    ratingValue: "{value}/{max}点",
    ratingStar: "{value}点",
    menu: "メニュー",
    paginationNav: "ページネーション",
    paginationPrevious: "前へ",
    paginationNext: "次へ",
    paginationEllipsis: "その他のページ",
    simplePaginationNav: "ページネーション",
    simplePaginationPrevious: "前へ",
    simplePaginationNext: "次へ",
    spinnerLoading: "読み込み中",
    breadcrumbNav: "パンくずリスト",
    comboboxEmpty: "該当なし",
    multiSelectEmpty: "該当なし",
    multiSelectClear: "選択をクリア",
    numberInputDecrement: "減らす",
    numberInputIncrement: "増やす",
    imageGalleryImage: "画像 {index}",
    imageGalleryPrev: "前の画像",
    imageGalleryNext: "次の画像",
    dropdownFilterAll: "すべて",
    sectionNav: "ページ内セクション",
    syncStatusSyncing: "同期中",
    syncStatusError: "{count}件のエラー",
    syncStatusSaved: "保存済み",
    syncStatusOffline: "オフライン",
    syncStatusRetry: "再試行",
    countdownRemaining: "残り",
    countdownEnded: "受付終了",
    countdownToday: "本日",
    countdownPast: "経過",
    coachMarkNext: "次へ →",
    coachMarkSkip: "スキップ",
    coachMarkLabel: "コーチマーク",
    shareEmail: "メール",
    shareLink: "リンク",
    shareCopied: "コピーしました",
    shareCopyError: "コピーできませんでした",
    bottomSheetFormSubmit: "保存",
    bottomSheetFormSaving: "保存中…",
    bottomSheetFormCancel: "キャンセル",
    codeDisplayCopy: "コピー",
    codeDisplayCopied: "コピーしました",
    codeDisplayCopyError: "コピーできませんでした",
    errorStateRetry: "再試行",
    celebrationDismiss: "閉じる",
  },
  en: {
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
    ratingGroup: "Rating",
    ratingValue: "Rated {value} of {max}",
    ratingStar: "{value} of {max}",
    menu: "Menu",
    paginationNav: "Pagination",
    paginationPrevious: "Previous",
    paginationNext: "Next",
    paginationEllipsis: "More pages",
    simplePaginationNav: "Pagination",
    simplePaginationPrevious: "Previous",
    simplePaginationNext: "Next",
    spinnerLoading: "Loading",
    breadcrumbNav: "Breadcrumb",
    comboboxEmpty: "No results",
    multiSelectEmpty: "No results",
    multiSelectClear: "Clear selection",
    numberInputDecrement: "Decrease",
    numberInputIncrement: "Increase",
    imageGalleryImage: "Image {index}",
    imageGalleryPrev: "Previous image",
    imageGalleryNext: "Next image",
    dropdownFilterAll: "All",
    sectionNav: "On this page",
    syncStatusSyncing: "Syncing",
    syncStatusError: "{count} errors",
    syncStatusSaved: "Saved",
    syncStatusOffline: "Offline",
    syncStatusRetry: "Retry",
    countdownRemaining: "Time left",
    countdownEnded: "Closed",
    countdownToday: "Today",
    countdownPast: "Elapsed",
    coachMarkNext: "Next →",
    coachMarkSkip: "Skip",
    coachMarkLabel: "Coach mark",
    shareEmail: "Email",
    shareLink: "Link",
    shareCopied: "Copied",
    shareCopyError: "Could not copy",
    bottomSheetFormSubmit: "Save",
    bottomSheetFormSaving: "Saving…",
    bottomSheetFormCancel: "Cancel",
    codeDisplayCopy: "Copy",
    codeDisplayCopied: "Copied",
    codeDisplayCopyError: "Could not copy",
    errorStateRetry: "Retry",
    celebrationDismiss: "Close",
  },
}

interface KskLabelsContextValue {
  /** Provider が無いときは undefined（部品は自分の既定 locale を使う） */
  locale: KskLocale | undefined
  labels: ResolvedKskLabels
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
  // labels はインラインのオブジェクトで渡されることが多いので、キー単位で比較して同じなら前回の参照を使う
  // （毎レンダーで context 値が変わり、配下の DS 部品が全部再レンダーされるのを防ぐ）
  const stableLabels = useShallowStable(stripUndefined(labels))
  const value = React.useMemo<KskLabelsContextValue>(() => {
    // locale を明示したときはその言語の既定から組み直す。省略時は外側の値に重ねる
    const base = locale ? KSK_DEFAULT_LABELS[locale] : parent.labels
    return { locale: resolvedLocale, labels: { ...base, ...stableLabels } }
  }, [locale, resolvedLocale, parent.labels, stableLabels])
  return <KskLabelsContext.Provider value={value}>{children}</KskLabelsContext.Provider>
}

/**
 * キーと値が前回と同じなら前回のオブジェクトを返す。
 * 前回値との比較で render 中にそろえる（React の推奨パターン。ref を render 中に読まない）
 */
function useShallowStable<T extends object>(next: T): T {
  const [stable, setStable] = React.useState(next)
  if (!shallowEqual(stable, next)) {
    setStable(next)
    return next
  }
  return stable
}

function shallowEqual(a: object, b: object): boolean {
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  return (
    ak.length === bk.length &&
    bk.every((k) => (a as Record<string, unknown>)[k] === (b as Record<string, unknown>)[k])
  )
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

/**
 * 文言の `{value}` / `{max}` 等の差し込み口を値に置き換える（issue #746）。
 * 値の無い差し込み口はそのまま残す。
 */
function formatKskLabel(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match
  )
}

/** 配下の DS 既定文言（Provider が無ければ日本語）。 */
function useKskLabels(): ResolvedKskLabels {
  return React.useContext(KskLabelsContext).labels
}

/** 配下の locale。Provider が無い（または locale を指定していない）ときは undefined。 */
function useKskLocale(): KskLocale | undefined {
  return React.useContext(KskLabelsContext).locale
}

export { KskLabelsProvider, useKskLabels, useKskLocale, KSK_DEFAULT_LABELS, formatKskLabel }
export type { KskLabels, KskLabelsProviderProps, KskLocale, ResolvedKskLabels }
