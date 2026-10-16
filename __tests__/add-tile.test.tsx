/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { AddTile } from "../src/components/patterns/add-tile"

// issue #678: 点線の「＋追加」タイル。
const btn = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host.querySelector<HTMLButtonElement>('[data-slot="add-tile"]')!
}

describe("AddTile（#678）", () => {
  it("type=button の実 button。ラベルが名前になり、アイコンは aria-hidden", () => {
    const b = btn(<AddTile label="タスクを追加" />)
    expect(b.tagName).toBe("BUTTON")
    expect(b.getAttribute("type")).toBe("button")
    expect(b.textContent).toBe("タスクを追加")
    // truncate されたラベルの全文は title で確認できる
    expect(b.querySelector("span[title]")?.getAttribute("title")).toBe("タスクを追加")
    expect(b.querySelector('[aria-hidden="true"] svg')).not.toBeNull()
  })
  it("点線の枠・44px 以上・全幅が既定、focus-visible リングを持つ", () => {
    const cls = btn(<AddTile label="x" />).className.split(" ")
    expect(cls).toEqual(expect.arrayContaining(["border-dashed", "border-[var(--Border-Medium-Emphasis)]", "min-h-16", "w-full", "focus-visible:ring-[3px]"]))
    expect(btn(<AddTile label="x" size="sm" />).className.split(" ")).toContain("min-h-11")
    expect(btn(<AddTile label="x" fullWidth={false} />).className.split(" ")).not.toContain("w-full")
  })
  it("native AddTile も role と disabled 状態を持つ", () => {
    const src = readFileSync(join(__dirname, "..", "src/native/components/AddTile.tsx"), "utf8")
    expect(src).toContain('accessibilityRole="button"')
    expect(src).toContain("accessibilityState={{ disabled }}")
    expect(src).toContain('borderStyle: "dashed"')
  })
})
