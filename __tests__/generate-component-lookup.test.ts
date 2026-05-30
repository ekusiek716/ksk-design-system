import { describe, it, expect } from "vitest"
// CLI スクリプトの純粋な抽出関数を直接テストする（run-guard により import では実行されない）。
import {
  extractCvaVariants,
  extractStoryNames,
  extractExports,
} from "../scripts/generate-component-lookup.mjs"

describe("extractCvaVariants", () => {
  it("[回帰] cva 第1引数がインライン（4スペース）でも variant を拾う", () => {
    const src = `
const priceVariants = cva("inline-flex gap-0.5 text-[var(--x)]", {
  variants: {
    size: {
      sm: "typo-label-md",
      md: "typo-label-lg",
      lg: "typo-heading-lg",
    },
  },
  defaultVariants: { size: "md" },
})`
    expect(extractCvaVariants(src)).toEqual([{ key: "size", values: ["sm", "md", "lg"] }])
  })

  it("[回帰] ハイフン付きクォートキー（inline-* / icon-*）を取りこぼさない", () => {
    const src = `
const alertVariants = cva("relative w-full", {
  variants: {
    variant: {
      success: "a",
      "inline-info": "b",
      "inline-warning": "c",
    },
  },
})`
    expect(extractCvaVariants(src)).toEqual([
      { key: "variant", values: ["success", "inline-info", "inline-warning"] },
    ])
  })

  it("[回帰] 同名 variant キーを持つ cva が2つあっても1つに dedup", () => {
    const src = `
const aVariants = cva("x", { variants: { variant: { a: "1", b: "2" } } })
const bVariants = cva("y", { variants: { variant: { a: "3", b: "4" } } })`
    const r = extractCvaVariants(src)
    expect(r).toHaveLength(1)
    expect(r[0]).toEqual({ key: "variant", values: ["a", "b"] })
  })

  it("配列 + .join(' ') 形式の値でもキーを取れる", () => {
    const src = `
const v = cva("base", {
  variants: {
    variant: {
      success: [
        "flex",
        "rounded",
      ].join(" "),
      info: "c",
    },
    size: { sm: "h-8", lg: "h-12" },
  },
})`
    expect(extractCvaVariants(src)).toEqual([
      { key: "variant", values: ["success", "info"] },
      { key: "size", values: ["sm", "lg"] },
    ])
  })

  it("variants ブロックの無い cva は空配列", () => {
    expect(extractCvaVariants(`const v = cva("just base classes")`)).toEqual([])
  })

  it("値の文字列に : が含まれてもキーと誤認しない（AST なので構造的に安全）", () => {
    const src = `const v = cva("x", { variants: { size: { sm: "hover:bg-x", lg: "h-12" } } })`
    expect(extractCvaVariants(src)).toEqual([{ key: "size", values: ["sm", "lg"] }])
  })
})

describe("extractStoryNames", () => {
  it("[回帰] name を持たない story が次の story の name を奪わない（Hero/Inverse 問題）", () => {
    const src = `
export const AllSizes: Story = {
  render: () => null,
}

export const Hero: Story = {
  args: { children: "x", size: "hero" },
}

export const InverseOnDark: Story = {
  name: "Inverse on Dark Background",
  render: () => null,
}`
    expect(extractStoryNames(src)).toEqual(["AllSizes", "Hero", "Inverse on Dark Background"])
  })
})

describe("extractExports", () => {
  it("named export と宣言 export を集約し、小文字は除外", () => {
    const src = `
export function Button() {}
export const buttonVariants = cva("x")
export { Card, CardHeader }
export type { ButtonProps }`
    expect(extractExports(src)).toEqual(["Card", "CardHeader", "Button"])
  })
})
