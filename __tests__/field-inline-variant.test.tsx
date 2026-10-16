/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Input } from "../src/components/ui/input"
import { Textarea } from "../src/components/ui/textarea"
import { CommitInput } from "../src/components/ui/commit-input"
import { AutoGrowTextarea } from "../src/components/ui/auto-grow-textarea"

// issue #675: 入力欄の inline / inline-title variant。
const el = (ui: React.ReactElement, sel: string) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host.querySelector<HTMLElement>(sel)!
}
const cls = (e: HTMLElement) => e.className.split(" ")

describe("Input / Textarea の inline variant（#675）", () => {
  it("未指定は従来の枠付き（data-variant なし・--Field-Height-Md）", () => {
    const input = el(<Input aria-label="x" />, "input")
    expect(input.hasAttribute("data-variant")).toBe(false)
    expect(input.className).toContain("h-[var(--Field-Height-Md)]")
  })
  it("inline は枠・背景なし・本文の typo・hover の面・Focus リング", () => {
    const input = el(<Input variant="inline" aria-label="x" />, "input")
    expect(input.dataset.variant).toBe("inline")
    expect(cls(input)).toEqual(
      expect.arrayContaining(["border-0", "bg-transparent", "typo-body-md", "hover:bg-[var(--Surface-Secondary)]", "focus-visible:ring-[3px]", "focus-visible:outline-hidden"]),
    )
    expect(input.className).not.toContain("--Field-Height-Md")
  })
  it("inline-title は見出しの typo", () => {
    expect(cls(el(<Input variant="inline-title" aria-label="x" />, "input"))).toContain("typo-heading-xl")
  })
  it("unstyled と併用したら unstyled が優先", () => {
    const input = el(<Input variant="inline" unstyled aria-label="x" />, "input")
    expect(input.className).not.toContain("typo-body-md")
  })
  it("Textarea inline は最小高さ・resize を持たない", () => {
    const t = el(<Textarea variant="inline" aria-label="x" />, "textarea")
    expect(cls(t)).toEqual(expect.arrayContaining(["min-h-0", "resize-none", "bg-transparent"]))
    expect(t.className).not.toContain("--Field-Min-Height")
  })
  it("CommitInput / AutoGrowTextarea からもそのまま渡る", () => {
    expect(el(<CommitInput variant="inline-title" value="t" onCommit={() => {}} aria-label="x" />, "input").dataset.variant).toBe("inline-title")
    expect(el(<AutoGrowTextarea variant="inline" value="" onChange={() => {}} aria-label="x" />, "textarea").dataset.variant).toBe("inline")
  })
  it("showCount は inline でも従来どおり出る", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(<Input variant="inline" showCount maxLength={10} defaultValue="abc" aria-label="x" />)
    expect(host.querySelector('[data-slot="input-count"]')?.textContent).toBe("3/10")
  })
  it("native Input / Textarea / AutoGrowTextarea も同名 variant を持つ", () => {
    for (const f of ["Input", "Textarea", "AutoGrowTextarea"]) {
      const src = readFileSync(join(__dirname, "..", `src/native/components/${f}.tsx`), "utf8")
      expect(src, f).toMatch(/variant\?: (FieldVariant|"default" \| "inline" \| "inline-title")/)
    }
  })
})
