# KSK Design System 導入プロンプト

下のテキストを **そのまま Claude Code に貼る** だけで動きます。
事前に KSK DS のファイル群をプロジェクト内にコピーしておいてください。

---

## 7. DSコンポーネント一覧

UI (23個):
  Button, Input, Textarea, Label, Select, Checkbox, RadioGroup, Switch,
  Card, Badge, Avatar, Dialog, Sheet, Popover, Tooltip, Tabs, Accordion,
  Separator, Progress, ScrollArea, Pagination, Breadcrumb, Skeleton

Patterns (12個):
  Banner, EmptyState, ErrorState, SectionHeader, StatCard, ListItem,
  SearchBar, Chip, Tag, NotificationBadge, ProgressSteps, FormField

Commerce (9個):
  ProductCard      → vertical/horizontal、お気に入り、割引バッジ、カートボタン
  ProductCarousel  → セクション見出し + 横スクロール + ランキング
  PriceDisplay     → セール、レンジ、税込、4サイズ
  RatingDisplay    → 星評価 + レビュー件数
  QuantitySelector → sm: カート用コンパクト / md: 詳細ページ用
  OrderSummary     → 注文合計 + CTA（固定/インライン）
  ImageCarousel    → scroll-snap、ドット、矢印、autoPlay
  BottomNav        → モバイル下部ナビ（バッジ、safe-area対応）
  FilterBar        → フィルターチップ + ソート + 件数

Admin (7個):
  DataTable        → リッチテーブル（ソート、チェック、アクション、インライン編集、ドラッグ等）
  KebabMenu        → 三点ドットメニュー（行アクション）
  BulkActionBar    → 一括操作バー（選択件数 + アクション）
  StatusTabs       → ステータスフィルタータブ（件数バッジ付き）
  SearchPanel      → 検索パネル（grid/flex、検索/リセット）
  ImageUploader    → 画像アップロード/削除グリッド
  NotificationList → 通知リスト（vertical/horizontal）

---

## Phase 4: コンポーネント移行ガイド

既存のスクラッチ実装をDSコンポーネントに置き換える:

  1. バナー → <Banner>
  2. 空状態 → <EmptyState>
  3. エラー状態 → <ErrorState>
  4. 統計カード → <StatCard>
  5. 検索バー → <SearchBar>
  6. ステップ表示 → <ProgressSteps>
  7. 商品カード → <ProductCard>
  8. 価格表示 → <PriceDisplay>
  9. 数量選択 → <QuantitySelector>
  10. テーブル → <DataTable> + <DataTableHead> + <DataTableRow> + <DataTableCell>
