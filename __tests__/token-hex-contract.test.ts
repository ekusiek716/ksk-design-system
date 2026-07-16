import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

// contracts/token-hex-cache.json は scripts/generate-token-hex-cache.mjs の生成物。
// tokens.json（semantic / semanticDark）から実 hex を機械可読な形で AI が読めるようにする
// サイドカーで、primitive 値の変更で semantic 実色が意図せずドリフトすることを検出する。

function loadCache() {
  return JSON.parse(readFileSync("contracts/token-hex-cache.json", "utf8"))
}

describe("token-hex-cache", () => {
  it("再生成結果が contracts/token-hex-cache.json と一致する（ドリフトなし）", () => {
    // --check は差分があれば非ゼロで終了する。ここでは例外を投げないことを検証する。
    expect(() =>
      execFileSync("node", ["scripts/generate-token-hex-cache.mjs", "--check"], {
        cwd: process.cwd(),
        stdio: "pipe",
      })
    ).not.toThrow()
  })

  it("semantic の resolve 成功数が空振り検知の下限を上回る", () => {
    const cache = loadCache()
    // 現状 126 件解決できている。大きく下回ったら primitive/semantic の参照が
    // 壊れて resolve が軒並み失敗している疑い（安全マージンを見て 100 を下限とする）。
    expect(Object.keys(cache.semantic).length).toBeGreaterThanOrEqual(100)
  })

  it("semanticDark の resolve 成功数が空振り検知の下限を上回る", () => {
    const cache = loadCache()
    // 現状 54 件（安全マージンを見て 40 を下限とする）。
    expect(Object.keys(cache.semanticDark).length).toBeGreaterThanOrEqual(40)
  })

  it("skipped（rgba/color-mix/解決不能）が黙って増えていない", () => {
    const cache = loadCache()
    // 現状 52 件。rgba・color-mix・White/Gray-Alpha 系の既知の未対応値。
    // 新規トークン追加で数が増える分には対応漏れとして許容するが、
    // 上限を大きく超えたら resolve ロジックの劣化 or primitive 参照崩れを疑う。
    expect(cache.meta.skipped.length).toBeGreaterThanOrEqual(52)
    expect(cache.meta.skipped.length).toBeLessThanOrEqual(70)
  })

  it("skipped エントリは key/value/reason を持つ", () => {
    const cache = loadCache()
    for (const entry of cache.meta.skipped) {
      expect(entry).toHaveProperty("key")
      expect(entry).toHaveProperty("value")
      expect(entry).toHaveProperty("reason")
    }
  })

  it("meta.generatedBy がスクリプトパスを指す", () => {
    const cache = loadCache()
    expect(cache.meta.generatedBy).toBe("scripts/generate-token-hex-cache.mjs")
  })

  it("resolved な値はすべて #RRGGBB 形式の hex", () => {
    const cache = loadCache()
    const hexPattern = /^#[0-9A-Fa-f]{6}$/
    for (const [key, value] of Object.entries(cache.semantic)) {
      expect(value, `semantic.${key}`).toMatch(hexPattern)
    }
    for (const [key, value] of Object.entries(cache.semanticDark)) {
      expect(value, `semanticDark.${key}`).toMatch(hexPattern)
    }
  })
})
