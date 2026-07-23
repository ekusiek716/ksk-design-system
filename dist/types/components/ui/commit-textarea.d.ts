import * as React from "react";
import { Textarea } from "./textarea";
/**
 * CommitTextarea — IME (日本語変換) を壊さない Textarea の「確定時コミット」版。
 *
 * `value` + `onCommit` の contract。CommitInput と同じ流儀で、変換中は commit せず
 * compositionEnd / 非変換入力時のみ onCommit する。視覚は Textarea に完全委譲する。
 *
 * @example
 * <CommitTextarea value={memo} onCommit={setMemo} placeholder="メモ" />
 */
export type CommitTextareaProps = Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange"> & {
    value: string;
    onCommit: (value: string) => void;
};
export declare function CommitTextarea({ value, onCommit, ...props }: CommitTextareaProps): React.JSX.Element;
