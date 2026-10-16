/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Highlight, splitHighlight } from "../src/components/ui/highlight"

// issue #692: 検索一致のハイライト。
describe("Highlight（#692）", () => {
  it("一致部分を mark で囲み、専用トークンの面と文字色を使う", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(<Highlight text="前撮りの衣装と前撮りの日程" query="前撮り" />)
    const marks = host.querySelectorAll('mark[data-slot="highlight-mark"]')
    expect(marks.length).toBe(2)
    expect(marks[0].className).toContain("bg-[var(--Surface-Highlight)]")
    expect(marks[0].className).toContain("text-[var(--Text-on-Highlight)]")
    expect(host.textContent).toBe("前撮りの衣装と前撮りの日程")
  })
  it("大文字小文字を既定で区別せず、caseSensitive で区別する", () => {
    expect(splitHighlight("Tea tea", "TEA").filter((p) => p.match).length).toBe(2)
    expect(splitHighlight("Tea tea", "tea", true).filter((p) => p.match).map((p) => p.text)).toEqual(["tea"])
  })
  it("正規表現の特殊文字は文字として扱い、空の検索語は強調しない", () => {
    expect(splitHighlight("予算 (税込) です", "(税込)").filter((p) => p.match).map((p) => p.text)).toEqual(["(税込)"])
    expect(splitHighlight("abc", "  ")).toEqual([{ text: "abc", match: false }])
    expect(splitHighlight("a.c abc", ".").filter((p) => p.match).map((p) => p.text)).toEqual(["."])
  })
  it("一致判定は正規表現の i フラグ（toLowerCase 比較に頼らない）", () => {
    // "İ"（U+0130）は toLowerCase で 2 文字になり、比較方式だと判定がずれる
    const parts = splitHighlight("İstanbul istanbul", "istanbul")
    expect(parts.filter((p) => p.match).map((p) => p.text)).toEqual(["istanbul"])
    expect(parts.map((p) => p.text).join("")).toBe("İstanbul istanbul")
  })
})
