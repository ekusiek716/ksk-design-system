import * as React from "react"
import { AutoGrowTextarea } from "./auto-grow-textarea"
import { useCommitDraft } from "./use-commit-draft"

/**
 * CommitAutoGrowTextarea — IME (日本語変換) を壊さない AutoGrowTextarea の
 * 「確定時コミット」版。`value` + `onCommit` の contract。
 *
 * DS の AutoGrowTextarea は onChange が (value: string) を渡す /
 * compositionStart・End を textarea props として素通しできる契約なので、
 * CommitTextarea と同じ流儀で local draft + composition ガードを載せる。
 *
 * AutoGrowTextarea の onChange は素の change イベントに isComposing が
 * 乗ってこない (value 文字列のみ) ため、変換中判定は内部 composingRef 一本で行う。
 *
 * @example
 * <CommitAutoGrowTextarea value={memo} onCommit={setMemo} minRows={3} />
 */
export type CommitAutoGrowTextareaProps = Omit<
  React.ComponentProps<typeof AutoGrowTextarea>,
  "value" | "onChange"
> & {
  value: string
  onCommit: (value: string) => void
}

export function CommitAutoGrowTextarea({
  value,
  onCommit,
  ...props
}: CommitAutoGrowTextareaProps) {
  const { draft, handleChange, handleCompositionStart, handleCompositionEnd } =
    useCommitDraft(value, onCommit)

  return (
    <AutoGrowTextarea
      {...props}
      value={draft}
      onChange={(v) => handleChange(v)}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={(e) => handleCompositionEnd(e.currentTarget.value)}
    />
  )
}
