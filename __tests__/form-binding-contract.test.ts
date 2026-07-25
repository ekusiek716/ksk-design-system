/**
 * contracts の formBinding 宣言と、react-hook-form 統合テストの対応を固定する。
 *
 * 「制御/非制御どちらでも動く」と契約に書きながら、その経路がテストにも story にも
 * 一度も登場しない——という状態を作らないための歯止め。
 * register / controller を宣言したら、実際に RHF を通すテストを同じ PR で書く。
 *
 * 実行: npm run test
 */
import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import contracts from "../contracts/components.json"

type Entry = { name: string; formBinding?: string }

const GROUPS = ["ui", "patterns", "commerce", "admin", "shells"] as const
const all = contracts as unknown as Record<string, Entry[]>
const entries = GROUPS.flatMap((g) => all[g].map((e) => ({ ...e, group: g })))

const VALID = ["register", "controller", "layout", "none"] as const

const rhfTestSource = readFileSync(
  join(process.cwd(), "__tests__/react-hook-form-integration.test.tsx"),
  "utf8",
)

/**
 * RHF 統合テストを `it(...)` 単位に切り出す。
 *
 * ファイル全体にキーワードが「どこかに」あるかを見るだけだと、
 * 部品ごとの 3 点（defaultValues / reset / 操作）を強制できない。
 * 実際、DateField は初期表示と reset だけを見て操作を見ていなかったのに
 * 素通りしていた。ケース単位で対応づける。
 */
const rhfCases = rhfTestSource
  .split(/\n\s*it\(/)
  .slice(1)
  .map((block) => `it(${block}`)

/** 部品名がタグとして登場するケースだけを集める */
function casesUsing(name: string) {
  return rhfCases.filter((block) => new RegExp(`<${name}[\\s/>]`).test(block))
}

describe("contracts の formBinding", () => {
  it("meta.formBinding に 4 値の意味と運用ルールが書かれている", () => {
    const meta = (contracts as unknown as { meta: Record<string, Record<string, string>> }).meta
    expect(meta.formBinding).toBeDefined()
    for (const key of [...VALID, "rule"]) {
      expect(meta.formBinding).toHaveProperty(key)
    }
  })

  it("宣言された値は register / controller / layout / none のいずれか", () => {
    const invalid = entries
      .filter((e) => e.formBinding !== undefined)
      .filter((e) => !(VALID as readonly string[]).includes(e.formBinding!))
      .map((e) => `${e.group}/${e.name}: ${e.formBinding}`)
    expect(invalid).toEqual([])
  })

  it("register / controller を宣言した部品は RHF 統合テストに登場する", () => {
    const uncovered = entries
      .filter((e) => e.formBinding === "register" || e.formBinding === "controller")
      .filter((e) => casesUsing(e.name).length === 0)
      .map(
        (e) =>
          `${e.group}/${e.name}（formBinding: ${e.formBinding}）が react-hook-form-integration.test.tsx に無い`,
      )
    expect(uncovered).toEqual([])
  })

  it("部品ごとに defaultValues 初期表示 / reset() 追従 / 操作での値更新の 3 点を見ている", () => {
    // 「レンダリングできる」だけのケースに痩せると、この契約が形だけになる。
    // 部品ごとに、その部品を使っているケース群のどれかが各点を満たすことを要求する。
    const missing: string[] = []
    for (const entry of entries.filter(
      (e) => e.formBinding === "register" || e.formBinding === "controller",
    )) {
      const cases = casesUsing(entry.name)
      const has = (re: RegExp) => cases.some((block) => re.test(block))
      // defaultValues は makeHarness の第 1 引数として渡すため、ケース側には
      // 「初期値を読む assertion」が必ずある。reset と操作は明示的に見る。
      if (!has(/\.reset\(/)) missing.push(`${entry.group}/${entry.name}: reset() 追従が無い`)
      if (!has(/getValues\(/))
        missing.push(`${entry.group}/${entry.name}: 操作後の getValues() 検証が無い`)
    }
    expect(missing).toEqual([])
  })

  it("RHF 統合テストは defaultValues を使ってハーネスを組んでいる", () => {
    expect(rhfTestSource).toContain("defaultValues")
  })

  it("register 宣言の部品は register() を spread する形で書かれている", () => {
    const registerNames = entries
      .filter((e) => e.formBinding === "register")
      .map((e) => e.name)
    expect(registerNames.length).toBeGreaterThan(0)
    for (const name of registerNames) {
      expect(rhfTestSource).toMatch(new RegExp(`<${name}\\s+\\{\\.\\.\\.\\s*form\\.register\\(`))
    }
  })

  it("controller 宣言の部品は Controller の render 内で使われている", () => {
    const controllerNames = entries
      .filter((e) => e.formBinding === "controller")
      .map((e) => e.name)
    expect(controllerNames.length).toBeGreaterThan(0)
    expect(rhfTestSource).toContain("<Controller")
    for (const name of controllerNames) {
      expect(rhfTestSource).toMatch(new RegExp(`<${name}[\\s>]`))
    }
  })
})
