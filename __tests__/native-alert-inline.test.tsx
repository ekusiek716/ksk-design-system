import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Alert, type AlertVariant } from "../src/native/components/Alert"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { getTheme } from "../src/tokens/native"

const hosts = vi.hoisted(() => ({ styles: [] as Record<string, unknown>[] }))
vi.mock("react-native", async () => {
  const R = await import("react")
  const host = ({ children, style }: { children?: React.ReactNode; style?: Record<string, unknown> | Record<string, unknown>[] }) => {
    hosts.styles.push(Array.isArray(style) ? Object.assign({}, ...style) : style ?? {})
    return R.createElement(R.Fragment, null, children)
  }
  return { View: host, Text: host }
})
beforeEach(() => { hosts.styles = [] })
const render = (node: React.ReactNode, mode: "light" | "dark" = "light") => renderToStaticMarkup(<ThemeProvider initialName="default" initialMode={mode}>{node}</ThemeProvider>)

describe("native Alert inline variants", () => {
  for (const mode of ["light", "dark"] as const) {
    for (const variant of ["inline-info", "inline-warning", "inline-caution"] as AlertVariant[]) {
      it(`${mode}/${variant} has no stripe and retains text and action content`, () => {
        const output = render(<Alert variant={variant} tone="success" title="Title" description="Description"><span>Action</span></Alert>, mode)
        expect(output).toContain("Title")
        expect(output).toContain("Description")
        expect(output).toContain("Action")
        const theme = getTheme("default", mode)
        const tone = variant === "inline-info" ? "tertiary" : variant === "inline-warning" ? "warning" : "caution"
        expect(hosts.styles[0].borderLeftWidth).toBeUndefined()
        expect(hosts.styles[0]).toMatchObject({ backgroundColor: theme.surface[tone] })
        expect(hosts.styles[2].color).toBe(variant === "inline-info" ? theme.text["medium-emphasis"] : theme.text[tone as "warning" | "caution"])
        expect(hosts.styles[1].color).toBe(variant === "inline-info" ? theme.text["high-emphasis"] : theme.text[tone as "warning" | "caution"])
      })
    }
  }
  for (const tone of ["info", "success", "warning", "caution"] as const) {
    it(`tone-only ${tone} has no left band and matches its borderless inline display (#617)`, () => {
      render(<Alert tone={tone} title="Legacy" />)
      const theme = getTheme("default", "light")
      const expectedBg = tone === "info" ? theme.surface.tertiary : theme.surface[tone]
      expect(hosts.styles[0]).not.toHaveProperty("borderLeftWidth")
      expect(hosts.styles[0]).toMatchObject({ backgroundColor: expectedBg })
    })
  }

  for (const tone of ["info", "success", "warning", "caution"] as const) {
    it(`tone-only ${tone} never renders borderLeftWidth, regardless of theme mode (#617)`, () => {
      for (const mode of ["light", "dark"] as const) {
        hosts.styles = []
        render(<Alert tone={tone} title="Legacy" />, mode)
        expect(hosts.styles[0].borderLeftWidth).toBeUndefined()
      }
    })
  }
})
