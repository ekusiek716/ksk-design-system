# Publishing — `ksk-design-system`

`ksk-design-system` のリリース・配布手順。

> **配布方式**: v1.36.0 以降は npm レジストリ経由で配布する。
> `npm publish --access public` で公開し、各消費リポジトリの
> `package.json` は `ksk-design-system@X.Y.Z` を参照する。
> 消費リポ: belle-todo / trip_todo / ninshin-todo / yokoku-app / pawly（いずれも `~/LocalDev/` 直下）。

## 前提

- main ブランチが clean (`git status` で何もない)、リモートと一致
- 消費リポが `~/LocalDev/<name>` に clone 済みで、`gh` CLI が使えること（PR 自動作成に使用）

## 最短手順（推奨）

```bash
bash scripts/release.sh minor   # patch / minor / major / x.y.z
```

これだけ。中で以下を全部やる:

1. `git diff --quiet` & main ブランチチェック（曜日チェック）
2. `npm run check`
3. `npm version <level>`（tag 切り）
4. `npm pack`（prepack で `dist/` を生成し、中身を検証）
5. `npm publish --access public`
6. `git push origin main --tags`
7. `bash scripts/update-consumers.sh <version>`（5 リポへ PR 自動作成）

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
npm version patch

# minor (feature add, 互換あり) 例: 1.15.2 → 1.16.0
npm version minor

# major (破壊変更)        例: 1.15.2 → 2.0.0
npm version major
```

`npm version` が自動で `package.json` を更新し、`v1.16.0` タグを切る。
`dist/` の再ビルド・コミットはこの version bump のタイミングでのみ行う。

### 3. pack / publish

```bash
npm pack --dry-run
npm publish --access public
```

`prepack` フックで `npm run build:lib` が自動実行され、公開パッケージに入る
`dist/` / `contracts/` / `tokens.json` / docs の中身が更新される。

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
git push origin main --tags
```

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

npm version patch
npm publish --access public
git push origin main --tags
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
- npm registry 公開には `npm login` 済みであること
- `package.json#exports` を変更したら必ず利用側プロジェクトでの import を試す
- 金曜午後のリリースは厳禁（週末に障害対応できない）
- メジャーリリースは月初の月曜が望ましい（フィードバック収集期間が取れる）

## npm 公開について

v1.36.0 以降は npm registry 経由配布。GitHub Actions による自動 publish はなく、
ローカルの `npm login` 済み環境から `scripts/release.sh` で公開する。
CI/CD に戻す場合は、NPM_TOKEN の Secrets 登録と workflow の再作成をセットで行うこと。

## 関連

- [UPDATING.md](./UPDATING.md) — 消費側（DS を npm 依存に持つプロジェクト）向けのアップデート手順
