# Docsと画像比較の検証

## Docsが空白になる不具合

`npm run test:docs -- --url http://127.0.0.1:6010` は `index.json` の全Docsエントリを動的に列挙します。`iframe.html?viewMode=docs` にアクセスし、表示された見出し・本文/表/デモ、HTTP成功、Reactのruntime error、タイムアウトを確認します。`artifacts/docs-report.json` に各ページの表示時間と失敗理由を保存します。未検出0ページは失敗です。

ローカルは先に `npm run storybook -- --ci --no-open`。CIは `npm run build-storybook` 後の静的ファイルを配信します。`--filter filterpill` で対象を限定でき、`--timeout 30000` が既定です。表示時間は測定値であり、固定の性能保証ではありません。

## 画像比較

対象はChip、SettingsSection、Sheetの6条件。狭幅/広幅、light/dark、長い日本語、hostile contextを分散してカバーします（`test/visual/scenarios.json`）。毎回同じPlaywright公式Linuxコンテナ、Chromium、locale、timezone、device scale、reduced motionで描画します。OSフォント差を避けるためMacで生成した画像を受け付けません。

```sh
npm run build-storybook
docker run --rm --init --ipc=host --platform linux/amd64 \
  -v "$PWD:/work" -w /work \
  -e KSK_VISUAL_ENV=playwright-1.62.0-noble \
  mcr.microsoft.com/playwright:v1.62.0-noble@sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07 \
  bash scripts/run-visual-container.sh
```

コンテナ内では独立した一時コピーで `npm ci` を行います。ホストのnode_modulesを利用・変更しません。差分は `artifacts/visual` にactual/diff PNGとJSONとして保存されます。各色チャンネルの差が8/255を超えるピクセルが1つでもあれば失敗です。固定環境で6条件すべて差分0を実測しているため、全面に占める比率が小さい×アイコンの消失も許容しません。画像寸法差、基準画像の欠落、環境差も失敗です。

## 基準更新のレビュー

通常CIでは基準更新は禁止です。UI変更の意図が確認できた場合だけ、上記dockerコマンドに `-e VISUAL_BASELINE_REVIEW=1` を追加して、末尾を `bash scripts/run-visual-container.sh --update` にします。

画像と環境JSONは一時領域へ書き、全条件成功後に一式を反映します。失敗時は既存の基準を保持し、コンテナからホストへも基準をコピーしません。

更新者はPRに変更理由を記載し、**別のレビュアーが旧/新PNGと実画面を確認してから承認**します。差分を消すためだけの一括更新は禁止。ブラウザ更新時も環境JSONと全PNGを同じPRでレビューします。

`npm run test:visual:guards` は、意図的にずらした図形、寸法違い、空白Docs、runtime errorのあるDocsを失敗として検出するnegative testです。

変更前後のレビューでは、PNGだけでなく `test/visual/fixtures.stories.tsx` の内容が削られていないことも確認してください。基準更新フラグは人のレビューの代替ではありません。

ブラウザ描画を含むnegative確認はコンテナ末尾を `bash scripts/run-visual-container.sh --probe-regression` にします。実際のChipを40pxずらした画像が拒否されることを確認し、基準画像は更新しません。
