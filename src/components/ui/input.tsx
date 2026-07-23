import * as React from "react"
import { cn } from "@/lib/utils"
import { useValueLength } from "@/lib/use-value-length"

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
  /**
   * 文字数カウンタを表示する。maxLength とセットで使うと
   * 右下に「現在/max」を表示し、上限到達時は caution 色になる。
   * controlled / uncontrolled と IME 入力の両方に追従する。
   */
  showCount?: boolean
}

const inputBaseClass = [
  "flex h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
  "file:border-0 file:bg-transparent file:typo-body-md",
  "placeholder:text-[var(--Text-Low-Emphasis)]",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20",
].join(" ")

function Input({
  className,
  type,
  startAdornment,
  endAdornment,
  showCount,
  maxLength,
  value,
  defaultValue,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  ref,
  ...props
}: InputProps) {
  const {
    ref: countRef,
    length,
    syncFromDom,
    beginComposition,
    endComposition,
  } = useValueLength<HTMLInputElement>({
    enabled: showCount === true,
    value,
    defaultValue,
    forwardedRef: ref,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    syncFromDom()
    onChange?.(event)
  }

  const input = (
    <input
      type={type}
      data-slot="input"
      ref={countRef}
      value={value}
      defaultValue={defaultValue}
      maxLength={maxLength}
      onChange={showCount ? handleChange : onChange}
      onCompositionStart={(event) => {
        beginComposition()
        onCompositionStart?.(event)
      }}
      onCompositionEnd={(event) => {
        endComposition()
        onCompositionEnd?.(event)
      }}
      className={cn(
        inputBaseClass,
        startAdornment && "pl-9",
        endAdornment && "pr-9",
        className,
      )}
      {...props}
    />
  )

  const control =
    startAdornment || endAdornment ? (
      <div data-slot="input-group" className="relative flex w-full items-center">
        {startAdornment && (
          <div className="pointer-events-none absolute left-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md select-none">
            {startAdornment}
          </div>
        )}
        {input}
        {endAdornment && (
          <div className="absolute right-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md">
            {endAdornment}
          </div>
        )}
      </div>
    ) : (
      input
    )

  if (!showCount) return control

  const atLimit = maxLength != null && length >= maxLength

  return (
    <div data-slot="input-with-count" className="w-full">
      {control}
      <div className="mt-1 flex justify-end">
        <span
          data-slot="input-count"
          className={cn(
            "typo-caption tabular-nums",
            atLimit
              ? "text-[var(--Text-Caution)]"
              : "text-[var(--Text-Low-Emphasis)]",
          )}
        >
          {length}
          {maxLength != null ? `/${maxLength}` : ""}
        </span>
      </div>
    </div>
  )
}

export { Input }
export type { InputProps }
