import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import {
  DateTimePicker,
  replaceDatePart,
  replaceTimePart,
} from "../src/components/ui/date-time-picker"
import * as PublicApi from "../src/index"

describe("DateTimePicker value composition", () => {
  it("日付だけ変更しても時刻を保持する", () => {
    const current = new Date(2026, 6, 23, 14, 35, 12, 345)
    const selected = new Date(2026, 7, 5)
    const next = replaceDatePart(current, selected)

    expect([
      next.getFullYear(),
      next.getMonth(),
      next.getDate(),
      next.getHours(),
      next.getMinutes(),
      next.getSeconds(),
      next.getMilliseconds(),
    ]).toEqual([2026, 7, 5, 14, 35, 12, 345])
  })

  it("時刻だけ変更しても日付を保持する", () => {
    const current = new Date(2026, 6, 23, 14, 35, 12, 345)
    const next = replaceTimePart(current, "09:10")

    expect([
      next.getFullYear(),
      next.getMonth(),
      next.getDate(),
      next.getHours(),
      next.getMinutes(),
      next.getSeconds(),
      next.getMilliseconds(),
    ]).toEqual([2026, 6, 23, 9, 10, 12, 345])
  })

  it("min / max の範囲へ合成結果を収める", () => {
    const min = new Date(2026, 6, 23, 9, 0)
    const max = new Date(2026, 6, 23, 18, 0)
    const current = new Date(2026, 6, 23, 12, 0)

    expect(replaceTimePart(current, "08:30", min, max).getTime()).toBe(
      min.getTime(),
    )
    expect(replaceTimePart(current, "19:30", min, max).getTime()).toBe(
      max.getTime(),
    )
  })
})

describe("DateTimePicker contract", () => {
  it("日本語の日付表記、5分刻み、FormField 接続用 id を描画する", () => {
    const output = renderToStaticMarkup(
      <DateTimePicker
        id="publish-at"
        value={new Date(2026, 6, 23, 9, 30)}
        aria-describedby="publish-at-help"
      />,
    )

    expect(output).toContain("7月23日（木）")
    expect(output).toContain('id="publish-at"')
    expect(output).toContain('id="publish-at-time"')
    expect(output.match(/aria-describedby="publish-at-help"/g)).toHaveLength(2)
    expect(output).not.toContain('aria-label="日付を選択"')
    expect(output).not.toContain('aria-label="時刻を選択"')
  })

  it("明示した trigger label は選択値より優先する", () => {
    const output = renderToStaticMarkup(
      <DateTimePicker
        value={new Date(2026, 6, 23, 9, 30)}
        dateTriggerLabel="公開日を変更"
        timeTriggerLabel="公開時刻を変更"
      />,
    )

    expect(output).toContain('aria-label="公開日を変更"')
    expect(output).toContain('aria-label="公開時刻を変更"')
  })

  it("未選択時は時刻入力を無効にする", () => {
    const output = renderToStaticMarkup(<DateTimePicker />)
    expect(output).toContain('data-slot="date-time-picker"')
    expect(output).toContain('data-slot="time-picker-trigger" disabled=""')
  })

  it("package root から公開する", () => {
    expect(PublicApi.DateTimePicker).toBe(DateTimePicker)
  })
})
