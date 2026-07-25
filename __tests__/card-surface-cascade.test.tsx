/**
 * Card の背景を `--card-surface` のカスケードで切り替えられることを固定する。
 *
 * 背景（実測）: Card の既定背景は `--Surface-Primary`。`AppShell` /
 * `MarketingShell` のルートも同じ `--Surface-Primary` を敷いているため、
 * その直下の Card は**地と完全に同色**になり、区切りは罫線と
 * light の 8% shadow（`--shadow-md: 0 0 8px rgba(20,20,20,0.08)`）だけになる。
 * dark では地・カードとも #111827 で、暗い shadow はほぼ見えない。
 *
 * 対策として prop で 1 枚ずつ指定させると、あとからカードを足したときの
 * 付け忘れが型でもレビューでも検知できない。地を描く側が
 * `--card-surface` を宣言する形にして、指定なしで効くようにする。
 *
 * 実行: npm run test
 *
 * SSR 不使用: jsdom は var() のカスケードを解決しないため、
 * 「どのクラスが出力されるか」で固定する（実際の見えは Storybook で確認する）。
 */
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import * as React from "react"

import { Card } from "../src/components/ui/card"

function classOf(markup: string) {
  const raw = /class="([^"]*)"/.exec(markup)?.[1] ?? ""
  // SSR は `&` `<` `>` を実体参照で出すので、クラス名の比較のために戻す
  return raw.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
}

describe("Card の背景", () => {
  it("既定は --card-surface、フォールバックは従来どおり --Surface-Primary", () => {
    const cls = classOf(renderToStaticMarkup(<Card />))
    expect(cls).toContain("bg-[var(--card-surface,var(--Surface-Primary))]")
  })

  it("フォールバックを外していない（宣言が無い場所での見た目を変えない）", () => {
    // `bg-[var(--card-surface)]` だけにすると、宣言が無い文脈で背景が透明になる
    const cls = classOf(renderToStaticMarkup(<Card />))
    expect(cls).not.toMatch(/bg-\[var\(--card-surface\)\]/)
  })

  it("media バリアントでも背景の扱いは同じ", () => {
    const cls = classOf(renderToStaticMarkup(<Card variant="media" />))
    expect(cls).toContain("bg-[var(--card-surface,var(--Surface-Primary))]")
  })

  it("className の明示指定が後勝ちする（地に馴染ませたいときの逃げ道）", () => {
    const cls = classOf(
      renderToStaticMarkup(<Card className="bg-[var(--Surface-Secondary)]" />),
    )
    expect(cls).toContain("bg-[var(--Surface-Secondary)]")
    expect(cls).not.toContain("bg-[var(--card-surface,var(--Surface-Primary))]")
  })

  it("直下の子で --card-surface を initial に戻す（入れ子カードの潰れ防止）", () => {
    // これが無いと、外側の Card が受け取った値がそのまま内側の Card にも継承され、
    // 同色になって境界がまた消える
    const cls = classOf(renderToStaticMarkup(<Card />))
    expect(cls).toContain("[&>*]:[--card-surface:initial]")
  })

  it("罫線と影は残る（同色時の唯一の区切りなので落とさない）", () => {
    const cls = classOf(renderToStaticMarkup(<Card />))
    expect(cls).toContain("border-[var(--Border-Low-Emphasis)]")
    expect(cls).toContain("shadow-[var(--shadow-md)]")
  })
})

describe("Tailwind v4 が実際に CSS を生成する", () => {
  // クラス名だけを見るテストは「Tailwind が解釈できない記法」を見逃す。
  // `var(--x, fallback)` は arbitrary value の中にカンマが入るため、
  // 生成されない可能性を実コンパイルで潰しておく。
  it("bg-[var(--card-surface,var(--Surface-Primary))] と宣言側クラスが出力される", async () => {
    const { compile } = await import("tailwindcss")
    const { readFileSync } = await import("node:fs")
    const { createRequire } = await import("node:module")

    const compiled = await compile(`@import "tailwindcss";`, {
      base: process.cwd(),
      loadStylesheet: async (id: string, base: string) => {
        const require = createRequire(`${base}/`)
        const path = require.resolve(id === "tailwindcss" ? "tailwindcss/index.css" : id)
        return { path, base, content: readFileSync(path, "utf8") }
      },
    })

    const css = compiled.build([
      "bg-[var(--card-surface,var(--Surface-Primary))]",
      "[--card-surface:var(--Surface-Secondary)]",
      "[&>*]:[--card-surface:initial]",
    ])

    expect(css).toContain("background-color: var(--card-surface,var(--Surface-Primary))")
    expect(css).toContain("--card-surface: var(--Surface-Secondary)")
    // 子リセットが「セレクタ付きで」出力されること（自要素に付くと自分の背景まで戻る）
    expect(css).toMatch(/&>\*\s*\{\s*--card-surface: initial/)
  })
})
