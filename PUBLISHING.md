# Publishing — `ksk-design-system`

`ksk-design-system` のリリース・配布手順。

> **配布方式**: v1.36.0 以降は npm レジストリ経由で配布する。
> 公開経路は `.github/workflows/publish.yml` の Trusted Publishing (OIDC) に
> 一本化しており、`main` への version 変更 push が公開の唯一のトリガー。
> 各消費リポジトリの `package.json` は `ksk-design-system@X.Y.Z` を参照する。
> 対象の消費リポ一覧は `scripts/update-consumers.sh` の `DEFAULT_REPOS` が正本
> （単体リポ・monorepo が混在し、`~/LocalDev/` と `~/LocalDev/Examination/` 配下にまたがる）。

## 前提

- main ブランチが clean (`git status` で何もない)、リモートと一致
- 消費リポが `~/LocalDev/<name>` に clone 済みで、`gh` CLI が使えること（PR 自動作成に使用）

## 最短手順（推奨）

```bash
# release branch で package.json / package-lock.json の version を更新し、
# node scripts/sync-version.mjs を実行して contracts/components.json の
# meta.version・contracts/token-hex-cache.json を追従させる（issue #259）
# PR を main にマージ（このブランチではタグは作らない・push もしない）

# マージ後の main HEAD の commit SHA に紐づく run が出るまで待ってから watch する。
# --branch=main --limit=1 だけだと GitHub Actions のインデックス遅延時に
# 直前の（無関係な）run を掴んで誤って「成功」判定してしまうため（issue #269 レビュー指摘）、
# 必ず --commit で今回の SHA を指定する。
MERGE_SHA="$(git rev-parse origin/main)"
RUN_ID=""
for i in $(seq 1 20); do
  RUN_ID="$(gh run list --workflow=publish.yml --commit "$MERGE_SHA" --limit=1 \
    --json databaseId --jq '.[0].databaseId')"
  [ -n "$RUN_ID" ] && break
  sleep 5
done
gh run watch "$RUN_ID" --exit-status
```

main への version 変更を `.github/workflows/publish.yml` が検知し、npm Trusted
Publishing (OIDC) で以下を自動実行する:

1. npm 上の最新版と `package.json` の version を比較
2. `npm ci`
3. `npm publish`（prepack で `dist/` を生成）
4. `vX.Y.Z` tag と GitHub Release を作成

公開後、レジストリ反映を確認してから消費リポへ配布する:

```bash
npm view ksk-design-system@<version> version --json
npm dist-tag ls ksk-design-system
bash scripts/update-consumers.sh <version>
```

PR では `npm run check`、`npm test`、`npm pack --dry-run` を通してからマージする。
ローカルでワンライナーとして回したい場合は `bash scripts/release.sh <version>` を使う
（version bump・push・publish.yml 完了待ち・consumers 配布まで一括。publish 自体は
このスクリプトもローカルでは行わず、push 後に publish.yml の Trusted Publishing に委ねる）。

> v1.35.0 で旧名 `@ksk/design-system` 互換 tgz の生成は廃止。
> 消費5リポ + todo-shared が新名 `ksk-design-system` に移行済。
> 旧名復活が必要になった場合は git history で v1.35.0 期の release.sh を参照。

個別に手作業したい場合は以下の手動フローを参照。

## リリースフロー（手動）

### 1. ローカルで動作確認

```bash
npm run check         # tsc + lint + deps + drift + lookup
npm test              # vitest スイート
npm run storybook     # 目視確認（特に新機能のストーリー）
```

すべて green であること。失敗があれば修正してコミット。

### 2. バージョン更新

```bash
# patch (bug fix)        例: 1.15.2 → 1.15.3
npm version patch --no-git-tag-version

# minor (feature add, 互換あり) 例: 1.15.2 → 1.16.0
npm version minor --no-git-tag-version

# major (破壊変更)        例: 1.15.2 → 2.0.0
npm version major --no-git-tag-version
```

**タグ・コミットは作らない（`--no-git-tag-version`）。** タグ・GitHub Release
の作成は必ず `.github/workflows/publish.yml` に任せる（issue #269 レビュー
指摘）。ローカルで `npm version` の既定動作（タグ作成 + コミット）を使って
`git push --tags` すると、CI（publish.yml）より先にタグが公開リポジトリに
届いてしまい、publish.yml がタグ既存と判定して GitHub Release の作成を
スキップしてしまう。

`--no-git-tag-version` を付けても `"version"` ライフサイクル
（`scripts/sync-version.mjs`）は変わらず発火し、`contracts/components.json` の
`meta.version` と `contracts/token-hex-cache.json` を新バージョンに同期して
`git add` する（`--no-git-tag-version` が省略するのは git のコミット・タグ
作成だけ）。手動更新は不要。同期後、`package.json`（および変更されていれば
`package-lock.json`）を含めて自分でコミットする:

```bash
git add package.json package-lock.json
git commit -m "chore(release): vX.Y.Z"
```

`npm version` を使わない bump 経路（release PR で `package.json` を直接
書き換える等）の場合は、コミット前に `node scripts/sync-version.mjs` を単体実行する。

`dist/` の再ビルド・コミットはこの version bump のタイミングでのみ行う。

### 3. pack で中身確認（publish はしない）

```bash
npm pack --dry-run
```

公開経路は `.github/workflows/publish.yml` の Trusted Publishing に一本化した
（下記「npm 公開について」参照）。ローカルから `npm publish` を直接実行する
経路は廃止した。ここでは `npm pack --dry-run` で公開物の中身だけ確認する。
実際の publish は次の push で CI が行う。`prepack` フックで `npm run build:lib`
が自動実行され、公開パッケージに入る `dist/` / `contracts/` / `tokens.json` /
docs の中身が更新される。

中身を確認したい場合:

```bash
npm pack --dry-run | tail -50
```

公開ファイル一覧を確認。`package.json#files` で許可した中身だけが入っているはず:
- `dist/`
- `bin/`
- `templates/`
- `contracts/`
- `eslint/`
- `scripts/codemod/`
- `src/preset.css` / `src/styles/` / `src/themes/`
- `tokens.json`
- `AGENTS.md` / `CLAUDE.md` / `MIGRATION.md` / `PUBLISHING.md` / `RELEASE.md`
- `src/components/COMPONENT_LOOKUP.md`

### 4. push

```bash
git push origin main
```

`--tags` は付けない。タグ・GitHub Release は push 後に publish.yml が作成する。

### 5. 消費リポへ配布

```bash
# 全リポ一括
bash scripts/update-consumers.sh 1.16.0

# 特定リポのみ
bash scripts/update-consumers.sh 1.16.0 belle-todo pawly
```

各消費リポで `chore/bump-ds-<version>` ブランチを切り、`package.json` の
`ksk-design-system` 参照書換・`npm install`・commit・push・PR 作成まで自動で行う。
失敗したリポはスキップされ最後にまとめて報告されるので、個別にリトライする。

### 6. PR マージ

各消費リポの PR で CI が green なことを確認してマージ。
破壊変更を含む場合は、全リポ一括でなく 1〜2 リポで先に動作確認してから残りを配布する。

## 緊急ホットフィックス

本番障害時の応急対応:

```bash
# main から直接でも OK（hotfix ブランチを切る暇がない時）
# 修正コミット
git commit -m "fix: 重大なバグの説明"

npm version patch --no-git-tag-version  # sync-version.mjs が自動で追従・git add（タグ/コミットは作らない）
git add package.json package-lock.json && git commit -m "chore(release): vX.Y.Z"
git push origin main  # --tags なし。publish.yml が npm publish・タグ・GitHub Release を自動実行
npm view ksk-design-system@<version> version  # 反映確認
bash scripts/update-consumers.sh <version> <影響リポ...>
```

修正コミットの背景・影響範囲を `RELEASE.md` の「ホットフィックス履歴」セクションに必ず追記。

## バージョニング規約

`ksk-design-system` は [Semantic Versioning](https://semver.org/lang/ja/) に従う:

| 種類 | 内容 | 例 |
|---|---|---|
| patch | バグ修正・内部最適化 | 1.15.2 → 1.15.3 |
| minor | 新コンポーネント追加・新 prop 追加（既存壊さない） | 1.15.x → 1.16.0 |
| major | 既存 prop 削除・コンポーネント rename・default 値変更 | 1.x → 2.0.0 |

破壊変更時は `scripts/codemod/` に migration script を必ず添える。
`MIGRATION.md` に rename テーブル / before-after を文書化。

## 注意

- 配布前に必ず `npm pack --dry-run` で中身確認
- 公開経路は `.github/workflows/publish.yml` の Trusted Publishing (OIDC) に一本化。
  `scripts/release.sh` を含め、ローカルから `npm publish` を直接叩く経路はない
  （`npm login` / `NPM_TOKEN` は不要）
- `package.json#exports` を変更したら必ず利用側プロジェクトでの import を試す
- 金曜午後のリリースは厳禁（週末に障害対応できない）
- メジャーリリースは月初の月曜が望ましい（フィードバック収集期間が取れる）

## npm 公開について

v1.36.0 以降は npm registry 経由配布。公開経路は
`.github/workflows/publish.yml` と npm Trusted Publishing (OIDC) に一本化した
（issue #259）。長寿命の `NPM_TOKEN` やローカルの `npm login` は不要で、
`scripts/release.sh` を含めローカルから `npm publish` を直接実行する経路はない。
push 後は publish.yml の完了を待ち、レジストリ反映を確認してから consumers へ配布する。

## 緊急時（publish.yml が失敗した場合）

**ローカルから `npm publish` する break-glass 経路は用意していない**
（`scripts/release.sh` と本ドキュメントの記述を issue #269 レビューで統一）。
publish.yml が失敗・スタックした場合の実行可能な手順は次の2つのみ:

1. **workflow_dispatch で再実行する**（推奨）:
   ```bash
   gh workflow run publish.yml --ref main
   # または GitHub Actions の UI から Publish workflow → Run workflow
   ```
   `package.json` の version が npm 上の最新版より新しければ、再実行のたびに
   `npm publish` を試みる（`publish.yml` 内の version 比較ロジックが冪等性を担保）。
2. 失敗の原因（OIDC 設定・npm 側障害等）を取り除いてから 1 を実行する。

それでも解消しない場合は、npm 側の障害か Trusted Publishing 設定（npmjs.com の
Trusted Publisher 登録）を疑い、対応後に再度 workflow_dispatch で実行する。

## 関連

- [UPDATING.md](./UPDATING.md) — 消費側（DS を npm 依存に持つプロジェクト）向けのアップデート手順
