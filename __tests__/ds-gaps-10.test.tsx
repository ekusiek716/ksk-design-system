/** @vitest-environment jsdom */
import * as React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { FormField } from "../src/components/patterns/form-field"
import { ActionTile, QuickActionGrid } from "../src/components/patterns/quick-action-grid"
import { KebabMenu } from "../src/components/patterns/admin/kebab-menu"
import { KskLabelsProvider, KSK_DEFAULT_LABELS } from "../src/components/ui/ksk-labels"

const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

const tiles = (
  <>
    <ActionTile label="ピンク" selected />
    <ActionTile label="ブルー" />
  </>
)

describe("QuickActionGrid single の名前 (#751)", () => {
  const grid = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-slot="quick-action-grid"]')!

  it("FormField as=group の中で名前未指定なら、外側のラベルを aria-labelledby で結ぶ", () => {
    const el = host(
      <FormField as="group" label="テーマ">
        <QuickActionGrid selectionMode="single">{tiles}</QuickActionGrid>
      </FormField>
    )
    const g = grid(el)
    expect(g.getAttribute("role")).toBe("radiogroup")
    const labelledby = g.getAttribute("aria-labelledby")
    expect(labelledby).toBeTruthy()
    expect(el.querySelector(`[id="${labelledby}"]`)?.textContent).toContain("テーマ")
    expect(g.hasAttribute("aria-label")).toBe(false)
  })

  it("aria-label / aria-labelledby の明示は group 内でも優先する", () => {
    const withLabel = grid(
      host(
        <FormField as="group" label="テーマ">
          <QuickActionGrid selectionMode="single" aria-label="配色">{tiles}</QuickActionGrid>
        </FormField>
      )
    )
    expect(withLabel.getAttribute("aria-label")).toBe("配色")
    expect(withLabel.hasAttribute("aria-labelledby")).toBe(false)

    const withLabelledby = grid(
      host(
        <FormField as="group" label="テーマ">
          <QuickActionGrid selectionMode="single" aria-labelledby="heading-x">{tiles}</QuickActionGrid>
        </FormField>
      )
    )
    expect(withLabelledby.getAttribute("aria-labelledby")).toBe("heading-x")
  })

  it("selectionMode 未指定 / multiple、role の上書き、group の外では結ばない（従来どおり）", () => {
    const inGroup = (node: React.ReactElement) =>
      grid(host(<FormField as="group" label="テーマ">{node}</FormField>))
    expect(inGroup(<QuickActionGrid>{tiles}</QuickActionGrid>).hasAttribute("aria-labelledby")).toBe(false)
    expect(inGroup(<QuickActionGrid selectionMode="multiple">{tiles}</QuickActionGrid>).hasAttribute("aria-labelledby")).toBe(false)
    expect(
      inGroup(<QuickActionGrid selectionMode="single" role="list">{tiles}</QuickActionGrid>).hasAttribute("aria-labelledby")
    ).toBe(false)
    const outside = grid(host(<QuickActionGrid selectionMode="single" aria-label="配色">{tiles}</QuickActionGrid>))
    expect(outside.getAttribute("aria-label")).toBe("配色")
    expect(outside.hasAttribute("aria-labelledby")).toBe(false)
  })

  it("入れ子の起動ボタンの grid は外側のラベルを拾わない", () => {
    const el = host(
      <FormField as="group" label="テーマ">
        <QuickActionGrid selectionMode="single">
          <ActionTile label="ピンク" selected />
          <QuickActionGrid>
            <ActionTile label="起動" />
          </QuickActionGrid>
        </QuickActionGrid>
      </FormField>
    )
    const [outer, inner] = Array.from(el.querySelectorAll('[data-slot="quick-action-grid"]'))
    expect(outer.hasAttribute("aria-labelledby")).toBe(true)
    expect(inner.hasAttribute("aria-labelledby")).toBe(false)
  })
})

describe("KebabMenu の既定文言と当たり判定 (#752)", () => {
  const trigger = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-slot="kebab-menu"]')!
  const items = [{ label: "編集" }]

  it("Provider 無しは従来どおり「メニュー」", () => {
    expect(trigger(host(<KebabMenu items={items} />)).getAttribute("aria-label")).toBe("メニュー")
    expect(KSK_DEFAULT_LABELS.ja.menu).toBe("メニュー")
  })

  it('locale="en" で「Menu」、labels.menu で差し替え、menuLabel prop が最優先', () => {
    expect(
      trigger(host(<KskLabelsProvider locale="en"><KebabMenu items={items} /></KskLabelsProvider>)).getAttribute("aria-label")
    ).toBe("Menu")
    expect(
      trigger(
        host(<KskLabelsProvider labels={{ menu: "操作" }}><KebabMenu items={items} /></KskLabelsProvider>)
      ).getAttribute("aria-label")
    ).toBe("操作")
    expect(
      trigger(
        host(<KskLabelsProvider locale="en"><KebabMenu items={items} menuLabel="行の操作" /></KskLabelsProvider>)
      ).getAttribute("aria-label")
    ).toBe("行の操作")
  })

  it("見た目の大きさ（size-8）は変えず、透明な before で当たり判定を 44px に広げる", () => {
    const cls = trigger(host(<KebabMenu items={items} />)).className
    expect(cls).toContain("size-8")
    expect(cls).toContain("relative")
    expect(cls).toContain("before:absolute")
    expect(cls).toContain("before:min-h-11")
    expect(cls).toContain("before:min-w-11")
    expect(cls).toContain("before:content-['']")
  })

  it("className の absolute は relative を置き換え、before の基準は保たれる", () => {
    const cls = trigger(host(<KebabMenu items={items} className="absolute top-2 right-2" />)).className.split(/\s+/)
    expect(cls).toContain("absolute")
    expect(cls).not.toContain("relative")
    expect(cls).toContain("before:min-w-11")
  })
})
