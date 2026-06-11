# Publishing — `@ksk/design-system`

`@ksk/design-system` のリリース・配布手順。

> **配布方式**: このパッケージは npm レジストリには公開しない。
> `npm pack` で生成した tgz を各消費リポジトリの `vendor/` に置き、
> `package.json` から `file:vendor/ksk-design-system-X.Y.Z.tgz` で参照する **vendoring 方式**。
> 消費リポ: belle-todo / trip_todo / ninshin-todo / yokoku-app / pawly（いずれも `~/LocalDev/` 直下）。

## 前提

- main ブランチが clean (`git status` で何もない)、リモートと一致
- 消費リポが `~/LocalDev/<name>` に clone 済みで、`gh` CLI が使えること（PR 自動作成に使用）

## リリースフロー

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

### 3. tgz 生成

```bash
npm pack
```

`prepack` フックで `npm run build:lib` が自動実行され、リポ直下に
`ksk-design-system-X.Y.Z.tgz` が生成される。

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
bash scripts/bump-consumers.sh 1.16.0

# 特定リポのみ
bash scripts/bump-consumers.sh 1.16.0 belle-todo pawly
```

各消費リポで `chore/bump-ds-<version>` ブランチを切り、tgz の `vendor/` 配置・
`package.json` の参照書換・`npm install`・commit・push・PR 作成まで自動で行う。
失敗したリポはスキップされ最後にまとめて報告されるので、個別にリトライする。

過去版の tgz は `vendor/` に残す運用（ロールバックを git revert だけで済ませるため）。

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
npm pack
git push origin main --tags
bash scripts/bump-consumers.sh <version> <影響リポ...>
```

修正コミットの背景・影響範囲を `RELEASE.md` の「ホットフィックス履歴」セクションに必ず追記。

## バージョニング規約

`@ksk/design-system` は [Semantic Versioning](https://semver.org/lang/ja/) に従う:

| 種類 | 内容 | 例 |
|---|---|---|
| patch | バグ修正・内部最適化 | 1.15.2 → 1.15.3 |
| minor | 新コンポーネント追加・新 prop 追加（既存壊さない） | 1.15.x → 1.16.0 |
| major | 既存 prop 削除・コンポーネント rename・default 値変更 | 1.x → 2.0.0 |

破壊変更時は `scripts/codemod/` に migration script を必ず添える。
`MIGRATION.md` に rename テーブル / before-after を文書化。

## 注意

- 配布前に必ず `npm pack --dry-run` で中身確認
- `package.json#exports` を変更したら必ず利用側プロジェクトでの import を試す
- 金曜午後のリリースは厳禁（週末に障害対応できない）
- メジャーリリースは月初の月曜が望ましい（フィードバック収集期間が取れる）

## npm 公開について

過去にタグ push で npm publish する GitHub Actions（`publish.yml`）が存在したが、
実際の配布が vendoring 方式であり NPM_TOKEN も未設定で失敗し続けていたため削除した。
将来 npm レジストリ公開に切り替える場合は、NPM_TOKEN の Secrets 登録と
workflow の再作成をセットで行うこと。
