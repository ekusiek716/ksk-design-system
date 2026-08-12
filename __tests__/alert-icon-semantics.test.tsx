/**
 * @vitest-environment jsdom
 *
 * Alert の variant アイコンが互いに見分けられること。
 *
 * 発端: iconsax の `Check` が名前に反して「小切手」のアイコンだった件（PR #349）を
 * 受けた全アイコンの棚卸し。iconsax には **"i" のグリフが 1 つも無く**、
 * `InfoCircle` / `Information` / `Danger` / `Warning2` はすべて感嘆符「!」を
 * 器（円 / 波形 / 三角 / 六角）だけ変えて描いたものだと判明した。
 *
 * info に `InfoCircle` を使うと warning と同じ「!」になり、両者の差が色と器の形
 * だけになる。DS は「色だけで意味を伝えない」方針（rules.json の a11y 要件）なので、
 * info は DS 自前の "i" アイコンを使う。
 *
 * ここでは「4 variant のアイコンの形がすべて異なること」を描画結果の path で固定する。
 * アイコン名では取り違えを検出できないため、必ず形で見る。
 *
 * 実行: npm run test
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { InfoCircle, Warning2 } from "iconsax-reactjs"

import { Alert } from "../src/components/ui/alert"
import { InfoCircleIcon } from "../src/components/icons/info-circle"

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

/** 与えた要素を描いて、SVG の path の d を連結した「形の指紋」を返す。 */
function shapeOf(ui: React.ReactElement): string {
  act(() => {
    root.render(ui)
  })
  return Array.from(container.querySelectorAll("svg path"))
    .map((p) => p.getAttribute("d") ?? "")
    .join("|")
}

const VARIANTS = ["success", "info", "error", "warning"] as const

describe("Alert の variant アイコン", () => {
  it("4 variant のアイコンの形がすべて異なる（色に頼らず区別できる）", () => {
    const shapes = VARIANTS.map((variant) => [
      variant,
      shapeOf(<Alert variant={variant} title="t" description="d" />),
    ] as const)
    for (const [variant, shape] of shapes) {
      expect(shape, `${variant} のアイコンが描かれていない`).not.toBe("")
    }
    const unique = new Set(shapes.map(([, shape]) => shape))
    expect(unique.size, `形が重複している: ${shapes.map(([v]) => v).join(", ")}`).toBe(
      VARIANTS.length
    )
  })

  it("info は感嘆符ではなく DS 自前の \"i\" を使う", () => {
    const info = shapeOf(<Alert variant="info" title="t" description="d" />)
    expect(info).toBe(shapeOf(<InfoCircleIcon size={20} />))
    // iconsax の InfoCircle（名前に反して「!」）は使わない
    expect(info).not.toBe(shapeOf(<InfoCircle size={20} />))
  })

  it("info と warning が同じ形にならない（どちらも「!」だった状態への退行防止）", () => {
    const info = shapeOf(<Alert variant="info" title="t" description="d" />)
    const warning = shapeOf(<Alert variant="warning" title="t" description="d" />)
    expect(info).not.toBe(warning)
    expect(warning).toBe(shapeOf(<Warning2 size={20} />))
  })
})

describe("InfoCircleIcon", () => {
  it("iconsax と同じ線幅・線端・viewBox（並べたとき太さが揃う）", () => {
    act(() => {
      root.render(<InfoCircleIcon />)
    })
    const svg = container.querySelector("svg")!
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24")
    expect(svg.getAttribute("fill")).toBe("none")
    const strokes = Array.from(svg.querySelectorAll("path")).map((p) => ({
      width: p.getAttribute("stroke-width"),
      cap: p.getAttribute("stroke-linecap"),
      color: p.getAttribute("stroke"),
    }))
    // 軸は 1.5 / 点は 2（iconsax InfoCircle と同じ構成）
    expect(strokes.map((s) => s.width)).toEqual(["1.5", "2"])
    expect(strokes.every((s) => s.cap === "round")).toBe(true)
    // currentColor 固定。色を持たせると消費側の文脈で浮く
    expect(strokes.every((s) => s.color === "currentColor")).toBe(true)
  })

  it("size prop で幅・高さを変えられる（iconsax と同じ API）", () => {
    act(() => {
      root.render(<InfoCircleIcon size={16} />)
    })
    const svg = container.querySelector("svg")!
    expect(svg.getAttribute("width")).toBe("16")
    expect(svg.getAttribute("height")).toBe("16")
  })
})
