# ConsumerへのDS公開通知

対象は `ekusiek716` 配下です。依頼登録でapp issueを公開待ちにし、DSの一括bump時だけ公開通知します。appの取り込み完了とは区別します。

## 依頼を登録する

1. DSの通常issueと、app側の取り込みを追跡する通常issueを作ります。PRのURL・番号は依頼issueとして使えません。
2. DS正本repoの作業ブランチで、sourceのCLIを実行します。未publishのCLIではnpxが旧公開版を拾うため、次のコマンドを使います。

```bash
node bin/init.js register-consumer-request --ds-issue 531 --consumer-issue https://github.com/ekusiek716/trip-todo/issues/168
```

登録は既存の `gh` 認証を使います。両repoのissueを読めて、appのラベルを作成・付与できる権限が必要です。両方が通常issueであることを確認して台帳を保存し、app issueへ `ds:waiting` を自動で付けます。ラベルが無ければ作成します。closedまたは `ds:released` のissueには待機ラベルを付けません。既存ラベルを置き換えたりissueを再開したりしません。

3. 修正PRの番号が決まったら同じ依頼に紐付け、台帳変更をDSのPRに含めます。

```bash
node bin/init.js register-consumer-request --ds-issue 531 --consumer-issue https://github.com/ekusiek716/trip-todo/issues/168 --fix-pr 532
```

CLI公開後は `npx ksk-ds register-consumer-request` に同じ引数を渡すこともできます。`--dry-run` は通信も書き込みも行わず、変更後のJSONだけ表示します。そのためissueの実在・通常issueかどうか・gh権限はdry-runでは未確認です。

認証・API・ファイル操作の失敗は非zeroで終了します。ラベル付与だけ失敗した場合は保存済み台帳が残ります。ghの認証・権限を直して同じ登録コマンドを再実行すると、台帳を重複追加せずラベルを再試行できます。途中の成功を全体成功とは扱いません。

## 台帳の契約

`contracts/consumer-requests.json` は `{schemaVersion:1,requests:[{dsIssue,consumerIssue,fixPr}]}` の累積台帳です。新規の修正PR未定は `fixPr:null`、既存登録への `--fix-pr` 省略は値を維持します。同じDS issueとapp issueは更新し、複数appの登録を保持します。URLは小文字に正規化し、issue・PR番号は正の安全な整数だけを受け付けます。公開後も過去のentryを削除しません。実物の台帳もruntime共通validatorを通じて `npm test` で検証します。

登録は `package.json` の名前が `ksk-design-system` で、`.git` と `contracts/` があるDS正本ルートでのみ可能です。consumerやnode_modulesの台帳は編集しません。

## 一括bump時の公開通知

通常のnpm公開後、DSの `scripts/update-consumers.sh VERSION` による一括bumpで通知します。指定versionの公開metadata・公開commitの台帳・修正PRの包含を確認し、該当app issueへbump PR付きの公開済みコメントと `ds:released` を付けます。同じapp issueに複数のDS依頼がある場合、公開台帳内の該当依頼がすべて公開・通知済みになるまで `ds:waiting` を残します。その間は `ds:released` と併存する場合があります。不正entryや処理失敗がある場合も待機ラベルを保持します。未公開fix・pending・未マージの修正は通知対象にしません。旧公開versionに台帳が無ければ待機します。

通知runtimeの引数契約は `--repo owner/repo --version VERSION --bump-pr URL [--apply]` です。通知は一括bumpの処理に任せ、単独の実通知は運用手順にしません。登録CLIは公開済みコメントを投稿しません。appは依存更新・暫定回避策撤去・動作確認を終えてから追従issueを閉じます。

通知にはrepo owner本人（`ekusiek716`）のPATによるgh認証を使用します。対象repoのissue書き込み権限が必要で、別ユーザーやGitHub Appのinstallation tokenは通知主体に使いません。

通知に失敗した場合は作成済みbump PRを保持し、原因を解消して同じversion・対象repoの一括bumpを再実行します。既存PRを再利用して、未完了の通知・ラベル処理を修復します。runtime単独での実通知や、一括bumpとruntimeを並列実行する運用は禁止です。重複投稿を避けるため、同じ対象への一括bumpも直列で実行します。

## 旧pollingからの移行

app側の `.github/workflows/ds-release-notices.yml` と `.github/scripts/check-ds-release.mjs` は削除してください。6時間scheduleもworkflow_dispatchも使用しません。`init-release-notices` は廃止案内を出して非zero終了し、ファイルを配置しません。通常のinstall/postinstallでも配置しません。

GitHub Actionsのrepo限定tokenを使うreceiver方式は廃止しました。登録・一括bumpには操作者の既存gh認証を使い、対象repoへの権限を確認します。この変更自体ではversion bump・publish・実通知は行いません。
