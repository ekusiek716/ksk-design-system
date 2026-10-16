/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Avatar, AvatarFallback } from "../src/components/ui/avatar"

// issue #688: Web Avatar に native と同じ語彙の size を持たせ、Fallback の文字サイズも追随させる。
const parse = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return {
    root: host.querySelector<HTMLElement>('[data-slot="avatar"]')!,
    fallback: host.querySelector<HTMLElement>('[data-slot="avatar-fallback"]'),
  }
}

describe("Avatar の size（#688）", () => {
  it("未指定は md = 従来の size-10 と typo-label-sm（後方互換）", () => {
    const { root, fallback } = parse(<Avatar><AvatarFallback>KS</AvatarFallback></Avatar>)
    expect(root.dataset.size).toBe("md")
    expect(root.className.split(" ")).toContain("size-10")
    expect(fallback?.className.split(" ")).toContain("typo-label-sm")
  })

  it.each([
    ["xs", "size-6", "typo-label-xs"],
    ["sm", "size-8", "typo-label-xs"],
    ["lg", "size-14", "typo-label-lg"],
    ["xl", "size-20", "typo-heading-lg"],
  ] as const)("size=%s は %s・Fallback は %s", (size, cls, typo) => {
    const { root, fallback } = parse(<Avatar size={size}><AvatarFallback>KS</AvatarFallback></Avatar>)
    expect(root.className.split(" ")).toContain(cls)
    expect(root.className).not.toContain("size-10")
    expect(fallback?.className.split(" ")).toContain(typo)
  })

  it("className の size-* は従来どおり後勝ちで効く", () => {
    const { root } = parse(<Avatar className="size-12"><AvatarFallback>K</AvatarFallback></Avatar>)
    expect(root.className.split(" ")).toContain("size-12")
    expect(root.className).not.toContain("size-10")
  })

  it("native Avatar も xs=24 を持つ（語彙と値の一致）", () => {
    const native = readFileSync(join(__dirname, "..", "src/native/components/Avatar.tsx"), "utf8")
    expect(native).toContain('export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"')
    expect(native).toMatch(/xs: 24,\s+sm: 32,\s+md: 40,\s+lg: 56,\s+xl: 80,/)
  })
})
