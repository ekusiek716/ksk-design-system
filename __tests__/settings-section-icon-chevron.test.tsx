/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { SettingsListRow, SettingsSection } from "../src/components/patterns/settings-section"

// issue #690: SettingsSection の見出しアイコンと SettingsListRow の遷移矢印。
const render = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host
}

describe("SettingsSection icon（#690）", () => {
  it("見出しの中・タイトルの前に aria-hidden で置かれ、見出しのテキストはタイトルのまま", () => {
    const host = render(<SettingsSection title="アカウント" icon={<svg data-testid="i" />}>x</SettingsSection>)
    const h2 = host.querySelector("h2")!
    const icon = h2.querySelector('[data-slot="settings-section-icon"]')!
    expect(icon.getAttribute("aria-hidden")).toBe("true")
    expect(h2.firstElementChild).toBe(icon)
    expect(h2.textContent).toBe("アカウント")
  })
  it("icon 未指定なら見出しの DOM は従来どおり（後方互換）", () => {
    const h2 = render(<SettingsSection title="アカウント">x</SettingsSection>).querySelector("h2")!
    expect(h2.innerHTML).toBe("アカウント")
  })
})

describe("SettingsListRow showChevron（#690）", () => {
  it("右端（rightSlot の後）に aria-hidden の矢印を出す", () => {
    const row = render(<SettingsListRow title="プロフィール" rightSlot={<span>値</span>} showChevron onClick={() => {}} />)
      .querySelector('[data-slot="settings-list-row"]')!
    const chevron = row.lastElementChild!
    expect(chevron.getAttribute("data-slot")).toBe("settings-list-row-chevron")
    expect(chevron.getAttribute("aria-hidden")).toBe("true")
    expect(chevron.previousElementSibling?.getAttribute("data-slot")).toBe("settings-list-row-right")
  })
  it("未指定なら矢印を出さない", () => {
    const host = render(<SettingsListRow title="t" />)
    expect(host.querySelector('[data-slot="settings-list-row-chevron"]')).toBeNull()
  })
  it("native も同名 prop を持つ", () => {
    const src = readFileSync(join(__dirname, "..", "src/native/components/SettingsSection.tsx"), "utf8")
    expect(src).toContain("icon?: React.ReactNode")
    expect(src).toContain("showChevron?: boolean")
  })
})
