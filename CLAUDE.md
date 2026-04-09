# KSK Design System — 設計ルールブック

## このDSについて

**KSK Design System** は、フリーランスデザイナー / エンジニア / PdM が **複数クライアント案件を1つのDSで高速に回す** ために設計された統合デザインシステムです。

2つのプロダクションDSの設計思想・コンポーネント・品質基準を統合:
- **助太刀 inc.** のCore UI DS（BtoB / SaaS / リクルート向け）
- **Cake.jp** のCake DS（EC / BtoC / コマース向け）

### 最大の特徴: マルチテーマ対応

**Brand色の10行を差し替えるだけで、全コンポーネントの見た目が自動的に切り替わります。**

```
Brand色を差し替え（10行）
  ↓
Primitive Layer（原色パレット）
  ↓ CSS変数参照
Semantic Layer（用途別トークン + Light/Dark）
  ↓ CSS変数参照
Bridge Layer（shadcn/ui 互換マッピング）
  ↓ CSS変数参照
全コンポーネント（Button, Card, Dialog 等）
```

### プリセットテーマ

| テーマ | Brand-500 | 想定業種 |
|--------|-----------|---------|
| Default (Blue) | `#3B82F6` | 汎用・SaaS・BtoB |
| Orange | `#E04B00` | EC・フード・エンタメ |
| Green | `#16A34A` | ヘルスケア・サステナ・金融 |
| Violet | `#7C3AED` | プレミアム・クリエイティブ・教育 |

---

## 技術スタック

- React 19 + TypeScript
- Vite（ビルド）
- Tailwind CSS v4（`@import "tailwindcss"` 構文）
- shadcn/ui（Radix UI ベース、カスタムテーマ適用済み）
- CVA（class-variance-authority）でバリアント管理
- iconsax-reactjs（アイコン）
- Storybook（`@storybook/react-vite`）

---

## ディレクトリ構成

```
src/
├── components/
│   ├── ui/          # 汎用UIコンポーネント（Button, Input, Dialog 等）23個
│   ├── patterns/
│   │   ├── commerce/  # EC系（ProductCard, Carousel等）9個
│   │   ├── admin/     # 管理画面系（DataTable, SearchPanel等）7個
│   │   ├── shells/    # レイアウトシェル 3個
│   │   └── ...        # 汎用パターン 12個
│   └── icons/       # カスタムアイコン
├── styles/
│   ├── primitive.css # Layer 1: 原色パレット（10色ファミリー）
│   ├── semantic.css  # Layer 2: 用途別トークン（Light/Dark）
│   └── typography.css # typo-* ユーティリティ（18クラス）
├── themes/
│   ├── default.css   # デフォルト（Blue）
│   ├── orange.css    # EC・フード向け
│   ├── blue.css      # BtoB・SaaS向け
│   ├── green.css     # ヘルスケア・金融向け
│   └── violet.css    # プレミアム・クリエイティブ向け
├── lib/
│   └── utils.ts     # cn() ユーティリティ
├── preset.css       # 外部プロジェクト向けプリセット（1行 import で全有効化）
└── index.css        # DS自体のエントリポイント
```

---

## コマンド

```bash
# 開発サーバー（Storybook）
npm run storybook

# ビルド
npm run build-storybook

# 型チェック
npx tsc --noEmit

# スクラッチ検出（実装後に必ず実行）
bash scripts/lint-scratch.sh

# 全チェック
npm run check
```

---

## カラートークン体系（3層構造）

### Layer 1: Primitive（原色）

CSS変数名: `--Primitive-{ColorName}-{Shade}`

| ファミリー | 用途 |
|-----------|------|
| Brand | プライマリ（テーマで差し替え可能） |
| Gray | テキスト・背景・ボーダー |
| Red | エラー・危険 |
| Orange | 警告 |
| Amber | 注意 |
| Green | 成功 |
| Teal | アクセント |
| Blue | 情報 |
| Violet | プレミアム |
| Pink | 装飾 |

### Layer 2: Semantic（意味）

CSS変数名: `--{Category}-{Role}`

| カテゴリ | 主要トークン |
|---------|-------------|
| Surface | Primary, Secondary, Tertiary, Accent-Primary-Light, Caution, Success |
| Text | High-Emphasis, Medium-Emphasis, Low-Emphasis, on-Inverse, Accent-Primary |
| Object | High-Emphasis, Accent-Primary, Caution, Favorite |
| Border | High-Emphasis, Medium-Emphasis, Low-Emphasis, Accent-Primary, Caution |
| Brand | Primary, Action, Light |
| Hover/Active | Primary-Button, Secondary-Button, Ghost-Button, Destructive-Button |
| Focus | High-Emphasis (#1FCC84) |

### Layer 3: Bridge（shadcn互換）

`preset.css` で自動マッピング: `--primary` → `--Brand-Primary` 等

---

## タイポグラフィ

| クラス | サイズ | 用途 |
|--------|--------|------|
| `typo-display-xl` | 48px / bold | ヒーロー |
| `typo-display-lg` | 36px / bold | LP見出し |
| `typo-heading-3xl` | 28px / bold | ページタイトル |
| `typo-heading-2xl` | 24px / bold | 主要セクション |
| `typo-heading-xl` | 21px / bold | サブセクション |
| `typo-heading-lg` | 18px / bold | グループ見出し |
| `typo-heading-md` | 16px / bold | 小見出し |
| `typo-heading-sm` | 14px / bold | ラベル的見出し |
| `typo-body-lg` | 16px / normal | 本文（大） |
| `typo-body-md` | 14px / normal | 本文（標準） |
| `typo-body-sm` | 12px / normal | 補足テキスト |
| `typo-body-xs` | 10px / normal | 最小テキスト |
| `typo-label-lg` | 16px / bold | ボタン大 |
| `typo-label-md` | 14px / bold | ボタン・ナビ |
| `typo-label-sm` | 12px / medium | タグ・バッジ |
| `typo-label-xs` | 10px / medium | 小タグ |
| `typo-caption` | 11px / normal | 注釈 |

**ルール: 必ず `typo-*` クラスを使う。`text-sm font-bold` 等の個別指定は禁止。**

---

## スペーシング（4pxグリッド）

| Tailwind | px | 用途 |
|----------|-----|------|
| `gap-1` | 4 | アイコンとラベル間 |
| `gap-2` | 8 | 標準間隔 |
| `gap-3` | 12 | 中間隔 |
| `gap-4` / `p-4` | 16 | セクション間 |
| `gap-6` / `p-6` | 24 | ダイアログ内パディング |

---

## 角丸（5値のみ — これ以外は禁止）

| Tailwind | px | 用途 |
|----------|-----|------|
| `rounded-none` | 0 | 角丸なし |
| `rounded-sm` | 4 | Tag, 小さい要素 |
| `rounded-lg` | 8 | Input, Textarea, Select, Card, Dialog |
| `rounded-2xl` | 16 | Modal, 大きいCard |
| `rounded-full` | 50% | Button（全サイズ）, Avatar, Badge, Chip |

---

## シャドウ

| トークン | 用途 |
|---------|------|
| `shadow-[var(--shadow-sm)]` | 微細な浮き |
| `shadow-[var(--shadow-md)]` | Card, 標準浮き |
| `shadow-[var(--shadow-lg)]` | Popover, Dropdown |
| `shadow-[var(--shadow-dialog)]` | Dialog, Modal |
| `shadow-[var(--shadow-tooltip)]` | Tooltip |

---

## コンポーネント一覧

### UI コンポーネント（23個）

| コンポーネント | 用途 |
|---------------|------|
| `Button` | 7 variant × 8 size |
| `Input` | テキスト入力 |
| `Textarea` | 複数行入力 |
| `Label` | フォームラベル |
| `Select` | ドロップダウン |
| `Checkbox` | チェックボックス |
| `RadioGroup` | ラジオボタン |
| `Switch` | トグルスイッチ |
| `Card` | コンテンツカード |
| `Badge` | 9 variant バッジ |
| `Avatar` | ユーザー画像 |
| `Dialog` | モーダルダイアログ |
| `Sheet` | サイドパネル |
| `Popover` | ポップオーバー |
| `Tooltip` | ツールチップ |
| `Tabs` | タブナビ |
| `Accordion` | アコーディオン |
| `Separator` | 区切り線 |
| `Progress` | プログレスバー |
| `ScrollArea` | スクロールエリア |
| `Pagination` | ページネーション |
| `Breadcrumb` | パンくずリスト |
| `Skeleton` | ローディング |

### Pattern コンポーネント（12個）

| コンポーネント | 用途 |
|---------------|------|
| `Banner` | フィードバック（info/success/warning/caution） |
| `EmptyState` | 空状態 |
| `ErrorState` | エラー状態 |
| `SectionHeader` | セクション見出し + アクション |
| `StatCard` | 統計値カード |
| `ListItem` | 汎用リストアイテム |
| `SearchBar` | 検索入力 |
| `Chip` | フィルター / キーワード |
| `Tag` | 表示のみのラベル |
| `NotificationBadge` | 件数バッジ |
| `ProgressSteps` | ステップ表示 |
| `FormField` | ラベル + 入力 + エラー |

### Commerce コンポーネント（9個）

| コンポーネント | 用途 |
|---------------|------|
| `ProductCard` | 商品カード（vertical/horizontal、お気に入り、割引バッジ、カートボタン） |
| `ProductCarousel` | 商品カルーセル（セクション見出し + 横スクロール + ランキング） |
| `PriceDisplay` | 価格表示（セール、レンジ、税込、4サイズ） |
| `RatingDisplay` | 星評価（標準5角星、レビュー件数） |
| `QuantitySelector` | 数量選択（sm: カート用 / md: 詳細ページ用） |
| `OrderSummary` | 注文合計（明細 + CTA、固定/インライン切替） |
| `ImageCarousel` | 画像カルーセル（scroll-snap、ドット、矢印、autoPlay） |
| `BottomNav` | モバイル下部ナビ（バッジ、safe-area対応） |
| `FilterBar` | フィルターバー（チップ + ソート + 件数） |

### Admin コンポーネント（7個）

| コンポーネント | 用途 |
|---------------|------|
| `DataTable` | リッチテーブル（20サブコンポーネント: ソート、チェックボックス、アクション、インライン編集、ドラッグ等） |
| `KebabMenu` | 三点ドットメニュー（テーブル行アクション用） |
| `BulkActionBar` | 一括操作バー（選択件数 + アクション） |
| `StatusTabs` | ステータスフィルタータブ（件数バッジ付き） |
| `SearchPanel` | 検索パネル（grid/flexレイアウト、検索/リセット） |
| `ImageUploader` | 画像アップロード/削除グリッド |
| `NotificationList` | 通知リスト（vertical/horizontal 2レイアウト） |

---

## WCAG 2.1 AA 準拠

| 要素 | 基準 |
|------|------|
| 通常テキスト | コントラスト比 4.5:1 以上 |
| 大テキスト（18px+ bold） | コントラスト比 3:1 以上 |
| UI要素・アイコン | コントラスト比 3:1 以上 |
| タッチターゲット | 最小 24×24px |
| フォーカスリング | `focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50` |
| アイコンボタン | `aria-label` 必須 |
| フォーム入力 | `<Label>` 必須 |
| エラー表示 | 色 + アイコン + テキストの3点セット |

---

## 禁止パターン（抜粋）

| # | やらないこと | 正しい書き方 |
|---|-------------|-------------|
| 1 | `text-sm font-bold` | `typo-label-md` |
| 2 | `text-gray-900` | `text-[var(--Text-High-Emphasis)]` |
| 3 | `bg-blue-500` | `bg-[var(--Brand-Primary)]` |
| 4 | `#XXXXXX` ハードコード | `var(--Brand-Primary)` |
| 5 | `<button className="...">` | `<Button variant="..." size="...">` |
| 6 | `<input className="...">` | `<Input>` |
| 7 | `rounded-md` / `rounded-xl` | `rounded-sm/lg/2xl/full` のみ |
| 8 | `shadow-lg` / `shadow-2xl` | `shadow-[var(--shadow-*)]` |
| 9 | `border-t-4 border-*-500` | 全周ボーダー |
| 10 | `bg-gradient-to-*` | 単色背景 |
| 11 | `outline: none` | `focus-visible:ring` |
| 12 | `z-[9999]` | `z-50` |
| 13 | 色だけでステータス区別 | 色 + アイコン + テキスト |

**コードを書く前に `bash scripts/lint-scratch.sh` を意識すること。**

---

## 新しいクライアントプロジェクトの始め方

### 1. テーマファイルを作成

```css
/* src/themes/my-client.css */
@theme {
  --Primitive-Brand-50:  #F0F9FF;
  --Primitive-Brand-100: #E0F2FE;
  --Primitive-Brand-200: #BAE6FD;
  --Primitive-Brand-300: #7DD3FC;
  --Primitive-Brand-400: #38BDF8;
  --Primitive-Brand-500: #0EA5E9;  /* ← クライアントのブランドカラー */
  --Primitive-Brand-600: #0284C7;
  --Primitive-Brand-700: #0369A1;
  --Primitive-Brand-800: #075985;
  --Primitive-Brand-900: #0C4A6E;
}
```

### 2. プロジェクトで import

```css
@import "@ksk/design-system/preset";
@import "./themes/my-client.css";
```

### 3. コンポーネントを使う

```tsx
import { Button, Card, Input, FormField } from "@ksk/design-system"
```

**以上で完了。** 全コンポーネントがクライアントのブランドカラーで動作します。

---

## ライティングルール

- 和文は全角、欧文・算用数字は半角
- 見出し文末に「。」をつけない
- バリデーションエラー文末に句読点をつけない
- 日付: `YYYY/MM/DD`（0なし: 2026/4/7）
- ボタン: 動詞で表記（「削除する」「保存する」）
