<!--
  このファイルは `npx ksk-ds init` で設置されました。
  最新ルールを取り込むには: npx ksk-ds init --force
-->

# このプロジェクトは ksk-design-system に準拠する

<!-- docs-sync-ignore -->
Codex（および他の AI エージェント）は UI 作業を始める前に、以下のファイルを**必ず**読み込むこと。

## 必読ファイル（node_modules 配下）

| ファイル | 内容 |
|---------|------|
<!-- docs-sync-ignore -->
| `node_modules/ksk-design-system/AGENTS.md` | DS 全体のルール・禁止パターン |
| `node_modules/ksk-design-system/contracts/components.json` | 全コンポーネントの定義・バリアント |
| `node_modules/ksk-design-system/contracts/rules.json` | 禁止パターン・AIアンチパターン（正本: rules.json） |
| `node_modules/ksk-design-system/tokens.json` | カラー・余白・角丸・影・タイポ |
| `node_modules/ksk-design-system/contracts/token-hex-cache.json` | semantic トークンのデフォルトテーマ解決済み hex（テーマ依存キーは meta.themeDependentKeys 参照） |
| `node_modules/ksk-design-system/src/components/COMPONENT_LOOKUP.md` | 全コンポーネントのバリアント・インポートパス一覧 |
| `node_modules/ksk-design-system/contracts/screen-patterns.json` | 画面実装前にどのシェル/パターンを使うかの decisionTree |
| `node_modules/ksk-design-system/contracts/composition.json` | 選んだパターン内部の並べ方（骨格・余白・階層・CTA優先度。screen-patterns.json と対で読む） |

> DS 側のルール更新は `npm update ksk-design-system` で自動反映されます。このファイルは書き換え不要。

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

**`node_modules/ksk-design-system/src/components/COMPONENT_LOOKUP.md` を読んでから実装・提案すること。**

### ローカル二重実装ゲート

DS に無いと思っても consumer 側に別台帳を作らないこと。最初に
`node_modules/ksk-design-system/contracts/components.json` と `COMPONENT_LOOKUP.md` を検索し、
`npx ksk-ds check-duplicates ./src --strict` を実行する。それでも不足する場合は DS 側に issue を登録する。
やむを得ない一時実装には、削除条件と issue を
`// ksk-ds-local-fallback: DS に X が追加されたら削除 (issue #123)` の形式で残すこと。

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

## DS公開通知

DSへ依頼するときは、DSの通常issueとappの取り込み待ち通常issueを作成する。DS正本の作業ブランチで `node bin/init.js register-consumer-request --ds-issue N --consumer-issue URL` を実行し、台帳変更をPRに含める。未公開CLIで古いnpm版を起動しないようsourceのコマンドを使う。公開済みCLIでは `npx ksk-ds register-consumer-request` も同じ引数で使える。

登録CLIは既存のgh認証で両issueを確認し、app issueへ `ds:waiting` を自動付与する。closedまたは `ds:released` のissueは降格させない。修正PR作成後は同じコマンドに `--fix-pr N` を付けて紐付ける。省略時は既存fixPrを維持し、累積台帳を削除しない。`--dry-run` は通信・書き込みなしのローカルプレビューで、issue実在や権限は確認しない。失敗は非zero。台帳保存後のラベル失敗は同じコマンドで再試行する。

公開通知はDSの一括bump（`scripts/update-consumers.sh VERSION`）時だけ実行する。公開版に修正が含まれることを確認し、bump PR付きの通知と `ds:released` を付ける。6時間pollingとapp側workflow/scriptは廃止し、`init-release-notices` は移行案内を出して停止する。app側の取り込み・動作確認が完了するまで追従issueは閉じない。詳しくは [公開通知手順](https://github.com/ekusiek716/ksk-design-system/blob/main/docs/consumer-release-notices.md) を参照。

同じapp issueに複数のDS依頼がある場合、公開台帳内の該当依頼がすべて公開・通知済みになるまで `ds:waiting` を残す（`ds:released` と併存する場合あり）。通知はrepo owner本人 `ekusiek716` のPAT認証が前提。通知失敗時は既存bump PRを保持して同じversion・対象repoの一括bumpを再実行し、通知runtime単独実行・並列実行はしない。

## 使用方法

### CSS のセットアップ

```css
/* globals.css / app.css（CSS の場所に応じて ../../ の数を調整） */
@import "tailwindcss";
@import "ksk-design-system/preset";          /* DS のトークン・スタイル */
@import "ksk-design-system/themes/default";  /* または orange / green / violet */
@source "../../node_modules/ksk-design-system/dist";
```

`@source` は必須です。Tailwind CSS v4 は `node_modules` を既定では走査しないため、
省略すると DS 内部だけで使うクラスが生成されず、表示や操作が崩れます。

### コンポーネントの使用

```tsx
import { Button, Card, Input, FormField } from "ksk-design-system"
```
