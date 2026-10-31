/**
 * @vitest-environment jsdom
 *
 * issue #792: FormSection が title の <legend> を <div> で包んでいたため、
 * fieldset の名前（accessible name）が空になり、スクリーンリーダーが見出しを
 * グループ名として読まなかった。fieldset の名前になるのは「直下の最初の legend」だけ。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { computeAccessibleDescription, computeAccessibleName } from "dom-accessibility-api"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { FormSection } from "../src/components/patterns/form"

let container: HTMLElement
let root: Root

function mount(ui: React.ReactElement) {
  act(() => {
    root.render(ui)
  })
}

function section(): HTMLFieldSetElement {
  return container.querySelector<HTMLFieldSetElement>('fieldset[data-slot="form-section"]')!
}

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
})

describe("FormSection: title を fieldset の名前として公開する (#792)", () => {
  it("title ありで fieldset の accessible name が title と一致する", () => {
    mount(
      <FormSection title="ジャンル">
        <input aria-label="アクション" type="checkbox" />
      </FormSection>,
    )
    const fs = section()
    expect(computeAccessibleName(fs)).toBe("ジャンル")
    // legend は fieldset の直下の最初の子
    expect(fs.firstElementChild?.tagName).toBe("LEGEND")
  })

  it("description ありでも legend が fieldset 直下の最初の子で、description は説明として結ばれる", () => {
    mount(
      <FormSection title="予告編の向き" description="縦か横かを選びます">
        <input aria-label="縦" type="checkbox" />
      </FormSection>,
    )
    const fs = section()
    const legend = fs.firstElementChild as HTMLElement
    expect(legend.tagName).toBe("LEGEND")
    expect(legend.textContent).toBe("予告編の向き")
    // description は legend の後ろの兄弟（fieldset の直下）
    const desc = legend.nextElementSibling as HTMLElement
    expect(desc.tagName).toBe("P")
    expect(desc.parentElement).toBe(fs)
    expect(computeAccessibleName(fs)).toBe("予告編の向き")
    expect(computeAccessibleDescription(fs)).toBe("縦か横かを選びます")
    // legend を div で包まない
    expect(fs.querySelector("div > legend")).toBeNull()
  })

  it("利用者の aria-describedby は description と連結して残す", () => {
    mount(
      <>
        <p id="extra">補足</p>
        <FormSection title="配信" description="複数選べます" aria-describedby="extra">
          <input aria-label="A" type="checkbox" />
        </FormSection>
      </>,
    )
    const ids = section().getAttribute("aria-describedby")!.split(" ")
    expect(ids).toContain("extra")
    expect(ids.length).toBe(2)
    expect(computeAccessibleDescription(section())).toBe("複数選べます 補足")
  })

  it("title 無しでは legend を描かない（名前なしは想定内）", () => {
    mount(
      <FormSection description="説明だけ">
        <input aria-label="A" type="checkbox" />
      </FormSection>,
    )
    const fs = section()
    expect(fs.querySelector("legend")).toBeNull()
    expect(computeAccessibleName(fs)).toBe("")
    expect(fs.firstElementChild?.tagName).toBe("P")
  })

  it("title も description も無ければ aria-describedby を付けない", () => {
    mount(
      <FormSection>
        <input aria-label="A" type="checkbox" />
      </FormSection>,
    )
    expect(section().hasAttribute("aria-describedby")).toBe(false)
    expect(section().querySelector("legend")).toBeNull()
  })
})
