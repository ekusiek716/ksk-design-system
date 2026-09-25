import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CheckboxField } from "../src/native/components/CheckboxField"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { resolveTypo } from "../src/native/typography"

type HostProps = Record<string, unknown> & {
  children?: React.ReactNode
  style?: Record<string, unknown> | Record<string, unknown>[]
  onPress?: () => void
}
const hosts = vi.hoisted(() => ({ fontScale: 1, records: [] as { host: string; props: HostProps; style: Record<string, unknown> }[] }))
vi.mock("react-native", async () => {
  const R = await import("react")
  const host = (name: string) => ({ children, style, ...props }: HostProps) => {
    hosts.records.push({ host: name, props, style: Array.isArray(style) ? Object.assign({}, ...style) : style ?? {} })
    return R.createElement(R.Fragment, null, children)
  }
  return {
    View: host("View"), Text: host("Text"), Pressable: host("Pressable"),
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: hosts.fontScale }),
  }
})
const render = (props: React.ComponentProps<typeof CheckboxField>) => renderToStaticMarkup(<ThemeProvider><CheckboxField {...props} /></ThemeProvider>)
beforeEach(() => { hosts.records = []; hosts.fontScale = 1 })

describe("native CheckboxField first-line alignment", () => {
  for (const fontScale of [1, 1.35, 2, 3]) {
    it(`centers the indicator on the first label line at fontScale ${fontScale}`, () => {
      hosts.fontScale = fontScale
      render({ label: "カメラ端末を電源につなぎました", description: "長い説明\n複数行になっても\n最初のラベル行に揃います" })
      const decoration = hosts.records.find(r => r.props["aria-hidden"] === true)!
      const checkbox = hosts.records.find(r => r.style.width === 20)!
      const label = hosts.records.find(r => r.host === "Text")!
      const center = Number(decoration.style.paddingTop) + Number(checkbox.style.height) / 2
      expect(center).toBe(Number(label.style.lineHeight) * fontScale / 2)
      expect(label.style.lineHeight).toBe(resolveTypo("body.md").lineHeight)
      expect(hosts.records[0].style.minHeight).toBeGreaterThanOrEqual(44)
    })
  }
  it("keeps label-only rows vertically centered", () => {
    render({ label: "同意する" })
    expect(hosts.records[0].style.alignItems).toBe("center")
    expect(hosts.records.find(r => r.props["aria-hidden"] === true)!.style.paddingTop).toBe(0)
  })
  it("retains one accessible checkbox and the entire row toggles", () => {
    const onChange = vi.fn()
    render({ label: "同意する", description: "説明", checked: true, onChange })
    const accessible = hosts.records.filter(r => r.props.accessibilityRole === "checkbox")
    expect(accessible).toHaveLength(1)
    expect(accessible[0].props.accessibilityState).toEqual({ checked: true, disabled: false })
    accessible[0].props.onPress?.()
    expect(onChange).toHaveBeenCalledExactlyOnceWith(false)
  })
  it("does not toggle disabled rows", () => {
    const onChange = vi.fn()
    render({ label: "同意する", description: "説明", disabled: true, onChange })
    hosts.records[0].props.onPress?.()
    expect(onChange).not.toHaveBeenCalled()
  })
})
