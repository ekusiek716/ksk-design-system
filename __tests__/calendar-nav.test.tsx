/**
 * Calendar — nav 構造の回帰防止
 *
 * issue #132 / PR #134 で、Calendar の月移動 nav を
 * 「全幅オーバーレイ(`pointer-events-none`) + 子ボタン(`pointer-events-auto`)」から
 * 「高さ 0 の配置基準 + 各ボタンを left-1 / right-1 の個別 absolute 配置」に変えた。
 *
 * 旧構造は consumer の Tailwind v4 `@source` スキャンが minified dist から
 * `pointer-events-auto` を拾えないと CSS ルールが生成されず、実クリックが
 * 背後要素に貫通して月移動が全滅する地雷だった（belle-todo で実発生）。
 *
 * ここでは SSR 出力を静的検査して、nav / 前月 / 次月ボタンの className に
 * `pointer-events-*` ユーティリティが再導入されていないことを保証する。
 * インタラクションの回帰（クリックで月が変わる）は calendar.stories.tsx の
 * play function 側で担保する。
 *
 * 実行: npm run test
 *
 * SSR 不使用: jsdom 不要・react-dom/server だけで検証できる範囲に絞る。
 */
import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import * as React from "react"
import { Calendar } from "../src/components/ui/calendar"

// 2026年7月固定でレンダリング（実行日に依存させない）
const FIXED_MONTH = new Date(2026, 6, 1)
const html = () =>
  renderToStaticMarkup(<Calendar mode="single" month={FIXED_MONTH} />)

describe("Calendar — nav の pointer-events 地雷 非再導入", () => {
  it("SSR 出力全体に pointer-events-none / pointer-events-auto を含まない", () => {
    const out = html()
    // 旧オーバーレイ構造の痕跡（consumer dist スキャン漏れで実クリック貫通する地雷）
    expect(out).not.toContain("pointer-events-none")
    expect(out).not.toContain("pointer-events-auto")
  })

  it("nav 要素は個別 absolute 配置基準（高さを持たない配置ラッパ）である", () => {
    const out = html()
    // nav は inset-x-0 の配置基準に残るが、pointer-events ユーティリティは持たない
    expect(out).toMatch(/<nav class="[^"]*absolute[^"]*inset-x-0[^"]*"/)
    expect(out).not.toMatch(/<nav class="[^"]*pointer-events-[^"]*"/)
  })

  it("前月 / 次月ボタンは left-1 / right-1 の absolute 配置で pointer-events を持たない", () => {
    const out = html()
    // 前の月へ
    expect(out).toMatch(
      /<button[^>]*class="[^"]*absolute[^"]*left-1[^"]*"[^>]*aria-label="前の月へ"/
    )
    // 次の月へ
    expect(out).toMatch(
      /<button[^>]*class="[^"]*absolute[^"]*right-1[^"]*"[^>]*aria-label="次の月へ"/
    )
  })
})

describe("Calendar — キャプション / 前後ボタンの SSR 存在保証", () => {
  it("月キャプションが表示される（2026年7月）", () => {
    const out = html()
    expect(out).toContain('data-slot="calendar"')
    expect(out).toContain("2026年7月")
  })

  it("前月 / 次月ボタンが aria-label 付きで出力される", () => {
    const out = html()
    expect(out).toContain('aria-label="前の月へ"')
    expect(out).toContain('aria-label="次の月へ"')
  })

  it("chevron アイコンが前後ボタン内に描画される（svg 2 個以上）", () => {
    const out = html()
    const svgCount = (out.match(/<svg/g) ?? []).length
    expect(svgCount).toBeGreaterThanOrEqual(2)
  })
})
