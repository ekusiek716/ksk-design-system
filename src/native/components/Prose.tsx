import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface ProseSection {
  title: string
  body: string[]
}

export interface ProseProps {
  /** `{ title, body: string[] }[]` の配列。原稿データだけ渡せば見出し+本文段落を描画する。 */
  sections: ProseSection[]
}

/**
 * Prose — 静的文書（プライバシーポリシー・利用規約等）の本文レンダラー。
 * セクション見出し（16px/bold）＋段落（14px/leading-6 相当）を DS トークンで一元化する。
 * `DocumentScreen` の子として使う想定だが、単体でも利用できる。
 */
export function Prose({ sections }: ProseProps) {
  const { theme, scales } = useTheme()

  return (
    <View style={{ gap: scales.spacing.scale[6] }}>
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={{ gap: scales.spacing.scale[2] }}>
          <RNText style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"] }]}>
            {section.title}
          </RNText>
          {section.body.map((paragraph, paragraphIndex) => (
            <RNText
              key={paragraphIndex}
              style={[resolveTypo("body.md"), { color: theme.text["medium-emphasis"] }]}
            >
              {paragraph}
            </RNText>
          ))}
        </View>
      ))}
    </View>
  )
}
