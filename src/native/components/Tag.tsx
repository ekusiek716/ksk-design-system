import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type TagTone = "neutral" | "accent" | "success" | "caution" | "warning" | "info"
export type TagVariant = "filled" | "outline"

/**
 * カテゴリ識別色のインデックス（1..16）。`scales.categorical[n]` に対応する。
 * web 版（src/components/patterns/tag.tsx の `TagCategorical`）と同じ語彙。
 */
export type TagCategorical = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

export interface TagProps {
  tone?: TagTone
  variant?: TagVariant
  /**
   * カテゴリ識別色（1..16）。指定すると `tone` の配色より優先され、
   * `scales.categorical[n].subtle` 背景 + `scales.categorical[n].bold` 文字になる。
   *
   * Brand に連動しないテーマ非依存の質的パレット（`tokens.json` の
   * `colors.semantic.categorical` が正本、web/native 共通の hex）。
   * 「N 番目のカテゴリ」を色で区別する用途にだけ使う。ステータス（成功・警告）は
   * `tone` を使うこと。
   *
   * @example
   * // exam-kit の用語集: 分野ラベルを色分け（GlossaryBrowser.tsx）
   * <Tag categorical={fieldIndex} dot>{fieldName}</Tag>
   */
  categorical?: TagCategorical
  /**
   * `categorical` 指定時に、ラベル左へ `scales.categorical[n].base` のドットを出す。
   * 色だけに頼らずカテゴリの区別を補助する。`categorical` 無指定では無視される。
   */
  dot?: boolean
  children: React.ReactNode
}

/** 表示専用ラベル。Chip と違いインタラクション無し。 */
export function Tag({ tone = "neutral", variant = "filled", categorical, dot = false, children }: TagProps) {
  const { theme, scales } = useTheme()

  const fills: Record<TagTone, { bg: string; fg: string }> = {
    neutral: { bg: theme.surface.tertiary, fg: theme.text["medium-emphasis"] },
    accent: { bg: theme.surface["accent-primary-light"], fg: theme.text["accent-primary"] },
    success: { bg: theme.surface.success, fg: theme.text.success },
    caution: { bg: theme.surface.caution, fg: theme.text.caution },
    warning: { bg: theme.surface.warning, fg: theme.text.warning },
    info: { bg: theme.surface.info, fg: theme.text.info },
  }
  const outlines: Record<TagTone, { fg: string; border: string }> = {
    neutral: { fg: theme.text["medium-emphasis"], border: theme.border["medium-emphasis"] },
    accent: { fg: theme.text["accent-primary"], border: theme.border["accent-primary"] },
    success: { fg: theme.text.success, border: theme.border.success },
    caution: { fg: theme.text.caution, border: theme.border.caution },
    warning: { fg: theme.text.warning, border: theme.border.warning },
    info: { fg: theme.text.info, border: theme.border.info },
  }

  // categorical はテーマ非依存の固定パレットなので tone/variant の配色より優先する
  // （web 版 tag.tsx と同じ優先順位）。文字は必ず bold（base は明色相だと白背景で
  // コントラストが足りない。src/styles/categorical.css の注記）。
  const categoricalColors = categorical ? scales.categorical[String(categorical) as keyof typeof scales.categorical] : null

  const c = categoricalColors
    ? { bg: categoricalColors.subtle, fg: categoricalColors.bold }
    : variant === "filled"
      ? fills[tone]
      : null
  const o = !categoricalColors && variant === "outline" ? outlines[tone] : null

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: categorical && dot ? scales.spacing.scale[1] : 0,
        backgroundColor: c?.bg ?? "transparent",
        borderColor: o?.border,
        borderWidth: !categoricalColors && variant === "outline" ? 1 : 0,
        borderRadius: scales.borderRadius.sm,
        paddingVertical: scales.spacing.scale[1],
        paddingHorizontal: scales.spacing.scale[2],
        alignSelf: "flex-start",
      }}
    >
      {categoricalColors && dot ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: categoricalColors.base,
          }}
        />
      ) : null}
      <RNText style={[resolveTypo("label.xs"), { color: c?.fg ?? o?.fg ?? theme.text["medium-emphasis"] }]}>
        {children}
      </RNText>
    </View>
  )
}
