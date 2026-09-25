import { View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import type { SemanticIconName } from "../../lib/semantic-icons"
export { SEMANTIC_ICONS, type SemanticIconName } from "../../lib/semantic-icons"

export interface SemanticIconProps {
  name: SemanticIconName
  size?: number
  color?: string
  accessibilityLabel?: string
  style?: StyleProp<ViewStyle>
}

/** Meaning-compatible native glyphs. View geometry keeps SVG an optional dependency. */
export function SemanticIcon({ name, size = 24, color, accessibilityLabel, style }: SemanticIconProps) {
  const { theme } = useTheme()
  const ink = color ?? theme.text["high-emphasis"]
  const selected = name === "selected" || name === "selectedSquare" || name === "success"
  const framed = name !== "selected" && name !== "close"
  const square = name === "selectedSquare"
  const stroke = Math.max(name === "selected" ? 2 : 1.5, size / 12)
  return <View accessible={Boolean(accessibilityLabel)} accessibilityRole={accessibilityLabel ? "image" : undefined} accessibilityLabel={accessibilityLabel}
    accessibilityElementsHidden={!accessibilityLabel} importantForAccessibility={accessibilityLabel ? "auto" : "no-hide-descendants"}
    pointerEvents="none" style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, style]}>
    {framed && <View style={{ position: "absolute", width: size * 0.84, height: size * 0.84, borderWidth: stroke, borderColor: ink, borderRadius: square ? size * 0.2 : size }} />}
    {selected ? <View style={{ width: size * (name === "selected" ? 0.65 : 0.52), height: size * (name === "selected" ? 0.3 : 0.25), borderLeftWidth: stroke, borderBottomWidth: stroke, borderColor: ink, transform: [{ rotate: "-45deg" }, { translateY: -1 }] }} />
      : name === "close" ? <>
        <View style={{ position: "absolute", width: size * 0.65, height: stroke, backgroundColor: ink, transform: [{ rotate: "45deg" }] }} />
        <View style={{ position: "absolute", width: size * 0.65, height: stroke, backgroundColor: ink, transform: [{ rotate: "-45deg" }] }} />
      </> : <View style={{ alignItems: "center", flexDirection: name === "info" ? "column" : "column-reverse", gap: size * 0.08 }}>
        <View style={{ width: stroke, height: stroke, borderRadius: stroke, backgroundColor: ink }} />
        <View style={{ width: stroke, height: size * 0.28, borderRadius: stroke, backgroundColor: ink }} />
      </View>}
  </View>
}
