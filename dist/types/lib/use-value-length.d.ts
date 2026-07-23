import * as React from "react";
type CountableElement = HTMLInputElement | HTMLTextAreaElement;
type CountableValue = string | number | readonly string[] | undefined;
/**
 * showCount 用の内部フック。
 *
 * controlled value は props、uncontrolled value は実 DOM を正本にする。
 * 後者により react-hook-form の reset() など、ref 経由で直接 value が
 * 書き換わるケースにも追従する。IME composition 中は表示値を固定し、
 * compositionend で確定後の DOM 値へ同期する。
 */
export declare function useValueLength<T extends CountableElement>({ enabled, value, defaultValue, forwardedRef, }: {
    enabled: boolean;
    value: CountableValue;
    defaultValue: CountableValue;
    forwardedRef: React.Ref<T> | undefined;
}): {
    ref: (node: T | null) => void;
    getElement: () => T;
    length: number;
    syncFromDom: () => void;
    beginComposition: () => void;
    endComposition: () => void;
};
export {};
