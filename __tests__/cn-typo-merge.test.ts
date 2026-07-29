import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { cn, TYPO_ADDITIVE_CLASS_NAMES, TYPO_PRESET_CLASS_NAMES } from "../src/lib/utils"

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
    const isHidden = Boolean(0)
    expect(cn("flex", isHidden && "hidden", undefined, "gap-2")).toBe("flex gap-2")
  })

  it("typo-on-image は加算系のため、プリセット系 typo-* と併用しても両方残る（PhotoHero 等）", () => {
    expect(cn("typo-label-sm", "typo-on-image")).toBe("typo-label-sm typo-on-image")
  })

  it("typo-on-image 同士は twMerge が関知しないため両方残る（重複指定は呼び出し側の責務）", () => {
    expect(cn("typo-on-image", "typo-on-image")).toBe("typo-on-image typo-on-image")
  })

  it("TYPO_PRESET_CLASS_NAMES が typography.css のプリセット系 @utility typo-* 定義とドリフトしていない", () => {
    const css = readFileSync(join(__dirname, "../src/styles/typography.css"), "utf8")
    const blocks = [...css.matchAll(/@utility\s+(typo-[a-z0-9-]+)\s*\{([^}]*)\}/g)]

    expect(blocks.length).toBeGreaterThan(0)

    // プリセット系 = font-size を定義する typo-*（サイズ/行間/ウェイトの完全プリセット）。
    // 加算系（typo-on-image 等）は font-size を持たず、ここでは除外する。
    const presetNames = blocks.filter(([, , body]) => /font-size\s*:/.test(body)).map(([, name]) => name)
    const additiveNames = blocks.filter(([, , body]) => !/font-size\s*:/.test(body)).map(([, name]) => name)

    expect(new Set(presetNames)).toEqual(new Set(TYPO_PRESET_CLASS_NAMES))
    expect(new Set(additiveNames)).toEqual(new Set(TYPO_ADDITIVE_CLASS_NAMES))
  })
})
