/**
 * contracts/components.json と src/index.ts の実 export の整合を固定する。
 *
 * 背景: contracts の `name` には実装ファイル名やグループ名
 * （`ListSkeleton / GridSkeleton` 等）や型のみの export（`Toast`）が混ざっており、
 * consumer と AI が「その名前で import できる」と誤解する。
 * 姉妹 DS では、実装にも story にも contracts にもあるのに src/index.ts に
 * 載っていない部品が放置され、npm 経由で import するとエラーになっていた。
 *
 * ここでは src/index.ts を**実際に読み込んで**値 export を観測する
 * （パースではなくランタイム。型のみの export は自然に落ちる）。
 *
 * 実行: npm run test
 */
import { describe, expect, it } from "vitest"
import * as DS from "../src/index"
import contracts from "../contracts/components.json"
import { DEPRECATED } from "../eslint/deprecated.js"

type Entry = {
  name: string
  path: string
  exported?: boolean
  exportedAs?: string
  deprecatedAliases?: string[]
  subcomponents?: string[]
}

const GROUPS = ["ui", "patterns", "commerce", "admin", "shells"] as const
const all = contracts as unknown as Record<string, Entry[]>
const entries = GROUPS.flatMap((g) => all[g].map((e) => ({ ...e, group: g })))

const publicApi = DS as unknown as Record<string, unknown>

/** `PhotoHero.Eyebrow` のような複合コンポーネント名も解決する */
function resolveExport(name: string): unknown {
  return name
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        // 複合コンポーネントは Object.assign(Root, {...}) なので typeof は "function"
        acc && (typeof acc === "object" || typeof acc === "function")
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      publicApi,
    )
}

const isExported = (name: string) => resolveExport(name) !== undefined

describe("contracts/components.json の name", () => {
  it("exported:false でないものは src/index.ts から値として import できる", () => {
    const missing = entries
      .filter((e) => e.exported !== false)
      .map((e) => ({ e, importName: e.exportedAs ?? e.name }))
      .filter(({ importName }) => !isExported(importName))
      .map(({ e, importName }) => `${e.group}/${e.name} → import { ${importName} } が解決できない`)
    expect(missing).toEqual([])
  })

  it("exported:false のものは値として export されて『いない』", () => {
    // ここが緩むと「import できない名前」が再び import できる名前と混ざる
    const wrong = entries
      .filter((e) => e.exported === false)
      .filter((e) => isExported(e.name))
      .map((e) => `${e.group}/${e.name} は exported:false だが値 export されている`)
    expect(wrong).toEqual([])
  })

  it("exported:false のものは実際に import できる名前を subcomponents に持つ", () => {
    const bad = entries
      .filter((e) => e.exported === false)
      .filter((e) => !e.subcomponents || e.subcomponents.length === 0)
      .map((e) => `${e.group}/${e.name} に subcomponents が無い`)
    expect(bad).toEqual([])
  })
})

describe("contracts の subcomponents", () => {
  it("はすべて値 export として解決できる", () => {
    const missing = entries.flatMap((e) =>
      (e.subcomponents ?? [])
        .filter((s) => !isExported(s))
        .map((s) => `${e.group}/${e.name} > ${s}`),
    )
    expect(missing).toEqual([])
  })
})

describe("contracts の exportedAs / deprecatedAliases", () => {
  it("exportedAs は name と異なる名前でのみ使う", () => {
    const redundant = entries
      .filter((e) => e.exportedAs && e.exportedAs === e.name)
      .map((e) => `${e.group}/${e.name}`)
    expect(redundant).toEqual([])
  })

  it("deprecatedAliases は実際に export されている（互換が切れていない）", () => {
    const broken = entries.flatMap((e) =>
      (e.deprecatedAliases ?? [])
        .filter((alias) => !isExported(alias))
        .map((alias) => `${e.group}/${e.name} の旧名 ${alias} が export されていない`),
    )
    expect(broken).toEqual([])
  })

  it("deprecatedAliases と eslint/deprecated.js の DEPRECATED が同期している", () => {
    const inContracts = new Set(entries.flatMap((e) => e.deprecatedAliases ?? []))
    const inEslint = new Set(
      (DEPRECATED as Array<{ identifier: string }>).map((d) => d.identifier),
    )
    expect([...inContracts].filter((n) => !inEslint.has(n))).toEqual([])
    expect([...inEslint].filter((n) => !inContracts.has(n))).toEqual([])
  })
})

describe("contracts の meta", () => {
  it("exportNaming の規約が書かれている（フィールドの意味の正本）", () => {
    const meta = (contracts as unknown as { meta: Record<string, unknown> }).meta
    expect(meta.exportNaming).toBeDefined()
    for (const key of ["exported", "exportedAs", "deprecatedAliases"]) {
      expect(meta.exportNaming).toHaveProperty(key)
    }
  })

  it("counts.total が実エントリ数と一致する", () => {
    const counts = (contracts as unknown as { meta: { counts: Record<string, number> } }).meta.counts
    for (const g of GROUPS) expect(counts[g]).toBe(all[g].length)
    expect(counts.total).toBe(entries.length)
  })
})
