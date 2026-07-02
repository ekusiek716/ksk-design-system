import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Avatar } from "./Avatar"
import { Badge } from "./Badge"

export interface PresenceIndicatorProps {
  /** 表示名。イニシャル（先頭1文字）が Avatar フォールバックに使われる */
  name: string
  /** 名前の下に表示する補足テキスト（例: "編集中" "〇〇を閲覧中"） */
  statusText?: string
  /** 指定時、右側に Badge（tone="success"）を表示する */
  badgeLabel?: string
  /** ステータスドットの色。true: success / false: 中立色（既定 true） */
  online?: boolean
}

function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed.slice(0, 1).toUpperCase() : "?"
}

/**
 * PresenceIndicator — web 版と同じ構成（Avatar + ステータスドット + statusText + Badge）の native 実装。
 */
export function PresenceIndicator({ name, statusText, badgeLabel, online = true }: PresenceIndicatorProps) {
  const { theme, scales } = useTheme()

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={statusText ? `${name}: ${statusText}` : name}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[1],
        borderRadius: scales.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.border["low-emphasis"],
        backgroundColor: theme.surface.primary,
        paddingVertical: scales.spacing.scale[1],
        paddingHorizontal: scales.spacing.scale[2],
      }}
    >
      <View>
        <Avatar fallback={getInitial(name)} size="sm" />
        <View
          style={{
            position: "absolute",
            right: -1,
            bottom: -1,
            width: 8,
            height: 8,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: theme.surface.primary,
            backgroundColor: online ? theme.object.success : theme.object["low-emphasis"],
          }}
        />
      </View>
      {statusText ? (
        <RNText
          style={[resolveTypo("caption"), { color: theme.text["medium-emphasis"] }]}
          numberOfLines={1}
        >
          {statusText}
        </RNText>
      ) : null}
      {badgeLabel ? <Badge tone="success">{badgeLabel}</Badge> : null}
    </View>
  )
}
