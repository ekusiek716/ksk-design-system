/**
 * ProgressRing のサイズ・ストローク・配色カスタマイズ（issue #480）を固定する。
 *
 * 背景: 消費側プロダクト（タビパル）の自前カウントダウンリング（88×88px /
 * ストローク 6.9px / トラック Brand-100 相当 / 進捗 Brand-600 相当）は、
 * プリセット4種と固定色しか無かった旧 API では視覚同一に置換できなかった。
 *
 * jsdom は var() を解決しないため、SVG に出力される幾何値と stroke 文字列で固定する
 * （実際の見えは Storybook の CustomSizeAndStroke / CustomColors で確認する）。
 */
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { ProgressRing } from "../src/components/ui/progress-ring"

/** `<circle>` の属性を素朴に取り出す。[track, progress] の順で返る。 */
function circles(html: string) {
  return [...html.matchAll(/<circle\b[^>]*>/g)].map((m) => {
    const tag = m[0]
    const attr = (name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]
    return { r: Number(attr("r")), strokeWidth: Number(attr("stroke-width")), stroke: attr("stroke") }
  })
}

describe("ProgressRing のカスタマイズ", () => {
  it("プリセットの幾何値は従来どおり（sm/md/lg/xl の回帰固定）", () => {
    const expected: Record<string, { px: number; stroke: number }> = {
      sm: { px: 32, stroke: 3 },
      md: { px: 48, stroke: 4 },
      lg: { px: 64, stroke: 5 },
      xl: { px: 96, stroke: 6 },
    }
    for (const [size, { px, stroke }] of Object.entries(expected)) {
      const html = renderToStaticMarkup(<ProgressRing value={50} size={size as "sm"} />)
      const [track] = circles(html)
      expect(track.strokeWidth).toBe(stroke)
      expect(track.r).toBeCloseTo((px - stroke) / 2, 5)
      expect(html).toContain(`width="${px}"`)
    }
  })

  it("size に px 数値を渡すとその径で描画される", () => {
    const html = renderToStaticMarkup(<ProgressRing value={50} size={88} />)
    expect(html).toContain('width="88"')
    expect(html).toContain('height="88"')
  })

  it("数値 size の既定ストロークはプリセット表の線形補間（88px → 5.75）", () => {
    const [track] = circles(renderToStaticMarkup(<ProgressRing value={50} size={88} />))
    expect(track.strokeWidth).toBeCloseTo(5.75, 5)
  })

  it("strokeWidth は小数も含めてそのまま反映される", () => {
    const [track] = circles(renderToStaticMarkup(<ProgressRing value={50} size={88} strokeWidth={6.9} />))
    expect(track.strokeWidth).toBeCloseTo(6.9, 5)
    expect(track.r).toBeCloseTo((88 - 6.9) / 2, 5)
  })

  it("径の半分以上の strokeWidth でも radius が正のまま（描画が消えない）", () => {
    const [track] = circles(renderToStaticMarkup(<ProgressRing value={70} size={64} strokeWidth={999} />))
    expect(track.strokeWidth).toBeLessThan(32)
    expect(track.r).toBeGreaterThan(0)
  })

  it("色の既定値は従来のセマンティックトークンのまま", () => {
    const [track, progress] = circles(renderToStaticMarkup(<ProgressRing value={50} />))
    expect(track.stroke).toBe("var(--Border-Low-Emphasis)")
    expect(progress.stroke).toBe("var(--Brand-Primary)")
  })

  it("color / trackColor で配色を差し替えられる", () => {
    const html = renderToStaticMarkup(
      <ProgressRing value={50} color="var(--Success-Base)" trackColor="var(--Brand-Light)" />
    )
    const [track, progress] = circles(html)
    expect(track.stroke).toBe("var(--Brand-Light)")
    expect(progress.stroke).toBe("var(--Success-Base)")
  })

  it("中央ラベルの typo は径から決まり、プリセットの見え方は変わらない", () => {
    expect(renderToStaticMarkup(<ProgressRing value={50} size="sm" />)).toContain("typo-label-xs")
    expect(renderToStaticMarkup(<ProgressRing value={50} size="md" />)).toContain("typo-label-sm")
    expect(renderToStaticMarkup(<ProgressRing value={50} size="xl" />)).toContain("typo-label-md")
    // 88px は lg(64) と xl(96) の間 → md 相当
    expect(renderToStaticMarkup(<ProgressRing value={50} size={88} />)).toContain("typo-label-md")
  })

  it("size が 0 / 負値 / NaN でも radius が正のまま既定サイズへ落ちる", () => {
    for (const bad of [0, -10, Number.NaN]) {
      const html = renderToStaticMarkup(<ProgressRing value={50} size={bad} />)
      const [track] = circles(html)
      expect(track.r).toBeGreaterThan(0)
      expect(Number.isFinite(track.strokeWidth)).toBe(true)
      expect(html).toContain('width="48"') // md プリセットへフォールバック
    }
  })

  it("strokeWidth が NaN / 負値でも幾何値が壊れない", () => {
    for (const bad of [Number.NaN, -5]) {
      const [track] = circles(renderToStaticMarkup(<ProgressRing value={50} size={88} strokeWidth={bad} />))
      expect(Number.isFinite(track.strokeWidth)).toBe(true)
      expect(track.strokeWidth).toBeGreaterThanOrEqual(0)
      expect(track.r).toBeGreaterThan(0)
    }
  })

  it("strokeWidth={0} は 0 として尊重される（既定へ戻さない）", () => {
    const [track] = circles(renderToStaticMarkup(<ProgressRing value={50} size={88} strokeWidth={0} />))
    expect(track.strokeWidth).toBe(0)
    expect(track.r).toBeCloseTo(44, 5)
  })

  it("progressbar の a11y 属性はカスタマイズしても保たれる", () => {
    const html = renderToStaticMarkup(
      <ProgressRing value={130} size={88} strokeWidth={6.9} aria-label="出発まで" />
    )
    expect(html).toContain('role="progressbar"')
    expect(html).toContain('aria-valuenow="100"')
    expect(html).toContain('aria-label="出発まで"')
  })
})
