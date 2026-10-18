/** @vitest-environment jsdom */
import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { Banner } from "../src/components/patterns/banner"
import { DetailSheetHeader } from "../src/components/patterns/detail-sheet-scaffold"
import { FormField } from "../src/components/patterns/form-field"
import { MonthCalendarHeader } from "../src/components/patterns/month-calendar"
import { PillToggle } from "../src/components/ui/pill-toggle"
import { resetDevWarnings } from "../src/lib/dev-warn"

const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

describe("Banner live (#740)", () => {
  const role = (ui: React.ReactElement) => host(ui).querySelector('[data-slot="banner"]')!.getAttribute("role")

  it("既定は variant から決める: warning / caution は alert、info / success / 未指定は status", () => {
    expect(role(<Banner variant="warning" description="d" />)).toBe("alert")
    expect(role(<Banner variant="caution" description="d" />)).toBe("alert")
    expect(role(<Banner variant="info" description="d" />)).toBe("status")
    expect(role(<Banner variant="success" description="d" />)).toBe("status")
    expect(role(<Banner description="d" />)).toBe("status")
  })

  it("live で明示できる（assertive=alert / polite=status / off=role なし）", () => {
    expect(role(<Banner variant="info" live="assertive" description="d" />)).toBe("alert")
    expect(role(<Banner variant="warning" live="polite" description="d" />)).toBe("status")
    expect(role(<Banner variant="warning" live="off" description="d" />)).toBeNull()
  })

  it("consumer の role 明示は live より優先する（既存の上書きを壊さない）", () => {
    expect(role(<Banner variant="info" role="alert" description="d" />)).toBe("alert")
    expect(role(<Banner variant="warning" live="off" role="note" description="d" />)).toBe("note")
  })
})

describe("PillToggle の名前と semantics (#741)", () => {
  const OPTIONS = [
    { label: "週", value: "week" },
    { label: "月", value: "month" },
  ]
  afterEach(() => {
    resetDevWarnings()
    vi.restoreAllMocks()
  })

  it("既定（tabs）は従来どおり tablist で、aria-label / aria-labelledby を tablist へ渡す", () => {
    const el = host(<PillToggle aria-label="表示" options={OPTIONS} value="week" onChange={() => {}} />)
    const list = el.querySelector('[role="tablist"]')!
    expect(list.getAttribute("aria-label")).toBe("表示")
    expect(el.querySelectorAll('[role="tab"]')).toHaveLength(2)
    expect(el.querySelector('[role="radiogroup"]')).toBeNull()

    const el2 = host(<PillToggle aria-labelledby="h" options={OPTIONS} value="week" onChange={() => {}} />)
    expect(el2.querySelector('[role="tablist"]')!.getAttribute("aria-labelledby")).toBe("h")
  })

  it('semantics="radio" は radiogroup / radio で、選択中は aria-checked=true', () => {
    const el = host(<PillToggle semantics="radio" aria-label="単位" options={OPTIONS} value="month" onChange={() => {}} />)
    const group = el.querySelector('[role="radiogroup"]')!
    expect(group.getAttribute("aria-label")).toBe("単位")
    expect(group.getAttribute("data-slot")).toBe("pill-toggle")
    const radios = [...el.querySelectorAll('[role="radio"]')]
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["false", "true"])
    expect(el.querySelector('[role="tablist"]')).toBeNull()
    expect(el.querySelector('[role="tabpanel"]')).toBeNull()
  })

  it("FormField as=group の中では radiogroup 自身もそのラベルで名付け、警告を出さない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const el = host(
      <FormField as="group" label="表示単位">
        <PillToggle semantics="radio" options={OPTIONS} value="week" onChange={() => {}} />
      </FormField>
    )
    const labelId = el.querySelector("span[id]")!.id
    expect(el.querySelector('[role="group"]')!.getAttribute("aria-labelledby")).toBe(labelId)
    expect(el.querySelector('[role="radiogroup"]')!.getAttribute("aria-labelledby")).toBe(labelId)
    expect(warn).not.toHaveBeenCalled()
  })

  it("aria-label / aria-labelledby の明示は group のラベルより優先する。tabs は内側へ名前を足さない", () => {
    const inGroup = (ui: React.ReactElement) => host(<FormField as="group" label="表示単位">{ui}</FormField>)
    const a = inGroup(<PillToggle semantics="radio" aria-label="単位" options={OPTIONS} value="week" onChange={() => {}} />)
    expect(a.querySelector('[role="radiogroup"]')!.getAttribute("aria-label")).toBe("単位")
    expect(a.querySelector('[role="radiogroup"]')!.hasAttribute("aria-labelledby")).toBe(false)
    const b = inGroup(<PillToggle semantics="radio" aria-labelledby="x" options={OPTIONS} value="week" onChange={() => {}} />)
    expect(b.querySelector('[role="radiogroup"]')!.getAttribute("aria-labelledby")).toBe("x")
    const t = inGroup(<PillToggle options={OPTIONS} value="week" onChange={() => {}} />)
    expect(t.querySelector('[role="tablist"]')!.hasAttribute("aria-labelledby")).toBe(false)
  })

  it('semantics="radio" の name は <form> の送信値（FormData）に入る', async () => {
    const { createRoot } = await import("react-dom/client")
    const { act } = await import("react")
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
    // jsdom に無い ResizeObserver（Radix の hidden input の大きさ合わせで使う）を空実装で補う
    vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} })
    const div = document.createElement("div")
    document.body.appendChild(div)
    const root = createRoot(div)
    await act(async () =>
      root.render(
        <form>
          <PillToggle semantics="radio" name="unit" aria-label="単位" options={OPTIONS} value="month" onChange={() => {}} />
        </form>
      )
    )
    expect(new FormData(div.querySelector("form")!).get("unit")).toBe("month")
    await act(async () => root.unmount())
    div.remove()
    vi.unstubAllGlobals()
  })

  describe('semantics="radio" の操作（jsdom）', () => {
    const mount = async (ui: React.ReactElement) => {
      const { createRoot } = await import("react-dom/client")
      const { act } = await import("react")
      ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
      vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} })
      const div = document.createElement("div")
      document.body.appendChild(div)
      const root = createRoot(div)
      await act(async () => root.render(ui))
      const radios = () => [...div.querySelectorAll<HTMLButtonElement>('[role="radio"]')]
      const cleanup = async () => {
        await act(async () => root.unmount())
        div.remove()
        vi.unstubAllGlobals()
      }
      return { div, radios, act, cleanup }
    }

    function Controlled({ alias, onSpy }: { alias?: boolean; onSpy: (v: string) => void }) {
      const [v, setV] = React.useState("week")
      const handle = (next: string) => {
        onSpy(next)
        setV(next)
      }
      return alias ? (
        <PillToggle semantics="radio" aria-label="単位" options={OPTIONS} value={v} onValueChange={handle} />
      ) : (
        <PillToggle semantics="radio" aria-label="単位" options={OPTIONS} value={v} onChange={handle} />
      )
    }

    for (const alias of [false, true]) {
      it(`クリックで ${alias ? "onValueChange（旧 alias）" : "onChange"} が呼ばれ、選択が移る`, async () => {
        const spy = vi.fn()
        const { radios, act, cleanup } = await mount(<Controlled alias={alias} onSpy={spy} />)
        await act(async () => radios()[1].click())
        expect(spy).toHaveBeenCalledWith("month")
        expect(radios().map((r) => r.getAttribute("aria-checked"))).toEqual(["false", "true"])
        await cleanup()
      })
    }

    it("Tab で止まるのは選択中の 1 つだけ（roving focus: 項目は全部 tabindex=-1、入口の 1 か所から選択中へ送る）", async () => {
      const { div, radios, act, cleanup } = await mount(<Controlled onSpy={() => {}} />)
      await act(async () => radios()[1].click())
      ;(document.activeElement as HTMLElement | null)?.blur()
      // Tab で入れる場所はグループの 1 か所だけ
      const tabbable = [...div.querySelectorAll<HTMLElement>("[tabindex]")].filter((el) => el.tabIndex >= 0)
      expect(tabbable).toHaveLength(1)
      expect(radios().every((r) => r.tabIndex === -1)).toBe(true)
      // そこへ Tab で入ると、選択中の項目へフォーカスが送られる
      await act(async () => tabbable[0].focus())
      expect(document.activeElement).toBe(radios()[1])
      await cleanup()
    })

    it("ArrowRight で次へフォーカスが移り、選択も移る", async () => {
      const spy = vi.fn()
      const { radios, act, cleanup } = await mount(<Controlled onSpy={spy} />)
      radios()[0].focus()
      await act(async () => {
        radios()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))
        // Radix はフォーカス移動を setTimeout で行い、矢印キーを押している間に移ったフォーカスで選択する
        await new Promise((r) => setTimeout(r, 20))
        document.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowRight", bubbles: true }))
      })
      expect(document.activeElement).toBe(radios()[1])
      expect(spy).toHaveBeenCalledWith("month")
      expect(radios()[1].getAttribute("aria-checked")).toBe("true")
      await cleanup()
    })
  })

  it("tabs と radio の項目・トラックは選択状態以外の class が一致する（共有定数の崩れ検出）", () => {
    const stateful = /(^|:)data-\[state=|^forced-colors:data-\[state=/
    const tokens = (el: Element) => el.className.split(/\s+/).filter((c) => c && !stateful.test(c)).sort()
    const tabs = host(<PillToggle options={OPTIONS} value="week" onChange={() => {}} />)
    const radio = host(<PillToggle semantics="radio" options={OPTIONS} value="week" onChange={() => {}} aria-label="x" />)
    const vertical = (c: string) => !c.startsWith("data-[orientation=vertical]")
    expect(tokens(radio.querySelector('[role="radio"]')!)).toEqual(tokens(tabs.querySelector('[role="tab"]')!).filter(vertical))
    expect(tokens(radio.querySelector('[role="radiogroup"]')!)).toEqual(tokens(tabs.querySelector('[role="tablist"]')!).filter(vertical))
  })

  it('semantics="tabs" で name を渡すと開発ビルドで 1 回警告する', async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { createRoot } = await import("react-dom/client")
    const { act } = await import("react")
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
    const root = createRoot(document.createElement("div"))
    await act(async () => root.render(<PillToggle name="unit" aria-label="x" options={OPTIONS} value="week" onChange={() => {}} />))
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain("name")
    await act(async () => root.unmount())
  })

  it("radio で名前も group も無いときだけ開発ビルドで警告する", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { createRoot } = await import("react-dom/client")
    const { act } = await import("react")
    const div = document.createElement("div")
    const root = createRoot(div)
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
    await act(async () => root.render(<PillToggle options={OPTIONS} value="week" onChange={() => {}} />))
    expect(warn).not.toHaveBeenCalled()
    await act(async () => root.render(<PillToggle semantics="radio" options={OPTIONS} value="week" onChange={() => {}} />))
    expect(warn).toHaveBeenCalledTimes(1)
    await act(async () => root.unmount())
  })
})

describe("DetailSheetHeader bordered (#742)", () => {
  const header = (ui: React.ReactElement) => host(ui).querySelector<HTMLElement>('[data-slot="detail-sheet-header"]')!
  const cls = (el: HTMLElement) => el.className.split(" ")

  it("title があるときは従来どおり下線と下余白を出す", () => {
    const el = header(<DetailSheetHeader title="予定" onClose={() => {}} />)
    expect(cls(el)).toEqual(expect.arrayContaining(["border-b", "pb-4"]))
    expect(el.dataset.bordered).toBe("true")
  })

  it("閉じるボタンだけ（trailing だけ）のときは下線と下余白を出さない", () => {
    for (const ui of [
      <DetailSheetHeader onClose={() => {}} />,
      <DetailSheetHeader trailing={<span>…</span>} onClose={() => {}} />,
    ]) {
      const el = header(ui)
      expect(cls(el)).not.toContain("border-b")
      expect(cls(el)).not.toContain("pb-4")
      expect(el.dataset.bordered).toBe("false")
      expect(el.querySelector('[data-slot="detail-sheet-header-close"]')).not.toBeNull()
    }
  })

  it("leading / description / children があれば自動判定は出す。bordered で強制できる", () => {
    expect(cls(header(<DetailSheetHeader leading={<span>L</span>} onClose={() => {}} />))).toContain("border-b")
    expect(cls(header(<DetailSheetHeader description="説明" />))).toContain("border-b")
    expect(cls(header(<DetailSheetHeader><span>x</span></DetailSheetHeader>))).toContain("border-b")
    expect(cls(header(<DetailSheetHeader bordered onClose={() => {}} />))).toEqual(expect.arrayContaining(["border-b", "pb-4"]))
    expect(cls(header(<DetailSheetHeader bordered={false} title="予定" />))).not.toContain("border-b")
  })
})

describe("MonthCalendarHeader trailing (#743)", () => {
  it("右側の並びの右端（次の月ボタンの後ろ）に置く", () => {
    const el = host(
      <MonthCalendarHeader month="2026-10-01" onPrev={() => {}} onNext={() => {}} trailing={<span data-testid="t">追加</span>} />
    )
    const actions = el.querySelector('[data-slot="month-calendar-header-actions"]')!
    const children = [...actions.children]
    expect(children.at(-1)!.getAttribute("data-testid")).toBe("t")
    expect(children.at(-2)!.getAttribute("data-slot")).toBe("month-calendar-next")
  })

  it("前後ボタンが無くても trailing だけで右側の並びを出す。無ければ出さない（従来どおり）", () => {
    const el = host(<MonthCalendarHeader month="2026-10-01" trailing={<span data-testid="t">追加</span>} />)
    expect(el.querySelector('[data-slot="month-calendar-header-actions"] [data-testid="t"]')).not.toBeNull()
    expect(host(<MonthCalendarHeader month="2026-10-01" />).querySelector('[data-slot="month-calendar-header-actions"]')).toBeNull()
  })
})
