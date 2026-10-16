/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { IconBadge } from "../src/components/ui/icon-badge"

// issue #684: IconBadge に情報・成功・注意・警告の tone を追加する。
const parse = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host.querySelector<HTMLElement>('[data-slot="icon-badge"]')!
}

describe("IconBadge の tone（#684）", () => {
  it("未指定は accent: 従来と同じ色クラス（後方互換）", () => {
    const el = parse(<IconBadge><svg /></IconBadge>)
    const cls = el.className.split(" ")
    expect(el.dataset.tone).toBe("accent")
    expect(cls).toEqual(expect.arrayContaining(["text-[var(--Object-Accent-Primary)]", "bg-[var(--Surface-Accent-Primary-Light)]", "rounded-full"]))
  })

  it.each([
    ["info", "Info"],
    ["success", "Success"],
    ["warning", "Warning"],
    ["caution", "Caution"],
  ] as const)("tone=%s は Object-%s のアイコンと Surface-%s の面", (tone, name) => {
    const cls = parse(<IconBadge tone={tone}><svg /></IconBadge>).className.split(" ")
    expect(cls).toContain(`text-[var(--Object-${name})]`)
    expect(cls).toContain(`bg-[var(--Surface-${name})]`)
    expect(cls).not.toContain("bg-[var(--Surface-Accent-Primary-Light)]")
  })

  it("appearance=plain は面を持たずアイコン色だけ変わる", () => {
    const cls = parse(<IconBadge appearance="plain" tone="info"><svg /></IconBadge>).className.split(" ")
    expect(cls).toContain("text-[var(--Object-Info)]")
    expect(cls.some((c) => c.startsWith("bg-"))).toBe(false)
  })

  it("native IconBadge も同じ語彙の tone を持つ", () => {
    const native = readFileSync(join(__dirname, "..", "src/native/components/IconBadge.tsx"), "utf8")
    expect(native).toContain('export type IconBadgeTone = "accent" | "info" | "success" | "warning" | "caution"')
    expect(native).toContain('tone = "accent"')
  })
})
