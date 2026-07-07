import { describe, expect, it } from "vitest"
import { resolveTypo } from "../src/native/typography"

describe("native Text typo variants (#146, #148)", () => {
  it("caption-strong は 11px・font-semibold(600)相当・caption(既定400)より重い", () => {
    const captionStrong = resolveTypo("caption-strong")
    const caption = resolveTypo("caption")

    expect(captionStrong.fontSize).toBe(11)
    expect(captionStrong.fontWeight).toBe("600")
    expect(caption.fontSize).toBe(11)
    expect(caption.fontWeight).toBe("400")
    // 既存 caption(citation以外にも使われている) の重さは変えていないことを確認
    expect(caption.fontWeight).not.toBe(captionStrong.fontWeight)
  })

  it("prose-meta は DocumentScreen の最終更新日用に 13px を持つ", () => {
    const proseMeta = resolveTypo("prose-meta")
    expect(proseMeta.fontSize).toBe(13)
  })

  it("Prose 本文/見出しは既存 heading.md / body.md をそのまま再利用する（新規マジックナンバーを増やさない）", () => {
    const heading = resolveTypo("heading.md")
    const body = resolveTypo("body.md")
    expect(heading.fontSize).toBe(16)
    expect(body.fontSize).toBe(14)
  })
})
