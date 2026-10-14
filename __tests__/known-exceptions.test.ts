import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import {
  checkA11yLedger,
  crossCheckA11y,
  isCalendarDate,
  scanStoryA11yOverrides,
  upcomingReviews,
  validateSection,
} from "../scripts/lib/known-exceptions.mjs"

/**
 * 期限付きの例外台帳（test/known-exceptions.json）の contract。
 * 「載っているから通る」だけの飾りにしないため、期限切れ・形式不備・
 * 未登録の除外・使われていない登録をすべて失敗として検出できることを確かめる。
 */
const valid = {
  reason: "無効状態の見た目デモで WCAG の例外に当たるため",
  issue: "#261",
  reviewBy: "2027-03-31",
}

describe("validateSection", () => {
  it("形式が揃った登録は通す", () => {
    expect(validateSection("contrast", [{ pair: "light:input-border", ...valid }], "2026-10-13")).toEqual([])
  })

  it("見直し期限を過ぎた登録を落とす", () => {
    const errors = validateSection("contrast", [{ pair: "light:input-border", ...valid, reviewBy: "2026-10-12" }], "2026-10-13")
    expect(errors.join("\n")).toContain("見直し期限 2026-10-12（UTC）を過ぎています")
  })

  it("期限当日はまだ通す", () => {
    expect(validateSection("contrast", [{ pair: "x", ...valid, reviewBy: "2026-10-13" }], "2026-10-13")).toEqual([])
  })

  it("理由・issue・日付の欠落や不正形式を落とす", () => {
    const errors = validateSection("a11y", [{ target: "a#B", rule: "color-contrast", reason: "短い", issue: "261", reviewBy: "2027/03/31" }], "2026-10-13")
    expect(errors).toHaveLength(3)
  })

  it("実在しない日付（2027-02-31）を拒否する", () => {
    expect(isCalendarDate("2027-02-31")).toBe(false)
    expect(isCalendarDate("2027-02-28")).toBe(true)
    expect(isCalendarDate("2028-02-29")).toBe(true)
    const errors = validateSection("contrast", [{ pair: "x", ...valid, reviewBy: "2027-02-31" }], "2026-10-13")
    expect(errors.join("\n")).toContain("実在する日付")
  })

  it("同じ対象の重複登録を落とす", () => {
    const entry = { target: "a#B", rule: "color-contrast", ...valid }
    expect(validateSection("a11y", [entry, entry], "2026-10-13").join("\n")).toContain("重複")
  })
})

describe("upcomingReviews", () => {
  it("30 日以内に迫った登録だけを警告し、失敗にはしない", () => {
    const entries = [
      { pair: "soon", ...valid, reviewBy: "2027-03-31" },
      { pair: "later", ...valid, reviewBy: "2027-05-01" },
    ]
    const warnings = upcomingReviews("contrast", entries, "2027-03-02")
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain("soon")
    expect(warnings[0]).toContain("残り 29 日")
    expect(validateSection("contrast", entries, "2027-03-02")).toEqual([])
  })
})

describe("a11y 除外の走査（構文木）", () => {
  function scan(source: string, file = "demo.stories.tsx") {
    const root = mkdtempSync(join(tmpdir(), "ksk-known-exceptions-"))
    mkdirSync(join(root, "src"), { recursive: true })
    writeFileSync(join(root, "src", file), source)
    return scanStoryA11yOverrides(root).map((o: { target: string; rule: string }) => `${o.target.replace(/^src\//, "")}::${o.rule}`)
  }

  it("rules 配列の { id, enabled:false } をキーの順番に関係なく拾う", () => {
    expect(scan(`
export const A = { parameters: { a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } } } }
export const B = { parameters: { a11y: { config: { rules: [{ enabled: false, id: "region" }] } } } }
export const C = { parameters: { a11y: { config: { rules: [{ id: "label", enabled: true }] } } } }
`)).toEqual(["demo.stories.tsx#A::color-contrast", "demo.stories.tsx#B::region"])
  })

  it("rules をオブジェクトで書いた形（config / options）も拾う", () => {
    expect(scan(`
export const A = { parameters: { a11y: { options: { rules: { "color-contrast": { enabled: false }, label: { enabled: true } } } } } }
export const B = { parameters: { a11y: { config: { rules: { region: false } } } } }
`)).toEqual(["demo.stories.tsx#A::color-contrast", "demo.stories.tsx#B::region"])
  })

  it("test:\"off\" / \"todo\" をネストの後ろに書いても、disable:true も拾う", () => {
    expect(scan(`
const meta = { title: "Demo", parameters: { a11y: { config: { rules: [] }, test: "todo" } } } satisfies object
export default meta
export const A = { parameters: { layout: "centered", a11y: { context: "#root", test: "off" } } }
export const B = { parameters: { a11y: { disable: true } } }
export const C = { parameters: { a11y: { test: "error" } } }
`)).toEqual(["demo.stories.tsx#meta::test:todo", "demo.stories.tsx#A::test:off", "demo.stories.tsx#B::disable"])
  })

  it("export default {...} と .stories.ts も対象にする", () => {
    expect(scan(`export default { title: "Demo", parameters: { a11y: { test: "off" } } }`, "plain.stories.ts")).toEqual(["plain.stories.ts#default::test:off"])
  })

  it("静的に読めない a11y 設定は <dynamic> として失敗させる", () => {
    const found = scan(`
const shared = { test: "off" }
export const A = { parameters: { a11y: shared } }
`)
    expect(found).toEqual(["demo.stories.tsx#A::<dynamic>"])
    expect(crossCheckA11y([], [{ target: "src/demo.stories.tsx#A", rule: "<dynamic>" }])[0]).toContain("静的に読めない")
  })

  it("未登録の無効化と、使われていない登録の両方を落とす", () => {
    const errors = crossCheckA11y(
      [{ target: "src/demo.stories.tsx#Gone", rule: "color-contrast", ...valid }],
      [{ target: "src/demo.stories.tsx#Disabled", rule: "color-contrast" }],
    )
    expect(errors).toHaveLength(2)
    expect(errors[0]).toContain("未登録の a11y 除外")
    expect(errors[1]).toContain("使われていない a11y 登録")
  })

  it("実リポジトリの台帳はストーリー側（src と test/visual）と一致している", () => {
    expect(checkA11yLedger(process.cwd())).toEqual([])
  })
})

describe("check-contrast.mjs と例外台帳", () => {
  it("通常の操作部品は非テキスト基準を満たし、例外なしで通る (#636)", () => {
    const r = spawnSync("node", ["scripts/check-contrast.mjs"], { cwd: process.cwd(), encoding: "utf8" })
    expect(r.status).toBe(0)
    expect(r.stdout).not.toContain("[例外]")
    expect(r.stdout).toMatch(/全 \d+ ペア通過（うち台帳の例外 0）/)
    expect(r.stdout).toMatch(/4\.83 : 3 : light: 入力欄の枠/)
  })

  it("check-known-exceptions.mjs が通る", () => {
    const r = spawnSync("node", ["scripts/check-known-exceptions.mjs"], { cwd: process.cwd(), encoding: "utf8" })
    expect(r.status, r.stderr).toBe(0)
  })
})
