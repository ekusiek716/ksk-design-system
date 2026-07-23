import React from "react"
import { View, type StyleProp, type ViewStyle } from "react-native"

import { useTheme } from "../theme/ThemeProvider"
import { DatePicker } from "./DatePicker"
import { TimePicker, type TimePickerProps, type TimeValue } from "./TimePicker"

export interface DateTimePickerProps {
  value?: Date
  onChange?: (value: Date | undefined) => void
  minuteStep?: TimePickerProps["minuteStep"]
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

function clamp(value: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && value < minDate) return new Date(minDate)
  if (maxDate && value > maxDate) return new Date(maxDate)
  return value
}

export function DateTimePicker({
  value,
  onChange,
  minuteStep = 5,
  minDate,
  maxDate,
  disabled = false,
  style,
}: DateTimePickerProps) {
  const { scales } = useTheme()
  const timeValue: TimeValue | undefined = value
    ? { hour: value.getHours(), minute: value.getMinutes() }
    : undefined

  return (
    <View style={[{ gap: scales.spacing.scale[2] }, style]}>
      <DatePicker
        value={value}
        onChange={(selected) => {
          const next = new Date(selected)
          next.setHours(
            value?.getHours() ?? 0,
            value?.getMinutes() ?? 0,
            value?.getSeconds() ?? 0,
            value?.getMilliseconds() ?? 0,
          )
          onChange?.(clamp(next, minDate, maxDate))
        }}
        minDate={minDate}
        maxDate={maxDate}
        formatter={(date) =>
          `${date.getMonth() + 1}月${date.getDate()}日（${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}）`
        }
        disabled={disabled}
      />
      <TimePicker
        value={timeValue}
        onChange={(time) => {
          if (!value) return
          const next = new Date(value)
          next.setHours(
            time.hour,
            time.minute,
            value.getSeconds(),
            value.getMilliseconds(),
          )
          onChange?.(clamp(next, minDate, maxDate))
        }}
        minuteStep={minuteStep}
        disabled={disabled || !value}
      />
    </View>
  )
}
