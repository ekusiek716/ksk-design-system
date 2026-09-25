# Native Device Review

React Native Webではなく、iOS/AndroidのReact NativeランタイムでDSの現在のソースを検証する小さなExpoアプリです。ストア配布・認証・外部通信・保存APIはありません。

## 起動

```sh
cd examples/native-device-review
npm ci
npm run check
npm run ios        # Xcode simulator / 接続端末
npm run android    # Android SDK + emulator / 接続端末
```

Expo Goを使用する場合は `npm start`。このアプリと同じSDKをサポートするExpo Goが必要です。`ios`/`android`は専用開発ビルドを作るためGoの版に依存しません。既存アプリとは異なるbundle IDを使用します。

`npm run export:ios` / `npm run export:android` はJSをbundleするだけです。実OSの合格判定には使いません。

## 確認項目

1. ノッチ付き端末で上下のsafe area値が0でないこと、回転後に追従することを確認。
2. シートを開き、最初と最後の項目に日本語入力。ソフトキーボードを表示したまま対象欄と保存ボタンへ到達できるか確認。シミュレータはハードウェアキーボード接続を解除。
3. シートを0.5と0.9の高さへドラッグ。本文スクロールと競合しないこと、閉じて再表示を5回繰り返して見えないModalが操作を塞がないことを確認。
4. OSのアクセシビリティ設定で文字を最大に拡大。ラベル・説明・ボタンが欠けず、操作へ到達できることを確認。アプリ内の文字倍率表示で設定反映を確認。
5. ライト/ダーク両方で文字・入力境界・押せる面を確認。
6. VoiceOver / TalkBackを有効にし、項目名、Modal内の移動、閉じる操作を確認。

## 記録

`contracts/native-device-verification.json` の `observations` に、実際に操作した項目だけを追記します。

```json
{
  "checkId": "keyboard",
  "components": ["Input", "Sheet"],
  "platform": "ios",
  "os": "実際のOS版",
  "device": "実際の機種と実機/simulatorの別",
  "revision": "検証したgit SHA",
  "checkedAt": "ISO日時",
  "status": "passed または failed",
  "evidence": "スクリーンショット/録画/操作ログのパス",
  "notes": "実施した操作と結果"
}
```

未確認は記録を作らず、対応表に「未検証」と表示します。OS更新・DS変更後は過去の合格を現在の保証としません。`node scripts/generate-native-support.mjs` で対応表を再生成します。

## 配布物との違い

このアプリはリポジトリの `src/native` を直接参照するため、未公開の修正を実OSで確認できます。npm配布物のexport・依存解決の検証は別の `npm run test:consumer:native` が担当します。このアプリの成功だけで公開パッケージの取り込み完了とはしません。
