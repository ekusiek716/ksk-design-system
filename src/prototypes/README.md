# src/prototypes — モックプレビュー

Notion の仕様から生成した **DS 準拠モック** の置き場。`npm run dev`
（http://localhost:5173）が一覧＋単一プレビュー（SP/PC フレーム切替つき）として開く。

## 使い方

1. dev サーバーを起動: `npm run dev`
2. Claude に Notion の仕様リンクを貼って実行: `/mock <Notion URL>`
   - 自然言語の仕様を直接渡してもよい: `/mock 商品一覧。絞り込みタブと無限スクロール`
3. `src/prototypes/<slug>.tsx` が生成され、`http://localhost:5173/#/<slug>` で表示される

## 仕組み

- `_registry.ts` … `import.meta.glob` で `*.tsx` を自動収集（`_` 始まりは除外）
- `_host.tsx` … 一覧 / 単一プレビューのホスト UI（ハッシュルーティング）
- `<slug>.tsx` … 各モック。`export const meta` + `export default` の 2 つを持つ

ファイルを置く / 消すだけで一覧に反映される。手動登録は不要。

## ルール

生成物は KSK の DS ルール（CLAUDE.md 冒頭のセルフチェック）に従う:
semantic token / `typo-*` / `iconsax-reactjs` / DS コンポーネント / 色つき border。
`bash scripts/lint-scratch.sh src/prototypes/<slug>.tsx` で検証する。

`sample-mypage.tsx` は動作確認用のサンプル。不要なら削除してよい。
