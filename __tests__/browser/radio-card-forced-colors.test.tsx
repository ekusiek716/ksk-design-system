import { afterEach, expect, it } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { cdp } from "vitest/browser"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import "@/index.css"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(async () => {
  await cdp().send("Emulation.setEmulatedMedia", { features: [] })
  if (root) act(() => root!.unmount())
  container?.remove()
})

it("card checked dot remains foreground against its surface in forced-colors", async () => {
  await cdp().send("Emulation.setEmulatedMedia", {
    features: [{ name: "forced-colors", value: "active" }],
  })
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root!.render(<RadioGroup variant="card" defaultValue="a" aria-label="目標">
    <RadioGroupItem value="a">3日</RadioGroupItem>
    <RadioGroupItem value="b">7日</RadioGroupItem>
  </RadioGroup>))
  const checked = container.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')!
  const indicator = checked.querySelector<HTMLElement>('[data-state="checked"]')!
  const dot = indicator.querySelector("svg")!
  expect(dot).not.toBeNull()
  const circle = dot.querySelector("circle")!
  expect(circle).not.toBeNull()
  const paint = getComputedStyle(circle).fill
  expect(paint).not.toMatch(/^(none|transparent|rgba\([^)]*,\s*0(?:\.0+)?\))$/)
  expect(getComputedStyle(circle).fillOpacity).not.toBe("0")
  expect(paint).not.toBe(getComputedStyle(checked).backgroundColor)
  expect(dot.getBoundingClientRect().width).toBe(8)
  expect(dot.getBoundingClientRect().height).toBe(8)
  expect(container.querySelector('[role="radio"][aria-checked="false"] svg')).toBeNull()
})
