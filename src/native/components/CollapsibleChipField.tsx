import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Chip } from "./Chip"

export interface CollapsibleChipFieldProps<K extends string> {
  /** leading アイコン。label 未指定時に w-6 相当の枠内で表示 */
  icon?: React.ReactNode
  /** アイコン代わりにテキストラベルを表示。他のフィールド行と幅を揃える用途。 */
  label?: string
  options: K[]
  /** undefined / "" は未選択扱い（全 chip 展開） */
  selected: K | undefined | ""
  onSelect: (key: K) => void
  /** 選択中の chip を再タップしたとき呼ぶ。指定がない場合は再選択用に展開のみ。 */
  onClear?: () => void
  getLabel: (key: K) => string
  getIcon?: (key: K) => string
  /** 候補数が少なく、選択後も比較対象を見せたいフィールド用。常に全展開。 */
  alwaysExpanded?: boolean
}

const LEADING_WIDTH = 80 // w-20 相当
const ROW_MIN_HEIGHT = 36 // min-h-[36px] 相当

/**
 * CollapsibleChipField (native) — 折りたたみ式選択フィールド。
 * Web 版 (`src/components/patterns/collapsible-chip-field.tsx`) と同一 UX:
 * 未選択時は全展開、選択後は選択 chip のみ表示、再タップで解除 or 再展開。
 */
export function CollapsibleChipField<K extends string>({
  icon,
  label,
  options,
  selected,
  onSelect,
  onClear,
  getLabel,
  getIcon,
  alwaysExpanded = false,
}: CollapsibleChipFieldProps<K>) {
  const { theme, scales } = useTheme()
  const hasSelection = selected !== undefined && selected !== null && selected !== ""
  const [forcedExpand, setForcedExpand] = React.useState(false)

  React.useEffect(() => {
    setForcedExpand(false)
  }, [selected])

  // selected が options に含まれない場合（外部データとの不整合等）は、
  // 折りたたむと chip が 1 つも表示されない手詰まりになるため展開扱いにする
  const selectionInOptions = hasSelection && options.includes(selected as K)
  const expanded = alwaysExpanded || !selectionInOptions || forcedExpand
  const visible = expanded ? options : options.filter((k) => k === selected)

  const leading = label ? (
    <RNText
      style={[
        resolveTypo("label.sm"),
        {
          color: theme.text["medium-emphasis"],
          width: LEADING_WIDTH,
          lineHeight: ROW_MIN_HEIGHT,
        },
      ]}
      numberOfLines={1}
    >
      {label}
    </RNText>
  ) : (
    <View style={{ width: 24, height: ROW_MIN_HEIGHT, alignItems: "center", justifyContent: "center" }}>
      {icon}
    </View>
  )

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: scales.spacing.scale[4], paddingVertical: scales.spacing.scale[3] }}>
      {leading}
      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", gap: scales.spacing.scale[2], minHeight: ROW_MIN_HEIGHT, alignItems: "center" }}>
        {visible.map((key) => (
          <Chip
            key={key}
            size="md"
            selected={!forcedExpand && selected === key}
            onPress={() => {
              if (forcedExpand) {
                onSelect(key)
                setForcedExpand(false)
              } else if (selected === key) {
                // 非 clearable かつ alwaysExpanded 時は何もしない（全 chip が見えているため
                // 再選択モード不要。forcedExpand を立てると選択表示だけ消える視覚不整合になる）
                if (onClear) onClear()
                else if (!alwaysExpanded) setForcedExpand(true)
              } else {
                onSelect(key)
              }
            }}
          >
            {getIcon ? `${getIcon(key)} ` : ""}
            {getLabel(key)}
          </Chip>
        ))}
      </View>
    </View>
  )
}
