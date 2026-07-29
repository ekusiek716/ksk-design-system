/**
 * @source safelist の同梱契約（issue #258）
 *
 * DS 内部でしか出現しないユーティリティは、消費側 Tailwind v4 の
 * `@source ".../ksk-design-system/dist"` が無い / パスがずれている / スキャナが
 * dist を辿れない場合に CSS が生成されず、消費側でだけ壊れる（#132/#134/#138/#143）。
 *
 * 対策として scripts/generate-source-safelist.mjs が
 * src/styles/source-safelist.css に `@source inline("…")` を生成し、
 * preset.css から読み込む。ここではその配線と最低限の内容を固定する。
 * （src の実装との一致は `node scripts/generate-source-safelist.mjs --check` が担当）
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8")

const SAFELIST_PATH = "src/styles/source-safelist.css"
const safelist = read(SAFELIST_PATH)
const preset = read("src/preset.css")
const pkg = JSON.parse(read("package.json")) as {
  files: string[]
  scripts: Record<string, string>
}

const entries = [...safelist.matchAll(/@source inline\("([^"]+)"\);/g)].map((m) => m[1])

describe("@source safelist の同梱（issue #258）", () => {
  it("preset.css が safelist を読み込む（消費側は preset の @import だけで済む）", () => {
    expect(preset).toContain('@import "./styles/source-safelist.css";')
  })

  it("safelist は配布物に含まれる（package.json files の src/styles 経由）", () => {
    expect(pkg.files).toContain("src/styles")
  })

  it("npm run check がドリフト検査を含む", () => {
    expect(pkg.scripts.check).toContain("scripts/generate-source-safelist.mjs --check")
  })

  it("十分な件数のユーティリティを safelist している", () => {
    expect(entries.length).toBeGreaterThan(500)
  })

  it("過去に消費側で壊れた pointer-events ペアを含む", () => {
    expect(entries).toContain("pointer-events-none")
    expect(entries).toContain("pointer-events-auto")
  })

  it("`@source inline()` を壊す文字（波括弧・二重引用符）を含む候補が無い", () => {
    expect(entries.filter((e) => /[{}"]/.test(e))).toEqual([])
  })

  it("生成物は手書き禁止であることを明示している", () => {
    expect(safelist).toContain("自動生成")
    expect(safelist).toContain("scripts/generate-source-safelist.mjs")
  })
})
