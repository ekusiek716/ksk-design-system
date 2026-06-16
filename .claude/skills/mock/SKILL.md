---
name: mock
description: Notionの仕様ページからKSK Design System準拠のモックを生成し、localhost(npm run dev)で確認できるようにする。NotionのURL/ページID、または自然言語の仕様を指定。
user-invocable: true
argument-hint: "<Notion URL / ページID / 自然言語の仕様>"
---

あなたは KSK Design System のモック生成エンジンです。
Notion の仕様ページ（または貼られた自然言語の仕様）を読み取り、**DS 準拠の React モック**を
`src/prototypes/` に生成し、`npm run dev`（http://localhost:5173）のプレビューに反映します。

## 大原則: スクラッチしない

ゼロから UI を組まない。既存の DS 資産を最大限使い、差分だけを実装する。
KSK のセルフチェック（CLAUDE.md 冒頭）を必ず守る:

1. **既存コンポーネント優先** — `src/components/COMPONENT_LOOKUP.md` で必ず確認。手書き・再定義禁止
2. **シェルを使う** — 画面骨格は `patterns/shells`（`AppShell` / `AdminShell` / `MarketingShell`）、
   EC は `patterns/commerce`（`ProductCard` / `BottomTabBar` / `OrderSummary` 等）、
   管理画面は `patterns/admin`（`DataTable` / `StatusTabs` 等）を起点にする
3. **色は semantic token のみ** — `var(--Surface-*)` / `var(--Text-*)` / `var(--Brand-Primary)` 等。
   生 `#hex`・Tailwind 標準色（`text-gray-900` 等）禁止
4. **typography は `typo-*` のみ** — `font-bold` / `text-sm` 等の直書き禁止
5. **アイコンは `iconsax-reactjs`** — `lucide-react` / `heroicons` は使わない
6. **生タグ禁止** — `<button>` / `<input>` / `<a href>` でなく DS の `Button` / `Input` 等を使う
   （構造用の `<div>` / `<section>` は可。テキストには必ず `text-[var(--Text-*)]` を明示）
7. **border は色を併記** — `border border-[var(--Border-Low-Emphasis)]`（無色 border 禁止）
8. **角丸は DS スケールのみ** — `rounded-none/sm/md/lg/xl/2xl/full`

## 手順

### Step 1: 入力ソースを判定する

`$ARGUMENTS` を見て分岐:

- **Notion URL / ページID を含む** → Notion MCP の `notion-fetch`（必要なら `notion-search`）で
  ページ本文を取得する。URL からページ ID を抜き出して渡す。
  取得した本文から以下を抽出:
  - **タイトル** → 画面名 / ファイル名の元
  - **本文・箇条書き・表** → 要件・項目・状態・コピー
  - **デバイス指定**（SP / PC / 両方）→ 明記がなければ **SP ファースト**
  - 画像・参考リンクがあれば控える
- **自然言語の仕様が直接書かれている** → そのままテキストとして解析する（Notion 取得は不要）

Notion MCP が接続されていない場合は、その旨を伝え、ユーザーに本文の貼り付けを依頼する。

### Step 2: 仕様を解析する

- **画面種別**: トップ / 一覧 / 詳細 / フォーム / カート / マイページ / ダッシュボード / 管理画面 / その他
- **デバイス**: SP / PC / 両方（明記なければ SP ファースト）
- **主要素**: ヘッダー / リスト / フォーム / カード / テーブル / タブ 等
- **状態**: タブ切替・数量変更・トグル等のインタラクションがあれば `useState` で実装する

### Step 3: 既存 DS 資産にマッピングする（最重要）

`src/components/COMPONENT_LOOKUP.md` を読み、各要素を既存コンポーネント／バリアントに割り当てる。
新しい UI パーツを自作する前に、必ず既存バリアントで賄えないか検討する。

代表的な対応:
- 画面骨格（ヘッダー＋本文＋ボトムナビ） → `AppShell` + `BottomTabBar`
- 管理画面（サイドバー＋テーブル） → `AdminShell` + `DataTable` + `StatusTabs`
- 商品 → `ProductCard` / `ProductCarousel` / `PriceDisplay` / `RatingDisplay`
- 入力 → `Input` / `FormField` / `Select` / `Checkbox` / `RadioGroup`
- 状態表示 → `Badge` / `Alert` / `Tag`

### Step 4: プロトタイプを生成する

`src/prototypes/<slug>.tsx` を新規作成する。`slug` はタイトルのケバブケース
（例「ギフト特集ページ」→ `gift-feature.tsx`）。**`_` で始めない**（インフラ用に予約）。

ファイル構造:

```tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
// 必要な DS コンポーネント / iconsax アイコンを import

export const meta = {
  title: "画面名",
  device: "SP",            // "SP" | "PC" | "SP/PC"
  notionUrl: "https://www.notion.so/...",  // 元仕様（あれば）
  createdAt: "YYYY/MM/DD",
  description: "一覧カードに出す一行説明",
}

const items = [/* 日本語のリアルなダミーデータ。「サンプル」「テスト」は避ける */]

export default function Screen() {
  // 状態管理（必要なら）
  return (
    <div className="min-h-dvh bg-[var(--Surface-Secondary)]">
      {/* DS コンポーネントで構成。@container クエリで SP/PC 両対応 */}
    </div>
  )
}
```

- ルートは `min-h-dvh` + `bg-[var(--Surface-*)]`。ホストの SP フレーム（max-width 390px）に収まる前提
- レスポンシブは `@container`（`@md:` 等）を使う（ホストのプレビュー枠が container）
- 画像はダミー URL でよいが、alt とサイズを必ず指定する

### Step 5: 登録は自動

`src/prototypes/_registry.ts` が `import.meta.glob` で自動収集するため、ファイルを置くだけで
一覧（localhost）に反映される。手動登録は不要。

### Step 6: 検証する

```bash
npx tsc -p tsconfig.app.json --noEmit          # 型エラーゼロ
bash scripts/lint-scratch.sh src/prototypes/<slug>.tsx   # DS 違反ゼロ（警告は許容）
```

dev サーバーが起動していれば `http://localhost:5173/#/<slug>` で表示確認する。
未起動なら `npm run dev` を案内する（または launch.json の "ksk-design-system (Vite dev)"）。
可能なら preview ツールでスクリーンショットを撮り、SP/PC 両フレームで崩れがないか確認する。

### Step 7: 報告する

- 生成ファイルパス（`src/prototypes/<slug>.tsx`）
- 確認 URL（`http://localhost:5173/#/<slug>`）
- 使用した DS コンポーネント一覧
- 既存パターンを流用した箇所 / 新規実装した箇所
- 型・lint の結果

## 修正フロー（既存モックの調整）

「`<slug>` のここを直して」と言われたら:
1. `src/prototypes/<slug>.tsx` を Read
2. 指示箇所のみ Edit（ファイル名・パスは変えない。既存 URL を維持）
3. `npx tsc` + `lint-scratch.sh` を再実行
4. localhost で再確認して報告

スクラッチ禁止は修正時も継続。
