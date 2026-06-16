import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
export interface CheckboxFieldProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
    /** インラインラベル（同意文・確認文など）。リンク等の ReactNode 可。 */
    label: React.ReactNode;
    /** ラベル下の補足説明。 */
    description?: React.ReactNode;
    /** エラーメッセージ。指定時は aria-invalid + Caution 色で表示。 */
    error?: string;
    /** 外側コンテナのクラス（チェックボックス本体の整列スタイルは固定）。 */
    className?: string;
}
/**
 * CheckboxField — フォーム内の単体チェックボックス（同意 / 確認用）。
 *
 * filter・設定行用の `<Checkbox label>`（hover 背景・行 padding・件数バッジ付き）とは
 * 役割が別。フォームフィールドとして「チェック + インラインラベル + 任意の説明 / エラー」を
 * DS 正準の縦整列（typo-body-md の行高 24.5px に 20px チェックを mt-0.5 で中央化）で出す。
 * ラベルが折り返しても items-start で先頭行に整列する。
 *
 * 目的: checkbox と label を画面側で手組みして mt / 行高がズレるのを防ぐ正準コンポーネント。
 */
declare function CheckboxField({ label, description, error, className, id, ...props }: CheckboxFieldProps): import("react/jsx-runtime").JSX.Element;
export { CheckboxField };
