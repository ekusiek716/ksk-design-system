/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Input } from "../src/native/components/Input"
import { Textarea } from "../src/native/components/Textarea"
import { AutoGrowTextarea } from "../src/native/components/AutoGrowTextarea"

/**
 * native Input / Textarea / AutoGrowTextarea のハンドラ合成（issue #819）。
 *
 * 内部の onFocus / onBlur（focused state で枠色を切り替える）と
 * AutoGrowTextarea の onContentSizeChange（高さの自動調整）が、後ろの {...rest} で
 * consumer のハンドラに上書きされていた。consumer のハンドラを渡しても内部処理が
 * 動き、consumer のハンドラも呼ばれることを固定する。
 */
type Props = Record<string, unknown> & { children?: React.ReactNode }
const hosts = vi.hoisted(() => ({ view: {} as Props, input: {} as Props }))
vi.mock("react-native", async () => {
  const R = await import("react")
  return {
    Platform: { OS: "ios" },
    View: (props: Props) => { hosts.view = props; return R.createElement("div", null, props.children) },
    TextInput: (props: Props) => { hosts.input = props; return null },
  }
})
const ACCENT = "accent"
const MEDIUM = "medium"
vi.mock("../src/native/theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: {
      border: { "accent-primary": "accent", "medium-emphasis": "medium", caution: "caution" },
      surface: { primary: "white", disable: "gray" },
      text: { "low-emphasis": "low", "high-emphasis": "high" },
    },
    scales: {
      spacing: { scale: { 1: 4, 2: 8, 3: 12 } },
      touchTargets: { textInput: { min: 44 } },
      borderRadius: { md: 8 },
    },
  }),
}))

let cleanup: (() => void) | null = null
afterEach(() => { cleanup?.(); cleanup = null; hosts.view = {}; hosts.input = {} })
function mount(ui: React.ReactElement) {
  const host = document.createElement("div"); document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(ui))
  cleanup = () => { act(() => root.unmount()); host.remove() }
}
const flatten = (style: unknown): Record<string, unknown> =>
  Array.isArray(style) ? Object.assign({}, ...style.map(flatten)) : ((style as Record<string, unknown>) ?? {})
const call = (name: string, e: unknown = { nativeEvent: {} }) =>
  act(() => { (hosts.input[name] as (e: unknown) => void)(e) })

type Kind = "Input" | "Textarea" | "AutoGrowTextarea"
const components: Record<Kind, React.ElementType> = { Input, Textarea, AutoGrowTextarea }
// Input は外側 View が枠を持つ。Textarea / AutoGrowTextarea は TextInput 自身が持つ。
const borderColor = (kind: Kind) => flatten(kind === "Input" ? hosts.view.style : hosts.input.style).borderColor

describe.each(["Input", "Textarea", "AutoGrowTextarea"] as Kind[])("native %s のハンドラ合成（#819）", (kind) => {
  const C = components[kind]

  it("onBlur を渡しても blur 後に枠色が medium-emphasis へ戻り、consumer の onBlur も呼ばれる", () => {
    const onBlur = vi.fn()
    mount(<C onBlur={onBlur} />)
    call("onFocus")
    expect(borderColor(kind)).toBe(ACCENT)
    const e = { nativeEvent: { text: "x" } }
    call("onBlur", e)
    expect(borderColor(kind)).toBe(MEDIUM)
    expect(onBlur).toHaveBeenCalledWith(e)
  })

  it("onFocus を渡しても focus 時に枠色が accent-primary になり、consumer の onFocus も呼ばれる", () => {
    const onFocus = vi.fn()
    mount(<C onFocus={onFocus} />)
    expect(borderColor(kind)).toBe(MEDIUM)
    const e = { nativeEvent: {} }
    call("onFocus", e)
    expect(borderColor(kind)).toBe(ACCENT)
    expect(onFocus).toHaveBeenCalledWith(e)
  })

  it("disabled のときは editable を渡しても編集不可のまま", () => {
    mount(<C disabled editable />)
    expect(hosts.input.editable).toBe(false)
  })

  it("disabled でなければ editable={false} は尊重する", () => {
    mount(<C editable={false} />)
    expect(hosts.input.editable).toBe(false)
  })
})

describe("native AutoGrowTextarea の onContentSizeChange 合成（#819）", () => {
  it("onContentSizeChange を渡しても高さが伸び、consumer のハンドラも呼ばれる", () => {
    const onContentSizeChange = vi.fn()
    mount(<AutoGrowTextarea minHeight={44} maxHeight={200} onContentSizeChange={onContentSizeChange} />)
    expect(flatten(hosts.input.style).height).toBe(44)
    const e = { nativeEvent: { contentSize: { width: 100, height: 100 } } }
    call("onContentSizeChange", e)
    // density=default は +16
    expect(flatten(hosts.input.style).height).toBe(116)
    expect(onContentSizeChange).toHaveBeenCalledWith(e)
  })
})
