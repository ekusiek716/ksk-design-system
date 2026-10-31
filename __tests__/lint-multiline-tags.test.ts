import { describe, expect, it, vi } from "vitest"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { runLintCli } from "../bin/lint.js"

/**
 * 複数行に折り返した JSX タグの判定（issue #805）。
 *
 * 「タグ内の属性を見る」ルール（`[^>]*` でタグ内を走査するもの）は、従来 1 行ずつ
 * 照合していたため、Prettier が長いタグを折り返すと判定が変わっていた。
 * - P033 / P044（error）: 複数行だと見逃す
 * - P025（warning）: alt が次の行にあると「alt なし」と誤検知する
 * - P039（error）: `<input` と `type="file"` が別の行だと P039 にならず P002 が出る
 *
 * rules.json で `"scope": "tag"` を付けたルールはファイル全体モードで照合し、
 * excludeLines と行スコープ ignore はタグの行範囲（開始行〜終了行）に当てる。
 *
 * P034 / P036 / P042 / P043 の実測（v2.22.0 = main e4693a9、修正前）:
 * - P034: `<Banner` の次の行に variant / title を置くと 0 件（見逃し）
 * - P036: `action={` と `<Button` を別の行にすると 0 件（見逃し）
 * - P042: `<SheetContent` の次の行に className を置くと 0 件（見逃し）
 * - P043: `<Tabs` の次の行に `tabBar={(props) => ...}` を置くと、第 2 分岐
 *   （`tabBar={(props) =>` が 1 行に揃う形）で検出されていた。ただし
 *   `tabBar={(\n  props,\n) =>` のように引数まで折り返すと 0 件（見逃し）
 * いずれも scope: "tag" を付け、下の「他の [^>]* ルール」で固定する。
 */

const PKG_ROOT = resolve(process.cwd())

type Finding = { file: string; line: number; ruleId: string; severity: string }

async function lint(source: string, fileName = "Example.tsx") {
  const cwd = mkdtempSync(join(tmpdir(), "ksk-ds-lint-multiline-"))
  const abs = join(cwd, fileName)
  mkdirSync(join(abs, ".."), { recursive: true })
  writeFileSync(abs, source)
  const stdout: string[] = []
  const logSpy = vi.spyOn(console, "log").mockImplementation((...a) => void stdout.push(a.join(" ")))
  const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  try {
    const status = await runLintCli([cwd, "--format", "json"], { cwd, pkgRoot: PKG_ROOT })
    const raw = stdout.join("\n")
    return { status, results: raw ? (JSON.parse(raw).results as Finding[]) : [] }
  } finally {
    logSpy.mockRestore()
    errSpy.mockRestore()
  }
}

const idsOf = (results: Finding[]) => results.map((f) => f.ruleId).sort()
const only = (results: Finding[], ids: string[]) => results.filter((f) => ids.includes(f.ruleId))

const wrap = (jsx: string) => `export function Example({ on, url }: { on: boolean; url: string }) {
  return (
    <>
${jsx}
    </>
  )
}
`

const TARGET = ["P002", "P025", "P033", "P039", "P044"]

describe("issue #805 — 1 行と複数行で同じ判定になる", () => {
  it("issue の再現: 1 行版", async () => {
    const { results } = await lint(
      wrap(`<Button variant="secondary" aria-pressed={on}>x</Button>
<img src={url} alt="写真" />
<input type="file" />`),
    )
    expect(idsOf(only(results, TARGET))).toEqual(["P033", "P039"])
  })

  it("issue の再現: 折り返し版でも P033 / P039 が出て、P025 / P002 は出ない", async () => {
    const { results } = await lint(
      wrap(`<Button
  variant="secondary"
  aria-pressed={on}
>
  x
</Button>
<img
  src={url}
  alt="写真"
/>
<input
  type="file"
/>`),
    )
    expect(idsOf(only(results, TARGET))).toEqual(["P033", "P039"])
  })

  it("P033 はタグの開始行（<Button の行）で報告する", async () => {
    const { results } = await lint(
      wrap(`<Button
  variant="secondary"
  aria-pressed={on}
>
  x
</Button>`),
    )
    expect(only(results, ["P033"]).map((f) => f.line)).toEqual([4])
  })

  it("P044: className を次の行に折り返しても検出する", async () => {
    const single = await lint(wrap(`<Section title="t" className="px-4">a</Section>`))
    const multi = await lint(
      wrap(`<Section
  title="t"
  className="px-4"
>
  a
</Section>`),
    )
    expect(idsOf(only(single.results, ["P044"]))).toEqual(["P044"])
    expect(idsOf(only(multi.results, ["P044"]))).toEqual(["P044"])
  })

  it("P044: <SectionHeader の className は Section と取り違えない", async () => {
    // 全体モード化で、DS の category-scroll.tsx の `<SectionHeader\n  className="px-4"` が
    // P044 として新たに出た。`<Section` の後に語境界が無く、別名の部品にも一致していた。
    const { results } = await lint(
      wrap(`<SectionHeader
  className="px-4"
  title="t"
/>
<SectionHeader className="px-4" title="t" />`),
    )
    expect(only(results, ["P044"])).toEqual([])
  })

  it("P025: alt の無い複数行 img は引き続き検出する", async () => {
    const { results } = await lint(
      wrap(`<img
  src={url}
  width={10}
/>`),
    )
    expect(idsOf(only(results, ["P025"]))).toEqual(["P025"])
  })

  it("P002: type=\"file\" 以外の複数行 input は引き続き P002 になる", async () => {
    const { results } = await lint(
      wrap(`<input
  type="text"
  value={url}
/>`),
    )
    expect(idsOf(only(results, ["P002", "P039"]))).toEqual(["P002"])
  })

  it("P002: excludeLines（data-slot）がタグの別の行にあっても効く", async () => {
    const { results } = await lint(
      wrap(`<input
  data-slot="x"
  value={url}
/>`),
    )
    expect(only(results, ["P002"])).toEqual([])
  })

  it("タグの外の行は excludeLines の対象にしない（次のタグの type=\"file\" で前の input を外さない）", async () => {
    const { results } = await lint(
      wrap(`<input
  value={url}
/>
<input type="file" />`),
    )
    expect(idsOf(only(results, ["P002", "P039"]))).toEqual(["P002", "P039"])
  })

  it("アロー関数の => を含む属性があってもタグ範囲は > で閉じたところまで", async () => {
    const { results } = await lint(
      wrap(`<input
  onChange={(e) => void e}
  type="file"
/>`),
    )
    expect(only(results, ["P002"])).toEqual([])
  })
})

describe("issue #805 — 行スコープ ignore の位置", () => {
  it("<img の直上の ignore はこれまでどおり効く（belle-todo の置き方）", async () => {
    const { results } = await lint(
      wrap(`{/* ksk-ds-lint-ignore P025 -- 装飾用のため説明不要 */}
<img
  src={url}
  width={10}
/>`),
    )
    expect(only(results, ["P025"])).toEqual([])
  })

  it("タグの途中（属性の直上）に置いた ignore も効く", async () => {
    const { results } = await lint(
      wrap(`<Button
  variant="secondary"
  // ksk-ds-lint-ignore P033 -- 単独の切替ボタンで群ではないため
  aria-pressed={on}
>
  x
</Button>`),
    )
    expect(only(results, ["P033"])).toEqual([])
  })

  it("タグから離れた ignore は効かない", async () => {
    const { results } = await lint(
      wrap(`{/* ksk-ds-lint-ignore P033 -- 単独の切替ボタンで群ではないため */}
<div />
<div />
<div />
<Button
  aria-pressed={on}
>
  x
</Button>`),
    )
    expect(idsOf(only(results, ["P033"]))).toEqual(["P033"])
  })
})

describe("issue #805 — 他の [^>]* ルール（P034 / P036 / P042 / P043）", () => {
  it("P034: Banner の属性を折り返しても検出する", async () => {
    const { results } = await lint(
      wrap(`<Banner
  variant="success"
  title="保存しました"
/>`),
    )
    expect(idsOf(only(results, ["P034"]))).toEqual(["P034"])
  })

  it("P036: action={ と <Button を別の行にしても検出する", async () => {
    const { results } = await lint(
      wrap(`<EmptyState
  title="なし"
  action={
    <Button className="w-full">追加</Button>
  }
/>`),
    )
    expect(idsOf(only(results, ["P036"]))).toEqual(["P036"])
  })

  it("P042: SheetContent の className を次の行に折り返しても検出する", async () => {
    const { results } = await lint(
      wrap(`<SheetContent
  side="bottom"
  className="rounded-t-2xl"
>
  a
</SheetContent>`),
    )
    expect(idsOf(only(results, ["P042"]))).toEqual(["P042"])
  })

  it("P043: tabBar の引数まで折り返しても検出する", async () => {
    const { results } = await lint(
      wrap(`<Tabs
  tabBar={(
    props,
  ) => <MyBar {...props} />}
/>`),
    )
    expect(idsOf(only(results, ["P043"]))).toEqual(["P043"])
  })
})

describe("issue #805 — rules.json の scope 指定", () => {
  const contract = JSON.parse(readFileSync(join(PKG_ROOT, "contracts/rules.json"), "utf8"))
  const byId = new Map<string, { scope?: string }>(
    [...contract.prohibited, ...(contract.aiPatterns?.patterns ?? [])].map((r: { id: string }) => [r.id, r]),
  )

  it.each(["P002", "P025", "P033", "P034", "P036", "P039", "P042", "P043", "P044"])(
    "%s は scope: tag",
    (id) => {
      expect(byId.get(id)?.scope).toBe("tag")
    },
  )
})
