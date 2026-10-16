import React from "react"
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native"

/** Web EmojiIcon と同じ語彙・値（issue #676）: sm=16 / md=24 / lg=36 / xl=48 */
export type EmojiIconSize = "sm" | "md" | "lg" | "xl"

export interface EmojiIconProps {
  /** 表示する絵文字（1 文字・1 書記素を想定） */
  emoji: string
  /** 寸法。既定 "md"（24pt） */
  size?: EmojiIconSize
  style?: StyleProp<ViewStyle>
}

const sizeMap: Record<EmojiIconSize, number> = { sm: 16, md: 24, lg: 36, xl: 48 }

/**
 * EmojiIcon — 絵文字をアイコンと同じ寸法の箱に収めて描く装飾（issue #676）。
 * 常に読み上げ対象外。意味は隣の見出し・本文で伝える。
 */
export function EmojiIcon({ emoji, size = "md", style }: EmojiIconProps) {
  const dim = sizeMap[size]
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: dim, height: dim, alignItems: "center", justifyContent: "center" }, style]}
    >
      <RNText allowFontScaling={false} style={{ fontSize: dim * 0.85, lineHeight: dim }}>
        {emoji}
      </RNText>
    </View>
  )
}
