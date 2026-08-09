import React from "react"
import {
  ActivityIndicator,
  Pressable,
  Text as RNText,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type StatusActionBadgeState = "idle" | "pending" | "syncing" | "success" | "warning" | "error" | "offline"

export interface StatusActionBadgeProps extends Omit<PressableProps, "children" | "style"> {
  state?: StatusActionBadgeState
  label: string
  count?: number
  compact?: boolean
  loading?: boolean
  icon?: React.ReactNode
  asStatus?: boolean
  style?: StyleProp<ViewStyle>
}

export function StatusActionBadge({
  state = "idle",
  label,
  count,
  compact = false,
  loading = false,
  icon,
  asStatus = false,
  style,
  onPress,
  ...rest
}: StatusActionBadgeProps) {
  const { theme, scales } = useTheme()
  const palette = {
    idle: { bg: theme.surface.secondary, fg: theme.text["medium-emphasis"], border: theme.border["low-emphasis"] },
    pending: { bg: theme.surface.warning, fg: theme.text.warning, border: theme.border.warning },
    syncing: { bg: theme.surface.info, fg: theme.text.info, border: theme.border.info },
    success: { bg: theme.surface.success, fg: theme.text.success, border: theme.border.success },
    warning: { bg: theme.surface.warning, fg: theme.text.warning, border: theme.border.warning },
    error: { bg: theme.surface.caution, fg: theme.text.caution, border: theme.border.caution },
    offline: { bg: theme.surface.secondary, fg: theme.text["low-emphasis"], border: theme.border["low-emphasis"] },
  }[state]

  const content = (
    <>
      {icon ?? (loading || state === "syncing" ? (
        <ActivityIndicator size="small" color={palette.fg} />
      ) : (
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.fg }} />
      ))}
      {!compact && (
        <RNText numberOfLines={1} style={[resolveTypo("label.xs"), { color: palette.fg }]}>
          {label}
        </RNText>
      )}
      {count != null && count > 0 && (
        <RNText style={[resolveTypo("label.xs"), { color: theme.text["high-emphasis"] }]}>
          {count > 99 ? "99+" : count}
        </RNText>
      )}
    </>
  )

  // 押せるときだけタップ最小寸法を適用する。asStatus / onPress 無しは非対話（下の分岐で
  // accessibilityRole="text" の View になる）ので、36 を残すと中身に対して上下が余って
  // 縦に間延びする（issue #316）。
  const isInteractive = !asStatus && !!onPress
  // compact（ドットのみ）の非対話は、下限を外すと左右パディングだけが残って横長の楕円になる。
  // aspectRatio に頼ると padding 非対称のぶん挙動が実装依存になるので、水平パディングを
  // 垂直と同値にして正円を作る（6pt のドット + 4pt×2 = 14pt の正円）。
  const isCompactStatus = compact && !isInteractive
  const baseStyle: StyleProp<ViewStyle> = [
    {
      minHeight: isInteractive ? 36 : undefined,
      minWidth: compact && isInteractive ? 36 : undefined,
      paddingHorizontal: isCompactStatus ? scales.spacing.scale[1] : scales.spacing.scale[2],
      paddingVertical: scales.spacing.scale[1],
      borderRadius: scales.borderRadius.full,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.bg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: scales.spacing.scale[1],
      maxWidth: "100%",
    },
    style,
  ]

  if (!isInteractive) {
    return <View accessibilityRole="text" accessibilityLabel={label} style={baseStyle}>{content}</View>
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: loading || state === "syncing" }}
      onPress={onPress}
      style={({ pressed }) => [baseStyle, pressed && { opacity: 0.82 }]}
      {...rest}
    >
      {content}
    </Pressable>
  )
}

export const SyncStatusButton = StatusActionBadge
