import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Button } from "../src/native/components/Button"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { themes } from "../src/tokens/native/themes"

// issue #664 / #671: native Button にも Web と同名の文字だけの弱い variant を持たせる。
type HostProps = Record<string, unknown> & { children?: unknown; style?: unknown }
const hosts = vi.hoisted(() => ({ pressed: false, records: [] as { host: string; style: Record<string, unknown> }[] }))
vi.mock("react-native", async () => {
  const R = await import("react")
  const flat = (style: unknown): Record<string, unknown> =>
    Array.isArray(style) ? Object.assign({}, ...style.map(flat)) : (style as Record<string, unknown>) || {}
  const host = (name: string) => ({ children, style }: HostProps) => {
    const resolved = typeof style === "function" ? style({ pressed: hosts.pressed }) : style
    hosts.records.push({ host: name, style: flat(resolved) })
    const kids = typeof children === "function" ? children({ pressed: hosts.pressed }) : children
    return R.createElement(R.Fragment, null, kids as React.ReactNode)
  }
  return {
    View: host("View"), Text: host("Text"), Pressable: host("Pressable"), ActivityIndicator: host("ActivityIndicator"),
    useColorScheme: () => "light",
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: 1 }),
    StyleSheet: { create: <T,>(s: T) => s, flatten: flat, hairlineWidth: 1 },
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o.ios ?? o.default },
  }
})

beforeEach(() => { hosts.records = []; hosts.pressed = false })
const light = (themes as Record<string, { light: Record<string, Record<string, string>> }>).default.light

describe("native Button の ghost-* variant（#664 / #671）", () => {
  const cases = [
    ["ghost-neutral", light.text["medium-emphasis"], light.hover["ghost-button"]],
    ["ghost-destructive", light.text.caution, light.surface.caution],
    ["ghost-success", light.text.success, light.surface.success],
  ] as const
  for (const [variant, fg, pressedBg] of cases) {
    it(`${variant}: 面と枠は透明、文字色は意味色、押下中だけ淡い面`, () => {
      renderToStaticMarkup(<ThemeProvider><Button variant={variant}>あとで</Button></ThemeProvider>)
      const container = hosts.records.find((r) => r.host === "Pressable")!
      expect(container.style.backgroundColor).toBe("transparent")
      expect(container.style.borderColor).toBe("transparent")
      expect(hosts.records.find((r) => r.host === "Text")!.style.color).toBe(fg)

      hosts.records = []
      hosts.pressed = true
      renderToStaticMarkup(<ThemeProvider><Button variant={variant}>あとで</Button></ThemeProvider>)
      expect(hosts.records.find((r) => r.host === "Pressable")!.style.backgroundColor).toBe(pressedBg)
    })
  }
})
