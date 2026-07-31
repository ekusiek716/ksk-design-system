# Release Cadence — `ksk-design-system`

`ksk-design-system` のリリーススケジュール・運用ルール。

## 通常リリースサイクル

| 種類 | 頻度 | 曜日 |
|---|---|---|
| patch | 必要時 | 制限なし |
| minor | 隔週目安 | 制限なし |
| major | 四半期 | 月初の月曜 |

## メジャーリリースの段取り

メジャー (`vX → vX+1`) は破壊変更を含むため、最低 4 週間前から計画する:

```
T-4w  破壊変更内容の確定 → MIGRATION.md 草案作成
T-3w  scripts/codemod/vX-to-vY.mjs を実装、利用側で dry-run 検証
T-2w  RC 版を 1〜2 の消費リポへ先行配布、動作確認
T-1w  feedback 反映、ESLint 旧 API ルールを "error" に昇格
T-0   全消費リポへ配布 (update-consumers.sh)、リリースノート公開、社内告知
T+1w  次の patch で旧 API を完全削除
```

## version bump の自動同期（issue #259）

`npm version <level>` を実行すると npm の `"version"` ライフサイクルで
`scripts/sync-version.mjs` が自動発火し、以下を同期する:

- `contracts/components.json` の `meta.version` を新バージョンに更新
- `contracts/token-hex-cache.json` の再生成

この lifecycle は `--no-git-tag-version` を付けても変わらず発火する
（`--no-git-tag-version` が省略するのは git のコミット・タグ作成だけ）。
`npm version` を使わない手動 bump（release PR で `package.json` の version を
直接書き換える方式など）の場合は、コミット前に単体実行すること:

```bash
node scripts/sync-version.mjs
```

変更があったファイルは自動で `git add` される（コミットは自分で行う）。

**タグ・GitHub Release の作成は必ず publish.yml に任せ、ローカルでは作らない
（issue #269 レビュー指摘）。** `npm version` の既定動作（ローカルタグ作成 +
コミット）をそのまま使って `git push --tags` すると、publish.yml（CI）より
先にタグが公開リポジトリに届いてしまい、publish.yml がタグ既存と判定して
GitHub Release の作成をスキップしてしまう。そのため:

- ローカルでは `npm version <level> --no-git-tag-version` を使う（タグ・コミットなし）
- `sync-version.mjs` が git add した変更 + `package.json` を自分でコミット
- `git push origin main`（`--tags` は付けない）
- タグ・GitHub Release は push 後に publish.yml が作成する

`scripts/release.sh` はこのフローをすでに組み込み済み。

## ホットフィックス手順

本番障害が発生したら:

1. main で直接修正（or hotfix ブランチ）
2. `npm version patch --no-git-tag-version`（`sync-version.mjs` が自動で追従・git add まで実行）
3. `git add package.json package-lock.json` して修正コミットにまとめる
   （`npm version` は `--no-git-tag-version` でも `package-lock.json` を更新するため、
   ステージし忘れると `npm ci` が古い依存スナップショットを使ってしまう）
4. `git push origin main`（`--tags` は付けない）→ `.github/workflows/publish.yml` の
   Trusted Publishing が npm publish・タグ・GitHub Release 作成を自動実行
5. 公開を確認: `npm view ksk-design-system@<version> version` →
   `bash scripts/update-consumers.sh <version> <影響リポ...>`
6. 影響範囲・原因・修正内容を「ホットフィックス履歴」に記録
7. ポストモーテムを Issue / wiki に書く

ローカルから `npm publish` を直接叩く経路は廃止した（publish.yml への一本化。
下記参照）。

## ホットフィックス履歴

| 日付 | バージョン | 内容 | 影響 |
|---|---|---|---|
| 2026-05-30 | v1.21.2 | Sheet (`side="bottom"` / `swipeToClose` / `bottom-glass`) が仮想キーボード表示時にシート上端を画面外へ出さないよう `visualViewport` 監視で修正（PR #12） | モバイルの入力付きボトムシートでタイトル/ドラッグハンドルが隠れる不具合を解消 |
| 2026-06-13 | v1.31.1 | `.glass-specular > *` が**絶対配置の子要素**の `position`/`z-index` を踏み潰す問題を `:not(.absolute):not(.fixed):not(.sticky)` 除外で修正 | glass 面に重ねた絶対配置オーバーレイ（閉じる × 等）が consumer 側の `absolute`/`z-*` を奪われ角からはみ出す不具合を解消 |
| 2026-07-27 | v1.48.2 | native Button `elevation="raised"` の押下で `borderBottomWidth` を 0 にし `marginBottom` で補填していたため、`minHeight` で高さが決まるボタンでは行が 4px 伸びて周囲の UI 全体が下にずれる問題を修正。exam-kit の PrimaryButton と同じ「下辺の太さは維持し押下時は色だけ透明」方式に統一 | 3D ボタンを押すたびに画面がガタつく不具合を解消。押下前後でレイアウト寸法が完全に不変になった |
| 2026-07-27 | v1.48.1 | native の Modal 系オーバーレイ（Sheet plain/snap・Celebration overlay・emoji bounce）で、Modal 表示前に入口アニメーションを開始すると要素が不可視位置に残る問題を onShow 起点＋二重 fallback で修正（#250）。併せて snap sheet の gesture 状態バグ 3 件（アニメ中の再ドラッグでパネルが飛ぶ／再オープン時に下スワイプが効かない／`dismissible`・`onClose` が初回 render のまま固定）を修正 | iOS 実機で「透明なオーバーレイだけが残り操作不能」になる進行不能バグを解消。#249 で snap sheet のみ対処した同一原因が plain sheet と Celebration に残っていた |

新しいホットフィックスがあれば追記する。

## リリースノート書き方

GitHub Releases にコピペできるテンプレ:

```md
## v1.16.0 (2026-MM-DD)

### Features
- Button: `inverse` / `ghost-inverse` バリアント追加（暗背景上の CTA 用）
- Button: `hero` サイズ追加（hero / final-CTA 専用ピル型）
- Checkbox: `label` / `description` / `count` props でポリモーフィック化

### Fixes
- ...

### Docs
- ...

### Migration
- 破壊変更なし。npm package version の更新 PR（update-consumers.sh が自動作成）をマージするだけで OK。
```

破壊変更がある場合は必ず:

```md
### Breaking Changes
- `OldComponent` を削除。`NewComponent` を使ってください。<!-- docs-drift-ignore: OldComponent NewComponent -->
  自動移行: `npx ksk-design-system codemod vX-to-vY ./src`
- 詳細: [MIGRATION.md](./MIGRATION.md)
```

## 関連

- [PUBLISHING.md](./PUBLISHING.md) — 実際の手順
- [MIGRATION.md](./MIGRATION.md) — メジャー毎の移行ガイド
- [scripts/codemod/README.md](./scripts/codemod/README.md) — codemod 雛形と使い方
- [UPDATING.md](./UPDATING.md) — 消費側（DS を npm 依存に持つプロジェクト）向けのアップデート手順
