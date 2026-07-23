import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Container } from "../src/components/ui/container"
import { Section } from "../src/components/ui/section"

describe("Container", () => {
  it("最大幅と左右 gutter を variant から適用する", () => {
    const markup = renderToStaticMarkup(
      <Container size="narrow" gutter="tight">content</Container>,
    )

    expect(markup).toContain('data-slot="container"')
    expect(markup).toContain("max-w-3xl")
    expect(markup).toContain("px-4")
  })

  it("gutter=none は左右 padding を追加しない", () => {
    const markup = renderToStaticMarkup(
      <Container size="fluid" gutter="none">content</Container>,
    )

    expect(markup).toContain("max-w-none")
    expect(markup).not.toMatch(/\bpx-/)
  })
})

describe("Section", () => {
  it("縦余白と背景だけを適用し、左右 padding を持たない", () => {
    const markup = renderToStaticMarkup(
      <Section spacing="lg" background="subtle">content</Section>,
    )

    expect(markup).toContain('data-slot="section"')
    expect(markup).toContain("py-16")
    expect(markup).toContain("bg-[var(--Surface-Secondary)]")
    expect(markup).not.toMatch(/\b(px|pl|pr)-/)
  })
})
