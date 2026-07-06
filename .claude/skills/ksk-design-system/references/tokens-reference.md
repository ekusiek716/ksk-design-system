# トークン早見リファレンス

> 正本は `tokens.json`（機械可読）と `src/styles/*.css` / `src/preset.css`（実 CSS）。
> 本ファイルは実装時に most-used を引くための早見。迷ったら正本を読む。

## カラー — 3層構造の使い分け

```
Layer 1 Primitive  --Primitive-{Color}-{50..900}   ← コンポーネントから直接使うの禁止
Layer 2 Semantic   --{Category}-{Role}             ← コンポーネントはここだけを使う
Layer 3 Bridge     --primary 等 shadcn 互換         ← shadcn 移植コードの互換用
```

テーマ差し替えは `--Primitive-Brand-{shade}` スロットを themes/*.css が上書きする仕組み。
だから **Brand 系は必ず Semantic 経由**（`--Brand-Primary` = Brand-600、`--Brand-Action` = 700）。

### Semantic 主要トークン（light。dark は `.dark` で自動反転）

| カテゴリ | トークン | 用途 |
|---|---|---|
| Surface | `--Surface-Primary` / `-Secondary` / `-Tertiary` / `-Quaternary` | 白 / 薄灰 / 灰 / 濃灰の面 |
| | `--Surface-Disable` / `--Surface-Inverse` | 無効面 / 反転面（黒っぽい） |
| | `--Surface-Accent-Primary` / `-Light` / `-Ultra-Light` | ブランド面 / 薄いブランド面 |
| | `--Surface-{Caution,Success,Warning,Info}` | 状態の淡背景（50系） |
| | `--Surface-{...}-Subtle` | 状態の透過ティント（15%） |
| | `--Surface-{...}-Strong` | バッジ/ピルの強 fill（500系。Base より一段明るいのは役割違い） |
| Text | `--Text-High/Medium/Low-Emphasis` / `--Text-Disable` | 文字の強弱 |
| | `--Text-on-Inverse` / `--Text-on-Media` | 反転面 / 画像上の白文字 |
| | `--Text-Accent-Primary` / `--Text-{Success,Caution,Warning,Info}` | 色付き文字（コントラスト確保済み 600–700系） |
| Object | `--Object-High/Medium/Low-Emphasis` / `--Object-Disable` | アイコン・図形 |
| | `--Object-{Caution,Success,Warning,Info}` / `--Object-Favorite` / `--Object-Rating` | 状態アイコン / ♥ / ★ |
| Border | `--Border-Low-Emphasis`（区切り・淡カード） / `--Border-Medium-Emphasis`（入力・強調） / `--Border-High-Emphasis` | 罫線3段 |
| | `--Border-{Caution,Success,Warning,Info}` / `--Border-Accent-Primary` | 状態枠線 |
| Brand | `--Brand-Primary`（600） / `--Brand-Action`（hover/active、700） / `--Brand-Light` / `--Brand-Ultra-Light` | ブランド |
| Hover/Active | `--Hover-Primary-Button` 等（600→700→800 の段階） | ボタン状態はこのトークンで（自前で暗くしない） |
| Focus | `--Focus-High-Emphasis`（Brand-400） | フォーカスリング専用 |
| Overlay | `--Overlay-Dark/Medium/Light` | モーダル背景等 |
| 状態基準 | `--Caution-Base` / `--Success-Base` / `--Warning-Base` / `--Info-Base`（600系） | テキスト/アイコン基準の状態色 |

### 使い分けの決まり文句

- 白背景 → `bg-[var(--Surface-Primary)]`、薄灰の区画 → `bg-[var(--Surface-Secondary)]`
- 本文 → `text-[var(--Text-High-Emphasis)]`、補足 → `-Medium`、プレースホルダ的 → `-Low`
- 区切り線・カード枠 → `border-[var(--Border-Low-Emphasis)]`、入力枠 → `-Medium-Emphasis`
- エラー文字 → `text-[var(--Text-Caution)]`（Red-600。`--Caution-Base` と同値だが text 用ロールを優先）

### Categorical（質的パレット・テーマ非依存）

`--Categorical-{1..16}`（base: ドット/アイコン）/ `-Subtle`（背景ティント）/ `-Bold`（文字）。
「N番目のカテゴリ」を区別する用途専用（カレンダー・chip・グラフ系列）。N色必要なら 1..N を順に使う
（CVD 分離度の高い順に並んでいる）。**文字には必ず `-Bold`**。詳細は `src/styles/categorical.css`。

## Typography — typo-* 17クラス

`typo-{display-xl|display-lg|heading-3xl..sm|body-lg..xs|label-lg..xs|caption}`。
size/weight/line-height/letter-spacing を1クラスに内包。**色は別指定**:
`className="typo-body-sm text-[var(--Text-Low-Emphasis)]"`。
制約: body-xs(10px) と caption(11px) は本文禁止（本文下限 12px）。一覧は `contracts/rules.json` の `typography.classes`。

## Spacing — 4px グリッド

スケール: 0,4,8,...,60（tokens.json `spacing.scale`）。Tailwind 標準クラス（gap-1=4px, gap-2=8px,
gap-3=12px, gap-4=16px, gap-6=24px, p-8=32px...）で表現し、**任意値 `p-[17px]` は禁止**。
高頻度帯は gap/p の 1–6。8 以上（32px+）はセクション区切り等の大きな余白のみ。
画面端マージン基準 16px（実レイアウトは Screen/Shell の padding contract 優先）。

## Radius / Shadow / Motion / TouchTarget

- 角丸: 意味トークン `--Radius-Surface`(8) / `--Radius-Modal`(24) / `--Radius-Sheet`(32) を優先。
  素の rounded-* は none/sm(4)/md(6)/lg(8)/xl(12)/2xl(16)/full の7値のみ（P019）
- 影: `--shadow-sm/md/lg/dialog/tooltip` の5段のみ（P020）。影色は neutral でテーマ非依存
- motion: 150ms（micro）/ 200ms（enter）/ sheet 280ms spring。300ms+ 禁止（P030）
- タッチターゲット: min 44px・推奨 48px。chip(32px) は hitSlop で実効 44px（`touchTargets`）

## テーマ

default(Blue)/blue/cobalt/orange/green/violet。新規は `src/themes/*.css` に Brand 10行差し替えで追加。
light/dark は Brand 差し替えと**直交2軸**（`.dark` クラス付与で semantic が自動反転、コンポーネント変更不要）。
