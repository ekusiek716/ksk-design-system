/**
 * @vitest-environment jsdom
 *
 * KskLabelsProvider（issue #723）。DS 部品の既定文言をまとめて切り替える。
 * Provider を置かないときの文言・DOM は従来どおり日本語。
 */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { KskLabelsProvider, useKskLabels } from "../src/components/ui/ksk-labels"
import { SkipLink } from "../src/components/ui/skip-link"
import { FormField } from "../src/components/patterns/form-field"
import { Screen } from "../src/components/patterns/screen"
import { AppShell } from "../src/components/patterns/shells/app-shell"
import { MarketingShell } from "../src/components/patterns/shells/marketing-shell"
import { AdminShell } from "../src/components/patterns/shells/admin-shell"
import { MonthCalendar } from "../src/components/patterns/month-calendar"
import { AgendaList } from "../src/components/patterns/agenda-list"
import { NavigationBar } from "../src/components/ui/navigation-bar"
import { KSK_DEFAULT_LABELS } from "../src/components/ui/ksk-labels"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const pill = (required: boolean) => (
  <FormField label="名前" requiredStyle="pill" required={required}>
    <input />
  </FormField>
)

describe("KskLabelsProvider", () => {
  it("Provider 無しは従来どおり日本語（DOM も同じ）", () => {
    expect(renderToStaticMarkup(<SkipLink targetId="m" />)).toContain(">コンテンツへ移動</a>")
    expect(renderToStaticMarkup(pill(true))).toContain(">必須</span>")
    expect(renderToStaticMarkup(pill(false))).toContain(">任意</span>")
    const admin = renderToStaticMarkup(<AdminShell sidebar={<nav />} mobileDrawer />)
    expect(admin).toContain('aria-label="メニューを開く"')
    expect(admin).toContain(">コンテンツへ移動</a>")
  })

  it('locale="en" で skip link・メニュー・必須/任意が英語になる', () => {
    const wrap = (node: React.ReactNode) => renderToStaticMarkup(<KskLabelsProvider locale="en">{node}</KskLabelsProvider>)
    expect(wrap(<SkipLink targetId="m" />)).toContain(">Skip to content</a>")
    expect(wrap(pill(true))).toContain(">Required</span>")
    expect(wrap(pill(false))).toContain(">Optional</span>")
    expect(wrap(<Screen>本文</Screen>)).toContain(">Skip to content</a>")
    expect(wrap(<AppShell>本文</AppShell>)).toContain(">Skip to content</a>")
    expect(wrap(<MarketingShell>本文</MarketingShell>)).toContain(">Skip to content</a>")
    expect(wrap(<AdminShell sidebar={<nav />} mobileDrawer />)).toContain('aria-label="Open menu"')
  })

  it("部品に渡した prop > labels > locale の既定", () => {
    const html = renderToStaticMarkup(
      <KskLabelsProvider locale="en" labels={{ skipLink: "本文へ" }}>
        <SkipLink targetId="a" />
        <SkipLink targetId="b" label="明示" />
      </KskLabelsProvider>
    )
    expect(html).toContain(">本文へ</a>")
    expect(html).toContain(">明示</a>")
  })

  it("入れ子の labels は外側に重ね、locale を指定した内側はその言語から組み直す", () => {
    let seen: ReturnType<typeof useKskLabels> | undefined
    let seenInnerLocale: ReturnType<typeof useKskLabels> | undefined
    const Probe = ({ onLabels }: { onLabels: (l: ReturnType<typeof useKskLabels>) => void }) => {
      onLabels(useKskLabels())
      return null
    }
    renderToStaticMarkup(
      <KskLabelsProvider locale="en" labels={{ close: "Dismiss" }}>
        <KskLabelsProvider labels={{ required: "Must" }}>
          <Probe onLabels={(l) => (seen = l)} />
        </KskLabelsProvider>
        <KskLabelsProvider locale="ja">
          <Probe onLabels={(l) => (seenInnerLocale = l)} />
        </KskLabelsProvider>
      </KskLabelsProvider>
    )
    expect(seen?.close).toBe("Dismiss")
    expect(seen?.required).toBe("Must")
    expect(seen?.skipLink).toBe("Skip to content")
    expect(seenInnerLocale?.close).toBe("閉じる")
  })

  it("skipLinkLabel={null} / \"\" は従来どおりスキップリンクを出さない", () => {
    expect(renderToStaticMarkup(<AppShell skipLinkLabel={null}>x</AppShell>)).not.toContain("<a")
    expect(renderToStaticMarkup(<Screen skipLinkLabel="">x</Screen>)).not.toContain("Skip")
    expect(renderToStaticMarkup(<Screen skipLinkLabel="">x</Screen>)).not.toContain("コンテンツへ移動")
  })

  it("MonthCalendar / AgendaList の locale 既定は Provider の locale（明示 locale が勝つ）", () => {
    const events = [{ id: "1", date: "2026-10-03", label: "打合せ" }]
    const en = renderToStaticMarkup(
      <KskLabelsProvider locale="en">
        <MonthCalendar month="2026-10" today="2026-10-01" events={events} />
        <AgendaList events={events} today="2026-10-01" />
      </KskLabelsProvider>
    )
    expect(en).toContain('aria-label="October 2026"')
    expect(en).toContain(">Sun<")
    const explicit = renderToStaticMarkup(
      <KskLabelsProvider locale="en">
        <MonthCalendar month="2026-10" today="2026-10-01" locale="ja" />
      </KskLabelsProvider>
    )
    expect(explicit).toContain('aria-label="2026年10月"')
    expect(renderToStaticMarkup(<MonthCalendar month="2026-10" today="2026-10-01" />)).toContain('aria-label="2026年10月"')
  })

  it("Provider 無しの既定文言（ja）は従来の日本語と 1 文字も違わない（全キー固定）", () => {
    // 後方互換の正本。キーを足す・文言を変えるときは必ずここを意図して更新する（toMatchObject にしない）。
    // 2.14 までの 12 キー + StarRating（#746）・KebabMenu（#752）・#723 の網羅追加分（#770・続き）。
    expect(KSK_DEFAULT_LABELS.ja).toEqual({
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
      carouselPrevious: "前へ",
      carouselNext: "次へ",
      carouselSlide: "スライド {index}",
      carouselMore: "もっと見る",
      imageCarouselRegion: "画像カルーセル",
      contentCarouselRegion: "コンテンツカルーセル",
      bannerCarouselRegion: "バナー一覧",
      bulkActionsClear: "選択を解除",
      bulkActionsCount: "{count}件を選択中",
      imageUploaderAdd: "画像を追加",
      imageUploaderAddText: "追加",
      imageUploaderRemove: "{name}を削除",
      dataTableSelectionColumn: "行選択",
      dataTableSelectAll: "すべて選択",
      dataTableSelectRow: "行を選択",
      dataTableSelectRowId: "{id} を選択",
      dataTableRowMenu: "行メニュー",
      dataTableInput: "入力",
      dataTableSelect: "選択",
      dataTableAddRow: "追加する",
      dataTableEmpty: "データがありません",
      dataTableEmptyValue: "未設定",
      orderSummaryTotal: "合計（税込）",
      productCardAddToCart: "カートに追加",
      productCardFavoriteAdd: "お気に入りに追加",
      productCardFavoriteRemove: "お気に入りから削除",
      quantitySelectorGroup: "数量選択",
      quantitySelectorDecrease: "数量を減らす",
      quantitySelectorIncrease: "数量を増やす",
      quantitySelectorDelete: "削除",
      filterBarNav: "フィルター",
      filterBarMore: "絞り込み",
      filterBarClear: "選択を解除",
      filterBarSort: "並べ替え",
      filterBarResultCount: "対象商品: {count} 件",
      bottomTabBarNav: "メインナビゲーション",
      chipFilterBarResultCount: "{count}件",
      chipRemove: "削除",
      chipRemoveNamed: "削除: {name}",
      compactFilePickerLabel: "ファイル",
      compactFilePickerTrigger: "選択する",
      compactFilePickerLoading: "処理中",
      imageAttachmentTrigger: "画像を追加",
      imageAttachmentLabel: "画像",
      imageAttachmentRemove: "{name}を削除",
      confirmDialogConfirm: "確認",
      confirmDialogCancel: "キャンセル",
      confirmDialogLoading: "処理中…",
      errorStateTitle: "エラーが発生しました",
      errorStateDescription: "しばらくしてからもう一度お試しください",
      errorStateNotFoundTitle: "ページが見つかりません",
      errorStateNotFoundDescription: "お探しのページは移動または削除された可能性があります。",
      featureComparisonFeature: "機能",
      featureComparisonAvailable: "利用できる",
      featureComparisonUnavailable: "利用できない",
      fileUploadDrag: "ここにファイルをドロップ",
      fileUploadOr: "または",
      fileUploadBrowse: "ファイルを選択",
      fileUploadMaxSize: "最大 {size} まで",
      fileUploadMaxFiles: "最大 {max} ファイルまで",
      fileUploadRemove: "削除",
      fileUploadRemoveItem: "{name} を{label}",
      filterPillPanel: "{label}のフィルタ",
      filterPillClear: "{label}をクリア",
      kanbanColumnCount: "{count}件",
      mediaActionCluster: "メディアアクション",
      sidebarNav: "サイドナビゲーション",
      swipeRowActions: "行の操作",
      reviewOverlayPin: "レビューピン",
      tagInputPlaceholder: "タグを入力して Enter",
      tagInputLabel: "タグ入力",
      tagInputRemove: "{tag} を削除",
      codeInputCell: "{index}桁目（全{length}桁）",
      progress: "進捗",
      celebrationTitle: "達成しました",
      coachMarkOverlayLabel: "Onboarding coach mark",
      comboboxPlaceholder: "選択してください",
      comboboxSearchPlaceholder: "検索...",
      comboboxOptions: "{label}の候補",
      multiSelectPlaceholder: "選択してください",
      multiSelectSearchPlaceholder: "検索...",
      datePickerPlaceholder: "日付を選択",
      dateRangePickerPlaceholder: "期間を選択",
      timePickerPlaceholder: "時刻を選択",
      dateRangePickerSeparator: " 〜 ",
      dateTimePickerDateFormat: "M月d日（EEE）",
      timePickerHour: "時",
      timePickerMinute: "分",
      countdownUnitDay: "日",
      countdownUnitHour: "時間",
      countdownUnitMinute: "分",
      countdownUnitSecond: "秒",
      breadcrumbEllipsis: "その他",
      simplePaginationEmpty: "0 件",
      simplePaginationItems: "{range} / 全 {total} 件",
      simplePaginationPages: "{page} / {pages} ページ",
      toastRegion: "通知",
      sliderThumb: "スライダー",
      sliderStart: "開始",
      sliderEnd: "終了",
      sliderThumbPosition: "{label}（{position}）",
      socialLoginLine: "LINEでログイン",
      socialLoginGoogle: "Googleでログイン",
      socialLoginApple: "Appleでログイン",
      socialLoginAmazon: "Amazonでログイン",
      progressSteps: "ステップ {current} / {total}: {name}",
      menuDrawerTitle: "メニュー",
      quickActionGridLoading: "処理中",
      documentPageLastUpdated: "最終更新日：{date}",
      ratingDisplay: "評価 {value} / 5",
      ratingDisplayWithCount: "評価 {value} / 5 ({count}件)",
      priceDisplayTax: "税込",
      reviewSummaryCount: "{count}件の口コミ",
      reviewStarRating: "{rating}点 / 5点",
      reviewCardHelpful: "参考になった",
      notificationListEmpty: "新着のお知らせはありません",
      searchPanelReset: "リセット",
      searchPanelSearch: "検索",
      chartGranularityHour: "時間",
      chartGranularityDay: "日",
      chartGranularityWeek: "週",
      chartGranularityMonth: "月",
      chartPeriod7d: "7日",
      chartPeriod30d: "30日",
      chartPeriod90d: "90日",
      chartPeriod1y: "1年",
      chartPeriodCustom: "カスタム",
      chartControlsGranularity: "粒度",
      chartControlsPeriod: "期間",
      chartControlsComparison: "比較",
      chartControlsShowComparison: "前期比を表示",
      countdownSpokenDay: "{count}日",
      countdownSpokenHour: "{count}時間",
      countdownSpokenMinute: "{count}分",
      countdownSpokenSecond: "{count}秒",
      countdownSpokenSeparator: "",
    })
  })

  it("locale=\"en\" の既定文言も全キー固定（意図しない訳の変更を検出する）", () => {
    expect(KSK_DEFAULT_LABELS.en).toEqual({
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
      carouselPrevious: "Previous",
      carouselNext: "Next",
      carouselSlide: "Slide {index}",
      carouselMore: "See more",
      imageCarouselRegion: "Image carousel",
      contentCarouselRegion: "Content carousel",
      bannerCarouselRegion: "Banners",
      bulkActionsClear: "Clear selection",
      bulkActionsCount: "{count} selected",
      imageUploaderAdd: "Add image",
      imageUploaderAddText: "Add",
      imageUploaderRemove: "Remove {name}",
      dataTableSelectionColumn: "Selection",
      dataTableSelectAll: "Select all",
      dataTableSelectRow: "Select row",
      dataTableSelectRowId: "Select {id}",
      dataTableRowMenu: "Row menu",
      dataTableInput: "Input",
      dataTableSelect: "Select",
      dataTableAddRow: "Add",
      dataTableEmpty: "No data",
      dataTableEmptyValue: "Not set",
      orderSummaryTotal: "Total (incl. tax)",
      productCardAddToCart: "Add to cart",
      productCardFavoriteAdd: "Add to favorites",
      productCardFavoriteRemove: "Remove from favorites",
      quantitySelectorGroup: "Quantity",
      quantitySelectorDecrease: "Decrease quantity",
      quantitySelectorIncrease: "Increase quantity",
      quantitySelectorDelete: "Remove",
      filterBarNav: "Filters",
      filterBarMore: "Filter",
      filterBarClear: "Clear selection",
      filterBarSort: "Sort",
      filterBarResultCount: "Results: {count} items",
      bottomTabBarNav: "Main navigation",
      chipFilterBarResultCount: "{count} results",
      chipRemove: "Remove",
      chipRemoveNamed: "Remove: {name}",
      compactFilePickerLabel: "File",
      compactFilePickerTrigger: "Choose",
      compactFilePickerLoading: "Processing",
      imageAttachmentTrigger: "Add image",
      imageAttachmentLabel: "Image",
      imageAttachmentRemove: "Remove {name}",
      confirmDialogConfirm: "Confirm",
      confirmDialogCancel: "Cancel",
      confirmDialogLoading: "Processing…",
      errorStateTitle: "Something went wrong",
      errorStateDescription: "Please try again in a few moments",
      errorStateNotFoundTitle: "Page not found",
      errorStateNotFoundDescription: "The page you are looking for may have been moved or deleted.",
      featureComparisonFeature: "Feature",
      featureComparisonAvailable: "Available",
      featureComparisonUnavailable: "Not available",
      fileUploadDrag: "Drop files here",
      fileUploadOr: "or",
      fileUploadBrowse: "Choose files",
      fileUploadMaxSize: "Up to {size}",
      fileUploadMaxFiles: "Up to {max} files",
      fileUploadRemove: "Remove",
      fileUploadRemoveItem: "{label} {name}",
      filterPillPanel: "{label} filter",
      filterPillClear: "Clear {label}",
      kanbanColumnCount: "{count} items",
      mediaActionCluster: "Media actions",
      sidebarNav: "Sidebar navigation",
      swipeRowActions: "Row actions",
      reviewOverlayPin: "Review pin",
      tagInputPlaceholder: "Type a tag and press Enter",
      tagInputLabel: "Tag input",
      tagInputRemove: "Remove {tag}",
      codeInputCell: "Digit {index} of {length}",
      progress: "Progress",
      celebrationTitle: "Achieved",
      coachMarkOverlayLabel: "Onboarding coach mark",
      comboboxPlaceholder: "Select",
      comboboxSearchPlaceholder: "Search...",
      comboboxOptions: "{label} options",
      multiSelectPlaceholder: "Select",
      multiSelectSearchPlaceholder: "Search...",
      datePickerPlaceholder: "Select date",
      dateRangePickerPlaceholder: "Select date range",
      timePickerPlaceholder: "Select time",
      dateRangePickerSeparator: " – ",
      dateTimePickerDateFormat: "EEE, M/d",
      timePickerHour: "Hour",
      timePickerMinute: "Min",
      countdownUnitDay: "d",
      countdownUnitHour: "h",
      countdownUnitMinute: "m",
      countdownUnitSecond: "s",
      breadcrumbEllipsis: "More",
      simplePaginationEmpty: "0 items",
      simplePaginationItems: "{range} of {total} items",
      simplePaginationPages: "Page {page} of {pages}",
      toastRegion: "Notifications",
      sliderThumb: "Slider",
      sliderStart: "Start",
      sliderEnd: "End",
      sliderThumbPosition: "{label} ({position})",
      socialLoginLine: "Log in with LINE",
      socialLoginGoogle: "Log in with Google",
      socialLoginApple: "Log in with Apple",
      socialLoginAmazon: "Log in with Amazon",
      progressSteps: "Step {current} of {total}: {name}",
      menuDrawerTitle: "Menu",
      quickActionGridLoading: "Processing",
      documentPageLastUpdated: "Last updated: {date}",
      ratingDisplay: "Rated {value} out of 5",
      ratingDisplayWithCount: "Rated {value} out of 5 ({count} reviews)",
      priceDisplayTax: "Tax incl.",
      reviewSummaryCount: "{count} reviews",
      reviewStarRating: "{rating} out of 5",
      reviewCardHelpful: "Helpful",
      notificationListEmpty: "No new notifications",
      searchPanelReset: "Reset",
      searchPanelSearch: "Search",
      chartGranularityHour: "Hour",
      chartGranularityDay: "Day",
      chartGranularityWeek: "Week",
      chartGranularityMonth: "Month",
      chartPeriod7d: "7 days",
      chartPeriod30d: "30 days",
      chartPeriod90d: "90 days",
      chartPeriod1y: "1 year",
      chartPeriodCustom: "Custom",
      chartControlsGranularity: "Granularity",
      chartControlsPeriod: "Period",
      chartControlsComparison: "Compare",
      chartControlsShowComparison: "Show vs. previous period",
      countdownSpokenDay: "{count} day(s)",
      countdownSpokenHour: "{count} hour(s)",
      countdownSpokenMinute: "{count} minute(s)",
      countdownSpokenSecond: "{count} second(s)",
      countdownSpokenSeparator: " ",
    })
  })

  it("NavigationBar は Provider 無しで従来の日本語", () => {
    const nav = renderToStaticMarkup(<NavigationBar onLeft={() => {}} onShare={() => {}} />)
    expect(nav).toContain('aria-label="戻る"')
    expect(nav).toContain('aria-label="シェア"')
    expect(renderToStaticMarkup(<NavigationBar leftIcon="close" onLeft={() => {}} />)).toContain('aria-label="閉じる"')
  })

  it("NavigationBar の戻る / 閉じる / シェアも Provider に従う（明示 prop が勝つ）", () => {
    const en = (node: React.ReactNode) => renderToStaticMarkup(<KskLabelsProvider locale="en">{node}</KskLabelsProvider>)
    const nav = en(<NavigationBar onLeft={() => {}} onShare={() => {}} />)
    expect(nav).toContain('aria-label="Back"')
    expect(nav).toContain('aria-label="Share"')
    expect(en(<NavigationBar leftIcon="close" onLeft={() => {}} />)).toContain('aria-label="Close"')
    expect(en(<NavigationBar onLeft={() => {}} onShare={() => {}} shareLabel="送る" />)).toContain('aria-label="送る"')
  })

  it("labels をインラインで渡しても、キーと値が同じなら context 値を変えない（配下を再レンダーしない）", () => {
    const seen: ReturnType<typeof useKskLabels>[] = []
    const Probe = React.memo(function Probe() {
      seen.push(useKskLabels())
      return null
    })
    const el = document.createElement("div")
    const root = createRoot(el)
    const ui = (close: string) => (
      <KskLabelsProvider locale="en" labels={{ close }}>
        <Probe />
      </KskLabelsProvider>
    )
    act(() => root.render(ui("Dismiss")))
    act(() => root.render(ui("Dismiss")))
    act(() => root.render(ui("Dismiss")))
    // memo の Probe は context が変わったときだけ描き直す
    expect(seen.length).toBe(1)
    act(() => root.render(ui("Hide")))
    expect(seen.length).toBe(2)
    expect(seen[1].close).toBe("Hide")
    act(() => root.unmount())
  })
})
