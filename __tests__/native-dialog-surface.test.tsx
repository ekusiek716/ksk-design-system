import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Dialog, type DialogPosition } from "../src/native/components/Dialog"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { getTheme, themeNames, type ColorMode } from "../src/tokens/native"

// RN hosts only are replaced: the real Dialog, provider and resolved tokens run.
// Capturing host props verifies what RN receives, not a source-code spelling.
const hosts = vi.hoisted(() => ({
  styles: [] as Record<string, unknown>[],
  transparent: undefined as boolean | undefined,
}))
vi.mock("react-native", () => ({
  Modal: ({ children, transparent }: { children: React.ReactNode; transparent: boolean }) => {
    hosts.transparent = transparent
    return children
  },
  Pressable: ({ children, style }: { children: React.ReactNode; style: Record<string, unknown> }) => {
    hosts.styles.push(style)
    return children
  },
  View: ({ children }: { children: React.ReactNode }) => children,
  Text: ({ children }: { children: React.ReactNode }) => children,
}))

beforeEach(() => {
  hosts.styles = []
  hosts.transparent = undefined
})

describe.each(themeNames)("native Dialog surface — %s (#529)", (name) => {
  for (const mode of ["light", "dark"] as const satisfies readonly ColorMode[]) {
    it.each<DialogPosition>(["center", "top", "fullscreen"])(`${mode} / %s`, (position) => {
      renderToStaticMarkup(
        <ThemeProvider initialName={name} initialMode={mode}>
          <Dialog open onClose={() => {}} position={position} title="提出しますか？" />
        </ThemeProvider>,
      )
      expect(hosts.styles).toHaveLength(2)
      const [backdrop, panel] = hosts.styles
      const theme = getTheme(name, mode)

      if (position === "fullscreen") {
        expect(hosts.transparent).toBe(false)
        expect(backdrop).toMatchObject({ backgroundColor: theme.surface.primary, padding: 0 })
        expect(panel).toMatchObject({ backgroundColor: theme.surface.primary, borderRadius: 0, flex: 1 })
        expect(panel).not.toHaveProperty("maxWidth")
      } else {
        expect(hosts.transparent).toBe(true)
        expect(backdrop).toMatchObject({ backgroundColor: theme.overlay.dark, padding: 16 })
        expect(panel).toMatchObject({ width: "100%", maxWidth: 480, borderRadius: 16, padding: 20 })
        if (mode === "dark") {
          // A primary-colored screen underneath the dark scrim must not merge with the panel.
          expect(panel.backgroundColor).not.toBe(theme.surface.primary)
          expect(panel.backgroundColor).toBe(theme.surface.secondary)
        } else {
          expect(panel.backgroundColor).toBe(theme.surface.primary)
        }
      }
    })
  }
})
