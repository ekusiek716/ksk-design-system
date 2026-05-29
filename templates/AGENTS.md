<!--
  このファイルは @ksk/design-system の postinstall で自動設置されました。
  最新ルールを取り込むには: npx ksk-ds init --force
-->

# このプロジェクトは @ksk/design-system に準拠する

Codex（および他の AI エージェント）は UI 作業を始める前に、以下のファイルを**必ず**読み込むこと。

## 必読ファイル（node_modules 配下）

| ファイル | 内容 |
|---------|------|
| `node_modules/@ksk/design-system/AGENTS.md` | DS 全体のルール・禁止パターン |
| `node_modules/@ksk/design-system/contracts/components.json` | 全コンポーネントの定義・バリアント |
| `node_modules/@ksk/design-system/contracts/rules.json` | 禁止パターン31件・AIアンチパターン9件 |
| `node_modules/@ksk/design-system/tokens.json` | カラー・余白・角丸・影・タイポ |
| `node_modules/@ksk/design-system/src/components/COMPONENT_LOOKUP.md` | 全コンポーネントのバリアント・インポートパス一覧 |

> DS 側のルール更新は `npm update @ksk/design-system` で自動反映されます。このファイルは書き換え不要。

## 書く前に必ず確認するパターン

| 書こうとしているもの | 代わりに使うもの |
|-------------------|----------------|
| カスタムカラー（`#xxxxxx` / `rgba(...)` ハードコード） | `var(--Brand-Primary)`, `var(--Surface-*)` 等のセマンティックトークン |
| カスタム余白（`margin: 17px` 等の非トークン値） | Tailwind の標準スペーシング（`p-4`, `gap-2` 等） |
| カスタム角丸（`rounded-md`, `rounded-xl` 等） | `rounded-none/sm/lg/2xl/full` のみ使用可 |
| カスタム影（`shadow-md` 以上） | `shadow-[var(--shadow-md)]`, `shadow-[var(--shadow-dialog)]` |
| `font-bold` / `font-semibold` 等の個別指定 | `typo-*` クラス（`typo-heading-md`, `typo-label-sm` 等） |
| `<button>` / `<input>` / `<a href>` 生タグ | `<Button>`, `<Input>`, `<Button variant="link">` |
| `text-white` / `bg-white` / Tailwind標準色 | `text-[var(--Text-on-Inverse)]`, `bg-[var(--Surface-Primary)]` |
| グラデーション（`bg-gradient-to-*`） | 単色背景 `bg-[var(--Surface-*)]` |
| カラーバー（`border-t-4` 等の太ボーダー） | 全周ボーダー `border border-[var(--Border-Low-Emphasis)]` |

DS に該当パターンが無い場合のみカスタム実装を許可。その場合は**必ずコメントで理由を記載**すること。

## 新規コンポーネントを作る前に必ず確認する

**`node_modules/@ksk/design-system/src/components/COMPONENT_LOOKUP.md` を読んでから実装・提案すること。**
以下は「DSにない」と誤解されやすいが既に存在するもの:

| やりたいこと | 正しい使い方 |
|---|---|
| アイコンだけのボタン | `<Button size="icon">` / `"icon-sm"` / `"icon-lg"` |
| リンク見た目のボタン | `<Button variant="link">` |
| チェックボックス | `<Checkbox>` |
| ラジオボタン | `<RadioGroup><RadioGroupItem>` |
| Badge の色違い | `<Badge variant="success">` / `"caution"` / `"warning"` / `"info"` |
| 空状態の表示 | `<EmptyState>` |
| 数値カード | `<StatCard>` |
| トースト通知 | `<Toaster>` + `useToast()` |
| スケルトン | `<Skeleton>` |
| 下部ナビゲーション | `<BottomTabBar>` |
| プログレスバー | `<Progress>` |
| フォームフィールド | `<FormField>` |
| ケバブメニュー | `<KebabMenu>` |
| モーダル（PC） | `<Dialog>` |
| ドロワー（モバイル） | `<Sheet side="bottom">` |
| PC/モバイル自動切替モーダル | `<ResponsiveDialog>` |

## 使用方法

### CSS のセットアップ

```css
/* globals.css / app.css など */
@import "@ksk/design-system/preset";          /* DS のトークン・スタイル */
@import "@ksk/design-system/themes/default";  /* または orange / green / violet */
@import "tailwindcss";
```

### コンポーネントの使用

```tsx
import { Button, Card, Input, FormField } from "@ksk/design-system"
```
