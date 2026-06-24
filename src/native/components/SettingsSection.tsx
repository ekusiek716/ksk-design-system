import React from "react"
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type SettingsSectionVariant = "group" | "card" | "danger"

export interface SettingsSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: SettingsSectionVariant
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}

export interface SettingsListRowProps {
  title: React.ReactNode
  description?: React.ReactNode
  leading?: React.ReactNode
  rightSlot?: React.ReactNode
  children?: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  destructive?: boolean
  style?: StyleProp<ViewStyle>
}

export function SettingsSection({
  title,
  description,
  action,
  variant = "group",
  children,
  style,
  contentStyle,
}: SettingsSectionProps) {
  const { theme, scales } = useTheme()
  const isCard = variant === "card" || variant === "danger"
  return (
    <View style={[{ gap: scales.spacing.scale[3] }, style]}>
      {(title || description || action) && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: scales.spacing.scale[3],
            paddingHorizontal: scales.spacing.scale[1],
          }}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            {typeof title === "string" ? (
              <RNText
                style={[
                  resolveTypo("heading.sm"),
                  { color: variant === "danger" ? theme.text.caution : theme.text["high-emphasis"] },
                ]}
              >
                {title}
              </RNText>
            ) : (
              title
            )}
            {description &&
              (typeof description === "string" ? (
                <RNText
                  style={[
                    resolveTypo("body.sm"),
                    {
                      color: theme.text["medium-emphasis"],
                      marginTop: scales.spacing.scale[1],
                    },
                  ]}
                >
                  {description}
                </RNText>
              ) : (
                description
              ))}
          </View>
          {action}
        </View>
      )}
      <View
        style={[
          isCard
            ? {
                overflow: "hidden",
                borderWidth: 1,
                borderColor: variant === "danger" ? theme.border.caution : theme.border["low-emphasis"],
                borderRadius: scales.borderRadius["2xl"],
                backgroundColor: theme.surface.primary,
              }
            : { gap: scales.spacing.scale[2] },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  )
}

export function SettingsListRow({
  title,
  description,
  leading,
  rightSlot,
  children,
  onPress,
  disabled = false,
  destructive = false,
  style,
}: SettingsListRowProps) {
  const { theme, scales } = useTheme()
  const row = (pressed = false) => (
    <View
      style={[
        {
          minHeight: 56,
          flexDirection: "row",
          alignItems: "center",
          gap: scales.spacing.scale[3],
          paddingHorizontal: scales.spacing.scale[4],
          paddingVertical: scales.spacing.scale[3],
          borderBottomWidth: 1,
          borderBottomColor: theme.border["low-emphasis"],
          backgroundColor: pressed ? theme.surface.secondary : theme.surface.primary,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {leading && (
        <View style={{ width: 40, minHeight: 40, alignItems: "center", justifyContent: "center" }}>
          {leading}
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        {typeof title === "string" ? (
          <RNText
            numberOfLines={1}
            style={[
              resolveTypo("label.md"),
              { color: destructive ? theme.text.caution : theme.text["high-emphasis"] },
            ]}
          >
            {title}
          </RNText>
        ) : (
          title
        )}
        {description &&
          (typeof description === "string" ? (
            <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"], marginTop: 2 }]}>
              {description}
            </RNText>
          ) : (
            description
          ))}
        {children}
      </View>
      {rightSlot}
    </View>
  )

  if (onPress) {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {({ pressed }) => row(pressed)}
      </Pressable>
    )
  }

  return row(false)
}
