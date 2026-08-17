# Codemod

`ksk-design-system` で破壊変更を入れる際の自動移行スクリプト置き場。

## 移行状況の確認（check-migration）

非推奨 API（`contracts/deprecations.json` が正本）が利用側プロジェクトに
まだ残っているかを read-only で検査する。書き換えは一切行わない。
実体は `bin/check-migration.js`。

```bash
npx ksk-design-system check-migration ./src
npx ksk-design-system check-migration ./src --format=json
```

- TypeScript の AST で識別子ベースに検出する（コメント・文字列は誤検出しない）
- `ksk-design-system` からの import に加え、相対 import 経由の re-export も追う
- 0 件なら exit 0、1 件以上なら識別子別・ファイル別の内訳を出力して exit 1
- 検出されたら該当する codemod（下記）を使って移行する

## 使い方（利用側プロジェクトで）

```bash
# 利用できる codemod を一覧（現時点では 0 本）
npx ksk-design-system codemod

# 事前確認（変更を書き込まない）
npx ksk-design-system codemod <name> ./src --dry

# 実行
npx ksk-design-system codemod <name> ./src
```

`<name>` は `scripts/codemod/<name>.mjs` のファイル名部分。**破壊変更に対応する
codemod はそのリリース時に追加され、実行コマンドは MIGRATION.md に記載される。**
`template.mjs`（雛形）と `check-migration`（読み取り専用スキャナ。実体は
`bin/check-migration.js`）は codemod としては呼べない。

## 新しい codemod の作り方（メンテナ向け）

1. `template.mjs` を複製
   ```bash
   cp scripts/codemod/template.mjs scripts/codemod/v1-to-v2.mjs
   ```

2. 編集ポイント:
   - `RENAMES` — 単純な識別子 rename: `[["OldComp", "NewComp"], ...]`
   - `PROP_RENAMES` — JSX prop rename: `[["Button", "kind", "variant"], ...]`
   - `WARNINGS` — 自動置換が危険な箇所の人向け警告
   - `PACKAGE_PATTERN` — 対象パッケージ名（通常そのまま）

3. ローカル動作確認
   ```bash
   node scripts/codemod/v1-to-v2.mjs --dry path/to/consumer/src
   ```

4. `MIGRATION.md` に変更点を文書化（before/after 例・自動置換できない警告）

5. リリースノートで案内
   - codemod ファイル名（例: `v1-to-v2`）
   - --dry 推奨
   - 必ずコミット済みで実行

## 注意

- 正規表現ベースで 100% 正確ではない
- 必ず利用側プロジェクトをコミット済み状態にしてから実行する
- 適用後は `git diff` で必ず変更箇所を確認すること
- 複雑な書き換え（型推論を伴うもの、template literal 内の参照等）は手動対応推奨

## 関連ドキュメント

- `MIGRATION.md` — メジャーバージョン毎の移行ガイド
- `RELEASE.md` — リリースサイクル
- `contracts/deprecations.json` — 非推奨 API の正本台帳
- `eslint/deprecated.js` — 旧 API（export 名）検出用 ESLint ルール
