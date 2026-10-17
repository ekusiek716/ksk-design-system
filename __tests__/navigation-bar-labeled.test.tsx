/**
 * NavigationBar leftLabelVisible と DetailSheetHeader の空の leading（issue #729）。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { NavigationBar } from "../src/components/ui/navigation-bar"
import { DetailSheetHeader } from "../src/components/patterns/detail-sheet-scaffold"

describe("NavigationBar leftLabelVisible (#729)", () => {
  it("既定はアイコンだけ（icon-xl + aria-label・タイトルは px-16）", () => {
    const html = renderToStaticMarkup(<NavigationBar title="設定" onLeft={() => {}} leftLabel="メニューに戻る" />)
    expect(html).toContain('aria-label="メニューに戻る"')
    expect(html).toContain('data-size="icon-xl"')
    expect(html).toContain("px-16")
    expect(html).not.toContain("data-label-visible")
  })

  it("leftLabelVisible で文字を表示し、名前は見える文字から取る", () => {
    const html = renderToStaticMarkup(
      <NavigationBar title="設定" onLeft={() => {}} leftLabel="メニューに戻る" leftLabelVisible />
    )
    expect(html).toContain("data-label-visible")
    // 省略されても全文が分かるよう title を付ける
    expect(html).toContain('<span class="min-w-0 truncate" title="メニューに戻る">メニューに戻る</span>')
    expect(html).not.toContain('aria-label="メニューに戻る"')
    expect(html).toContain("h-11")
    // title あり: 上限 160px（max-w-40）と、同じ幅の中央タイトル余白（issue #732）
    expect(html).toContain("max-w-40")
    expect(html).toContain("px-[calc(0.75rem_+_10rem_+_0.5rem)]")
    // title なし／空: 上限なし
    for (const t of [undefined, ""]) {
      const h = renderToStaticMarkup(<NavigationBar title={t} onLeft={() => {}} leftLabel="メニューに戻る" leftLabelVisible />)
      expect(h).toContain("max-w-full")
      expect(h).not.toContain("max-w-40")
    }
    // 未指定の既定は不変（アイコンのみ・余白 px-16）
    const def = renderToStaticMarkup(<NavigationBar title="設定" onLeft={() => {}} />)
    expect(def).not.toContain("data-label-visible")
    expect(def).toContain("px-16")
    // leftLabel 無しは既定の文言（閉じる）
    expect(renderToStaticMarkup(<NavigationBar leftIcon="close" onLeft={() => {}} leftLabelVisible />)).toContain(">閉じる</span>")
  })
})

describe("DetailSheetHeader の空の leading (#729)", () => {
  it("leading 無しは左の列を描かず 2 列の grid", () => {
    const html = renderToStaticMarkup(<DetailSheetHeader title="x" />)
    expect(html).not.toContain("detail-sheet-header-leading")
    expect(html).toContain("grid-cols-[minmax(0,1fr)_auto]")
    expect(renderToStaticMarkup(<DetailSheetHeader title="x" leading={false} />)).not.toContain("detail-sheet-header-leading")
  })

  it("leading ありは従来どおり 3 列", () => {
    const html = renderToStaticMarkup(<DetailSheetHeader title="x" leading={<span>戻</span>} />)
    expect(html).toContain('data-slot="detail-sheet-header-leading"')
    expect(html).toContain("grid-cols-[auto_minmax(0,1fr)_auto]")
  })
})
