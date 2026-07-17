# Updating Guide — `ksk-design-system` を使うプロジェクト向け

`ksk-design-system` を npm 依存として利用しているプロジェクト（消費リポ）が、
バージョンアップ時に何を確認し、どう作業すればよいかをまとめたガイド。

DS 本体側のリリース運用は [RELEASE.md](./RELEASE.md) / [PUBLISHING.md](./PUBLISHING.md)、
破壊変更の詳細は [MIGRATION.md](./MIGRATION.md) を参照。本ファイルは**消費側**の視点に特化する。

---

## 1. 前提

- `package.json` の依存は通常キャレット指定（`"ksk-design-system": "^1.x.x"`）。
  `npm install` するだけでは **patch/minor は自動では上がらない**（lockfile が既存バージョンを固定するため）。
  実際にバージョンを上げるのは `npm install ksk-design-system@latest` 等を明示的に実行したときだけ。
- したがって「アップデート」は自動で降ってくるものではなく、**意図的な PR 作業**として扱う。
  無警戒に `npm update` を通常の依存更新作業に混ぜない。

## 2. 1.x でのバージョンの読み方

[Semantic Versioning](https://semver.org/lang/ja/) に従う。`X.Y.Z` の各桁の意味:

| 種別 | 意味 | 対応要否 |
|---|---|---|
| **patch**（`X.Y.Z` の Z） | バグ修正・内部最適化のみ | 対応不要。そのまま上げてよい |
| **minor**（`X.Y.Z` の Y） | 新コンポーネント・新 prop 追加など機能追加。既存 API は壊れない想定だが、**視覚的な変更**（デフォルト値の見た目調整など）が入ることがある。まれに識別子の rename 等「要対応」の変更も minor で入る | 上げた後は画面を目視確認。**必ず [MIGRATION.md](./MIGRATION.md) の当該バージョン節を確認**する |
| **major**（`X.Y.Z` の X） | 2.0 以降、正式な破壊変更を含むリリース | [MIGRATION.md](./MIGRATION.md) 必読。codemod / 手動移行が前提 |

**実例（minor だが要対応だったケース）**: v1.34.0 で npm パッケージ名が `@ksk/design-system` → `ksk-design-system` に変更された。
機能的な破壊変更ではないため minor リリースだったが、消費側は `import` 文とpackage.json の依存名を一括置換する必要があった。
「minor だから確認不要」と決めつけず、必ず MIGRATION.md の該当バージョン節に目を通すこと。

## 3. いつ・誰が上げるか

DS メンテナが新バージョンを `npm publish` した後、`scripts/update-consumers.sh` を実行して
対象の消費リポに対して一括で bump PR を自動起票する（各リポに `chore/bump-ds-<version>` ブランチを作成し、
`package.json` の書き換え・`npm install`・commit・push・`gh pr create` まで自動で行う）。

- 対象リポの一覧は `scripts/update-consumers.sh` のデフォルト引数が正本。バージョンや対象は都度変わりうるため、本書に固定のリポ名・リポ数は書かない。
- 各消費リポ側の作業は、**起票された PR の内容を確認してマージする**こと（下記チェックリスト参照）。
- 緊急のホットフィックス（本番障害対応）の場合も同じ流れで、影響リポに絞って配布されることがある。

## 4. 手順（消費リポ側で手動アップデートする場合）

一括 PR を待たずに自分で上げる場合、または一括 PR の内容を検証する場合の手順:

```bash
# 1. 現在のバージョンと最新版を確認
npm view ksk-design-system version
cat node_modules/ksk-design-system/package.json | grep '"version"'

# 2. 作業ブランチを切る
git checkout -b chore/bump-ds-<version>

# 3. 最新化
npm install ksk-design-system@latest
# 特定バージョンを指定する場合:
# npm install ksk-design-system@1.44.0

# 4. 非推奨 API の残存を検査（read-only。書き換えは行わない）
npx ksk-design-system check-migration ./src

# 5. 検出があれば MIGRATION.md を確認し、必要に応じて codemod を適用
npx ksk-design-system codemod vX-to-vY ./src --dry   # まず dry-run
npx ksk-design-system codemod vX-to-vY ./src         # 問題なければ適用
git diff   # 意図通りか必ず目視確認

# 6. ビルド・lint・テスト
npm run build
npm run lint
npm test

# 7. 目視確認（視覚変更があり得る minor 以上は特に）
npm run dev   # または storybook 等、対象プロジェクトの起動コマンド

# 8. commit / push / PR
git add package.json package-lock.json
git commit -m "chore: ksk-design-system を <version> に更新"
git push -u origin chore/bump-ds-<version>
gh pr create
```

手動移行が必要な項目（codemod で拾いきれないもの）は [MIGRATION.md](./MIGRATION.md) の
「移行作業の進め方」節を参照。

## 5. していい・ダメ早見表

| していい | ダメ |
|---|---|
| `^1.x.x` のようなキャレット指定で依存を宣言する | `"*"` や `"latest"` で依存バージョンを固定禁止にする（意図しない破壊変更を無警戒に取り込む） |
| `npm install ksk-design-system@latest` で明示的に更新する | `node_modules/ksk-design-system` の中身を直接編集する（次の `npm install` で消え、変更が誰にも共有されない） |
| アップデート専用の PR（`chore/bump-ds-*`）を切る | 機能開発 PR に依存バージョン更新を混ぜる（レビューが困難になり、ロールバック時に機能ごと戻ってしまう） |
| `npx ksk-design-system check-migration ./src` で非推奨 API の残存を確認する | 警告を無視して非推奨 API を放置したままメジャーへ上げる |
| MIGRATION.md を確認してから minor/major を上げる | バージョン種別だけを見て「minor だから安全」と確認を省略する |

## 6. トラブル時

### ロールバック

問題が出た場合は前バージョンに戻す:

```bash
npm install ksk-design-system@<前のバージョン>
git diff package.json package-lock.json   # 意図通り戻ったか確認
```

戻した後は、DS 側の Issue に再現手順を添えて報告する（下記「Issue 起票先」参照）。

### npm キャッシュが反映されない

`npm view ksk-design-system version` で最新バージョンが取得できない、
または `npm install` 後もバージョンが変わらない場合:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### peer dependency 警告

`npm install` 時に React / Tailwind CSS のバージョン不一致警告が出ることがある。
`package.json#peerDependencies` の範囲を確認し、警告の対象パッケージ自体を先に更新してから
`ksk-design-system` を上げる。警告を `--force` / `--legacy-peer-deps` で握りつぶして進めない。

### Issue 起票先

DS 本体のバグ・想定外の破壊変更に遭遇した場合は、
`ksk-design-system` リポジトリ（[GitHub](https://github.com/ekusiek716/ksk-design-system)）に Issue を起票する。
再現手順・バージョン（更新前後）・エラーメッセージを添えること。

## 7. 関連ドキュメント

| ファイル | 役割 |
|---|---|
| [RELEASE.md](./RELEASE.md) | DS 側のリリースサイクル・運用ルール（メンテナ向け） |
| [PUBLISHING.md](./PUBLISHING.md) | DS 側の公開・配布手順（`npm publish` 〜 `update-consumers.sh`。メンテナ向け） |
| [MIGRATION.md](./MIGRATION.md) | バージョン間の変更点・破壊変更の詳細（消費側が上げる際に必読） |
| **本ファイル（UPDATING.md）** | 消費側がアップデート PR をどう作業するかの手順書 |
