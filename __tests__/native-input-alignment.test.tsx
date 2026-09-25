import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Input } from "../src/native/components/Input"
import { resolveTypo } from "../src/native/typography"

const captured = vi.hoisted(() => ({ os: "ios", props: {} as Record<string, unknown> }))
vi.mock("react-native", () => ({
  Platform: { get OS() { return captured.os } },
  View: ({ children }: { children: React.ReactNode }) => children,
  TextInput: (props: Record<string, unknown>) => { captured.props = props; return null },
}))
vi.mock("../src/native/theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: { border: {}, surface: {}, text: {} },
    scales: { spacing: { scale: { 2: 8, 3: 12 } }, touchTargets: { textInput: { min: 44 } }, borderRadius: { md: 8 } },
  }),
}))
const renderInput = (props: React.ComponentProps<typeof Input> = {}) => {
  renderToStaticMarkup(<Input {...props} />)
  return Object.assign({}, ...(captured.props.style as object[]).filter(Boolean))
}

beforeEach(() => { captured.os = "ios" })
describe("Native Input vertical text alignment", () => {
  it.each(["ios", "android"])("lets %s center single-line Japanese font metrics without paragraph leading", (os) => {
    captured.os = os
    const style = renderInput({ placeholder: "入力してください", value: "日本語の入力" })
    expect(style.lineHeight).toBeUndefined()
    expect(style.fontSize).toBe(resolveTypo("body.md").fontSize)
    expect(style.height).toBeUndefined()
    expect(captured.props.placeholder).toBe("入力してください")
    expect(captured.props.value).toBe("日本語の入力")
  })
  it("retains multiline and Web line rhythm", () => {
    expect(renderInput({ multiline: true }).lineHeight).toBe(resolveTypo("body.md").lineHeight)
    captured.os = "web"
    expect(renderInput().lineHeight).toBe(resolveTypo("body.md").lineHeight)
  })
  it("keeps caller inputStyle and text scaling props authoritative", () => {
    const style = renderInput({ inputStyle: { lineHeight: 32, fontSize: 24 }, allowFontScaling: true, maxFontSizeMultiplier: 2 })
    expect(style.lineHeight).toBe(32)
    expect(style.fontSize).toBe(24)
    expect(captured.props.allowFontScaling).toBe(true)
    expect(captured.props.maxFontSizeMultiplier).toBe(2)
    expect(resolveTypo("body.md").lineHeight).toBeDefined()
  })
})
