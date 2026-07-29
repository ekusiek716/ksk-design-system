import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

/**
 * モーショントークン（src/styles/motion.css）の不変条件。issue #263。
 *
 * 目的は「体感が勝手に変わらないこと」。既存実装の実測値をそのまま
 * トークンに移した経緯があるため、値そのものを固定して回帰を防ぐ。
 */

const motion = readFileSync("src/styles/motion.css", "utf8")
const preset = readFileSync("src/preset.css", "utf8")

/** :root ブロック（reduced-motion の再定義より前）から拾う */
const rootBlock = motion.slice(0, motion.indexOf("@media"))

function token(name: string): string {
  const m = rootBlock.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!m) throw new Error(`--${name} が motion.css に無い`)
  return m[1].trim()
}

describe("motion トークン contract", () => {
  it("duration の値が DESIGN.md / 既存実装と一致する", () => {
    expect(token("Motion-Duration-Fast")).toBe("150ms")
    expect(token("Motion-Duration-Base")).toBe("200ms")
    expect(token("Motion-Duration-Slow")).toBe("300ms")
    expect(token("Motion-Duration-Slower")).toBe("500ms")
    expect(token("Motion-Duration-Sheet-Enter")).toBe("320ms")
    expect(token("Motion-Duration-Sheet-Settle")).toBe("280ms")
  })

  it("easing の値が既存実装と一致する", () => {
    expect(token("Motion-Easing-Standard")).toBe("cubic-bezier(0, 0, 0.2, 1)")
    expect(token("Motion-Easing-Emphasized")).toBe("cubic-bezier(0.32, 0.72, 0, 1)")
    expect(token("Motion-Easing-Decelerate")).toBe("cubic-bezier(0.16, 1, 0.3, 1)")
    expect(token("Motion-Easing-Bounce")).toBe("cubic-bezier(0.34, 1.56, 0.64, 1)")
  })

  it("prefers-reduced-motion で全 duration が 0 近傍に落ちる", () => {
    const reduced = motion.slice(motion.indexOf("@media"))
    const durations = [...rootBlock.matchAll(/--(Motion-Duration-[A-Za-z-]+):/g)].map((m) => m[1])
    expect(durations.length).toBeGreaterThan(0)
    for (const d of durations) {
      expect(reduced, `${d} が reduced-motion で上書きされていない`).toMatch(
        new RegExp(`--${d}:\\s*0\\.01ms;`)
      )
    }
    // 0 ではなく 0.01ms —— transitionend / animationend を待つ実装を止めないため
    expect(reduced).not.toMatch(/--Motion-Duration-[A-Za-z-]+:\s*0(ms)?;/)
  })

  it("preset.css が motion.css を読み込んでいる", () => {
    expect(preset).toContain('@import "./styles/motion.css"')
  })

  it("@theme inline のアニメーションがトークンを参照している", () => {
    expect(preset).toMatch(/--animate-fade-in:\s*fade-in var\(--Motion-Duration-Fast\)/)
    expect(preset).toMatch(/--animate-fade-in-up:\s*fade-in-up var\(--Motion-Duration-Base\)/)
  })
})
