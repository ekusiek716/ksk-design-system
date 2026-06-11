---
version: alpha
name: KSK Design System
description: >-
  フリーランス / 受託で複数案件を1つのDSで高速に回すためのマルチテーマ対応
  デザインシステム。Brand 色を差し替えるだけで全コンポーネントの見た目が
  切り替わる。デフォルトは信頼感のある Blue。
colors:
  # --- Brand（テーマ差し替え対象。下記は default=Blue） ---
  primary: "#2563EB"          # Brand-Primary / var(--Brand-Primary)
  primaryAction: "#1D4ED8"    # Brand-Action（hover/active）
  onPrimary: "#FFFFFF"
  # --- Neutral scale ---
  neutral0: "#FFFFFF"
  neutral50: "#F9FAFB"
  neutral100: "#F3F4F6"
  neutral200: "#E5E7EB"
  neutral500: "#6B7280"
  neutral900: "#111827"
  # --- Surface / Text / Border（semantic） ---
  surface: "#FFFFFF"          # var(--Surface-Primary)
  surfaceMuted: "#F9FAFB"     # var(--Surface-Secondary)
  textHigh: "#111827"         # var(--Text-High-Emphasis)
  textMedium: "#374151"       # var(--Text-Medium-Emphasis)
  textLow: "#6B7280"          # var(--Text-Low-Emphasis)
  border: "#E5E7EB"           # var(--Border-Low-Emphasis)
  focus: "#60A5FA"            # var(--Focus-High-Emphasis)
  # --- Semantic（status） ---
  success: "#16A34A"
  warning: "#EA580C"
  error: "#DC2626"            # Caution
  info: "#2563EB"
typography:
  fontFamily: "system-ui, -apple-system, 'Hiragino Sans', 'Noto Sans JP', sans-serif"
  display:  { fontSize: "48px", lineHeight: "1.2",  fontWeight: 700 }   # typo-display-xl
  heading:  { fontSize: "18px", lineHeight: "1.5",  fontWeight: 700 }   # typo-heading-lg（基準）
  body:     { fontSize: "14px", lineHeight: "1.75", fontWeight: 400 }   # typo-body-md（基準）
  label:    { fontSize: "12px", lineHeight: "1.5",  fontWeight: 500 }   # typo-label-sm
  caption:  { fontSize: "10px", lineHeight: "1.5",  fontWeight: 400 }   # typo-body-xs
rounded:
  sm: "4px"
  surface: "8px"   # Card / Input / Popover  → var(--Radius-Surface)
  modal: "24px"    # 中央 Dialog / AlertDialog → var(--Radius-Modal)
  sheet: "32px"    # bottom / float Sheet     → var(--Radius-Sheet)
  full: "9999px"   # Button / Chip
spacing:
  unit: "4px"      # 4px グリッド（scale: 0,4,8,12,16,20,24,28,32,36,40,44,48,...）
  page: "16px"     # 画面端マージン var(--page-px)
elevation:
  sm: "0 1px 2px rgba(0,0,0,0.05)"
  md: "0 0 8px rgba(20,20,20,0.08)"
  lg: "0 12px 32px -4px rgba(24,39,75,0.12), 0 8px 16px -6px rgba(24,39,75,0.12)"
  dialog: "0 12px 32px -4px rgba(24,39,75,0.12), 0 8px 16px -6px rgba(24,39,75,0.12), 0 1px 4px 1px rgba(0,0,0,0.2)"
motion:
  microIn: "150ms ease-out"                       # fade-in / scale-in
  enter: "200ms ease-out"                          # fade-in-up / slide-in
  sheetSpring: "280ms cubic-bezier(0.32,0.72,0,1)" # Sheet / Dialog のドラッグ・展開
components:
  button:
    background: "{colors.primary}"
    color: "{colors.onPrimary}"
    rounded: "{rounded.full}"
    minHeight: "48px"
  card:
    background: "{colors.surface}"
    border: "{colors.border}"
    rounded: "{rounded.surface}"
    elevation: "{elevation.md}"
  dialog:
    rounded: "{rounded.modal}"
    elevation: "{elevation.dialog}"
  sheet:
    rounded: "{rounded.sheet}"
  input:
    border: "{colors.border}"
    rounded: "{rounded.surface}"
    minHeight: "48px"
---

# KSK Design System — DESIGN.md

> AI コーディングエージェント向けの視覚言語サマリ。**1ファイルで KSK の見た目を
> 再現できる**ことを目的に、トークン（front-matter）と「なぜ・どう使うか」（本文）を併記する。
> 実装で実際に使う正準ソースは `tokens.json` と `src/styles/*.css`。本ファイルはその要約＋意図。

## Overview

KSK は **マルチテーマ統合 DS**。Brand 色（10行）を差し替えるだけで、Primitive → Semantic →
Bridge の3層を伝って全コンポーネントの色が切り替わる。1つの DS で複数案件（BtoB/SaaS 系、
EC/BtoC 系）を回すのが狙い。

- **既定の人格**: 端正・信頼感（Blue）。情報密度は中、余白で呼吸させる。角は適度に丸い（ピル型ボタン＋丸い面）。
- **基盤**: React 19 + Tailwind v4 + shadcn/Radix + iconsax。
- **判断基準**: 色・余白・タイポは必ずトークン経由。生の値を書かない（後述 Do/Don't）。

## Colors

3層トークン。コンポーネントは**必ず Semantic 層を `var()` で参照**する（Primitive 直参照・生 hex 禁止）。

| 用途 | トークン | 既定値(Blue) |
|---|---|---|
| ブランド | `var(--Brand-Primary)` | `#2563EB` |
| 背景(白/薄灰) | `var(--Surface-Primary)` / `-Secondary` | `#FFFFFF` / `#F9FAFB` |
| 文字(強/中/弱) | `var(--Text-High/Medium/Low-Emphasis)` | `#111827` / `#374151` / `#6B7280` |
| 罫線 | `var(--Border-Low-Emphasis)` | `#E5E7EB` |
| 状態 | `--Success/Warning/Caution/Info-Base` | `#16A34A` / `#EA580C` / `#DC2626` / `#2563EB` |

- **Dark mode**: `.dark` で Semantic 層が自動反転（コンポーネント側の変更不要）。
- **Categorical（質的）**: `var(--Categorical-{1..16})` ＋ `-Subtle`(背景) / `-Bold`(文字)。
  カテゴリの色分け専用でテーマ非依存。WCAG/色覚多様性を検証済み。文字には必ず `-Bold`。

## Typography

`typo-*` ユーティリティ1クラスに size/line-height/weight/tracking を集約。`text-sm`/`font-bold` 等の個別指定は禁止。

- 見出し: `typo-heading-{sm..3xl}`（14→28px, line-height 1.5, 700）
- 本文: `typo-body-{xs..lg}`（10→16px, line-height 1.75 系）
- ラベル: `typo-label-{xs..lg}`（10→16px, 500）/ 特大: `typo-display-xl`(48px)
- 色は別指定: `className="typo-body-sm text-[var(--Text-Low-Emphasis)]"`

## Layout & Spacing

- **4px グリッド**。余白・サイズは 4 の倍数（scale 0–60）。
- 画面端マージン: `var(--page-px)`（既定 16px）。
- **タッチターゲット**（モバイル）: ボタン 48px / アイコンボタン 44px / 入力 48px / チップ 36px 以上。

## Elevation & Depth

影は5段（`--shadow-sm/md/lg/dialog/tooltip`）。面は md、浮く要素（dropdown/popover）は lg、
モーダルは dialog。**境界は影＋1px罫線**で表現し、濃い影の多用は避ける。

## Shapes

角丸はトークン化（ベタ書き禁止）。**面 < モーダル < シート**の順で丸くなる。

| 用途 | トークン | 値 |
|---|---|---|
| Card / Input / Popover | `var(--Radius-Surface)` | 8px |
| 中央 Dialog / AlertDialog | `var(--Radius-Modal)` | 24px |
| Sheet（下/フロート） | `var(--Radius-Sheet)` | 32px |
| Button / Chip | `rounded-full` | 9999px |

## Motion

- マイクロ(出現/スケール): **150ms ease-out**。
- 入場(fade-up/slide): **200ms ease-out**。
- Sheet/Dialog の展開・ドラッグ: **cubic-bezier(0.32, 0.72, 0, 1)（iOS 風スプリング）**。
- 控えめが基本。バウンドや派手な動きはしない。`prefers-reduced-motion` を尊重。

## Components

代表例（トークン参照で構成）。

- **Button**: bg `{colors.primary}` / text 白 / `rounded-full` / 高さ 48px。variant: default·secondary·tertiary·ghost·destructive·link。
- **Card**: bg `{colors.surface}` ＋ 1px `{colors.border}` ＋ `{elevation.md}` ＋ `{rounded.surface}`。
- **Dialog（中央モーダル）**= タスク面（フォーム/絞り込み）。`role="dialog"`、`{rounded.modal}`。
- **AlertDialog / ConfirmDialog（割り込み確認）**= 削除等の"止める"操作。`role="alertdialog"`、背景タップで閉じない・中央表示。
- **Sheet（端寄せ）**: `side="bottom"` でボトムシート。`swipeToClose` で全面下スワイプ閉じ。`{rounded.sheet}`。
- **Input**: 1px `{colors.border}` ＋ `{rounded.surface}` ＋ 高さ 48px。

## Voice & Tone

- UI コピー: 日本語・**敬体（ですます）**・簡潔。専門用語を避け、操作の結果を端的に。
- 確認/破壊操作は明示的に選ばせる（"削除する" 等、動詞で）。
- テーマ別の人格: **Blue=端正/信頼**（BtoB·SaaS）, **Orange=温かみ**（EC·フード）, **Green=安心**（ヘルス·金融）, **Violet=上質**（プレミアム·教育）。

## Do's and Don'ts

**Do**
- 色は Semantic トークン `var(--Surface-*)` / `var(--Brand-Primary)` を使う。
- タイポは `typo-*` クラス。角丸は `var(--Radius-*)`。
- アイコンは `iconsax-reactjs`。UI は DS コンポーネント（`<Button>`/`<Input>` 等）。
- **文脈非依存に保つ**: 見た目を自前で固定する。テキストを描く要素は `text-[var(--Text-*)]`、サーフェス（カード/ポップオーバー/シート/ダイアログ等）は `bg-[var(--Surface-*)]`、枠線は `border-[var(--Border-*)]` を明示。親の継承や Tailwind v4 既定（`border`/`ring`/`outline` = currentColor）に依存しない。

**Don't**
- 生 `#hex` / Tailwind 標準色（`bg-blue-500` 等）を直書きしない。
- `font-bold` / `text-sm` / `rounded-lg` / `rounded-[24px]` 等のベタ書きをしない（トークン経由）。
- `lucide-react` / `heroicons` を使わない。生の `<button>`/`<input>`/`<a>` を使わない。
- 確認ダイアログを `Dialog`（タスク面）で作らない（割り込みは `AlertDialog`/`ConfirmDialog`）。
- 色なし `border` / 色未指定の text・bg を親の継承や currentColor 任せにしない。漏れは Storybook の **Hostile ctx** トグルで検出できる。
