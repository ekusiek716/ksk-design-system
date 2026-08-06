import { describe, expect, it } from "vitest"
import {
  buildCalendarCells,
  canGoToMonth,
  defaultDayAccessibilityLabel,
  isDayDisabled,
  monthLabel,
  resolveWeekdayTone,
  type CalendarDayInfo,
} from "../src/native/calendar-cells"

/** テストは固定日で行う（実行日に依存させない）。2026-08-06 は木曜日。 */
const TODAY = new Date(2026, 7, 6)

function dayInfo(date: Date, overrides: Partial<CalendarDayInfo> = {}): CalendarDayInfo {
  return {
    date,
    weekday: date.getDay(),
    selected: false,
    today: false,
    disabled: false,
    tone: resolveWeekdayTone(date.getDay()),
    ...overrides,
  }
}

describe("native Calendar cell logic (#298④)", () => {
  it("月グリッドは7の倍数で、先頭に曜日ぶんの空白が入る", () => {
    // 2026-08-01 は土曜（getDay()===6）→ 先頭に 6 個の null
    const cells = buildCalendarCells(new Date(2026, 7, 1))
    expect(cells.length % 7).toBe(0)
    expect(cells.slice(0, 6).every((c) => c === null)).toBe(true)
    expect(cells[6]).toBeInstanceOf(Date)
    expect((cells[6] as Date).getDate()).toBe(1)
    expect(cells.filter((c) => c !== null)).toHaveLength(31)
  })

  it("閏年の2月も日数が合う", () => {
    const cells2024 = buildCalendarCells(new Date(2024, 1, 1))
    expect(cells2024.filter((c) => c !== null)).toHaveLength(29)
    const cells2026 = buildCalendarCells(new Date(2026, 1, 1))
    expect(cells2026.filter((c) => c !== null)).toHaveLength(28)
  })

  it("曜日トーン: 日=sunday / 土=saturday / それ以外=weekday", () => {
    expect(resolveWeekdayTone(0)).toBe("sunday")
    expect(resolveWeekdayTone(6)).toBe("saturday")
    for (const d of [1, 2, 3, 4, 5]) expect(resolveWeekdayTone(d)).toBe("weekday")
  })

  it("disablePast: 今日は選べるが前日は選べない（時刻に依存しない）", () => {
    const today = new Date(2026, 7, 6, 23, 59) // 当日の遅い時刻でも当日は有効
    expect(isDayDisabled(new Date(2026, 7, 6), { disablePast: true, today })).toBe(false)
    expect(isDayDisabled(new Date(2026, 7, 5), { disablePast: true, today })).toBe(true)
    expect(isDayDisabled(new Date(2026, 7, 7), { disablePast: true, today })).toBe(false)
  })

  it("minDate / maxDate は境界日を含む", () => {
    const opts = { minDate: new Date(2026, 7, 5), maxDate: new Date(2026, 7, 20), today: TODAY }
    expect(isDayDisabled(new Date(2026, 7, 4), opts)).toBe(true)
    expect(isDayDisabled(new Date(2026, 7, 5), opts)).toBe(false)
    expect(isDayDisabled(new Date(2026, 7, 20), opts)).toBe(false)
    expect(isDayDisabled(new Date(2026, 7, 21), opts)).toBe(true)
  })

  it("disablePast と minDate 併用では遅い方が効く", () => {
    const opts = { minDate: new Date(2026, 7, 10), disablePast: true, today: TODAY }
    expect(isDayDisabled(new Date(2026, 7, 9), opts)).toBe(true)
    expect(isDayDisabled(new Date(2026, 7, 10), opts)).toBe(false)
  })

  it("月移動: 表示中の月より前が全部 disabled なら前月へ行けない", () => {
    const opts = { disablePast: true, today: TODAY }
    // 今月（2026-08）から前月へは行けない
    expect(canGoToMonth(new Date(2026, 7, 1), -1, opts)).toBe(false)
    // 翌月（2026-09）からなら今月へ戻れる
    expect(canGoToMonth(new Date(2026, 8, 1), -1, opts)).toBe(true)
    expect(canGoToMonth(new Date(2026, 7, 1), 1, opts)).toBe(true)
  })

  it("月移動: maxDate を超える月へは進めない", () => {
    const opts = { maxDate: new Date(2026, 8, 15), today: TODAY }
    expect(canGoToMonth(new Date(2026, 7, 1), 1, opts)).toBe(true) // 9月は maxDate を含む
    expect(canGoToMonth(new Date(2026, 8, 1), 1, opts)).toBe(false) // 10月は完全に範囲外
  })

  it("制限が無ければ何月でも移動できる", () => {
    expect(canGoToMonth(new Date(2026, 7, 1), -1, { today: TODAY })).toBe(true)
    expect(canGoToMonth(new Date(2026, 7, 1), 1, { today: TODAY })).toBe(true)
  })

  it("既定の日ラベルは年月日＋曜日で、今日/選択中を付記する", () => {
    const base = dayInfo(new Date(2026, 7, 6))
    expect(defaultDayAccessibilityLabel(base)).toBe("2026年8月6日 木曜日")
    expect(defaultDayAccessibilityLabel({ ...base, today: true })).toBe("2026年8月6日 木曜日 今日")
    expect(defaultDayAccessibilityLabel({ ...base, today: true, selected: true })).toBe(
      "2026年8月6日 木曜日 今日 選択中",
    )
  })

  it("locale=en では ISO 日付ベースのラベルになる", () => {
    const base = dayInfo(new Date(2026, 7, 6))
    expect(defaultDayAccessibilityLabel(base, "en")).toBe("2026-08-06")
    expect(defaultDayAccessibilityLabel({ ...base, selected: true }, "en")).toBe(
      "2026-08-06, selected",
    )
  })

  it("月ラベルは locale で切り替わる", () => {
    expect(monthLabel(new Date(2026, 7, 1), "ja")).toBe("2026年 8月")
    expect(monthLabel(new Date(2026, 7, 1), "en")).toBe("2026-08")
  })
})
