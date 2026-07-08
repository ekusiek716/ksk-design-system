import * as React from "react"
import { TextInput } from "react-native"
import { Textarea, type TextareaProps } from "./Textarea"
import { useCommitDraft } from "../use-commit-draft"
import { useWebCompositionGuard } from "../use-web-composition-guard"

/**
 * CommitTextarea (native) — IME (日本語変換) を壊さない Textarea の「確定時コミット」版。
 * 正本: src/components/ui/commit-textarea.tsx（Web 版）。CommitInput と同じ流儀。
 *
 * @example
 * <CommitTextarea value={memo} onCommit={setMemo} placeholder="メモ" />
 */
export type CommitTextareaProps = Omit<TextareaProps, "value" | "onChangeText"> & {
  value: string
  onCommit: (value: string) => void
}

export function CommitTextarea({ value, onCommit, ...props }: CommitTextareaProps) {
  const { draft, handleChange, handleCompositionStart, handleCompositionEnd } =
    useCommitDraft(value, onCommit)
  const inputRef = React.useRef<TextInput>(null)

  useWebCompositionGuard(inputRef, handleCompositionStart, handleCompositionEnd)

  return (
    <Textarea
      {...props}
      ref={inputRef}
      value={draft}
      onChangeText={(text) => handleChange(text)}
    />
  )
}
