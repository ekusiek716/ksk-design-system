# Publishing — `@ksk/design-system`

`@ksk/design-system` の npm 公開手順。

## 前提

- npm のログイン: `npm whoami` で `ksk` 系アカウントが返ること
- 公開権限: `npm access list packages ksk-design-system` で確認
- main ブランチが clean (`git status` で何もない)、リモートと一致

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

### 3. ビルド

```bash
npm run build:lib
```

`dist/` に ESM + 型定義が出力される。

### 4. 内容確認

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

### 5. 公開

```bash
npm publish --access public
```

破壊変更を含む場合は `--tag next` で先に dist-tag を切ってから周知:

```bash
npm publish --tag next --access public
# 利用側で動作確認後...
npm dist-tag add @ksk/design-system@2.0.0 latest
```

### 6. push

```bash
git push origin main --tags
```

GitHub の Releases ページが自動で更新される（CI が走っていれば）。

## 緊急ホットフィックス

本番障害時の応急対応:

```bash
# main から直接でも OK（hotfix ブランチを切る暇がない時）
# 修正コミット
git commit -m "fix: 重大なバグの説明"

npm version patch
npm run build:lib
npm publish --access public
git push origin main --tags
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

- `npm publish` 前に必ず `npm pack --dry-run` で中身確認
- `package.json#exports` を変更したら必ず利用側プロジェクトでの import を試す
- 金曜午後のリリースは厳禁（週末に障害対応できない）
- メジャーリリースは月初の月曜が望ましい（フィードバック収集期間が取れる）
