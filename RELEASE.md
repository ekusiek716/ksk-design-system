# Release Cadence — `@ksk/design-system`

`@ksk/design-system` のリリーススケジュール・運用ルール。

## ⏳ 保留中の公開: v1.21.2

> **publish 待ち。** `package.json` は `1.21.2` に更新済み・main にマージ済み・
> test / check は green だが、**`v1.21.2` タグが未 push のため npm 未公開**。
> （CI 実行環境からはタグ push が権限で拒否されるため、手動操作が必要）

公開する場合は以下のいずれかを実行（`publish.yml` が起動して npm に公開される）:

```bash
# A. ローカルからタグ push
git checkout main && git pull
git tag -a v1.21.2 -m "v1.21.2 — Sheet (side=bottom) 仮想キーボード対応"
git push origin v1.21.2
```

- **B. GitHub UI:** Releases → Draft a new release → Tag `v1.21.2`（target: main）→ Publish
- **C. Actions:** "Publish to npm" → Run workflow（`workflow_dispatch`, branch: main）

公開後はこのセクションを削除し、下の「ホットフィックス履歴」へ 1 行追記すること。

内容: Sheet (`side="bottom"` / `swipeToClose` / `bottom-glass`) が仮想キーボード
表示時にシート上端を画面外へ出さないよう `visualViewport` 監視で修正（PR #12）。

## 通常リリースサイクル

| 種類 | 頻度 | 曜日 |
|---|---|---|
| patch | 必要時 | 月〜木（金曜禁止） |
| minor | 隔週 | 火曜 or 水曜 |
| major | 四半期 | 月初の月曜 |

**金曜午後・休前日のリリースは禁止**。週末に障害対応できる体制でない時間帯は patch も避ける。

## メジャーリリースの段取り

メジャー (`vX → vX+1`) は破壊変更を含むため、最低 4 週間前から計画する:

```
T-4w  破壊変更内容の確定 → MIGRATION.md 草案作成
T-3w  scripts/codemod/vX-to-vY.mjs を実装、利用側で dry-run 検証
T-2w  RC 版を npm に push (--tag next)、利用側で動作確認
T-1w  feedback 反映、ESLint 旧 API ルールを "error" に昇格
T-0   latest tag を切替、リリースノート公開、社内告知
T+1w  次の patch で旧 API を完全削除
```

## ホットフィックス手順

本番障害が発生したら:

1. main で直接修正（or hotfix ブランチ）
2. `npm version patch`
3. `npm publish --access public`
4. 影響範囲・原因・修正内容を「ホットフィックス履歴」に記録
5. ポストモーテムを Issue / wiki に書く

## ホットフィックス履歴

| 日付 | バージョン | 内容 | 影響 |
|---|---|---|---|
| — | — | （まだなし） | — |

新しいホットフィックスがあれば追記する。

## リリースノート書き方

GitHub Releases にコピペできるテンプレ:

```md
## v1.16.0 (2026-MM-DD)

### Features
- Button: `inverse` / `ghost-inverse` バリアント追加（暗背景上の CTA 用）
- Button: `hero` サイズ追加（hero / final-CTA 専用ピル型）
- Checkbox: `label` / `description` / `count` props でポリモーフィック化

### Fixes
- ...

### Docs
- ...

### Migration
- 破壊変更なし。そのまま `npm update` で OK。
```

破壊変更がある場合は必ず:

```md
### Breaking Changes
- `OldComponent` を削除。`NewComponent` を使ってください。
  自動移行: `npx @ksk/design-system codemod v1-to-v2 ./src`
- 詳細: [MIGRATION.md](./MIGRATION.md)
```

## 関連

- [PUBLISHING.md](./PUBLISHING.md) — 実際の手順
- [MIGRATION.md](./MIGRATION.md) — メジャー毎の移行ガイド
- [scripts/codemod/README.md](./scripts/codemod/README.md) — codemod 雛形と使い方
