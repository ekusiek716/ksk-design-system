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

  it("skipped エントリは key/mode/value/reason を持ち、mode で light/dark を区別できる", () => {
    const cache = loadCache()
    for (const entry of cache.meta.skipped) {
      expect(entry).toHaveProperty("key")
      expect(entry).toHaveProperty("value")
      expect(entry).toHaveProperty("reason")
      expect(["semantic", "semanticDark"]).toContain(entry.mode)
    }
    // mode を含めたキーは一意（同名トークンが semantic / semanticDark で重複しても区別できる）
    const uniqueKeys = new Set(cache.meta.skipped.map((e: { key: string; mode: string }) => `${e.mode}.${e.key}`))
    expect(uniqueKeys.size).toBe(cache.meta.skipped.length)
  })

  it("meta.theme が default（キャッシュはデフォルトテーマスコープ）", () => {
    const cache = loadCache()
    expect(cache.meta.theme).toBe("default")
    expect(cache.meta.description).toContain("デフォルト")
  })

  it("themeDependentKeys が Brand 依存エントリを列挙し、実在キーを指す", () => {
    const cache = loadCache()
    const keys: string[] = cache.meta.themeDependentKeys
    // brand.primary は必ず Brand primitive 参照（テーマ依存の代表例）
    expect(keys).toContain("semantic.brand.primary")
    expect(keys.length).toBeGreaterThanOrEqual(10)
    const skippedKeys = new Set(
      cache.meta.skipped.map((e: { key: string; mode: string }) => `${e.mode}.${e.key}`)
    )
    for (const key of keys) {
      const [mode, ...rest] = key.split(".")
      expect(["semantic", "semanticDark"]).toContain(mode)
      const flatKey = rest.join(".")
      // resolved マップか skipped のどちらかに必ず実在する
      // （キー自体にドットを含むため toHaveProperty は使わない）
      expect(
        cache[mode][flatKey] !== undefined || skippedKeys.has(key),
        `${key} が resolved にも skipped にも存在しない`
      ).toBe(true)
    }
  })

  it("skipped かつ Brand 依存のキー（color-mix(var(--Primitive-Brand-*)) 等）も themeDependentKeys に含まれる", () => {
    const cache = loadCache()
    const keys: string[] = cache.meta.themeDependentKeys
    // resolve 不能（color-mix）でもテーマ依存であることは変わらない
    expect(keys).toContain("semantic.surface.accent-primary-subtle")
    expect(keys).toContain("semantic.border.accent-primary-subtle")
    expect(keys).toContain("semanticDark.surface.accent-primary-subtle")
    // skipped 側の値も実際に Brand primitive を参照していることを突合
    const entry = cache.meta.skipped.find(
      (e: { key: string; mode: string }) =>
        e.mode === "semantic" && e.key === "surface.accent-primary-subtle"
    )
    expect(entry?.value).toContain("var(--Primitive-Brand-")
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
