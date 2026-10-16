import React from "react"
import { Text as RNText, type StyleProp, type TextStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface HighlightProps {
  /** 本文 */
  text: string
  /** 検索語。空・空白だけのときは強調しない */
  query: string
  /** 大文字と小文字を区別する（既定 false） */
  caseSensitive?: boolean
  /** 本文の Text のスタイル（typo 等）。一致部分はこの上に面と文字色を重ねる */
  style?: StyleProp<TextStyle>
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Highlight — 本文中の検索一致を強調する（issue #692・Web と対）。Text のネストで描く */
export function Highlight({ text, query, caseSensitive = false, style }: HighlightProps) {
  const { theme } = useTheme()
  const q = query.trim()
  if (!q) return <RNText style={style}>{text}</RNText>
  const re = new RegExp(`(${escapeRegExp(q)})`, caseSensitive ? "g" : "gi")
  const parts = text.split(re).filter((p) => p !== "")
  return (
    <RNText style={style}>
      {parts.map((part, i) => {
        const match = caseSensitive ? part === q : part.toLowerCase() === q.toLowerCase()
        return match ? (
          <RNText key={i} style={{ backgroundColor: theme.surface.highlight, color: theme.text["on-highlight"] }}>
            {part}
          </RNText>
        ) : (
          part
        )
      })}
    </RNText>
  )
}
