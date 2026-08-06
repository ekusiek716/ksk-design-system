import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

/**
 * scripts/check-flex-shrink.mjs の contract（issue #293 再発防止）。
 *
 * KFX001 (error):   shrink-0 の兄弟がいる flex 行で min-w-0 のみのアイテムは
 *                   min-content 未満まで潰されて 1 文字折り返しになる。
 * KFX002 (advisory): flex 行内の固定サイズ要素に shrink-0 が無い。
 */
function run(source: string, ...flags: string[]) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-flex-shrink-"))
  const file = join(dir, "Example.tsx")
  writeFileSync(file, source)
  return spawnSync("node", ["scripts/check-flex-shrink.mjs", file, ...flags], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

const outputOf = (r: ReturnType<typeof run>) => `${r.stdout}\n${r.stderr}`

describe("check-flex-shrink.mjs", () => {
  it("KFX001: shrink-0 兄弟 + min-w-0 のみのアイテムを error にする (#293 再現)", () => {
    const r = run(`
      export function Tile() {
        return (
          <span className="flex w-full items-end justify-between gap-2">
            <span className="typo-body-sm min-w-0">説明テキスト</span>
            <span className="typo-label-sm shrink-0">メタ</span>
          </span>
        )
      }
    `)
    expect(r.status).toBe(1)
    expect(outputOf(r)).toContain("KFX001")
  })

  it("KFX001: flex-1 が併記されていれば通る (#293 修正後の形)", () => {
    const r = run(`
      export function Tile() {
        return (
          <span className="flex w-full flex-wrap items-end justify-between gap-2">
            <span className="typo-body-sm min-w-[60%] flex-1">説明テキスト</span>
            <span className="typo-label-sm ml-auto shrink-0">メタ</span>
          </span>
        )
      }
    `)
    expect(r.status).toBe(0)
  })

  it("KFX001: 三項演算子の片側に隠れた違反も検出する（AST 展開）", () => {
    const r = run(`
      export function Tile({ dense }: { dense: boolean }) {
        return (
          <div className="flex gap-2">
            <span className={dense ? "min-w-0" : "min-w-0 flex-1"}>本文</span>
            <span className="shrink-0">メタ</span>
          </div>
        )
      }
    `)
    expect(r.status).toBe(1)
    expect(outputOf(r)).toContain("KFX001")
  })

  it("KFX001: flex-col の縦積みは対象外", () => {
    const r = run(`
      export function Stack() {
        return (
          <div className="flex flex-col gap-2">
            <span className="min-w-0">本文</span>
            <span className="shrink-0">メタ</span>
          </div>
        )
      }
    `)
    expect(r.status).toBe(0)
  })

  it("KFX002: flex 行内の固定サイズ要素は advisory（既定では CI 通過）", () => {
    const r = run(`
      export function Row() {
        return (
          <div className="flex items-center gap-2">
            <span className="size-5 rounded-full bg-[var(--Brand-Primary)]" />
            <span className="min-w-0 flex-1">ラベル</span>
          </div>
        )
      }
    `)
    expect(r.status).toBe(0)
    expect(outputOf(r)).toContain("KFX002")
  })

  it("KFX002: --strict では advisory も fail する", () => {
    const r = run(
      `
      export function Row() {
        return (
          <div className="flex items-center gap-2">
            <span className="size-5" />
          </div>
        )
      }
    `,
      "--strict",
    )
    expect(r.status).toBe(1)
  })

  it("ksk-lint-ignore: 理由付きコメントで抑制できる", () => {
    const r = run(`
      export function Tile() {
        return (
          <div className="flex gap-2">
            {/* ksk-lint-ignore KFX001 -- 説明は最大2文字で潰れ得ない */}
            <span className="min-w-0">絵</span>
            <span className="shrink-0">メタ</span>
          </div>
        )
      }
    `)
    expect(r.status).toBe(0)
  })

  it("ksk-lint-ignore: 理由なしの抑制は error にする", () => {
    const r = run(`
      export function Tile() {
        return (
          <div className="flex gap-2">
            {/* ksk-lint-ignore KFX001 */}
            <span className="min-w-0">本文</span>
            <span className="shrink-0">メタ</span>
          </div>
        )
      }
    `)
    expect(r.status).toBe(1)
    expect(outputOf(r)).toContain("理由")
  })
})
