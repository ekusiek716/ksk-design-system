# このプロジェクトは @ksk/design-system を使っている

Claude Code へ: このファイルを読んだら、以下の「必読ファイル」を順番に読んでからUIの実装に入ること。

---

## セットアップ状況

このプロジェクトは `@ksk/design-system` に依存している。
DSのファイルを直接コピーして使うのではなく、以下のいずれかの方法で参照している:

**ローカル開発中（npm link）:**
```
node_modules/@ksk/design-system/ → /path/to/ksk-design-system/ にシンボリックリンク
```

**本番・CI（npm install）:**
```
node_modules/@ksk/design-system/ に実体がある
```

どちらの場合も `node_modules/@ksk/design-system/` を参照すること。DSのファイルをプロジェクト内にコピーしない。

---

## 必読ファイル（UIを触る前に必ず読む）

```
node_modules/@ksk/design-system/CLAUDE.md                         # ルール全体・禁止パターン
node_modules/@ksk/design-system/contracts/rules.json              # 禁止31件・AIアンチパターン9件
node_modules/@ksk/design-system/contracts/components.json         # 全64コンポーネント定義
node_modules/@ksk/design-system/tokens.json                       # カラー・余白・角丸・影
node_modules/@ksk/design-system/src/components/COMPONENT_LOOKUP.md  # バリアント・インポートパス一覧
```

---

## 鉄則（これだけ守れば大体OK）

| やってはいけないこと | 正しい方法 |
|---|---|
| `#3B82F6` 等のHEXをそのまま書く | `var(--Brand-Primary)` を使う |
| `<button>` `<input>` `<a href>` を直接書く | `<Button>` `<Input>` `<Button variant="link">` を使う |
| `font-bold` `font-semibold` を書く | `typo-heading-md` `typo-label-sm` 等を使う |
| `bg-white` `text-gray-500` 等のTailwind標準色を使う | `bg-[var(--Surface-Primary)]` `text-[var(--Text-Medium-Emphasis)]` を使う |
| `rounded-md` `rounded-xl` を使う | `rounded-sm`(4px) / `rounded-lg`(8px) / `rounded-2xl`(16px) / `rounded-full` のみ |
| `border-t-4` でカラーバーをつける | 全周ボーダー + Badge でステータスを表現 |
| `bg-gradient-to-*` でグラデーションをかける | 単色背景を使う |

---

## コンポーネントのインポート

```tsx
import { Button, Card, Input, FormField } from "@ksk/design-system"
```

コンポーネントを作る前に `COMPONENT_LOOKUP.md` で同等品がないか確認すること。64個ある。

---

## CSSのセットアップ（まだの場合）

```css
/* globals.css / app.css など */
@import "@ksk/design-system/preset";
@import "@ksk/design-system/themes/default";  /* または orange / green / violet */
@import "tailwindcss";
```

---

## DSを更新したいとき

DSのコードを直接このプロジェクト内で編集しない。
`node_modules/@ksk/design-system/` はDSリポジトリ側で管理されている。

変更が必要なら:
1. DSリポジトリ（`ksk-design-system/`）で修正・コミット
2. このプロジェクトで `npm update @ksk/design-system`（publishされている場合）
   または npm link なら自動反映
