/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { FeatureComparisonTable } from "../src/components/patterns/feature-comparison-table"

// issue #687: 比較表の意味付け（table / th scope / ✓ — の読み上げ文言）。
const host = document.createElement("div")
host.innerHTML = renderToStaticMarkup(
  <FeatureComparisonTable
    caption="Free と Plus の機能比較"
    columns={[{ key: "free", label: "Free" }, { key: "plus", label: "Plus", highlight: true }]}
    rows={[
      { label: "共有", values: { free: false, plus: true } },
      { label: "テンプレート", values: { free: "80 件", plus: "153 件" } },
    ]}
  />,
)
const table = host.querySelector("table")!

describe("FeatureComparisonTable（#687）", () => {
  it("table + caption + 列見出し th[scope=col] + 行見出し th[scope=row]", () => {
    expect(table.querySelector("caption")?.textContent).toBe("Free と Plus の機能比較")
    expect(Array.from(table.querySelectorAll('thead th[scope="col"]')).map((t) => t.textContent)).toEqual(["機能", "Free", "Plus"])
    expect(Array.from(table.querySelectorAll('tbody th[scope="row"]')).map((t) => t.textContent)).toEqual(["共有", "テンプレート"])
  })
  it("✓ / — は装飾で、読み上げ文言（利用できる / 利用できない）を持つ", () => {
    const [free, plus] = Array.from(table.querySelectorAll("tbody tr:first-child td"))
    expect(free.textContent).toContain("利用できない")
    expect(free.querySelector('[aria-hidden="true"]')?.textContent).toBe("—")
    expect(plus.textContent).toContain("利用できる")
    expect(plus.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
  })
  it("文字の値はそのまま出し、highlight 列は淡いアクセント面", () => {
    const cells = Array.from(table.querySelectorAll("tbody tr:last-child td"))
    expect(cells.map((c) => c.textContent)).toEqual(["80 件", "153 件"])
    expect(cells[1].className).toContain("bg-[var(--Surface-Accent-Primary-Light)]")
    expect(cells[0].className).not.toContain("Surface-Accent")
  })
  it("native は各行を 1 つの読み上げ要素にまとめる", () => {
    const src = readFileSync(join(__dirname, "..", "src/native/components/FeatureComparisonTable.tsx"), "utf8")
    expect(src).toContain("accessible")
    expect(src).toContain('join("、")')
  })
})
