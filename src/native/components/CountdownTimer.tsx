import React, { useEffect, useState } from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface CountdownTimerProps {
  /** UNIX ミリ秒 or Date */
  target: number | Date
  onComplete?: () => void
  tone?: "neutral" | "accent" | "caution"
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function CountdownTimer({ target, onComplete, tone = "neutral" }: CountdownTimerProps) {
  const { theme, scales } = useTheme()
  const targetMs = target instanceof Date ? target.getTime() : target
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => {
      const cur = Date.now()
      setNow(cur)
      if (cur >= targetMs) {
        clearInterval(t)
        onComplete?.()
      }
    }, 1000)
    return () => clearInterval(t)
  }, [targetMs, onComplete])

  const diff = Math.max(0, targetMs - now)
  const totalSec = Math.floor(diff / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  const color =
    tone === "accent" ? theme.text["accent-primary"] : tone === "caution" ? theme.text.caution : theme.text["high-emphasis"]

  const renderUnit = (n: number, label: string) => (
    <View style={{ alignItems: "center", minWidth: 48 }}>
      <View
        style={{
          backgroundColor: theme.surface.secondary,
          paddingVertical: scales.spacing.scale[1],
          paddingHorizontal: scales.spacing.scale[2],
          borderRadius: scales.borderRadius.md,
        }}
      >
        <RNText style={[resolveTypo("heading.md"), { color }]}>{pad(n)}</RNText>
      </View>
      <RNText style={[resolveTypo("label.xs"), { color: theme.text["low-emphasis"], marginTop: 2 }]}>
        {label}
      </RNText>
    </View>
  )

  return (
    <View style={{ flexDirection: "row", gap: scales.spacing.scale[2] }}>
      {days > 0 && renderUnit(days, "日")}
      {renderUnit(hours, "時間")}
      {renderUnit(minutes, "分")}
      {renderUnit(seconds, "秒")}
    </View>
  )
}
