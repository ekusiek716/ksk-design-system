/**
 * @vitest-environment jsdom
 *
 * 日付部品で、選択中の日をもう一度押しても値が消えない（issue #803）。
 *
 * react-day-picker の mode="single" は `required` が無いと、選択中の日の再押下で
 * onSelect(undefined) を呼ぶ（"If the date is the same, clear the selection."）。
 * DatePicker はそれをそのまま onChange に流していたため、確かめるつもりで同じ日を
 * 押しただけで DatePicker は undefined、DateField は ""、DateTimePicker は日付と時刻が
 * まとめて消えていた。値を消す操作は `clearable` の明示的なクリアボタンに分ける。
 *
 * DateRangePicker（mode="range"）は再押下で範囲を外さない（react-day-picker の
 * addToRange は同じ日を押すと from=to=その日 の 1 日範囲に縮めるだけで、
 * onChange(undefined) にはならない）。下のテストで固定している。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DatePicker, DateRangePicker } from "../src/components/ui/date-picker"
import { DateField } from "../src/components/ui/date-field"
import { DateTimePicker } from "../src/components/ui/date-time-picker"
import { DataTableDateCell, createDataTableDateColumn } from "../src/components/patterns/admin/data-table"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let host: HTMLElement | null = null
let root: Root | null = null

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  host = null
  root = null
  document.body.innerHTML = ""
})

function render(node: React.ReactElement) {
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => {
    root!.render(node)
  })
}

function rerender(node: React.ReactElement) {
  act(() => {
    root!.render(node)
  })
}

function click(el: Element) {
  act(() => {
    ;(el as HTMLElement).click()
  })
}

function openTrigger(slot = "date-picker-trigger") {
  const trigger = document.querySelector(`[data-slot="${slot}"]`)
  if (!trigger) throw new Error(`trigger ${slot} not found`)
  click(trigger)
}

/** カレンダー内の「その日」のボタン（react-day-picker は td[data-day="yyyy-MM-dd"] > button） */
function dayButton(iso: string): HTMLButtonElement {
  const cell = document.querySelector(`[data-day="${iso}"]`)
  const button = cell?.querySelector("button")
  if (!button) throw new Error(`day ${iso} not found`)
  return button as HTMLButtonElement
}

function isPopoverOpen() {
  return document.querySelector('[data-slot="popover-content"]') !== null
}

describe("DatePicker: 選択中の日の再押下（#803）", () => {
  it("選択中の日を押しても onChange(undefined) を呼ばず、ポップオーバーは閉じる", () => {
    const onChange = vi.fn()
    render(<DatePicker value={new Date(2026, 9, 15)} onChange={onChange} />)
    openTrigger()
    expect(isPopoverOpen()).toBe(true)

    click(dayButton("2026-10-15"))

    expect(onChange).not.toHaveBeenCalledWith(undefined)
    expect(onChange).not.toHaveBeenCalled()
    expect(isPopoverOpen()).toBe(false)
  })

  it("別の日を押したら従来どおりその日で onChange する", () => {
    const onChange = vi.fn()
    render(<DatePicker value={new Date(2026, 9, 15)} onChange={onChange} />)
    openTrigger()

    click(dayButton("2026-10-20"))

    expect(onChange).toHaveBeenCalledTimes(1)
    const next = onChange.mock.calls[0][0] as Date
    expect([next.getFullYear(), next.getMonth(), next.getDate()]).toEqual([2026, 9, 20])
  })

  it("clearable の既定は false で、クリアボタンを出さない", () => {
    render(<DatePicker value={new Date(2026, 9, 15)} onChange={() => {}} />)
    expect(document.querySelector('[data-slot="date-picker-clear"]')).toBeNull()
  })

  it("clearable なら値があるときだけクリアボタンを出し、押すと onChange(undefined)", () => {
    const onChange = vi.fn()
    render(<DatePicker value={new Date(2026, 9, 15)} onChange={onChange} clearable />)
    const clear = document.querySelector('[data-slot="date-picker-clear"]')
    expect(clear).not.toBeNull()
    expect(clear!.getAttribute("aria-label")).toBe("日付をクリア")
    // トリガーの入れ子にしない（button の中に button は置けない）
    expect(clear!.closest('[data-slot="date-picker-trigger"]')).toBeNull()

    click(clear!)
    expect(onChange).toHaveBeenCalledWith(undefined)

    rerender(<DatePicker value={undefined} onChange={onChange} clearable />)
    expect(document.querySelector('[data-slot="date-picker-clear"]')).toBeNull()
  })

  it("クリアボタンを押したらフォーカスをトリガーへ戻す（body に落とさない）", () => {
    render(<DatePicker value={new Date(2026, 9, 15)} onChange={() => {}} clearable />)
    const clear = document.querySelector<HTMLButtonElement>('[data-slot="date-picker-clear"]')!
    act(() => clear.focus())
    click(clear)
    expect(document.activeElement).toBe(document.querySelector('[data-slot="date-picker-trigger"]'))
  })

  it("clearable でも disabled のときはクリアボタンを出さない", () => {
    render(<DatePicker value={new Date(2026, 9, 15)} onChange={() => {}} clearable disabled />)
    expect(document.querySelector('[data-slot="date-picker-clear"]')).toBeNull()
  })

  it("clearLabel でクリアボタンの読み上げ名を差し替えられる", () => {
    render(
      <DatePicker value={new Date(2026, 9, 15)} onChange={() => {}} clearable clearLabel="期限を消す" />
    )
    expect(
      document.querySelector('[data-slot="date-picker-clear"]')!.getAttribute("aria-label")
    ).toBe("期限を消す")
  })
})

describe("DateField: 選択中の日の再押下（#803）", () => {
  it("選択中の日を押しても onChange(\"\") にならない", () => {
    const onChange = vi.fn()
    render(<DateField value="2026-10-15" onChange={onChange} />)
    openTrigger()

    click(dayButton("2026-10-15"))

    expect(onChange).not.toHaveBeenCalledWith("")
    expect(onChange).not.toHaveBeenCalled()
    expect(isPopoverOpen()).toBe(false)
  })

  it("clearable を DatePicker に素通しし、クリアで onChange(\"\")", () => {
    const onChange = vi.fn()
    render(<DateField value="2026-10-15" onChange={onChange} clearable />)
    const clear = document.querySelector('[data-slot="date-picker-clear"]')
    expect(clear).not.toBeNull()
    click(clear!)
    expect(onChange).toHaveBeenCalledWith("")
  })
})

describe("DateTimePicker: 選択中の日の再押下（#803）", () => {
  it("選択中の日を押しても日付と時刻が消えない", () => {
    const onChange = vi.fn()
    render(<DateTimePicker value={new Date(2026, 9, 15, 14, 30)} onChange={onChange} />)
    openTrigger()

    click(dayButton("2026-10-15"))

    expect(onChange).not.toHaveBeenCalledWith(undefined)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("別の日を押したら時刻を保ったまま日付だけ変わる", () => {
    const onChange = vi.fn()
    render(<DateTimePicker value={new Date(2026, 9, 15, 14, 30)} onChange={onChange} />)
    openTrigger()

    click(dayButton("2026-10-20"))

    const next = onChange.mock.calls[0][0] as Date
    expect([next.getDate(), next.getHours(), next.getMinutes()]).toEqual([20, 14, 30])
  })

  it("clearable を日付側へ素通しし、クリアで日付と時刻をまとめて undefined にする", () => {
    const onChange = vi.fn()
    render(<DateTimePicker value={new Date(2026, 9, 15, 14, 30)} onChange={onChange} clearable />)
    const clear = document.querySelector('[data-slot="date-picker-clear"]')
    expect(clear).not.toBeNull()
    click(clear!)
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})

describe("DateRangePicker: 選択中の日の再押下（#803 の確認）", () => {
  it("確定済みの範囲の端の日を押しても onChange(undefined) にはならない", () => {
    const onChange = vi.fn()
    render(
      <DateRangePicker
        value={{ from: new Date(2026, 9, 15), to: new Date(2026, 9, 20) }}
        onChange={onChange}
      />
    )
    openTrigger("date-range-picker-trigger")

    click(dayButton("2026-10-15"))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalledWith(undefined)
    const range = onChange.mock.calls[0][0] as { from?: Date; to?: Date }
    expect(range.from?.getDate()).toBe(15)
  })
})

describe("DataTableDateCell / createDataTableDateColumn（#803）", () => {
  it("DataTableDateCell は clearable を DatePicker に素通しし、クリアで onValueChange(undefined)", () => {
    const onValueChange = vi.fn()
    render(
      <table><tbody><tr>
        <DataTableDateCell value={new Date(2026, 9, 15)} onValueChange={onValueChange} clearable clearLabel="期限を消す" />
      </tr></tbody></table>
    )
    const clear = document.querySelector('[data-slot="date-picker-clear"]')!
    expect(clear.getAttribute("aria-label")).toBe("期限を消す")
    click(clear)
    expect(onValueChange).toHaveBeenCalledWith(undefined)
  })

  it("DataTableDateCell は clearable を付けなければ従来どおりクリアボタンを出さない", () => {
    render(
      <table><tbody><tr>
        <DataTableDateCell value={new Date(2026, 9, 15)} onValueChange={() => {}} />
      </tr></tbody></table>
    )
    expect(document.querySelector('[data-slot="date-picker-clear"]')).toBeNull()
  })

  it("createDataTableDateColumn の clearable は編集セルの DatePicker に渡り、クリアで undefined を確定する", () => {
    const column = createDataTableDateColumn<{ due?: Date }>({
      id: "due",
      header: "期限",
      value: (row) => row.due,
      clearable: true,
    })
    const commitValue = vi.fn()
    const Edit = () => <>{column.editCell!({ value: new Date(2026, 9, 15), commitValue } as never)}</>
    render(<Edit />)
    click(document.querySelector('[data-slot="date-picker-clear"]')!)
    expect(commitValue).toHaveBeenCalledWith(undefined)
  })
})

describe("クリアボタンの位置と当たり判定（#803）", () => {
  it("トリガー内の空き場所をレイアウト座標で測って重ね、className で padding が変わっても追従する", () => {
    // jsdom はレイアウトを持たないので offset* を差し替える（spacer は wrapper の (140, 4) にある 44×24）
    const isSpacer = (el: HTMLElement) =>
      el.getAttribute("aria-hidden") === "true" && el.closest('[data-slot="date-picker-trigger"]') !== null
    const proto = HTMLElement.prototype
    const spies = [
      vi.spyOn(proto, "offsetLeft", "get").mockImplementation(function (this: HTMLElement) { return isSpacer(this) ? 140 : 0 }),
      vi.spyOn(proto, "offsetTop", "get").mockImplementation(function (this: HTMLElement) { return isSpacer(this) ? 4 : 0 }),
      vi.spyOn(proto, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) { return isSpacer(this) ? 44 : 0 }),
      vi.spyOn(proto, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) { return isSpacer(this) ? 24 : 0 }),
      vi.spyOn(proto, "offsetParent", "get").mockImplementation(function (this: HTMLElement) {
        return isSpacer(this) ? this.closest('[data-slot="date-picker-trigger"]')!.parentElement : null
      }),
    ]
    try {
      render(<DatePicker value={new Date(2026, 9, 15)} onChange={() => {}} clearable className="px-2" />)
      const clear = document.querySelector<HTMLElement>('[data-slot="date-picker-clear"]')!
      // 24px のボタンを 44px の空き場所の中央へ: 140 + (44 - 24) / 2
      expect(clear.style.left).toBe("150px")
      expect(clear.style.top).toBe("4px")
      // 測れたら既定 padding 前提の位置クラスは外す
      expect(clear.className).not.toContain("top-1/2")
    } finally {
      spies.forEach((s) => s.mockRestore())
    }
  })

  it("見た目 24px のまま、当たり判定を 44px に広げる", () => {
    render(<DatePicker value={new Date(2026, 9, 15)} onChange={() => {}} clearable />)
    const clear = document.querySelector('[data-slot="date-picker-clear"]')!
    expect(clear.className).toContain("size-6")
    expect(clear.className).toContain("before:-inset-2.5")
  })

  it("トリガー内の空き場所は当たり判定と同じ 44px 幅で、広げた判定がカレンダーアイコンに掛からない", () => {
    render(<DatePicker value={new Date(2026, 9, 15)} onChange={() => {}} clearable />)
    const spacer = document.querySelector('[data-slot="date-picker-trigger"] span[aria-hidden="true"]')!
    expect(spacer.className).toContain("w-11")
    // spacer の直後がカレンダーアイコン（間に余白を挟まず、判定の端 = spacer の端）
    expect(spacer.nextElementSibling?.tagName.toLowerCase()).toBe("svg")
  })
})
