/**
 * @vitest-environment jsdom
 *
 * KskLabelsProvider（issue #723）。DS 部品の既定文言をまとめて切り替える。
 * Provider を置かないときの文言・DOM は従来どおり日本語。
 */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { KskLabelsProvider, useKskLabels } from "../src/components/ui/ksk-labels"
import { SkipLink } from "../src/components/ui/skip-link"
import { FormField } from "../src/components/patterns/form-field"
import { Screen } from "../src/components/patterns/screen"
import { AppShell } from "../src/components/patterns/shells/app-shell"
import { MarketingShell } from "../src/components/patterns/shells/marketing-shell"
import { AdminShell } from "../src/components/patterns/shells/admin-shell"
import { MonthCalendar } from "../src/components/patterns/month-calendar"
import { AgendaList } from "../src/components/patterns/agenda-list"
import { NavigationBar } from "../src/components/ui/navigation-bar"
import { KSK_DEFAULT_LABELS } from "../src/components/ui/ksk-labels"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const pill = (required: boolean) => (
  <FormField label="名前" requiredStyle="pill" required={required}>
    <input />
  </FormField>
)

describe("KskLabelsProvider", () => {
  it("Provider 無しは従来どおり日本語（DOM も同じ）", () => {
    expect(renderToStaticMarkup(<SkipLink targetId="m" />)).toContain(">コンテンツへ移動</a>")
    expect(renderToStaticMarkup(pill(true))).toContain(">必須</span>")
    expect(renderToStaticMarkup(pill(false))).toContain(">任意</span>")
    const admin = renderToStaticMarkup(<AdminShell sidebar={<nav />} mobileDrawer />)
    expect(admin).toContain('aria-label="メニューを開く"')
    expect(admin).toContain(">コンテンツへ移動</a>")
  })

  it('locale="en" で skip link・メニュー・必須/任意が英語になる', () => {
    const wrap = (node: React.ReactNode) => renderToStaticMarkup(<KskLabelsProvider locale="en">{node}</KskLabelsProvider>)
    expect(wrap(<SkipLink targetId="m" />)).toContain(">Skip to content</a>")
    expect(wrap(pill(true))).toContain(">Required</span>")
    expect(wrap(pill(false))).toContain(">Optional</span>")
    expect(wrap(<Screen>本文</Screen>)).toContain(">Skip to content</a>")
    expect(wrap(<AppShell>本文</AppShell>)).toContain(">Skip to content</a>")
    expect(wrap(<MarketingShell>本文</MarketingShell>)).toContain(">Skip to content</a>")
    expect(wrap(<AdminShell sidebar={<nav />} mobileDrawer />)).toContain('aria-label="Open menu"')
  })

  it("部品に渡した prop > labels > locale の既定", () => {
    const html = renderToStaticMarkup(
      <KskLabelsProvider locale="en" labels={{ skipLink: "本文へ" }}>
        <SkipLink targetId="a" />
        <SkipLink targetId="b" label="明示" />
      </KskLabelsProvider>
    )
    expect(html).toContain(">本文へ</a>")
    expect(html).toContain(">明示</a>")
  })

  it("入れ子の labels は外側に重ね、locale を指定した内側はその言語から組み直す", () => {
    let seen: ReturnType<typeof useKskLabels> | undefined
    let seenInnerLocale: ReturnType<typeof useKskLabels> | undefined
    const Probe = ({ onLabels }: { onLabels: (l: ReturnType<typeof useKskLabels>) => void }) => {
      onLabels(useKskLabels())
      return null
    }
    renderToStaticMarkup(
      <KskLabelsProvider locale="en" labels={{ close: "Dismiss" }}>
        <KskLabelsProvider labels={{ required: "Must" }}>
          <Probe onLabels={(l) => (seen = l)} />
        </KskLabelsProvider>
        <KskLabelsProvider locale="ja">
          <Probe onLabels={(l) => (seenInnerLocale = l)} />
        </KskLabelsProvider>
      </KskLabelsProvider>
    )
    expect(seen?.close).toBe("Dismiss")
    expect(seen?.required).toBe("Must")
    expect(seen?.skipLink).toBe("Skip to content")
    expect(seenInnerLocale?.close).toBe("閉じる")
  })

  it("skipLinkLabel={null} / \"\" は従来どおりスキップリンクを出さない", () => {
    expect(renderToStaticMarkup(<AppShell skipLinkLabel={null}>x</AppShell>)).not.toContain("<a")
    expect(renderToStaticMarkup(<Screen skipLinkLabel="">x</Screen>)).not.toContain("Skip")
    expect(renderToStaticMarkup(<Screen skipLinkLabel="">x</Screen>)).not.toContain("コンテンツへ移動")
  })

  it("MonthCalendar / AgendaList の locale 既定は Provider の locale（明示 locale が勝つ）", () => {
    const events = [{ id: "1", date: "2026-10-03", label: "打合せ" }]
    const en = renderToStaticMarkup(
      <KskLabelsProvider locale="en">
        <MonthCalendar month="2026-10" today="2026-10-01" events={events} />
        <AgendaList events={events} today="2026-10-01" />
      </KskLabelsProvider>
    )
    expect(en).toContain('aria-label="October 2026"')
    expect(en).toContain(">Sun<")
    const explicit = renderToStaticMarkup(
      <KskLabelsProvider locale="en">
        <MonthCalendar month="2026-10" today="2026-10-01" locale="ja" />
      </KskLabelsProvider>
    )
    expect(explicit).toContain('aria-label="2026年10月"')
    expect(renderToStaticMarkup(<MonthCalendar month="2026-10" today="2026-10-01" />)).toContain('aria-label="2026年10月"')
  })

  it("Provider 無しの既定文言は 2.14 までの日本語と 1 文字も違わない", () => {
    // 既存キーの文言が 1 文字も変わらないことを固定する。v2.21 以降に足したキー（Pagination 等）は
    // ksk-labels-coverage.test.tsx が Provider 無し=日本語で固定するため、ここは既存キーだけ見る
    expect(KSK_DEFAULT_LABELS.ja).toMatchObject({
      skipLink: "コンテンツへ移動",
      mobileMenu: "メニューを開く",
      mobileDrawerTitle: "メニュー",
      required: "必須",
      optional: "任意",
      close: "閉じる",
      back: "戻る",
      share: "シェア",
      calendarToday: "今日へ",
      calendarPrevMonth: "前の月",
      calendarNextMonth: "次の月",
      calendarExpand: "月全体を表示",
      // StarRating（issue #746）: 従来の直書きの既定と同じ文言（`{value}` / `{max}` は値に置き換える）
      ratingGroup: "評価",
      ratingValue: "{value}/{max}点",
      ratingStar: "{value}点",
      // KebabMenu（issue #752）: 従来の直書きの既定と同じ文言
      menu: "メニュー",
    })
    const nav = renderToStaticMarkup(<NavigationBar onLeft={() => {}} onShare={() => {}} />)
    expect(nav).toContain('aria-label="戻る"')
    expect(nav).toContain('aria-label="シェア"')
    expect(renderToStaticMarkup(<NavigationBar leftIcon="close" onLeft={() => {}} />)).toContain('aria-label="閉じる"')
  })

  it("NavigationBar の戻る / 閉じる / シェアも Provider に従う（明示 prop が勝つ）", () => {
    const en = (node: React.ReactNode) => renderToStaticMarkup(<KskLabelsProvider locale="en">{node}</KskLabelsProvider>)
    const nav = en(<NavigationBar onLeft={() => {}} onShare={() => {}} />)
    expect(nav).toContain('aria-label="Back"')
    expect(nav).toContain('aria-label="Share"')
    expect(en(<NavigationBar leftIcon="close" onLeft={() => {}} />)).toContain('aria-label="Close"')
    expect(en(<NavigationBar onLeft={() => {}} onShare={() => {}} shareLabel="送る" />)).toContain('aria-label="送る"')
  })

  it("labels をインラインで渡しても、キーと値が同じなら context 値を変えない（配下を再レンダーしない）", () => {
    const seen: ReturnType<typeof useKskLabels>[] = []
    const Probe = React.memo(function Probe() {
      seen.push(useKskLabels())
      return null
    })
    const el = document.createElement("div")
    const root = createRoot(el)
    const ui = (close: string) => (
      <KskLabelsProvider locale="en" labels={{ close }}>
        <Probe />
      </KskLabelsProvider>
    )
    act(() => root.render(ui("Dismiss")))
    act(() => root.render(ui("Dismiss")))
    act(() => root.render(ui("Dismiss")))
    // memo の Probe は context が変わったときだけ描き直す
    expect(seen.length).toBe(1)
    act(() => root.render(ui("Hide")))
    expect(seen.length).toBe(2)
    expect(seen[1].close).toBe("Hide")
    act(() => root.unmount())
  })
})
