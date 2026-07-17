---
name: audit-pages
description: Storybook の全ページ/指定ストーリーを横断で視覚監査し即修正するバッチスキル。定期監査・リリース前総点検・「全ページ確認して」で使う
user-invocable: true
argument-hint: "[story-id または glob。省略で全ストーリー]"
---

# audit-pages — Storybook 横断視覚監査

## 0. 役割分担

- `ksk-ds-verification-workflow` = **実装直後**の準拠検証。対象は「自分が書いたコード」の差分。
- `audit-pages`（本スキル） = **Storybook 全体**の横断バッチ監査。対象は「既存ストーリー群」。定期巡回・リリース前総点検用。
- 判断基準（何が禁止か・なぜか）の正本は `contracts/rules.json` と `.claude/skills/ksk-design-system/` — 本スキルはそれを使った**巡回手順**のみを定義する。独自の禁止パターン判定を作らない。

## STEP 0 — 対象決定

- 引数（story-id / glob）があれば該当ストーリーのみを対象にする。
- 引数が無ければ `src/**/*.stories.tsx` を列挙し全件を対象にする（本リポジトリでは約138ファイル）。
- 件数が多い場合は `contracts/components.json` のカテゴリ単位（ui / patterns/commerce / patterns/admin / patterns/shells / patterns/その他）で分割し、カテゴリごとに STEP 1〜4 を回してから次のカテゴリへ進む。1カテゴリ完了ごとに STEP 4 のレポートを都度出す。

## STEP 1 — 静的解析（機械）

独自の grep を書かず既存スクリプトを呼ぶ:

```bash
bash scripts/lint-scratch.sh
bash scripts/check-story-reuse.sh
node scripts/check-contrast.mjs
```

検出があれば STEP 3 の修正対象リストに積む。

## STEP 2 — 視覚確認（目視・ブラウザツール）

`npm run storybook` を起動（ポートは `package.json` の `"storybook": "storybook dev -p 6010"` を正とする。現状 **6010**）。

Storybook Manager UI 経由ではなく iframe.html 直アクセスで globals を固定する。URL パターン（`.storybook/preview.ts` の `globalTypes` キー名 `kskTheme` / `kskHostile` に準拠）:

```
http://localhost:6010/iframe.html?id=<story-id>&globals=kskTheme:default;kskHostile:<off|ink|loud>
```

各ストーリーを Claude Code のブラウザツール群（resize_window / navigate / computer screenshot 等）で **4パターン**確認する:

1. **SP 375px × ダークモード**（`resize_window` で 375 幅に設定。ダークモードは OS/ブラウザ側のカラースキームで切り替え。DS 自体のダーク対応は各コンポーネントの CSS 変数解決に依存するため、コンポーネントがダーク値を持つ場合のみ意味を持つ — 無ければ通常表示との差分なしを確認するだけでよい）
2. **600px（SP/PC 境界）× ライト**
3. **PC（1280px 目安）× ダークモード**
4. **Hostile ctx を loud × ライト** — URL の `kskHostile:loud` を指定して読み込む

### 確認観点チェックリスト

- テキストのはみ出し・折り返し崩れ
- 要素の重なり（z-index / 意図しない overlap）
- ダークモードでの補足テキスト・プレースホルダーのコントラスト（過去知見: 補足級の弱い文字から壊れ始める）
- Hostile ctx（loud）でのマゼンタ化（`#E5007A` の継承漏れ）・背景の縞模様の透け（bg 未指定サーフェス）
- SP/PC でのヘッダー・レイアウト切替が意図通りか
- 無色 `border` の黒ずみ（Hostile ctx の `ink` モードでも確認可）

## STEP 3 — 即修正

検出した違反は `contracts/rules.json` の該当 `id` の `fix` フィールドの指針に従いその場で修正する。修正後は同じ URL パターンで再スクショして解消を確認する。

- `error` severity → 無条件で直す
- `warning` severity → 直すのが既定。直さない場合は理由をレポート・PR 本文に書く

## STEP 4 — レポート

ストーリーごとに以下の形式で記録する:

```
[OK] <story-id>
[FIX] <story-id> — <検出内容> → <修正内容>
```

全対象完了後に総括表（対象数 / OK数 / FIX数 / 未修正の理由付きリスト）を出す。

## STEP 5 — 締め（PRフロー）

main 直 push は禁止。

1. `bash scripts/lint-scratch.sh` を再実行しクリーンを確認
2. `git checkout -b fix/audit-pages-<日付8桁>` <!-- docs-drift-ignore -->
3. commit（日本語コミットメッセージ）
4. `gh pr create`
5. CI green を待つ

修正ゼロだった場合は PR 不要。STEP 4 のレポートのみで完了とする。
