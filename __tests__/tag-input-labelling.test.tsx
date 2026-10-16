/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { TagInput } from "../src/components/patterns/tag-input"
import { FormField } from "../src/components/patterns/form-field"

// issue #693: TagInput の内部 input を FormField の label と結べるようにする。
const input = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return { host, el: host.querySelector<HTMLInputElement>('[data-slot="tag-input"] input')! }
}

describe("TagInput の名前・説明の結び付け（#693）", () => {
  it("id も aria-labelledby も無いときは従来どおり aria-label=タグ入力（後方互換）", () => {
    const { el } = input(<TagInput />)
    expect(el.getAttribute("aria-label")).toBe("タグ入力")
    expect(el.hasAttribute("id")).toBe(false)
  })

  it("id を渡すと内部 input に付き、既定の aria-label は出さない（label が名前になる）", () => {
    const { el } = input(<TagInput id="tags" name="tags" />)
    expect(el.id).toBe("tags")
    expect(el.getAttribute("name")).toBe("tags")
    expect(el.hasAttribute("aria-label")).toBe(false)
  })

  it("aria-labelledby を渡しても既定の aria-label は出さない。inputLabel を明示すれば出す", () => {
    expect(input(<TagInput aria-labelledby="h" />).el.hasAttribute("aria-label")).toBe(false)
    expect(input(<TagInput aria-labelledby="h" />).el.getAttribute("aria-labelledby")).toBe("h")
    expect(input(<TagInput id="t" inputLabel="Add tag" />).el.getAttribute("aria-label")).toBe("Add tag")
  })

  it("FormField の子に置くと label と結ばれ、エラーは aria-invalid / aria-describedby で渡る", () => {
    const { host, el } = input(
      <FormField label="タグ" htmlFor="task-tags" error="1 つ以上入力してください">
        <TagInput id="task-tags" />
      </FormField>,
    )
    const label = host.querySelector("label")!
    expect(label.getAttribute("for")).toBe("task-tags")
    expect(el.id).toBe("task-tags")
    expect(el.getAttribute("aria-invalid")).toBe("true")
    const describedby = el.getAttribute("aria-describedby")!
    expect(describedby).toBeTruthy()
    expect(host.querySelector(`[id="${describedby}"]`)?.textContent).toContain("1 つ以上入力してください")
  })
})
