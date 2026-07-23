import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Container } from "../src/components/ui/container"
import { Section } from "../src/components/ui/section"
import { AdminShell } from "../src/components/patterns/shells/admin-shell"
import { AppShell } from "../src/components/patterns/shells/app-shell"
import { MarketingShell } from "../src/components/patterns/shells/marketing-shell"

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

describe("shell layout ownership", () => {
  it("AppShell topBar の既存 px-4 を tight Container が担う", () => {
    const markup = renderToStaticMarkup(
      <AppShell topBar={<span>header</span>}>content</AppShell>,
    )

    expect(markup).toContain('data-slot="app-topbar"')
    expect(markup).toContain('data-gutter="tight"')
    expect(markup).toContain("px-4")
  })

  it("AdminShell の header / main 外周余白を Container が担う", () => {
    const markup = renderToStaticMarkup(
      <AdminShell sidebar={<span>sidebar</span>} header={<span>header</span>}>
        content
      </AdminShell>,
    )

    expect(markup).toContain('data-slot="admin-header"')
    expect(markup.match(/data-slot="container"/g)).toHaveLength(2)
    expect(markup).toContain("px-6")
    expect(markup).toContain("py-6")
  })

  it("MarketingShell の全幅 footer を Section + spacious Container で維持する", () => {
    const markup = renderToStaticMarkup(
      <MarketingShell header={<span>header</span>} footer={<span>footer</span>}>
        content
      </MarketingShell>,
    )

    expect(markup).toContain('data-slot="marketing-footer"')
    expect(markup).toContain('data-background="subtle"')
    expect(markup).toContain('data-gutter="spacious"')
    expect(markup).toContain("py-12")
    expect(markup).toContain("px-6 lg:px-16")
  })
})
