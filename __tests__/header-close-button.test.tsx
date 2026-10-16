/**
 * DetailSheetHeader / DialogHeader の onClose・closeLabel（issue #722）。
 * onClose を渡したときだけ DS の閉じるボタンを出し、渡さないときの DOM は従来どおり。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { DetailSheetHeader } from "../src/components/patterns/detail-sheet-scaffold"
import { DialogHeader } from "../src/components/ui/dialog"
import { KskLabelsProvider } from "../src/components/ui/ksk-labels"

const noop = () => {}

describe("DetailSheetHeader onClose", () => {
  it("onClose 無しは閉じるボタンを出さない（従来の DOM）", () => {
    const html = renderToStaticMarkup(<DetailSheetHeader title="詳細" trailing={<span>t</span>} />)
    expect(html).not.toContain("detail-sheet-header-close")
    expect(html).toContain('<div data-slot="detail-sheet-header-trailing" class="flex min-h-10 shrink-0 items-center justify-end gap-1"><span>t</span></div>')
  })

  it("onClose で trailing の末尾に 40px の閉じるボタン（既定「閉じる」）", () => {
    const html = renderToStaticMarkup(<DetailSheetHeader title="詳細" trailing={<span>t</span>} onClose={noop} />)
    expect(html).toMatch(/<span>t<\/span><button[^>]*data-slot="detail-sheet-header-close"/)
    expect(html).toContain('aria-label="閉じる"')
    expect(html).toContain('data-size="icon"')
    // 当たり判定は 44px（透明な before）
    expect(html).toContain("before:min-h-11 before:min-w-11")
  })

  it("closeLabel > KskLabelsProvider の close", () => {
    expect(renderToStaticMarkup(<DetailSheetHeader title="x" onClose={noop} closeLabel="シートを閉じる" />)).toContain(
      'aria-label="シートを閉じる"'
    )
    expect(
      renderToStaticMarkup(
        <KskLabelsProvider locale="en">
          <DetailSheetHeader title="x" onClose={noop} />
        </KskLabelsProvider>
      )
    ).toContain('aria-label="Close"')
  })
})

describe("DialogHeader onClose", () => {
  it("bar + onClose で右端に 48px の閉じるボタン", () => {
    const html = renderToStaticMarkup(
      <DialogHeader variant="bar" onClose={noop}>
        <h2>見出し</h2>
      </DialogHeader>
    )
    expect(html).toContain('data-slot="dialog-header-trailing"')
    expect(html).toContain('data-slot="dialog-header-close"')
    expect(html).toContain('data-size="icon-lg"')
    expect(html).toContain("before:min-h-11 before:min-w-11")
    expect(html).toContain('aria-label="閉じる"')
  })

  it("trailing と併用すると trailing の後ろに閉じるボタン", () => {
    const html = renderToStaticMarkup(
      <DialogHeader variant="bar" trailing={<span>操作</span>} onClose={noop}>
        <h2>見出し</h2>
      </DialogHeader>
    )
    expect(html).toMatch(/<span>操作<\/span><button[^>]*data-slot="dialog-header-close"/)
  })

  it("stack では onClose を無視し、onClose 無しの bar は従来の DOM", () => {
    expect(renderToStaticMarkup(<DialogHeader onClose={noop}>x</DialogHeader>)).not.toContain("dialog-header-close")
    const html = renderToStaticMarkup(
      <DialogHeader variant="bar" trailing={<span>t</span>}>
        x
      </DialogHeader>
    )
    expect(html).not.toContain("dialog-header-close")
    expect(html).toContain('<div data-slot="dialog-header-trailing" class="flex shrink-0 items-center gap-2"><span>t</span></div>')
  })
})
