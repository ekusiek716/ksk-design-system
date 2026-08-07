import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import {
  buildCalendarCells,
  canGoToMonth,
  defaultDayAccessibilityLabel,
  isDayDisabled,
  monthLabel,
  resolveCalendarDayColors,
  resolveCalendarWeekdayTextColor,
  resolveWeekdayTone,
  type CalendarDayColorDefaults,
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

describe("日セルの色注入（issue #304）", () => {
  // DS default テーマ相当の既定色
  const DEFAULTS: CalendarDayColorDefaults = {
    selected: "#2563EB",
    selectedText: "#FFFFFF",
    today: "#2563EB",
    sunday: "#EC0000",
    saturday: "#2563EB",
    weekdayText: "#111827",
  }
  // exam-kit の資格別ブランド想定
  const BRAND = { selected: "#F97316", selectedText: "#1F2937", today: "#EA580C" }

  it("colors 未指定なら DS 既定色に落ちる（既存の見た目を変えない）", () => {
    const selected = resolveCalendarDayColors({ selected: true, tone: "weekday" }, DEFAULTS)

    expect(selected.background).toBe("#2563EB")
    expect(selected.text).toBe("#FFFFFF")
    expect(selected.accent).toBe("#2563EB")
  })

  it("colors を渡すと選択セルの背景・文字・today 色が consumer 側に切り替わる", () => {
    const selected = resolveCalendarDayColors({ selected: true, tone: "weekday" }, DEFAULTS, BRAND)

    expect(selected.background).toBe("#F97316")
    expect(selected.text).toBe("#1F2937")
    expect(selected.accent).toBe("#EA580C")
  })

  it("未選択セルの背景は常に transparent で、today 色だけは注入が効く", () => {
    const plain = resolveCalendarDayColors({ selected: false, tone: "weekday" }, DEFAULTS, BRAND)

    expect(plain.background).toBe("transparent")
    expect(plain.accent).toBe("#EA580C")
  })

  it("一部のキーだけ渡した場合、残りは既定色にフォールバックする", () => {
    const partial = resolveCalendarDayColors(
      { selected: true, tone: "weekday" },
      DEFAULTS,
      { selected: "#F97316" },
    )

    expect(partial.background).toBe("#F97316")
    expect(partial.text).toBe("#FFFFFF") // 既定のまま
  })

  it("weekendTone=false のとき曜日色は効かない（従来動作の維持）", () => {
    const sunday = resolveCalendarDayColors(
      { selected: false, tone: "sunday" },
      DEFAULTS,
      { sunday: "#00FF00" },
      false,
    )

    expect(sunday.text).toBe("")
  })

  it("weekendTone=true なら日曜・土曜の文字色を注入できる", () => {
    const colors = { sunday: "#B91C1C", saturday: "#1D4ED8" }

    expect(
      resolveCalendarWeekdayTextColor("sunday", DEFAULTS, colors, true, "#111827"),
    ).toBe("#B91C1C")
    expect(
      resolveCalendarWeekdayTextColor("saturday", DEFAULTS, colors, true, "#111827"),
    ).toBe("#1D4ED8")
    // 平日は fallback のまま
    expect(
      resolveCalendarWeekdayTextColor("weekday", DEFAULTS, colors, true, "#111827"),
    ).toBe("#111827")
  })

  it("weekendTone=true で colors 未指定なら DS 既定の日=赤 / 土=青になる", () => {
    expect(resolveCalendarWeekdayTextColor("sunday", DEFAULTS, {}, true, "#111827")).toBe("#EC0000")
    expect(resolveCalendarWeekdayTextColor("saturday", DEFAULTS, {}, true, "#111827")).toBe("#2563EB")
  })
})

describe("Calendar 月送りナビ（native, consumer指摘: タップ領域が見て分からない）", () => {
  const source = readFileSync("src/native/components/Calendar.tsx", "utf8")

  it("素の Pressable + テキストではなく DS の IconButton で組む", () => {
    expect(source).toContain('import { IconButton } from "./IconButton"')
    // 月送り2箇所とも IconButton を使う（day セルは引き続き Pressable のまま）
    expect(source.match(/<IconButton/g)?.length).toBe(2)
  })

  it("面のある variant（tertiary = Surface-Secondary の薄灰背景）を使う", () => {
    expect(source.match(/variant="tertiary"/g)?.length).toBeGreaterThanOrEqual(2)
  })

  it("色・角丸・タップ領域をハードコードせず IconButton の size prop に委ねる（44pt は icon-button-metrics.ts が保証）", () => {
    expect(source.match(/size="sm"/g)?.length).toBeGreaterThanOrEqual(2)
    // 面まわりの色を Calendar 側で直書きしていない（IconButton 内部の theme 解決に委ねる）
    expect(source).not.toMatch(/backgroundColor:\s*theme\.surface\.secondary/)
  })

  it("disabled は前月/次月それぞれ canGoPrev / canGoNext をそのまま渡し、IconButton 既定の減光で区別する", () => {
    expect(source).toContain("disabled={!canGoPrev}")
    expect(source).toContain("disabled={!canGoNext}")
  })

  it("previousMonthLabel / nextMonthLabel の読み上げラベル契約を維持する", () => {
    expect(source).toContain(
      'accessibilityLabel={previousMonthLabel ?? (locale === "ja" ? "前の月" : "Previous month")}',
    )
    expect(source).toContain(
      'accessibilityLabel={nextMonthLabel ?? (locale === "ja" ? "次の月" : "Next month")}',
    )
  })
})
