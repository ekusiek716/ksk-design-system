/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Banner } from "../src/components/patterns/banner"

// issue #683: Banner の density / layout。
const root = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host.querySelector<HTMLElement>('[data-slot="banner"]')!
}
const cls = (el: HTMLElement) => el.className.split(" ")

describe("Banner density / layout（#683）", () => {
  it("未指定は従来どおり gap-3 p-4 rounded-lg、説明は mt-1", () => {
    const el = root(<Banner description="d" />)
    expect(cls(el)).toEqual(expect.arrayContaining(["gap-3", "p-4", "rounded-lg"]))
    expect(el.querySelector("p")!.className.split(" ")).toContain("mt-1")
  })
  it("compact は px-3 py-2 gap-2 に詰め、title が無いとき説明の上余白を持たない", () => {
    const el = root(<Banner density="compact" description="d" />)
    expect(cls(el)).toEqual(expect.arrayContaining(["gap-2", "px-3", "py-2"]))
    expect(cls(el)).not.toContain("p-4")
    expect(el.querySelector("p")!.className).not.toMatch(/\bmt-/)
  })
  it("bar は全幅・角丸なし・上と左右の枠なし（下線だけ残る）", () => {
    const el = root(<Banner layout="bar" description="d" />)
    expect(cls(el)).toEqual(expect.arrayContaining(["w-full", "rounded-none", "border-x-0", "border-t-0", "border"]))
    expect(cls(el)).not.toContain("rounded-lg")
    expect(el.dataset.layout).toBe("bar")
  })
})
