import React from "react"
import { Pressable, View, Text as RNText, type StyleProp, type TextStyle, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { themes } from "../../tokens/native"
import { resolveTypo } from "../typography"

export interface FloatingTabBarItem {
  key: string
  label: string
  /** 任意の先頭アイコン（DS 外のアイコンを注入する。色は呼び出し側で合わせる） */
  icon?: React.ReactNode
}

export interface FloatingTabBarProps {
  items: FloatingTabBarItem[]
  /** 選択中 item の key。未指定なら選択表示なし（クイックナビ用途） */
  activeKey?: string
  onSelect: (key: string) => void
  /**
   * 面のトーン。
   * - "hero": GradientSurface 等のビビッド面の上に浮かべる淡色ピル
   * - "surface": 通常サーフェス上（既定）
   */
  tone?: "hero" | "surface"
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}

/**
 * 画面下部に浮かせるピル型のクイックナビゲーション。
 *
 * react-navigation に依存しない単体コンポーネント（Tabs 連携が必要な場合は
 * LiquidBottomTabBar / createExpoRouterTabBar を使う）。Stack 構成の画面で
 * 主要導線を常時見せたいときに使う。色は semantic トークンのみ。
 */
export function FloatingTabBar({
  items,
  activeKey,
  onSelect,
  tone = "surface",
  style,
  labelStyle,
}: FloatingTabBarProps) {
  const { name, theme, scales } = useTheme()
  const ramp = themes[name]

  // hero トーンはモード非依存でランプ両端を使う（ビビッド面上の淡色ピル + 濃紺ラベル）
  const palette =
    tone === "hero"
      ? {
          pillBg: ramp.light.brand["ultra-light"],
          itemActiveBg: ramp.light.brand.light,
          label: ramp.dark.brand.light,
          labelActive: ramp.dark.brand.light,
          pressedBg: ramp.dark.brand.action,
        }
      : {
          pillBg: theme.surface.secondary,
          itemActiveBg: theme.surface["accent-primary-light"],
          label: theme.text["medium-emphasis"],
          labelActive: theme.text["accent-primary"],
          pressedBg: theme.active["tertiary-button"],
        }

  return (
    <View
      accessibilityRole="tablist"
      style={[
        {
          flexDirection: "row",
          backgroundColor: palette.pillBg,
          borderRadius: scales.borderRadius.full,
          padding: scales.spacing.scale[1],
        },
        style,
      ]}
    >
      {items.map((item) => {
        const active = item.key === activeKey
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            onPress={() => onSelect(item.key)}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: scales.spacing.scale[1],
              minHeight: scales.touchTargets.buttonCTA.min,
              borderRadius: scales.borderRadius.full,
              backgroundColor: pressed
                ? palette.pressedBg
                : active
                  ? palette.itemActiveBg
                  : "transparent",
            })}
          >
            {item.icon}
            <RNText
              style={[
                resolveTypo("label.md"),
                { color: active ? palette.labelActive : palette.label },
                labelStyle,
              ]}
            >
              {item.label}
            </RNText>
          </Pressable>
        )
      })}
    </View>
  )
}
