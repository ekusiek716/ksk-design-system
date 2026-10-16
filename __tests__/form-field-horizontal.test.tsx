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
    expect(root.className).toContain("@container")
    const grid = root.querySelector<HTMLElement>('[data-slot="form-field-grid"]')!
    // 狭い置き場所（15rem 未満）では 1 列（縦積み）、以上で 2 列
    expect(grid.className).toContain("grid-cols-1")
    expect(grid.className).toContain("@[15rem]:grid-cols-[var(--ksk-form-field-label-width)_minmax(0,1fr)]")
    expect(grid.className).toContain("items-center")
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
    expect(root.querySelector('[data-slot="form-field-grid"]')!.className).toContain("items-start")
  })

  it("エラーは右の列の下段に出て、入力欄の aria-describedby に結ばれる", () => {
    const el = host(
      <FormField orientation="horizontal" label="肩書き" htmlFor="t" error="長すぎます" description="補足">
        <Input id="t" />
      </FormField>,
    )
    const messages = el.querySelector<HTMLElement>('[data-slot="form-field-messages"]')!
    expect(messages.className).toContain("@[15rem]:col-start-2")
    const alert = messages.querySelector('[role="alert"]')!
    expect(alert.textContent).toContain("長すぎます")
    // エラー中は説明文を出さない（vertical と同じ）
    expect(messages.textContent).not.toContain("補足")
    expect(el.querySelector("input")!.getAttribute("aria-describedby")).toBe(alert.id)
    expect(el.querySelector("input")!.getAttribute("aria-invalid")).toBe("true")
  })

  it("endLabel はラベル列ではなく入力欄の右に置く（狭いラベル列で潰れない）", () => {
    const el = host(
      <FormField orientation="horizontal" label="メモ" htmlFor="m" endLabel="12/200">
        <Input id="m" />
      </FormField>,
    )
    expect(el.querySelector('[data-slot="form-field-label-cell"] [data-slot="form-field-end-label"]')).toBeNull()
    const control = el.querySelector<HTMLElement>('[data-slot="form-field-control"]')!
    expect(control.lastElementChild!.getAttribute("data-slot")).toBe("form-field-end-label")
    expect(control.querySelector("input")).not.toBeNull()
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

describe('FormField as="group" / FieldGroup variant="rows"（#720）', () => {
  it('as="group": ラベルは span[id]、右の列は role=group + aria-labelledby / aria-describedby', () => {
    const el = host(
      <FormField orientation="horizontal" as="group" label="役割" description="複数選べます" error="選んでください">
        <div>chips</div>
      </FormField>,
    )
    expect(el.querySelector("label")).toBeNull()
    const group = el.querySelector<HTMLElement>('[data-slot="form-field-control"]')!
    expect(group.getAttribute("role")).toBe("group")
    const label = el.querySelector<HTMLElement>(`[id="${group.getAttribute("aria-labelledby")}"]`)!
    expect(label.tagName).toBe("SPAN")
    expect(label.textContent).toBe("役割")
    const err = el.querySelector<HTMLElement>('[role="alert"]')!
    expect(group.getAttribute("aria-describedby")).toBe(err.id)
    // 子へは aria を注入しない
    expect(el.querySelector("div > div:not([data-slot])")?.hasAttribute("aria-invalid") ?? false).toBe(false)
  })

  it('vertical でも as="group" は role=group の列で包む', () => {
    const el = host(
      <FormField as="group" label="性別">
        <div>chips</div>
      </FormField>,
    )
    const group = el.querySelector<HTMLElement>('[role="group"]')!
    expect(group.dataset.slot).toBe("form-field-control")
    expect(el.querySelector(`[id="${group.getAttribute("aria-labelledby")}"]`)?.textContent).toBe("性別")
  })

  it("as 未指定の DOM は従来どおり（label htmlFor・子に aria）", () => {
    const html = renderToStaticMarkup(
      <FormField label="名前" htmlFor="n">
        <Input id="n" />
      </FormField>,
    )
    expect(html).toContain('<label for="n"')
    expect(html).not.toContain('role="group"')
  })

  it('FieldGroup variant="rows": 区切り線 + 直下の FormField に py-3。既定は従来の gap-4', async () => {
    const { FieldGroup } = await import("../src/components/patterns/field")
    const rows = host(<FieldGroup variant="rows" />).firstElementChild as HTMLElement
    expect(rows.dataset.variant).toBe("rows")
    expect(rows.className).toContain("divide-y")
    expect(rows.className).toContain("divide-[var(--Border-Low-Emphasis)]")
    expect(rows.className).toContain("[&>[data-slot=form-field]]:py-3")
    expect(rows.className).not.toContain("gap-4")
    const stack = host(<FieldGroup />).firstElementChild as HTMLElement
    expect(stack.className).toBe("flex min-w-0 flex-col gap-4")
    expect(stack.hasAttribute("data-variant")).toBe(false)
  })
})
