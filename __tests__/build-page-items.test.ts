import { describe, expect, it } from "vitest"

import { buildPageItems } from "../src/lib/build-page-items"

/**
 * ページ番号 + 省略記号の並びを組み立てる純粋関数（issue #357）。
 * `Pagination` の消費側が手書きしがちな畳み込みロジックを DS 側で固定する。
 */
describe("buildPageItems", () => {
  it("総ページ数が少なければ全ページを並べる", () => {
    expect(buildPageItems(1, 1)).toEqual([1])
    expect(buildPageItems(3, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it("先頭付近では末尾側だけを畳む", () => {
    expect(buildPageItems(1, 10)).toEqual([1, 2, "ellipsis", 10])
    expect(buildPageItems(3, 10)).toEqual([1, 2, 3, 4, "ellipsis", 10])
  })

  it("末尾付近では先頭側だけを畳む", () => {
    expect(buildPageItems(10, 10)).toEqual([1, "ellipsis", 9, 10])
    expect(buildPageItems(8, 10)).toEqual([1, "ellipsis", 7, 8, 9, 10])
  })

  it("中間では両側を畳む", () => {
    expect(buildPageItems(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10])
  })

  it("隙間が1ページだけなら省略記号ではなくページ番号を見せる", () => {
    // 現在4 / 全10: 先頭側の隙間は2のみ → "ellipsis" ではなく2を出す
    expect(buildPageItems(4, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis", 10])
    // 現在7 / 全10: 末尾側の隙間は9のみ
    expect(buildPageItems(7, 10)).toEqual([1, "ellipsis", 6, 7, 8, 9, 10])
  })

  it("siblingCount で現在ページの前後の表示数を変えられる", () => {
    expect(buildPageItems(5, 20, { siblingCount: 0 })).toEqual([1, "ellipsis", 5, "ellipsis", 20])
    expect(buildPageItems(10, 20, { siblingCount: 2 })).toEqual([
      1,
      "ellipsis",
      8,
      9,
      10,
      11,
      12,
      "ellipsis",
      20,
    ])
  })

  it("範囲外の入力でも描画できる並びへ丸める", () => {
    expect(buildPageItems(1, 0)).toEqual([])
    expect(buildPageItems(1, -3)).toEqual([])
    expect(buildPageItems(0, 5)).toEqual(buildPageItems(1, 5)) // page < 1 は 1 扱い
    expect(buildPageItems(99, 5)).toEqual(buildPageItems(5, 5)) // page > pageCount は末尾扱い
    expect(buildPageItems(3, 10, { siblingCount: -1 })).toEqual([1, 2, 3, "ellipsis", 10])
  })

  it("常に昇順で、番号が重複しない", () => {
    for (let total = 1; total <= 25; total += 1) {
      for (let page = 1; page <= total; page += 1) {
        const numbers = buildPageItems(page, total).filter(
          (item): item is number => typeof item === "number"
        )
        expect(new Set(numbers).size).toBe(numbers.length)
        expect([...numbers].sort((a, b) => a - b)).toEqual(numbers)
        expect(numbers).toContain(page)
        expect(numbers[0]).toBe(1)
        expect(numbers.at(-1)).toBe(total)
      }
    }
  })
})
