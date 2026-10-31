import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import {
  findMissingAnimationCss,
  findSafelistCandidatesWithoutCss,
} from "../scripts/check-preset-classes.mjs"
import { buildConsumerCss } from "../scripts/lib/consumer-css.mjs"

/**
 * issue #827: consumer は README どおり `@import "tailwindcss"; @import "ksk-design-system/preset";`
 * だけを書く。tw-animate-css が Storybook 用の src/index.css にだけあったため、
 * DropdownMenu / Popover / Tooltip / Accordion の開閉アニメのクラスが consumer では 1 行も CSS にならなかった。
 * preset だけを入口にコンパイルし、開閉アニメのクラスと @keyframes が作られることを固定する。
 */
describe("consumer の preset だけで開閉アニメの CSS が作られる (#827)", () => {
  it("開閉アニメのクラスと @keyframes が consumer 入口で作られる", async () => {
    const { missingClasses, missingKeyframes } = await findMissingAnimationCss()
    expect(missingClasses).toEqual([])
    expect(missingKeyframes).toEqual([])
  })

  it("safelist に載っている候補はすべて consumer 入口で CSS になる", async () => {
    expect(await findSafelistCandidatesWithoutCss()).toEqual([])
  })

  it("比較用: 定義の無いクラスは検査が拾う（偽陽性で常に空にならない）", async () => {
    expect(await findSafelistCandidatesWithoutCss(["animate-spin", "ksk-no-such-utility-827"])).toEqual([
      "ksk-no-such-utility-827",
    ])
  })

  it("Accordion の高さアニメが Radix の高さ変数を使う", async () => {
    const css = await buildConsumerCss(["data-[state=open]:animate-accordion-down"])
    expect(css).toMatch(/@keyframes accordion-down/)
    expect(css).toMatch(/--radix-accordion-content-height/)
  })

  it("Storybook 用の入口に tw-animate-css を重複して置かない（consumer との差を作らない）", () => {
    const indexCss = readFileSync("src/index.css", "utf8")
    expect(indexCss).not.toMatch(/@import\s+["']tw-animate-css["']/)
    const presetCore = readFileSync("src/preset-core.css", "utf8")
    expect(presetCore).toMatch(/@import\s+["']tw-animate-css["']/)
  })
})
