import React from "react"
import { Pressable, View, Text as RNText, Share } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface ShareButtonsProps {
  message?: string
  url?: string
  title?: string
  /** カスタム共有先を追加したい場合 */
  extra?: { label: string; onPress: () => void }[]
}

export function ShareButtons({ message, url, title, extra = [] }: ShareButtonsProps) {
  const { theme, scales } = useTheme()
  const handleNative = async () => {
    try {
      await Share.share({ message: [message, url].filter(Boolean).join(" "), title, url })
    } catch {
      /* noop */
    }
  }

  const buttons = [
    { label: "共有", onPress: handleNative },
    ...extra,
  ]

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: scales.spacing.scale[2] }}>
      {buttons.map((b, i) => (
        <Pressable
          key={i}
          onPress={b.onPress}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: scales.spacing.scale[1],
            paddingHorizontal: scales.spacing.scale[3],
            height: 40,
            borderRadius: scales.borderRadius.full,
            backgroundColor: pressed ? theme.active["secondary-button"] : theme.surface["accent-primary-light"],
          })}
        >
          <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>
            {b.label}
          </RNText>
        </Pressable>
      ))}
    </View>
  )
}
