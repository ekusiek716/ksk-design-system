# ConsumerへのDS公開通知

DS修正のnpm公開を、依頼元appのGitHub issueへ知らせる仕組みです。現在の対象は `ekusiek716` 配下です。DS側は累積台帳を配布し、app側が公開状況を取得して自分のrepoにコメントと `ds:released` ラベルを付けます。app issueは依存更新・取り込み・動作確認が終わるまで閉じません。

## 依頼の登録と修正PRの紐付け

1. app repoに取り込みを追跡するissueを作り、対応するDS issueを記載します。
2. DS正本repoルートでpending登録します。登録済みのapp追従issueには任意で `ds:waiting` を設定できます。

```bash
npx ksk-ds register-consumer-request --ds-issue 531 --consumer-issue https://github.com/ekusiek716/trip-todo/issues/168
```

3. 修正PRを作成したら、同じ依頼に `fixPr` を紐付けます。

```bash
npx ksk-ds register-consumer-request --ds-issue 531 --consumer-issue https://github.com/ekusiek716/trip-todo/issues/168 --fix-pr 532
```

変更前に `--dry-run` を追加するとJSONのプレビューのみ表示します。CLIはネットワークを使用しません。`package.json` の名前が `ksk-design-system` で、`.git` と `contracts/` がある正本ルートでのみ登録可能です。consumerの `node_modules` 内を直接編集しません。

`contracts/consumer-requests.json` は `{schemaVersion:1,requests:[{dsIssue,consumerIssue,fixPr}]}` の累積台帳です。新規で修正PR未定なら `fixPr:null`、既存登録への `--fix-pr` 省略は値を維持します。同じDS issueとapp issueは重複追加せず更新し、複数appの登録を保持します。URLは小文字に正規化し、正の安全な整数とGitHub issue URLだけを受け付けます。公開後も過去のentryを削除しません。実物の台帳も `npm test` で検証します。

## app側への明示導入

通知CLIを含むDSを用意し、app repoのルートで実行します。

```bash
npx ksk-ds init-release-notices
```

`.github/workflows/ds-release-notices.yml` と `.github/scripts/check-ds-release.mjs` をtemplateから配置します。この2ファイルをappのdefault branchへ取り込みます。既存ファイルが同内容ならno-op、異なるなら書き込まず失敗します。差分を確認して手動で統合してください。`--force` はありません。通常のinstall/postinstallや `ksk-ds init` では導入しません。

workflowはNode 24で動き、npm install不要です。権限は `contents:read` と `issues:write`、そのrepoの `GITHUB_TOKEN` を `GH_TOKEN` として渡します。GitHubの標準tokenはrepoに限定されるため、DS repoから別appへ書く方式にはせず、app側のreceiverが自分のissueへ通知します。cross-repo tokenは不要です。

## 公開判定・通知・復旧

通常のnpm公開後、app workflowが約6時間ごとにnpm公開metadataと公開commitのregistryを取得します。修正PRのmerge commitが公開gitHeadに含まれることを確認するので、mainに登録・マージされただけの未公開fixは通知しません。既存の公開versionにregistryが無い場合は待機no-opです。pendingや未マージ・未公開の修正も待機します。

公開済みならapp issueにコメントと `ds:released` を付け、`ds:waiting` があれば外します。これはDS公開の通知であり、app取り込み完了ではありません。app issueを自動で閉じません。

scheduleは約6時間分の検知待ちに加えGitHub側の遅延があり、即時性は保証されません。public repoでは60日間の非活動によりscheduleが無効化されることがあります。Actions画面で **DS release notices** を有効化し、**Run workflow**（`workflow_dispatch`）で再実行してください。急ぐ場合や失敗後の再試行も同じ手順です。

ローカルではdry-runのみ実行します（`--apply` は付けません）。

```bash
node .github/scripts/check-ds-release.mjs --repo ekusiek716/trip-todo
```

実通知はGitHub Actions内でのみ実行します。ローカルPATによる通知はbotと投稿者が異なり重複判定が不一致になるため、手動通知も必ず `workflow_dispatch` を使います。

参考: [GitHub標準tokenの権限範囲](https://docs.github.com/en/actions/concepts/security/github_token)、[scheduleの実行条件](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)。
