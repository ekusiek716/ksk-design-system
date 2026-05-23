import * as React from "react";
/**
 * `required` の見た目をどう出すか。
 * - "asterisk"（既定）: `*` 1 文字。コンパクト・国際標準。
 * - "pill"   : 「必須」/「任意」のバッジ。日本語フォーム慣習。
 *              required=false でも「任意」を明示するため、optional 側の表示も
 *              この prop が制御する。
 * - "none"   : 何も出さない。required 単独で aria 属性のみ意味を持つ。
 */
type RequiredStyle = "asterisk" | "pill" | "none";
interface FormFieldProps extends React.ComponentProps<"div"> {
    label: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    description?: string;
    /**
     * required の表示形式。詳細は RequiredStyle の JSDoc。
     * 既定: "asterisk"。
     */
    requiredStyle?: RequiredStyle;
    /**
     * ラベル右側に置くメタ情報（バッジ / 文字数カウンタ / ヘルプアイコン等）。
     * 「タイトル + 字数 12/200」「タイトル + 種別バッジ」のような用途。
     */
    endLabel?: React.ReactNode;
}
declare function FormField({ className, label, htmlFor, required, error, description, requiredStyle, endLabel, children, ...props }: FormFieldProps): import("react/jsx-runtime").JSX.Element;
export { FormField };
export type { FormFieldProps, RequiredStyle };
