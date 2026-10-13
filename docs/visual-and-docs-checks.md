# Docsと画像比較の検証

## Docsが空白になる不具合

`npm run test:docs -- --url http://127.0.0.1:6010` は `index.json` の全Docsエントリを動的に列挙します。`iframe.html?viewMode=docs` にアクセスし、表示された見出し・本文/表/デモ、HTTP成功、Reactのruntime error、タイムアウトを確認します。`artifacts/docs-report.json` に各ページの表示時間と失敗理由を保存します。未検出0ページは失敗です。

ローカルは先に `npm run storybook -- --ci --no-open`。CIは `npm run build-storybook` 後の静的ファイルを配信します。`--filter filterpill` で対象を限定でき、`--timeout 30000` が既定です。表示時間は測定値であり、固定の性能保証ではありません。

## 画像比較

撮影場面は2系統です（正本は `scripts/lib/visual-scenarios.mjs`）。

1. **固定場面**（`test/visual/scenarios.json`）: Chip、SettingsSection、Sheetの6条件。狭幅/広幅、light/dark、長い日本語、hostile contextを分散してカバーします。
2. **主要部品の代表ストーリー**: ストーリーに `tags: ["vrt"]` を付けたもの × light/dark。幅800px・全高（`fullPage`）で撮ります。基準画像名は `<story id>--<light|dark>.png`。

### 撮影範囲の決め方（opt-in にした理由）

全ストーリーは約780件あり、×2モードで約1,560枚になります。CIの時間とレビュー負荷（基準更新のたびに大量のPNGを見る）が見合わないため、全件撮影は採りません。代わりに `tags: ["vrt"]` を付けた代表ストーリーだけを撮ります。目安は「CIの追加時間が5分以内」で、現在は25ストーリー（50枚）です。

選び方:

- 1部品につき、variant / 状態を1画面に並べたストーリー（`AllVariants` / `AllStates` / `Error` など）を優先する
- play関数を持つストーリー、時刻・乱数・外部画像・アニメーションに依存するストーリーは付けない（撮るたびに変わる）
- オーバーレイ（Dialog / Sheet / Popover）は固定場面側で扱う

部品を追加して代表ストーリーを撮りたいときは `tags: ["vrt"]` を付け、下の「基準画像の撮り直し」で基準画像を作ります。基準画像が無い場面は失敗します。

### 判定

毎回同じPlaywright公式Linuxコンテナ、Chromium、locale、timezone、device scale、reduced motionで描画します。OSフォント差を避けるためMacで生成した画像を受け付けません。撮影前に、フォント読み込み・有限のアニメーション/トランジションの終了（`document.getAnimations()`）・さらに2フレームを待ちます。マウント後に値が入る部品（Select・Slider・Progress）の途中の状態を撮らないためです。

```sh
npm run build-storybook
docker run --rm --init --ipc=host --platform linux/amd64 \
  -v "$PWD:/work" -w /work \
  -e KSK_VISUAL_ENV=playwright-1.62.0-noble \
  mcr.microsoft.com/playwright:v1.62.0-noble@sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07 \
  bash scripts/run-visual-container.sh
```

コンテナ内では独立した一時コピーで `npm ci` を行います。ホストのnode_modulesを利用・変更しません。静的Storybookのサーバーは OS が空きポートを割り当てます（`scripts/serve-storybook.mjs` に `0` を渡すと割り当てたURLを `KSK_STORYBOOK_URL=` 行で出力）。並行実行しても6010番の取り合いになりません。差分は `artifacts/visual` にactual/diff PNGとJSONとして保存されます。各色チャンネルの差が8/255を超えるピクセルが1つでもあれば失敗です。固定環境で全条件差分0を実測しているため、全面に占める比率が小さい×アイコンの消失も許容しません。画像寸法差、基準画像の欠落、環境差も失敗です。

## 基準画像の撮り直し

通常のPR/push CIでは基準更新は禁止です。UI変更の意図が確認できた場合だけ、次のどちらかで撮り直します。

**CIで撮り直す（推奨）**: `Update visual baselines` workflow（`.github/workflows/visual-baselines-update.yml`）を対象ブランチ指定で起動します。

```sh
gh workflow run visual-baselines-update.yml -f ref=<PRのブランチ名>
```

通常CIと同じコンテナで全場面を撮り、もう一度比較して再現することを確かめてから、そのブランチへ `test(visual): 基準画像を固定コンテナで撮り直す` としてコミットします。入力の `ref` は `refs/heads/` を外して正規化し、既定ブランチ（main）・タグ・コミットSHA・存在しないブランチは拒否します。checkout は認証情報を残さない設定（`persist-credentials: false`）で行い、push の1コマンドだけにトークンを渡します。依存は `npm ci --ignore-scripts` で入れます。

- `workflow_dispatch` は既定ブランチ（main）にあるworkflowしか起動できません。このworkflow自体を追加・変更するPRでは、マージ前に使えません（その場合は下のdocker手順で撮る）。
- **GITHUB_TOKENでのpushは新しいworkflowを起動しません**（GitHubの仕様・無限ループ防止）。コミット後、PRのCIは自動では走り直さないため、空コミットのpush・PRのclose/reopen・「Re-run jobs」のいずれかで `Docs and visual regression` を再実行して緑を確認します。

**手元のdockerで撮り直す**: 上記dockerコマンドに `-e VISUAL_BASELINE_REVIEW=1` を追加して、末尾を `bash scripts/run-visual-container.sh --update` にします。

どちらも、画像と環境JSONは一時領域へ書き、全条件成功後に一式を反映します（ディレクトリごと入れ替えるので、使われなくなった基準画像も消えます）。失敗時は既存の基準を保持し、コンテナからホストへも基準をコピーしません。

### 基準更新のレビュー

更新者はPRに変更理由を記載し、**別のレビュアーが旧/新PNGと実画面を確認してから承認**します。差分を消すためだけの一括更新は禁止。ブラウザ更新時も環境JSONと全PNGを同じPRでレビューします。

変更前後のレビューでは、PNGだけでなく `test/visual/fixtures.stories.tsx` の内容や `tags: ["vrt"]` が削られていないことも確認してください。基準更新フラグは人のレビューの代替ではありません。

## 使われなくなった基準画像の検出

ストーリーの削除・改名や `vrt` タグ外しをしても、コミット済みのPNGは自動では消えません。`npm run test:visual:guards`（`test/visual/orphans.test.mjs`）と `npm run test:visual` は、どの場面にも対応しないPNGがあれば失敗します。意図した削除ならPNGを消すか、基準画像を撮り直してください。guardsの実検査は `storybook-static/index.json` を読むため、ローカルでは `npm run build-storybook` 後に有効になります（CIでは常に実行）。

## 期限付きの例外台帳

「意図して基準を下回る」項目は `test/known-exceptions.json` に集め、**理由（reason）・issue・見直し期限（reviewBy, YYYY-MM-DD）** を必須にします。登録があれば検査は通りますが、次は失敗します。

- 見直し期限を過ぎた登録（日付の比較は **UTC** 基準。日本時間の朝9時に日付が変わる）
- 使われていない登録（直った・対象が消えた）
- 台帳を通さない例外（ストーリー側で axe ルールを無効化したのに未登録）

| 区分 | 対象 | 検査する場所 |
|---|---|---|
| `a11y` | ストーリー側で axe を弱めている箇所。`parameters.a11y` の `config.rules` / `options.rules`（配列 `[{ id, enabled: false }]` でもオブジェクト `{ "id": { enabled: false } }` でも、キーの順番によらず）、`test: "off"` / `"todo"`、`disable: true`。TypeScript の構文木で `src/` と `test/visual/` の `.stories.tsx` / `.stories.ts` を走査する。変数やスプレッドで静的に読めない書き方は失敗。`target` は `<ファイル>#<変数名>`（`export default {...}` は `#default`）、`rule` はルールID か `test:off` / `test:todo` / `disable` | `npm run check`（`scripts/check-known-exceptions.mjs`）と `npm run test:a11y` の開始時（`vitest.a11y.config.ts` の globalSetup） |
| `contrast` | `scripts/check-contrast.mjs` のトークンペアのうち基準未達のもの。`pair` は照合キー（例: `light:input-border`） | `npm run check`（`scripts/check-contrast.mjs`。基準を満たした登録・存在しない組も失敗） |
| `visual` | 画像比較で変化ピクセルを許容する場面（`scenario` と `maxChangedPixels`）。既定は0で、登録が無い限り1ピクセルも許容しない | `npm run test:visual` / `npm run test:visual:guards` |

見直し期限が **30日以内** に迫った登録は、失敗させずに `npm run check` と `npm run test:a11y` で警告を出します（期限日に無関係なPRが一斉に止まらないよう、先に見直すため）。期限が来たら、直すか、理由を見直して期限を延ばすPRを出します。延長だけを繰り返さないよう、issueで判断を残してください。

### 文字以外のコントラスト（WCAG 1.4.11）

`scripts/check-contrast.mjs` は文字（4.5:1）に加えて、入力欄・チェックボックス・ラジオの枠、スイッチ（オン/オフ）の地、フォーカス枠・エラー枠と背景（Surface-Primary）の組を 3:1 で light / dark とも検査します。dark の半透明な枠（White-Alpha）は背景へ合成した実色で比べます。

現在の未達（`--Border-Medium-Emphasis` が白地で約1.48:1、スイッチ（オフ）の地が1.27:1 など）は、色を変えると全プロダクトの見た目が変わるため、見た目の変更を別判断（本人判断待ち・issue #636）として 2027-03-31 期限で台帳に登録しています。**新しく未達の組が増えたときは、登録が無いので失敗します。**

## negative test

`npm run test:visual:guards` は、意図的にずらした図形、寸法違い、空白Docs、runtime errorのあるDocs、孤児の基準画像を失敗として検出するnegative testです。

ブラウザ描画を含むnegative確認はコンテナ末尾を `bash scripts/run-visual-container.sh --probe-regression` にします。実際のChipを40pxずらした画像が拒否されることを確認し、基準画像は更新しません。
