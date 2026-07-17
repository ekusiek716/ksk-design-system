# Migration Guide — `ksk-design-system`

メジャーバージョン間の移行ガイド。
patch / minor は原則破壊変更なし、自動アップグレード可（例外: **v1.34.0 で npm パッケージ名を変更**。import の置換が必要。下記参照）。

## v2.0 (未リリース)

まだメジャー破壊変更の予定はなし。

破壊変更を入れる際にはここに以下を書く:
1. 削除した識別子 / prop の一覧（rename テーブル）
2. before / after コード例
3. 自動移行コマンド: `npx ksk-design-system codemod v1-to-v2 ./src`
4. 手動対応が必要な項目（codemod では拾えないケース）

---

## v1 系内の minor 変更（参考）

### v1.34.0 — パッケージ名変更（要対応）＋ RN/Expo 対応

**npm パッケージ名を `@ksk/design-system` → `ksk-design-system` に変更**（npm スコープ除去・OSS 公開準備）。機能面の破壊はないが、**import の一括置換が必要**:

- TS/JS: `from "@ksk/design-system"` → `from "ksk-design-system"`
- CSS: `@import "@ksk/design-system/preset"` → `@import "ksk-design-system/preset"`（`/themes/*` も同様）
- 依存名: package.json の `@ksk/design-system` → `ksk-design-system`（vendoring の tgz 差し替え時）

消費リポでの一括置換例:

```bash
git grep -lz '@ksk/design-system' -- src \
  | xargs -0 sed -i '' 's#@ksk/design-system#ksk-design-system#g'
```

あわせて追加（いずれも破壊変更なし）:

- **RN/Expo 対応**: `ksk-design-system/native`（解決済みトークン）と `ksk-design-system/native/ui`（RN コンポーネント）を新設
- **CheckboxField** コンポーネント追加
- 角丸トークンに `md`(6px) / `xl`(12px) を許可セットへ追加

### v1.16.0 (予定)

新機能追加のみ・破壊変更なし:

- **Button** に `inverse` / `ghost-inverse` バリアント追加
- **Button** に `hero` サイズ追加
- **Checkbox** に `label` / `description` / `count` props 追加（polymorphic 化）
- **Alert** に prop ベース API 追加（`title` / `description` / `icon` / `action`）
- **Chip** に `soldOut` / `count` / `href` 状態追加
- **Storybook** で autodocs グローバル化、guidelines.mdx 追加
- **scripts/check-deps.sh** で ui → patterns 階層の逆依存を CI でブロック
- **Vitest** 最小導入 + backwards-compat スイート
- 全コンポーネントに `data-slot` / `data-variant` / `data-size` を徹底
- **preset.css**: Tailwind v4 の `currentColor` 既定対策として、border-color / outline-color のベースレイヤ保険を追加。`@import "ksk-design-system/preset"` するだけで有効。破壊変更なし — 明示色を持つ枠線は不変で、色未指定の枠線のフォールバックのみ `--border` / `--ring` に固定される（消費側で枠線が黒ずむ不具合を防止）

何もしなくても既存コードはそのまま動く。

### v1.15.x

過去の minor / patch 履歴は GitHub Releases を参照。

---

## 移行作業の進め方

### Step 1. Codemod を dry-run

```bash
npx ksk-design-system codemod vX-to-vY ./src --dry
```

書き換え対象ファイル一覧が表示される。

### Step 2. 実際に適用

```bash
npx ksk-design-system codemod vX-to-vY ./src
git diff
```

`git diff` で意図通りか確認。

### Step 3. ESLint で残骸チェック

`eslint.config.js` に:

```js
import kskDeprecated from "ksk-design-system/eslint/deprecated"

export default [
  {
    plugins: { "ksk-deprecated": kskDeprecated },
    rules: { "ksk-deprecated/no-deprecated": "error" },
  },
]
```

これで codemod が拾えなかった旧 API の使用を検出できる。

### Step 4. 動作確認

```bash
npm run test
npm run build
```

それから本番デプロイへ。

## 関連

- [UPDATING.md](./UPDATING.md) — 消費側（DS を npm 依存に持つプロジェクト）向けのアップデート手順（バージョンの読み方・PR 作業手順）
