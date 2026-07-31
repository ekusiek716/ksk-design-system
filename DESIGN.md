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
  textLow: "#4B5563"          # var(--Text-Low-Emphasis)
  border: "#E5E7EB"           # var(--Border-Low-Emphasis)
  focus: "#60A5FA"            # var(--Focus-High-Emphasis)
  # --- Semantic（status） ---
  success: "#15803D"
  warning: "#C2410C"
  error: "#DC2626"            # Caution
  info: "#2563EB"
typography:
  fontFamily: "system-ui, -apple-system, 'Hiragino Sans', 'Noto Sans JP', sans-serif"
  display:  { fontSize: "48px", lineHeight: "1.25", fontWeight: 700 }   # typo-display-xl
  heading:  { fontSize: "18px", lineHeight: "1.5",  fontWeight: 700 }   # typo-heading-lg（基準）
  body:     { fontSize: "14px", lineHeight: "1.75", fontWeight: 400 }   # typo-body-md（基準）
  label:    { fontSize: "12px", lineHeight: "1.5",  fontWeight: 500 }   # typo-label-sm
  caption:  { fontSize: "11px", lineHeight: "1.5",  fontWeight: 400 }   # typo-caption（注釈/法的表記専用。本文の下限は body=12px。10px の typo-body-xs は補助ラベル専用で本文禁止）
rounded:
  sm: "4px"
  surface: "8px"   # Card / Input / Popover  → var(--Radius-Surface)
  modal: "24px"    # 中央 Dialog / AlertDialog → var(--Radius-Modal)
  sheet: "32px"    # bottom / float Sheet     → var(--Radius-Sheet)
  full: "9999px"   # Button / Chip
spacing:
  unit: "4px"      # 4px グリッド（scale: 0,4,8,12,16,20,24,28,32,36,40,44,48,...）
  page: "16px"     # 基準画面端マージン。実レイアウトは Screen / Shell の padding contract を優先
  section: { xs: "32px", sm: "40px", md: "48px", lg: "56px", xl: "64px", 2xl: "80px" }
elevation:                                          # 影色は neutral（Gray-900 ベース rgba(17,24,39,…)）でテーマ非依存
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  md: "0 0 8px rgba(20, 20, 20, 0.08)"
  lg: "0px 12px 32px -4px rgba(17, 24, 39, 0.12), 0px 8px 16px -6px rgba(17, 24, 39, 0.12)"
  dialog: "0px 12px 32px -4px rgba(17, 24, 39, 0.12), 0px 8px 16px -6px rgba(17, 24, 39, 0.12), 0px 1px 4px 1px rgba(0, 0, 0, 0.2)"
motion:                                            # 実体は var(--Motion-*)（src/styles/motion.css）
  microIn: "150ms ease-out"                        # --Motion-Duration-Fast  / fade-in / scale-in
  enter: "200ms ease-out"                          # --Motion-Duration-Base  / fade-in-up / slide-in
  slow: "300ms ease-out"                           # --Motion-Duration-Slow  / 面積の大きい変化・押下バウンス
  slower: "500ms ease-out"                         # --Motion-Duration-Slower / 進捗の追従
  sheetSpring: "280ms cubic-bezier(0.32,0.72,0,1)" # --Motion-Duration-Sheet-Settle + --Motion-Easing-Emphasized
  sheetEnter: "320ms cubic-bezier(0.32,0.72,0,1)"  # --Motion-Duration-Sheet-Enter + --Motion-Easing-Emphasized
  ring: "400ms ease-out"                           # --Motion-Duration-Ring + --Motion-Easing-Standard（ProgressRing）
layering:                                          # z-index スケール（src/preset.css の --Z-*）
  raised: 10
  sticky: 30
  nav: 40
  floating: 45
  overlay: 50
  modal: 60
  alertOverlay: 900
  alert: 910
  coachmarkOverlay: 950
  coachmark: 960
  popover: 1000
  toast: 1100
  tooltip: 1200
  skipLink: 1300
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

## Source Of Truth

`DESIGN.md` は Google DESIGN.md の「front matter + rationale」形式を参考にした **AI 向け配布サマリ**であり、
実装正本ではない。KSK の正本は次のファイルに置く。

- `tokens.json`: primitive / semantic / dark semantic / typography / spacing / responsive breakpoint / shadow / touch target。
- `src/styles/*.css`: 実際に publish される CSS custom properties と typography / glass utilities。
- `contracts/rules.json`: 禁止パターン、AI anti-pattern、a11y、consumer lint の正本。
- `contracts/components.json`: component 名、variant、subcomponent、usage rule、件数の正本。
- `src/components/COMPONENT_LOOKUP.md`: import map、Storybook coverage、DS-first recipe の生成済み索引。

Google DESIGN.md は互換フォーマットと検査観点の参照に留める。Google 側の alpha schema / CLI を
KSK の必須正本・publish 依存にせず、KSK 固有の multi-theme / native / categorical / component contract は
`contracts/design-context.json` と repo 内 checker で管理する。

## Colors

3層トークン。コンポーネントは**必ず Semantic 層を `var()` で参照**する（Primitive 直参照・生 hex 禁止）。

| 用途 | トークン | 既定値(Blue) |
|---|---|---|
| ブランド | `var(--Brand-Primary)` | `#2563EB` |
| 背景(白/薄灰) | `var(--Surface-Primary)` / `-Secondary` | `#FFFFFF` / `#F9FAFB` |
| 文字(強/中/弱) | `var(--Text-High/Medium/Low-Emphasis)` <!-- docs-drift-ignore: --Text-High/Medium/Low-Emphasis --> | `#111827` / `#374151` / `#4B5563` |
| 罫線 | `var(--Border-Low-Emphasis)` | `#E5E7EB` |
| 状態 | `--Success/Warning/Caution/Info-Base` <!-- docs-drift-ignore: --Success/Warning/Caution/Info-Base --> | `#15803D` / `#C2410C` / `#DC2626` / `#2563EB` |

- **状態色の正本**: 上記は `*-Base`。Caution/Info は Primitive **600**、Success/Warning は白文字 AA(4.5:1) 確保のため Primitive **700**（600 だと 3.3〜3.6:1）。`tokens.json` を正本とし、本表はその要約。
  バッジ/ピル等の強調 **fill** は別ロール `--Surface-*-Strong`（Primitive **500**）で、わざと明るい。役割が違うだけで矛盾ではない。
- **Dark mode**: `.dark` で Semantic 層が自動反転（コンポーネント側の変更不要）。テーマ差し替え（Brand）と
  light/dark は**直交2軸**。dark の semantic 値は `src/styles/semantic.css` の `.dark` が実装で、`tokens.json` の
  `colors.semanticDark` に機械可読ミラーを持つ（契約テストで同期を保証）。
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
- セクション同士の縦リズムは `--Space-Section-{xs..2xl}`（32–80px）を使い、コンポーネント内の gap scale と分離する。
- 画面端マージン: 16px を基準にしつつ、実レイアウトでは `Screen` / shell component の padding contract を優先する。
- **タッチターゲット**（モバイル）: WCAG 2.5.5 / Apple HIG に従い主要操作（ボタン/アイコンボタン/入力/ナビ）の
  **min は 44px** 以上、推奨 48px。44 未満が避けられない **チップ（min 32px）は hitSlop**（不可視の拡張タップ領域）で
  実効 44px を確保する。値の正本は `tokens.json` の `touchTargets`。

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

> 素の `rounded-*` を使う場合、キーは **Tailwind v4 のユーティリティ名**と一致し値もその実描画 px と同じ
> （`tokens.json` の `borderRadius`: none→sm(4)→md(6)→lg(8)→xl(12)→2xl(16)→full の連続スケール）。
> 独自の `--radius-*` 上書きはしていないため、`rounded-md`/`rounded-xl` は Tailwind v4 既定の 6px/12px を描画する。

## Motion

生の ms 値 / cubic-bezier は直書きせず、`src/styles/motion.css` の semantic トークンを参照する
（`duration-[var(--Motion-Duration-Base)]` / `ease-[var(--Motion-Easing-Emphasized)]`）。

| duration | 値 | 用途 |
|---|---|---|
| `--Motion-Duration-Fast` | 150ms | マイクロ（fade / scale / 色変化） |
| `--Motion-Duration-Base` | 200ms | 標準。入場・退場・レイアウト変化の既定 |
| `--Motion-Duration-Slow` | 300ms | 面積の大きい要素・押下バウンス・画像トランジション |
| `--Motion-Duration-Slower` | 500ms | 進捗のような「じわっと追従」表示専用 |
| `--Motion-Duration-Sheet-Enter` | 320ms | Sheet の表示・スナップ移動（Emphasized と対） |
| `--Motion-Duration-Sheet-Settle` | 280ms | Sheet のドラッグ解放後の吸着・閉じ |
| `--Motion-Duration-Ring` | 400ms | ProgressRing のリング描画 |

| easing | 値 | 用途 |
|---|---|---|
| `--Motion-Easing-Standard` | `cubic-bezier(0,0,0.58,1)` | CSS の `ease-out` キーワードと同一曲線。UI 変化の既定 |
| `--Motion-Easing-Emphasized` | `cubic-bezier(0.32,0.72,0,1)` | iOS 風スプリング。Sheet / Dialog の展開・ドラッグ |
| `--Motion-Easing-Accelerate` | `cubic-bezier(0.42,0,1,1)` | 加速。CSS の `ease-in`。落下する紙吹雪 |
| `--Motion-Easing-Decelerate` | `cubic-bezier(0.16,1,0.3,1)` | 強い減速。celebration の紙吹雪 |
| `--Motion-Easing-Bounce` | `cubic-bezier(0.34,1.56,0.64,1)` | 行き過ぎて戻る。Button 押下など触感を出す箇所限定 |

- 控えめが基本。バウンドや派手な動きはしない。
- 実カーブは5種類。通常UIは **Standard**、Sheet / Dialogは **Emphasized**。
  Accelerate / Decelerate は方向性を持つcelebration、Bounceは触感を意図した操作だけに使う。
- `--Motion-Easing-Snappy` / `--Motion-Easing-Default` / `--Motion-Easing-InOut` は
  consumer互換のdeprecated aliasとして
  Standardへ解決する。新規コードでは使用せず、v2まで削除しない。
- `prefers-reduced-motion: reduce` では duration トークン側が 0.01ms に落ちるため、
  トークンを参照していれば個別対応は不要。逆に `duration-200` のような直書きは
  この一括制御から漏れる。
- celebration の 360ms / 600ms / 1400ms など祝祭演出専用の尺は、意図的にスケールから
  外して直書きし、その旨をコード内にコメントで残している。

## Layering（z-index）

Portal に載る要素（Dialog / Sheet / Popover / Toast 等）は DOM 上の親子関係を失うため、
`z-50` を一律に振ると勝敗が Portal のマウント順＝開いた順に依存する。意味ごとに段を分け、
`z-[var(--Z-Modal)]` の形で参照する（定義は `src/preset.css`）。

| token | 値 | 用途 |
|---|---|---|
| `--Z-Base` | 0 | 通常フロー |
| `--Z-Raised` | 10 | カード内の重なり（画像上のバッジ、カルーセル矢印） |
| `--Z-Sticky` | 30 | スクロール追従のフィルタバー / サブナビ / 背後の装飾帯 |
| `--Z-Nav` | 40 | アプリシェルの固定ヘッダ・ボトムタブ・FAB・同意バナー |
| `--Z-Overlay` | 50 | Dialog / Sheet の scrim（暗幕） |
| `--Z-Modal` | 60 | Dialog / Sheet 本体。必ず自分の scrim より上 |
| `--Z-Alert-Overlay` | 900 | AlertDialog / ConfirmDialog の scrim |
| `--Z-Alert` | 910 | AlertDialog / ConfirmDialog 本体 |
| `--Z-Coachmark-Overlay` | 950 | CoachMarkOverlay の scrim / スポットライト |
| `--Z-Coachmark` | 960 | CoachMark の吹き出し |
| `--Z-Popover` | 1000 | Select / Popover / DropdownMenu / HoverCard |
| `--Z-Toast` | 1100 | 通知・Celebration。Modal 表示中でも読める |
| `--Z-Tooltip` | 1200 | 補助情報。他の何かの上に出るのが役目 |
| `--Z-SkipLink` | 1300 | キーボード操作の最初の逃げ道。何にも隠されてはいけない |

重なり順の意図:

- **Popover > Modal** — Select や DropdownMenu は Modal の中から開くため。
- **Toast > Modal / Popover** — 保存完了やエラーは、モーダルを開いたままでも読めなければ意味がない。
- **Tooltip > Toast** — Tooltip は「何かの上に補足を出す」のが役目なので実質最上位。
- **SkipLink が最上位** — フォーカスした瞬間に必ず見えないと、キーボード利用者の逃げ道が消える。
- **AlertDialog / ConfirmDialog は Modal より上（900/910）** — これらは Dialog や Sheet の
  *中から* 開かれる割り込み確認。Modal と同じ段に置くと自分の scrim が親コンテンツの下に潜り、
  親が暗転しないまま確認だけが浮く（どの操作を確認しているのか分からない状態になる）。
  逆に Alert から Dialog / Sheet を開くフローは想定しない（Alert は終端の確認）。
- **CoachMark も scrim ごと Modal より上（950/960）** — オンボーディングは Dialog や Sheet を
  開いた状態の上から重ねることがあり、scrim が Modal より下だと「暗転していないモーダルの上に
  説明だけが浮く」状態になる。
- **Floating(45) が Nav(40) の上** — AppShell は `<main>` の後にボトムナビを描画するので、
  同じ段だと FAB や一括操作バーが後勝ちのナビに隠れる。
- **Modal(60) と Alert-Overlay(900) の間が大きく空いている**のは、多段 Sheet が
  `Modal + 段数*20` で積み上がるための予約領域（issue #158）。

`z-10` / `z-20` のような小さい素の値は「コンポーネント内部の重なり」用途で、
このグローバルスケールの対象外。

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
