# KSK Design System — 設計ルールブック

## CLAUDE.md / AGENTS.md の編集ルール

<!-- docs-sync-ignore -->
このファイルと `AGENTS.md` は Claude Code 用 / Codex 用の対になる作業手順書で、
共通で守るべき内容（実装前セルフチェック・セッション開始時に読み込むファイル・
ローカル二重実装ゲート・このDSについて・最大の特徴・技術スタック・AIモデルの
使い分け方針・ドキュメント構成・ディレクトリ構成・カラートークン体系・
クイックスタート・コンポーネント追加時のチェックリスト）は**両ファイルで内容を
同期させる**こと。

- 見出し名・本文は基本的に同一にする（ツール名など明確にツール固有の1行だけ
  <!-- docs-sync-ignore --> マーカー（単独行、次の1行を対象から除外）で除外する）
- Codex 固有の付録（AGENTS.md 末尾の Codex PR Review Guidelines）のような
  完全にツール固有のブロックは BEGIN/END マーカーコメント（例:
  末尾が `codex-pr-review-guidelines` のマーカー）で囲み同期対象から除外する
- 片方だけ編集したら **`node scripts/check-agents-docs-sync.mjs`**（`npm run check` に
  組み込み済み）を実行し、乖離が無いことを確認する
- `templates/CLAUDE.md` / `templates/AGENTS.md`（postinstall で配布するテンプレート）も
  同じ仕組みで同期検査の対象

## 実装前セルフチェック（AI必読・最優先）

UI を書く前に必ず確認すること:

- [ ] 画面の骨格は `contracts/screen-patterns.json` の decisionTree で選んだか
- [ ] 既存コンポーネントを `src/components/COMPONENT_LOOKUP.md` で確認したか（手書き・再定義は禁止）
- [ ] 色は semantic token（`var(--Surface-*)` / `var(--Brand-Primary)` 等）か。Tailwind標準色・生 `#hex` は禁止
- [ ] `border` は色を併記したか（`border-[var(--Border-Low-Emphasis)]` 等）。Tailwind v4 では無色 border は currentColor になり、消費側の濃色テキストで黒ずむ（preset.css の base layer が保険だが明示が原則）
- [ ] **文脈非依存**か（テキスト要素に `text-[var(--Text-*)]`、サーフェス/オーバーレイに `bg-[var(--Surface-*)]` を明示）。親の継承や currentColor に頼ると消費側の色文脈で崩れる。Storybook ツールバーの **Hostile ctx** を loud にして、文字/アイコンがマゼンタ化・背景が透けないか確認する
- [ ] typography は `typo-*` クラスか（`font-bold` 等の直書きは禁止）
- [ ] アニメーションは `duration-[var(--Motion-Duration-*)]` / `ease-[var(--Motion-Easing-*)]` か（`duration-200` や生 `cubic-bezier` の直書きは禁止。トークン参照でないと `prefers-reduced-motion` の一括制御から漏れる）
- [ ] 重なり順は `z-[var(--Z-*)]` か（`z-50` 一律だと Portal のマウント順で勝敗が決まる。`z-10` / `z-20` のコンポーネント内部の重なりは対象外。順序は DESIGN.md の Layering 節）
- [ ] アイコンは `iconsax-reactjs` か（`lucide-react` / `heroicons` は使わない）
- [ ] 生タグ（`<button>` / `<input>` / `<a href>`）でなく DS コンポーネントを使ったか
- [ ] CSS でベンダープレフィックス併記する場合、**`-webkit-` を先・標準形を後**に書いたか（消費側の minifier が同一プロパティとして dedupe し後勝ちのみ残すため。逆順だと Firefox で静かに無効化。`node scripts/check-prefix-order.mjs` が CI で検出）
- [ ] flex 行（flex-col でない flex）で shrink-0 の兄弟と可変テキストを並べるとき、テキスト側に `flex-1`（+ 必要なら `min-w-[...]` 下限）を付けたか（`min-w-0` だけだと 1 文字ずつ折り返すまで潰れる。issue #293。`node scripts/check-flex-shrink.mjs` が CI で検出、例外は `ksk-lint-ignore KFX001 -- 理由`）
- [ ] クラス名は**完全な文字列**で書いたか（`` `bg-${color}` `` のような動的合成は静的抽出できず消費側で CSS が生成されない。分岐は三項演算子か cva variant で。`scripts/generate-source-safelist.mjs` が検出）
- [ ] `.tsx` 編集後に `bash scripts/lint-scratch.sh`、コンポーネント増減時は `npm run check` を実行したか
- [ ] `FormField` を import する前にどちらか確認したか（react-hook-form の Controller と統合するなら `RhfFormField`＝`ui/form` の `FormField` を index.ts で別名 export したもの。単純な label+error 表示は `patterns/form-field` の `FormField`。迷ったら後者）

---

## 必須: セッション開始時に読み込むファイル

コードを書く前に、以下を必ず読み込むこと:

```
.claude/skills/ksk-design-system/SKILL.md  # 判断Skill: 実装・レビューの判断基準（正本への索引）
contracts/rules.json                     # 禁止パターン・AIアンチパターン・a11y要件（件数・内容は rules.json が正本）
contracts/components.json               # 全コンポーネントの定義・バリアント・ルール
contracts/design-context.json           # DESIGN.md と正本ファイルの関係・AI向け検査方針
tokens.json                             # カラー・スペーシング・シャドウトークン
contracts/token-hex-cache.json          # semantic トークンのデフォルトテーマ解決済み hex（テーマ依存キーは meta.themeDependentKeys 参照・自動生成）
src/components/COMPONENT_LOOKUP.md      # バリアント・インポートパス一覧（自動生成）
contracts/screen-patterns.json          # 画面実装前にどのシェル/パターンを使うかの decisionTree・crudMatrix
contracts/composition.json              # 選んだパターン内部の並べ方（骨格構造・余白リズム・カード階層・テキスト階層・CTA優先度）
```

画面（ページ/ダイアログ等）を実装・修正する場合は、まず `contracts/screen-patterns.json` の
decisionTree でシェル/パターンを選び、`contracts/composition.json` で内部の並べ方を確認すること。

UI コンポーネント・画面の生成/修正・レビューの前には、必ず
`.claude/skills/ksk-design-system/SKILL.md` を読み、その判断基準に従うこと
（トークン選定・コンポーネント選択・レビュー優先順位・例外運用。迷ったら同ディレクトリの `references/` を参照）。

**必ず `contracts/rules.json` の `prohibited` と `aiPatterns` を確認してから実装すること。**
特に `aiPatterns` は AI が典型的に犯すパターン集 — 自分が生成しようとしているコードと照合すること。

コンポーネントを新規作成する前に `COMPONENT_LOOKUP.md` で同等品がないか確認すること。

`FormField` は同名で2種類ある: react-hook-form の Controller と統合するなら `RhfFormField`（`ui/form` の `FormField` を index.ts で別名 export したもの）、単純な label+error 表示なら `FormField`（`patterns/form-field`）。迷ったら後者を使う。

### ローカル二重実装ゲート

DS に無いと思っても consumer 側に別台帳を作らないこと。最初に `contracts/components.json` と
`COMPONENT_LOOKUP.md` を検索し、consumer では `npx ksk-ds check-duplicates ./src --strict` を実行する。
それでも不足する場合は DS 側に issue を登録する。やむを得ない一時実装には、削除条件と issue を
`// ksk-ds-local-fallback: DS に X が追加されたら削除 (issue #123)` の形式で残すこと。

Storybook 全体を横断で視覚監査する（定期監査・リリース前総点検）場合は `.claude/skills/audit-pages/SKILL.md` の手順に従うこと。

---

## 必須: ファイル編集後に実行するコマンド

**.tsx ファイルを作成・編集した後は必ず実行:**

```bash
bash scripts/lint-scratch.sh
```

**.css を編集した後は必ず実行:**

```bash
node scripts/check-prefix-order.mjs
```

ベンダープレフィックスは **`-webkit-` を先・標準形を後** に書く（消費側の
minifier が同一プロパティとして dedupe し後勝ちのみ残すため、逆順だと
標準形が消えて Firefox で静かに無効化される）。

**新しい Tailwind クラスを使った後は必ず実行:**

```bash
npm run generate:safelist
```

DS 内部でしか出現しないクラスを消費側で確実に生成させるための safelist
（`src/styles/source-safelist.css`・自動生成）を更新する。未更新は
`npm run check` が検出する。クラス名は必ず完全な文字列で書くこと
（`` `bg-${color}` `` のような動的合成は静的抽出できず、同スクリプトがエラーにする）。

**コンポーネントを追加・削除した後は必ず実行:**

```bash
bash scripts/check-drift.sh
npm run generate:lookup
```

**play 関数のあるコンポーネントを触った後は必ず実行:**

```bash
npm run test:interaction
```

対象は Button / Dialog / AlertDialog / Sheet / Select / DropdownMenu /
Combobox / Tabs / Form / Toast。Storybook の play 関数を playwright chromium で
ヘッドレス実行する（設定は `vitest.storybook.config.ts`、対象は
`tags: ["interaction"]` を付けたストーリーのみ）。初回のみ
`npx playwright install chromium` が必要なため `npm run check` には含まれない。
CI では常時実行される。

**UI コンポーネントを追加・修正した後は `npm run test:a11y` も実行:**

```bash
npm run test:a11y
```

axe-core による a11y 機械検証（issue #261）。`@storybook/addon-a11y` の
afterEach フックが全ストーリー（tags フィルタなし）に対して axe-core を
実行する（設定は `vitest.a11y.config.ts`）。color-contrast ルールも有効
（AA 未達トークンの darken と opacity 減衰の廃止により全ストーリー通過。
トークンペアの正本チェックは `scripts/check-contrast.mjs`）。CI では常時実行される。

エラーが出た場合は修正してから次に進むこと。

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

正本は `~/.claude/playbooks/agent-contracts.md`（モデル割当・委譲・報告・自己改善の契約）。
サブエージェントを起動する前に読む。要点: 親（Fable 5）は監督専任 / 委譲時の `model:` は
省略禁止（実装=sonnet 既定・設計判断を含む実装=opus・検証=実装と別モデル・下書き=haiku）/
同一モデルで実装と検証を兼ねない。

---

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
<!-- docs-sync-ignore -->
| **CLAUDE.md**（本ファイル） | 概要・技術スタック・コマンド・クイックスタート（Claude Code用） |
<!-- docs-sync-ignore -->
| **AGENTS.md** | 同上（Codex用。Codex PR Review Guidelines を追記） |
| **contracts/components.json** | 全コンポーネントの構造化定義（バリアント・アクセシビリティ要件。総数は meta.counts が正本） |
| **contracts/rules.json** | 禁止パターン・AIアンチパターン・アクセシビリティ要件（正本: rules.json） |
| **contracts/design-context.json** | `DESIGN.md` の役割・正本ファイル・外部 DESIGN.md 参照方針 |
| **tokens.json** | カラー・スペーシング・シャドウトークンの機械可読定義 |
| **contracts/token-hex-cache.json** | semantic トークンのデフォルトテーマ解決済み hex（テーマ依存キーは meta.themeDependentKeys 参照・自動生成） |
| **src/components/COMPONENT_LOOKUP.md** | 全コンポーネントのバリアント・インポートパス一覧（自動生成） |
| **DESIGN.md** | AI エージェント向け視覚言語サマリ（トークン＋意図・voice・motion） |
| **contracts/screen-patterns.json** | 画面実装前にどのシェル/パターンを使うかを決める decisionTree・crudMatrix |
| **contracts/composition.json** | 選んだパターン内部の並べ方（骨格構造・余白リズム・カード階層・テキスト階層・CTA優先度） |

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
│   ├── typography.css # typo-* ユーティリティ
│   ├── motion.css     # duration / easing トークン（--Motion-*）
│   └── source-safelist.css  # @source safelist（自動生成・手で編集しない / issue #258）
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

# @source safelist 再生成（新しい Tailwind クラスを使ったら実行）
npm run generate:safelist

# 全チェック（tsc + lint + drift + lookup + safelist 一括）
npm run check

# interaction テスト（Storybook play 関数を playwright chromium で実行）
npm run test:interaction

# a11y 機械検証（axe-core。全ストーリー対象。issue #261）
npm run test:a11y
```

**interaction テストについて（issue #256）:**

- 実体は Storybook の play 関数。`@storybook/addon-vitest` + vitest browser mode（playwright chromium）で
  ヘッドレス実行する。設定は `vitest.storybook.config.ts`。
- 対象は `tags: ["interaction"]` を付けたストーリーだけ（全ストーリーのスモークはしない）。
- 初回のみ `npx playwright install chromium` が必要。**この前提があるため `npm run check` /
  `check:agent` には含めていない**（CI と、下記に該当する変更をしたときに手で回す）。
- 押下でレイアウトが沈む・入場アニメーション中に操作不能・フォーカストラップ崩れ、といった
  v1.48.x で連続した種類の不具合をここで落とす。
- **play 関数のあるコンポーネント（Button / Dialog / AlertDialog / Sheet / Select /
  DropdownMenu / Combobox / Tabs / Form / Toast）を触ったら `npm run test:interaction` を回すこと。**
- ビジュアル回帰（スクリーンショット差分）は未導入。`.claude/skills/audit-pages/SKILL.md` による
  手動の視覚監査が現状の代替。

**a11y 機械検証について（issue #261）:**

- `@storybook/addon-a11y` の afterEach フック（axe-core）が全ストーリー（tags フィルタなし）に
  対して実行される。設定は `vitest.a11y.config.ts`、実行は `npm run test:a11y`。CI では常時実行。
- color-contrast ルールも有効（全ストーリー対象）。当初はトークン債務のため無効化していたが、
  AA 未達トークンの darken（Success/Warning-Base・Text-Caution/Warning・Text-Low-Emphasis）と
  opacity 減衰の廃止で解消済み。無効状態デモ等 WCAG 1.4.3 の inactive 例外だけ、ストーリー側で
  理由コメント付きの rule 除外を許可（`.storybook/preview.ts` 参照）。トークンペアの正本チェックは
  `scripts/check-contrast.mjs`（`npm run check` 経由）。
- rules.json の `accessibility.requirements` に `machineVerified` / `verifiedBy` を追加済み。
  axe でカバーできない項目（フォーカスリング視認・タッチターゲット実測・エラー表示の
  色+アイコン+テキスト3点セット等）は今後も目視レビューが必要。
- icon-only の `<Button size="icon*">` に `aria-label` が無いパターンは
  `eslint/icon-button-aria-label.js`（`ksk-a11y/icon-button-aria-label`）で lint 時に検出する
  （`.stories.tsx` は対象外）。

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

**モーション（`src/styles/motion.css`）:**
`duration-[var(--Motion-Duration-{Fast,Base,Slow,Slower})]` /
`ease-[var(--Motion-Easing-{Standard,Emphasized,Decelerate,Bounce})]`。
生の `duration-200` / `cubic-bezier(...)` は禁止（`prefers-reduced-motion` の一括制御から漏れる）。

**重なり順（`src/preset.css`）:**
`z-[var(--Z-{Sticky,Nav,Overlay,Modal,Popover,Toast,Tooltip,SkipLink})]`。
`z-50` 一律だと Portal のマウント順で勝敗が決まる。`z-10` / `z-20` のコンポーネント内部の重なりは対象外。
いずれも詳細は DESIGN.md の Motion / Layering 節。

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
