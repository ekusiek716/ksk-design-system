/**
 * IME（日本語入力）変換中の keydown を見分けるための判定。
 *
 * 日本語 IME では「変換を確定する Enter」と「入力を送信する Enter」が同じキーで、
 * keydown は両方で発火する。区別せずに Enter を処理すると、変換確定の Enter で
 * 未確定文字がそのまま送信・タグ化され、以降の変換操作が失われる（issue #301）。
 * 読点「、」の入力でも `,` keydown が変換中に発火しうるため、`,` 分岐も同じガードが要る。
 *
 * 判定は2段構え:
 *  1. `nativeEvent.isComposing` — 標準。モダンブラウザはこれで足りる
 *  2. `nativeEvent.keyCode === 229` — 一部の Android WebView / 旧 IME が
 *     `isComposing` を立てずに 229（"process" キー）だけを送ってくるための保険。
 *     Capacitor 経由で Android WebView に載る consumer があるため落とさない
 *
 * 注: RN の TextInput には composition イベントが無いためこの関数は Web 専用。
 * react-native-web 上の同等ガードは `src/native/use-web-composition-guard.ts` が担う。
 */

/** 変換中判定に必要な最小限の形状（React.KeyboardEvent と DOM KeyboardEvent の両方を受ける）。 */
export interface ImeComposableKeyEvent {
  nativeEvent?: { isComposing?: boolean; keyCode?: number }
  isComposing?: boolean
  keyCode?: number
}

/** IME 変換中の keydown なら true。true の間は Enter / `,` を確定操作として扱わない。 */
export function isImeComposing(event: ImeComposableKeyEvent): boolean {
  const source = event.nativeEvent ?? event
  return source.isComposing === true || source.keyCode === 229
}
