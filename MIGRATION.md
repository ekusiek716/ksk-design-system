# Migration Guide — `ksk-design-system`

メジャーバージョン間の移行ガイド。
patch / minor は原則破壊変更なし、自動アップグレード可（例外: **v1.34.0 で npm パッケージ名を変更**。import の置換が必要。下記参照）。

## 未リリース（次回の minor）の導入注意

以下は次回リリースに含まれる変更の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **見た目の変更: フォーカスリングを不透明なブランド色にした（WCAG 1.4.11 対応）**: 旧実装はフォーカスリングが全テーマで非テキストコントラスト 3:1 を割っていました（ライトで白の上 1.34〜1.67:1、ダークで Gray-900 の上 2.43〜3.44:1）。トークン `--Focus-High-Emphasis` をライトは Brand-400 から Brand-600 に変え（ダークは Brand-400 のまま）、DS 内部のリングの `/50`（半透明）をすべて外しました。不透明なら Surface-Primary の上でライト 5.0〜7.1:1・ダーク 6.0〜10.2:1 です。あわせて、リングが面と同色になる塗りつぶし（Button の default / destructive / info / warning / success / accent、Checkbox・Switch・RadioGroup・選択中の Chip・FilterPill・Calendar の選択日）には、面から 2px 離す `focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]` を足しました。リングの太さは変えていません。**導入時の作業は不要ですが、フォーカス表示の見た目が変わります**（ライトはリングが濃く、塗りのボタンはリングとの間に白いすき間が入ります）。`--Focus-High-Emphasis` を product theme で上書きしている consumer は、新しい割当（ライト 600 / ダーク 400）でも 3:1 を満たすか確認してください。consumer が自前のクラスに `ring-[var(--Focus-High-Emphasis)]/50` と書いている箇所は、新しい lint ルール **P054**（警告）が検出します。`/数字` を外してください（`npx ksk-ds lint src` で一覧できます）。`ksk-ds theme` のフォーカス検査も、ライト Brand-600 / 白・ダーク Brand-400 / Gray-900 の 3:1 を必須（error）にしました。トークン・生成物（`tokens.json` / `src/tokens/native/` / `contracts/token-hex-cache.json`）も同じ値になります。
- **見た目の変更（フォーカスリングの追加対応）**: エラー中（`aria-invalid`）の入力欄（Input / Textarea / Select / DatePicker / TimePicker / Combobox / MultiSelect）にフォーカスすると、これまでの薄い赤（20%、白の上 1.37:1）ではなく不透明な Caution-Base のリング（ライト 4.83:1 / ダーク 6.40:1）になります。Slider のつまみと CheckboxCard のフォーカスも不透明な Focus リングに変わりました（CheckboxCard・Slider は Surface-Primary のすき間つき）。`Button` の `variant="inverse"` / `"ghost-inverse"` は暗い面に置く前提で、フォーカスリングが Focus-High-Emphasis から `Object-on-Inverse`（SidebarNav inverse と同じ。対 Surface-Inverse 17.72:1）に変わります。明るい面や写真の上に置いている場合は、リングの見え方を確認してください。lint P054 は shadcn 既定の `ring-ring/50`・`ring-sidebar-ring/50`、v4 省略記法 `ring-(--Focus-High-Emphasis)/50`、フォールバック付き `ring-[var(--Focus-High-Emphasis,#…)]/50` も警告します。
- **不具合修正（見た目の変更）: ガラス素材（`.glass` 系）の操作子にフォーカスリングが出ていなかった**: `.glass` / `.glass-subtle` / `.glass-medium` / `.glass-strong` / `.glass-dark` / `.glass-clear` / `.glass-accent` は非レイヤー CSS で `box-shadow` を宣言しているため、レイヤー内の Tailwind `focus-visible:ring-*`（box-shadow で描く）に勝ち、`Button` の `glass` / `glass-inverse` / `glass-accent`（`NavigationBar` の glass・`MobileFloatingActionButton` の glass・`BottomTabBar` の中央アクションを含む）はキーボードフォーカスしても枠が一切出ていませんでした（実ブラウザで computed の box-shadow を取って確認）。glass.css が、操作子（`button` / `a` / `[role=button|tab|link]` / `summary`）が `:focus-visible` のときだけ **二重リング（内側 2px 白 + 外側 2px Gray-900。写真・ブラー面の上でも溶けない）** をガラスの影の手前に重ねるようにしました。ガラスの影は消えません。素材クラスを付けただけの非操作要素（シートの面・ヘッダー等）は対象外です。**導入時の作業は不要ですが、glass 系ボタンのフォーカス表示が新しく出ます**。リングを変えたいときは `--glass-focus-ring`（外側）/ `--glass-focus-ring-inset`（内側）を上書きします（公開変数として `contracts/product-theme-overrides.json` の `glassFocus` に追加済みで、P049 にはなりません。他の `--glass-*` は引き続き上書き禁止）。値は `box-shadow` の層リストで書き、消すなら `0 0 #0000` を宣言します。**`none` や空値は不可**です（層リストの一部として展開されるため宣言全体が無効になり、リングだけでなくガラスの影も消えます）。`BottomTabBar` の中央アクションは pill（`overflow:hidden`）の中で、かつ `.glass-specular` の `::before`（白のグラデーション）が要素自身の内側影を覆い、リングの暗い帯が白で持ち上がる（実測: Gray-900 が約 rgb(118) まで。下地が中間グレーのとき帯と下地の比が 1.8:1）ため、子の覆い要素（`data-slot="bottom-nav-center-action-focus-ring"`）に内側リングを描きます（実測で帯は Gray-900 のまま残ります）。非選択のタブは `opacity-60` で薄く、リングも一緒に薄くなっていた（白い下地で帯が約 rgb(150)、下地との比が約 1.2:1）ため、フォーカス中は不透明に戻します。計測前（`suppressPlatter` が false の間）の選択中タブは、面を兼ねる `[data-nav-platter]` が `box-shadow` を上書きするためリングが出ません（既存の例外。実際にフォーカスが当たる前に計測が終わるので実害は小さい）。`.glass*` の `box-shadow` を自前で上書きしている consumer は、先頭に `var(--ksk-glass-focus-ring, 0 0 #0000)` を置くとリングが消えません（内部変数。`BottomTabBar` の中央アクションの `--Nav-Center-Action-Shadow` は DS 側で対応済み）。 <!-- docs-drift-ignore: --Nav-Center-Action-Shadow -->
- **見た目の変更: 写真・ガラスの上に乗る操作子のフォーカスリングを、背景に依存しない二重リングにした**: 写真・動画・ブラー面の上では下地の色が分からず、単色の Focus リング（ライトは Brand-600）は下地と同系色になると溶けます。内側 2px 白 + 外側 2px 濃色（Gray-900）の二重リングにしました。任意の下地 c について、c と白の比と c と Gray-900 の比のうち大きい方は必ず 4.21:1 以上です（最悪は相対輝度 0.199 の中間グレー。`scripts/check-contrast.mjs` が輝度の全域と sRGB 格子で検査）。対象は `ImageOverlayAction`・`MediaActionCluster` の項目・`ImageGallery` の前後矢印・`ProductCard`（縦）のお気に入りボタン（外側リング）、`ImageGallery` の画像全面ボタン・`BottomTabBar` のタブ・`ProductCard`（横）のお気に入りボタン（親が `overflow:hidden` で外側リングが切られるため内側リング）、`BannerCarousel` の項目（横スクロール枠が縦方向も切り、画像が自身の内側影を隠すため、項目の `::after` に内側リング）です。`ImageGallery` の矢印・画像全面ボタン、`ProductCard` のお気に入りボタン、`BannerCarousel` の項目（a / button）は、これまでフォーカスリングが無かったので**新しく出ます**。`BannerCarousel` の項目は位置決めの基準（`relative`）になったため、画像（`absolute inset-0`）は項目の内側に収まります。あわせて、`MediaActionCluster` の active（選択中）の円に付けていた `ring-2 ring-[Border-Accent-Primary]` は `.glass` の `box-shadow` に負けて描かれていなかったので、glass.css の `--ksk-glass-focus-ring` を介して Border-Accent-Primary の 2px リングが**描かれるようになります**。色はライト / ダークで変えません。**導入時の作業は不要です**。DS 内部ではクラス文字列の定数 `OVERLAY_FOCUS_RING` / `OVERLAY_FOCUS_RING_INSET`（`src/lib/server-variants/overlay-focus-ring.ts`。公開 API ではありません）に共通化しています。自前の操作子を写真の上に置く consumer は、同じ見た目を `focus-visible:ring-2 focus-visible:ring-[var(--Primitive-Gray-900)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Primitive-White)]` で書けます（`.glass` 系の面は上の項目のとおり glass.css が自動で描くので不要です）。
- **ネイティブへの影響**: DS のネイティブ部品（`src/native`）は `Focus-High-Emphasis` を参照していません。生成トークン（`src/tokens/native/`）の `focus.high-emphasis` の値だけが変わります。consumer のアプリ側でこの値を直接使っている箇所があれば、新しい値（ライト Brand-600）で見た目を確認してください。
- **文言の変化: `KskLabelsProvider locale="en"` の配下で、ほぼ全部品の既定文言が英語になる（#770 / #775）**: KskLabelsProvider の対象を、これまでの約 11 部品から約 80 部品（ファイル数）に広げました（Pagination / Spinner / Breadcrumb / Combobox / MultiSelect / NumberInput / ImageGallery / SyncStatusBadge / CountdownTimer / ShareButtons / ErrorState / ConfirmDialog / DataTable / FileUpload / Slider / PriceDisplay / RatingDisplay ほか、placeholder・CountdownTimer の単位・Calendar / DatePicker / DateTimePicker の月名・曜日・区切りを含む）。**Provider を置いていないアプリ、`locale="ja"` のアプリの文言は一字一句変わりません**。`locale="en"` の Provider を置いているアプリは、DS を上げた時点でこれらの部品の既定文言・読み上げ名が英語になります（部品に prop で文言を渡している箇所は不変）。テストで英語の Provider の中の部品を日本語の読み上げ名（例 `getByRole("button", { name: "前へ" })`）で探している場合は、英語の名前（`"Previous"`）で探してください。CountdownTimer の en は表示が `5d` / `1h` 形式、読み上げが `Time left 1 hour(s) 5 minute(s) 30 second(s)` になります。Calendar 系は Provider の locale に従いますが、`locale` prop を直接渡していればそちらが勝ちます。AgendaList / MonthCalendar / MonthCalendarHeader（月の見出し）は自身の `locale` prop が優先で、Provider の locale と異なる `locale` を渡したときは Provider の labels を使わずその言語の既定文言になります（下の「日付の語順」の項目）。例外として、ErrorBoundary / CookieConsent は `labels` prop、`toast()` が自動で出す viewport とプリセット通知（React の外で描画）は `configureToast({ toastLabels, messages })` で切り替えます（Provider は届きません）。ChartControls の見出しの幅指定が `w-10` から `min-w-10` に変わりました（英語の見出しがはみ出さないため。日本語では従来どおり 40px）。
- **文言の変化: MonthCalendarHeader の「今日へ」・前後の月ボタンと MonthCalendarExpandToggle の読み上げ名が `locale` prop に従う**: これまで `MonthCalendarHeader locale="en"` は月の見出しだけが英語になり、ボタンは Provider（無ければ日本語）のままでした。ボタンも見出しと同じ規則（部品に渡した `todayLabel` / `prevLabel` / `nextLabel` / `label` > `locale` prop が Provider の locale と異なるときはその言語の既定（Provider の labels は使わない）> Provider の labels > Provider の locale の既定 > 日本語）で解決します。MonthCalendarExpandToggle に `locale?: "ja" | "en"` を追加しました。**変わる構成**: Provider 無し + `locale="en"`（ボタンが日本語 → 英語。見出しは元から英語）/ Provider `locale="en"` + `locale="ja"`（英語 → 日本語）/ `labels` だけの Provider（locale 未指定は ja 扱い）または Provider `locale="ja"` + `labels` の差し替え + `locale="en"`（差し替えが無視され、英語の既定）。**変わらない構成**: `locale` 未指定、Provider 無し、`locale` が Provider と同じ（`labels` の差し替えもそのまま効く）。`locale` を渡している画面でテストが「今日へ」「前の月」「次の月」「月全体を表示」の日本語の名前でボタンを探している場合は、英語の名前（Today / Previous month / Next month / Show full month）に直すか、`todayLabel` 等の文言 prop を明示してください。
- 追加のみ（Provider 無しの既定は不変）: KskLabels のキー約 175 個（型 `KskLabels` ではすべて optional なので、既存の完全な翻訳オブジェクトはそのまま型チェックを通ります。全キー解決済みの型 `ResolvedKskLabels` で自前の辞書を作っている場合は、必須キーが増えます。#746 / #752 と同じ前例）、`BreadcrumbEllipsis` の `label`、`configureToast` の `messages`（型 `ToastPresetMessages`）。日本語のみのアプリでは英語の辞書が tree-shaking で落ちるよう ja / en を別定数にしています（それでも部品 1 つの import あたり gzip 約 +2.6KB）。
- **ネイティブ RadioGroup がグループとして読まれる（#765）**: native の `RadioGroup` に `accessibilityLabel` / `accessibilityLabelledBy` を追加し、外側の要素を常に `accessibilityRole="radiogroup"` にしました（見た目は不変）。各行は `radio` として `checked` / `unchecked` で読まれるようになりました（`accessibilityState` を `selected` から `checked` に変更。`Radio`・`ChipSelector` の単一選択と同じ形）。読み上げの状態表現が selected 系から checked 系に変わります（実際の読み方は OS・読み上げ機能に依存し、実機では未確認）。`accessibilityState.selected` を前提にした自前のテストがあれば `checked` に直してください。名前を渡していないと、開発ビルドだけ `console.warn` が出ます（本番ビルドでは出ません）。欄の見出しを `accessibilityLabel` で渡してください。
- **ネイティブ Button `variant="glass"` が `containerStyle` / `pressedContainerStyle` を読む（#754）**: これまで glass だけ `containerStyle` / `pressedContainerStyle` が無視されていました。丸い小さな glass ボタン（`containerStyle={{ width: 40, height: 40, borderRadius: 999 }}` 等）が作れます。44 未満の寸法では押せる範囲を `hitSlop` で 44 まで自動で補います（自前の `hitSlop` が優先）。**これまで効かないまま `containerStyle` を glass Button に渡していた箇所は、渡した指定どおりの見た目に変わります**。`containerStyle` を渡していない glass Button の見た目は不変です。`padding: 0` だけでは既定の左右余白（20）は消えないので、消すときは `paddingHorizontal` も指定してください。
- 追加のみ（CLI・CI）: `npx ksk-ds theme <hex>`（ブランド色 1 色から Brand ランプを生成し WCAG コントラストを検査。#769）、`npx ksk-ds report-ignores <dir...>`（consumer の理由付き lint 回避を横断集計。#767）。DS 側の CI に配布物サイズと tree-shaking の予算検査（`npm run lint:bundle-size`、#768）を追加しました。consumer 側の作業は不要です。
- 追加のみ（Provider 無し・`locale` prop 無し / `ja` / `en` の表示と読み上げは不変）: 日付の語順・曜日名・月名・件数の文を KskLabels で差し替えられるようにしました（MonthCalendar / MonthCalendarHeader の月の見出し / AgendaList / DatePicker・DateRangePicker の曜日の書式トークン EEE・EEEE）。追加キー: `calendarDayLabel`（`{month}月{day}日（{weekday}）` / `{weekday}, {monthShort} {day}`）・`calendarMonthTitle`・`calendarDayToday`・`calendarDayEvents`・`calendarEventsSeparator`・`calendarMore`・`agendaEmptyDay`、曜日名・月名は半角カンマ区切りの `calendarWeekdaysShort` / `calendarWeekdaysLong`（7 個）・`calendarMonthsLong` / `calendarMonthsShort`（12 個。個数が合わないと日本語の既定で補う）。**文言の優先順位**: 部品に渡した prop（`emptyDayLabel` / `moreLabel` / `aria-label` / `title`）> `locale` prop が Provider の locale と異なるときはその言語の既定（Provider の labels は使わない）> Provider の labels > Provider の locale の既定 > 日本語。日本語の差し替え文言が英語指定の部品に混ざりません。`locale` prop だけ渡す使い方（Provider 無し）も従来どおりです。MonthCalendarHeader の前後・今日へボタンと MonthCalendarExpandToggle の読み上げ名は、直後の項目のとおり `locale` prop に従うようになりました。型 `ResolvedKskLabels` で自前の辞書を作っている場合は必須キーが 11 個増えます（`KskLabels` ではすべて optional）。

## v2.13.0 の導入注意

以下はv2.13.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **下部ナビ・FABの入力中表示（#700）**: `MobileTabBar` / `MobileFloatingActionButton` は既定の `keyboardBehavior="hide"` での非表示条件が増えます。`BottomTabBar` の既定stayは維持し、hideを明示した場合だけ同じ検知を使います。viewportの縮小に加え、タッチ主体の端末でテキスト入力にフォーカスした時点でも非表示になります。pointer/hover能力では物理キーボード接続を判別できないため、この先行非表示が不要なら `hideOnInputFocus={false}` でviewport検知だけにできます。従来どおり表示位置を変えたくない画面は `keyboardBehavior="stay"` を明示してください。
- **下側Sheetの入力時高さ（#706）**: `safeArea={true}`（既定）の通常bottom Sheetは、キーボード表示時に上端のsafe-areaも差し引き、ステータスバー・ノッチへの侵入を避けます。独自の全画面配置でこの補正が不要なら `safeArea={false}` を指定してください。snap Sheetは今回の高さ変更の対象外です。
- **画面・分類・配置編集（#701–#703）**: Screenへ上端safe-area、svh/fill、768px以上の中央カード、landmark省略を追加します。fillの中央カードは親の高さを尊重します。KanbanColumnの分類色指定と、選択・ドラッグ・矢印移動用SelectableTileも追加します。これらの追加APIは任意指定です。
- **予定のモバイル表示（#704）**: MonthCalendarへ週表示、予定一覧AgendaListを追加します。週表示は選択日を優先し、月外の初期選択日や内部の月またぎ移動でも表示週・月見出しを揃えます。既定の月表示は維持します。
- **管理画面のモバイルナビ（#705）**: AdminShellへ任意のモバイルドロワーを追加します。リンク選択時の自動closeは `closeMobileDrawerOnNavigate={true}` の明示指定で有効にし、既定falseでは既存の挙動を維持します。

## v2.14.0 の導入注意

以下はv2.14.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **余白・項目行・ダイアログ・アプリ枠・予定の色（#711–#716）**: Container / ChipFilterBar の `gutter="fluid"`（`--Container-Gutter-Fluid`）、FormField の `orientation="horizontal"`・Input / Textarea の `targetSize="comfortable"`、Dialog の `centerFrom`・`height="fill"`・`size="2xl"`・`DialogHeader variant="bar"`、FieldSet の `gap`・FieldLegend の `size="sm"`、MobileAppShell の `viewport="fixed"`・`safeAreaTop`・`safeAreaBottom`・`bottomPadding="native-tab-bar"`（`--Native-Tab-Bar-Height`。ネイティブ側が書く任意フック <!-- docs-drift-ignore: --Native-Tab-Bar-Height -->）、MonthCalendar / AgendaList の予定の `accentColor` を追加します。すべて任意指定で、既定の見た目は変わりません。
- **CollapsibleChipField の見出し（#717）**: `label` の既定の見た目が `typo-label-sm` + `Text-Medium-Emphasis`（12px）から、フォームの項目名と同じ `typo-label-md` + `Text-High-Emphasis`（14px 太字）に変わります（同じ詳細シートの `<Label>` / `FormField` と大きさをそろえるため）。従来の見た目が要る画面は `labelSize="sm"` を指定してください。展開中の選択肢のまとまりは見える見出しと `aria-labelledby` で結ばれます（`ariaLabel` を指定した場合は従来どおり `aria-label`）。`label` も `icon` も渡さない行は、先頭の 24px の空きが無くなります。native の CollapsibleChipField は変わりません。

## v2.21.0 の導入注意

以下はv2.21.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **SettingsListRow の右の選択肢の並びを項目名で読ませる（#763・追加。ただし `{...control}` と別名の aria-label を併用している行は読み上げ名が変わる）**: 関数の `rightSlot` が受け取る属性（型 `SettingsListRowControlProps`）に `"aria-labelledby"`（title の `<label>` の id。`controlId` を渡した行は `${controlId}-label`）が加わります。`${controlId}-label` / `${controlId}-description` は DS が使う id なので、画面の他の要素に同じ id を付けないでください。`<label>` は ChipSelector 単一選択・PillToggle `semantics="radio"`・QuickActionGrid 単一選択・StarRating の選択肢の並び（`role="radiogroup"` の div）を名付けられないため、これまでは title と同じ文字を `aria-label` に重ねる必要がありました。`rightSlot={(control) => <ChipSelector {...control} selectionMode="single" … />}`、id / aria-describedby を受け取らない部品は `rightSlot={(control) => <PillToggle aria-labelledby={control["aria-labelledby"]} semantics="radio" … />}` と書けば title が読み上げ名になるので、重ねていた `aria-label` は外せます。Switch 等を `{...control}` で渡している行は `aria-labelledby` も付きますが、label と同じ title を指すので読み上げ名は変わりません。ただし `{...control}` と一緒に title と違う文字の `aria-label` を付けている部品は、`aria-labelledby` が優先されて title で読まれるようになります。別の名前で読ませたい場合は `aria-labelledby={undefined}` を後ろに書いて打ち消してください（`{...control}` より後ろに書いた `aria-labelledby` が優先されます）。見た目、interactive / onClick の行（`{}` で呼ばれる）、関数が null を返した行の扱いは変わりません。あわせて、SettingsListRow に `controlLayout`（既定 `"inline"` = 従来どおり右端。`"stacked"` で title・description の下に行幅いっぱいで置く）、ChipSelector と PillToggle に `disabled`（すべての選択肢を押せなくする）を追加します。右端は縮まないので、ChipSelector の 4 択以上や長いラベルの並びは `controlLayout="stacked"` にしてください。行の `disabled` は関数に `disabled: true` で渡るので、ChipSelector は `{...control}` で、PillToggle は `disabled={control.disabled}` で行と一緒に止まります（これまで行だけ薄くなり、選択肢は押せていました）。native の SettingsListRow・ChipSelector・PillToggle は対象外です（RN に `htmlFor` 相当が無いため）。

## v2.20.0 の導入注意

以下はv2.20.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **SettingsListRow の項目名・説明と右の操作部品の結び付け（#759・追加のみ）**: SettingsListRow の `controlId` と、`rightSlot` に関数（`{ id, "aria-describedby" }` を受け取る。型 `SettingsListRowControlProps`）を渡す書き方（#759）。指定すると title が右の操作部品の `<label>`（押すと切り替わる）、description がその説明になります。指定しない行の DOM・見た目は変わりません。`<Switch aria-label="通知" />` のように title と同じ文字を重ねていた行は、`rightSlot={(control) => <Switch {...control} />}` に書き換えると読み上げの重複が無くなります（行に `disabled` を付けると関数に `disabled: true` も渡ります）。`controlId` を使って rightSlot に要素を渡すときは、操作部品に `id={controlId}` と（description があれば）`aria-describedby={`${controlId}-description`}` を自分で付けてください（id が見つからないと開発ビルドで警告します）。interactive / onClick の行（行全体が button）では結ばれず、関数は `{}` で呼ばれます。関数が null を返した行、要素が条件で null / false になった行も結ばれません。title にリンク等の操作要素を入れる行では使わないでください。 型 `SettingsListRowProps["rightSlot"]` が `ReactNode | (control) => ReactNode` に広がるため、この型を取り出して自前で `{rightSlot}` と描画している consumer は型エラーになりえます（DS 部品に渡すだけの使い方は影響なし）。native の SettingsListRow は対象外です（RN に `htmlFor` 相当が無いため）。

## v2.19.0 の導入注意

以下はv2.19.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **QuickActionGrid 単一選択の読み上げ名（#751・既定の読み上げの変更）**: FormField `as="group"` の中で `aria-label` / `aria-labelledby` を省いた `selectionMode="single"`（`role="radiogroup"`）は、その FormField のラベルで読まれるようになります（ChipSelector 単一選択・PillToggle `semantics="radio"`・StarRating と同じ）。見た目は変わりません。`selectionMode` 未指定 / `"multiple"`、`role` を上書きした場合、明示した `aria-label` / `aria-labelledby` は従来どおりです。group の中に `aria-label` を手で付けていた場合は外せます。
- **KebabMenu のトリガー（#752）**: 見た目の大きさ（32px）は変わらず、押せる範囲（透明な `before`）が 44px に広がります（周りのレイアウトは動きません）。隣の要素と 6px 未満で接している場合は、その隙間ぶん押せる範囲が重なるので、近すぎる配置は間を空けてください。読み上げ名の既定は KskLabels の `menu` になり、`KskLabelsProvider locale="en"` の配下では「メニュー」ではなく「Menu」と読まれます（Provider 無し・`locale="ja"` は従来どおり「メニュー」、`menuLabel` を渡した呼び出しは不変）。テストで英語の Provider の中の KebabMenu を `getByRole("button", { name: "メニュー" })` で探している場合は「Menu」で探してください。
- **DetailSheetHeader の trailing の間隔（#752・既定の見た目の変更）**: trailing の要素どうし・閉じるボタンとの間隔が 4px（`gap-1`）から 8px（`gap-2`）に広がります。KebabMenu（当たり判定が左右 6px はみ出す）と閉じるボタン（2px）の当たり判定が重なり、境目のタップが閉じるボタンに取られていたためです。trailing の要素が 1 つで閉じるボタンも無いヘッダーの見た目は変わりません。
- **native の Sheet / ResponsiveDialog / Celebration の Web での開き方（#753・Web の開き方の修正）**: react-native-web で動かしたとき、native の Sheet（全方向・snap mode）と、それを中で使う部品（スマホ幅の ResponsiveDialog・Select・MultiSelect・Combobox・DatePicker・TimePicker・DropdownFilter・BottomSheetForm・MenuDrawer・ReviewOverlay）、overlay の Celebration のカードが、開いてから約 0.8 秒画面外（カードは不可視）に止まり、最後に一気に出ていたのを直します。開いた直後から入口アニメーション（Sheet 220ms・snap の Sheet 180ms・カード 160ms）で出ます。iOS / Android の開き方（Modal の表示完了を待ってから動かす）は変わりません。API は変わりません。Web の E2E テストで「出るまで約 0.8 秒待つ」前提の固定待ちを入れていた場合は短くできます。
- **native の useReduceMotion を使う部品の unmount（#757・テスト環境の不具合の修正）**: matchMedia の無い環境（jsdom など）で react-native-web を使うと、Celebration など「視差効果を減らす」設定を読む native 部品が unmount 時に `Cannot read properties of undefined (reading 'remove')` で落ちていたのを直します。公開フックの `useReduceMotion` を直接使う場合も同じです。実際のブラウザ・iOS / Android の挙動は変わりません。テストでこの例外を避けるためだけに matchMedia を足していた場合は外せます。ただし matchMedia が無いと react-native-web は「視差効果を減らす」をオンとして扱うので、アニメーションが動く前提のテストでは `matches: false` を返す matchMedia を残してください。
- 追加のみ: KskLabels の `menu`（型 `KskLabels` では optional なので、既存の完全な翻訳オブジェクトはそのまま型チェックを通る。#752）。

## v2.18.0 の導入注意

以下はv2.18.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **FieldSet の見出しの下の間隔（#747・既定の見た目の変更）**: `gap` を省いた FieldSet でも、FieldLegend の下に子の間隔と同じ 24px（`mb-6`）が付きます（これまでは `gap` 指定時だけで、省くと見出しの直下が 0px でした）。見出しの下に `mb-*` / `pb-*` や空の要素を手で足していた場合は外してください。従来どおり見出しの直下を詰めたい画面は `<FieldLegend className="mb-0">` を指定してください（見出しの余白は詳細度 0 なので className が勝ちます）。子の間隔ごと詰めるなら `gap="sm"`（8px）/ `gap="md"`（16px）。FieldSet の className の `gap-*` では見出しの下は変わらないので、間隔は `gap` で指定してください。
- **StarRating の読み上げ名（#746・既定の読み上げの変更）**: FormField `as="group"` の中で `label` / `aria-label` / `aria-labelledby` を省いた入力用の StarRating は、「評価」ではなくその FormField のラベルで読まれるようになります（radiogroup をラベルに `aria-labelledby` で結ぶ。ChipSelector 単一選択・PillToggle `semantics="radio"` と同じ）。見た目は変わりません。テストで `getByRole("radiogroup", { name: "評価" })` により group 内の StarRating を探している場合は、FormField のラベルで探してください。表示専用（`onChange` なし）は従来どおり値の要約（「4/5点」）で読まれます。native の StarRating は今回の対象外です（読み上げ文言・FormField との結び付けは変わりません）。
- 追加のみ（Provider 無しの既定は不変）: StarRating の `aria-label` / `aria-labelledby`、KskLabels の `ratingGroup` / `ratingValue` / `ratingStar`（StarRating の既定文言。`{value}` / `{max}` を値に置き換える。`KskLabelsProvider locale="en"` で英語になる。型 `KskLabels` では optional なので、既存の完全な翻訳オブジェクトはそのまま型チェックを通る。全キー解決済みの型は `ResolvedKskLabels`。#746）。contracts の StarRating `sizes` に実装済みの `xl` を追加（#748）。

## v2.17.0 の導入注意

以下はv2.17.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **Banner の読み上げ（#740・既定の読み上げの変更）**: これまで variant に関係なく `role="alert"`（今の読み上げに割り込む）でしたが、`info` / `success` は `role="status"`（読み上げの区切りで伝える）に変わります。`warning` / `caution` は従来どおり `role="alert"` です。見た目は変わりません。info / success でも割り込ませたい画面は `live="assertive"`、画面を開いたときから出ている静的な説明は `live="off"`（role なし）を指定してください。`role` を明示している呼び出しは従来どおりそちらが優先です。テストで `getByRole("alert")` により info / success の Banner を探している場合は `getByRole("status")` に直してください。
- **DetailSheetHeader の閉じるだけの形（#742・既定の見た目の変更）**: title / titleEditor / description / leading / children のどれも渡さない（閉じるボタン・trailing だけの）ヘッダーは、下線と下余白（`border-b pb-4`）を出さなくなります。className で `border-0 pb-0` 等を上書きしていた場合は外せます。従来の下線が要る画面は `bordered` を指定してください。
- **FormField `as="group"` 内の ChipSelector 単一選択の名前（#741・既定の読み上げの変更）**: #734 では内側の radiogroup に名前を結ばない方針でしたが、radiogroup は WAI-ARIA 1.2 で名前が必須で外側の group の名前は継承されないため、`aria-label` / `aria-labelledby` を省いた単一選択はラベルを `aria-labelledby` で結ぶように変わります（PillToggle `semantics="radio"` も同じ）。複数選択は従来どおり結びません。明示した指定は優先されます。見た目は変わりません。
- 追加のみ（既定の見た目・読み上げは不変）: PillToggle の `aria-label` / `aria-labelledby`・`semantics="radio"`（フォームの値選び向け。FormField `as="group"` の中では radiogroup をそのラベルで名付ける。#741）、MonthCalendarHeader の `trailing`（#743）。

## v2.16.0 の導入注意

以下はv2.16.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **FieldGroup `variant="rows"` の余白が FormField 以外の行にも付く（#733・既定の見た目の変更）**: 直下の FormField 以外（Switch の行・ImageAttachmentPicker・Banner 等）にも上下 12px（`py-3`）が付きます。これらに `py-3` を手で書いていた場合は同じ値なので外せます。`my-*` のマージンは足し算になるので外してください。CollapsibleChipField は対象外（従来どおり）。
- **NavigationBar `leftLabelVisible` の文字幅の上限（#732）**: title ありのときの左の文字幅の上限が 176px になります（title なしは上限なし）。
- 追加のみ（既定の見た目は不変）: FormField `as="group"` 内の ChipSelector が名前なしの警告を出さない（外側の group が名前を持つ。#734）、Banner の `onDismiss` / `dismissLabel`（#735）、MonthCalendarHeader の `live`（#736）、AdminShell の `overlay`（背景の inert は重ねる側で付ける。#737）。

## v2.15.0 の導入注意

以下はv2.15.0の導入注意です。consumerへの展開・アプリ配布は別工程で、次回のまとめ展開で反映します。

- **DetailSheetHeader の文字列 title がシート / ダイアログの名前になる（#727・既定動作の変更）**: Sheet / Dialog（ResponsiveOverlayFrame・BottomSheetFrame・SideDrawerFrame 経由を含む）の中で `DetailSheetHeader title="…"` に文字列を渡すと、その見出しを SheetTitle / DialogTitle（Radix の Title）として描き、シート / ダイアログの読み上げ名（`aria-labelledby`）にします。見た目（`typo-heading-lg`）は変わりません。`data-slot` が `sheet-title` / `dialog-title` になり、`autoFocus="title"` の対象にもなります。**同じシートに sr-only の `SheetTitle` / `DialogTitle` を別に置いている場合は消してください**（残すと id が重複します。開発ビルドで console.error）。従来どおり別の Title で名前を付けたい画面は `overlayTitle={false}` を指定してください。オーバーレイの外・AlertDialog の中・`titleEditor` や ReactNode の `title` は変わりません。
- **DetailSheetHeader の leading が空のときの題名の位置（#729）**: `leading` を渡さない（null / undefined / false）見出しは左の列を描かなくなり、題名が 12px 左へ寄ってヘッダーの左の余白（20px）にそろいます（従来は幅 0 の列と 12px の間隔が残っていました）。`[data-slot="detail-sheet-header-leading"]` もその場合は出ません。
- **MonthCalendarExpandToggle の読み上げ名（#721）**: 読み上げ名（label）は開閉で変わらず 1 つです。開いているかどうかは `aria-expanded` が伝えます。開閉で文言を切り替えていた独自ボタンから置き換える場合は、label を 1 つにしてください。

<!-- deprecations:start（自動生成・手で編集しない） -->

## 非推奨 API 一覧

正本は [`contracts/deprecations.json`](./contracts/deprecations.json)。この節はそこから生成しています。

消費側での残存件数は次のコマンドで数えられます（read-only・残件があれば exit 1）:

```bash
npx ksk-ds check-migration ./src
```

| API | 使われ方 | 移行先 | 非推奨にした版 | 削除予定 |
| --- | --- | --- | --- | --- |
| `ListItem.interactive` | `<ListItem interactive>` | href または onClick を ListItem 自体へ渡す | 1.46.0 | v3.0.0 |
| `ChipSelector.multiple` | `<ChipSelector multiple>` | selectionMode（multiple={false} は selectionMode="single"、multiple は selectionMode="multiple"） | 2.0.0 | v3.0.0 |
| `PillToggle.onValueChange` | `<PillToggle onValueChange>` | onChange | 1.49.0 | v3.0.0 |
| `ProductCard.deliveryLabel` | `<ProductCard deliveryLabel>` | なし（v1.30.0 以降は描画されないため、渡している箇所は削除する） | 1.30.1 | v3.0.0 |
| `Progress.tone` | `<Progress tone>` | variant | 1.40.1 | v3.0.0 |
| `ProgressRing.thickness` | `<ProgressRing thickness>` | strokeWidth（Web の同名 prop と語彙を揃えた。値の意味・既定値 6 は同じ） | 2.0.0 | v3.0.0 |

各エントリの補足:

- **ListItem.interactive**（issue #207） — 外側の Link / button でラップする既存コードの視覚互換用に残している。 実装: src/components/patterns/list-item.tsx
- **ChipSelector.multiple**（issue #352） — 既定が true（複数選択）で「渡し忘れると静かに壊れる側」に倒れているため新規実装では使わない。 実装: src/components/patterns/chip-selector.tsx / src/native/components/ChipSelector.tsx
- **PillToggle.onValueChange**（issue #264） — 後方互換エイリアス。onChange を併せて渡した場合は onChange が優先される。 実装: src/components/ui/pill-toggle.tsx
- **ProductCard.deliveryLabel** — 既存 consumer の型互換のためだけに残している no-op prop。 実装: src/components/patterns/commerce/product-card.tsx
- **Progress.tone** — React Native 版のみ。既存 RN consumer 向けの互換。 実装: src/native/components/Progress.tsx
- **ProgressRing.thickness**（issue #495） — Native だけが持っていた別名。同じ「線の太さ」を Web は strokeWidth と呼んでいたため、両方を触る実装者が読み替えを強いられていた。両方渡された場合は strokeWidth を優先する。 実装: src/native/components/ProgressRing.tsx

削除は「全消費リポで `check-migration` の残件が 0」を条件に、`削除予定` のメジャーリリースで行います。

<!-- deprecations:end -->

---

## v2.12.0

追加のみで、APIの削除・改名はありません。propsを渡さなければ従来と同じ表示です。次の3点は取り込み時に確認してください。

- ShareButtonsのLINEの塗りボタンは、文字が黒になります。白だと#06C755上で約2.2:1となりAAに届かないためです。
- IconBadgeのsuccess / warningは、アイコン色がText-*に変わります。非テキストの3:1を満たすためで、見た目が少し濃くなります。
- inline系のAlertが `title` / `description` / `icon` propを描画するようになりました。以前は空の枠になっていたため、該当箇所の表示を確認してください。

---

## v2.11.0

追加のみで、APIの削除・改名はありません。propsを渡さなければ従来と同じ表示です。次の2点は取り込み時に確認してください。

- Cardに `onClick` を渡していた場合、Card全体が押せる面（button）になります。従来のdiv向けハンドラもそのまま型が通ります。`href` / `disabled` も使えます。
- 名前の無いChipSelector（単一選択）、押せるCard、CodeInputは、開発ビルドで1回 `console.warn` を出します。`aria-label` / `aria-labelledby` を渡すか、CardはCardTitle / CardDescriptionで名前を付けてください。

---

## v2.10.0

APIの削除・改名はありません。次の表示・操作の既定値変更は、取り込み時に利用画面で確認してください。

- Webの操作枠は `--Border-Control`、Switchオフ地は `--Surface-Switch-Off` / `--Surface-Switch-Off-Hover`、Slider溝は `--Surface-Slider-Track` を通常表示から宣言します。従来の `--Border-Medium-Emphasis` / `--Surface-Quaternary` 等の上書きでは操作部品を変更しません。独自テーマは専用ロールを上書きし、背景との3:1を再検証してください。非操作区切りは従来どおりです。Native部品本体の既存枠色を一括変更するリリースではありません。
- AlertDialogは既定でCancelにフォーカスし、閉じると開く前の要素へ戻ります。画面独自の移動が必要なら `onOpenAutoFocus` / `onCloseAutoFocus` で `preventDefault()`、自動復帰の無効化は `restoreFocusOnClose={false}` を使ってください。
- DataTableRowのhover背景は操作可能な行だけに付き、選択行の背景はhover中も維持します。Chipのhover背景とAlert成功枠も変更されます。
- Shadow DOMの対応範囲とRadix由来の制約は [利用上の注意](https://github.com/ekusiek716/ksk-design-system/blob/main/docs/shadow-dom.md) を参照してください。ToastをShadow内に描画するときはProvider配下にToasterを明示してください。
- CLIのP052/P053検査は部品の形の上書き・`@layer`外のグローバルCSSを新たに検出します。既存コードで検出された場合は正本ルールと例外の理由を確認してください。

---

## v2.0.0

**破壊変更は peerDependencies の要件変更 1 点のみ。** 識別子 / prop の削除・rename は
無いので、コードの書き換えも codemod も要りません。

| 項目 | v1 系 | v2.0.0 |
|---|---|---|
| `react` / `react-dom` | `^18.0.0 \|\| ^19.0.0` | `^19.0.0` |
| `react-native` | `>=0.74.0` | `>=0.78.0` |

- **React 19 / RN 0.78 以上を使っている場合: 対応不要**。`npm install ksk-design-system@2`
  で上げるだけで、API は v1.70 系＋今回の機能追加のまま
- **React 18 のまま使いたい場合**: `ksk-design-system@^1` に固定してください。
  v1 系に React 19 専用化は入っていません

major にした理由は、`^1.x` を指定している React 18 利用者が自動で拾うと
インストールが失敗しうるため（実装は元から React 19 の ref-as-prop 前提で、
React 18 では `ref` が無言で無視されていた）。詳細は下の
「peerDependencies の要件変更」節と issue #502 を参照。

なお v1 系で非推奨にした prop（`ListItem.interactive` ほか 5 件）は
**v2.0.0 では削除していません**。削除は「全消費リポで `check-migration` の
残件が 0」を条件に v3.0.0 で行います。

## v2 系内の追加（参考）

### v2.7.0 — CSS の入口 `preset-core` / `safelist` を追加（追加のみ・破壊的変更なし）

`ksk-design-system/preset` から DS 部品用の safelist（`src/styles/source-safelist.css`）だけを
除いた `ksk-design-system/preset-core` と、safelist 単体の `ksk-design-system/safelist` を
exports に足した。

- **既存 consumer: 対応不要**。`preset` は `preset-core` + `safelist` を読み込む形に組み替えたが、
  生成される CSS は従来と同じ
- DS 部品を 1 つも使わない consumer は `preset` を `preset-core` に置き換えると、
  部品用の utility（safelist 約 1,150 クラス分）が出力から消える。部品を使うルートが 1 つでもある
  ビルドでは `preset` のままにする（詳細は README の「DS 部品を使わない consumer は `preset-core`」節）
- DS 本体の CSS を編集するときは、トークン・base layer 等は `src/preset-core.css` に書く
  （`src/preset.css` は 2 つを読み込むだけの入口）

## v3.0 (未リリース)

破壊変更を入れる際にはここに以下を書く:
1. 削除した識別子 / prop の一覧（rename テーブル）
2. before / after コード例
3. 自動移行コマンド: `npx ksk-design-system codemod <name> ./src`（`<name>` は
   そのリリースで追加した `scripts/codemod/<name>.mjs`。利用できる名前は
   `npx ksk-design-system codemod` で一覧できる）
4. 手動対応が必要な項目（codemod では拾えないケース）

---

## peerDependencies の要件変更（インストールに影響）

### peerDependencies を React 19 のみに狭める（issue #502）

**インストール要件が変わります。** `peerDependencies` を実装の実態に合わせました:

| 依存 | 変更前 | 変更後 |
|---|---|---|
| `react` | `^18.0.0 \|\| ^19.0.0` | `^19.0.0` |
| `react-dom` | `^18.0.0 \|\| ^19.0.0` | `^19.0.0` |
| `react-native` | `>=0.74.0` | `>=0.78.0` |

理由: `Input` / `Textarea` / `Dialog` / `QuickActionGrid` などは React 19 の
ref-as-prop（関数コンポーネントが `ref` を通常の prop として受け取る仕様）で書かれており、
`forwardRef` を一切使っていません。React 18 でこれらに `ref` を渡すと
`Function components cannot be given refs` の警告が出て `ref` は呼ばれません。
つまり `^18.0.0` の宣言は**もともと実態と合っていませんでした**。今回は嘘の互換宣言を消す
だけで、React 19 の利用者にとってのコード変更はありません。

`react-native` を `>=0.78.0` にしたのは、React 19 を同梱する最初の RN が 0.78 のため
（0.74〜0.77 は React 18 系で、`react: ^19.0.0` と両立しません）。

**移行手順**

- React 19 / RN 0.78 以上を使っている場合: **対応不要**（DS を上げるだけ）
- React 18 のまま使いたい場合: `ksk-design-system@^1` に固定するか、React 19 へ上げてください。
  DS 側に React 18 互換の実装を残す予定はありません

なお `examples/native-sandbox`（リポジトリ内の開発用サンドボックス。npm 配布物には含まれず、
DS を npm から install もしません）は react-native-web 0.19 の都合で React 18 のままです。
消費側の要件には影響しません。


**リリース種別**: **v2.0.0（major）で公開**。ランタイム API は変わらず React 19 利用者には
無影響だが、`^1.x` を指定している React 18 / RN 0.74〜0.77 の利用者が自動で拾うと
install に失敗しうるため、SemVer どおり major に倒した。

---

## v1 系内の minor 変更（参考）

### v1.70.0 — `ResponsiveOverlayFrame` に `preset="plain"` を追加（issue #486）

`side="bottom"` の経路は必ず `BottomSheetFrame` の preset を通るため、
`sm:`（640px 以上）でフロートカード化し、内側 padding も落ちる（`p-0`）。
「タブレット幅でも全幅の下部シートのままでよい」面——素の
`<SheetContent side="bottom">` で組んである確認シート等——には強すぎて、
移行すると 640〜1023px の見た目が変わってしまう。

`preset="plain"` はその橋渡し。モバイルは素の `<SheetContent side="bottom">`
そのまま（全幅・下端固定・`p-6`・`max-h-[90dvh]`）で、デスクトップだけ
中央モーダル（32rem × `min(90dvh, 46rem)`）になる。

**before**

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="bottom" className="max-w-md mx-auto pb-8">
    …
  </SheetContent>
</Sheet>
```

**after**

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="lg">
  <ResponsiveOverlayFrame preset="plain" className="max-w-md mx-auto pb-8">
    …
  </ResponsiveOverlayFrame>
</ResponsiveDialog>
```

注意点:

- `preset="plain"` では `padding`（既定 `true` = `p-6`）が使える。他の preset は
  preset 自身が余白を持つため `padding` は型エラーになる。
- デスクトップの角丸は `--Radius-Modal`（1.5rem）。消費側 CSS で 1rem 等に
  していた場合は `desktopClassName` で明示する。
- 高さは `min(90dvh, 46rem)`。モバイルの `max-h-[90dvh]` を引き継いだ値で、
  縦 866px 以上の画面では 46rem が効く。
- 幅の 32rem は `sm:`（640px 以上）で効く。`breakpoint` を 640px 未満に解決する
  設定では DialogContent 既定の `max-w-[calc(100%_-_3rem)]` が残る。
  `breakpoint="md"` / `"lg"` 運用なら影響しない。
- `desktopPosition` は `"center"` / `"top"` のみ。`"fullscreen"` は plain の
  幅指定と噛み合わないため型で禁止している。

### v1.69.0 — `ResponsiveOverlayFrame` が float / float-glass シートを受けられるようになった（issue #479）

#472 で入った `ResponsiveOverlayFrame` は内部で `BottomSheetFrame`（`side="bottom"` 固定）を
使うため、左右・下に余白を持つカード型のシート（`side="float"` / `"float-glass"`）を
受けられなかった。消費側はその形のシートだけ、デスクトップ中央モーダル化の
global CSS（`!important`）を残す必要があった。

`side` prop を足したので、float 系も同じ 1 つの API で切り替えられる。

**before**（`Sheet` + `SheetContent side="float"` + 消費側 global CSS）

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="float" className="w-full max-w-md mx-auto p-6">
    …
  </SheetContent>
</Sheet>
```

```css
/* 消費側 global CSS — 削除する */
@media (min-width: 1024px) {
  [data-slot="sheet-content"][data-side="float"]:not([data-snap-active]) {
    left: 50% !important; top: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: min(32rem, calc(100vw - 4rem)) !important;
    max-height: min(85vh, 46rem) !important;
    border-radius: var(--Radius-Modal) !important;
  }
}
```

**after**

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="lg">
  <ResponsiveOverlayFrame side="float" className="max-w-md">
    …
  </ResponsiveOverlayFrame>
</ResponsiveDialog>
```

注意点:

- `side` ごとに効く prop が違い、**効かない組み合わせは型エラーになる**（黙って無視されない）。
  - `side="bottom"`（既定）: `preset` / `surface` / `desktopPosition` が使える。`padding` は不可
    （preset が余白を持つため）。
  - `side="float"` / `"float-glass"`: `padding`（既定 `true` = `p-6`）が使える。
    `preset` / `surface` / `desktopPosition` は不可。
- `"float-glass"` の素材は `side` 自身が決める（`glass` + `glass-specular`）。
  `surface="glass"`（`glass-strong`）とは別物で、二重に重ねると glass.css の記述順でしか
  勝敗が決まらないため型で禁止している。
- デスクトップの寸法は幅 `32rem`（`sm:max-w-lg`）× 高さ `min(85dvh, 46rem)`。上の global CSS が
  当てていた値と実質同じだが、厳密には次の差がある:
  - 高さの単位が `dvh`（DS）と `vh`（旧 CSS）で、アドレスバーが伸縮する環境では一致しない。
  - 幅の上限は `sm:`（640px 以上）で効く。`breakpoint` を 640px 未満に解決する設定
    （`product-theme` で小さい値を入れた場合）では DialogContent 既定の
    `max-w-[calc(100%_-_3rem)]` が残る。`breakpoint="md"` / `"lg"` 運用なら差は出ない。
- デスクトップでは overlay（背景の暗転）がガラスにならない（`glassOverlay` はシート固有の
  prop なので落ちる）。面だけガラス、背景は通常の暗転になる。
- snap point 付きのシートは #472 と同じくシートのまま。ただし DS の snap は
  `side="bottom"` 専用なので、`snapPoints` と float 系の併用は snap もデスクトップ変換も
  効かない「何も起きない」組み合わせになる。どちらかに寄せること。

### v1.67.0 — `ResponsiveOverlayFrame` 追加（`BottomSheetFrame` + 消費側デスクトップ CSS からの移行 / issue #472）

`BottomSheetFrame` はモバイルの preset（`mobile-full` / `mobile-page` /
`mobile-form`）を持つ一方でデスクトップでは中央モーダルにならず、消費側は
global CSS で `position` / `transform` / `width` / `max-height` / `radius` を
`!important` 上書きしてシートをデスクトップモーダルへ変換していた
（belle-todo で 25 箇所 + 変換ルール1本）。この上書きは DS 内部の `data-slot` /
`data-side` / class 名の substring に依存するため、Sheet の内部変更で静かに壊れる。

`ResponsiveOverlayFrame` は同じ preset をモバイルで保ったまま、デスクトップでは
`DialogContent`（中央モーダル）として描画する。上書き用の CSS は不要になる。

**before**（`Sheet` + `BottomSheetFrame` + 消費側 global CSS）

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <BottomSheetFrame preset="mobile-form">
    <DetailSheetScaffold header={…} footer={<KeyboardAwareSheetFooter>…</KeyboardAwareSheetFooter>}>
      …
    </DetailSheetScaffold>
  </BottomSheetFrame>
</Sheet>
```

```css
/* 消費側 global CSS — 削除する */
@media (min-width: 768px) {
  [data-slot="sheet-content"][data-side="bottom"]:not([data-snap]) {
    position: fixed !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: min(32rem, calc(100% - 3rem)) !important;
    max-height: 85dvh !important;
    border-radius: var(--Radius-Modal) !important;
  }
}
```

**after**

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="md">
  <ResponsiveOverlayFrame preset="mobile-form" description="タスクを編集します">
    <DetailSheetScaffold header={…} footer={<ResponsiveOverlayFooter>…</ResponsiveOverlayFooter>}>
      …
    </DetailSheetScaffold>
  </ResponsiveOverlayFrame>
</ResponsiveDialog>
```

移行の手順:

1. `<Sheet>` を `<ResponsiveDialog>` に、`<BottomSheetFrame>` を
   `<ResponsiveOverlayFrame>` に置き換える（`preset` / `surface` はそのまま）。
2. `<KeyboardAwareSheetFooter>` を `<ResponsiveOverlayFooter>` に置き換える
   （モバイルでは従来どおりソフトキーボードに追従し、デスクトップでは静的フッタになる）。
3. 消費側 global CSS のデスクトップ変換ルールを削除する。
4. 切り替え境界が 768px でよければ指定不要。変えたい場合は
   `breakpoint="lg"` などを指定するか、`breakpoint="product-theme"` にして
   `:root { --Overlay-Desktop-Breakpoint: 1024px }` を product theme 側に置く。
5. `<Sheet snapPoints={…}>` の snap シートは**変換しない**。`ResponsiveDialog` に
   `snapPoints` を渡した場合は境界を越えてもシートのまま描画される。

`description` / `autoFocus` / `restoreFocusOnClose` / `closeOnEsc` /
`bodyScrollLock` / `zIndex` は両分岐へそのまま渡る。`container` /
`overlayClassName` / `glassOverlay` / `swipeToClose` はシート固有なので
デスクトップでは無視される。

既存の `BottomSheetFrame` / `ResponsiveDialogContent` は非推奨ではない
（モバイル専用面・preset 不要の面では引き続きそのまま使う）。

### v1.62.0 — `typescript` が必須依存から optional peer dependency になった（issue #409）

CLI の1ルール（P046）のためだけに typescript（24MB）が全 consumer の
node_modules に入っていたのを解消した。install サイズが減り、`ksk-ds lint` の
起動も速くなる（実測 655ms → 407ms）。

- **通常の TypeScript プロジェクト**: 自前で typescript を持っているので影響なし
- **typescript を持たないプロジェクト**: P046（card-child-spacing）だけが
  「typescript が無いため skip」の1行案内つきでスキップされる。他の全ルールは動く
- DS の typescript に transitive 依存していた場合のみ、自分の devDependencies に
  typescript を追加すること


### v1.62.0 — `ksk-ds lint` の severity 語彙が `warn` → `warning` に統一（要確認）

`--format json` の `results[].severity` と text 出力の severity 表記が、これまで
`"warn"` と `"warning"` で不統一だった（contract の `contracts/rules.json` は
`"warning"`、CLI 出力は `"warn"`）。**CLI 出力側を `"warning"` に揃えた**（issue #406）。

CI で JSON をフィルタしている場合は置き換えが必要:

```bash
# before
jq '[.results[] | select(.severity == "warn")] | length'
# after
jq '[.results[] | select(.severity == "warning")] | length'
```

text 出力の要約行も `0 error / 3 warn` → `0 error / 3 warning` に変わる。

あわせて `ksk-ds lint` に次を追加した:

- `--strict` … warning があれば exit 1
- `--max-warnings N` … warning が N 件を超えたら exit 1
- **未知のオプションはエラー終了**（従来は黙って捨てられ、CI に書いた
  `--strict` が無言で効かないまま緑になっていた）

### v1.62.0 — `ksk-ds lint` の escape がルール単位・行単位で書けるようになった

ファイル全体・全ルールを無期限に外す `// ksk-ds-allow-custom-ui: 理由` は
後方互換で残るが**非推奨**。新規はルール単位を使う（issue #405）:

```tsx
// ksk-ds-lint-ignore P008 -- ブランドロゴの規定色のため     ← 直下 2 行以内に効く
// ksk-ds-lint-ignore-file P008 -- ブランド定数ファイル      ← そのファイル全体・P008 のみ
```

理由は **5 文字以上が必須**。空虚な理由は `ESCAPE001` / `ESCAPE002` として報告され、
ignore は効かない。あわせて escape マーカーは**文字列リテラルの中では発火しなくなった**
（ドキュメント URL に `ksk-ds-allow-custom-ui` が含まれるだけで lint 全体が黙って
無効化されていた）。既に short な理由を書いていたファイルは lint が復活するので、
理由を書き足すか違反を直すこと。

### v1.62.0 — 自動生成物と DS 自身のトークン CSS を lint 対象外にした

- 先頭 12 行に自動生成マーカー（`AUTO-GENERATED` / `DO NOT EDIT` / `自動生成` 等）を
  持つファイルは全ルールを skip する（issue #408）。直す先は生成物ではなく生成元。
- P049（product theme の無許可上書き）は、DS 自身 / ベンダリングされた DS の
  トークン定義 CSS を対象外にする（issue #407）。`vendor/ksk-design-system/**` のように
  DS を再梱包しているリポで P049 が大量に出ていたのが解消する。

### v1.62.0 — `Footer` の `paymentIcons` 既定値が空になった（挙動変更）

`Footer` は `paymentIcons` を省略すると `["VISA", "Master", "JCB", "AmEx", "PayPay", "LINE Pay"]`
の決済バッジを既定で描画していた。EC 以外のプロダクトでも「取り扱っていない決済手段」が
出てしまうため、**既定値を `[]`（非表示）に変更**した。

従来の表示を維持したい場合は明示的に渡す:

```tsx
<Footer
  paymentIcons={["VISA", "Master", "JCB", "AmEx", "PayPay", "LINE Pay"]}
  copyright="© 2026 KSK Inc."
/>
```

`paymentIcons` を明示的に渡していた箇所は影響なし。

### v1.60.0 — `postinstall` による AI ルールファイル自動設置を廃止（要確認）

これまで `npm install ksk-design-system` の `postinstall` フックが、消費側の
プロジェクトルートに `CLAUDE.md` / `AGENTS.md`（`node_modules` 内の DS ルールを指す
薄いポインタ）を自動設置していた。**この自動設置を廃止し、明示コマンドに一本化した。**

```bash
npx ksk-ds init          # 設置（既存ファイルはスキップ）
npx ksk-ds init --force  # 既存ファイルを最新テンプレートで上書き
```

**既に設置済みの消費リポは対応不要。** 元々 `postinstall` は既存ファイルを上書きしない
仕様だったため、設置済みのプロジェクトでは実質 no-op だった。影響を受けるのは
**新規に DS を導入するプロジェクトの初回だけ**で、`npm install` の後に上記を 1 回実行する。

廃止の理由は、install 時にプロジェクトルートへ AI エージェント向け指示ファイルを書き込む
挙動が、サプライチェーン検査で「同意なき AI エージェント制御面の設置」として Critical 判定
されるため。LPM Firewall が 1.49.2 / 1.51.1 をこの理由でブロック判定しており、
`postinstall` を持つ限りバージョンを上げても判定が引き継がれる。あわせて
`INIT_CWD` 参照も削除し、書き込み先はコマンドを実行したディレクトリに固定した。

### v1.49.0 — PillToggle の onChange/onValueChange 統一（破壊変更なし）

`PillToggle` のみ他コンポーネント（Switch 等の native 系を除く）と異なり `onValueChange`
を主 API として案内していたため、`onChange` に統一した（issue #264⑥）。
`onValueChange` は非推奨エイリアスとして両対応するため、**既存コードの書き換えは不要**。

```tsx
// Before（引き続き動作するが非推奨）
<PillToggle options={options} value={value} onValueChange={setValue} />

// After（推奨）
<PillToggle options={options} value={value} onChange={setValue} />
```

`onChange` と `onValueChange` を両方渡した場合は `onChange` が優先される。
`onValueChange` は将来のメジャーバージョンで削除予定。

### v1.49.0 — Tailwind 4.1 以上が必要（要確認）

preset に DS 内部ユーティリティの safelist（`src/styles/source-safelist.css`・自動生成）を同梱した（issue #258）。
これにより、消費側の `@source ".../ksk-design-system/dist"` の設定漏れやパスずれで
DS 内部クラスの CSS が生成されず消費側でだけ壊れる問題（#132/#134/#138/#143）が構造的に解消する。

safelist は **Tailwind 4.1 で導入された `@source inline()`** を使うため、
peerDependencies を `tailwindcss@^4.0.0` → `^4.1.0` に引き上げた。
API の破壊変更はないが、Tailwind 4.0.x のままだと preset の読み込みに失敗する:

```bash
# DS を上げる前に Tailwind を先に上げる
npm install -D tailwindcss@^4.1
```

`@source` の記述は引き続き推奨（消費側自身のコードは消費側の走査対象のため）。

### v1.34.0 — パッケージ名変更（要対応）＋ RN/Expo 対応

**npm パッケージ名を `@ksk/design-system` → `ksk-design-system` に変更**（npm スコープ除去・OSS 公開準備）。機能面の破壊はないが、**import の一括置換が必要**:

- TS/JS: `from "@ksk/design-system"` → `from "ksk-design-system"`
- CSS: `@import "@ksk/design-system/preset"` → `@import "ksk-design-system/preset"`（`/themes/*` も同様）
- 依存名: package.json の `@ksk/design-system` → `ksk-design-system`（vendoring の tgz 差し替え時）

消費リポでの一括置換例:

```bash
git grep -lz '@ksk/design-system' -- src \
  | xargs -0 sed -i '' 's#@ksk/design-system#ksk-design-system#g'
```

あわせて追加（いずれも破壊変更なし）:

- **RN/Expo 対応**: `ksk-design-system/native`（解決済みトークン）と `ksk-design-system/native/ui`（RN コンポーネント）を新設
- **CheckboxField** コンポーネント追加
- 角丸トークンに `md`(6px) / `xl`(12px) を許可セットへ追加

### v1.16.0 (予定)

新機能追加のみ・破壊変更なし:

- **Button** に `inverse` / `ghost-inverse` バリアント追加
- **Button** に `hero` サイズ追加
- **Checkbox** に `label` / `description` / `count` props 追加（polymorphic 化）
- **Alert** に prop ベース API 追加（`title` / `description` / `icon` / `action`）
- **Chip** に `soldOut` / `count` / `href` 状態追加
- **Storybook** で autodocs グローバル化、guidelines.mdx 追加
- **scripts/check-deps.sh** で ui → patterns 階層の逆依存を CI でブロック
- **Vitest** 最小導入 + backwards-compat スイート
- 全コンポーネントに `data-slot` / `data-variant` / `data-size` を徹底
- **preset.css**: Tailwind v4 の `currentColor` 既定対策として、border-color / outline-color のベースレイヤ保険を追加。`@import "ksk-design-system/preset"` するだけで有効。破壊変更なし — 明示色を持つ枠線は不変で、色未指定の枠線のフォールバックのみ `--border` / `--ring` に固定される（消費側で枠線が黒ずむ不具合を防止）

何もしなくても既存コードはそのまま動く。

### v1.15.x

過去の minor / patch 履歴は GitHub Releases を参照。

---

## 移行作業の進め方

### Step 1. Codemod を dry-run

```bash
npx ksk-design-system codemod vX-to-vY ./src --dry
```

書き換え対象ファイル一覧が表示される。

### Step 2. 実際に適用

```bash
npx ksk-design-system codemod vX-to-vY ./src
git diff
```

`git diff` で意図通りか確認。

### Step 3. ESLint で残骸チェック

`eslint.config.js` に:

```js
import kskDeprecated from "ksk-design-system/eslint/deprecated"

export default [
  {
    plugins: { "ksk-deprecated": kskDeprecated },
    rules: { "ksk-deprecated/no-deprecated": "error" },
  },
]
```

これで codemod が拾えなかった旧 API の使用を検出できる。

### Step 3.5. 非推奨 API の残存を数える

```bash
npx ksk-ds check-migration ./src
```

`contracts/deprecations.json` の非推奨 API が何件残っているかを、識別子別・ファイル別に出す
（read-only・残件があれば exit 1 なので CI にも置ける）。

### Step 4. 動作確認

```bash
npm run test
npm run build
```

それから本番デプロイへ。

## 関連

- [UPDATING.md](./UPDATING.md) — 消費側（DS を npm 依存に持つプロジェクト）向けのアップデート手順（バージョンの読み方・PR 作業手順）
