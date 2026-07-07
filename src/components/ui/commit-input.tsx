import * as React from "react"
import { Input } from "./input"
import { useCommitDraft } from "./use-commit-draft"

/**
 * CommitInput — IME (日本語変換) を壊さない Input の「確定時コミット」版。
 *
 * `value` + `onCommit` の contract。store 直結の inline 編集などで、
 * 変換中に onChange が store へ書き込んで変換が中断される問題を防ぐ。
 * 視覚は Input に完全委譲し、local draft + composition ガードのみ載せる。
 *
 * - 変換中は commit せず draft のみ更新
 * - compositionEnd / 非変換入力時のみ onCommit
 * - 外部 value 変更は非変換中のみ draft へ反映 (realtime 同期対応)
 *
 * @example
 * <CommitInput value={name} onCommit={setName} placeholder="名前" />
 */
export type CommitInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange"
> & {
  value: string
  onCommit: (value: string) => void
}

export function CommitInput({ value, onCommit, ...props }: CommitInputProps) {
  const { draft, handleChange, handleCompositionStart, handleCompositionEnd } =
    useCommitDraft(value, onCommit)

  return (
    <Input
      {...props}
      value={draft}
      onChange={(e) =>
        handleChange(e.target.value, (e.nativeEvent as InputEvent).isComposing)
      }
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={(e) => handleCompositionEnd(e.currentTarget.value)}
    />
  )
}
