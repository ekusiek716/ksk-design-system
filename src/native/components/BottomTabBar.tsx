import React from "react"
import { NavigationBar, type NavigationBarItem } from "./NavigationBar"

export interface BottomTabBarProps {
  items: NavigationBarItem[]
  value?: string
  onChange?: (key: string) => void
}

/** commerce 系の TabBar。中身は NavigationBar とほぼ同じ。 */
export function BottomTabBar(props: BottomTabBarProps) {
  return <NavigationBar {...props} />
}
