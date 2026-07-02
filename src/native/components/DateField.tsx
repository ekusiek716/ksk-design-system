import React from "react"
import { DatePicker } from "./DatePicker"

/** "YYYY-MM-DD" → Date（ローカル midnight）。空文字・不正値は undefined。 */
function strToDate(s: string): Date | undefined {
  if (!s) return undefined
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return undefined
  const y = Number(m[1])
  const mo = Number(m[2])
  const day = Number(m[3])
  const d = new Date(y, mo - 1, day)
  // Date コンストラクタは "2026-02-31" 等の範囲外値を翌月へ繰り上げて正規化してしまう。
  // 構成要素が一致しない場合は不正値として弾く。
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== day) return undefined
  return d
}

/** Date → "YYYY-MM-DD"（ローカル）。 */
function dateToStr(d: Date | undefined): string {
  if (!d || isNaN(d.getTime())) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export interface DateFieldProps {
  /** "YYYY-MM-DD" 形式の ISO 日付文字列。未選択は "" */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** DatePicker に渡す表示フォーマッタ（trigger の表示のみ。value/onChange は常に ISO 文字列） */
  formatter?: (d: Date) => string
}

/**
 * DateField — native DatePicker（Date オブジェクト API）を
 * "YYYY-MM-DD" ISO 文字列 API でラップする adapter。web 版と同じ変換ロジック。
 */
export function DateField({ value, onChange, placeholder, disabled, formatter }: DateFieldProps) {
  return (
    <DatePicker
      value={strToDate(value)}
      onChange={(d) => onChange(dateToStr(d))}
      placeholder={placeholder}
      disabled={disabled}
      formatter={formatter}
    />
  )
}
