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
 * - 既定（size 未指定）は main と1クラスも変わらない class 文字列・順序を保つこと。
 *   BASELINE_* は追加前（origin/main）の実装が実際に出力していた文字列をそのまま
 *   固定している。ここが変わる差分は既存 consumer の CSS を壊す可能性があるので、
 *   意図的な変更でない限り通してはいけない（list-item-layout.test.tsx と同じ方式）。
 * - Accordion ルートの size は context 経由で Trigger / Content に伝わること。
 * - Trigger / Content へ個別に size を渡すと、ルートの値より優先されること（混在を許容）。
 */
// renderToStaticMarkup は属性値中の `&` / `>` を HTML エンティティにエスケープする
// （`[&[data-state=open]>svg]` の `&` と `>` が対象）。期待値もエスケープ後の形で持つ。
const BASELINE_TRIGGER_CLASS =
  "flex flex-1 items-center justify-between py-4 typo-label-md text-[var(--Text-High-Emphasis)] transition-all cursor-pointer hover:underline [&amp;[data-state=open]&gt;svg]:rotate-180"
const BASELINE_CONTENT_CLASS =
  "overflow-hidden typo-body-md text-[var(--Text-High-Emphasis)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"

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

describe("Accordion size 既定値の非破壊性 (issue #600)", () => {
  it("size 未指定は main と1クラスも変わらない Trigger/Content class を出す", () => {
    const html = renderAccordion()
    expect(html).toContain(`class="${BASELINE_TRIGGER_CLASS}"`)
    expect(html).toContain(`class="${BASELINE_CONTENT_CLASS}"`)
  })

  it("Accordion ルートの size='lg' が Trigger / Content へ伝わる", () => {
    const html = renderAccordion({ type: "single", size: "lg" })
    expect(html).toContain("py-6")
    expect(html).toContain("typo-label-lg")
    expect(html).toContain("typo-body-lg")
    // lg は複数行の質問文字折り返し対策で text-left を追加する（issue #600 レビュー指摘）
    expect(html).toContain("text-left")
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
    expect(html).toContain(`class="${BASELINE_TRIGGER_CLASS}"`)
    expect(html).toContain(`class="${BASELINE_CONTENT_CLASS}"`)
    expect(html).not.toContain("py-6")
    expect(html).not.toContain("typo-label-lg")
    expect(html).not.toContain("typo-body-lg")
  })

  it("data-size 属性が Trigger / Content に反映される（スタイルフックとして公開）", () => {
    const defaultHtml = renderAccordion()
    expect(defaultHtml).toContain('data-size="default"')

    const lgHtml = renderAccordion({ type: "single", size: "lg" })
    expect(lgHtml).toContain('data-size="lg"')
  })
})
