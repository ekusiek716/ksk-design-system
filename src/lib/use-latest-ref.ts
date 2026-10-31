import * as React from "react"

// native（tsconfig.native.json）は DOM 型を持たないので globalThis 越しに見る。
// React Native には window があり layout effect になる。SSR（window なし）だけ effect に落とす。
const useIsomorphicLayoutEffect =
  typeof (globalThis as { window?: unknown }).window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

/**
 * 最新の値（主に呼び出し側のコールバック）を ref に持つ内部フック（#812）。
 *
 * タイマーや購読を張る effect の依存配列にコールバックを入れると、consumer が
 * `onDone={() => setX(false)}` のようにその場の関数で渡したとき、親の再描画の
 * たびに effect の後始末でタイマーが巻き戻る。コールバックはこの ref 越しに
 * 呼び、effect の依存からは外すこと。期限時には最新のコールバックが呼ばれる。
 *
 * 更新は layout effect で行う（passive effect より先に走るので、同じ commit の
 * useEffect から読んでも最新になる）。render 中には書き込まない。
 * Web と React Native（src/native）の両方から使う。
 */
export function useLatestRef<T>(value: T): React.RefObject<T> {
  const ref = React.useRef(value)
  useIsomorphicLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
