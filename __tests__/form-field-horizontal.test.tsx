/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { FormField } from "../src/components/patterns/form-field"
import { Input } from "../src/components/ui/input"
import { Textarea } from "../src/components/ui/textarea"
import { AutoGrowTextarea } from "../src/components/ui/auto-grow-textarea"

// issue #712: ラベル左置きの項目行と、inline 入力欄の当たり判定
const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

describe('FormField orientation="horizontal"（#712）', () => {
  it("2 列の grid でラベル列の幅を labelWidth（既定 5rem）にする", () => {
    const el = host(
      <FormField orientation="horizontal" label="かな" htmlFor="k">
        <Input id="k" />
      </FormField>,
    )
    const root = el.querySelector<HTMLElement>('[data-slot="form-field"]')!
    expect(root.dataset.orientation).toBe("horizontal")
    expect(root.className).toContain("grid-cols-[var(--ksk-form-field-label-width)_minmax(0,1fr)]")
    expect(root.className).toContain("items-center")
    expect(root.style.getPropertyValue("--ksk-form-field-label-width")).toBe("5rem")
    expect(root.querySelector('[data-slot="form-field-label-cell"] label')!.getAttribute("for")).toBe("k")
    expect(root.querySelector('[data-slot="form-field-control"] input')).not.toBeNull()
    // 説明・エラーが無いときは右列の下段を出さない
    expect(root.querySelector('[data-slot="form-field-messages"]')).toBeNull()
  })

  it("labelWidth / labelAlign=start / 呼び出し側の style を保つ", () => {
    const el = host(
      <FormField orientation="horizontal" labelWidth="6rem" labelAlign="start" label="住所" style={{ marginTop: 4 }}>
        <Textarea />
      </FormField>,
    )
    const root = el.querySelector<HTMLElement>('[data-slot="form-field"]')!
    expect(root.style.getPropertyValue("--ksk-form-field-label-width")).toBe("6rem")
    expect(root.style.marginTop).toBe("4px")
    expect(root.className).toContain("items-start")
  })

  it("エラーは右の列の下段に出て、入力欄の aria-describedby に結ばれる", () => {
    const el = host(
      <FormField orientation="horizontal" label="肩書き" htmlFor="t" error="長すぎます" description="補足">
        <Input id="t" />
      </FormField>,
    )
    const messages = el.querySelector<HTMLElement>('[data-slot="form-field-messages"]')!
    expect(messages.className).toContain("col-start-2")
    const alert = messages.querySelector('[role="alert"]')!
    expect(alert.textContent).toContain("長すぎます")
    // エラー中は説明文を出さない（vertical と同じ）
    expect(messages.textContent).not.toContain("補足")
    expect(el.querySelector("input")!.getAttribute("aria-describedby")).toBe(alert.id)
    expect(el.querySelector("input")!.getAttribute("aria-invalid")).toBe("true")
  })

  it("既定（vertical）の DOM は従来どおり", () => {
    const markup = renderToStaticMarkup(
      <FormField label="氏名" htmlFor="n">
        <Input id="n" />
      </FormField>,
    )
    expect(markup).toContain('class="flex flex-col gap-1.5"')
    expect(markup).not.toContain("data-orientation")
    expect(markup).not.toContain("style=")
    expect(markup).not.toContain("form-field-control")
  })
})

describe('targetSize="comfortable"（#712）', () => {
  it("inline の Input / Textarea に min-h-11 + py-2 を付け、py-0.5 を置き換える", () => {
    const input = host(<Input variant="inline" targetSize="comfortable" />).querySelector("input")!
    expect(input.className).toContain("min-h-11")
    expect(input.className).toContain("py-2")
    expect(input.className).not.toContain("py-0.5")
    expect(input.dataset.targetSize).toBe("comfortable")
    const ta = host(<Textarea variant="inline" targetSize="comfortable" />).querySelector("textarea")!
    expect(ta.className).toContain("min-h-11")
    expect(ta.className).not.toContain("min-h-0")
    expect(ta.dataset.targetSize).toBe("comfortable")
  })

  it("AutoGrowTextarea にもそのまま渡る", () => {
    const ta = host(
      <AutoGrowTextarea value="" onChange={() => {}} variant="inline" targetSize="comfortable" />,
    ).querySelector("textarea")!
    expect(ta.className).toContain("min-h-11")
  })

  it("枠付き（default）と unstyled では効かず、既定は従来のクラスのまま", () => {
    const framed = host(<Input targetSize="comfortable" />).querySelector("input")!
    expect(framed.className).not.toContain("min-h-11")
    expect(framed.dataset.targetSize).toBeUndefined()
    const unstyled = host(<Input unstyled variant="inline" targetSize="comfortable" />).querySelector("input")!
    expect(unstyled.className).not.toContain("min-h-11")
    const compact = host(<Input variant="inline" />).querySelector("input")!
    expect(compact.className).toContain("py-0.5")
    expect(compact.dataset.targetSize).toBeUndefined()
  })
})
