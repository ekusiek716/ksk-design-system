/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { ActionTile } from "../src/components/patterns/quick-action-grid"

// issue #670: ActionTile に大きな画像・イラスト・色見本を置く media スロット。
const parse = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host.querySelector<HTMLElement>('[data-slot="action-tile"]')!
}
const Img = () => <img src="x.png" alt="" />

describe("ActionTile の media（#670）", () => {
  it("既定は top・md で、ラベル行の上に aria-hidden で置く", () => {
    const tile = parse(<ActionTile label="メモ" media={<Img />} />)
    expect(tile.dataset.mediaPosition).toBe("top")
    const media = tile.querySelector<HTMLElement>('[data-slot="action-tile-media"]')!
    expect(media.getAttribute("aria-hidden")).toBe("true")
    expect(media.className).toContain("w-16")
    expect(media.className).toContain("aspect-square")
    expect(media.className).toContain("max-w-full")
    // ラベル行より前（上）
    expect(tile.firstElementChild!.contains(media)).toBe(true)
    expect(tile.firstElementChild!.textContent).toBe("")
  })

  it.each([
    ["sm", "w-10"],
    ["md", "w-16"],
    ["lg", "w-32"],
  ] as const)("mediaSize=%s は %s", (size, cls) => {
    const media = parse(<ActionTile label="x" media={<Img />} mediaSize={size} />).querySelector('[data-slot="action-tile-media"]')!
    expect(media.className).toContain(cls)
  })

  it("start はラベルと同じ行の左に置き、選択チェックと重ならない（チェックは行の右端）", () => {
    const tile = parse(<ActionTile label="ローズ" media={<i />} mediaPosition="start" selected />)
    const media = tile.querySelector('[data-slot="action-tile-media"]')!
    const labelRow = tile.firstElementChild!
    expect(labelRow.firstElementChild!.firstElementChild).toBe(media)
    // 選択チェック（SemanticIcon）は行の右端の兄弟
    expect(labelRow.lastElementChild!.querySelector("svg")).not.toBeNull()
    expect(labelRow.lastElementChild!.contains(media)).toBe(false)
  })

  it("end はタイルを横並びにし、本文の列の右に置く", () => {
    const tile = parse(<ActionTile label="横長" description="説明" media={<i />} mediaPosition="end" />)
    expect(tile.className).toContain("flex-row")
    expect(tile.lastElementChild!.getAttribute("data-slot")).toBe("action-tile-media")
    expect(tile.firstElementChild!.textContent).toContain("説明")
  })

  it("media 未指定なら従来と同じ DOM（後方互換）", () => {
    const html = renderToStaticMarkup(<ActionTile label="メモ" description="d" />)
    expect(html).not.toContain("action-tile-media")
    expect(html).not.toContain("data-media-position")
    expect(html).not.toContain("flex-row")
  })
})

describe("native ActionTile の media（#670）", () => {
  const source = readFileSync(join(__dirname, "..", "src/native/components/QuickActionGrid.tsx"), "utf8")
  it("Web と同じ語彙と寸法を持ち、読み上げから外す", () => {
    expect(source).toContain('export type ActionTileMediaPosition = "top" | "start" | "end"')
    expect(source).toContain("{ sm: 40, md: 64, lg: 128 }")
    expect(source).toContain('importantForAccessibility="no-hide-descendants"')
  })
})
