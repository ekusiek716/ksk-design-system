import React from "react"
import { View, Text as RNText, ActivityIndicator } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type SyncStatus = "synced" | "syncing" | "offline" | "error"

export interface SyncStatusBadgeProps {
  status: SyncStatus
  label?: string
}

export function SyncStatusBadge({ status, label }: SyncStatusBadgeProps) {
  const { theme, scales } = useTheme()
  const map = {
    synced: { bg: theme.surface.success, fg: theme.text.success, dot: theme.success.base, def: "同期済み" },
    syncing: { bg: theme.surface.info, fg: theme.text.info, dot: theme.info.base, def: "同期中" },
    offline: {
      bg: theme.surface.tertiary,
      fg: theme.text["medium-emphasis"],
      dot: theme.text["low-emphasis"],
      def: "オフライン",
    },
    error: { bg: theme.surface.caution, fg: theme.text.caution, dot: theme.caution.base, def: "エラー" },
  }[status]

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[1],
        backgroundColor: map.bg,
        borderRadius: scales.borderRadius.full,
        paddingHorizontal: scales.spacing.scale[2],
        paddingVertical: scales.spacing.scale[1],
        alignSelf: "flex-start",
      }}
    >
      {status === "syncing" ? (
        <ActivityIndicator size="small" color={map.fg} />
      ) : (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: map.dot,
          }}
        />
      )}
      <RNText style={[resolveTypo("label.xs"), { color: map.fg }]}>{label ?? map.def}</RNText>
    </View>
  )
}
