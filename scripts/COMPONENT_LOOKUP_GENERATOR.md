# COMPONENT_LOOKUP 生成器 — 設計と限界

`scripts/generate-component-lookup.mjs` のメモ。`src/components/COMPONENT_LOOKUP.md`（AI 必読の再利用ガイド）を自動生成する。

## npm scripts
- `npm run generate:lookup` … 生成（上書き）
- `npm run check` … 末尾で `generate-component-lookup.mjs --check` を実行。生成物がソースと乖離していたら exit 1（CI 用ドリフト検知）

## 抽出方式
- **export 名**: 正規表現
- **cva variant**: TypeScript AST（`ts.createSourceFile`）で解析。正規表現/インデント/整形に非依存で、クォートキー・配列値・スプレッドも構造的に正確に扱う。同名 variant キーは dedup
- **variant の外部切り出し**: `src/lib/server-variants/` への import を追跡（Button 対応）。`@/components/ui/button` 等からの `buttonVariants` 借用（alert-dialog / pagination）は自コンポーネントの variant ではないため対象外
- **story 名**: 宣言ごとに探索窓を区切って `name:` を取得（次 story の名前を奪わない）
- **Icon\* 補助 export**: Component 欄から除外（全 export がアイコンのファイルは行を消さないよう元のまま）

## fail-loud
「variants 定義があるのに抽出 0 件」または「story 名重複」を検出したら、壊れた表を書かず `exit 1`。回帰テストは `__tests__/generate-component-lookup.test.ts`。

## 既知の限界
- cva 抽出は TS AST 化済みで、整形・クォートキー依存の取りこぼしは解消。ただし `variant` のキーを**変数参照やスプレッドで動的に組む**ケースは静的に解決できない（リテラルのオブジェクトのみ対象）
- fail-loud は「variants 非空なのに抽出 0 件」「story 名重複」を検知するが、**一部 variant 値だけの欠落**は自動検知できない。回帰テスト `__tests__/generate-component-lookup.test.ts` で代表ケースを固定している

## さらに堅くする選択肢（未着手）
1. **Storybook argTypes / autodocs を source of truth に**: `.storybook/preview.ts` は autodocs 有効。argTypes や型から variant を取れば cva 解析が不要になる。ただし argTypes は手書き依存
2. **MCP サーバー（`mcp-server/`）に variant を持たせ構造化提供**: md を publish する二重管理を解消できる。現状 MCP は variant 未対応
3. **`contracts/components.json` に variant も載せて単一情報源化**: `scripts/check-drift.sh` が件数照合に使用中。ここに寄せる手もある
4. **cva を AST（@babel/parser 等）で解析**: 正規表現の脆さを根絶。コストは高い

## 当面の推奨
現方式 + fail-loud + 単体テストで運用。将来 variant をプログラム的に多用するなら (1) か (2) へ寄せる。
