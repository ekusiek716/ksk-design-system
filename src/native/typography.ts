import type { TextStyle } from "react-native"
import { scales } from "../tokens/native"

export type TypoVariant =
  | `heading.${"3xl" | "2xl" | "xl" | "lg" | "md" | "sm"}`
  | `body.${"lg" | "md" | "sm" | "xs"}`
  | `label.${"lg" | "md" | "sm" | "xs"}`
  | `display.${"xl" | "lg"}`
  | "caption"

export type TypoStyle = Pick<TextStyle, "fontSize" | "fontWeight" | "lineHeight" | "letterSpacing">

/**
 * typo トークンを RN TextStyle に解決する。`group.size`（heading.md 等）のドット記法に対応。
 * caption のみ size を持たないフラット定義。
 */
export function resolveTypo(variant: TypoVariant): TypoStyle {
  if (variant === "caption") return { ...scales.typography.caption }
  const [group, size] = variant.split(".") as ["heading" | "body" | "label" | "display", string]
  const groupStyles = scales.typography[group] as unknown as Record<string, TypoStyle>
  return { ...groupStyles[size] }
}
