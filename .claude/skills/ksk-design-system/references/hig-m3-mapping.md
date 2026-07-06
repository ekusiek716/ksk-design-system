# HIG × M3 × KSK トークン対応表

> KSK の設計基準は Apple HIG と Material Design 3。**衝突時は厳しい方を採用**する
> （例: タッチターゲットは min 44 かつ推奨 48 の両立）。本ファイルは KSK トークンが
> HIG/M3 のどの規範に対応するかの参照。値の正本は `tokens.json` / `src/preset.css`。

## タッチターゲット

| 対象 | HIG (iOS) | M3 (Android) | KSK 採用値（厳しい方合成） |
|---|---|---|---|
| ボタン / アイコンボタン / 入力 / ナビ項目 | ≥44×44pt | ≥48×48dp | **min 44px・推奨 48px**（`touchTargets`） |
| チップ（視覚 32–36px が避けられない場合） | — | — | **hitSlop で実効 44px を確保** |

チェック方法: レンダリング後の実効ヒット領域（visible + hitSlop）が 44px 未満なら違反。
`Button size="icon-xl"` が HIG 最小 44px に対応。

## タイポグラフィ（ロールマッピング）

KSK の `typo-*` 17クラスは HIG Text Styles / M3 Type Scale のロールに対応する。
**和文最適化のため値は独自**（line-height 1.5–1.75、見出し +0.04em、`tracking-tight` 禁止）。

| KSK | HIG 相当 | M3 相当 | 用途 |
|---|---|---|---|
| typo-display-xl/lg (48/36px) | Large Title+ | Display L/M | ヒーロー・LP |
| typo-heading-3xl/2xl (28/24px) | Title 1/2 | Headline L/M | ページ・主要セクション |
| typo-heading-xl/lg (21/18px) | Title 3 / Headline | Headline S / Title L | サブセクション・グループ |
| typo-heading-md/sm (16/14px) | Headline / Subheadline | Title M/S | 小見出し・ラベル的見出し |
| typo-body-lg/md (16/14px) | Body / Callout | Body L/M | 本文 |
| typo-body-sm (12px) | Footnote | Body S | 補足。**本文の下限は 12px** |
| typo-body-xs (10px) | Caption 2 | — | 補助ラベル専用・**本文禁止** |
| typo-label-lg/md (16/14px) | — (button) | Label L | ボタン・ナビ |
| typo-label-sm/xs (12/10px) | — | Label M/S | タグ・バッジ |
| typo-caption (11px) | Caption 1 | — | 注釈・法的表記のみ |

M3 デフォルト（Roboto 前提の tracking）は和文に適用しない。HIG の Dynamic Type 対応は
Web では必須にしないが、`rem` ベース禁止はしていない（px 指定は typo-* 内に隠蔽）。

## Elevation（M3 levels → KSK 5段）

M3 の elevation level 0–5 を KSK は**セマンティック5段のみ**に絞る。
tonal elevation（M3 の色による高度表現）は不採用で、**影＋1px罫線**が KSK の境界言語。

| KSK トークン | M3 相当 | 用途（これ以外に使わない） |
|---|---|---|
| （影なし＋罫線） | Level 0 | 既定の面・リスト |
| `--shadow-sm` | Level 1 | 微細な浮き |
| `--shadow-md` | Level 1–2 | Card・標準の面 |
| `--shadow-lg` | Level 2–3 | Dropdown・Popover（浮く要素） |
| `--shadow-dialog` | Level 3–5 | Dialog・Modal |
| `--shadow-tooltip` | — | Tooltip 専用 |

チェック方法: `shadow-xl` 等の Tailwind 標準や、Card に `--shadow-dialog` を使うのは違反。
「1段浮くごとに1段強い影」の対応から外れていないか確認する。

## Shape（M3 shape scale / HIG concentricity → KSK 角丸階層）

丸さは**階層＝面 < モーダル < シート**で意味を持つ（HIG の同心円的角丸・M3 shape scale の思想）。

| KSK | 値 | M3 shape 相当 |
|---|---|---|
| `--Radius-Surface`（Card/Input/Popover） | 8px | Small/Medium |
| `--Radius-Modal`（中央 Dialog/AlertDialog） | 24px | Extra Large |
| `--Radius-Sheet`（bottom/float Sheet） | 32px | Extra Large+ |
| `rounded-full`（Button/Chip/Badge/Avatar） | 9999px | Full（ピル） |
| 素の rounded-*（その他の小要素） | none/4/6/8/12/16 | Extra Small〜Large |

## Motion

HIG「素早く控えめ」× M3 duration/easing token の交差を 3 値に集約。バウンド禁止。

| KSK | 値 | 根拠 |
|---|---|---|
| micro | 150ms ease-out | M3 short (50–200ms) / HIG の即時フィードバック |
| enter | 200ms ease-out | M3 medium 下限。300ms 以上は P030 で禁止 |
| sheetSpring | 280ms cubic-bezier(0.32,0.72,0,1) | iOS シートのスプリング近似（HIG 由来） |

`prefers-reduced-motion` を尊重する（HIG/M3/WCAG 共通要件）。

## モーダリティ（HIG Modality / M3 Dialogs の使い分け）

| 状況 | 使うもの | 根拠 |
|---|---|---|
| 作業面（フォーム・絞り込み） | `Dialog`（role=dialog、24px 角丸） | HIG: モーダルは自己完結タスク |
| 割り込み確認（削除等の不可逆） | `AlertDialog`/`ConfirmDialog`（role=alertdialog、外タップで閉じない） | HIG Alerts / M3 basic dialog: 明示的に選ばせる |
| 補助・フィルター・メニュー（軽い文脈） | `Sheet`（bottom で BottomSheet） | HIG Sheets / M3 bottom sheets |
| PC=Dialog / モバイル=Sheet の自動切替 | `ResponsiveDialog` | プラットフォーム適応（HIG/M3 双方の作法） |

## コントラスト（WCAG 2.1 AA — HIG/M3 共通の下限）

- 通常テキスト ≥4.5:1 / 大テキスト（18px+ bold）≥3:1 / UI 要素・アイコン ≥3:1
- ステータス・エラーは**色＋アイコン＋テキストの3点セット**（色のみ禁止）
- Categorical 色の文字は必ず `-Bold` tier（base は白背景で 3:1 未満になりうる）
