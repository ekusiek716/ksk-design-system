/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { CollapsibleChipField } from "../src/components/patterns/collapsible-chip-field"

// issue #717: 見出しの既定・radiogroup と見出しの結び付け・見出しが無い行の空き
type K = "a" | "b"
const base = { options: ["a", "b"] as K[], selected: "" as const, onSelect: () => undefined, getLabel: (k: K) => k.toUpperCase() }
const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

describe("CollapsibleChipField の見出し（#717）", () => {
  it("既定はフォームの項目名（typo-label-md + Text-High-Emphasis）", () => {
    const label = host(<CollapsibleChipField<K> {...base} label="関係" />).querySelector<HTMLElement>(
      '[data-slot="collapsible-chip-field-label"]',
    )!
    expect(label.className).toContain("typo-label-md")
    expect(label.className).toContain("text-[var(--Text-High-Emphasis)]")
  })

  it('labelSize="sm" は 2.12.0 までの見た目', () => {
    const label = host(<CollapsibleChipField<K> {...base} label="関係" labelSize="sm" />).querySelector<HTMLElement>(
      '[data-slot="collapsible-chip-field-label"]',
    )!
    expect(label.className).toContain("typo-label-sm")
    expect(label.className).toContain("text-[var(--Text-Medium-Emphasis)]")
  })

  it("展開中の radiogroup は見える見出しと aria-labelledby で結ぶ", () => {
    const el = host(<CollapsibleChipField<K> {...base} label="関係" />)
    const group = el.querySelector<HTMLElement>('[role="radiogroup"]')!
    const label = el.querySelector<HTMLElement>('[data-slot="collapsible-chip-field-label"]')!
    expect(group.getAttribute("aria-labelledby")).toBe(label.id)
    expect(group.hasAttribute("aria-label")).toBe(false)
  })

  it("ariaLabel を明示したら aria-label を優先する", () => {
    const group = host(<CollapsibleChipField<K> {...base} label="関係" ariaLabel="招待客との関係" />).querySelector<HTMLElement>(
      '[role="radiogroup"]',
    )!
    expect(group.getAttribute("aria-label")).toBe("招待客との関係")
    expect(group.hasAttribute("aria-labelledby")).toBe(false)
  })

  it("label も icon も無いときは先頭の枠を描かない", () => {
    const root = host(<CollapsibleChipField<K> {...base} ariaLabel="分類" />).querySelector<HTMLElement>(
      '[data-slot="collapsible-chip-field"]',
    )!
    expect(root.children.length).toBe(1)
    expect(root.firstElementChild!.getAttribute("role")).toBe("radiogroup")
  })

  it("icon だけの行は従来どおり先頭に 24px の枠", () => {
    const root = host(<CollapsibleChipField<K> {...base} icon={<span>*</span>} ariaLabel="分類" />).querySelector<HTMLElement>(
      '[data-slot="collapsible-chip-field"]',
    )!
    expect(root.children.length).toBe(2)
    expect(root.firstElementChild!.className).toContain("w-6")
  })
})

describe("CollapsibleChipField の長い見出し（#717 レビュー）", () => {
  it("label は折り返し可（nowrap にしない）・幅は w-20 固定で縮まない", () => {
    const label = host(<CollapsibleChipField<K> {...base} label="招待客との関係性" />).querySelector<HTMLElement>(
      '[data-slot="collapsible-chip-field-label"]',
    )!
    expect(label.className).not.toContain("whitespace-nowrap")
    expect(label.className).toContain("w-20")
    expect(label.className).toContain("min-w-20")
    expect(label.className).toContain("flex-shrink-0")
    expect(label.className).toContain("break-words")
  })
})
