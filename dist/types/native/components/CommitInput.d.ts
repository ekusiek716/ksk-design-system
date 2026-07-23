import * as React from "react";
import { type InputProps } from "./Input";
/**
 * CommitInput (native) — IME (日本語変換) を壊さない Input の「確定時コミット」版。
 * 正本: src/components/ui/commit-input.tsx（Web 版。API/セマンティクスはこちらと対応）。
 *
 * `value` + `onCommit` の contract。store 直結の inline 編集などで、変換中に
 * onChangeText が store へ書き込んで変換が中断される問題を防ぐ。
 *
 * - ネイティブ実機 (iOS/Android): composition イベント自体が存在しないため、
 *   onChangeText のたびに commit する（blur/変更のたびに確定で問題ない）。
 * - react-native-web (RNW): 実体が DOM の input 要素のため、Web 版と同じ composition
 *   ガードが必要。TextInput の ref から DOM ノードを取得し、compositionstart/end を
 *   直接購読して変換中は commit を止める。
 *
 * @example
 * <CommitInput value={name} onCommit={setName} placeholder="名前" />
 */
export type CommitInputProps = Omit<InputProps, "value" | "onChangeText"> & {
    value: string;
    onCommit: (value: string) => void;
};
export declare function CommitInput({ value, onCommit, ...props }: CommitInputProps): React.JSX.Element;
