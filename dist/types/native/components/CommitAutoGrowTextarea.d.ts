import * as React from "react";
import { type AutoGrowTextareaProps } from "./AutoGrowTextarea";
/**
 * CommitAutoGrowTextarea (native) — IME (日本語変換) を壊さない AutoGrowTextarea の
 * 「確定時コミット」版。正本: src/components/ui/commit-auto-grow-textarea.tsx（Web 版）。
 *
 * @example
 * <CommitAutoGrowTextarea value={memo} onCommit={setMemo} minHeight={80} />
 */
export type CommitAutoGrowTextareaProps = Omit<AutoGrowTextareaProps, "value" | "onChangeText"> & {
    value: string;
    onCommit: (value: string) => void;
};
export declare function CommitAutoGrowTextarea({ value, onCommit, ...props }: CommitAutoGrowTextareaProps): React.JSX.Element;
