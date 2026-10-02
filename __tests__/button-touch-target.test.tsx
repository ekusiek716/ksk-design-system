import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Button } from "../src/components/ui/button"
import { buttonVariants } from "../src/lib/server-variants/button-variants"

// issue #601: 見た目が 44px 未満のサイズは透明な before 擬似要素で当たり判定を 44×44px に広げる。
const HIT = ["before:min-h-11", "before:min-w-11", "before:content-['']", "before:absolute"]

const classesOf = (cls: string) => cls.split(/\s+/)

describe("Button の当たり判定拡張（#601）", () => {
  it.each(["xs", "sm", "icon-sm"] as const)("%s は 44px の当たり判定と relative を持つ", (size) => {
    const cls = classesOf(buttonVariants({ size }))
    for (const c of HIT) expect(cls).toContain(c)
    expect(cls).toContain("relative")
  })

  it.each(["default", "lg", "xl", "hero", "icon", "icon-lg", "icon-xl", "icon-fab", "match"] as const)(
    "%s には付けない（見た目の寸法そのままで判定する）",
    (size) => {
      const cls = classesOf(buttonVariants({ size }))
      expect(cls).not.toContain("before:min-h-11")
      expect(cls).not.toContain("relative")
    },
  )

  it.each(["secondary", "tertiary", "ghost", "destructive", "link", "inverse", "ghost-inverse", "accent"] as const)(
    "variant=%s の sm でも付く",
    (variant) => {
      expect(classesOf(buttonVariants({ variant, size: "sm" }))).toContain("before:min-h-11")
    },
  )

  // .glass-specular は非レイヤー CSS で ::before / ::after と overflow:hidden を使うため、
  // before: の拡張を混ぜるとスペキュラ層がずれる。glass 系には付けない。
  it.each(["glass", "glass-inverse", "glass-accent"] as const)("variant=%s には付けない", (variant) => {
    for (const size of ["xs", "sm", "icon-sm"] as const) {
      const cls = classesOf(buttonVariants({ variant, size }))
      expect(cls.some((c) => c.startsWith("before:"))).toBe(false)
    }
  })

  it("consumer の position 指定（absolute）は relative より優先される", () => {
    const html = renderToStaticMarkup(
      <Button size="icon-sm" aria-label="閉じる" className="absolute right-2 top-2" />,
    )
    const cls = /class="([^"]+)"/.exec(html)?.[1] ?? ""
    expect(classesOf(cls)).toContain("absolute")
    expect(classesOf(cls)).not.toContain("relative")
    expect(classesOf(cls)).toContain("before:min-h-11")
  })

  it("asChild の <a> にも同じ当たり判定が付く", () => {
    const html = renderToStaticMarkup(
      <Button asChild size="sm" variant="link">
        <a href="/terms">利用規約</a>
      </Button>,
    )
    expect(html).toMatch(/^<a /)
    expect(html).toContain("before:min-h-11")
  })
})
