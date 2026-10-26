/**
 * 日付の語順・件数の文を KskLabelsProvider の文言キーで差し替えられる（issue #723）。
 *
 * 対象: AgendaList / MonthCalendar / MonthCalendarHeader / DatePicker・DateRangePicker の曜日名。
 * 優先順位は「部品に直接渡した値（文言 prop・関数 prop）> `locale` prop が Provider と異なるなら
 * その言語の既定（Provider の labels は使わない）> Provider の labels > Provider の locale の既定 > 日本語」。
 * Provider 無し・`locale` prop 無し / ja / en の表示が従来と同じことは、既存の月・日の読み上げテスト
 * （month-calendar / agenda-list / calendar-nav）と、実装前後の描画 HTML の突き合わせで確認している。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { KSK_DEFAULT_LABELS, KskLabelsProvider, useKskLabelsFor, type KskLabels } from "../src/components/ui/ksk-labels"
import { AgendaList } from "../src/components/patterns/agenda-list"
import { MonthCalendar, MonthCalendarHeader } from "../src/components/patterns/month-calendar"
import { DateRangePicker, DatePicker } from "../src/components/ui/date-picker"
import { longWeekdays, shortWeekdays } from "../src/lib/calendar-labels"
import { resetDevWarnings } from "../src/lib/dev-warn"

const R = (el: React.ReactElement) => renderToStaticMarkup(el)
const OCT = new Date(2026, 9, 1)
const events = [
  { id: "a", date: "2026-10-26", label: "会議" },
  { id: "b", date: "2026-10-26", label: "Lunch" },
  { id: "c", date: "2026-10-26", label: "歯医者" },
]

/** 日本語の既定と明らかに違う、差し替え用の文言（Provider の labels） */
const CUSTOM: Partial<KskLabels> = {
  calendarWeekdaysShort: "S1,M2,T3,W4,T5,F6,S7",
  calendarWeekdaysLong: "Sun-L,Mon-L,Tue-L,Wed-L,Thu-L,Fri-L,Sat-L",
  calendarMonthsLong: "M01,M02,M03,M04,M05,M06,M07,M08,M09,M10,M11,M12",
  calendarMonthsShort: "m01,m02,m03,m04,m05,m06,m07,m08,m09,m10,m11,m12",
  calendarDayLabel: "{year}/{month} {day} ({weekday}) {monthShort}",
  calendarMonthTitle: "{monthName} of {year}",
  calendarDayToday: " [TODAY]",
  calendarDayEvents: " [{count} items: {events}]",
  calendarEventsSeparator: " / ",
  calendarMore: "{count} more...",
  agendaEmptyDay: "Nothing",
}

describe("曜日・月名の既定が Intl と同じ（labels に移しても表記が変わらない）", () => {
  const ref = (locale: string, opts: Intl.DateTimeFormatOptions, d: Date) => d.toLocaleDateString(locale, opts)
  for (const locale of ["ja", "en"] as const) {
    it(`${locale}: 曜日（短・長）と月名（短・長）が Intl の出力と一致する`, () => {
      const labels = KSK_DEFAULT_LABELS[locale]
      const short = shortWeekdays(labels, locale)
      const long = longWeekdays(labels, locale)
      for (let i = 0; i < 7; i++) {
        const d = new Date(2026, 9, 4 + i) // 2026-10-04 は日曜
        expect(d.getDay()).toBe(i)
        expect(short[i]).toBe(ref(locale, { weekday: "short" }, d))
        expect(long[i]).toBe(ref(locale, { weekday: "long" }, d))
      }
      const monthsLong = labels.calendarMonthsLong.split(",")
      const monthsShort = labels.calendarMonthsShort.split(",")
      expect(monthsLong).toHaveLength(12)
      expect(monthsShort).toHaveLength(12)
      for (let m = 0; m < 12; m++) {
        const d = new Date(2026, m, 1)
        expect(monthsLong[m]).toBe(ref(locale, { month: "long" }, d))
        // ja の短い月名は Intl では「1月」（長いのと同じ）
        expect(monthsShort[m]).toBe(ref(locale, { month: "short" }, d))
      }
    })
  }
})

describe("AgendaList: 日付・今日・予定なしを labels で差し替える", () => {
  const agenda = (props: Partial<React.ComponentProps<typeof AgendaList>> = {}) => (
    <AgendaList events={events} dates={["2026-10-25", "2026-10-26"]} today="2026-10-26" {...props} />
  )

  it("Provider の labels が見出し・曜日の列・予定なしに出る（locale prop 無し）", () => {
    const html = R(<KskLabelsProvider labels={CUSTOM}>{agenda()}</KskLabelsProvider>)
    // 10/26 は月曜 → 2 番目の曜日 "M2"。今日の接尾辞も差し替わる
    expect(html).toContain("2026/10 26 (M2) m10 [TODAY]")
    expect(html).toContain("2026/10 25 (S1) m10")
    expect(html).toContain(">M2<")
    // 10/25（予定なし）
    expect(html).toContain("Nothing")
    expect(html).not.toContain("予定なし")
  })

  it("Provider の locale が en のとき、en の既定に labels の一部だけ重ねられる", () => {
    const html = R(<KskLabelsProvider locale="en" labels={{ agendaEmptyDay: "Free" }}>{agenda()}</KskLabelsProvider>)
    expect(html).toContain("Mon, Oct 26, today")
    expect(html).toContain("Free")
    expect(html).toContain(">Mon<")
  })

  it("locale prop が Provider の locale と同じなら labels を使う", () => {
    const html = R(
      <KskLabelsProvider locale="en" labels={CUSTOM}>
        {agenda({ locale: "en" })}
      </KskLabelsProvider>
    )
    expect(html).toContain("[TODAY]")
    expect(html).toContain("Nothing")
  })

  it("locale prop が Provider の locale と異なるとき、labels は使わず指定した言語の既定になる", () => {
    const html = R(
      <KskLabelsProvider locale="ja" labels={CUSTOM}>
        {agenda({ locale: "en" })}
      </KskLabelsProvider>
    )
    expect(html).toContain("Mon, Oct 26, today")
    expect(html).toContain("No events")
    expect(html).not.toContain("[TODAY]")
    expect(html).not.toContain("Nothing")
    expect(html).not.toContain("M2")
  })

  it("Provider が locale を指定していない（labels だけ）なら ja 扱い: locale=\"ja\" は labels を使い、\"en\" は使わない", () => {
    const ja = R(<KskLabelsProvider labels={CUSTOM}>{agenda({ locale: "ja" })}</KskLabelsProvider>)
    expect(ja).toContain("[TODAY]")
    const en = R(<KskLabelsProvider labels={CUSTOM}>{agenda({ locale: "en" })}</KskLabelsProvider>)
    expect(en).toContain("No events")
    expect(en).not.toContain("[TODAY]")
  })

  it("Provider 無しで locale prop だけ渡す使い方は従来どおり（ja / en）", () => {
    expect(R(agenda({ locale: "en" }))).toContain("Mon, Oct 26, today")
    expect(R(agenda({ locale: "ja" }))).toContain("10月26日（月）、今日")
    expect(R(agenda())).toContain("10月26日（月）、今日")
  })

  it("emptyDayLabel prop は labels より優先される", () => {
    const html = R(<KskLabelsProvider labels={CUSTOM}>{agenda({ emptyDayLabel: "休み" })}</KskLabelsProvider>)
    expect(html).toContain("休み")
    expect(html).not.toContain("Nothing")
  })
})

describe("MonthCalendar: 月の見出し・日の読み上げ・「+n件」を labels で差し替える", () => {
  const cal = (props: Partial<React.ComponentProps<typeof MonthCalendar>> = {}) => (
    <MonthCalendar month={OCT} events={events} today="2026-10-26" maxEventsPerDay={1} {...props} />
  )

  it("grid の読み上げ名・曜日の列・セルの読み上げ名・「+n件」が labels になる", () => {
    const html = R(<KskLabelsProvider labels={CUSTOM}>{cal()}</KskLabelsProvider>)
    expect(html).toContain('aria-label="M10 of 2026"')
    expect(html).toContain("2026/10 26 (M2) m10 [TODAY] [3 items: 会議 / Lunch / 歯医者]")
    expect(html).toContain("2 more...")
    // 曜日の列見出し（日曜始まり）
    expect(html).toContain(">S1<")
    expect(html).toContain(">S7<")
  })

  it("weekStartsOn=1 でも曜日の並びは labels の一覧を月曜から数える", () => {
    const html = R(<KskLabelsProvider labels={CUSTOM}>{cal({ weekStartsOn: 1 })}</KskLabelsProvider>)
    const heads = [...html.matchAll(/>(S1|M2|T3|W4|T5|F6|S7)</g)].map((m) => m[1]).slice(0, 7)
    expect(heads).toEqual(["M2", "T3", "W4", "T5", "F6", "S7", "S1"])
  })

  it("locale prop が Provider の locale と異なるとき、labels は使わず指定した言語の既定になる", () => {
    const html = R(
      <KskLabelsProvider locale="ja" labels={CUSTOM}>
        {cal({ locale: "en" })}
      </KskLabelsProvider>
    )
    expect(html).toContain('aria-label="October 2026"')
    expect(html).toContain("Mon, Oct 26, today, 3 events: 会議, Lunch, 歯医者")
    expect(html).toContain("+2 more")
    expect(html).not.toContain("[TODAY]")
    expect(html).not.toContain("more...")
  })

  it("locale prop が Provider と同じ、または無いときは labels を使う", () => {
    for (const props of [{}, { locale: "ja" as const }]) {
      const html = R(<KskLabelsProvider locale="ja" labels={CUSTOM}>{cal(props)}</KskLabelsProvider>)
      expect(html).toContain("[TODAY]")
    }
    expect(R(<KskLabelsProvider locale="en" labels={CUSTOM}>{cal({ locale: "en" })}</KskLabelsProvider>)).toContain("2 more...")
  })

  it("moreLabel（関数 prop）と aria-label は labels より優先される", () => {
    const html = R(
      <KskLabelsProvider labels={CUSTOM}>{cal({ moreLabel: (n) => `他${n}`, "aria-label": "予定表" })}</KskLabelsProvider>
    )
    expect(html).toContain("他2")
    expect(html).toContain('aria-label="予定表"')
    expect(html).not.toContain("more...")
    expect(html).not.toContain("M10 of 2026")
  })

  it("MonthCalendarHeader の title の既定が calendarMonthTitle になる（locale prop が違うときは既定）", () => {
    const base = <MonthCalendarHeader month={OCT} />
    expect(R(<KskLabelsProvider labels={CUSTOM}>{base}</KskLabelsProvider>)).toContain(">M10 of 2026<")
    expect(R(<KskLabelsProvider locale="ja" labels={CUSTOM}><MonthCalendarHeader month={OCT} locale="en" /></KskLabelsProvider>)).toContain(
      ">October 2026<"
    )
    expect(R(<MonthCalendarHeader month={OCT} title="独自" />)).toContain(">独自<")
  })
})

describe("DatePicker: 曜日名（EEE / EEEE）を labels で差し替える", () => {
  const v = new Date(2026, 9, 26) // 月曜
  it("EEE / EEEE が calendarWeekdaysShort / Long になる", () => {
    const html = R(
      <KskLabelsProvider labels={CUSTOM}>
        <DatePicker value={v} dateFormat="EEE EEEE" />
        <DateRangePicker value={{ from: v, to: new Date(2026, 9, 27) }} dateFormat="EEE" />
      </KskLabelsProvider>
    )
    expect(html).toContain("M2 Mon-L")
    expect(html).toContain("M2 〜 T3")
  })

  it("Provider 無し・locale=\"en\" の既定は従来どおり", () => {
    expect(R(<DatePicker value={v} dateFormat="EEE EEEE" />)).toContain("月 月曜日")
    expect(R(<KskLabelsProvider locale="en"><DatePicker value={v} dateFormat="EEE EEEE" /></KskLabelsProvider>)).toContain("Mon Monday")
  })
})

describe("一覧の書き方: 空白は取り除き、個数が合わないときは解決している locale の既定で補う", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    resetDevWarnings()
  })

  it("各項目の前後の空白は取り除く（\"Sun, Mon, …\" でよい）", () => {
    const html = R(
      <KskLabelsProvider
        locale="en"
        labels={{
          calendarWeekdaysShort: "Su, Mo, Tu, We, Th, Fr, Sa",
          calendarMonthsLong: " Jan , Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct ,Nov,Dec",
        }}
      >
        <MonthCalendarHeader month={OCT} />
        <AgendaList events={events} today="2026-10-26" />
      </KskLabelsProvider>
    )
    expect(html).toContain(">Oct 2026<")
    expect(html).toContain(">Mo<")
    expect(html).not.toContain("> Mo<")
    expect(html).not.toContain(" Mo,")
  })

  it("en の Provider の下で個数が足りない（\"Su,Mo\"）と英語の既定で補い、開発ビルドで一度だけ warn する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const el = (
      <KskLabelsProvider locale="en" labels={{ calendarWeekdaysShort: "Su,Mo", calendarMonthsLong: "x" }}>
        <MonthCalendarHeader month={OCT} />
        <AgendaList events={events} today="2026-10-26" />
        <AgendaList events={events} today="2026-10-26" />
      </KskLabelsProvider>
    )
    const html = R(el)
    expect(html).toContain(">October 2026<")
    expect(html).toContain(">Mon<")
    expect(html).toContain("Mon, Oct 26, today")
    expect(html).not.toContain("undefined")
    expect(html).not.toContain("月")
    const messages = warn.mock.calls.map((c) => String(c[0]))
    expect(messages.filter((m) => m.includes("calendarWeekdaysShort"))).toHaveLength(1)
    expect(messages.filter((m) => m.includes("calendarMonthsLong"))).toHaveLength(1)
  })

  it("空の一覧も補う。locale prop があればその言語の既定（ja の Provider でも部品が en なら英語）", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const html = R(
      <KskLabelsProvider locale="ja" labels={{ calendarWeekdaysShort: "" }}>
        <AgendaList events={events} today="2026-10-26" locale="en" />
        <AgendaList events={events} today="2026-10-26" />
        <DatePicker value={new Date(2026, 9, 26)} dateFormat="EEE" />
      </KskLabelsProvider>
    )
    // locale="en" の部品は labels を使わず英語の既定、locale 無しの部品と DatePicker は ja の既定で補う
    expect(html).toContain(">Mon<")
    expect(html).toContain(">月<")
  })

  it("Provider 無し・locale 未指定で個数が合わないときは日本語の既定で補う", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const html = R(
      <KskLabelsProvider labels={{ calendarWeekdaysShort: "a,b,c,d,e,f", calendarMonthsLong: "x" }}>
        <MonthCalendarHeader month={OCT} />
        <AgendaList events={events} today="2026-10-26" />
      </KskLabelsProvider>
    )
    expect(html).toContain(">2026年10月<")
    expect(html).toContain(">月<")
    expect(html).not.toContain("undefined")
  })
})

describe("useKskLabelsFor（locale prop を持つ部品の既定文言）", () => {
  function Probe({ localeProp }: { localeProp?: "ja" | "en" }) {
    return <span>{useKskLabelsFor(localeProp).agendaEmptyDay}</span>
  }
  const text = (el: React.ReactElement) => R(el).replace(/<[^>]+>/g, "")

  it("Provider 無し: locale prop 無し・ja は日本語、en は英語の既定", () => {
    expect(text(<Probe />)).toBe("予定なし")
    expect(text(<Probe localeProp="ja" />)).toBe("予定なし")
    expect(text(<Probe localeProp="en" />)).toBe("No events")
  })

  it("Provider の locale と同じ / 未指定なら labels の上書きが効き、異なれば効かない", () => {
    const wrap = (locale: "ja" | "en" | undefined, localeProp?: "ja" | "en") =>
      text(
        <KskLabelsProvider locale={locale} labels={{ agendaEmptyDay: "OVERRIDE" }}>
          <Probe localeProp={localeProp} />
        </KskLabelsProvider>
      )
    expect(wrap("ja")).toBe("OVERRIDE")
    expect(wrap("ja", "ja")).toBe("OVERRIDE")
    expect(wrap("ja", "en")).toBe("No events")
    expect(wrap("en", "en")).toBe("OVERRIDE")
    expect(wrap("en", "ja")).toBe("予定なし")
    // locale 未指定の Provider（labels だけ）は ja 扱い
    expect(wrap(undefined)).toBe("OVERRIDE")
    expect(wrap(undefined, "ja")).toBe("OVERRIDE")
    expect(wrap(undefined, "en")).toBe("No events")
  })
})
