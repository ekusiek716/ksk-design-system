import React, { createContext, useContext } from "react"
import { Pressable, View, Text as RNText, ScrollView } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs の内側で使ってください")
  return ctx
}

export interface TabsProps {
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}

export function Tabs({ value, onChange, children }: TabsProps) {
  return <TabsContext.Provider value={{ value, onChange }}>{children}</TabsContext.Provider>
}

export interface TabsListProps {
  scrollable?: boolean
  children: React.ReactNode
}

export function TabsList({ scrollable = false, children }: TabsListProps) {
  const { theme, scales } = useTheme()
  const inner = (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: theme.border["low-emphasis"],
        gap: scales.spacing.scale[1],
      }}
    >
      {children}
    </View>
  )
  if (scrollable) {
    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{inner}</ScrollView>
  }
  return inner
}

export interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
}

export function TabsTrigger({ value, children, disabled }: TabsTriggerProps) {
  const { theme, scales } = useTheme()
  const ctx = useTabs()
  const active = ctx.value === value
  return (
    <Pressable
      onPress={() => !disabled && ctx.onChange(value)}
      disabled={disabled}
      style={{
        paddingVertical: scales.spacing.scale[2],
        paddingHorizontal: scales.spacing.scale[3],
        borderBottomWidth: 2,
        borderBottomColor: active ? theme.brand.primary : "transparent",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <RNText
        style={[
          resolveTypo("label.md"),
          {
            color: active ? theme.text["accent-primary"] : theme.text["medium-emphasis"],
            fontWeight: active ? "700" : "500",
          },
        ]}
      >
        {children}
      </RNText>
    </Pressable>
  )
}

export interface TabsContentProps {
  value: string
  children: React.ReactNode
}

export function TabsContent({ value, children }: TabsContentProps) {
  const ctx = useTabs()
  if (ctx.value !== value) return null
  return <View>{children}</View>
}
