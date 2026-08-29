# KSK Design System

[![npm version](https://img.shields.io/npm/v/ksk-design-system.svg)](https://www.npmjs.com/package/ksk-design-system)
[![npm downloads/month](https://img.shields.io/npm/dm/ksk-design-system.svg)](https://npm-stat.com/charts.html?package=ksk-design-system)
[![npm downloads total](https://img.shields.io/npm/dt/ksk-design-system.svg)](https://npm-stat.com/charts.html?package=ksk-design-system)
[![license](https://img.shields.io/npm/l/ksk-design-system.svg)](./LICENSE)

複数クライアント案件を **1つのデザインシステム** で高速に回すために設計された、React 製のマルチテーマ対応 UI ライブラリ。BtoB / SaaS の信頼感と EC / BtoC の購買体験、2つのドメインの設計思想を統合しています。

**🔗 ライブ Storybook → https://ksk-design-system.vercel.app**

133 コンポーネントを実際に操作・確認できます。

---

## ✨ 特徴

- **マルチテーマ** — Brand 色の 10 行を差し替えるだけで、全コンポーネントの見た目が自動で切り替わる（Primitive → Semantic → Bridge の 3 層トークン構造）
- **アクセシブル** — shadcn/ui（Radix UI ベース）+ `@storybook/addon-a11y` で a11y を担保
- **Tailwind CSS v4 ネイティブ** — `@theme` ベースのトークン設計
- **型安全** — React 19 + TypeScript、CVA によるバリアント管理
- **133 Web コンポーネント + 134 React Native exports** — Web 133（UI 58 / パターン 52 / EC 12 / 管理 8 / シェル 3）+ RN `native/ui` 公開 export 134
- **iOS 26 Liquid Glass 対応** — RN 側 `GlassView` + `Button variant="glass"`、Web 側 `.glass` CSS マテリアル

## 🎨 テーマ

Brand 色を差し替えるだけで業種に合わせた配色に切り替わります。

| テーマ | Brand-500 | 想定業種 |
|--------|-----------|---------|
| Default (Blue) | `#3B82F6` | 汎用・SaaS・BtoB |
| Orange | `#F97316` | EC・フード・エンタメ |
| Green | `#16A34A` | ヘルスケア・サステナ・金融 |
| Violet | `#7C3AED` | プレミアム・クリエイティブ・教育 |

## 🧱 技術スタック

React 19 + TypeScript / Vite / **Tailwind CSS v4** / shadcn/ui（Radix UI）/ CVA / iconsax-reactjs / Storybook

**Peer dependencies**: `react` 18 or 19, `react-dom`, `tailwindcss` ^4.1（preset が同梱する safelist が
Tailwind 4.1 で導入された `@source inline()` を使うため）

## 🚀 使い方

### Web (Next.js / Vite / 任意の React 環境)

```bash
npm install ksk-design-system
```

AI コーディング（Claude Code / Codex）を使うプロジェクトでは、続けて 1 回だけ実行します。

```bash
npx ksk-ds init
```

プロジェクトルートに `CLAUDE.md` / `AGENTS.md`（`node_modules` 内の DS ルールを指す薄いポインタ）を
設置します。AI エージェントは `node_modules` 配下を自動では読まないため、このファイルが無いと
DS のルールが適用されません。既存ファイルはスキップされ、更新は `--force` で上書きします。

> **v1.60.0 で `postinstall` による自動設置を廃止しました。** install 時にプロジェクトルートへ
> AI 指示ファイルを書き込む挙動は、サプライチェーン検査で「同意なき AI エージェント制御面の設置」
> として Critical 判定されるためです（LPM Firewall が 1.49.2 / 1.51.1 をこの理由でブロック判定）。
> v1.59.0 以前から更新する場合、既に設置済みのファイルはそのまま使えます。

```css
/* globals.css / app.css（CSS の場所に応じて ../../ の数を調整） */
@import "tailwindcss";
@import "ksk-design-system/preset";
@import "ksk-design-system/themes/default";
@import "./themes/my-client.css"; /* Brand 色を差し替えたテーマ */
@source "../../node_modules/ksk-design-system/dist";
```

Tailwind CSS v4 は `node_modules` を既定では走査しません。`@source` がないと、
DS 内部だけで使うレイアウト・サイズ・状態クラスが生成されず、コンポーネントの表示や操作が崩れます。
consumer 側の Tailwind と DS を同じビルドで処理するため、上記の設定をセットで使用してください。

なお preset には DS 内部ユーティリティの safelist
（`src/styles/source-safelist.css` / 自動生成）が同梱されており、`@source` を書き忘れても
DS のクラス CSS は生成されます（issue #258）。ただし consumer 自身のコードは
consumer 側の走査対象なので、`@source` は引き続き推奨構成です。

```tsx
import { Button, Card, Input, FormField } from "ksk-design-system"
```

新規クライアント案件では、テーマファイルで `--Primitive-Brand-500` などブランドカラーの 10 行を定義するだけで、全コンポーネントがそのブランドカラーで動作します。

### 段階移行レシピ（既存 CSS を保ったまま DS 化する）

既存の手書き CSS で作られた画面を DS へ移すときは、**見た目を後回しにして挙動と
アクセシビリティだけ先に統一する**のが最も安全です。生タグ（`<button>` / `<input>` /
`<textarea>`）を DS コンポーネントへ置き換え、既存クラスを `className` へ渡し、
`unstyled` を付けます。

```tsx
// before — 生タグ + 手書き CSS
<button className="btn btn-primary" onClick={submit}>ログイン</button>
<textarea className="composer-input" value={text} onChange={onChange} />

// after — 挙動と a11y は DS、見た目は既存 CSS のまま
<Button unstyled className="btn btn-primary" onClick={submit}>ログイン</Button>
<Textarea unstyled className="composer-input" value={text} onChange={onChange} />
```

**なぜ `unstyled` が要るのか。** 手書き CSS は非レイヤー、DS のユーティリティは
`@layer utilities` なので、宣言が衝突すれば手書き側が勝ちます。しかし手書きクラスの
大半は height / white-space / font-weight / border-radius / background を宣言して
おらず、**衝突しないプロパティは DS の base + variant がそのまま効きます**。
`className` を渡すだけでは見た目は保てません。aikoibito web の実測では、
チャット入力欄が `--Field-Min-Height: 5rem` の流入で **43px → 80px** に、
ログイン CTA が **52px → 40px** に変わりました（issue #420）。

`unstyled` を付けたときに DS が出すのは次だけです。

| コンポーネント | 維持されるもの | 出さないもの |
|---|---|---|
| `Button` | `type` 既定 `"button"` / disabled・aria-disabled クリックの抑止 / `haptic` / `asChild` | `inline-flex` `items-center` `justify-center` `gap-*` `whitespace-nowrap` `typo-*` `cursor-pointer` と variant・size・layout の全クラス |
| `Input` | `showCount`（IME 追従）/ adornment の配置土台 | `h-*` `w-full` `border-*` `bg-*` `px-*` `typo-*` `placeholder:*` |
| `Textarea` | `autoGrow` / `showCount` | `min-h-*` `w-full` `border-*` `bg-*` `px-*` `py-*` `typo-*` `placeholder:*` |
| `Label` | Radix Label の挙動（クリックで対象コントロールへフォーカス移動） | `typo-label-md` `text-[var(--Text-High-Emphasis)]` `peer-disabled:cursor-not-allowed` `peer-disabled:opacity-50` |

キーボード操作時の `focus-visible` リングだけは a11y のため既定で残ります（`Label` は
フォーカス可能要素ではないため対象外）。手書き CSS が自前のフォーカス表現を持つ場合は
`className="focus-visible:ring-0"` で消せます。

移行の順番は次のとおりです。

1. 生タグを DS コンポーネント + `unstyled` + 既存クラスへ置き換える（見た目は 1px も変わらない）
2. この状態で `npx ksk-ds lint src` の P001〜P006 を通す
3. 画面ごとに、既存クラスを DS のトークン・variant へ置き換えて `unstyled` を外す

`unstyled` は移行の足場であって最終形ではありません。3 が済んだ画面から順に外してください。

### Consumer lint

consumer 側のローカル grep script が古くならないよう、DS 本体から `contracts/rules.json` を読む lint CLI を同梱しています。

```bash
npx ksk-ds lint src
npx ksk-ds lint src --format json
npx ksk-ds lint --changed
npx ksk-ds lint src --platform native
npx ksk-ds lint src --strict            # warning も exit 1
npx ksk-ds lint src --max-warnings=0    # warning が N 件を超えたら exit 1
```

既定では `severity: "error"` のルールだけが exit code に影響します。a11y 系を含む
`warning` ルールも CI で締めたい場合は `--strict` か `--max-warnings N` を使ってください。
**未知のオプションはエラー終了**します（黙って捨てないので、CI に書いたフラグが
無言で効かないことはありません）。

ルールはファイルごとに **capability（そのファイルがどの記法を持ちうるか）** を判定して
出し分けます（`contracts/rules.json` の `appliesTo`）。

| ファイル | capability | 当たるルール |
|---|---|---|
| web（native シグナルなし） | `dom` `tailwind` `web` | 全部 |
| React Native ＋ `className` あり（**NativeWind**） | `native` `tailwind` | Tailwind 系は当たる／DOM 生タグ系と CSS 変数系は外れる |
| React Native ＋ `className` なし（**StyleSheet**） | `native` | Tailwind 系も外れる |

native の判定シグナルは `*.native.tsx` というファイル名、`react-native` /
`ksk-design-system/native` の **import 文**、`StyleSheet.create` の使用です。
自動判定が合わない場合は `--platform web` / `--platform native` で上書きできます
（ファイル判定より優先）。ただし `--platform native` を付けても Tailwind を持つかどうかは
ソースの `className` の有無で決まるので、NativeWind の consumer が Tailwind 系ルールを
失うことはありません。

`appliesTo` を持たないルール（`#hex` 直書きの P008 等）は従来どおり全ファイルに適用され、
native では RN 向けの fix 文言を表示します。

出力は `file:line rule severity fix` を含みます。severity の語彙は `error` / `warning` で、
`contracts/rules.json` と JSON 出力・text 出力すべてで一致しています。

#### 例外（escape）

どうしても DS で表現できない箇所は、**ルール単位・理由付き**の escape コメントを置きます
（理由は 5 文字以上が必須。空虚な理由は `ESCAPE002` として報告され、ignore は効きません）。

```tsx
// ksk-ds-lint-ignore P008 -- ブランドロゴの規定色のため
const BRAND = "#06C755"
```

| 書き方 | スコープ |
|---|---|
| `// ksk-ds-lint-ignore P008 -- 理由` | そのコメント行から**下 2 行以内**・指定ルールのみ |
| `// ksk-ds-lint-ignore-file P008 -- 理由` | **そのファイル全体**・指定ルールのみ |
| `// ksk-ds-allow-custom-ui: 理由` | そのファイル全体・**全ルール**（非推奨・後方互換） |

`ksk-ds-allow-custom-ui` はスコープが広すぎて将来の違反まで隠すため、新規では使わず
ルール単位の `ksk-ds-lint-ignore` を使ってください。escape マーカーは**コメントの中でのみ**
有効で、文字列リテラル（ドキュメント URL 等）の中では発火しません。
理由は 5 文字以上が必須です。また理由文字列に `*` は使えません
（`*/` を誤って飲み込まないための制約で、`*` 以降は理由として認識されません）。

#### lint されないファイル

- 先頭 12 行に自動生成マーカー（`AUTO-GENERATED` / `DO NOT EDIT` / `自動生成` 等）を持つ
  ファイルは全ルールを skip します。直す先は生成物ではなく生成元です。
- DS 自身のトークン定義 CSS（`src/styles/*.css` / `src/themes/*.css` / `src/preset.css` と、
  それを再梱包したベンダリングコピー）は P049 / P050 の対象外です。トークンを**定義**している側で
  あって、consumer による上書き・並行実装ではないためです。

#### P050: DS を参照しない並行パレットの検出（issue #393）

P049 は「DS の名前空間の変数（`--Primitive-Brand-500` 等）に触れている CSS」しか見ないため、DS を
一切使わない独自パレット（`--bg` / `--accent` / `--surface` 等）を持つ consumer には
無言でした。P050 は `:root` / `.dark` / `[data-theme=...]` のようなルート的セレクタの中で、
DS 名前空間に属さないカスタムプロパティへ色値（`#hex` / `rgb()` / `hsl()` / `oklch()`）を
<!-- docs-drift-ignore: --Primitive- -->
5 個以上定義していたら「並行パレットの疑い」を warn します。値が `var(--Primitive-...)` の
ように DS トークンを参照しているだけのものはカウントしません。意図的な独立パレット
（LINE 風チャット画面のライトなど）は `// ksk-ds-lint-ignore P050 -- 理由` で抑制できます。

#### ルールごとの除外（rules.json の excludes 系）

`contracts/rules.json` の除外指定は、当てる対象ごとに 3 つに分かれています。

| フィールド | 当てる対象 | 効く範囲 |
|---|---|---|
| `excludePaths` | ファイルパス | 全リポジトリ（`.stories.` 等） |
| `excludeDsPaths` | ファイルパス | **DS パッケージ配下のファイルだけ**（`components/ui/` 等） |
| `excludeLines` | 行の内容 | 全リポジトリ（`data-slot` / `asChild` 等） |

`excludeDsPaths` は「DS 自身の実装だから生タグを書いてよい」という意味の除外なので、
consumer が shadcn 既定の `src/components/ui/` に部品を置いても中核ルールは無効化されません
（v1.63.x までは単一の `excludes` をパスと行内容の両方に OR で当てていたため、
このディレクトリ名だけで 13 ルールが同時に黙っていました）。

`excludeLines` の各値は **literal 文字列**として `line.includes(value)` で判定されます
（正規表現ではありません）。`shadow-\[` のように正規表現エスケープした値を書くと、実ソースの
`shadow-[var(--shadow-md)]` と一致せず除外が一度も効きません（issue #463）。
`scripts/check-rules-contract.mjs`（`npm run check` に組み込み済み）が `excludeLines` /
`excludePaths` / `excludeDsPaths` 内のバックスラッシュ混入を検出します。

#### P029: テンプレートリテラル className の許容範囲（issue #464）

`className={\`...\${...}...\`}` の補間部（`${...}`）が**文字列リテラルのみで構成される式**
（単純三項 `cond ? "a" : "b"` / `&&` / ネスト三項）なら、Tailwind の静的クラス抽出を壊さないため
P029 の対象外です。CLAUDE.md の実装前セルフチェックにある「クラス名は完全な文字列で書く。分岐は
三項演算子か cva variant で」という方針と一致させています。

識別子・関数呼び出し・メンバーアクセスの補間（`` `bg-${color}` `` 等）や、テンプレートリテラルの
入れ子は静的抽出できないため引き続き検出します。`cn()` / `clsx()` / CVA を使ってください。

`&&` は左辺が条件で出力されないため右辺だけを見ますが、`||` は左辺が truthy ならその値が
そのまま出力されるので両辺を見ます（issue #468）。したがって
`` `base ${props.className || ""}` `` は `` `base ${props.className ?? ""}` `` と同じく検出対象です。

### Jest（CommonJS）でコンポーネントをテストする

このパッケージは **ESM-only** です。CJS との dual build は配布せず、Jest
側で DS とその ESM 依存を `babel-jest` の変換対象にします。Vitest など
ESM をネイティブに扱うランナーでは、以下の設定は不要です。

Jest 29 では Babel 7 系を使います（Babel 8 は `babel-jest@29` の peer
範囲外です）。

```bash
npm install --save-dev \
  jest@29.7.0 babel-jest@29.7.0 jest-environment-jsdom@29.7.0 \
  @babel/core@^7.28.0 @babel/preset-env@^7.28.0 \
  @babel/preset-react@^7.28.0 @babel/preset-typescript@^7.28.0
```

```js
// babel.config.cjs
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    ["@babel/preset-typescript", { allExtensions: true, isTSX: true }],
  ],
}
```

```js
// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.m?[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/.pnpm/(?!(ksk-design-system|radix-ui|iconsax-reactjs|@radix-ui\\+[^@]+)@)",
    "node_modules/(?!.pnpm|ksk-design-system|radix-ui|@radix-ui|iconsax-reactjs)",
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/test/style-mock.cjs",
    "^ksk-design-system/(preset|styles(?:\\.css)?|glass|tokens/(?:primitive|semantic|typography|categorical|motion)|themes/(?:default|blue|orange|green|violet|cobalt))$":
      "<rootDir>/test/style-mock.cjs",
  },
}
```

```js
// test/style-mock.cjs
module.exports = {}
```

この構成なら `ksk-design-system` をコンポーネント単位で mock せず、そのまま
render できます。リポジトリ内では、実際に `npm pack` した tgz を空の Jest
プロジェクトへインストールする再現テストを実行できます。

```bash
npm run test:jest-consumer
```

React Native / Expo の `jest-expo` でも考え方は同じです。既存の Expo preset
は維持し、`transformIgnorePatterns` の除外対象へ
`ksk-design-system` と利用する ESM peer を加えてください。

### Consumer duplicate check

DS に存在する部品を consumer 側で再実装しないよう、コンポーネント名の重複検査を同梱しています。

```bash
npx ksk-ds check-duplicates
npx ksk-ds check-duplicates ./src --strict
```

既定は助言モードで終了コード 0、`--strict` は重複候補があると終了コード 1 です。正本は同梱の `contracts/components.json` であり、consumer 側に別の「昇格候補台帳」を作らないでください。

DS を import して委譲するだけの薄いラッパー（段階移行の型）は、DS と同名でも重複報告から除外され、`ℹ ラッパー（DS 委譲済み）として除外` として件数のみ表示されます。

<!-- docs-drift-ignore: PrimaryButton AppTextInput BottomSheet CandidateOverflowMenu CrisisBanner AvatarView -->
さらに、`contracts/components.json` と完全一致しない名前でも、DS 部品を連想させる命名パターン（`PrimaryButton` → `Button` / `AppTextInput` → `Input` / `BottomSheet` → `Sheet` / `CandidateOverflowMenu` → `DropdownMenu` / `CrisisBanner` → `Banner` / `AvatarView` → `Avatar` 等）は「重複の疑い」として `⚠` 付きで warn 表示されます。これは名前一致のみによる推測（AST は使いません）のため確度は下がり、`--strict` でも exit code には影響しません。誤検知の場合は無視して構いませんが、恒常的に抑制したい場合はそのファイル内のコメントに `ksk-ds-local-fallback` を含めてください。

<!-- docs-drift-ignore: CandidateOverflowMenu -->
ただし、ファイルが `ksk-design-system`（`/native` 等のサブパス含む）から named import し、その import した識別子を JSX またはコールとして実際に使っている場合は、名前が DS と異なっていても「DS 委譲ラッパー」とみなし疑い検出の対象から除外します（例: `CandidateOverflowMenu` が `DropdownMenu` を import して `<DropdownMenu>` として使うケース）。DS を import しているだけで実際には使っていない場合はこの除外の対象外です。

### Media overlay utilities

動画・写真の上に文字や操作を置く場合は、`--Text-on-Media` と `.text-on-media` / `.text-on-media-secondary`、上下の `.media-scrim-top` / `.media-scrim-bottom` を使います。TikTok / Reels 型の操作群は `MediaActionCluster` が glass ボタン、ラベル、safe-area anchor、idle auto-hide をまとめて扱います。

```tsx
import { MediaActionCluster } from "ksk-design-system"

<div className="relative">
  <div className="absolute inset-x-0 top-0 h-32 media-scrim-top" />
  <h1 className="text-on-media">メディア上のタイトル</h1>
  <MediaActionCluster
    anchor="bottom-right"
    items={[
      { label: "いいね", icon: <HeartIcon />, active: true },
      { label: "シェア", icon: <ShareIcon /> },
    ]}
  />
</div>
```

### Fullscreen screen primitives

フルスクリーン画面は `Screen` で固定高 root、本文の内部スクロール、下部 CTA の safe-area 余白をまとめて扱います。写真背景の入口画面やオンボーディングスライドは `PhotoHero` と `typo-on-image` を組み合わせます。

```tsx
import { Screen, PhotoHero, Button } from "ksk-design-system"

<Screen scroll={false} padding="none">
  <PhotoHero src="/onboarding/slide-1.jpg" overlay="dark">
    <PhotoHero.Eyebrow>さあ、始めよう</PhotoHero.Eyebrow>
    <PhotoHero.Title>ふたりの準備、ここから。</PhotoHero.Title>
    <PhotoHero.Actions>
      <Button variant="glass-inverse" className="w-full">はじめる</Button>
    </PhotoHero.Actions>
  </PhotoHero>
</Screen>
```

### Liquid Glass bottom navigation

Web のグローバルナビで iOS 26 風の Liquid Glass を使う場合は、`BottomTabBar variant="pill"` を使います。実アプリの中央 CTA は `centerAction`、ラベル付き構成は `showLabels`、暗い写真・動画・gradient 上では `tone="inverse"` を指定します。

```tsx
import { BottomTabBar } from "ksk-design-system"

<BottomTabBar
  variant="pill"
  items={[
    { label: "トーク", icon: <TalkIcon />, href: "/talk", isActive: true },
    { label: "ギャラリー", icon: <GalleryIcon />, href: "/gallery" },
  ]}
  centerAction={{ label: "作成", icon: <PlusIcon />, href: "/create" }}
  tone="inverse"
  maxWidth={430}
/>
```

`pillPosition` は実アプリでは既定の `fixed`、Storybook や mobile shell 内のデモでは `absolute` を使います。safe-area は内部で `env(safe-area-inset-bottom)` を見ます。入力フォーム画面では keyboard 表示時に被らないよう、画面側で nav を隠すか bottom action に切り替えてください。

### React Native / Expo

`ksk-design-system/native/ui` から直接 RN 用コンポーネント export（134 個）を import できます。iOS 26 の **Liquid Glass** にも対応:

```tsx
import { ThemeProvider, Button, Card, GlassView } from "ksk-design-system/native/ui"
```

```bash
# Liquid Glass を本物の UIVisualEffectView で出したい場合
npx expo install expo-glass-effect expo-blur
```

Web は backdrop-filter で擬似、Android は半透明 surface でフォールバックします。

既存コンポーネントの確認は `src/native/COMPONENT_LOOKUP.md`、Expo Router / React Navigation の tab bar、native `GlassView`、Button loading、fullscreen/media/settings/attachment/mobile shell recipes は `NATIVE_RECIPES.md` を参照してください。

## 🧪 試してみる（1コマンドお試し）

```bash
npx ksk-design-system demo
cd ksk-ds-demo
npm run dev               # → http://localhost:5173 で全プロトタイプ
# or
npm run storybook         # → http://localhost:6010 で全コンポーネントカタログ
```

`npx ksk-design-system demo my-trial` のように引数で名前指定もできます。
中身は git clone + npm install を自動でやるだけなので、もちろん手動でもOK:

```bash
git clone https://github.com/ekusiek716/ksk-design-system.git
cd ksk-design-system && npm install
```

### Notion 仕様からモック自動生成（オプション）

Claude Code をこのリポで開いて:

```
/mock https://notion.so/your-spec
# or
/mock 「ECサイトの商品詳細画面、カート追加と画像ギャラリー付き」
```

DS コンポーネントを最大限活用したモックが `src/prototypes/` に生成され、`http://localhost:5173` のプレビューに即反映されます。スクラッチで UI を組まず、既存コンポーネントを組み合わせて作るのでブレません。

## 📖 ドキュメント

- **ライブ Storybook**: https://ksk-design-system.vercel.app — 全コンポーネントのバリアント・テーマ切り替えを操作可能
- **npm**: https://www.npmjs.com/package/ksk-design-system
- 設計思想・トークン体系の詳細は `CLAUDE.md` / `DESIGN.md` を参照
- バージョンアップ時の確認事項・PR 手順は `UPDATING.md` を参照

## 📈 ダウンロード数

npm の公開統計から、インストール数を確認できます。

```bash
npm run metrics                 # 直近の DL 数・推移・バージョン別内訳を表示
npm run metrics -- --json       # 生データを JSON で出力
npm run metrics -- --range last-year
```

- リアルタイムのグラフ: https://npm-stat.com/charts.html?package=ksk-design-system
- README 冒頭のバッジは shields.io 経由で常時最新の月間 DL 数を表示

> npm は匿名集計のため、CI やミラーの重複を含む **install 回数の目安** です（ユニークユーザー数ではありません）。

## 📄 ライセンス

[MIT](./LICENSE) © 奥野圭祐 (Keisuke Okuno)
