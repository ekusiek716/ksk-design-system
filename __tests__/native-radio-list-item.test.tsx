import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Radio } from "../src/native/components/Radio"
import { RadioGroup } from "../src/native/components/RadioGroup"
import { ActionTile, QuickActionGrid } from "../src/native/components/QuickActionGrid"
import { ListItem } from "../src/native/components/ListItem"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { getTheme, themeNames, type ColorMode } from "../src/tokens/native"
import { resolveTypo } from "../src/native/typography"

type HostProps = Record<string, unknown> & {
  onPress?: () => void
  hitSlop?: number
  children?: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode)
  style?: Record<string, unknown> | Record<string, unknown>[] | ((state: { pressed: boolean }) => Record<string, unknown>[])
}
const hosts = vi.hoisted(() => ({ records: [] as { host: string; props: HostProps; style: Record<string, unknown>; children: unknown }[] }))
vi.mock("react-native", async () => {
  const R = await import("react")
  const host = (name: string) => ({ children, style, ...props }: HostProps) => {
    const resolvedStyle = typeof style === "function" ? style({ pressed: false }) : style
    hosts.records.push({ host: name, props, style: Array.isArray(resolvedStyle) ? Object.assign({}, ...resolvedStyle) : resolvedStyle ?? {}, children })
    return R.createElement(R.Fragment, null, typeof children === "function" ? children({ pressed: false }) : children)
  }
  return { View: host("View"), Text: host("Text"), Pressable: host("Pressable") }
})
const render = (node: React.ReactNode, name = themeNames[0], mode: ColorMode = "light") => renderToStaticMarkup(<ThemeProvider initialName={name} initialMode={mode}>{node}</ThemeProvider>)
beforeEach(() => { hosts.records = [] })

describe("native Radio", () => {
  it("decorative has no interactive host and hides its whole subtree", () => {
    const onChange = vi.fn()
    render(<Radio selected decorative onChange={onChange} />)
    expect(hosts.records.some(r => r.host === "Pressable")).toBe(false)
    expect(hosts.records[0].props).toMatchObject({ pointerEvents: "none", accessible: false, "aria-hidden": true, accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants" })
    expect(onChange).not.toHaveBeenCalled()
  })
  it("selected radios never toggle off, expose state and guarantee 44pt hit area", () => {
    const onChange = vi.fn()
    render(<Radio selected onChange={onChange} accessibilityLabel="選択" />)
    const press = hosts.records.find(r => r.host === "Pressable")!
    expect(press.props.accessibilityRole).toBe("radio")
    expect(press.props.accessibilityState).toMatchObject({ selected: true, checked: true, disabled: false })
    expect(press.props["aria-checked"]).toBe(true)
    expect((press.props.hitSlop ?? 0) * 2 + 20).toBeGreaterThanOrEqual(44)
    press.props.onPress?.()
    expect(onChange).toHaveBeenCalledWith(true)
  })
  it("disabled selection does not fire; RadioGroup keeps exactly one radio per option", () => {
    const onChange = vi.fn()
    render(<Radio disabled onChange={onChange} />)
    hosts.records.find(r => r.host === "Pressable")!.props.onPress?.()
    expect(onChange).not.toHaveBeenCalled()
    hosts.records = []
    render(<RadioGroup value="a" disabled options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />)
    expect(hosts.records.filter(r => r.props.accessibilityRole === "radio")).toHaveLength(2)
    expect(hosts.records.filter(r => r.host === "Pressable")).toHaveLength(2)
    expect(hosts.records.filter(r => r.style.opacity === 0.4)).toHaveLength(0)
  })
})

describe("native ListItem", () => {
  for (const name of themeNames) for (const mode of ["light", "dark"] as const) {
    it(`${name}/${mode}: string tones keep typography and resolve semantic colors`, () => {
      render(<ListItem title="title" description="description" titleTone="accent" descriptionTone="caution" />, name, mode)
      const text = hosts.records.filter(r => r.host === "Text")
      expect(text[0].style).toMatchObject({ ...resolveTypo("body.md"), color: getTheme(name, mode).text["accent-primary"] })
      expect(text[1].style).toMatchObject({ ...resolveTypo("body.sm"), color: getTheme(name, mode).text.caution })
    })
  }
  it("ReactNode children stay unwrapped and default divider adds no line", () => {
    render(<ListItem title={<span>custom</span>} description={<span>detail</span>} titleTone="accent" />)
    expect(hosts.records.filter(r => r.host === "Text")).toHaveLength(0)
    expect(hosts.records.some(r => r.style.position === "absolute")).toBe(false)
  })
  for (const density of ["comfortable", "compact"] as const) for (const divider of ["inset", "full"] as const) {
    it(`${density}/${divider}: matches row padding and stays at bottom with footer/center/a11y`, () => {
      render(<ListItem title="title" density={density} divider={divider} align="center" footerSlot={<span>footer</span>} accessibilityLabel="row" />)
      const row = hosts.records.find(r => r.style.paddingHorizontal !== undefined)!
      const line = hosts.records.find(r => r.style.position === "absolute")!
      expect(line.style.left).toBe(divider === "inset" ? row.style.paddingHorizontal : 0)
      expect(line.style.right).toBe(line.style.left)
      expect(line.style.bottom).toBe(0)
      expect(line.props.pointerEvents).toBe("none")
      expect(row.style.flexDirection).toBe("column")
    })
  }
})


describe("native ActionTile radio state on react-native-web", () => {
  it("publishes checked state on the parent and keeps its Radio indicator decorative", () => {
    render(<QuickActionGrid selectionMode="single"><ActionTile label="A" selected indicator={<Radio selected decorative />} /><ActionTile label="B" indicator={<Radio decorative />} /></QuickActionGrid>)
    const radios = hosts.records.filter(r => r.props.accessibilityRole === "radio")
    expect(radios).toHaveLength(2)
    expect(radios.map(r => r.props["aria-checked"])).toEqual([true, false])
    expect(hosts.records.filter(r => r.host === "Pressable")).toHaveLength(2)
  })
  it("honors explicit state and keeps multiple selection as the existing button model", () => {
    render(<ActionTile label="A" selectionMode="single" selected accessibilityState={{ checked: false, disabled: true, busy: true }} />)
    const radio = hosts.records.find(r => r.host === "Pressable")!
    expect(radio.props["aria-checked"]).toBe(false)
    expect(radio.props["aria-disabled"]).toBe(true)
    expect(radio.props["aria-busy"]).toBe(true)
    hosts.records = []
    render(<ActionTile label="B" selectionMode="multiple" selected />)
    const button = hosts.records.find(r => r.host === "Pressable")!
    expect(button.props.accessibilityRole).toBe("button")
    expect(button.props["aria-checked"]).toBeUndefined()
    expect(button.props.accessibilityState).toMatchObject({ selected: true })
  })
})
