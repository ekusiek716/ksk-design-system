import * as React from "react";
import { type TextareaProps } from "./Textarea";
/**
 * CommitTextarea (native) — IME (日本語変換) を壊さない Textarea の「確定時コミット」版。
 * 正本: src/components/ui/commit-textarea.tsx（Web 版）。CommitInput と同じ流儀。
 *
 * @example
 * <CommitTextarea value={memo} onCommit={setMemo} placeholder="メモ" />
 */
export type CommitTextareaProps = Omit<TextareaProps, "value" | "onChangeText"> & {
    value: string;
    onCommit: (value: string) => void;
};
export declare function CommitTextarea({ value, onCommit, ...props }: CommitTextareaProps): React.JSX.Element;
