import React, { useEffect, useState } from "react"
import {
  Keyboard,
  Pressable,
  Text as RNText,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import type { BottomTabBarProps as RNBottomTabBarProps } from "@react-navigation/bottom-tabs"
import { NavigationBar, type NavigationBarItem } from "./NavigationBar"
import { GlassView, type GlassIntensity, type GlassTint } from "./GlassView"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type BottomTabBarKeyboardBehavior = "hide" | "lift" | "stay"

export interface BottomTabBarProps {
  items: NavigationBarItem[]
  value?: string
  onChange?: (key: string) => void
  keyboardBehavior?: BottomTabBarKeyboardBehavior
  keyboardLiftOffset?: number
}

// @react-navigation/bottom-tabs の実際の型をそのまま使う（旧: 自前の
// duck-typing。tabBarLabel の関数シグネチャ等が実際の型と構造的に
// 非互換で、consumer 側で `as unknown as` キャストが必要になっていた）。
export type NativeTabBarState = RNBottomTabBarProps["state"]
export type NativeTabBarRoute = NativeTabBarState["routes"][number]
export type NativeTabBarNavigation = RNBottomTabBarProps["navigation"]
export type NativeTabBarDescriptorMap = RNBottomTabBarProps["descriptors"]
export type NativeTabBarDescriptor = NativeTabBarDescriptorMap[string]
export type NativeTabBarOptions = NonNullable<NativeTabBarDescriptor["options"]>
export type NativeTabBarIconProps = Parameters<NonNullable<NativeTabBarOptions["tabBarIcon"]>>[0]

export interface LiquidBottomTabBarProps {
  state: NativeTabBarState
  descriptors: NativeTabBarDescriptorMap
  navigation: NativeTabBarNavigation
  insets?: RNBottomTabBarProps["insets"]
  keyboardBehavior?: BottomTabBarKeyboardBehavior
  keyboardLiftOffset?: number
  hiddenRouteNames?: string[]
  floating?: boolean
  glass?: boolean
  glassIntensity?: GlassIntensity
  glassTint?: GlassTint
  showLabels?: boolean
  iconSize?: number
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  itemStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}

export type ExpoRouterTabBarFactoryOptions = Omit<
  LiquidBottomTabBarProps,
  "state" | "descriptors" | "navigation" | "insets"
>

function useKeyboardOpen() {
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true))
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false))
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return keyboardOpen
}

/** commerce 系の TabBar。中身は NavigationBar とほぼ同じ。 */
export function BottomTabBar({
  keyboardBehavior = "stay",
  keyboardLiftOffset = 160,
  ...props
}: BottomTabBarProps) {
  const keyboardOpen = useKeyboardOpen()

  if (keyboardBehavior === "hide" && keyboardOpen) return null

  return (
    <View
      style={keyboardBehavior === "lift" && keyboardOpen
        ? { transform: [{ translateY: -keyboardLiftOffset }] }
        : undefined}
    >
      <NavigationBar {...props} />
    </View>
  )
}

export function LiquidBottomTabBar({
  state,
  descriptors,
  navigation,
  insets,
  keyboardBehavior = "hide",
  keyboardLiftOffset = 160,
  hiddenRouteNames = [],
  floating = true,
  glass = true,
  glassIntensity = "regular",
  glassTint = "system",
  showLabels = true,
  iconSize = 24,
  style,
  contentStyle,
  itemStyle,
  labelStyle,
}: LiquidBottomTabBarProps) {
  const { theme, scales } = useTheme()
  const keyboardOpen = useKeyboardOpen()
  const focusedRoute = state.routes[state.index]
  const focusedOptions = focusedRoute ? descriptors[focusedRoute.key]?.options : undefined
  const safeBottom = insets?.bottom ?? 0

  if (keyboardBehavior === "hide" && keyboardOpen) return null
  if (isTabBarDisplayNone(focusedOptions?.tabBarStyle)) return null

  const visibleRoutes = state.routes.filter((route) => {
    // href/tabBarButton は expo-router が Tabs.Screen options に足す拡張
    // フィールド（`href: null` でタブを隠す慣習）。@react-navigation/bottom-tabs
    // 自体の型には無いため実行時形状として緩く読む。
    const options = descriptors[route.key]?.options as
      | (NativeTabBarOptions & { href?: string | null })
      | undefined
    return (
      !hiddenRouteNames.includes(route.name) &&
      options?.href !== null &&
      (options?.tabBarButton as unknown) !== null
    )
  })

  if (visibleRoutes.length === 0) return null

  const translateY = keyboardBehavior === "lift" && keyboardOpen ? -keyboardLiftOffset : 0
  const containerStyle: ViewStyle = floating
    ? {
        position: "absolute",
        left: scales.spacing.scale[4],
        right: scales.spacing.scale[4],
        bottom: safeBottom + scales.spacing.scale[3],
        transform: [{ translateY }],
      }
    : {
        paddingBottom: safeBottom,
        transform: [{ translateY }],
      }

  const contentBaseStyle: ViewStyle = {
    minHeight: showLabels ? 64 : scales.touchTargets.navItem.min,
    paddingHorizontal: scales.spacing.scale[2],
    paddingVertical: scales.spacing.scale[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: floating ? scales.borderRadius.full : scales.borderRadius.none,
  }

  const content = (
    <View style={[contentBaseStyle, contentStyle]}>
      {visibleRoutes.map((route) => {
        const routeIndex = state.routes.findIndex((candidate) => candidate.key === route.key)
        const focused = state.index === routeIndex
        const options = descriptors[route.key]?.options ?? {}
        const color = focused
          ? options.tabBarActiveTintColor ?? theme.text["accent-primary"]
          : options.tabBarInactiveTintColor ?? theme.text["medium-emphasis"]

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? resolveTabLabel(route, options)}
            testID={options.tabBarButtonTestID}
            onPress={() => {
              const event = navigation.emit?.({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              })

              if (!focused && !event?.defaultPrevented) {
                navigation.navigate?.(route.name, route.params)
              }
            }}
            style={({ pressed }) => [
              {
                minHeight: scales.touchTargets.navItem.min,
                minWidth: scales.touchTargets.navItem.min,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: showLabels ? scales.spacing.scale[1] : 0,
                borderRadius: scales.borderRadius.full,
                opacity: pressed ? 0.68 : focused ? 1 : 0.72,
              },
              focused && {
                backgroundColor: floating
                  ? "rgba(255, 255, 255, 0.22)"
                  : theme.surface["accent-primary-light"],
              },
              itemStyle,
            ]}
          >
            <View style={{ minHeight: iconSize, alignItems: "center", justifyContent: "center" }}>
              {options.tabBarIcon?.({ focused, color, size: iconSize })}
              {options.tabBarBadge != null && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -10,
                    minWidth: 16,
                    height: 16,
                    paddingHorizontal: 4,
                    borderRadius: scales.borderRadius.full,
                    backgroundColor: theme.caution.base,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RNText style={[resolveTypo("label.xs"), { color: theme.text["on-inverse"] }]}>
                    {options.tabBarBadge}
                  </RNText>
                </View>
              )}
            </View>
            {showLabels && (
              <RNText
                numberOfLines={1}
                style={[
                  resolveTypo(focused ? "label.xs" : "body.xs"),
                  { color, maxWidth: 72 },
                  labelStyle,
                ]}
              >
                {resolveTabLabel(route, options)}
              </RNText>
            )}
          </Pressable>
        )
      })}
    </View>
  )

  return (
    <View pointerEvents="box-none" style={[containerStyle, style]}>
      {glass ? (
        <GlassView
          intensity={glassIntensity}
          tint={glassTint}
          borderRadius={floating ? scales.borderRadius.full : scales.borderRadius.none}
          backgroundFill={floating ? undefined : theme.surface.primary}
        >
          {content}
        </GlassView>
      ) : (
        <View
          style={[
            {
              backgroundColor: theme.surface.primary,
              borderColor: theme.border["low-emphasis"],
              borderWidth: 1,
              borderRadius: floating ? scales.borderRadius.full : scales.borderRadius.none,
            },
          ]}
        >
          {content}
        </View>
      )}
    </View>
  )
}

export function createExpoRouterTabBar(options: ExpoRouterTabBarFactoryOptions = {}) {
  return function KskExpoRouterTabBar(props: Omit<LiquidBottomTabBarProps, keyof ExpoRouterTabBarFactoryOptions>) {
    return <LiquidBottomTabBar {...props} {...options} />
  }
}

function resolveTabLabel(route: NativeTabBarRoute, options: NativeTabBarOptions): string {
  if (typeof options.tabBarLabel === "string") return options.tabBarLabel
  if (typeof options.title === "string") return options.title
  return route.name
}

function isTabBarDisplayNone(style: unknown): boolean {
  if (!style) return false
  if (Array.isArray(style)) return style.some(isTabBarDisplayNone)
  if (typeof style === "object" && "display" in style) {
    return (style as { display?: unknown }).display === "none"
  }
  return false
}
