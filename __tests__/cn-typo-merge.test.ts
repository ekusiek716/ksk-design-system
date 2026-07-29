import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { cn, TYPO_CLASS_NAMES } from "../src/lib/utils"

describe("cn() の typo-* マージ", () => {
  it("typo-label-sm と typo-label-md を渡すと typo-label-md のみ残る（後勝ち）", () => {
    expect(cn("typo-label-sm", "typo-label-md")).toBe("typo-label-md")
  })

  it("typo-heading-3xl と typo-body-sm のように分類を跨いでも後勝ちでマージされる", () => {
    expect(cn("typo-heading-3xl", "typo-body-sm")).toBe("typo-body-sm")
  })

  it("非 typo クラスの既存マージ挙動は変わらない（Tailwind 標準 classGroup は従来通り）", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
  })

  it("typo-* と非 typo クラスが混在しても、それぞれ独立にマージされる", () => {
    expect(cn("typo-label-sm text-[var(--Text-Low-Emphasis)]", "typo-label-md")).toBe(
      "text-[var(--Text-Low-Emphasis)] typo-label-md",
    )
  })

  it("条件付きの偽値やundefinedは無視される（clsx の既存挙動）", () => {
    expect(cn("flex", false && "hidden", undefined, "gap-2")).toBe("flex gap-2")
  })

  it("TYPO_CLASS_NAMES が typography.css の @utility typo-* 定義とドリフトしていない", () => {
    const css = readFileSync(join(__dirname, "../src/styles/typography.css"), "utf8")
    const found = [...css.matchAll(/@utility\s+(typo-[a-z0-9-]+)\s*\{/g)].map((m) => m[1])

    expect(found.length).toBeGreaterThan(0)
    expect(new Set(found)).toEqual(new Set(TYPO_CLASS_NAMES))
  })
})
