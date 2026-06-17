import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { socialIconBrandConfig, type SocialIconBrand } from "./social-icon-data"

export type { SocialIconBrand }

export interface SocialIconProps {
  brand: SocialIconBrand
  size?: number
}

/**
 * Web側のSocialIconはSVGでブランドロゴを忠実再現するが、
 * RN側はサードパーティに依存しないので「ブランド色 + 1〜2文字」での簡略表現。
 * ブランドカラー定数は ./social-icon-data に分離している。
 */
export function SocialIcon({ brand, size = 24 }: SocialIconProps) {
  const { theme } = useTheme()
  const c = socialIconBrandConfig[brand]
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: c.color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RNText
        style={{
          color: theme.text["on-inverse"],
          fontSize: size * 0.5,
          fontWeight: "700",
        }}
      >
        {c.letter}
      </RNText>
    </View>
  )
}
