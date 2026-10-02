import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../src/components/ui/accordion"

/**
 * issue #600: Accordion に size="default" | "lg" を追加。
 *
 * - 既定（size 未指定）は従来と同じ見た目（py-4 typo-label-md / typo-body-md）を保つこと。
 * - Accordion ルートの size は context 経由で Item 配下の Trigger / Content に伝わること。
 * - Trigger / Content へ個別に size を渡すと、ルートの値より優先されること（混在を許容）。
 */
function renderAccordion(rootProps: React.ComponentProps<typeof Accordion> = { type: "single" }) {
  return renderToStaticMarkup(
    <Accordion collapsible {...rootProps}>
      <AccordionItem value="item-1">
        <AccordionTrigger>質問</AccordionTrigger>
        <AccordionContent>回答</AccordionContent>
      </AccordionItem>
    </Accordion>,
  )
}

describe("Accordion size (issue #600)", () => {
  it("size 未指定は従来どおり py-4 typo-label-md / typo-body-md を出す", () => {
    const html = renderAccordion()
    expect(html).toContain("py-4")
    expect(html).toContain("typo-label-md")
    expect(html).toContain("typo-body-md")
    expect(html).not.toContain("py-6")
    expect(html).not.toContain("typo-label-lg")
    expect(html).not.toContain("typo-body-lg")
  })

  it("Accordion ルートの size='lg' が Trigger / Content へ伝わる", () => {
    const html = renderAccordion({ type: "single", size: "lg" })
    expect(html).toContain("py-6")
    expect(html).toContain("typo-label-lg")
    expect(html).toContain("typo-body-lg")
    expect(html).not.toContain("py-4")
    expect(html).not.toContain("typo-label-md")
    expect(html).not.toContain("typo-body-md")
  })

  it("Trigger / Content 個別の size はルートの size より優先される", () => {
    const html = renderToStaticMarkup(
      <Accordion type="single" collapsible size="lg">
        <AccordionItem value="item-1">
          <AccordionTrigger size="default">質問</AccordionTrigger>
          <AccordionContent size="default">回答</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(html).toContain("py-4")
    expect(html).toContain("typo-label-md")
    expect(html).toContain("typo-body-md")
    expect(html).not.toContain("py-6")
    expect(html).not.toContain("typo-label-lg")
    expect(html).not.toContain("typo-body-lg")
  })

  it("data-size 属性が Trigger / Content に反映される（スタイルフックとして公開）", () => {
    const html = renderAccordion({ type: "single", size: "lg" })
    expect(html).toContain('data-size="lg"')
  })
})
