import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PillToggleOption<T extends string = string> {
  label: string
  value: T
  icon?: React.ReactNode
}

/**
 * onChange / onValueChange のどちらか一方は必須（両方 optional にすると
 * どちらも渡さずコンパイルが通り、全トリガーが無反応になる退行が起きるため、
 * ユニオン型で「少なくとも一方は必須」を型レベルで強制する）。
 *
 * 各 union メンバーに options/value/size/className を重複させているのは、
 * `BaseProps & (A | B)` の交差型にすると scripts/check-native-parity.mjs の
 * 正規表現ベースの props 抽出（型チェックまではしない軽量設計）が最初の
 * `{` だけを own-props body として読み、base 側のフィールドを見失うため。
 * 型レベルでは交差でも union 展開でも等価だが、抽出のしやすさを優先した。
 */
type PillToggleProps<T extends string = string> =
  | {
      options: PillToggleOption<T>[]
      value: T
      size?: "sm" | "md"
      className?: string
      onChange: (value: T) => void
      /**
       * @deprecated `onChange` を使ってください。後方互換のために残しているエイリアスで、
       * `onChange` が指定されている場合はそちらが優先されます。将来のメジャーバージョンで削除予定。
       */
      onValueChange?: (value: T) => void
    }
  | {
      options: PillToggleOption<T>[]
      value: T
      size?: "sm" | "md"
      className?: string
      onChange?: undefined
      /**
       * @deprecated `onChange` を使ってください。後方互換のために残しているエイリアスで、
       * `onChange` が指定されている場合はそちらが優先されます。将来のメジャーバージョンで削除予定。
       */
      onValueChange: (value: T) => void
    }

/**
 * PillToggle — ピル型セグメントコントロール（値トグル）
 *
 * フィルタの「すべて / 進行中 / 完了」のような **値の切り替え** に使う。
 * 見た目・実装ともに `Tabs` の `variant="pill"` を基盤にしており、
 * Tabs とトークン（角丸・余白・アクティブ表現）を共有する。
 *
 * パネルを切り替えたい（コンテンツ連動）場合は `Tabs` を直接使う。
 */
const TRIGGER_SIZE = {
  sm: "h-8 px-3 typo-label-xs",
  md: "h-9 px-4 typo-label-sm",
} as const

function PillToggle<T extends string = string>({
  options,
  value,
  onChange,
  onValueChange,
  size = "md",
  className,
}: PillToggleProps<T>) {
  const handleChange = onChange ?? onValueChange
  return (
    <Tabs
      data-slot="pill-toggle"
      value={value}
      onValueChange={(v) => handleChange?.(v as T)}
    >
      <TabsList variant="pill" className={className}>
        {options.map((opt) => (
          <TabsTrigger key={opt.value} value={opt.value} className={TRIGGER_SIZE[size]}>
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {opt.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* PillToggle はパネル切り替えを行わない（値トグル専用）が、Radix Tabs は
          アクティブな trigger に aria-controls で存在しない id を指してしまう
          （TabsContent が無いため）。空の TabsContent を用意して参照先を実在させる
          （axe: aria-valid-attr-value）。TabsContent は既定で非アクティブ時に
          アンマウントされるため、forceMount で常時マウントし続けて参照切れを防ぐ
          （PR #271 CodeRabbit 指摘 / issue #275）。 */}
      {options.map((opt) => (
        <TabsContent forceMount key={opt.value} value={opt.value} className="hidden" />
      ))}
    </Tabs>
  )
}

export { PillToggle }
export type { PillToggleProps, PillToggleOption }
