# コンポーネント選択の判断樹

> 一覧と import パスの正本は `src/components/COMPONENT_LOOKUP.md`（自動生成・132個）、
> variant と使用ルールの正本は `contracts/components.json`。本ファイルは
> 「どれを使うか」を最短で決めるための判断樹。

## 大原則

1. UI を書く前に COMPONENT_LOOKUP.md で同等品を探す。**あれば必ず使う（再実装禁止）**
2. 見つからない場合のみ組む。合成パターン（sheet 骨組み・設定行・file picker 等）にも
   DS 部品があるので P033–P043 を確認してから
3. どうしても例外が要るときは `ksk-ds-allow-custom-ui` コメントで理由を残す

## オーバーレイ系 — 何を出すか

```
ユーザーを「止めて」確認させたい（削除・送信・不可逆）？
├─ Yes → ConfirmDialog（定型: 非同期onConfirm・loading込み）
│         もっと自由な構成が要るなら AlertDialog（role=alertdialog・外タップで閉じない）
│         破壊的 CTA は variant="destructive"、Cancel は tertiary
└─ No → その面で「作業」させる（フォーム・絞り込み）？
    ├─ Yes → Dialog（中央・24px角丸）。PC/SP 両対応なら ResponsiveDialog（PC=Dialog/SP=Sheet 自動）
    └─ No → 軽い補助・メニュー・フィルター？
        ├─ 画面端から → Sheet（side=bottom でボトムシート。swipeToClose は bottom 系のみ）
        ├─ 要素の近くに小さく・操作あり → Popover（shadow-lg）
        ├─ 短文の補足のみ・操作なし → Tooltip（shadow-tooltip）
        └─ リッチなプレビュー（hover） → HoverCard
```

**禁止**: 確認フローを素の Dialog で組む（ConfirmDialog を使う）。div.fixed.inset-0 自作（P007）。

### Sheet の組み立て（モバイル detail/edit/form）

- 外枠 class recipe を手書きしない → `BottomSheetFrame preset="mobile-full|mobile-form|desktop-floating"`（P042）
- ヘッダ＋ケバブ → `DetailSheetScaffold` / `DetailSheetHeader trailing={<KebabMenu/>}`（P037）
- フッター CTA のキーボード/safe-area 対応 → `KeyboardAwareSheetFooter`
- フォーム入力主体のシート → `BottomSheetForm`。detail/edit は `autoFocus={false}`

## フィードバック系 — どう知らせるか

```
一時的な操作結果（保存した・復旧した・失敗した）？
├─ Yes → toast.*（toast.success / connectionRestored / retryStarted / retryFailed）… P034
└─ No（持続する状態・画面に残る情報）→
    ├─ ページ/セクション頭のお知らせ → Banner または Alert（bordered=白背景+枠 / inline=色背景コンパクト）
    ├─ データがゼロ → EmptyState（actionLabel + actionLayout。CTA の className 手組み禁止 P036）
    ├─ 読み込み中 → Skeleton（構造が既知）/ Progress・ProgressRing（進捗既知）
    └─ 要素に付く状態 → Badge（variant: success/warning/info/destructive...）
```

状態表現は常に**色＋アイコン＋テキスト**（A008/A009。色だけで区別しない）。

## 選択・切替系

```
選択肢の数と性質は？
├─ 2–4択のビュー切替（フィルタ的） → PillToggle
├─ 5択以上のビュー切替 → Tabs（ステータス別一覧なら StatusTabs）
├─ 単一選択（フォーム値） → RadioGroup / 説明付きカードなら CheckboxCardGroup 系
├─ 複数選択 → CheckboxGroup / MultiSelect（多数から検索選択）
├─ On/Off → Switch
└─ 一覧から1つ選ぶ（入力欄形式） → Select / 検索付きなら Combobox
```

**禁止**: Button を並べて aria-pressed で自作 toggle（P033）。

## フォーム系

- 必ず `<Label>` とセット（P026）。定型は `FormField` / `Form` 一式
- テキスト → Input / 複数行 → Textarea / 自動伸長 → AutoGrowTextarea
- 数値 → NumberInput / 日付 → DateField・DatePicker / ファイル → CompactFilePicker・ImageAttachmentPicker（P039）
- メールは type="email"（P027）

## ナビゲーション・シェル

- 画面上部バー → NavigationBar / パンくず → Breadcrumb / ページ送り → Pagination
- モバイル下部ナビ・FAB → MobileAppShell + BottomTabBar + MobileFloatingActionButton（P041。手書き geometry 禁止）
- サイドメニュー → MenuDrawer / 設定画面 → SettingsSection + SettingsListRow（P038）
- Expo Router の tabBar → createExpoRouterTabBar / LiquidBottomTabBar（P043）

## Button variant の選び方（contracts/components.json より）

- 主要 CTA → `default` / 第2アクション → `secondary` / 控えめ → `tertiary`・`ghost`
- 破壊的 → `destructive` / リンク見た目 → `link`
- グラデーション・写真背景上のみ → `glass`（暗い媒体上は `glass-inverse`、FAB は `glass-accent`）
- 暗背景・ヒーロー専用 → `inverse` / `ghost-inverse`、hero CTA は size="hero"（56px ピル）
- アイコン単独 → size="icon|icon-sm|icon-lg|icon-xl" ＋ **aria-label 必須**
