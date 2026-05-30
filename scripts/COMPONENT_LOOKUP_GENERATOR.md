# COMPONENT_LOOKUP 生成器 — 設計と限界

`scripts/generate-component-lookup.mjs` のメモ。`src/components/COMPONENT_LOOKUP.md`（AI 必読の再利用ガイド）を自動生成する。

## npm scripts
- `npm run generate:lookup` … 生成（上書き）
- `npm run check` … 末尾で `generate-component-lookup.mjs --check` を実行。生成物がソースと乖離していたら exit 1（CI 用ドリフト検知）

## 抽出方式
- **export 名**: 正規表現
- **cva variant**: 波括弧の対応をとるブレースマッチ（インデント非依存）。`cva("base", {…})` のインライン/改行どちらの整形でも拾う。同名 variant キーは dedup
- **variant の外部切り出し**: `src/lib/server-variants/` への import を追跡（Button 対応）。`@/components/ui/button` 等からの `buttonVariants` 借用（alert-dialog / pagination）は自コンポーネントの variant ではないため対象外
- **story 名**: 宣言ごとに探索窓を区切って `name:` を取得（次 story の名前を奪わない）
- **Icon\* 補助 export**: Component 欄から除外（全 export がアイコンのファイルは行を消さないよう元のまま）

## fail-loud
「variants 定義があるのに抽出 0 件」または「story 名重複」を検出したら、壊れた表を書かず `exit 1`。回帰テストは `__tests__/generate-component-lookup.test.ts`。

## 既知の限界（regex / ブレースマッチゆえ）
- TS の本物の構文解析ではないため、複雑な cva（スプレッド、変数参照で組む variant、`compoundVariants` 由来の暗黙キー等）は取りこぼし得る
- fail-loud は「0 件」「重複」しか検知しない。**部分取りこぼし（一部 variant 値だけ欠落）は検知できない**（過去にハイフン付きクォートキー全落ちを目視で発見した実績あり）

## さらに堅くする選択肢（未着手）
1. **Storybook argTypes / autodocs を source of truth に**: `.storybook/preview.ts` は autodocs 有効。argTypes や型から variant を取れば cva 解析が不要になる。ただし argTypes は手書き依存
2. **MCP サーバー（`mcp-server/`）に variant を持たせ構造化提供**: md を publish する二重管理を解消できる。現状 MCP は variant 未対応
3. **`contracts/components.json` に variant も載せて単一情報源化**: `scripts/check-drift.sh` が件数照合に使用中。ここに寄せる手もある
4. **cva を AST（@babel/parser 等）で解析**: 正規表現の脆さを根絶。コストは高い

## 当面の推奨
現方式 + fail-loud + 単体テストで運用。将来 variant をプログラム的に多用するなら (1) か (2) へ寄せる。
