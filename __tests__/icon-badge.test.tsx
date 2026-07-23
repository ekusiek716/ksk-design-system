import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { EmptyState } from "../src/components/patterns/empty-state"
import { ActionTile } from "../src/components/patterns/quick-action-grid"
import { IconBadge } from "../src/components/ui/icon-badge"
import * as PublicApi from "../src/index"

const Icon = () => <svg data-testid="icon" />

describe("IconBadge", () => {
  it.each([
    ["md", "size-11", "size-5"],
    ["ml", "size-12", "size-6"],
    ["lg", "size-18", "size-[2.375rem]"],
  ] as const)("%s はコンテナとアイコンの規定寸法を適用する", (size, badgeClass, iconClass) => {
    const output = renderToStaticMarkup(
      <IconBadge size={size}>
        <Icon />
      </IconBadge>,
    )

    expect(output).toContain(`data-size="${size}"`)
    expect(output).toContain(badgeClass)
    expect(output).toContain(`[&amp;_svg]:${iconClass}`)
    expect(output).toContain("bg-[var(--Surface-Accent-Primary-Light)]")
    expect(output).toContain("text-[var(--Object-Accent-Primary)]")
    expect(output).not.toMatch(/\bm[trblxy]?-/)
  })

  it("装飾用途を既定で隠し、aria-label 指定時は公開する", () => {
    expect(renderToStaticMarkup(<IconBadge><Icon /></IconBadge>)).toContain(
      'aria-hidden="true"',
    )
    const labelled = renderToStaticMarkup(
      <IconBadge aria-label="特典">
        <Icon />
      </IconBadge>,
    )
    expect(labelled).toContain('aria-label="特典"')
    expect(labelled).toContain('role="img"')
    expect(labelled).not.toContain("aria-hidden")
  })

  it("package root から公開する", () => {
    expect(PublicApi.IconBadge).toBe(IconBadge)
  })
})

describe("IconBadge pattern integration", () => {
  it("ActionTile の既存 24px 枠と色を plain mode で維持する", () => {
    const output = renderToStaticMarkup(
      <ActionTile icon={<Icon />} label="記録" />,
    )

    expect(output).toContain('data-slot="icon-badge"')
    expect(output).toContain('data-appearance="plain"')
    expect(output).toContain("size-6")
    expect(output).toContain("text-[var(--Object-Medium-Emphasis)]")
    expect(output).not.toContain("bg-[var(--Surface-Accent-Primary-Light)]")
  })

  it("EmptyState の既存余白と色を plain mode で維持する", () => {
    const output = renderToStaticMarkup(
      <EmptyState icon={<Icon />} title="空です" description="説明" />,
    )

    expect(output).toContain('data-slot="icon-badge"')
    expect(output).toContain('data-appearance="plain"')
    expect(output).toContain("mb-4")
    expect(output).toContain("text-[var(--Object-Low-Emphasis)]")
    expect(output).not.toContain("bg-[var(--Surface-Accent-Primary-Light)]")
  })
})
