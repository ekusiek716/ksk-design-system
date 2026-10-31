import { afterEach, expect, it } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { DatePicker } from "@/components/ui/date-picker"
import "@/index.css"

/**
 * DatePicker の clearable のクリアボタン（issue #803）を実ブラウザのレイアウトで確かめる。
 * 見た目は 24px、当たり判定は 44px。広げた当たり判定がカレンダーアイコンに掛かると、
 * アイコンの端を押したときにカレンダーが開かず日付が消えてしまう（PR #847 のレビュー指摘）。
 */

let root: Root | undefined

afterEach(() => {
  act(() => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

async function mount(className?: string) {
  const host = document.createElement("div")
  host.style.width = "320px"
  document.body.append(host)
  root = createRoot(host)
  act(() => root!.render(<DatePicker value={new Date(2026, 9, 15)} onChange={() => {}} clearable className={className} />))
  // 位置の実測（layout effect）と ResizeObserver の反映を待つ
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  const clear = document.querySelector<HTMLElement>('[data-slot="date-picker-clear"]')!
  const icon = document.querySelector<SVGElement>('[data-slot="date-picker-trigger"] > svg')!
  const trigger = document.querySelector<HTMLElement>('[data-slot="date-picker-trigger"]')!
  const hit = getComputedStyle(clear, "::before")
  return { clear: clear.getBoundingClientRect(), icon: icon.getBoundingClientRect(), trigger: trigger.getBoundingClientRect(), hit }
}

it.each([
  ["既定の padding", undefined],
  ["DataTableDateCell と同じ px-2", "h-8 min-w-[150px] px-2"],
])("%s: 当たり判定は 44px で、カレンダーアイコンに掛からず、トリガーの縦中央にある", async (_label, className) => {
  const { clear, icon, trigger, hit } = await mount(className)
  expect(clear.width).toBe(24)
  // ::before は -inset-2.5（10px）なので、当たり判定の横幅は 24 + 20 = 44px
  expect(hit.content).not.toBe("none")
  expect(parseFloat(hit.left)).toBe(-10)
  expect(parseFloat(hit.right)).toBe(-10)
  const hitRight = clear.right + 10
  expect(hitRight).toBeLessThanOrEqual(icon.left + 0.5)
  // トリガーの右端（padding の内側）にあり、外にはみ出さない
  expect(clear.left).toBeGreaterThan(trigger.left)
  expect(Math.abs(clear.top + clear.height / 2 - (trigger.top + trigger.height / 2))).toBeLessThanOrEqual(1)
})
