import { cn } from "@/lib/utils"
import { DatePicker } from "./date-picker"

/** "YYYY-MM-DD" → Date（ローカル midnight）。空文字・不正値は undefined。 */
function strToDate(s: string): Date | undefined {
  if (!s) return undefined
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return undefined
  // new Date(y, m-1, d) のローカルタイム方式（UTC 変換を挟まないため TZ ずれが起きない）
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

interface DateFieldProps {
  /** "YYYY-MM-DD" 形式の ISO 日付文字列。未選択は "" */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** DatePicker に渡す表示フォーマット（trigger の表示のみ。value/onChange は常に ISO 文字列） */
  dateFormat?: string
}

/**
 * DateField — DS の DatePicker（Date オブジェクト API）を
 * "YYYY-MM-DD" ISO 文字列 API でラップする adapter。
 *
 * バックエンド/store が ISO date 文字列で日付を保持するケース向け。
 * strToDate/dateToStr は `new Date(y, m-1, d)` のローカルタイム方式で
 * UTC 変換を経由しないため、日付が前後にずれない。
 */
function DateField({ value, onChange, placeholder, disabled, className, dateFormat }: DateFieldProps) {
  return (
    <div
      data-slot="date-field"
      className={cn(
        // DatePicker トリガーは内部 width が auto のため、長い placeholder と
        // 組み合わせると縦に潰れて見える。ここで幅・高さ・角丸・paddingを担保する。
        "w-full [&>button]:w-full [&>button]:h-12 [&>button]:rounded-lg [&>button]:px-3",
        className
      )}
    >
      <DatePicker
        value={strToDate(value)}
        onChange={(d) => onChange(dateToStr(d))}
        placeholder={placeholder}
        disabled={disabled}
        dateFormat={dateFormat}
      />
    </div>
  )
}

export { DateField, strToDate, dateToStr }
export type { DateFieldProps }
