import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PillToggleOption<T extends string = string> {
  label: string
  value: T
  icon?: React.ReactNode
}

interface PillToggleProps<T extends string = string> {
  options: PillToggleOption<T>[]
  value: T
  onChange?: (value: T) => void
  /**
   * @deprecated `onChange` を使ってください。後方互換のために残しているエイリアスで、
   * `onChange` が指定されている場合はそちらが優先されます。将来のメジャーバージョンで削除予定。
   */
  onValueChange?: (value: T) => void
  size?: "sm" | "md"
  className?: string
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
