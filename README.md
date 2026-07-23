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

**Peer dependencies**: `react` 18 or 19, `react-dom`, `tailwindcss` ^4

## 🚀 使い方

### Web (Next.js / Vite / 任意の React 環境)

```bash
npm install ksk-design-system
```

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

```tsx
import { Button, Card, Input, FormField } from "ksk-design-system"
```

新規クライアント案件では、テーマファイルで `--Primitive-Brand-500` などブランドカラーの 10 行を定義するだけで、全コンポーネントがそのブランドカラーで動作します。

### Consumer lint

consumer 側のローカル grep script が古くならないよう、DS 本体から `contracts/rules.json` を読む lint CLI を同梱しています。

```bash
npx ksk-ds lint src
npx ksk-ds lint src --format json
npx ksk-ds lint --changed
```

出力は `file:line rule severity fix` を含みます。どうしても DS で表現できない domain-specific UI は、理由付きの escape コメントを置きます。

```tsx
// ksk-ds-allow-custom-ui: medical chart requires bespoke interaction
```

### Consumer duplicate check

DS に存在する部品を consumer 側で再実装しないよう、コンポーネント名の重複検査を同梱しています。

```bash
npx ksk-ds check-duplicates
npx ksk-ds check-duplicates ./src --strict
```

既定は助言モードで終了コード 0、`--strict` は重複候補があると終了コード 1 です。正本は同梱の `contracts/components.json` であり、consumer 側に別の「昇格候補台帳」を作らないでください。

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
