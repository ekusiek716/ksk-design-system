# KSK Design System

複数クライアント案件を **1つのデザインシステム** で高速に回すために設計された、React 製のマルチテーマ対応 UI ライブラリ。BtoB / SaaS の信頼感と EC / BtoC の購買体験、2つのドメインの設計思想を統合しています。

**🔗 ライブ Storybook → https://ksk-design-system.vercel.app**

110 コンポーネントを実際に操作・確認できます。

---

## ✨ 特徴

- **マルチテーマ** — Brand 色の 10 行を差し替えるだけで、全コンポーネントの見た目が自動で切り替わる（Primitive → Semantic → Bridge の 3 層トークン構造）
- **アクセシブル** — shadcn/ui（Radix UI ベース）+ `@storybook/addon-a11y` で a11y を担保
- **Tailwind CSS v4 ネイティブ** — `@theme` ベースのトークン設計
- **型安全** — React 19 + TypeScript、CVA によるバリアント管理
- **110 + 91 コンポーネント** — Web 110（UI 55 / EC 11 / 管理 8 / シェル 3 / パターン 33）+ React Native 91
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

**Peer dependencies**: `react` 18 or 19, `react-dom`, `tailwindcss` ^4, `radix-ui`, `@radix-ui/react-slot`, `iconsax-reactjs`

## 🚀 使い方

### Web (Next.js / Vite / 任意の React 環境)

```bash
npm install ksk-design-system
```

```css
/* プロジェクトの CSS */
@import "ksk-design-system/preset";
@import "./themes/my-client.css"; /* Brand 色を差し替えたテーマ */
```

```tsx
import { Button, Card, Input, FormField } from "ksk-design-system"
```

新規クライアント案件では、テーマファイルで `--Primitive-Brand-500` などブランドカラーの 10 行を定義するだけで、全コンポーネントがそのブランドカラーで動作します。

### React Native / Expo

`ksk-design-system/native/ui` から直接 RN 用コンポーネント（91 個）を import できます。iOS 26 の **Liquid Glass** にも対応:

```tsx
import { ThemeProvider, Button, Card, GlassView } from "ksk-design-system/native/ui"
```

```bash
# Liquid Glass を本物の UIVisualEffectView で出したい場合
npx expo install expo-blur
```

Web は backdrop-filter で擬似、Android は半透明 surface でフォールバックします。

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

## 📄 ライセンス

[MIT](./LICENSE) © 奥野圭祐 (Keisuke Okuno)
