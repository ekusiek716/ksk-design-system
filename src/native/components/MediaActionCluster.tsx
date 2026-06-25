import React from "react"
import {
  Linking,
  Pressable,
  Text as RNText,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { GlassView } from "./GlassView"

export type MediaActionClusterOrientation = "vertical" | "horizontal" | "auto"
export type MediaActionClusterAnchor =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center-left"
  | "center-right"
export type MediaActionClusterPosition = "absolute" | "fixed" | "relative"
export type MediaActionClusterLabelPosition = "below" | "side" | "auto"

export interface MediaActionClusterItem {
  id?: string
  label: string
  accessibilityLabel?: string
  ariaLabel?: string
  icon: React.ReactNode
  href?: string
  onPress?: () => void
  onClick?: () => void
  active?: boolean
  badge?: React.ReactNode
  disabled?: boolean
}

export interface MediaActionClusterProps {
  items: MediaActionClusterItem[]
  orientation?: MediaActionClusterOrientation
  anchor?: MediaActionClusterAnchor
  position?: MediaActionClusterPosition
  labelPosition?: MediaActionClusterLabelPosition
  autoHideMs?: number | null
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  accessibilityLabel?: string
  style?: StyleProp<ViewStyle>
}

const ABSOLUTE_FILL_ANCHOR: Record<MediaActionClusterAnchor, ViewStyle> = {
  "top-left": { top: 16, left: 16 },
  "top-right": { top: 16, right: 16 },
  "bottom-left": { bottom: 16, left: 16 },
  "bottom-right": { bottom: 16, right: 16 },
  "center-left": { top: "50%", left: 16, transform: [{ translateY: -48 }] },
  "center-right": { top: "50%", right: 16, transform: [{ translateY: -48 }] },
}

function displayBadge(badge: React.ReactNode) {
  if (typeof badge === "number" && badge > 99) return "99+"
  return badge
}

function directionFor(
  orientation: MediaActionClusterOrientation,
  labelPosition: MediaActionClusterLabelPosition,
) {
  const clusterDirection: "row" | "column" = orientation === "horizontal" ? "row" : "column"
  if (labelPosition === "side") return { clusterDirection, itemDirection: "row" as const }
  if (labelPosition === "below") return { clusterDirection, itemDirection: "column" as const }
  return {
    clusterDirection,
    itemDirection: orientation === "horizontal" ? "row" as const : "column" as const,
  }
}

export function MediaActionCluster({
  items,
  orientation = "vertical",
  anchor = "bottom-right",
  position = "absolute",
  labelPosition = "auto",
  autoHideMs = 5000,
  defaultVisible = true,
  onVisibleChange,
  accessibilityLabel = "メディアアクション",
  style,
}: MediaActionClusterProps) {
  const { scales } = useTheme()
  const [visible, setVisible] = React.useState(defaultVisible)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoHideEnabled = autoHideMs != null && autoHideMs > 0
  const { clusterDirection, itemDirection } = directionFor(orientation, labelPosition)

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  const setVisibleState = React.useCallback(
    (next: boolean) => {
      setVisible((current) => {
        if (current !== next) onVisibleChange?.(next)
        return next
      })
    },
    [onVisibleChange],
  )

  const scheduleHide = React.useCallback(() => {
    clearTimer()
    if (!autoHideEnabled) return
    timerRef.current = setTimeout(() => setVisibleState(false), autoHideMs)
  }, [autoHideEnabled, autoHideMs, clearTimer, setVisibleState])

  const reveal = React.useCallback(() => {
    setVisibleState(true)
    scheduleHide()
  }, [scheduleHide, setVisibleState])

  React.useEffect(() => {
    if (!autoHideEnabled) {
      clearTimer()
      setVisibleState(true)
      return
    }
    scheduleHide()
    return clearTimer
  }, [autoHideEnabled, clearTimer, scheduleHide, setVisibleState])

  return (
    <View
      accessibilityRole="toolbar"
      accessibilityLabel={accessibilityLabel}
      style={[
        position === "relative"
          ? undefined
          : {
              position: "absolute",
              zIndex: 40,
              ...ABSOLUTE_FILL_ANCHOR[anchor],
            },
        {
          flexDirection: clusterDirection,
          alignItems: "center",
          gap: scales.spacing.scale[3],
          opacity: visible ? 1 : 0.4,
        },
        style,
      ]}
    >
      {items.map((item, index) => (
        <MediaActionClusterButton
          key={item.id ?? `${item.label}-${index}`}
          item={item}
          itemDirection={itemDirection}
          onReveal={reveal}
        />
      ))}
    </View>
  )
}

function MediaActionClusterButton({
  item,
  itemDirection,
  onReveal,
}: {
  item: MediaActionClusterItem
  itemDirection: "row" | "column"
  onReveal: () => void
}) {
  const { theme, scales } = useTheme()
  const handlePress = () => {
    onReveal()
    if (item.disabled) return
    item.onPress?.()
    item.onClick?.()
    if (item.href) Linking.openURL(item.href)
  }

  return (
    <Pressable
      disabled={item.disabled}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={item.accessibilityLabel ?? item.ariaLabel ?? item.label}
      accessibilityState={{ disabled: item.disabled, selected: item.active }}
      style={({ pressed }) => ({
        minWidth: scales.touchTargets.iconButton.min,
        minHeight: scales.touchTargets.iconButton.min,
        flexDirection: itemDirection,
        alignItems: "center",
        justifyContent: "center",
        gap: scales.spacing.scale[1],
        opacity: item.disabled ? 0.5 : 1,
        transform: [{ scale: pressed && !item.disabled ? 0.96 : 1 }],
      })}
    >
      <GlassView
        tint="dark"
        intensity="regular"
        borderRadius={scales.borderRadius.full}
        style={{
          width: 48,
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: item.active ? 2 : 1,
          borderColor: item.active ? theme.border["accent-primary"] : theme.text["on-media-secondary"],
        }}
      >
        {item.icon}
        {item.badge != null && (
          <View
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              paddingHorizontal: 4,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.surface["caution-strong"],
            }}
          >
            <RNText style={[resolveTypo("label.xs"), { color: theme.text["on-media"] }]}>
              {displayBadge(item.badge)}
            </RNText>
          </View>
        )}
      </GlassView>
      <RNText
        numberOfLines={1}
        style={[
          resolveTypo("label.xs"),
          {
            maxWidth: 96,
            color: theme.text["on-media"],
            textAlign: "center",
          },
        ]}
      >
        {item.label}
      </RNText>
    </Pressable>
  )
}
