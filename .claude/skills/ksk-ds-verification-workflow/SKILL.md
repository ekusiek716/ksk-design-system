---
name: ksk-ds-verification-workflow
description: KSK Design System で UI コードを生成・修正した「後」の準拠検証とレビューの実行ワークフロー。rules.json 準拠チェックの具体手順・scripts/ の使い分け・実装者/検証者のモデル分担・過去インシデント由来の判断基準を定義する。判断ルール本体（何が禁止か・なぜか）は ksk-design-system スキルが正本で、本スキルはその「実行方法」を担う。
---

# KSK DS — 検証・レビュー実行ワークフロー

**trigger**: このリポジトリ（または DS 消費プロダクト）で `.tsx` を編集・生成した後、PR をレビューする時、リリース前チェックの時に適用する。「何が禁止か」の判断に迷ったら本スキルではなく `ksk-design-system` スキルと `contracts/rules.json` を読む（そちらが正本）。

## 0. 役割分担（重複防止の地図）

| 知りたいこと | 読む場所 |
|---|---|
| 書く前のチェック項目 | CLAUDE.md 冒頭「実装前セルフチェック」 |
| 禁止の内容・理由・トークン選択 | `.claude/skills/ksk-design-system/`（判断ルール本体） |
| **検証の実行手順・レビュー運用・モデル分担** | 本スキル |
| Storybook 全体の横断視覚監査（定期監査・リリース前総点検） | `.claude/skills/audit-pages/`（本スキルは実装直後の差分検証、audit-pages はストーリー群のバッチ巡回） |

## 1. rules.json 準拠チェック手順（実装後・レビュー時共通）

順番に実行する。1→2 は機械、3→4 は目視。

**Step 1 — 自動検出（必須・毎回）**

```bash
bash scripts/lint-scratch.sh        # prohibited 43件の一括検出
```

コンポーネント増減時は `npm run check`（tsc + lint + drift + lookup を一括）。

**Step 2 — 差分限定の追い grep（レビュー時・スクリプトの excludes をすり抜けた疑いがある時）**

rules.json は機械可読なので、パターンを抽出して変更ファイルだけに当てる:

```bash
jq -r '.prohibited[] | [.id, .severity, .pattern] | @tsv' contracts/rules.json
git diff --name-only main -- '*.tsx' | xargs grep -nE '<検証したい pattern>'
```

ヒットしたら rules.json の同 id の `fix` フィールドが修正方法の正本。
`excludes` に該当するか（.stories. / components/ui/ 等）を必ず確認してから指摘する。

**Step 3 — regex で拾えない違反の目視（AI10 系）**

`aiPatterns` の AI10（継承・既定への依存）は pattern が空 = grep 不能。以下を目視で確認:
- テキスト要素に `text-[var(--Text-*)]` があるか
- サーフェス（Card/Popover/Sheet/Dialog）に `bg-[var(--Surface-*)]` があるか
- Storybook ツールバー **Hostile ctx** を loud にして、マゼンタ化・背景透けがないか

**Step 4 — severity 別の処理**

- `error` → 無条件で直す。直せない正当な理由がある時のみ `// ksk-ds-allow-custom-ui: <理由>` を該当行近くに残す（理由なし suppress は差し戻し）
- `warning` → 直すのが既定。直さない場合は理由を PR 本文に書く

## 2. 専用スクリプトの使い分け（何をした時に何を回すか）

| 変更内容 | 追加で回すもの |
|---|---|
| `.tsx` 編集（常に） | `bash scripts/lint-scratch.sh` |
| コンポーネント追加・削除 | `npm run check`（drift + lookup 込み） |
| CSS でベンダープレフィックス追記 | `node scripts/check-prefix-order.mjs`（-webkit- 先・標準後） |
| テーマ・色トークン変更 | `node scripts/check-contrast.mjs`（テーマ一覧は src/themes/ から動的導出 — テーマ名をハードコードした検証を書かない） |
| native（src/native/）変更 | `node scripts/check-native-parity.mjs` |
| ストーリー追加 | `bash scripts/check-story-reuse.sh`（ストーリー内も DS コンポーネント再利用） |
| DESIGN.md 変更 | `npm run lint:design` |
| リリース | `bash scripts/release.sh` → 消費側一括は `scripts/bump-consumers.sh`（対象はメモリ ds-consumers.md 参照） |

## 3. モデル分担（検証ループの運用）

- 実装と検証は**別モデル**にする（同一モデルは同じバイアスを共有し独立検証にならない）。標準: 実装 = Fable 5、検証 = Opus 4.8。
- 通常の UI 実装・レビュー・リファクタの既定は `claude-opus-4-8`。Fable 5 は最難関の設計・長時間エージェント作業のみ（温存）。
- サブエージェントに検証を任せる時は、本スキル §1 の手順と `contracts/rules.json` のパスをプロンプトに明記して渡す（「DS ルールに従って」だけでは rules.json を読まないことがある）。

## 4. 有効だったプロンプト・依頼パターン

繰り返し効果があった指示の型（UI 生成を依頼・自走する時にそのまま使う）:

1. **正本を先に読ませる**: 「書く前に `src/components/COMPONENT_LOOKUP.md` で既存を確認し、使うコンポーネントの props は `contracts/components.json` か .tsx を読んでから使え。props を推測するな」
2. **完了条件に検証を含める**: 「`bash scripts/lint-scratch.sh` がクリーンになるまでが実装。エラーを残した完了報告は無効」
3. **4テーマ前提を明示**: 「default/orange/green/violet(+cobalt) 全テーマで成立するか。1テーマでしか見ていない色指定は不合格」
4. **消費側文脈を敵対的に想定**: 「Storybook で正しく見える、は合格条件ではない。濃色テキスト・色付き背景の親に置かれても崩れないか」
5. **variant 上書きの繰り返しを設計課題として報告させる**: 「className 上書きが2回続いたら、その場しのぎを続けず variant 追加を提案しろ」
6. **同型バグを直したら検出手段（スクリプト/テスト）を同時に追加させる**: 「このバグを直すだけでなく、`scripts/*.mjs` や `__tests__/` に再発検出を追加しろ。次に同じパターンが出た時に人力レビュー頼みにしない」（border 色, #142 の `check-border-color.mjs` / Celebration pointer-events, #143 の `pointer-events-mine.test.ts` で有効だった型）

## 5. 過去インシデント由来の判断基準（同型の再発防止）

コードレビューで同じ構図を見たら指摘する:

- **透明オーバーレイでクリックを橋渡ししない**: pointer-events を切ったオーバーレイの下のボタンを狙わせる構造は、重なり変化で静かに壊れる。操作要素は個別に absolute 配置する（Calendar nav, #134）
- **ぼかし・グラデ等の視覚エフェクトは「効いている証拠」を残す**: プラットフォーム差で無効化されても TS は通る。動く背景デモストーリー等、視覚検証できるストーリーを添える（Android GlassView, #117）
- **アニメーション付き入力はちらつきを疑う**: 高さ・値が変わるフィールドは制御/非制御の混在でちらつく。変更後に実際に入力して確認（DateField, #111）
- **検証スクリプトに列挙をハードコードしない**: テーマ・コンポーネント一覧はディレクトリ/正本から動的導出。追加時に検証が黙って対象外になるのが最悪の壊れ方（#112）
- **外部レビュー（CodeRabbit 等）の指摘は severity を rules.json に照らして再判定**: DS の規約と矛盾する提案（Tailwind 標準色への「簡略化」等）は従わない
- **`pointer-events-none`/`-auto` の親子ペアは consumer の Tailwind v4 `@source` が minified dist をスキャンする際に拾い漏れうる**: DS 内でしか出現しないクラスは consumer 側で CSS 生成されず、子のクリックが不能になる。一度 Calendar（#132/#134）で直しても Toast/MobileAppShell（#138）、Celebration（#143）と同型が他コンポーネントに残っていた。修正時は当該パターンを**リポジトリ全体で横断 grep**し、1箇所ずつ潰さない
- **ラッパーコンポーネントは下位プリミティブの識別属性（`data-slot` 等）を `{...props}` spread で上書きしないか確認する**: BottomSheetFrame/SideDrawerFrame が独自の `data-slot` を渡し `SheetContent` の `data-slot="sheet-content"` を消していた。consumer が `[data-slot="..."]` 前提で書く CSS/`closest()` が丸ごとマッチしなくなる実害があった。フレーム識別は別属性（`data-frame` 等）に分離する（#139）
- **無色 `border` の currentColor 汚染は cva の variant 個別対応だけでは終わらない**: base に既定色トークンがないコンポーネントが横断的に残っていないか、直した箇所以外も一括点検する（border color, #142）
