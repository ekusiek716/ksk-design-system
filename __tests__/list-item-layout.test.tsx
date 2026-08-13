import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { ListItem } from "../src/components/patterns/list-item"

/**
 * issue #355: ListItem に align / density / footerSlot を追加した際の回帰テスト。
 *
 * 最重要なのは「新 prop を1つも指定しなければ従来と 1 クラスも変わらない DOM を
 * 出す」こと。下の BASELINE_* は追加前（v1.56.0 / origin/main）の実装が実際に
 * 出力していた文字列をそのまま固定している。ここが変わる差分は、既存 consumer の
 * CSS を壊す可能性があるので、意図的な変更でない限り通してはいけない。
 */
const BASELINE_ROOT =
  "flex w-full items-start gap-3 border-b border-[var(--Border-Low-Emphasis)] px-4 py-3 text-left"
const BASELINE_ACTIONABLE_SUFFIX =
  " cursor-pointer transition-colors hover:bg-[var(--Surface-Secondary)]" +
  " min-h-11 focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50"

describe("ListItem 既定値の非破壊性 (issue #355)", () => {
  it("静的行は従来どおりのルート class / 構造を出力する", () => {
    const output = renderToStaticMarkup(<ListItem title="t" />)
    expect(output).toBe(
      `<div data-slot="list-item" data-variant="default" class="${BASELINE_ROOT}">` +
        `<div class="flex-1 min-w-0">` +
        `<p class="typo-label-md truncate text-[var(--Text-High-Emphasis)]">t</p>` +
        `</div></div>`,
    )
  })

  it("操作可能な行は従来どおり min-h-11 とフォーカスリングを持つ", () => {
    const output = renderToStaticMarkup(<ListItem title="t" onClick={() => {}} />)
    expect(output).toContain(`class="${BASELINE_ROOT}${BASELINE_ACTIONABLE_SUFFIX}"`)
  })

  it("footerSlot 未指定なら行を包むラッパ要素を増やさない", () => {
    const output = renderToStaticMarkup(
      <ListItem title="t" leftSlot={<span>L</span>} rightSlot={<span>R</span>} />,
    )
    // leftSlot / 本文 / rightSlot がルートの直下に並ぶ（中間 div が無い）
    expect(output).toBe(
      `<div data-slot="list-item" data-variant="default" class="${BASELINE_ROOT}">` +
        `<div class="shrink-0"><span>L</span></div>` +
        `<div class="flex-1 min-w-0">` +
        `<p class="typo-label-md truncate text-[var(--Text-High-Emphasis)]">t</p>` +
        `</div>` +
        `<div class="shrink-0"><span>R</span></div></div>`,
    )
  })

  it("bottomSlot は従来どおり title 列の内側に入る", () => {
    const output = renderToStaticMarkup(
      <ListItem title="t" leftSlot={<span>L</span>} bottomSlot={<span>B</span>} />,
    )
    expect(output).toContain(
      `<div class="flex-1 min-w-0">` +
        `<p class="typo-label-md truncate text-[var(--Text-High-Emphasis)]">t</p>` +
        `<div class="mt-2"><span>B</span></div></div>`,
    )
  })

  it("align='start' / density='comfortable' の明示指定は既定と同じ出力になる", () => {
    expect(
      renderToStaticMarkup(<ListItem title="t" align="start" density="comfortable" />),
    ).toBe(renderToStaticMarkup(<ListItem title="t" />))
  })
})

describe("ListItem align='center' (issue #355 / MoreFeatures の中央寄せ CTA 行)", () => {
  it("行を水平中央に寄せ、テキストも中央寄せにする", () => {
    const output = renderToStaticMarkup(
      <ListItem title="設定" align="center" leftSlot={<span>i</span>} onClick={() => {}} />,
    )
    expect(output).toContain("justify-center")
    expect(output).toContain("text-center")
    expect(output).toContain("items-center")
    expect(output).not.toContain("items-start")
    expect(output).not.toContain("text-left")
  })

  it("本文列を flex-1 で伸ばさない（伸ばすとアイコンが左端へ寄る）", () => {
    const output = renderToStaticMarkup(
      <ListItem title="設定" align="center" leftSlot={<span>i</span>} />,
    )
    expect(output).toContain(`<div class="min-w-0">`)
    expect(output).not.toContain("flex-1")
  })
})

describe("ListItem density='compact' (issue #355 / AdminConsole の 20px 行)", () => {
  it("padding を詰め、タップ可能でも min-h-11 を付けない", () => {
    const output = renderToStaticMarkup(
      <ListItem title="t" density="compact" onClick={() => {}} />,
    )
    expect(output).toContain("px-3 py-1")
    expect(output).not.toContain("px-4 py-3")
    expect(output).not.toContain("min-h-11")
    // フォーカスリングは密度に関係なく維持する
    expect(output).toContain("focus-visible:ring-[3px]")
  })

  it("区切り線は density の責務ではなく className='border-b-0' で消す", () => {
    const output = renderToStaticMarkup(
      <ListItem title="t" density="compact" className="border-b-0" />,
    )
    expect(output).toContain("border-b-0")
    expect(output).not.toContain("border-b ")
  })
})

describe("ListItem footerSlot (issue #355 / CoupleCard の全幅進捗バー)", () => {
  it("leftSlot の幅にインデントされず、行の外側・全幅に置かれる", () => {
    const output = renderToStaticMarkup(
      <ListItem title="t" leftSlot={<span>A</span>} footerSlot={<span>F</span>} />,
    )
    expect(output).toContain("flex-col")
    // 行はひとつの内側 div にまとまり、footer はその兄弟として全幅で並ぶ
    expect(output).toContain(`<div class="flex w-full items-start gap-3">`)
    expect(output).toContain(`</div><div class="mt-2 w-full"><span>F</span></div></div>`)
  })

  it("bottomSlot と併用でき、bottomSlot は title 列の内側のまま", () => {
    const output = renderToStaticMarkup(
      <ListItem
        title="t"
        leftSlot={<span>A</span>}
        bottomSlot={<span>B</span>}
        footerSlot={<span>F</span>}
      />,
    )
    expect(output).toContain(`<div class="mt-2"><span>B</span></div></div>`)
    expect(output).toContain(`<div class="mt-2 w-full"><span>F</span></div>`)
  })
})
