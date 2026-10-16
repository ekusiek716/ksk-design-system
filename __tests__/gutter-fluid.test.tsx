/** @vitest-environment jsdom */
import * as React from "react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Container } from "../src/components/ui/container"
import { ChipFilterBar } from "../src/components/patterns/chip-filter-bar"

// issue #711: 画面幅で伸び縮みする左右余白 gutter="fluid"
const ROOT = join(__dirname, "..")

describe('gutter="fluid"（#711）', () => {
  it("Container は --Container-Gutter-Fluid を左右 padding にする", () => {
    const markup = renderToStaticMarkup(<Container gutter="fluid">x</Container>)
    expect(markup).toContain("px-[var(--Container-Gutter-Fluid,clamp(1rem,4vw,1.75rem))]")
    expect(markup).toContain('data-gutter="fluid"')
  })

  it("ChipFilterBar はチップ列と件数に同じ変数を付け、外側には付けない", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(
      <ChipFilterBar gutter="fluid" resultCount={2}>x</ChipFilterBar>,
    )
    const bar = host.querySelector<HTMLElement>('[data-slot="chip-filter-bar"]')!
    const content = bar.querySelector<HTMLElement>('[data-slot="chip-filter-bar-content"]')!
    expect(content.className).toContain("px-[var(--Container-Gutter-Fluid,clamp(1rem,4vw,1.75rem))]")
    expect(bar.querySelector("p")!.className).toContain("px-[var(--Container-Gutter-Fluid,clamp(1rem,4vw,1.75rem))]")
    expect(bar.className).not.toContain("Container-Gutter-Fluid")
  })

  it("既定の gutter は従来どおり（Container=px-6 / ChipFilterBar=ラッパー無し）", () => {
    expect(renderToStaticMarkup(<Container>x</Container>)).toContain("px-6")
    expect(renderToStaticMarkup(<Container>x</Container>)).not.toContain("Container-Gutter-Fluid")
    expect(renderToStaticMarkup(<ChipFilterBar>x</ChipFilterBar>)).not.toContain("chip-filter-bar-content")
  })

  it("既定値は 16〜28px の clamp で、product theme の許可リストに載っている", () => {
    const css = readFileSync(join(ROOT, "src/styles/product-theme.css"), "utf8")
    expect(css).toContain("--Container-Gutter-Fluid: clamp(1rem, 4vw, 1.75rem);")
    const contract = JSON.parse(readFileSync(join(ROOT, "contracts/product-theme-overrides.json"), "utf8"))
    expect(contract.allowedVariables.productSpacing).toContain("--Container-Gutter-Fluid")
    expect(contract.wiredComponents.Container).toContain("--Container-Gutter-Fluid")
    expect(contract.wiredComponents.ChipFilterBar).toContain("--Container-Gutter-Fluid")
  })
})
