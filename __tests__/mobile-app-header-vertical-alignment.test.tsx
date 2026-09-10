/**
 * @vitest-environment jsdom
 */
/**
 * MobileAppHeader の verticalAlignment（issue #536 の Web 移植）。
 *
 * #536 は native の MobileAppHeader に、複数行 brand で右側 status/actions が
 * 見出し全体の中央へ下がってしまう問題を避けるための verticalAlignment を
 * 追加したが、Web 側には同名 prop が無いままだった。scripts/check-native-parity.mjs
 * の Part 2（own prop 名の diff）がこれを "Native-only props not on Web" として
 * 検出し、main の npm run check / CI を赤にしていた。
 *
 * Web にも同じ verticalAlignment を実装し、ヘッダー行全体の縦位置だけが
 * 切り替わり、status/actions 内部（バッジとボタン同士）は top 指定時も
 * 中央揃えのままであることを検証する。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { MobileAppHeader } from "../src/components/patterns/mobile-app-header"

function parse(markup: string) {
  const container = document.createElement("div")
  container.innerHTML = markup
  return container
}

function headerRow(markup: string) {
  return parse(markup).querySelector('[data-slot="mobile-app-header-brand"]')?.parentElement
}

describe("MobileAppHeader verticalAlignment (#536)", () => {
  it("既定値（未指定）はヘッダー行を items-center で描画する（後方互換）", () => {
    const row = headerRow(renderToStaticMarkup(<MobileAppHeader brand={<span>Brand</span>} />))

    expect(row?.getAttribute("class")).toContain("items-center")
    expect(row?.getAttribute("class")).not.toContain("items-start")
  })

  it('verticalAlignment="top" はヘッダー行を items-start で描画する', () => {
    const row = headerRow(
      renderToStaticMarkup(<MobileAppHeader brand={<span>Brand</span>} verticalAlignment="top" />),
    )

    expect(row?.getAttribute("class")).toContain("items-start")
    expect(row?.getAttribute("class")).not.toContain("items-center")
  })

  it('verticalAlignment="top" でも status/actions 内部は中央揃えのまま', () => {
    const markup = renderToStaticMarkup(
      <MobileAppHeader
        brand={<span>Brand</span>}
        verticalAlignment="top"
        status={<span>Status</span>}
        actions={<span>Actions</span>}
      />,
    )
    const statusActions = parse(markup).querySelector('[data-slot="mobile-app-header-status-actions"]')

    expect(statusActions?.getAttribute("class")).toContain("items-center")
  })
})
