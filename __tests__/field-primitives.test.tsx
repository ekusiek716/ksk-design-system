import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../src/components/patterns/field"
import { FormField } from "../src/components/patterns/form-field"
import { Input } from "../src/components/ui/input"
import * as PublicApi from "../src/index"

const html = (element: React.ReactElement) => renderToStaticMarkup(element)

describe("Field layout semantics", () => {
  it("fieldset / legend / group のネイティブ semantics を保つ", () => {
    const output = html(
      <FieldSet>
        <FieldLegend>基本情報</FieldLegend>
        <FieldDescription>入力してください</FieldDescription>
        <FieldGroup aria-label="基本情報">
          <FormField label="氏名" htmlFor="field-test-name">
            <Input id="field-test-name" />
          </FormField>
        </FieldGroup>
      </FieldSet>,
    )

    expect(output).toContain("<fieldset")
    expect(output).toContain('data-slot="field-set"')
    expect(output).toContain("<legend")
    expect(output).toContain('data-slot="field-legend"')
    expect(output).toContain('role="group"')
    expect(output).toContain('aria-label="基本情報"')
    expect(output).toContain('data-slot="form-field"')
  })

  it("FieldError は内容がある場合だけ alert を描画する", () => {
    expect(html(<FieldError>入力内容を確認してください</FieldError>)).toContain(
      'role="alert"',
    )
    expect(html(<FieldError>{null}</FieldError>)).toBe("")
    expect(html(<FieldError>{false}</FieldError>)).toBe("")
  })

  it("FieldSeparator はラベルありで 2 本、なしで 1 本の区切りを描画する", () => {
    const labelled = html(<FieldSeparator>または</FieldSeparator>)
    const plain = html(<FieldSeparator />)
    expect(labelled.match(/data-slot="separator"/g)).toHaveLength(2)
    expect(labelled).toContain("または")
    expect(plain.match(/data-slot="separator"/g)).toHaveLength(1)
  })

  it("縦リズムを FieldSet=24px / FieldGroup=16px に固定する", () => {
    expect(html(<FieldSet />)).toContain("gap-6")
    expect(html(<FieldGroup />)).toContain("gap-4")
  })
})

describe("Field public API", () => {
  it("6 primitives を package root から公開する", () => {
    expect(PublicApi.FieldSet).toBe(FieldSet)
    expect(PublicApi.FieldLegend).toBe(FieldLegend)
    expect(PublicApi.FieldGroup).toBe(FieldGroup)
    expect(PublicApi.FieldDescription).toBe(FieldDescription)
    expect(PublicApi.FieldError).toBe(FieldError)
    expect(PublicApi.FieldSeparator).toBe(FieldSeparator)
  })
})
