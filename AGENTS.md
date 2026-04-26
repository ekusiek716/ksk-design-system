# KSK Design System — 設計ルールブック（Codex向け）

## このDSについて

**KSK Design System** は、フリーランスデザイナー / エンジニア / PdM が **複数クライアント案件を1つのDSで高速に回す** ために設計された統合デザインシステムです。

2つのプロダクションDSの設計思想を統合:
- **助太刀 inc.** のCore UI DS（BtoB / SaaS / リクルート向け）
- **Cake.jp** のCake DS（EC / BtoC / コマース向け）

---

## 必須: セッション開始時に読み込むファイル

コードを書く前に、以下を必ず読み込むこと:

```
contracts/rules.json                     # 禁止パターン31件・AIアンチパターン9件・a11y要件
contracts/components.json               # 全57コンポーネントの定義・バリアント・ルール
tokens.json                             # カラー・スペーシング・シャドウトークン
src/components/COMPONENT_LOOKUP.md      # バリアント・インポートパス一覧（自動生成）
```

**必ず `contracts/rules.json` の `prohibited` と `aiPatterns` を確認してから実装すること。**
特に `aiPatterns` は AI が典型的に犯すパターン集 — 自分が生成しようとしているコードと照合すること。

コンポーネントを新規作成する前に `COMPONENT_LOOKUP.md` で同等品がないか確認すること。

---

## 必須: ファイル編集後に実行するコマンド

**.tsx ファイルを作成・編集した後は必ず実行:**

```bash
bash scripts/lint-scratch.sh
```

**コンポーネントを追加・削除した後は必ず実行:**

```bash
bash scripts/check-drift.sh
node scripts/generate-component-lookup.mjs
```

エラーが出た場合は修正してから次に進むこと。

---

## 最大の特徴: マルチテーマ対応

**Brand色の10行を差し替えるだけで、全コンポーネントの見た目が自動的に切り替わります。**

```
Brand色を差し替え（10行）→ Primitive Layer → Semantic Layer → Bridge Layer → 全コンポーネント
```

| テーマ | Brand-500 | 想定業種 |
|--------|-----------|---------|
| Default (Blue) | `#3B82F6` | 汎用・SaaS・BtoB |
| Orange | `#E04B00` | EC・フード・エンタメ |
| Green | `#16A34A` | ヘルスケア・サステナ・金融 |
| Violet | `#7C3AED` | プレミアム・クリエイティブ・教育 |

---

## 技術スタック

- React 19 + TypeScript / Vite / **Tailwind CSS v4**（`@import "tailwindcss"` 構文）
- shadcn/ui（Radix UI ベース） / CVA（バリアント管理）
- **iconsax-reactjs**（アイコン。lucide-react や heroicons は使わない）
- Storybook（ドキュメント）

> **注意**: Tailwind CSS は v4 です。`@tailwind base` 等の v3 構文は使わないこと。

---

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| **AGENTS.md**（本ファイル） | 概要・技術スタック・コマンド・クイックスタート |
| **contracts/components.json** | 全57コンポーネントの構造化定義（バリアント・アクセシビリティ要件） |
| **contracts/rules.json** | 禁止パターン31件・AIアンチパターン9件・アクセシビリティ要件 |
| **tokens.json** | カラー・スペーシング・シャドウトークンの機械可読定義 |
| **src/components/COMPONENT_LOOKUP.md** | 全57コンポーネントのバリアント・インポートパス（自動生成） |
| **CAKE_COMPONENTS.md** | Cake.jp固有コンポーネント一覧（EC案件時に参照） |

---

## ディレクトリ構成

```
src/
├── components/
│   ├── ui/           # 汎用UIコンポーネント 25個
│   ├── patterns/
│   │   ├── commerce/ # EC系 9個
│   │   ├── admin/    # 管理画面系 7個
│   │   ├── shells/   # レイアウトシェル 3個
│   │   └── ...       # 汎用パターン 13個
│   └── icons/
├── styles/
│   ├── primitive.css  # Layer 1: 原色パレット
│   ├── semantic.css   # Layer 2: 用途別トークン
│   └── typography.css # typo-* ユーティリティ 17クラス
├── themes/            # default / orange / green / violet / blue
├── preset.css         # 外部プロジェクト向けプリセット
└── index.ts           # Public API（57コンポーネント）
```

---

## カラートークン体系（3層構造）

```
Layer 1 — Primitive  : --Primitive-{ColorName}-{Shade}  （10色ファミリー × 10シェード）
Layer 2 — Semantic   : --{Category}-{Role}              （Surface / Text / Border / Brand / Focus 等）
Layer 3 — Bridge     : --primary / --secondary 等        （shadcn/ui 互換マッピング）
```

セマンティックトークン早見表:

| 用途 | トークン |
|------|---------|
| 背景（白） | `var(--Surface-Primary)` |
| 背景（薄灰） | `var(--Surface-Secondary)` |
| テキスト（強） | `var(--Text-High-Emphasis)` |
| テキスト（中） | `var(--Text-Medium-Emphasis)` |
| テキスト（弱） | `var(--Text-Low-Emphasis)` |
| テキスト（白抜き） | `var(--Text-on-Inverse)` |
| ブランド色 | `var(--Brand-Primary)` |
| フォーカス | `var(--Focus-High-Emphasis)` |

---

## クイックスタート（新規クライアント案件）

**1. テーマファイルを作成:**

```css
/* src/themes/my-client.css */
@theme {
  --Primitive-Brand-500: #0EA5E9;  /* ← クライアントのブランドカラー */
  /* ... Brand-50 〜 900 の10行 */
}
```

**2. プロジェクトで import:**

```css
@import "@ksk/design-system/preset";
@import "./themes/my-client.css";
```

**3. コンポーネントを使う:**

```tsx
import { Button, Card, Input, FormField } from "@ksk/design-system"
```

以上で完了。全コンポーネントがクライアントのブランドカラーで動作します。

---

## コンポーネント追加時のチェックリスト

新しいコンポーネントを追加したら、以下を必ず更新:

- [ ] `src/index.ts` にエクスポートを追加
- [ ] `contracts/components.json` にコンポーネント定義を追加
- [ ] `contracts/components.json` の `meta.counts` を更新
- [ ] `bash scripts/check-drift.sh` を実行して乖離がないことを確認
- [ ] Storybook のストーリーファイル（`.stories.tsx`）を作成
- [ ] `node scripts/generate-component-lookup.mjs` を実行して COMPONENT_LOOKUP.md を更新
