import React, { createContext, useContext, useMemo, useState } from "react"
import {
  themes,
  scales,
  type ThemeName,
  type ColorMode,
  type ResolvedTheme,
} from "../../tokens/native"

type Scales = typeof scales

export interface ThemeContextValue {
  name: ThemeName
  mode: ColorMode
  /** 解決済みカラートークン（surface/text/border/brand ...） */
  theme: ResolvedTheme
  /** spacing / borderRadius / typography / shadows / categorical ... */
  scales: Scales
  setName: (n: ThemeName) => void
  setMode: (m: ColorMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  initialName = "default",
  initialMode = "light",
}: {
  children: React.ReactNode
  initialName?: ThemeName
  initialMode?: ColorMode
}) {
  const [name, setName] = useState<ThemeName>(initialName)
  const [mode, setMode] = useState<ColorMode>(initialMode)

  const value = useMemo<ThemeContextValue>(
    () => ({
      name,
      mode,
      theme: themes[name][mode] as ResolvedTheme,
      scales,
      setName,
      setMode,
      toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    [name, mode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme は ThemeProvider の内側で使ってください")
  return ctx
}
