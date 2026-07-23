import * as React from "react"

import { cn } from "@/lib/utils"
import { DatePicker } from "./date-picker"
import { TimePicker } from "./time-picker"

interface DateTimePickerProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: Date
  onChange?: (value: Date | undefined) => void
  /** 分の刻み幅。@default 5 */
  minuteStep?: number
  min?: Date
  max?: Date
  disabled?: boolean
  datePlaceholder?: string
  timePlaceholder?: string
  dateTriggerLabel?: string
  timeTriggerLabel?: string
}

function clampDate(value: Date, min?: Date, max?: Date): Date {
  if (min && value < min) return new Date(min)
  if (max && value > max) return new Date(max)
  return value
}

function replaceDatePart(
  current: Date | undefined,
  selected: Date,
  min?: Date,
  max?: Date,
): Date {
  const next = new Date(selected)
  if (current && !Number.isNaN(current.getTime())) {
    next.setHours(
      current.getHours(),
      current.getMinutes(),
      current.getSeconds(),
      current.getMilliseconds(),
    )
  } else {
    next.setHours(0, 0, 0, 0)
  }
  return clampDate(next, min, max)
}

function replaceTimePart(
  current: Date,
  time: string,
  min?: Date,
  max?: Date,
): Date {
  const [hour, minute] = time.split(":").map(Number)
  const next = new Date(current)
  next.setHours(hour, minute, current.getSeconds(), current.getMilliseconds())
  return clampDate(next, min, max)
}

/**
 * 日付と時刻を単一の `Date` として編集する複合入力。
 *
 * `Date` のローカル getter / setter だけを使い、UTC や別タイムゾーンへの
 * 変換は行わない。JST 前提の業務画面など、利用側と保存側のタイムゾーンが
 * 一致する用途向け。
 */
function DateTimePicker({
  id,
  value,
  onChange,
  minuteStep = 5,
  min,
  max,
  disabled = false,
  datePlaceholder = "日付を選択",
  timePlaceholder = "時刻を選択",
  dateTriggerLabel,
  timeTriggerLabel,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: DateTimePickerProps) {
  const timeValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
    : undefined

  return (
    <div
      data-slot="date-time-picker"
      className={cn("grid grid-cols-[minmax(0,1fr)_8rem] gap-2", className)}
      {...props}
    >
      <DatePicker
        id={id}
        value={value}
        onChange={(selected) => {
          onChange?.(
            selected ? replaceDatePart(value, selected, min, max) : undefined,
          )
        }}
        placeholder={datePlaceholder}
        triggerLabel={dateTriggerLabel}
        dateFormat="M月d日（EEE）"
        min={min}
        max={max}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      />
      <TimePicker
        id={id ? `${id}-time` : undefined}
        value={timeValue}
        onChange={(time) => {
          if (value) onChange?.(replaceTimePart(value, time, min, max))
        }}
        placeholder={timePlaceholder}
        triggerLabel={timeTriggerLabel}
        minuteStep={minuteStep}
        disabled={disabled || !value}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      />
    </div>
  )
}

export { DateTimePicker, clampDate, replaceDatePart, replaceTimePart }
export type { DateTimePickerProps }
