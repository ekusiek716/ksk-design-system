# Release Cadence — `ksk-design-system`

`ksk-design-system` のリリーススケジュール・運用ルール。

## v2.23.0（2026-11-01）

2.22.0以降に、カード型のラジオ選択行の追加と、Web / native の操作・読み上げ・見た目の不具合修正をまとめたminorリリース。次の点は既定の挙動・見た目が変わります。

- DataTable の行クリックが、セル内の操作・編集できるセルでは呼ばれなくなり、編集できるセルはキーボードで操作できます（#837）。DatePicker 系は選択中の日の再押下で値が消えず、消す手段は `clearable` です（#847）。
- Dialog / Sheet のフォーカスの戻り先、日本語入力の変換中の Esc、ConfirmDialog の処理中の Esc、重ねた CoachMarkOverlay の操作で下が閉じる不具合を直しました（#849 / #850 / #851）。Sheet のスワイプ・キーボード補正（#844）、SwipeRow・AdminShell・Progress・Toast の自動消去の一時停止（#839）、チップ・タグ入力・FormSection（#836）、OrderSummary・週表示カレンダー・Select の一覧の高さ（#841）なども直っています。
- Combobox が別名・表記ゆれでも絞り込め、Enter で選べ、選んだ値が読み上げ名に入ります（#783）。`toast()` は `<Toaster>` のある画面で body に置き場を作りません（#771）。
- ダークの情報・警告・淡いブランド面の上の文字を一段明るくし、AA 4.5:1 以上にしました（#830）。
- native: Sheet / Dialog を開いている間の Toast が前面に出ます（`ToastOutlet`、#820）。数値入力・複数選択・Slider・Sheet のキーボード回避・ボタンやタブの読み上げ・Web ビルドの選択状態の読み上げなどを直しました（#834 / #835 / #838 / #843 / #848）。
- preset が開閉アニメの CSS を作り、react-hook-form / react-day-picker を dist に同梱しなくなりました（#846）。`ksk-ds lint` が複数行タグ・`--changed`・存在しないパスで黙って「違反なし」にならなくなりました（#842）。
- 追加: カード型のラジオ選択行（#782）。

導入時は [2.23.0の注意](./MIGRATION.md#v2230-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。

## v2.22.0（2026-10-27）

2.21.0以降に、フォーカスリングを全テーマでWCAG 1.4.11（非テキスト3:1）以上にし、KskLabelsProvider の対象をほぼ全部品に広げたminorリリース。次の点は既定の見た目・読み上げが変わります。

- フォーカスリングをライトは不透明な Brand-600 にしました（旧: Brand-400 の半透明）。塗りつぶしのボタン等には面から2pxのすき間が入り、エラー中の入力欄は不透明な Caution のリングになります。写真・ガラスの上の操作子は白と濃色の二重リングになり、glass 系 Button で出ていなかったリングが出るようになります（#772 / #773）。consumer の半透明のフォーカスリングは新しい lint P054 が警告します。
- `KskLabelsProvider locale="en"` の配下で、約80部品の既定文言・読み上げ名が英語になります。Provider を置いていないアプリ、`locale="ja"` のアプリの文言は変わりません（#770 / #775 / #778 / #779）。
- native の RadioGroup がグループとして読まれ、各行は `checked` で状態を伝えます。native の glass Button が `containerStyle` / `pressedContainerStyle` を読むようになります（#774 / #777）。
- 追加のみ: `npx ksk-ds theme`（ブランド色からテーマを生成）、`npx ksk-ds report-ignores`（consumer の lint 回避理由の横断集計）、DS 側 CI の配布物サイズ予算（#767 / #768 / #769）。

導入時は [2.22.0の注意](./MIGRATION.md#v2220-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。

## v2.21.0（2026-10-19）

2.20.0以降に、SettingsListRow の右側に選択肢の並び（ChipSelector・PillToggle など）を置く行を、追加の指定なしで項目名どおりに読ませるminorリリース。追加のみですが、`{...control}` と別名の `aria-label` を併用していた行は読み上げ名が変わります。

- SettingsListRow の関数 `rightSlot` が受け取る属性に、title の `<label>` を指す `aria-labelledby` を追加します。これまで title と同じ文字を `aria-label` に重ねていた行は、重ねを外せます（#763）。
- `{...control}` と title と違う文字の `aria-label` を併用していた行は、`aria-labelledby` が優先されて title で読まれます。別名で読ませたい場合は `{...control}` の後ろに `aria-labelledby={undefined}` を書いて打ち消します。`${controlId}-label` / `${controlId}-description` は DS が使う id です。
- SettingsListRow に `controlLayout`（既定 `"inline"`。`"stacked"` で title・description の下に行幅いっぱいで置く）、ChipSelector と PillToggle に `disabled` を追加します。
- native の SettingsListRow・ChipSelector・PillToggle は対象外です。

導入時は [2.21.0の注意](./MIGRATION.md#v2210-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。

## v2.20.0（2026-10-19）

2.19.0以降に、SettingsListRow の項目名・説明を右の操作部品（Switch など）と結べるようにしたminorリリース。追加のみで、指定しない行の見た目・読み上げ・動きは変わりません。

- SettingsListRow に `controlId` と、`rightSlot` に関数（`{ id, "aria-describedby" }` を受け取る。型 `SettingsListRowControlProps`）を渡す書き方を追加します。結ぶと title が右の操作部品の `<label>`（押すと切り替わる）、description がその説明になり、読み上げの重複がなくなります（#759）。
- interactive / onClick の行（行全体が button）では結ばれません。native の SettingsListRow は対象外です。
- `rightSlot` の型が `ReactNode | (control) => ReactNode` に広がります。この型を取り出して自前で描画している consumer は型エラーになりえます。

導入時は [2.20.0の注意](./MIGRATION.md#v2200-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。

## v2.19.0（2026-10-19）

2.18.0以降に、consumer の上書きを減らす読み上げ・当たり判定の調整と、native の Sheet などが Web で約0.8秒止まってから出る不具合の修正をまとめたminorリリース。次の点は既定の見た目・読み上げ・動きが変わります。

- FormField `as="group"` の中で名前を省いた QuickActionGrid 単一選択（`role="radiogroup"`）は、その FormField のラベルで読まれます（#751）。
- KebabMenu のトリガーは見た目32pxのまま押せる範囲が44pxに広がり、読み上げ名の既定が KskLabels の `menu` になります。DetailSheetHeader の trailing の間隔は4pxから8pxに広がります（#752）。
- react-native-web で動かしたとき、native の Sheet（全方向・snap mode）とそれを中で使う部品（スマホ幅の ResponsiveDialog・Select・MultiSelect・Combobox・DatePicker・TimePicker・DropdownFilter・BottomSheetForm・MenuDrawer・ReviewOverlay）、overlay の Celebration のカードが、約0.8秒止まってから一気に出ていたのを直します。開いた直後から入口アニメーションで出ます。iOS / Android の開き方は変わりません（#753）。
- matchMedia の無い環境（jsdom など）で、native の useReduceMotion を使う部品が unmount 時に落ちていたのを直します（#757）。

主な追加は KskLabels の `menu`（型では optional。#752）です。

導入時は [2.19.0の注意](./MIGRATION.md#v2190-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。

## v2.18.0（2026-10-18）

2.17.0以降に、FieldSet の見出し下の間隔と StarRating の読み上げ名を整えたminorリリース。次の2点は既定の見た目・読み上げが変わります。

- `gap` を省いた FieldSet でも、FieldLegend の下に子の間隔と同じ24px（`mb-6`）が付きます。見出しの直下を詰めたい画面は `<FieldLegend className="mb-0">`、子の間隔ごと詰めるなら `gap="sm"` / `gap="md"` を指定します（#747）。
- FormField `as="group"` の中で名前を省いた入力用の StarRating は、「評価」ではなくその FormField のラベルで読まれるようになります。見た目は変わりません。native の StarRating は対象外です（#746）。

主な追加は次のとおりです。
- StarRating に `aria-label` / `aria-labelledby`、KskLabels に `ratingGroup` / `ratingValue` / `ratingStar`（型では optional。#746）。
- contracts の StarRating `sizes` に実装済みの `xl` を追加（#748）。

導入時は [2.18.0の注意](./MIGRATION.md#v2180-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。

## v2.17.0（2026-10-18）

2.16.0以降に、consumer側の上書きをなくすためのAPIを4件追加したminorリリース。追加のみのAPIが中心です。次の3点は既定の読み上げ・見た目が変わります。

- Banner の読み上げが variant で変わります。`info` / `success` は `role="status"`（読み上げの区切りで伝える）になり、`warning` / `caution` は従来どおり `role="alert"` です。割り込ませたい画面は `live="assertive"`、静的な説明は `live="off"` を指定します（#740）。
- 閉じるボタン・trailing だけの `DetailSheetHeader` は、下線と下余白を出さなくなります。従来の下線が要る画面は `bordered` を指定します（#742）。
- FormField `as="group"` の中の ChipSelector 単一選択（radiogroup）は、`aria-label` / `aria-labelledby` を省くとラベルを `aria-labelledby` で結ぶようになり、読み上げ名が付きます。見た目は変わりません（#741）。

主な追加は次のとおりです。
- Banner に `live`（#740）。
- PillToggle に `aria-label` / `aria-labelledby`・`semantics="radio"`・`name`（#741）。
- DetailSheetHeader に `bordered`（#742）。
- MonthCalendarHeader に `trailing`（#743）。

導入時は [2.17.0の注意](./MIGRATION.md#v2170-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。

## v2.16.0（2026-10-18）

2.15.0以降に、NavigationBarの文字付きの戻るの切れを直し、consumer側の上書きをなくすためのAPIを5件追加したminorリリース。追加のみのAPIが中心です。次の1点は既定の見た目が変わります。

- FieldGroup `variant="rows"` の余白が、直下の FormField 以外の行（Switch の行・Banner 等）にも上下12pxで付きます。手書きの `py-3` は外せます。`my-*` は足し算になるので外します（#733）。

主な変更は次のとおりです。
- NavigationBar `leftLabelVisible` が、title ありで左・中央・右の3列になり、375pxでも「戻る」と長めのタイトルが見えるようにしました。文字幅の上限は176pxです。title なしは左ラベルが残り幅で省略され、右の要素を押し出しません（#732）。
- FormField `as="group"` の中の ChipSelector が、名前を指定しなくても警告を出さないようにしました（#734）。
- Banner に `onDismiss` / `dismissLabel`（#735）。
- MonthCalendarHeader に `live`（#736）。
- AdminShell に `overlay`。シェル内の Sheet / Dialog の暗転が下に隠れません（#737）。

導入時は [2.16.0の注意](./MIGRATION.md#v2160-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。

## v2.15.0（2026-10-17）

2.14.0以降に、consumer側の上書きをなくすためのAPIを10件追加したminorリリース。追加のみのAPIが中心です。次の2点は既定の挙動・見た目が変わります。

- シート / ダイアログの中の `DetailSheetHeader` の文字列 title を、そのシート / ダイアログの名前として描くようにしました。従来どおりにするには `overlayTitle={false}` を指定します（#727）。
- `leading` を渡さない `DetailSheetHeader` は左の空き列を作らず、題名が12px左へ寄ります（#729）。

主な追加は次のとおりです。
- FormFieldに `as="group"`、FieldGroupに `variant="rows"`（#720）。
- 月カレンダーの見出し `MonthCalendarHeader` と開閉ボタン `MonthCalendarExpandToggle`。開閉ボタンの読み上げ名は1つで、状態は `aria-expanded` が伝えます（#721）。
- DetailSheetHeader / DialogHeaderに `onClose` / `closeLabel`（#722）。
- DS部品の既定文言のロケールを切り替える `KskLabelsProvider`（#723）。
- AdminShellに `safeAreaTop`（#724）。
- Chipの色アニメーションをホバー端末のみにし、Android Chromeのちらつきを抑えました（#725）。
- 下部ナビの選択面のぼかしを調整できるようにしました（#726）。
- composition.json の admin 節を実装に合わせました（#728）。
- NavigationBarに文字付きの戻る `leftLabelVisible`（#729）。

導入時は [2.15.0の注意](./MIGRATION.md#v2150-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。

## v2.14.0（2026-10-17）

2.13.0以降に、consumer側の上書きをなくすためのAPIを7件追加したminorリリース。追加のみのAPIが中心です。

- Container / ChipFilterBarに `gutter="fluid"`（`--Container-Gutter-Fluid`）を追加しました（#711）。
- FormFieldに `orientation="horizontal"` / `labelWidth` / `labelAlign`、Input / Textareaに `targetSize="comfortable"`（44px）を追加しました（#712）。
- Dialogに `centerFrom` / `height="fill"` / `size="2xl"` と `DialogHeader variant="bar"` を追加しました（#713）。
- FieldLegendに `size="sm"`、FieldSetに `gap` を追加しました（#714）。
- MobileAppShellに `viewport="fixed"` / `safeAreaTop` / `safeAreaBottom` / `bottomPadding="native-tab-bar"` を追加しました（#715）。
- MonthCalendarの予定に `accentColor` を追加しました（#716）。
- CollapsibleChipFieldの見出しを、フォームの項目名と同じ14px太字・Highにそろえました。従来の見た目は `labelSize="sm"` で指定できます。label も icon も無い行は先頭の空きが無くなります（#717）。

導入時は [2.14.0の注意](./MIGRATION.md#v2140-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。

## v2.13.0（2026-10-17）

2.12.0以降に、consumer側の上書きをなくすためのAPI・部品を追加し、追加APIの不具合を直したminorリリース。次の2点は既定の挙動が変わります。

- 下部ナビ・FABの `keyboardBehavior="hide"` が、タッチ専用端末で入力欄にフォーカスした時点でも隠れるようになりました。従来どおりにするには `keyboardBehavior="stay"` を指定します（#700）。
- キーボード表示中の下側Sheetの高さ上限から、上端のsafe-areaを引くようにしました。従来どおりにするには `safeArea={false}` を指定します（#706）。

主な追加は次のとおりです。
- 下部ナビのタブ高さとラベル位置を、consumer側のCSS変数で調整できるようにしました（#699）。
- Screenに `safeAreaTop` / `height` / `desktopLayout="card"` / `landmark="none"`（#701）。
- KanbanColumnに `accentColor`、新部品 `SelectableTile`（#702・#703）。
- MonthCalendarに `view="week"`、新部品 `AgendaList`（#704）。
- AdminShellに `mobileDrawer`（#705）。
- Nativeに、OSの視差効果を減らす設定と取得状態を返す `useReduceMotion`（#698・#708）。
- 追加APIの高さ・日付・入力フォーカス処理の修正と、`hideOnInputFocus` の追加（#709）。

導入時は [2.13.0の注意](./MIGRATION.md#v2130-の導入注意) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。

## v2.12.0（2026-10-17）

2.11.0以降に、consumer側の見た目の上書きをなくすためのAPI・部品を22件追加したminorリリース。追加のみで、propsを渡さなければ従来と同じ表示です。

- 新部品を7つ追加しました。`EmojiIcon`（#676）、`AddTile`（#678）、`MonthCalendar` / `KanbanColumn`（#679）、`CodeDisplay`（#686）、`FeatureComparisonTable`（#687）、`Highlight`（#692）です。
- Input / Textareaに枠なしでその場編集できる `variant="inline"` / `"inline-title"` を追加しました（#675）。
- Cardに `selected` / `elevation`、StatCardに `elevation`、Avatarに `size` を追加しました（#677・#688・#689）。
- SidebarNavに `tone="inverse"`、AdminShellに `sidebarTone` を追加し、暗色サイドバーにできるようにしました（#680）。
- MobileTabBarに `keyboardBehavior` / `bottomOffsetExtra`、MobileAppShellに `bottomPaddingExtra`、nativeの上端safe-area用の `--Safe-Area-Inset-Top` を追加しました（#681・#682）。
- Bannerに `density="compact"` / `layout="bar"`、IconBadgeに `tone`、SettingsSectionに `icon`、SettingsListRowに `showChevron` を追加しました（#683・#684・#690）。
- ShareButtonsに `message` / `layout="block"` / `labels` とLINEのhover・押下・前景トークンを追加しました（#685）。
- Toastの位置変数と `<Toaster position>`、`--Surface-Highlight` / `--Text-on-Highlight` トークン、TagInputのid / name / aria-*の内部input転送を追加しました（#691・#692・#693）。
- DS部品のスクロールバー非表示を既存の `scrollbar-hide` に統一しました（#694）。
- inline系Alertが `title` / `description` / `icon` propを描画するようにしました（#695）。

導入時は [2.12.0の注意](./MIGRATION.md#v2120) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。

## v2.11.0（2026-10-16）

2.10.0以降に、consumer側の見た目の上書きをなくすためのAPIを9件追加したminorリリース。追加のみで、propsを渡さなければ従来と同じ表示です。

- Buttonに `ghost-neutral` / `ghost-destructive` / `ghost-success` を追加しました（#664・#671）。hover面はAAを満たす色です。
- Cardに `onClick` / `href` / `disabled` を追加し、全面の押せる面にできるようにしました（#665）。
- ChipSelectorに `aria-label` / `aria-labelledby` / `aria-describedby` / `id`、ChipFilterBarに `gutter` / `contentClassName` を追加しました（#666・#667）。
- ListItemにスロット用の `leftSlotClassName` / `rightSlotClassName` / `rightSlotWidth`、ActionTileに `media` / `mediaPosition` / `mediaSize`、CountdownHeroに `onClick` / `href` / `aria-label` / `disabled` を追加しました（#668・#670・#672）。
- コード / OTP入力の新部品 `CodeInput` を追加しました（#669）。貼り付けで全桁入力、`one-time-code`、桁ごとの読み上げ名に対応します。

導入時は [2.11.0の注意](./MIGRATION.md#v2110) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。

## v2.10.0（2026-10-16）

2.9.0以降の未公開13コミットをまとめたminorリリース。既存APIの削除はなく、操作部品の見た目とフォーカスの既定動作を改善しています。

- Buttonの処理中表示、`useConfirm`、Dialog/Sheetの幅指定、ルーターLinkへの差し替えなど、既存コードと併用できるAPIを追加しました（#638・#642）。
- 入力・選択部品の枠、オフのSwitch、Sliderの溝を通常light/darkでも背景との3:1以上へ改善しました。区切り線など非操作要素の色は維持します（#636・#645・#662）。
- キーボード操作、確認ダイアログの初期フォーカスと復帰、Shadow DOM内のフォーカス検出、選択行hover、Chipのdark hover、成功Alertの色を修正しました（#640・#662）。
- Portal/Toastの描画先、NumberInputの入力属性、ErrorBoundaryのresetKeys、NavigationBarの操作属性、データ表のラベル指定などconsumer APIの不足を補いました（#662）。
- リポジトリをcloneした開発環境向けのMCP正本参照（DSのnpm配布物には含めない）、未定義CSS変数・形の上書き・グローバルCSSの検査を追加し、実測レイアウト修正、WebKit検証、画像比較、AI向けルールの配布検査を強化しました（#635・#637・#639・#641・#643・#644）。
- consumer更新ツールは依存指定の完全固定・`^`・`~`を維持します。公開通知台帳への修正PR登録も含みます（#633・#634）。

導入時は [2.10.0の注意](./MIGRATION.md#v2100) を確認してください。npm公開・タグ・GitHub Releaseはversion変更のmainマージ後に `publish.yml` が実行します。consumerへの取り込みとアプリ配布は別工程で、今回のDS公開準備には含めません。独立したMCPサーバーパッケージのnpm公開も今回の対象外です。

## 通常リリースサイクル

| 種類 | 頻度 | 曜日 |
|---|---|---|
| patch | 必要時 | 制限なし |
| minor | 隔週目安 | 制限なし |
| major | 四半期 | 月初の月曜 |

## メジャーリリースの段取り

メジャー (`vX → vX+1`) は破壊変更を含むため、最低 4 週間前から計画する:

```
T-4w  破壊変更内容の確定 → MIGRATION.md 草案作成
T-3w  scripts/codemod/vX-to-vY.mjs を実装、利用側で dry-run 検証
T-2w  RC 版を 1〜2 の消費リポへ先行配布、動作確認
T-1w  feedback 反映、ESLint 旧 API ルールを "error" に昇格
T-0   全消費リポへ配布 (update-consumers.sh)、リリースノート公開、社内告知
T+1w  次の patch で旧 API を完全削除
```

## version bump の自動同期（issue #259）

`npm version <level>` を実行すると npm の `"version"` ライフサイクルで
`scripts/sync-version.mjs` が自動発火し、以下を同期する:

- `contracts/components.json` の `meta.version` を新バージョンに更新
- `contracts/token-hex-cache.json` の再生成

この lifecycle は `--no-git-tag-version` を付けても変わらず発火する
（`--no-git-tag-version` が省略するのは git のコミット・タグ作成だけ）。
`npm version` を使わない手動 bump（release PR で `package.json` の version を
直接書き換える方式など）の場合は、コミット前に単体実行すること:

```bash
node scripts/sync-version.mjs
```

変更があったファイルは自動で `git add` される（コミットは自分で行う）。

**タグ・GitHub Release の作成は必ず publish.yml に任せ、ローカルでは作らない
（issue #269 レビュー指摘）。** `npm version` の既定動作（ローカルタグ作成 +
コミット）をそのまま使って `git push --tags` すると、publish.yml（CI）より
先にタグが公開リポジトリに届いてしまい、publish.yml がタグ既存と判定して
GitHub Release の作成をスキップしてしまう。そのため:

- ローカルでは `npm version <level> --no-git-tag-version` を使う（タグ・コミットなし）
- `sync-version.mjs` が git add した変更 + `package.json` を自分でコミット
- `git push origin main`（`--tags` は付けない）
- タグ・GitHub Release は push 後に publish.yml が作成する

`scripts/release.sh` はこのフローをすでに組み込み済み。

## ホットフィックス手順

本番障害が発生したら:

1. main で直接修正（or hotfix ブランチ）
2. `npm version patch --no-git-tag-version`（`sync-version.mjs` が自動で追従・git add まで実行）
3. `git add package.json package-lock.json` して修正コミットにまとめる
   （`npm version` は `--no-git-tag-version` でも `package-lock.json` を更新するため、
   ステージし忘れると `npm ci` が古い依存スナップショットを使ってしまう）
4. `git push origin main`（`--tags` は付けない）→ `.github/workflows/publish.yml` の
   Trusted Publishing が npm publish・タグ・GitHub Release 作成を自動実行
5. 公開を確認: `npm view ksk-design-system@<version> version` →
   `bash scripts/update-consumers.sh <version> <影響リポ...>`
6. 影響範囲・原因・修正内容を「ホットフィックス履歴」に記録
7. ポストモーテムを Issue / wiki に書く

ローカルから `npm publish` を直接叩く経路は廃止した（publish.yml への一本化。
下記参照）。

## ホットフィックス履歴

| 日付 | バージョン | 内容 | 影響 |
|---|---|---|---|
| 2026-05-30 | v1.21.2 | Sheet (`side="bottom"` / `swipeToClose` / `bottom-glass`) が仮想キーボード表示時にシート上端を画面外へ出さないよう `visualViewport` 監視で修正（PR #12） | モバイルの入力付きボトムシートでタイトル/ドラッグハンドルが隠れる不具合を解消 |
| 2026-06-13 | v1.31.1 | `.glass-specular > *` が**絶対配置の子要素**の `position`/`z-index` を踏み潰す問題を `:not(.absolute):not(.fixed):not(.sticky)` 除外で修正 | glass 面に重ねた絶対配置オーバーレイ（閉じる × 等）が consumer 側の `absolute`/`z-*` を奪われ角からはみ出す不具合を解消 |
| 2026-07-27 | v1.48.2 | native Button `elevation="raised"` の押下で `borderBottomWidth` を 0 にし `marginBottom` で補填していたため、`minHeight` で高さが決まるボタンでは行が 4px 伸びて周囲の UI 全体が下にずれる問題を修正。exam-kit の PrimaryButton と同じ「下辺の太さは維持し押下時は色だけ透明」方式に統一 | 3D ボタンを押すたびに画面がガタつく不具合を解消。押下前後でレイアウト寸法が完全に不変になった |
| 2026-07-27 | v1.48.1 | native の Modal 系オーバーレイ（Sheet plain/snap・Celebration overlay・emoji bounce）で、Modal 表示前に入口アニメーションを開始すると要素が不可視位置に残る問題を onShow 起点＋二重 fallback で修正（#250）。併せて snap sheet の gesture 状態バグ 3 件（アニメ中の再ドラッグでパネルが飛ぶ／再オープン時に下スワイプが効かない／`dismissible`・`onClose` が初回 render のまま固定）を修正 | iOS 実機で「透明なオーバーレイだけが残り操作不能」になる進行不能バグを解消。#249 で snap sheet のみ対処した同一原因が plain sheet と Celebration に残っていた |

新しいホットフィックスがあれば追記する。

## リリースノート書き方

GitHub Releases にコピペできるテンプレ:

```md
## v1.16.0 (2026-MM-DD)

### Features
- Button: `inverse` / `ghost-inverse` バリアント追加（暗背景上の CTA 用）
- Button: `hero` サイズ追加（hero / final-CTA 専用ピル型）
- Checkbox: `label` / `description` / `count` props でポリモーフィック化

### Fixes
- ...

### Docs
- ...

### Migration
- 破壊変更なし。npm package version の更新 PR（update-consumers.sh が自動作成）をマージするだけで OK。
```

破壊変更がある場合は必ず:

```md
### Breaking Changes
- `OldComponent` を削除。`NewComponent` を使ってください。<!-- docs-drift-ignore: OldComponent NewComponent -->
  自動移行: `npx ksk-design-system codemod vX-to-vY ./src`
- 詳細: [MIGRATION.md](./MIGRATION.md)
```

## 関連

- [PUBLISHING.md](./PUBLISHING.md) — 実際の手順
- [MIGRATION.md](./MIGRATION.md) — メジャー毎の移行ガイド
- [scripts/codemod/README.md](./scripts/codemod/README.md) — codemod 雛形と使い方
- [UPDATING.md](./UPDATING.md) — 消費側（DS を npm 依存に持つプロジェクト）向けのアップデート手順
