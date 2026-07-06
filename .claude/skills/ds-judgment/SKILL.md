---
name: ds-judgment
description: KSK Design System での UI コード生成・レビュー時の判断基準集。CLAUDE.md 冒頭の「実装前セルフチェック」を補強し、contracts/rules.json（禁止パターン43件・AIアンチパターン10件）への準拠チェック手順と、機械検査では拾えない設計判断（コンポーネント選定・severity 判断・例外運用）を提供する。
user-invocable: true
---

# KSK DS — UIコード生成・レビューの判断基準

## Trigger（いつ使うか）

- このリポジトリ（または DS 消費側プロダクト）で **UI コンポーネント / 画面 / モックを生成・修正する直前**
- **PR / 差分のレビュー**で DS 準拠を判定するとき
- `/ds-judgment` で明示発動されたとき

CLAUDE.md 冒頭の「実装前セルフチェック」は前提として通過済みとする。
本スキルはその**次の層**——「チェック項目は知っているが、どう判断するか」を扱う。

---

## 1. rules.json 準拠チェック手順（レビュー時の必須プロセス）

順番に実行する。①②は機械、③④は目視判断。

1. **機械検査を先に回す**: `bash scripts/lint-scratch.sh`（rules.json の `prohibited` を検査）。
   `.tsx` 編集後は必ず。手で grep を再発明しない。
2. **プレフィックス順検査**: CSS でベンダープレフィックスを触った差分があるときのみ
   `node scripts/check-prefix-order.mjs`。
3. **機械で拾えない禁止パターンを目視確認**（rules.json `aiPatterns`、特に AI10）:
   - **AI10 文脈非依存違反**: テキスト要素に `text-[var(--Text-*)]`、サーフェスに
     `bg-[var(--Surface-*)]` + `border-[var(--Border-*)]` が明示されているか。
     継承・currentColor 依存は grep で検出できない。疑わしければ Storybook の
     **Hostile ctx（loud）** で マゼンタ化・背景透けを確認する。
   - **AI9 常時アニメーション**: `animate-*` がローディング状態以外に付いていないか。
4. **component-adoption 系（P033〜P043）の意図確認**: パターンに引っかからなくても
   「既存の上位コンポーネントを使うべき手組み」がないか、§2 の対応表で判断する。

**例外の作法**: 禁止パターンを意図的に破る正当な理由がある場合のみ、
`// ksk-ds-allow-custom-ui: <理由>` コメントを該当行近くに残す。
理由なしの suppress は差し戻し対象。

**severity の読み方**: rules.json の `error` は無条件で直す。`warning` は
「消費側テーマ・日本語文脈で壊れる可能性」の警告——直さない場合は理由を PR に書く。

---

## 2. 「手組みか、既存コンポーネントか」の判断表

セルフチェックの「COMPONENT_LOOKUP.md を見たか」の先にある判断。
**複合 UI を組み始めた時点で一度立ち止まり**、以下に該当しないか確認する
（rules.json P033〜P043 の背後にある設計判断）:

| 作ろうとしているもの | 使うべき DS 資産 |
|---|---|
| ボタンを並べた排他選択（toggle） | `PillToggle` / `RadioGroup` / `Tabs` |
| 一時的な操作結果の通知（保存した・接続が復旧した 等） | `toast.*`（`Banner` は**継続する状態**の表示専用） |
| アイコンだけのボタン | `<Button size="icon|icon-sm|icon-lg" aria-label>` |
| EmptyState の CTA | `actionLabel` / `actionLayout` prop（Button 手挿入しない） |
| シートのヘッダー + ケバブメニュー | `DetailSheetHeader trailing={...}` |
| 設定画面のセクション / 行 | `SettingsSection` / `SettingsListRow` |
| ファイル選択（hidden input + trigger） | `CompactFilePicker` / `ImageAttachmentPicker` |
| ショートカット / 絵文字タイル群 | `QuickActionGrid` + `ActionTile` |
| モバイル下部ナビ・FAB の配置 CSS | `MobileAppShell` + `BottomTabBar` + `MobileFloatingActionButton` |
| ボトムシートの外枠（max-h / rounded-t / safe-area） | `BottomSheetFrame preset="..."` |
| Expo Router / React Navigation の tabBar | `createExpoRouterTabBar` / `LiquidBottomTabBar` |
| 画面骨格そのもの | `patterns/shells`（`AppShell` / `AdminShell` / `MarketingShell`） |

判断原則: **「クラスのレシピ」を2箇所目に書きそうになったら、それはコンポーネント化済みか
確認するサイン**。上記に該当しないレシピなら、コンポーネント化を提案する（勝手に作らない）。

---

## 3. トークン選定の判断基準（「どれを使うか」）

セルフチェックは「semantic token を使え」まで。ここでは**どの token か**を決める基準:

- **Text**: 見出し・本文 = `High`、補足・説明 = `Medium`、無効・最弱 = `Low`、
  濃色/ブランド背景の上 = `on-Inverse`。**迷ったら1段強い方**（コントラスト安全側）。
- **Border**: 区切り線・淡いカード = `Low-Emphasis`、入力欄・操作対象 = `Medium-Emphasis`。
  状態で色が変わるタブ/チップは初期 `border-transparent` + `data-[state=...]:border-[var(--Brand-Primary)]` のペアで（幅リフローを防ぐ）。
- **Brand vs Categorical**: 「このプロダクトの主張」= `--Brand-*`（テーマ連動）。
  「N番目のカテゴリの区別」（カレンダードット・グラフ系列・カテゴリ chip）=
  `--Categorical-{1..16}`（テーマ非依存・固定値）。**文字に使うなら必ず `-Bold`**。
- **typo-\* の選び方**: 操作要素（ボタン・ナビ・タグ）は `typo-label-*`、
  読ませる文は `typo-body-*`、構造の見出しは `typo-heading-*`。
  「本文だが太くしたい」で `font-bold` を足すのは禁止——それは label か heading の仕事。
- **shadow**: 迷ったら `--shadow-sm`。`md` は Card、`lg` は Popover/Dropdown、
  Dialog/Tooltip は専用トークン。「立体感の演出」目的で盛らない（AI5）。
- **角丸の中間判断**: 小要素 `sm`、標準（Input/Card）`lg`、大面（Modal/大Card）`2xl`、
  ピル形状 `full`。`md`/`xl` は隣接サイズとの整合でのみ使う。

---

## 4. レビュー観点の優先順位（PR を見る順）

1. **テーマ切替で壊れないか**（error 級）: 生 hex / Tailwind 標準色 / `--Primitive-Brand` 直参照 /
   `text-white`。→ 4テーマ（default/orange/green/violet）全部で成立するかを想像する。
2. **消費側文脈で壊れないか**（error 級）: 無色 border・継承依存・bg 未指定サーフェス。
   このDSは**外部プロジェクトに import される**——「Storybook では正しく見える」は合格条件でない。
3. **a11y**（rules.json `accessibility`）: フォーカスリング削除・`<div onClick>`・
   aria-label なし icon button・placeholder のみのフォーム・「色のみ」のステータス区別。
4. **DS スケール逸脱**（warning 級）: 角丸・shadow・spacing の許可セット外、300ms 超アニメーション。
5. **ライティング**（rules.json `writing`）: 見出し末尾の「。」なし、ボタンは動詞
   （「保存する」）、日付 `YYYY/M/D`、エラー文は次の行動を明示、`tracking-tight` 禁止（日本語）。

## 5. コンポーネント増減時の同期義務

コンポーネントを追加/削除したら、コードだけでは完了しない:
`src/index.ts` → `contracts/components.json`（定義 + `meta.counts`）→ `.stories.tsx` →
`npm run generate:lookup` → `bash scripts/check-drift.sh`（または一括 `npm run check`）。
**contracts と実装の drift は「静かに壊れる」ので、レビューでは counts 差分も見る。**
