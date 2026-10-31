# Shadow DOM での利用

DS が自前で扱うフォーカス判定は、open な Shadow root 内の実際のフォーカス要素まで辿ります。Dialog・Sheet・AlertDialog の開く前の位置の記録、DatePicker のポインター選択後の blur、ResponsiveOverlayFrame の入力判定、CollapsibleChipField の Escape に適用します。CollapsibleChipField は Shadow host がイベントを外へ出さない構成でも内部の capture で折りたたみます。

## 対応範囲と制約

Shadow DOM 全体への対応を保証するものではありません。Radix 内部のフォーカス制御は DS 自前の修正対象と別です。利用する Radix の版によって、Tabs・DropdownMenu の矢印移動、Dialog の Tab 巡回、RadioGroup の矢印選択が Shadow DOM やイベント分離下で正常に動かない場合があります。実際の利用構成で確認してください。

Select は Radix により document.body のスクロール・pointer events と外部要素の aria-hidden を制御します。ホストページへ埋め込む用途ではページ全体に影響します。描画先を PortalContainerProvider で指定しても、これらの document 単位の副作用は解消しません。

DS は Document.prototype.activeElement の書き換えを行いません。一般ページの実行環境でこの accessor を上書きすると、DS 以外のスクリプトの挙動も変わるためです。拡張機能側の isolated world で補正を使っている場合も、DS 更新だけを理由に撤去せず Radix の操作を別途確認してください。

closed な Shadow root を document から辿ることはできません。DS のオーバーレイの復帰先の自動取得は open な root が対象です。独自の closed root の利用者は onOpenAutoFocus / onCloseAutoFocus で明示的なフォーカス管理を行ってください。

## Dialog・Sheet・AlertDialog のフォーカス

AlertDialog は既定で、開くとキャンセルへ移動します。Dialog・Sheet（snap・swipe の各版を含む）・AlertDialog は、閉じるとその回に開く直前の要素へ戻ります。Trigger を使わず open を状態で制御する構成にも適用します。開くたびに戻り先を記録し直すため、一覧の行ごとのボタンから 1 つの Dialog / Sheet を開く構成でも、毎回その行のボタンへ戻ります。戻るときはスクロールさせません。

戻る要素が消滅・disabled・inert の場合や、開く前のフォーカスが body だった場合は、その要素への強制復帰を行わず、Radix の既定（Trigger があれば Trigger）に任せます。操作後に一覧全体を消すなど別の戻り先が必要な画面は onCloseAutoFocus で preventDefault し、画面に合った位置へ移してください。restoreFocusOnClose={false} で自動復帰を無効にできます。

## Portal と Toast の描画先

Shadow DOM 内で Toast を使う場合は、`PortalContainerProvider` 配下に `<Toaster />` を明示的に置いてください。`toast()` が自動作成するグローバルrootは `document.body` に独立してマウントされ、アプリ側Providerの描画先を取得できません。明示ToasterにはProviderの描画先が適用され、必要なら `container` prop で個別に指定できます。

描画先の優先順位は、部品の明示的な `container` prop、Provider、既定の `document.body` です。`container={null}` も明示指定として優先され、Providerを使わず既定の描画先へ戻します。Providerを継承するときは `container` を省略（`undefined`）してください。
