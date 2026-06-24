import React, { useEffect, useState } from "react"
import { Keyboard, View } from "react-native"
import { NavigationBar, type NavigationBarItem } from "./NavigationBar"

export type BottomTabBarKeyboardBehavior = "hide" | "lift" | "stay"

export interface BottomTabBarProps {
  items: NavigationBarItem[]
  value?: string
  onChange?: (key: string) => void
  keyboardBehavior?: BottomTabBarKeyboardBehavior
  keyboardLiftOffset?: number
}

/** commerce 系の TabBar。中身は NavigationBar とほぼ同じ。 */
export function BottomTabBar({
  keyboardBehavior = "stay",
  keyboardLiftOffset = 160,
  ...props
}: BottomTabBarProps) {
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true))
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false))
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

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
