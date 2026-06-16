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
- **110 コンポーネント** — 汎用 UI 55 / EC 系 11 / 管理画面系 8 / レイアウトシェル 3 / 汎用パターン 33

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

```css
/* プロジェクトの CSS */
@import "@ksk/design-system/preset";
@import "./themes/my-client.css"; /* Brand 色を差し替えたテーマ */
```

```tsx
import { Button, Card, Input, FormField } from "@ksk/design-system"
```

新規クライアント案件では、テーマファイルで `--Primitive-Brand-500` などブランドカラーの 10 行を定義するだけで、全コンポーネントがそのブランドカラーで動作します。

> **インストールについて**: 現在は npm 未公開です。まずは上のライブ Storybook でコンポーネントと挙動をご確認ください。npm パッケージとしての配布を準備中です。

## 📖 ドキュメント

- **ライブ Storybook**: https://ksk-design-system.vercel.app — 全コンポーネントのバリアント・テーマ切り替えを操作可能
- 設計思想・トークン体系の詳細は `CLAUDE.md` / `DESIGN.md` を参照

## 📄 ライセンス

[MIT](./LICENSE) © 奥野圭祐 (Keisuke Okuno)
