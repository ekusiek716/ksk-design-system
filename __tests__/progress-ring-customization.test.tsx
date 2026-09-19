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

/**
 * issue #559: 色を意味名で撃ち分ける `tone`。Native の同名 prop と語彙・意味を揃えており、
 * Native は同じ役割を ThemeProvider から解決する（var() 文字列は RN で解決できないため）。
 */
describe("ProgressRing の tone（#559）", () => {
  it("全 tone が対応する semantic トークンへ解決される", () => {
    const expected = {
      accent: "var(--Brand-Primary)",
      success: "var(--Success-Base)",
      caution: "var(--Caution-Base)",
      warning: "var(--Warning-Base)",
      info: "var(--Info-Base)",
    } as const
    for (const [tone, token] of Object.entries(expected)) {
      const [, progress] = circles(
        renderToStaticMarkup(<ProgressRing value={50} tone={tone as "accent"} />)
      )
      expect(progress.stroke).toBe(token)
    }
  })

  it("tone 未指定の既定は従来の Brand-Primary のまま（破壊的変更なし）", () => {
    const [, withoutTone] = circles(renderToStaticMarkup(<ProgressRing value={50} />))
    const [, withAccent] = circles(renderToStaticMarkup(<ProgressRing value={50} tone="accent" />))
    expect(withoutTone.stroke).toBe("var(--Brand-Primary)")
    expect(withAccent.stroke).toBe(withoutTone.stroke)
  })

  it("color を明示したら tone より優先される（トークン直指定の逃げ道）", () => {
    const [, progress] = circles(
      renderToStaticMarkup(
        <ProgressRing value={50} tone="success" color="var(--Categorical-3-Bold)" />
      )
    )
    expect(progress.stroke).toBe("var(--Categorical-3-Bold)")
  })

  it("tone はトラックの色を変えない", () => {
    const [track] = circles(renderToStaticMarkup(<ProgressRing value={50} tone="caution" />))
    expect(track.stroke).toBe("var(--Border-Low-Emphasis)")
  })

  it("label に ReactNode を渡すと既定のパーセント表示より優先される", () => {
    const html = renderToStaticMarkup(
      <ProgressRing
        value={80}
        tone="success"
        aria-label="正答率 80パーセント"
        label={
          <span>
            <span>正答率</span>
            <span>8/10</span>
          </span>
        }
      />
    )
    expect(html).toContain("正答率")
    expect(html).toContain("8/10")
    // 既定のパーセント表示（"80%"）は label に置き換わる。
    expect(html).not.toContain("80%")
    expect(html).toContain('aria-label="正答率 80パーセント"')
  })
})

/** issue #559: 線端。Web の既定は従来どおり round で、明示すれば butt にできる。 */
describe("ProgressRing の lineCap（#559）", () => {
  function linecaps(html: string) {
    return [...html.matchAll(/stroke-linecap="([^"]*)"/g)].map((m) => m[1])
  }

  it("既定は round のまま（従来の見た目を変えない）", () => {
    expect(linecaps(renderToStaticMarkup(<ProgressRing value={50} />))).toEqual(["round"])
  })

  it("butt を指定すると SVG の stroke-linecap に渡る", () => {
    expect(linecaps(renderToStaticMarkup(<ProgressRing value={50} lineCap="butt" />))).toEqual([
      "butt",
    ])
  })

  it("トラック側には線端を付けない（閉じた円なので不要）", () => {
    const html = renderToStaticMarkup(<ProgressRing value={50} lineCap="round" />)
    expect(linecaps(html)).toHaveLength(1)
  })
})
