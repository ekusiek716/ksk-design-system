import { describe, expect, it } from "vitest"
import { DataTableImageCell } from "../src/components/patterns/admin/data-table"

describe("DataTableImageCell props", () => {
  it("可視タイトルがあればaltを省略でき、無ければ明示を要求する", () => {
    const withVisibleTitle = <DataTableImageCell src="/product.png" title="商品" />
    const decorative = <DataTableImageCell src="/decoration.png" alt="" />
    const contentImage = <DataTableImageCell src="/chart.png" alt="売上推移グラフ" />

    // @ts-expect-error 可視タイトルが無い画像では装飾か内容画像かをaltで明示する
    const missingAlternative = <DataTableImageCell src="/unknown.png" />

    expect([withVisibleTitle, decorative, contentImage, missingAlternative]).toHaveLength(4)
  })
})
