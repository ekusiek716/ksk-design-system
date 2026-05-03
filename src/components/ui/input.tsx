import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends Omit<React.ComponentProps<"input">, "prefix"> {
  /**
   * 入力フィールド左側の装飾。テキスト・アイコン・単位記号など。
   * 例: "¥", "@", <SearchIcon />
   */
  startAdornment?: React.ReactNode
  /**
   * 入力フィールド右側の装飾。テキスト・アイコン・ボタンなど。
   * 例: "%", "kg", クリアボタン, パスワード表示ボタン
   * インタラクティブ要素（ボタン等）を渡す場合はこちら（pointer-events 有効）。
   */
  endAdornment?: React.ReactNode
}

const inputBaseClass = [
  "flex h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
  "file:border-0 file:bg-transparent file:typo-body-md",
  "placeholder:text-[var(--Text-Low-Emphasis)]",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20",
].join(" ")

function Input({ className, type, startAdornment, endAdornment, ...props }: InputProps) {
  if (!startAdornment && !endAdornment) {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputBaseClass, className)}
        {...props}
      />
    )
  }

  return (
    <div data-slot="input-group" className="relative flex w-full items-center">
      {startAdornment && (
        <div className="pointer-events-none absolute left-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md select-none">
          {startAdornment}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          inputBaseClass,
          startAdornment && "pl-9",
          endAdornment && "pr-9",
          className
        )}
        {...props}
      />
      {endAdornment && (
        <div className="absolute right-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md">
          {endAdornment}
        </div>
      )}
    </div>
  )
}

export { Input }
export type { InputProps }
