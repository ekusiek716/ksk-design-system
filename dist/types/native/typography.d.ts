import type { TextStyle } from "react-native";
export type TypoVariant = `heading.${"3xl" | "2xl" | "xl" | "lg" | "md" | "sm"}` | `body.${"lg" | "md" | "sm" | "xs"}` | `label.${"lg" | "md" | "sm" | "xs"}` | `display.${"xl" | "lg"}` | "caption" | "caption-strong" | "prose-meta";
export type TypoStyle = Pick<TextStyle, "fontSize" | "fontWeight" | "lineHeight" | "letterSpacing">;
/**
 * typo トークンを RN TextStyle に解決する。`group.size`（heading.md 等）のドット記法に対応。
 * caption / caption-strong / prose-meta のみ size を持たないフラット定義。
 * caption-strong は出典・著作権表示など強調が必要な 11px 注釈専用（font-semibold 相当）。
 * prose-meta は Prose/DocumentScreen の最終更新日等のメタ情報専用（13px/font-semibold 相当）。
 */
export declare function resolveTypo(variant: TypoVariant): TypoStyle;
