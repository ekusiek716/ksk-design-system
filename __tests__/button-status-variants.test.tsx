import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Button } from "../src/components/ui/button"
import { buttonVariants } from "../src/lib/server-variants/button-variants"

// issue #598: 状態色のボタン（info / warning / success）。
// 背景・文字・hover・active を semantic token で DS が持ち、consumer が背景色を上書きしなくて済むこと。
const root = join(__dirname, "..")
const STATUS = [
  ["info", "Info"],
  ["warning", "Warning"],
  ["success", "Success"],
] as const

const classesOf = (cls: string) => cls.split(/\s+/)

describe("Button の状態色 variant（#598）", () => {
  it.each(STATUS)("variant=%s は背景・文字・hover・active を semantic token で持つ", (variant, Token) => {
    const cls = classesOf(buttonVariants({ variant }))
    expect(cls).toContain(`bg-[var(--${Token}-Base)]`)
    expect(cls).toContain("text-[var(--Text-on-Inverse)]")
    expect(cls).toContain(`hover:bg-[var(--Hover-${Token}-Button)]`)
    expect(cls).toContain(`active:bg-[var(--Active-${Token}-Button)]`)
    expect(cls).toContain("rounded-[var(--Control-Radius)]")
    // focus ring と disabled は base と共通
    expect(cls).toContain("focus-visible:ring-[var(--Focus-High-Emphasis)]/50")
    expect(cls).toContain("disabled:opacity-50")
    // 生の色は使わない
    expect(cls.join(" ")).not.toMatch(/#[0-9a-f]{3,8}\b|bg-(blue|orange|amber|green|yellow)-\d/i)
  })

  it.each(STATUS)("variant=%s を data-variant に出す", (variant) => {
    expect(renderToStaticMarkup(<Button variant={variant}>x</Button>)).toContain(
      `data-variant="${variant}"`,
    )
  })

  it.each(STATUS)("variant=%s の hover / active トークンが light と dark の両方に定義されている", (_v, Token) => {
    const css = readFileSync(join(root, "src/styles/semantic.css"), "utf8")
    for (const name of [`--Hover-${Token}-Button`, `--Active-${Token}-Button`]) {
      const defs = css.match(new RegExp(`${name}:\\s*var\\(--Primitive-`, "g")) ?? []
      expect(defs.length, name).toBe(2)
    }
    const tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8")).colors
    const key = `${_v}-button`
    for (const mode of ["semantic", "semanticDark"] as const) {
      expect(tokens[mode].hover[key], `${mode}.hover.${key}`).toMatch(/^var\(--Primitive-/)
      expect(tokens[mode].active[key], `${mode}.active.${key}`).toMatch(/^var\(--Primitive-/)
    }
  })

  it("小さいサイズでは当たり判定拡張（#601）も付く", () => {
    expect(classesOf(buttonVariants({ variant: "warning", size: "sm" }))).toContain("before:min-h-11")
  })
})
