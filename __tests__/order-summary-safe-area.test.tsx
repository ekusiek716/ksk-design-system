/**
 * @vitest-environment jsdom
 *
 * OrderSummary fixed の safe-area（issue #832）。画面下に固定したときは、中身の下余白を
 * StickyActionBar と同じ `max(0.75rem, env(safe-area-inset-bottom))` にして、注文ボタンが
 * iPhone のホームインジケータに重ならないようにする。inline（fixed なし）は従来の `py-3` のまま。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { OrderSummary } from "../src/components/patterns/commerce/order-summary"

const SAFE_PB = "pb-[max(0.75rem,env(safe-area-inset-bottom))]"

const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

const contentOf = (el: HTMLElement) =>
  el.querySelector<HTMLElement>('[data-slot="order-summary"]')!.firstElementChild as HTMLElement

const classes = (node: HTMLElement) => node.className.split(/\s+/)

describe("OrderSummary safe-area（#832）", () => {
  it("fixed のとき、中身の下余白に safe-area を足す（上は pt-3 のまま）", () => {
    const el = host(<OrderSummary fixed totalValue="¥3,980" ctaLabel="注文を確定する" />)
    const content = contentOf(el)
    expect(classes(content)).toContain(SAFE_PB)
    expect(classes(content)).toContain("pt-3")
    // py-3 の下余白が後勝ちで残らないよう、py-3 自体は付けない
    expect(classes(content)).not.toContain("py-3")
    // 末尾の注文ボタンは、safe-area を足した中身の中にある
    expect(content.lastElementChild!.tagName).toBe("BUTTON")
  })

  it("fixed のとき、外側は従来どおり下端に固定するだけで safe-area は二重に足さない", () => {
    const el = host(<OrderSummary fixed totalValue="¥3,980" ctaLabel="注文を確定する" />)
    const root = el.querySelector<HTMLElement>('[data-slot="order-summary"]')!
    expect(classes(root)).toEqual(
      expect.arrayContaining(["fixed", "inset-x-0", "bottom-0", "z-[var(--Z-Sticky)]"])
    )
    expect(root.className).not.toContain("safe-area")
  })

  it("inline（fixed なし）は従来の py-3 のままで safe-area を足さない", () => {
    const el = host(<OrderSummary totalValue="¥3,980" ctaLabel="カートに進む" />)
    const content = contentOf(el)
    expect(content.className).toBe("space-y-3 px-4 py-3")
    expect(el.innerHTML).not.toContain("safe-area")
  })
})
