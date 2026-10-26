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
  /** MonthCalendarHeader の「今日へ」（issue #721）。MonthCalendarHeader の `locale` prop が Provider と異なるときは使われない */
  calendarToday: string
  /** MonthCalendarHeader の前の月ボタンの読み上げ名（`locale` prop の扱いは calendarToday と同じ） */
  calendarPrevMonth: string
  /** MonthCalendarHeader の次の月ボタンの読み上げ名（`locale` prop の扱いは calendarToday と同じ） */
  calendarNextMonth: string
  /** MonthCalendarExpandToggle の読み上げ名（開閉で変えない。状態は aria-expanded）。MonthCalendarExpandToggle の `locale` prop が Provider と異なるときは使われない */
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
  /** ImageCarousel / ContentCarousel の前へ矢印の読み上げ名 */
  carouselPrevious?: string
  /** ImageCarousel / ContentCarousel の次へ矢印の読み上げ名 */
  carouselNext?: string
  /** ImageCarousel / ContentCarousel のドット（各スライドへ移動）の読み上げ名。`{index}` を 1 始まりの番号に置き換える */
  carouselSlide?: string
  /** BannerCarousel / ProductCarousel の「もっと見る」の文言 */
  carouselMore?: string
  /** ImageCarousel のスクロール領域（role="region"）の読み上げ名 */
  imageCarouselRegion?: string
  /** ContentCarousel のスクロール領域の読み上げ名 */
  contentCarouselRegion?: string
  /** BannerCarousel のスクロール領域の読み上げ名 */
  bannerCarouselRegion?: string
  /** BulkActions の選択解除ボタンの読み上げ名 */
  bulkActionsClear?: string
  /** BulkActions / DataTableBulkActions の選択件数の文言（toolbar の読み上げ名も兼ねる）。`{count}` を件数に置き換える。英語の単複は関数 prop（countLabel）で */
  bulkActionsCount?: string
  /** ImageUploader の追加ボタンの読み上げ名 */
  imageUploaderAdd?: string
  /** ImageUploader の追加ボタンに見える短い文言 */
  imageUploaderAddText?: string
  /** ImageUploader の各画像の削除ボタンの読み上げ名。`{name}` を画像の alt に置き換える */
  imageUploaderRemove?: string
  /** DataTable の選択列ヘッダー（th）の読み上げ名 */
  dataTableSelectionColumn?: string
  /** DataTable の「すべて選択」チェックボックスの読み上げ名 */
  dataTableSelectAll?: string
  /** DataTableCheckboxCell（行側）の既定の読み上げ名 */
  dataTableSelectRow?: string
  /** DataTable の行チェックボックスの読み上げ名。`{id}` を行 ID に置き換える */
  dataTableSelectRowId?: string
  /** DataTableActionCell の行メニュー起動ボタンの読み上げ名 */
  dataTableRowMenu?: string
  /** DataTableInputCell の input の読み上げ名（aria-label / placeholder が無いとき） */
  dataTableInput?: string
  /** DataTableSelectCell / createDataTableSelectColumn の選択欄の読み上げ名・プレースホルダー（aria-label / placeholder が無いとき） */
  dataTableSelect?: string
  /** DataTableAddRow の追加ボタンの文言 */
  dataTableAddRow?: string
  /** DataTableEmptyState の見出し */
  dataTableEmpty?: string
  /** createDataTable*Column の値が無いセルの表示 */
  dataTableEmptyValue?: string
  /** OrderSummary の合計ラベル */
  orderSummaryTotal?: string
  /** ProductCard のカート追加ボタンの文言 */
  productCardAddToCart?: string
  /** ProductCard のお気に入りボタン（未登録のとき）の読み上げ名 */
  productCardFavoriteAdd?: string
  /** ProductCard のお気に入りボタン（登録済みのとき）の読み上げ名 */
  productCardFavoriteRemove?: string
  /** QuantitySelector 全体（role="group"）の読み上げ名 */
  quantitySelectorGroup?: string
  /** QuantitySelector の減らすボタンの読み上げ名 */
  quantitySelectorDecrease?: string
  /** QuantitySelector の増やすボタンの読み上げ名 */
  quantitySelectorIncrease?: string
  /** QuantitySelector の削除操作（trash 状態）の読み上げ名 */
  quantitySelectorDelete?: string
  /** FilterBar の nav の読み上げ名 */
  filterBarNav?: string
  /** FilterBar の絞り込みボタンの読み上げ名 */
  filterBarMore?: string
  /** FilterBar のドロップダウンの「選択を解除」の文言 */
  filterBarClear?: string
  /** FilterBar の並べ替えボタンの既定の文言 */
  filterBarSort?: string
  /** FilterBar の件数表示。`{count}` の部分だけ太字の数字になる（`{count}` の前後の文字がそのまま出る） */
  filterBarResultCount?: string
  /** BottomTabBar の nav の読み上げ名 */
  bottomTabBarNav?: string
  /** ChipFilterBar の件数表示。`{count}` を桁区切り済みの件数に置き換える。英語の単複は関数 prop（resultCountLabel）で */
  chipFilterBarResultCount?: string
  /** Chip の削除ボタンの読み上げ名（children が文字列でないとき） */
  chipRemove?: string
  /** Chip の削除ボタンの読み上げ名（children が文字列・数値のとき）。`{name}` を children に置き換える */
  chipRemoveNamed?: string
  /** CompactFilePicker の見出し */
  compactFilePickerLabel?: string
  /** CompactFilePicker のボタンの文言 */
  compactFilePickerTrigger?: string
  /** CompactFilePicker の処理中（loading）のボタンの文言 */
  compactFilePickerLoading?: string
  /** ImageAttachmentPicker のボタンの文言 */
  imageAttachmentTrigger?: string
  /** ImageAttachmentPicker の見出し・名前の無い画像の既定の名前 */
  imageAttachmentLabel?: string
  /** ImageAttachmentPicker の各画像の削除ボタンの読み上げ名。`{name}` を画像名に置き換える */
  imageAttachmentRemove?: string
  /** ConfirmDialog の確認ボタンの文言 */
  confirmDialogConfirm?: string
  /** ConfirmDialog のキャンセルボタンの文言 */
  confirmDialogCancel?: string
  /** ConfirmDialog の処理中の文言 */
  confirmDialogLoading?: string
  /** ErrorState（kind="error"）の見出し */
  errorStateTitle?: string
  /** ErrorState（kind="error"）の説明 */
  errorStateDescription?: string
  /** ErrorState（kind="notFound"）の見出し */
  errorStateNotFoundTitle?: string
  /** ErrorState（kind="notFound"）の説明 */
  errorStateNotFoundDescription?: string
  /** FeatureComparisonTable の左上の見出しセル（機能名の列） */
  featureComparisonFeature?: string
  /** FeatureComparisonTable の true のセルの読み上げ文言 */
  featureComparisonAvailable?: string
  /** FeatureComparisonTable の false のセルの読み上げ文言 */
  featureComparisonUnavailable?: string
  /** FileUpload のドラッグエリアのメイン文言 */
  fileUploadDrag?: string
  /** FileUpload の「または」 */
  fileUploadOr?: string
  /** FileUpload のファイル選択の文言 */
  fileUploadBrowse?: string
  /** FileUpload のサイズ上限の文言。`{size}` を "5.0 MB" のようなサイズに置き換える */
  fileUploadMaxSize?: string
  /** FileUpload のファイル数上限の文言。`{max}` を数に置き換える。英語の単複は関数 prop（maxFilesLabel）で */
  fileUploadMaxFiles?: string
  /** FileUpload の削除ボタンの語（fileUploadRemoveItem の `{label}` に入る） */
  fileUploadRemove?: string
  /** FileUpload の各ファイルの削除ボタンの読み上げ名。`{name}` をファイル名、`{label}` を fileUploadRemove（または removeLabel prop）に置き換える */
  fileUploadRemoveItem?: string
  /** FilterPill の Popover パネルの読み上げ名。`{label}` をピルのラベルに置き換える */
  filterPillPanel?: string
  /** FilterPill のクリアボタンの読み上げ名。`{label}` をピルのラベルに置き換える */
  filterPillClear?: string
  /** KanbanColumn の件数の読み上げ・表示の文言。`{count}` を件数に置き換える。英語の単複は関数 prop（countLabel）で */
  kanbanColumnCount?: string
  /** MediaActionCluster 全体の読み上げ名 */
  mediaActionCluster?: string
  /** SidebarNav の nav の読み上げ名 */
  sidebarNav?: string
  /** SwipeRow のアクション群（group）の読み上げ名 */
  swipeRowActions?: string
  /** ReviewOverlay のピン（コメントが無いとき）の読み上げ名 */
  reviewOverlayPin?: string
  /** TagInput の入力欄のプレースホルダー（タグが 0 件のとき） */
  tagInputPlaceholder?: string
  /** TagInput の入力欄の読み上げ名（id / aria-labelledby が無いとき） */
  tagInputLabel?: string
  /** TagInput の各タグの削除ボタンの読み上げ名。`{tag}` をタグに置き換える */
  tagInputRemove?: string
  /** CodeInput（cells）の各セルの読み上げ名。`{index}` を 1 始まりの桁、`{length}` を全桁数に置き換える */
  codeInputCell?: string
  /** Progress / ProgressRing の読み上げ名（aria-label / aria-labelledby / label が無いとき） */
  progress?: string
  /** Celebration の読み上げ文（title が無いとき。画面には出さない） */
  celebrationTitle?: string
  /** CoachMarkOverlay の面（overlay）の読み上げ名。ja の既定は従来どおり英語の "Onboarding coach mark"（Provider 無しの読み上げを変えないため） */
  coachMarkOverlayLabel?: string
  /** Combobox のトリガーのプレースホルダー */
  comboboxPlaceholder?: string
  /** Combobox の検索欄のプレースホルダー */
  comboboxSearchPlaceholder?: string
  /** Combobox の候補リストの読み上げ名。`{label}` をトリガーの名前（triggerLabel / placeholder）に置き換える */
  comboboxOptions?: string
  /** MultiSelect のトリガーのプレースホルダー */
  multiSelectPlaceholder?: string
  /** MultiSelect の検索欄のプレースホルダー */
  multiSelectSearchPlaceholder?: string
  /** DatePicker / DateTimePicker（日付側）のプレースホルダー */
  datePickerPlaceholder?: string
  /** DateRangePicker のプレースホルダー */
  dateRangePickerPlaceholder?: string
  /** TimePicker / DateTimePicker（時刻側）のプレースホルダー */
  timePickerPlaceholder?: string
  /** DateRangePicker の開始日と終了日の区切り（前後の空白を含む） */
  dateRangePickerSeparator?: string
  /** DateTimePicker の日付側の書式（`M` `d` `EEE` 等のトークン。DatePicker の `dateFormat` と同じ） */
  dateTimePickerDateFormat?: string
  /** TimePicker の時の列の見出し */
  timePickerHour?: string
  /** TimePicker の分の列の見出し */
  timePickerMinute?: string
  /** CountdownTimer（granularity="day"）の日の単位 */
  countdownUnitDay?: string
  /** CountdownTimer の時間の単位 */
  countdownUnitHour?: string
  /** CountdownTimer の分の単位 */
  countdownUnitMinute?: string
  /** CountdownTimer の秒の単位 */
  countdownUnitSecond?: string
  /** BreadcrumbEllipsis（省略記号）の読み上げ名 */
  breadcrumbEllipsis?: string
  /** SimplePagination の 0 件のときの中央表示 */
  simplePaginationEmpty?: string
  /** SimplePagination の件数表示（items 形式）。`{range}`（例 "1 - 10"）と `{total}` を数字に置き換える。`{…}` 以外の文字は弱いトーンで出る */
  simplePaginationItems?: string
  /** SimplePagination のページ表示（pages 形式）。`{page}` と `{pages}` を数字に置き換える。`{…}` 以外の文字は弱いトーンで出る */
  simplePaginationPages?: string
  /**
   * Toaster の通知 viewport（role="region"）の読み上げ名。`configureToast({ regionLabel })` が優先。
   * `toast()` が自動で出す viewport（`<Toaster>` を置かない経路）は別の React root に描画されるので Provider が届かない。
   * その経路の英語化は `configureToast({ regionLabel, closeLabel, messages })` で行う。
   */
  toastRegion?: string
  /** Slider のつまみの読み上げ名（aria-label / aria-labelledby が無いとき） */
  sliderThumb?: string
  /** Slider（範囲）の開始側のつまみの位置名（sliderThumbPosition の `{position}`） */
  sliderStart?: string
  /** Slider（範囲）の終了側のつまみの位置名（sliderThumbPosition の `{position}`） */
  sliderEnd?: string
  /** Slider（範囲）のつまみの読み上げ名。`{label}` を aria-label（無ければ sliderThumb）、`{position}` を sliderStart / sliderEnd に置き換える */
  sliderThumbPosition?: string
  /** SocialLoginButton（provider="line"）の既定文言 */
  socialLoginLine?: string
  /** SocialLoginButton（provider="google"）の既定文言 */
  socialLoginGoogle?: string
  /** SocialLoginButton（provider="apple"）の既定文言 */
  socialLoginApple?: string
  /** SocialLoginButton（provider="amazon"）の既定文言 */
  socialLoginAmazon?: string
  /** ProgressSteps の読み上げ名。`{current}`（1 始まり）/ `{total}` / `{name}`（現在のステップ名）を置き換える */
  progressSteps?: string
  /** MenuDrawer のシートの見出し（読み上げ専用） */
  menuDrawerTitle?: string
  /** ActionTile / QuickActionGrid の loading 中の Spinner の読み上げ名 */
  quickActionGridLoading?: string
  /** DocumentPage の最終更新日の表示。`{date}` を lastUpdated に置き換える */
  documentPageLastUpdated?: string
  /** RatingDisplay の読み上げ名（件数なし）。`{value}` を小数 1 桁の評価に置き換える */
  ratingDisplay?: string
  /** RatingDisplay の読み上げ名（件数あり）。`{value}` を評価、`{count}` を件数に置き換える。英語の単複（1 review）は表示側の件数で補う */
  ratingDisplayWithCount?: string
  /** PriceDisplay の「税込」（表示と読み上げ） */
  priceDisplayTax?: string
  /** ReviewSummary の件数表示。`{count}` を桁区切り済みの件数に置き換える */
  reviewSummaryCount?: string
  /** ReviewCard / StarRow の星の読み上げ名。`{rating}` を点数に置き換える */
  reviewStarRating?: string
  /** ReviewCard の「参考になった」ボタンの文言 */
  reviewCardHelpful?: string
  /** NotificationList が 0 件のときの文言 */
  notificationListEmpty?: string
  /** SearchPanel のリセットボタンの文言 */
  searchPanelReset?: string
  /** SearchPanel の検索ボタンの文言 */
  searchPanelSearch?: string
  /** ChartControls の粒度「時間」 */
  chartGranularityHour?: string
  /** ChartControls の粒度「日」 */
  chartGranularityDay?: string
  /** ChartControls の粒度「週」 */
  chartGranularityWeek?: string
  /** ChartControls の粒度「月」 */
  chartGranularityMonth?: string
  /** ChartControls の期間「7日」 */
  chartPeriod7d?: string
  /** ChartControls の期間「30日」 */
  chartPeriod30d?: string
  /** ChartControls の期間「90日」 */
  chartPeriod90d?: string
  /** ChartControls の期間「1年」 */
  chartPeriod1y?: string
  /** ChartControls の期間「カスタム」 */
  chartPeriodCustom?: string
  /** ChartControls の粒度行の見出し */
  chartControlsGranularity?: string
  /** ChartControls の期間行の見出し */
  chartControlsPeriod?: string
  /** ChartControls の比較行の見出し */
  chartControlsComparison?: string
  /** ChartControls の比較トグルの文言 */
  chartControlsShowComparison?: string
  /** CountdownTimer（日）の読み上げ。`{count}` を数に置き換える。表示の単位 prop（dayUnit）を渡したときはそちらが読み上げにも使われる。英語の単複は文言では出し分けられないので "day(s)" と読ませる（厳密にしたいときは dayUnit prop） */
  countdownSpokenDay?: string
  /** CountdownTimer の「時間」の読み上げ。`{count}` を数に置き換える（hourUnit prop が優先。単複は "hour(s)"） */
  countdownSpokenHour?: string
  /** CountdownTimer の「分」の読み上げ。`{count}` を数に置き換える（minuteUnit prop が優先。単複は "minute(s)"） */
  countdownSpokenMinute?: string
  /** CountdownTimer の「秒」の読み上げ。`{count}` を数に置き換える（secondUnit prop が優先。単複は "second(s)"） */
  countdownSpokenSecond?: string
  /** CountdownTimer の読み上げで、時間・分・秒をつなぐ区切り（ja は空、en は半角スペース） */
  countdownSpokenSeparator?: string
  /**
   * MonthCalendar / MonthCalendarHeader / AgendaList / DatePicker の曜日名（短い形）。**7 個を半角カンマで区切る**（日曜始まり）。
   * MonthCalendar の曜日の列見出し・AgendaList の日付列・DatePicker の入力欄の `EEE` に出る。各項目の前後の空白は取り除く（"Sun, Mon, …" でよい）。
   * 個数が 7 でないときは、そのときの locale（部品の locale prop → Provider の locale → ja）の既定で補い、開発ビルドだけ一度 warn する。
   *
   * 注意: DatePicker / DateRangePicker のポップオーバーの中の Calendar（react-day-picker）の曜日見出し・月名は
   * この一覧を読まない（Provider の locale の ja / en だけに従う）。変わるのは入力欄の表示（`EEE` / `EEEE`）だけ
   */
  calendarWeekdaysShort?: string
  /** 曜日名（長い形）。7 個を半角カンマで区切る（日曜始まり）。DatePicker の入力欄の `EEEE` に出る（ポップオーバーの Calendar には出ない。補い方は calendarWeekdaysShort と同じ） */
  calendarWeekdaysLong?: string
  /** 月名（長い形）。12 個を半角カンマで区切る（1 月始まり。補い方は calendarWeekdaysShort と同じ）。`calendarMonthTitle` の `{monthName}` に入る */
  calendarMonthsLong?: string
  /** 月名（短い形）。12 個を半角カンマで区切る（1 月始まり。補い方は calendarWeekdaysShort と同じ）。`calendarDayLabel` の `{monthShort}` に入る */
  calendarMonthsShort?: string
  /**
   * 日の読み上げ名（MonthCalendar のセル・AgendaList の日ごとの見出し）。
   * 差し込み口: `{year}` `{month}`（数字）`{monthName}`（calendarMonthsLong）`{monthShort}`（calendarMonthsShort）`{day}` `{weekday}`（calendarWeekdaysShort）
   *
   * 注意（calendar 系のキー全部に共通）: `labels` だけの Provider（`locale` 未指定）は ja 扱い。MonthCalendar / MonthCalendarHeader（月の見出し・今日へ・前後の月ボタン）/
   * MonthCalendarExpandToggle / AgendaList に `locale="en"` を渡すと Provider の labels は無視されて英語の既定になる。英語の差し替え文言を効かせたいときは
   * Provider にも `locale="en"` を指定する（部品の `locale` は省略するか、Provider と同じにする）
   */
  calendarDayLabel?: string
  /** 月の見出し・MonthCalendar の grid の読み上げ名。差し込み口は `calendarDayLabel` と同じ（`{day}` `{weekday}` は使えない） */
  calendarMonthTitle?: string
  /** 今日の日の読み上げ名に足す語（`calendarDayLabel` の直後に付く。区切りの読点・カンマも含める） */
  calendarDayToday?: string
  /**
   * 予定のある日の読み上げ名に足す文。`{count}` を件数、`{events}` を予定名（calendarEventsSeparator でつなぐ）に置き換える。
   * 英語の単複（1 event）は文言では出し分けられない
   */
  calendarDayEvents?: string
  /** 予定名をつなぐ区切り（`calendarDayEvents` の `{events}`。ja は読点、en は「, 」） */
  calendarEventsSeparator?: string
  /** MonthCalendar の「+n件」（md 以上のセルのあふれ）。`{count}` を件数に置き換える。英語の単複は関数 prop（moreLabel）で */
  calendarMore?: string
  /** AgendaList の予定の無い日（`dates` で渡した日）の文言（emptyDayLabel prop が優先） */
  agendaEmptyDay?: string
}

/** 全キーを解決済みの文言（部品の中・既定値で使う）。 */
type ResolvedKskLabels = Required<KskLabels>

/** ja の既定文言（Provider 無しの文言。DEFAULT_CONTEXT だけがこれを参照するので、en は Provider / KSK_DEFAULT_LABELS を使わない import からは落ちる） */
const JA_LABELS: ResolvedKskLabels = {
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
  calendarWeekdaysShort: "日,月,火,水,木,金,土",
  calendarWeekdaysLong: "日曜日,月曜日,火曜日,水曜日,木曜日,金曜日,土曜日",
  calendarMonthsLong: "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月",
  calendarMonthsShort: "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月",
  calendarDayLabel: "{month}月{day}日（{weekday}）",
  calendarMonthTitle: "{year}年{month}月",
  calendarDayToday: "、今日",
  calendarDayEvents: "、予定{count}件: {events}",
  calendarEventsSeparator: "、",
  calendarMore: "+{count}件",
  agendaEmptyDay: "予定なし",
}

/** en の既定文言（KskLabelsProvider locale="en"） */
const EN_LABELS: ResolvedKskLabels = {
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
  calendarWeekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat",
  calendarWeekdaysLong: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
  calendarMonthsLong: "January,February,March,April,May,June,July,August,September,October,November,December",
  calendarMonthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",
  calendarDayLabel: "{weekday}, {monthShort} {day}",
  calendarMonthTitle: "{monthName} {year}",
  calendarDayToday: ", today",
  calendarDayEvents: ", {count} events: {events}",
  calendarEventsSeparator: ", ",
  calendarMore: "+{count} more",
  agendaEmptyDay: "No events",
}

const KSK_DEFAULT_LABELS: Record<KskLocale, ResolvedKskLabels> = { ja: JA_LABELS, en: EN_LABELS }

interface KskLabelsContextValue {
  /** Provider が無いときは undefined（部品は自分の既定 locale を使う） */
  locale: KskLocale | undefined
  labels: ResolvedKskLabels
}

const DEFAULT_CONTEXT: KskLabelsContextValue = {
  locale: undefined,
  labels: JA_LABELS,
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

/**
 * `formatKskLabel` の ReactNode 版。差し込み口（`{count}` 等）に要素を入れたいとき（件数だけ <strong> にする等）に使う。
 * 差し込み口が無い・複数ある・値が無いときも壊れない（値の無い差し込み口は文字のまま残す）。
 */
function formatKskLabelNodes(template: string, values: Record<string, React.ReactNode>): React.ReactNode[] {
  return template
    .split(/(\{\w+\})/)
    .filter((part) => part !== "")
    .map((part, i) => {
      const token = /^\{(\w+)\}$/.exec(part)
      const node = token && Object.prototype.hasOwnProperty.call(values, token[1]) ? values[token[1]] : part
      return <React.Fragment key={i}>{node}</React.Fragment>
    })
}

/** 配下の DS 既定文言（Provider が無ければ日本語）。 */
function useKskLabels(): ResolvedKskLabels {
  return React.useContext(KskLabelsContext).labels
}

/** 配下の locale。Provider が無い（または locale を指定していない）ときは undefined。 */
function useKskLocale(): KskLocale | undefined {
  return React.useContext(KskLabelsContext).locale
}

/**
 * 部品が自身の `locale` prop（ja / en）を持つときの既定文言（MonthCalendar / MonthCalendarHeader（見出しとボタン）/ MonthCalendarExpandToggle / AgendaList）。
 *
 * 優先順位（`localeProp` を見る部分。部品に直接渡した文言 prop・関数 prop はこの外で常に最優先）:
 * 1. `localeProp` が指定されていて、Provider の locale と**異なる**とき: Provider の labels は使わず、
 *    `KSK_DEFAULT_LABELS[localeProp]` の既定を返す（日本語の差し替え文言が、英語を指定した部品に混ざるのを防ぐ）
 * 2. それ以外（`localeProp` 未指定、または Provider の locale と同じ）: Provider の labels（上書き）→ Provider の locale の既定 → 日本語
 *
 * Provider が無い（または labels だけで locale を指定していない）ときの Provider の locale は "ja" とみなす。
 * したがって `<KskLabelsProvider labels={英語の文言}>`（locale 未指定）の配下で部品に `locale="en"` を渡すと、labels は無視される。
 * 英語の差し替え文言を効かせたいときは Provider にも `locale="en"` を指定する。
 */
function useKskLabelsFor(localeProp?: KskLocale): ResolvedKskLabels {
  const { locale, labels } = React.useContext(KskLabelsContext)
  if (localeProp !== undefined && localeProp !== (locale ?? "ja")) return KSK_DEFAULT_LABELS[localeProp]
  return labels
}

/** `useKskLabelsFor` が文言を解決するときの locale（部品の locale prop → Provider の locale → "ja"）。一覧の補い先の言語に使う。 */
function useKskLocaleFor(localeProp?: KskLocale): KskLocale {
  const { locale } = React.useContext(KskLabelsContext)
  return localeProp ?? locale ?? "ja"
}

export { KskLabelsProvider, useKskLabels, useKskLabelsFor, useKskLocaleFor, useKskLocale, KSK_DEFAULT_LABELS, formatKskLabel, formatKskLabelNodes }
export type { KskLabels, KskLabelsProviderProps, KskLocale, ResolvedKskLabels }
