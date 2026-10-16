/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { EmojiIcon } from "../src/components/ui/emoji-icon"
import { EmptyState } from "../src/components/patterns/empty-state"

// issue #676: 絵文字をアイコン寸法で描く装飾部品。
const el = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host
}

describe("EmojiIcon（#676）", () => {
  it("装飾として aria-hidden、既定は md（size-6 + typo-heading-2xl）", () => {
    const span = el(<EmojiIcon emoji="🎉" />).querySelector<HTMLElement>('[data-slot="emoji-icon"]')!
    expect(span.getAttribute("aria-hidden")).toBe("true")
    expect(span.textContent).toBe("🎉")
    expect(span.className.split(" ")).toEqual(expect.arrayContaining(["size-6", "typo-heading-2xl"]))
  })
  it.each([
    ["sm", "size-4", "typo-body-md"],
    ["lg", "size-9", "typo-display-lg"],
    ["xl", "size-12", "typo-display-xl"],
  ] as const)("size=%s は箱 %s と字 %s を対で持つ", (size, box, typo) => {
    const cls = el(<EmojiIcon emoji="🎉" size={size} />).querySelector<HTMLElement>("span")!.className.split(" ")
    expect(cls).toEqual(expect.arrayContaining([box, typo]))
    expect(cls.some((c) => /^text-(xs|sm|base|lg|\d?xl)$/.test(c))).toBe(false)
  })
  it("EmptyState の icon スロットにそのまま置ける", () => {
    const host = el(<EmptyState title="完了" icon={<EmojiIcon emoji="🎉" size="xl" />} />)
    expect(host.querySelector('[data-slot="empty-state"] [data-slot="emoji-icon"]')).not.toBeNull()
  })
  it("native EmojiIcon も同じ語彙・値", () => {
    const src = readFileSync(join(__dirname, "..", "src/native/components/EmojiIcon.tsx"), "utf8")
    expect(src).toContain('export type EmojiIconSize = "sm" | "md" | "lg" | "xl"')
    expect(src).toContain("{ sm: 16, md: 24, lg: 36, xl: 48 }")
    expect(src).toContain('importantForAccessibility="no-hide-descendants"')
  })
})
