/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { ListItem } from "../src/components/patterns/list-item"

// issue #668: rightSlot / leftSlot ラッパーへ className・幅の上限を渡せること。
const parse = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host.querySelector<HTMLElement>('[data-slot="list-item"]')!
}

describe("ListItem のスロット幅 API（#668）", () => {
  it("rightSlotClassName / leftSlotClassName はラッパーに既定の shrink-0 と並んで付く", () => {
    const row = parse(
      <ListItem title="t" leftSlot={<i>L</i>} rightSlot={<i>R</i>} leftSlotClassName="self-center" rightSlotClassName="max-w-[45%]" />,
    )
    const left = row.firstElementChild as HTMLElement
    const right = row.lastElementChild as HTMLElement
    expect(left.className).toBe("shrink-0 self-center")
    expect(right.className).toBe("shrink-0 max-w-[45%]")
  })

  it.each([
    ["narrow", "max-w-[33%]"],
    ["wide", "max-w-[50%]"],
  ] as const)("rightSlotWidth=%s は上限と min-w-0 を付ける", (width, cls) => {
    const right = parse(<ListItem title="t" rightSlot={<i>R</i>} rightSlotWidth={width} />).lastElementChild as HTMLElement
    expect(right.className.split(" ")).toEqual(expect.arrayContaining(["shrink-0", cls, "min-w-0"]))
  })

  it("未指定なら従来どおり shrink-0 だけ（後方互換）", () => {
    const right = parse(<ListItem title="t" rightSlot={<i>R</i>} />).lastElementChild as HTMLElement
    expect(right.className).toBe("shrink-0")
  })

  it("押せる行（onClick）でも同じラッパーに付く", () => {
    const row = parse(<ListItem title="t" onClick={() => {}} rightSlot={<i>R</i>} rightSlotWidth="wide" />)
    expect(row.tagName).toBe("BUTTON")
    expect((row.lastElementChild as HTMLElement).className).toContain("max-w-[50%]")
  })
})

describe("native ListItem の trailing 幅 API（#668）", () => {
  const source = readFileSync(join(__dirname, "..", "src/native/components/ListItem.tsx"), "utf8")
  it("Web と同じ語彙の trailingWidth と trailingStyle を持つ", () => {
    expect(source).toContain('export type ListItemSlotWidth = "auto" | "narrow" | "wide"')
    expect(source).toContain("trailingWidth?: ListItemSlotWidth")
    expect(source).toContain("trailingStyle?: StyleProp<ViewStyle>")
    expect(source).toMatch(/trailingWidth = "auto"/)
  })
  it("指定時だけ trailing を上限付きの View で包む（既定はラッパーを増やさない）", () => {
    expect(source).toContain('(trailingWidth !== "auto" || trailingStyle)')
    expect(source).toContain('maxWidth: trailingWidth === "narrow" ? "33%" : "50%"')
  })
})
