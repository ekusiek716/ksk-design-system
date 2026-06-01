# コードレビュー依頼 — @ksk/design-system v1.30.0

> Codex 等の AI レビュアー向け。このファイル単体で着手できるよう前提を全部書いてある。
> 終わったら本ファイルは破棄してよい（レビュー用の使い捨て）。

## 対象

- リポジトリ: `ksk-design-system`（このリポ）。ブランチ `main`。
- 変更範囲: **`git diff v1.29.0..v1.30.0`**（= v1.30.0 リリースで入った差分）。
- 起動・確認:
  - Storybook: `npm run storybook`（http://localhost:6010）。各 story は `?path=/story/<id>` で開く。
  - 静的チェック: `npm run check`（tsc + lint + drift + **コントラスト** + lookup）, `npm test`。
- レビュアーへの注意: 実装者の検証は**ヘッドレス Storybook**中心で、実機タッチ・実ブラウザのアニメ完了・複数テーマの目視は弱い。下記 P1〜P3 はそこを重点的に。

## 出力形式

各指摘を `severity(blocker/major/minor/nit) / 対象ファイル:行 / 内容 / 根拠 or 再現` で。
誤検知を避けるため、確証が持てないものは「要確認」と明記。

---

## P1（最重点）Sheet 全面スワイプ閉じ — 実機ジェスチャ

- 対象: `src/components/ui/sheet.tsx` の `SwipeToCloseBottomSheet`（`findScrollableAncestor` / `onPointerDown/Move` / 非passive `touchmove`）。
- story: `components-sheet--bottom-sheet-swipe-full-height`, `components-sheet--bottom-sheet-swipe-to-close`（**実機 iOS Safari / Android Chrome で**）。
- 観点:
  1. スクロール途中（`scrollTop > 0`）で下スワイプしても**閉じずスクロール優先**になるか。
  2. 先頭(0)で下スワイプ→閉じる、ハンドルは常に掴める（`data-sheet-drag-handle` 特例）。
  3. ドラッグ中の非passive `touchmove` preventDefault が iOS で**ネイティブスクロール/ラバーバンドを正しく抑止**するか。`overscroll-y-contain` との併用。
  4. ネストしたスクロール領域・横スワイプ・ポインタキャプチャ未対応環境の取りこぼし。
- なぜ: タッチ挙動はヘッドレスで再現不能。実機でしか分からない。

## P2（広範囲）Brand-Primary 500→600 の視覚波及

- 対象: `src/styles/semantic.css` の `--Brand-Primary`（light を Brand-600 に）, `tokens.json` semantic.brand.primary。
- 観点:
  1. プライマリ塗り（Button / shadcn `--primary` / sidebar）の白文字が AA(≥4.5) を満たすのは確認済み。**それ以外への波及**を見る: focus ring・hover/active、`--Brand-Primary` を**テキスト色**として使ってる箇所はないか（あれば 600 で更に濃くなる）。
  2. 500 のまま残した accent 系（`--Surface/Object/Border-Accent-Primary`）と 600 のプライマリ塗りが**並んだ時の色ズレ**が許容範囲か。
  3. 全テーマ（blue/orange/green/violet）で同様に破綻しないか。
- story: `components-button--all-variants`, sidebar/accent を使う画面, 各テーマ切替。

## P3（挙動変更）ConfirmDialog の alertdialog 化

- 対象: `src/components/patterns/confirm-dialog.tsx`（土台を ResponsiveDialog→`AlertDialog` に変更）, `src/components/ui/alert-dialog.tsx`。
- 観点:
  1. **実ブラウザで開閉が完結するか**（exit アニメ後に unmount。実装者はヘッドレスで「閉じない」誤検知に遭遇）。
  2. 非同期 `onConfirm` + loading 中の状態（cancel 無効化・Esc の扱い・確認ボタンが Button で自動クローズしない設計）。
  3. `role="alertdialog"`・外クリックで閉じない・PC/SP とも中央表示、が意図通りか。API 不変（consumer 非破壊）か。
- story: `components-confirmdialog--destructive`, `--with-loading`, `components-alertdialog--default`。

## P4（a11y 妥当性）コントラスト検査 + Categorical

- 対象: `scripts/check-contrast.mjs`, `src/styles/categorical.css`, `tokens.json`(categorical)。
- 観点:
  1. コントラスト数式（相対輝度・比）の正しさ、検査対象ペアの妥当性、`rgba`/`color-mix` を skip してる点の是非、ボタン文字を 4.5 で見てる判断。
  2. categorical 16色の値・**Bold が文字用として AA**・dark mode 切替・CVD（色覚多様性）配慮の主張が妥当か。
- story: `foundation-categorical--scale`, `--usage`。

## P5（横断トークン）角丸

- 対象: `src/preset.css` の `--Radius-{Surface,Modal,Sheet}`、`dialog.tsx`/`alert-dialog.tsx`/`card.tsx`/`popover.tsx`/`sheet.tsx`。
- 観点: ベタ書き（`rounded-lg`/`rounded-[Npx]`）の残存、24px モーダル×ピルボタンの見た目、面<モーダル<シートの階層が崩れてないか。
- story: `components-dialog--*`, `components-alertdialog--*`, Card 系。

## P6（脱ブランド／低優先 UI）コード中心

- 脱ブランド漏れ: `git grep -iE "助太刀|cake"` で残存がないか。`commerce/*`（ProductCard 等）の意匠が特定クライアントに寄り過ぎてないか。
- 低リスク UI 微調整（軽い目視で可）: ProductCard（最短ラベル撤去・ハート右上 / `productcard--vertical`）、RatingDisplay 黒（`ratingdisplay--default`）、DropdownFilter icon（`dropdownfilter--with-icons`）、CategoryScroll 余白（`categoryscroll--default`）、Chip サイズタイル。
