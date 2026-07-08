import React from "react"
import { View, type ViewProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { Text } from "./Text"
import { Stack } from "./Stack"

/**
 * FormRoot / FormSection / FormActions (native) — フォーム構造化レイアウト。
 * 正本: src/components/patterns/form.tsx（Web 版。<form>/<fieldset> ベース）。
 *
 * native には <form> 要素が無いため View ベースで組む。送信は各 FormActions 内の
 * Button の onPress に委ねる（Web 版の onSubmit/preventDefault に相当する挙動は
 * native に存在しないため FormRoot 自体は送信イベントを持たない、素のレイアウト
 * コンテナになる）。
 */

// ─── FormRoot: グループ全体を縦積みする素のレイアウトコンテナ ───
export interface FormRootProps extends ViewProps {
  children: React.ReactNode
}

export function FormRoot({ style, children, ...rest }: FormRootProps) {
  const { scales } = useTheme()
  return (
    <View style={[{ gap: scales.spacing.scale[6] }, style]} {...rest}>
      {children}
    </View>
  )
}

// ─── FormSection: 関連フィールドをグルーピング ───
export interface FormSectionProps extends ViewProps {
  title?: string
  description?: string
  children: React.ReactNode
}

export function FormSection({ title, description, style, children, ...rest }: FormSectionProps) {
  const { theme, scales } = useTheme()
  return (
    <View style={[{ gap: scales.spacing.scale[4] }, style]} {...rest}>
      {(title || description) && (
        <View style={{ gap: scales.spacing.scale[1] }}>
          {title && <Text variant="heading.md">{title}</Text>}
          {description && (
            <Text variant="body.sm" color={theme.text["medium-emphasis"]}>
              {description}
            </Text>
          )}
        </View>
      )}
      {children}
    </View>
  )
}

// ─── FormActions: フォーム末尾のボタン行 ───
export interface FormActionsProps extends ViewProps {
  children: React.ReactNode
}

export function FormActions({ style, children, ...rest }: FormActionsProps) {
  const { scales } = useTheme()
  return (
    <Stack
      direction="row"
      gap={3}
      justify="flex-end"
      wrap
      style={[{ paddingTop: scales.spacing.scale[4] }, style]}
      {...rest}
    >
      {children}
    </Stack>
  )
}
