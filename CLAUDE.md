# KSK Design System — 設計ルールブック

## 実装前セルフチェック（AI必読・最優先）

UI を書く前に必ず確認すること:

- [ ] 画面の骨格は `contracts/screen-patterns.json` の decisionTree で選んだか
- [ ] 既存コンポーネントを `src/components/COMPONENT_LOOKUP.md` で確認したか（手書き・再定義は禁止）
- [ ] 色は semantic token（`var(--Surface-*)` / `var(--Brand-Primary)` 等）か。Tailwind標準色・生 `#hex` は禁止
- [ ] `border` は色を併記したか（`border-[var(--Border-Low-Emphasis)]` 等）。Tailwind v4 では無色 border は currentColor になり、消費側の濃色テキストで黒ずむ（preset.css の base layer が保険だが明示が原則）
- [ ] **文脈非依存**か（テキスト要素に `text-[var(--Text-*)]`、サーフェス/オーバーレイに `bg-[var(--Surface-*)]` を明示）。親の継承や currentColor に頼ると消費側の色文脈で崩れる。Storybook ツールバーの **Hostile ctx** を loud にして、文字/アイコンがマゼンタ化・背景が透けないか確認する
- [ ] typography は `typo-*` クラスか（`font-bold` 等の直書きは禁止）
- [ ] アイコンは `iconsax-reactjs` か（`lucide-react` / `heroicons` は使わない）
- [ ] 生タグ（`<button>` / `<input>` / `<a href>`）でなく DS コンポーネントを使ったか
- [ ] CSS でベンダープレフィックス併記する場合、**`-webkit-` を先・標準形を後**に書いたか（消費側の minifier が同一プロパティとして dedupe し後勝ちのみ残すため。逆順だと Firefox で静かに無効化。`node scripts/check-prefix-order.mjs` が CI で検出）
- [ ] `.tsx` 編集後に `bash scripts/lint-scratch.sh`、コンポーネント増減時は `npm run check` を実行したか

---

## このDSについて

**KSK Design System** は、フリーランスデザイナー / エンジニア / PdM が **複数クライアント案件を1つのDSで高速に回す** ために設計された統合デザインシステムです。

2つのドメインの設計思想を統合:
- BtoB / SaaS / リクルート系（信頼感・業務効率を重視）
- EC / BtoC / コマース系（購買体験・温かみを重視）

---

## 最大の特徴: マルチテーマ対応

**Brand色の10行を差し替えるだけで、全コンポーネントの見た目が自動的に切り替わります。**

```
Brand色を差し替え（10行）→ Primitive Layer → Semantic Layer → Bridge Layer → 全コンポーネント
```

| テーマ | Brand-500 | 想定業種 |
|--------|-----------|---------|
| Default (Blue) | `#3B82F6` | 汎用・SaaS・BtoB |
| Orange | `#F97316` | EC・フード・エンタメ |
| Green | `#16A34A` | ヘルスケア・サステナ・金融 |
| Violet | `#7C3AED` | プレミアム・クリエイティブ・教育 |

---

## 技術スタック

- React 19 + TypeScript / Vite / **Tailwind CSS v4**（`@import "tailwindcss"` 構文。`@tailwind base` 等の v3 構文は使わない）
- shadcn/ui（Radix UI ベース） / CVA（バリアント管理）
- **iconsax-reactjs**（アイコン。`lucide-react` / `heroicons` は使わない） / Storybook（ドキュメント）

---

## AIモデルの使い分け方針

| モデル | 用途 |
|--------|------|
| `claude-fable-5` | 最難関の設計・長時間エージェント作業のみ（高コストのため温存） |
| `claude-opus-4-8` | 通常のUI実装・レビュー・リファクタの既定 |

**検証ループを使う場合:** 実装 = Fable 5 / 検証 = Opus 4.8 のように実装者と検証者で別モデルを使う（同一モデルは同じバイアスを共有し独立検証にならない）。

**Fable 5 使用時の注意:**
- thinking は常時オン（パラメータ省略でデフォルトに任せる）
- refusal 時は `fallbacks` で Opus 4.8 に自動フォールバック
- 30日データ保持が必須

---

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| **CLAUDE.md**（本ファイル） | 概要・技術スタック・コマンド・クイックスタート（Claude Code用） |
| **AGENTS.md** | 同上（Codex用。セッション開始時の読み込み指示・編集後コマンドを明記） |
| **contracts/components.json** | 全コンポーネントの構造化定義（バリアント・アクセシビリティ要件。総数は meta.counts が正本） |
| **contracts/rules.json** | 禁止パターン・AIアンチパターン・アクセシビリティ要件（正本: rules.json） |
| **contracts/design-context.json** | `DESIGN.md` の役割・正本ファイル・外部 DESIGN.md 参照方針 |
| **tokens.json** | カラー・スペーシング・シャドウトークンの機械可読定義 |
| **contracts/token-hex-cache.json** | semantic トークンのデフォルトテーマ解決済み hex（テーマ依存キーは meta.themeDependentKeys 参照・自動生成） |
| **src/components/COMPONENT_LOOKUP.md** | 全コンポーネントのバリアント・インポートパス一覧（自動生成） |
| **DESIGN.md** | AI エージェント向け視覚言語サマリ（トークン＋意図・voice・motion） |
| **contracts/screen-patterns.json** | 画面実装前にどのシェル/パターンを使うかを決める decisionTree・crudMatrix |
| **contracts/composition.json** | 選んだパターン内部の並べ方（骨格構造・余白リズム・カード階層・テキスト階層・CTA優先度） |

**セッション開始時 / コードを書く前に必ず読む:**
1. `contracts/rules.json` の `prohibited` と `aiPatterns`（AIが典型的に犯すパターン集）を確認
2. `contracts/components.json` でコンポーネント定義・バリアントを確認
3. `contracts/design-context.json` で `DESIGN.md` と正本ファイルの関係を確認
4. `src/components/COMPONENT_LOOKUP.md` で既存コンポーネントを確認（手書き・再定義の防止）
5. `tokens.json` でカラー・余白・影・タイポのトークンを確認
6. 画面（ページ/ダイアログ等）を実装する場合は `contracts/screen-patterns.json` の decisionTree でシェル/パターンを選び、`contracts/composition.json` で内部の並べ方を確認

### ローカル二重実装ゲート

DS に無いと思っても consumer 側に別台帳を作らないこと。最初に `contracts/components.json` と
`COMPONENT_LOOKUP.md` を検索し、consumer では `npx ksk-ds check-duplicates ./src --strict` を実行する。
それでも不足する場合は DS 側に issue を登録する。やむを得ない一時実装には、削除条件と issue を
`// ksk-ds-local-fallback: DS に X が追加されたら削除 (issue #123)` の形式で残すこと。

**`.tsx` を編集したら `bash scripts/lint-scratch.sh`、コンポーネント増減時は `npm run check` を実行すること。**

Storybook 全体を横断で視覚監査する（定期監査・リリース前総点検・「全ページ確認して」）場合は `.claude/skills/audit-pages/SKILL.md` を使う。

---

## ディレクトリ構成

```
src/
├── components/
│   ├── ui/           # 汎用UIコンポーネント
│   ├── patterns/
│   │   ├── commerce/ # EC系
│   │   ├── admin/    # 管理画面系
│   │   ├── shells/   # レイアウトシェル
│   │   └── ...       # 汎用パターン
│   └── icons/
├── styles/
│   ├── primitive.css  # Layer 1: 原色パレット
│   ├── semantic.css   # Layer 2: 用途別トークン
│   └── typography.css # typo-* ユーティリティ
├── themes/            # default / orange / green / violet / blue
├── preset.css         # 外部プロジェクト向けプリセット
└── index.ts           # Public API（全コンポーネント）
```

---

## コマンド

```bash
# 開発サーバー（Storybook）
npm run storybook

# ビルド
npm run build-storybook

# スクラッチ検出（実装後に必ず実行）
bash scripts/lint-scratch.sh

# ドリフト検出（コンポーネント追加後に実行）
bash scripts/check-drift.sh

# COMPONENT_LOOKUP.md 再生成（コンポーネント追加後に実行）
npm run generate:lookup

# DESIGN.md contract 検査
npm run lint:design

# 全チェック（tsc + lint + drift + lookup 一括）
npm run check
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

**カテゴリ識別色（質的パレット・テーマ非依存）:**
`var(--Categorical-{1..16})`（ドット/アイコン）/ `-Subtle`（背景ティント）/ `-Bold`（文字・ラベル）。
Brand に連動しない固定値で、カレンダー予定ドット・カテゴリ chip・グラフ系列など「N 番目のカテゴリ」を色で区別する用途専用。
文字には必ず `-Bold` を使う（base は明色相だと白背景でコントラスト不足）。詳細・WCAG/CVD 注記は `src/styles/categorical.css`。

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
@import "ksk-design-system/preset";
@import "./themes/my-client.css";
```

**3. コンポーネントを使う:**

```tsx
import { Button, Card, Input, FormField } from "ksk-design-system"
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
- [ ] `npm run generate:lookup` を実行して COMPONENT_LOOKUP.md を更新
