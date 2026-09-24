/**
 * @vitest-environment jsdom
 *
 * ActionTile の選択インジケータ。
 *
 * iconsax の `Check` は名前に反して「小切手（checkbook）」のアイコンで、
 * チェックマークではない。選択済みの印として使うと、実機で意味の通らない
 * 記号が出る（実際に出荷直前まで残っていた）。既定は Checkbox と同じ枠なし tick。
 *
 * 名前だけでは取り違えに気づけないため、描画された SVG の形（path）で固定する。
 *
 * 実行: npm run test
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { Check } from "iconsax-reactjs"

import { ActionTile } from "../src/components/patterns/quick-action-grid"

let container: HTMLElement
let root: Root

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

function mount(ui: React.ReactElement) {
  act(() => {
    root.render(ui)
  })
}

/** 参照アイコンを単体で描いて、その path の d を集めたもの。 */
function pathsOf(icon: React.ReactElement): string[] {
  const probe = document.createElement("div")
  document.body.appendChild(probe)
  const probeRoot = createRoot(probe)
  act(() => {
    probeRoot.render(icon)
  })
  const ds = Array.from(probe.querySelectorAll("path")).map((p) => p.getAttribute("d") ?? "")
  act(() => {
    probeRoot.unmount()
  })
  probe.remove()
  return ds
}

function tilePaths(): string[] {
  return Array.from(container.querySelectorAll("svg path")).map((p) => p.getAttribute("d") ?? "")
}

describe("ActionTile の選択インジケータ", () => {
  it("選択済みでは枠なし tick だけを描く", () => {
    mount(<ActionTile label="転職のため" selected />)
    expect(tilePaths()).toEqual(["M10 3L4.5 8.5L2 6"])
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("viewBox")).toBe("0 0 12 12")
    expect(svg?.children.length).toBe(1)
    expect(svg?.getAttribute("aria-hidden")).toBe("true")
  })

  it("iconsax の Check（小切手アイコン）は使わない", () => {
    mount(<ActionTile label="転職のため" selected />)
    const drawn = tilePaths()
    const checkbook = pathsOf(<Check size={16} />)
    expect(drawn).not.toEqual(checkbook)
    // 1本でも小切手アイコンの path を含んでいたら取り違えている
    for (const d of checkbook) {
      expect(drawn).not.toContain(d)
    }
  })

  it("未選択ではインジケータを描かない", () => {
    mount(<ActionTile label="転職のため" />)
    expect(tilePaths()).toEqual([])
  })

  it("indicator を明示したときは既定のチェックを描かない", () => {
    mount(<ActionTile label="転職のため" selected indicator="3件" />)
    expect(tilePaths()).toEqual([])
    expect(container.textContent).toContain("3件")
  })

  it("loading は選択インジケータと override より優先する", () => {
    mount(<ActionTile label="転職のため" selected loading indicator="3件" />)
    expect(tilePaths()).toEqual([])
    expect(container.textContent).not.toContain("3件")
    expect(container.querySelector('[data-slot="spinner"]')?.getAttribute("aria-label")).toBe("処理中")
    expect(container.querySelector("button")?.getAttribute("aria-pressed")).toBe("true")
  })

  it("ラベル行は縦中央揃え（インジケータが上に浮かない）", () => {
    mount(<ActionTile label="転職のため" selected />)
    const row = container.querySelector<HTMLElement>('[data-slot="action-tile"] > span')
    expect(row?.className).toContain("items-center")
    expect(row?.className).not.toContain("items-start")
  })
})
