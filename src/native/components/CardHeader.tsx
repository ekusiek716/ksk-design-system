import React from "react"
import { View, Text as RNText, type ViewProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo, type TypoVariant } from "../typography"

export interface CardHeaderProps extends ViewProps {
  eyebrow?: string
  title: string
  /** 既定 heading.xl */
  titleVariant?: TypoVariant
  /**
   * 見出し先頭に添える装飾アイコン等。タップ可能要素は置かない
   * （押下は Card/親側の責務。ここは視覚的な装飾専用スロット）。
   */
  titleLeading?: React.ReactNode
  description?: string
  trailing?: React.ReactNode
  /** 画像/グラデーション等の media 上に載せる場合は "on-primary"。既定 "default" */
  tone?: "default" | "on-primary"
}

/** カード冒頭の eyebrow+見出し+説明。余白（4px/4px）を内蔵し利用側の mt-* 手書きを不要にする。 */
export function CardHeader({
  eyebrow,
  title,
  titleVariant = "heading.xl",
  titleLeading,
  description,
  trailing,
  tone = "default",
  style,
  ...rest
}: CardHeaderProps) {
  const { theme, scales } = useTheme()

  const eyebrowColor = tone === "on-primary" ? theme.text["on-media"] : theme.text["accent-primary"]
  const titleColor = tone === "on-primary" ? theme.text["on-media"] : theme.text["high-emphasis"]
  const descriptionColor = tone === "on-primary" ? theme.text["on-media-secondary"] : theme.text["medium-emphasis"]

  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: scales.spacing.scale[2] },
        style,
      ]}
      {...rest}
    >
      <View style={{ flex: 1 }}>
        {eyebrow && (
          <RNText
            style={[
              resolveTypo("label.sm"),
              { color: eyebrowColor, marginBottom: scales.spacing.scale[1] },
            ]}
          >
            {eyebrow}
          </RNText>
        )}
        {titleLeading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: scales.spacing.scale[1] }}>
            {titleLeading}
            {/* 長文 title がアイコンの分だけ行からはみ出さないよう縮小を許可する */}
            <RNText style={[resolveTypo(titleVariant), { color: titleColor, flexShrink: 1 }]}>{title}</RNText>
          </View>
        ) : (
          <RNText style={[resolveTypo(titleVariant), { color: titleColor }]}>{title}</RNText>
        )}
        {description && (
          <RNText
            style={[
              resolveTypo("body.md"),
              { color: descriptionColor, marginTop: scales.spacing.scale[1] },
            ]}
          >
            {description}
          </RNText>
        )}
      </View>
      {trailing}
    </View>
  )
}
