import * as React from "react"
import { TextInput } from "react-native"
import { AutoGrowTextarea, type AutoGrowTextareaProps } from "./AutoGrowTextarea"
import { useCommitDraft } from "../use-commit-draft"
import { useWebCompositionGuard } from "../use-web-composition-guard"

/**
 * CommitAutoGrowTextarea (native) — IME (日本語変換) を壊さない AutoGrowTextarea の
 * 「確定時コミット」版。正本: src/components/ui/commit-auto-grow-textarea.tsx（Web 版）。
 *
 * @example
 * <CommitAutoGrowTextarea value={memo} onCommit={setMemo} minHeight={80} />
 */
export type CommitAutoGrowTextareaProps = Omit<AutoGrowTextareaProps, "value" | "onChangeText"> & {
  value: string
  onCommit: (value: string) => void
}

export function CommitAutoGrowTextarea({ value, onCommit, ...props }: CommitAutoGrowTextareaProps) {
  const { draft, handleChange, handleCompositionStart, handleCompositionEnd } =
    useCommitDraft(value, onCommit)
  const inputRef = React.useRef<TextInput>(null)

  useWebCompositionGuard(inputRef, handleCompositionStart, handleCompositionEnd)

  return (
    <AutoGrowTextarea
      {...props}
      ref={inputRef}
      value={draft}
      onChangeText={(text) => handleChange(text)}
    />
  )
}
