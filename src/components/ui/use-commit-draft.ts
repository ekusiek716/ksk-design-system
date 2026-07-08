import * as React from "react"

/**
 * useCommitDraft — IME (日本語変換) を壊さない「確定時コミット」入力のための共通フック。
 *
 * store に直接 bind した controlled input は、変換 (composition) の途中で
 * onChange ごとに store へ書き込み、その値が value に書き戻されることで
 * IME の変換セッションが中断される。結果として「1 文字打つ毎に確定され、
 * 変換ができない」状態になる。
 *
 * 対策として local draft を保持し、
 *  - composition 中は commit しない (draft のみ更新 = DOM と React の値を一致させ、
 *    再レンダーで composition を妨げない)
 *  - compositionEnd / 非変換入力時のみ commit
 *  - 外部 (store) からの値変更は、変換中でなければ draft に反映 (realtime 同期等)
 * とすることで変換を維持する。
 *
 * CommitInput / CommitTextarea / CommitAutoGrowTextarea の 3 コンポーネントが
 * この 1 フックを共有し、ロジックを重複させない。
 */
export interface UseCommitDraftResult {
  /** 表示・入力に使う draft 値。value そのものではなくこちらを input に渡す。 */
  draft: string
  /**
   * 入力値変更を処理する。draft を更新し、変換中でなければ onCommit する。
   * @param next 新しい値
   * @param isComposingHint ブラウザの nativeEvent.isComposing 等の追加ヒント。
   *   isComposing を立てないブラウザに備え、内部 ref と併用してガードする。
   */
  handleChange: (next: string, isComposingHint?: boolean) => void
  /** compositionstart ハンドラ。変換開始を記録する。 */
  handleCompositionStart: () => void
  /**
   * compositionend ハンドラ。変換終了を記録し、確定値を commit する。
   * @param next 変換確定後の値
   */
  handleCompositionEnd: (next: string) => void
}

/**
 * composition ガードの純粋な判定関数。onChange 時に onCommit すべきか返す。
 *
 * commit してよいのは「変換中でない」かつ「ブラウザの isComposing ヒントも立っていない」
 * ときだけ。どちらか一方でも変換中を示すなら commit しない (draft のみ更新)。
 * この分岐が Commit 系入力の心臓部なので、フックから切り出して単体テストで固定する。
 *
 * @param composing 内部 ref が保持する変換中フラグ
 * @param isComposingHint nativeEvent.isComposing 等のブラウザ由来ヒント
 */
export function shouldCommitOnChange(
  composing: boolean,
  isComposingHint?: boolean,
): boolean {
  return !composing && !isComposingHint
}

export function useCommitDraft(
  value: string,
  onCommit: (value: string) => void,
): UseCommitDraftResult {
  const [draft, setDraft] = React.useState(value)
  const composingRef = React.useRef(false)
  // compositionend で onCommit(next) を呼んだ直後、同じ変更に対応する input
  // イベント（onChange）がブラウザによってはもう一度発火することがある。その
  // 時点では composingRef は既に false のため、ガード無しだと同一値で二重に
  // commit されてしまう。直前に compositionend で commit した値を憶えておき、
  // 直後の 1 回だけ同値の commit をスキップする（値が異なる＝別の変更なら
  // 通常通り commit する。安全側に倒すため値比較で判定する）。
  const lastCompositionCommitRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    // 変換中は外部値を draft に書き戻さない (composition セッションを維持)。
    if (!composingRef.current) setDraft(value)
  }, [value])

  const handleChange = React.useCallback(
    (next: string, isComposingHint?: boolean) => {
      setDraft(next)
      // 変換中は commit しない (compositionEnd で確定)。isComposing を
      // 立てないブラウザもあるため ref も併用してガードする。
      if (!shouldCommitOnChange(composingRef.current, isComposingHint)) return
      if (lastCompositionCommitRef.current === next) {
        // compositionend 直後の同値 change — skip-next-commit ガード。
        // 1 回消費したら解除し、以降の変更は通常通り commit する。
        lastCompositionCommitRef.current = null
        return
      }
      lastCompositionCommitRef.current = null
      onCommit(next)
    },
    [onCommit],
  )

  const handleCompositionStart = React.useCallback(() => {
    composingRef.current = true
  }, [])

  const handleCompositionEnd = React.useCallback(
    (next: string) => {
      composingRef.current = false
      setDraft(next)
      lastCompositionCommitRef.current = next
      onCommit(next)
    },
    [onCommit],
  )

  return { draft, handleChange, handleCompositionStart, handleCompositionEnd }
}
