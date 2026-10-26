/**
 * MonthCalendarHeader の「今日へ」・前後の月ボタンと MonthCalendarExpandToggle の読み上げ名が、
 * 月の見出しと同じく `locale` prop に従う（issue #723 の続き）。
 *
 * 優先順位は「部品に直接渡した文言 prop > `locale` prop が Provider と異なるならその言語の既定
 * （Provider の labels は使わない）> Provider の labels > Provider の locale の既定 > 日本語」。
 * Provider 無し・`locale` 未指定・Provider と同じ locale の描画が従来と同じことは、
 * このファイルの固定値と、実装前（main）の描画 HTML との突き合わせで確認している。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { KskLabelsProvider, type KskLabels } from "../src/components/ui/ksk-labels"
import { MonthCalendarExpandToggle, MonthCalendarHeader } from "../src/components/patterns/month-calendar"

const R = (el: React.ReactElement) => renderToStaticMarkup(el)
const OCT = new Date(2026, 9, 1)
const noop = () => {}

const CUSTOM: Partial<KskLabels> = {
  calendarToday: "ホーム",
  calendarPrevMonth: "先月",
  calendarNextMonth: "来月",
  calendarExpand: "全部見る",
}

type HeaderProps = Partial<React.ComponentProps<typeof MonthCalendarHeader>>
const header = (props: HeaderProps = {}) => (
  <MonthCalendarHeader month={OCT} onToday={noop} onPrev={noop} onNext={noop} {...props} />
)
const toggle = (props: Partial<React.ComponentProps<typeof MonthCalendarExpandToggle>> = {}) => (
  <MonthCalendarExpandToggle expanded={false} onExpandedChange={noop} {...props} />
)

const JA = [">今日へ<", 'aria-label="前の月"', 'aria-label="次の月"', ">2026年10月<"]
const EN = [">Today<", 'aria-label="Previous month"', 'aria-label="Next month"', ">October 2026<"]
const CUSTOM_PARTS = [">ホーム<", 'aria-label="先月"', 'aria-label="来月"']
const expectAll = (html: string, parts: string[]) => parts.forEach((p) => expect(html).toContain(p))
const expectNone = (html: string, parts: string[]) => parts.forEach((p) => expect(html).not.toContain(p))

describe("MonthCalendarHeader: ボタンの文言も locale prop に従う", () => {
  it('Provider 無し + locale="en": 見出しもボタンも英語', () => {
    const html = R(header({ locale: "en" }))
    expectAll(html, EN)
    expectNone(html, ["今日へ", "前の月", "次の月"])
  })

  it('Provider en + locale="ja": ボタンも日本語', () => {
    const html = R(<KskLabelsProvider locale="en">{header({ locale: "ja" })}</KskLabelsProvider>)
    expectAll(html, JA)
    expectNone(html, ["Today", "Previous month", "Next month"])
  })

  it('labels だけの Provider（locale 未指定は ja 扱い）+ locale="en": 差し替えは無視され英語の既定', () => {
    const html = R(<KskLabelsProvider labels={CUSTOM}>{header({ locale: "en" })}</KskLabelsProvider>)
    expectAll(html, EN)
    expectNone(html, ["ホーム", "先月", "来月"])
  })

  it('Provider ja + labels + locale="en": 差し替えは無視され英語の既定', () => {
    const html = R(
      <KskLabelsProvider locale="ja" labels={CUSTOM}>
        {header({ locale: "en" })}
      </KskLabelsProvider>
    )
    expectAll(html, EN)
    expectNone(html, ["ホーム", "先月", "来月"])
  })

  it("todayLabel / prevLabel / nextLabel は locale prop より優先", () => {
    const html = R(header({ locale: "en", todayLabel: "本日", prevLabel: "前へ", nextLabel: "次へ" }))
    expectAll(html, [">本日<", 'aria-label="前へ"', 'aria-label="次へ"'])
    expectNone(html, ["Today", "Previous month", "Next month"])
  })

  describe("変わらない構成（従来どおり）", () => {
    it("Provider 無し・locale 未指定 / locale=\"ja\": 日本語", () => {
      expectAll(R(header()), JA)
      expectAll(R(header({ locale: "ja" })), JA)
    })
    it('Provider en・locale 未指定 / locale="en": 英語', () => {
      expectAll(R(<KskLabelsProvider locale="en">{header()}</KskLabelsProvider>), EN)
      expectAll(R(<KskLabelsProvider locale="en">{header({ locale: "en" })}</KskLabelsProvider>), EN)
    })
    it("Provider の labels は locale 未指定・Provider と同じ locale ならそのまま効く", () => {
      for (const props of [{}, { locale: "ja" as const }]) {
        expectAll(R(<KskLabelsProvider labels={CUSTOM}>{header(props)}</KskLabelsProvider>), CUSTOM_PARTS)
      }
      const en = R(
        <KskLabelsProvider locale="en" labels={CUSTOM}>
          {header({ locale: "en" })}
        </KskLabelsProvider>
      )
      expectAll(en, CUSTOM_PARTS)
    })
  })
})

describe("MonthCalendarExpandToggle: label の既定が locale prop に従う", () => {
  it('Provider 無し + locale="en": 英語', () => {
    expect(R(toggle({ locale: "en" }))).toContain('aria-label="Show full month"')
  })
  it('Provider en + locale="ja": 日本語', () => {
    expect(R(<KskLabelsProvider locale="en">{toggle({ locale: "ja" })}</KskLabelsProvider>)).toContain(
      'aria-label="月全体を表示"'
    )
  })
  it('labels だけの Provider + locale="en": 差し替えは無視され英語の既定', () => {
    const html = R(<KskLabelsProvider labels={CUSTOM}>{toggle({ locale: "en" })}</KskLabelsProvider>)
    expect(html).toContain('aria-label="Show full month"')
    expect(html).not.toContain("全部見る")
  })
  it("label prop が最優先", () => {
    expect(R(toggle({ locale: "en", label: "もっと" }))).toContain('aria-label="もっと"')
  })
  it("locale は DOM に出ない", () => {
    expect(R(toggle({ locale: "en" }))).not.toContain("locale=")
  })
  it("変わらない構成: Provider 無し / locale 未指定 / Provider と同じ locale", () => {
    expect(R(toggle())).toContain('aria-label="月全体を表示"')
    expect(R(<KskLabelsProvider labels={CUSTOM}>{toggle()}</KskLabelsProvider>)).toContain('aria-label="全部見る"')
    expect(
      R(
        <KskLabelsProvider locale="en" labels={CUSTOM}>
          {toggle({ locale: "en" })}
        </KskLabelsProvider>
      )
    ).toContain('aria-label="全部見る"')
    expect(R(<KskLabelsProvider locale="en">{toggle()}</KskLabelsProvider>)).toContain('aria-label="Show full month"')
  })
})
