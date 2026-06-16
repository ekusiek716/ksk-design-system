# Codemod

`ksk-design-system` で破壊変更を入れる際の自動移行スクリプト置き場。

## 使い方（利用側プロジェクトで）

```bash
# 事前確認（変更を書き込まない）
npx ksk-design-system codemod v1-to-v2 ./src --dry

# 実行
npx ksk-design-system codemod v1-to-v2 ./src
```

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
- `eslint/deprecated.js` — 旧 API 検出用 ESLint ルール
