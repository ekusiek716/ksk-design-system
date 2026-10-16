import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Button } from "../src/components/ui/button"
import { buttonVariants } from "../src/lib/server-variants/button-variants"

// issue #664（ghost-neutral）/ #671（ghost-destructive / ghost-success）:
// 背景も枠も無い文字だけの弱いボタン。consumer が ghost に className で文字色を被せなくて済むこと。
const TONES = [
  ["ghost-neutral", "text-[var(--Text-Medium-Emphasis)]", "hover:bg-[var(--Hover-Ghost-Button)]"],
  ["ghost-destructive", "text-[var(--Text-Caution)]", "hover:bg-[var(--Surface-Caution)]"],
  ["ghost-success", "text-[var(--Text-Success)]", "hover:bg-[var(--Surface-Success)]"],
] as const

const classesOf = (cls: string) => cls.split(/\s+/)

describe("Button の文字だけの弱い variant（#664 / #671）", () => {
  it.each(TONES)("variant=%s は文字色と hover の面を semantic token で持ち、背景・枠を持たない", (variant, text, hover) => {
    const cls = classesOf(buttonVariants({ variant }))
    expect(cls).toContain(text)
    expect(cls).toContain(hover)
    expect(cls).toContain("rounded-[var(--Control-Radius)]")
    // 背景・枠は持たない（ghost と同じ）
    expect(cls.some((c) => c.startsWith("bg-"))).toBe(false)
    expect(cls).not.toContain("border")
    // focus ring と disabled は base と共通
    expect(cls).toContain("focus-visible:ring-[var(--Focus-High-Emphasis)]/50")
    expect(cls).toContain("disabled:opacity-50")
    expect(cls.join(" ")).not.toMatch(/#[0-9a-f]{3,8}\b|Object-Caution/i)
  })

  it.each(TONES)("variant=%s を data-variant に出す", (variant) => {
    expect(renderToStaticMarkup(<Button variant={variant}>x</Button>)).toContain(`data-variant="${variant}"`)
  })

  it.each(TONES)("variant=%s は小さいサイズで当たり判定拡張（#601）も付く", (variant) => {
    expect(classesOf(buttonVariants({ variant, size: "sm" }))).toContain("before:min-h-11")
  })

  it("loading / disabled の挙動は ghost と同じ", () => {
    const html = renderToStaticMarkup(<Button variant="ghost-neutral" loading>あとで</Button>)
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('aria-disabled="true"')
  })

  it("既存の ghost はアクセント色のまま（後方互換）", () => {
    expect(classesOf(buttonVariants({ variant: "ghost" }))).toContain("text-[var(--Text-Accent-Primary)]")
  })
})
