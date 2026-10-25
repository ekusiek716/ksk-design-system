import { afterEach, describe, expect, it } from "vitest"
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { spawnSync } from "node:child_process"
import { maskCodeStrings } from "../bin/ignore-comment-utils.js"
import { buildIgnoreReport, collectIgnoreMarkers, normalizeReason } from "../bin/report-ignores.js"

const ROOT = process.cwd()
const dirs: string[] = []

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

/** 一時ディレクトリに「リポ」ごとのファイルを書く。戻り値はリポ名 → 絶対パス */
function fixture(repos: Record<string, Record<string, string>>) {
  const base = mkdtempSync(join(tmpdir(), "ksk-report-ignores-"))
  dirs.push(base)
  const paths: Record<string, string> = {}
  for (const [name, files] of Object.entries(repos)) {
    const repoDir = join(base, name)
    mkdirSync(repoDir, { recursive: true })
    for (const [rel, content] of Object.entries(files)) {
      const abs = join(repoDir, rel)
      mkdirSync(dirname(abs), { recursive: true })
      writeFileSync(abs, content)
    }
    paths[name] = repoDir
  }
  return paths
}

function cli(args: string[]) {
  return spawnSync("node", [join(ROOT, "bin/init.js"), "report-ignores", ...args], {
    cwd: ROOT,
    encoding: "utf8",
  })
}

const REPOS = {
  "app-a": {
    "src/logo.tsx": [
      "// ksk-ds-lint-ignore P008 -- ブランドロゴの規定色",
      'const logo = "#ff0000"',
      "// ksk-ds-lint-ignore P001 -- 公開ページなので DS ランタイムを載せない",
    ].join("\n"),
    "src/consts.ts": "// ksk-ds-lint-ignore-file P008 -- ブランド定数ファイル\nexport const A = 1\n",
    "src/media.tsx": "// ksk-ds-allow-custom-ui: medical chart requires bespoke interaction\nexport const B = 1\n",
    "src/fallback.tsx": "// ksk-ds-local-fallback: DS に ActionTile が追加されたら削除 (issue #123)\nexport const C = 1\n",
    "src/theme.css": "/* ksk-ds-lint-ignore P008 -- ブランドロゴの規定色 */\n.a { color: red; }\n",
    "node_modules/dep/index.js": "// ksk-ds-lint-ignore P008 -- node_modules の中は数えない\n",
    "dist/out.js": "// ksk-ds-lint-ignore P008 -- dist の中は数えない\n",
    "src/readme.md": "// ksk-ds-lint-ignore P008 -- 対象外の拡張子は数えない\n",
  },
  "app-b": {
    "src/header.tsx": "{/* ksk-ds-lint-ignore P008 -- ブランドロゴの規定色。 */}\n<div />\n",
    "src/fallback.tsx": "// ksk-ds-local-fallback: DS に ActionTile が追加されたら削除 (issue #77)\nexport const D = 1\n",
    "src/strings.ts": [
      'const doc = "// ksk-ds-lint-ignore P008 -- 文字列リテラルの中は数えない"',
      "const doc2 = `ksk-ds-allow-custom-ui: これも文字列の中`",
      "export { doc, doc2 }",
    ].join("\n"),
    "src/weak.tsx": [
      "// ksk-ds-lint-ignore P002 -- x",
      "// ksk-ds-lint-ignore P002",
      "// ksk-ds-allow-custom-ui: ok",
      "// ksk-ds-local-fallback",
    ].join("\n"),
  },
  "app-c": {
    "src/solo.tsx": "// ksk-ds-lint-ignore P099 -- このアプリだけが外している理由です\n",
  },
}

describe("collectIgnoreMarkers", () => {
  it("lint.js の文法と同じ 4 種類（＋DS 内部用）のマーカーを拾う", () => {
    const markers = collectIgnoreMarkers(
      [
        "// ksk-ds-lint-ignore P008 -- ブランドロゴの規定色",
        "// ksk-ds-lint-ignore-file P007 -- ブランド定数ファイル",
        "// ksk-ds-allow-custom-ui: medical chart requires bespoke interaction",
        "// ksk-ds-local-fallback: DS に X が追加されたら削除 (issue #123)",
        "// ksk-lint-ignore KFX001 -- meta はアイコン1文字で潰れ得ない",
      ].join("\n"),
    )
    expect(markers.map((m) => [m.kind, m.rule, m.line, m.valid])).toEqual([
      ["lint-ignore", "P008", 1, true],
      ["lint-ignore-file", "P007", 2, true],
      ["allow-custom-ui", "ksk-ds-allow-custom-ui", 3, true],
      ["local-fallback", "ksk-ds-local-fallback", 4, true],
      ["internal-ignore", "KFX001", 5, true],
    ])
    expect(markers[3].issues).toEqual([123])
  })

  it("文字列リテラル中のマーカーは数えず、コメント中だけ数える", () => {
    const source = [
      'const a = "// ksk-ds-lint-ignore P008 -- 文字列の中なので無視"',
      "const b = `ksk-ds-allow-custom-ui: 文字列の中なので無視`",
      "const c = 1 // ksk-ds-lint-ignore P001 -- 行末コメントは数える",
    ].join("\n")
    const markers = collectIgnoreMarkers(source)
    expect(markers).toHaveLength(1)
    expect(markers[0]).toMatchObject({ rule: "P001", line: 3, valid: true })
  })

  it("コメントの閉じ記号を理由から外し、短い・空の理由を valid=false にする", () => {
    const markers = collectIgnoreMarkers(
      [
        "{/* ksk-ds-lint-ignore P008 -- ブランドロゴの規定色 */}",
        "/* ksk-ds-allow-custom-ui: medical chart requires bespoke interaction */",
        "// ksk-ds-lint-ignore P002 -- x",
        "// ksk-ds-lint-ignore P002",
        "// ksk-ds-local-fallback",
      ].join("\n"),
    )
    expect(markers[0].reason).toBe("ブランドロゴの規定色")
    expect(markers[1].reason).toBe("medical chart requires bespoke interaction")
    expect(markers.map((m) => m.valid)).toEqual([true, true, false, false, false])
  })

  it("lint.js の isMeaningfulReason と同じ基準（5 文字）で有効/無効を分ける", () => {
    const at = (reason: string) => collectIgnoreMarkers(`// ksk-ds-lint-ignore P008 -- ${reason}`)[0].valid
    expect(at("abcd")).toBe(false)
    expect(at("abcde")).toBe(true)
    expect(at("理由あり")).toBe(false)
    expect(at("理由があります")).toBe(true)
  })

  it("ルール ID に見えない語（散文中の言及）は拾わない", () => {
    expect(collectIgnoreMarkers("// use ksk-ds-lint-ignore to suppress")).toEqual([])
  })
})

describe("maskCodeStrings（lint.js から切り出した共有実装）", () => {
  it("文字列の中身だけを空白にし、コメントと行番号・文字数を保つ", () => {
    const source = 'const a = "ksk-ds-allow-custom-ui: x" // ksk-ds-allow-custom-ui: コメント\nconst b = 1'
    const masked = maskCodeStrings(source)
    expect(masked).toHaveLength(source.length)
    expect(masked.split("\n")).toHaveLength(2)
    expect(masked.split("\n")[0]).toContain("// ksk-ds-allow-custom-ui: コメント")
    expect(masked.split("\n")[0]).not.toContain('"ksk-ds-allow')
  })
})

describe("normalizeReason", () => {
  it("小文字化・空白圧縮・句読点と issue 番号の除去", () => {
    expect(normalizeReason("DS に  ActionTile が追加されたら削除 (issue #123)")).toBe(
      normalizeReason("ds に actiontile が追加されたら削除（issue #77）"),
    )
    expect(normalizeReason("Brand Logo。")).toBe("brand logo")
  })
})

describe("buildIgnoreReport", () => {
  it("ルール別に件数・リポ数・理由・出現ファイルを集計し、除外ディレクトリと文字列内マーカーを無視する", () => {
    const paths = fixture(REPOS)
    const report = buildIgnoreReport([paths["app-a"], paths["app-b"], paths["app-c"]])

    expect(report.repos.map((r) => r.name)).toEqual(["app-a", "app-b", "app-c"])

    const p008 = report.byRule.find((r) => r.rule === "P008")!
    // app-a: logo.tsx / consts.ts(-file) / theme.css、app-b: header.tsx
    expect(p008.count).toBe(4)
    expect(p008.repos).toEqual(["app-a", "app-b"])
    // 「ブランドロゴの規定色」は句読点違いを正規化して 1 つにまとまる（3 件）
    expect(p008.reasons[0]).toMatchObject({ count: 3 })
    expect(p008.reasons[0].text).toContain("ブランドロゴの規定色")
    expect(p008.reasons).toHaveLength(2)
    expect(p008.files.map((f) => `${f.repo}/${f.file}:${f.line}`)).toEqual([
      "app-a/src/consts.ts:1",
      "app-a/src/logo.tsx:1",
      "app-a/src/theme.css:1",
      "app-b/src/header.tsx:1",
    ])

    // node_modules / dist / .md / 文字列内の ignore は含まれない
    const allFiles = report.byRule.flatMap((r) => r.files.map((f) => f.file))
    expect(allFiles.some((f) => f.includes("node_modules") || f.includes("dist/") || f.endsWith(".md"))).toBe(false)
    expect(allFiles).not.toContain("src/strings.ts")

    const custom = report.byRule.find((r) => r.rule === "ksk-ds-allow-custom-ui")!
    expect(custom.count).toBe(1)
    expect(custom.repos).toEqual(["app-a"])
  })

  it("理由不足（短い・空）は invalid に別カウントし、byRule の件数には含めない", () => {
    const paths = fixture(REPOS)
    const report = buildIgnoreReport([paths["app-a"], paths["app-b"], paths["app-c"]])
    expect(report.invalid.map((i) => `${i.file}:${i.line}:${i.rule}`)).toEqual([
      "src/weak.tsx:1:P002",
      "src/weak.tsx:2:P002",
      "src/weak.tsx:3:ksk-ds-allow-custom-ui",
    ])
    expect(report.invalid.every((i) => i.repo === "app-b")).toBe(true)
    expect(report.byRule.find((r) => r.rule === "P002")).toBeUndefined()
  })

  it("local-fallback は lint 上の「無効」に入れず、別枠（incompleteFallbacks）で理由・issue 番号の不足を報告する", () => {
    const paths = fixture({
      app: {
        "src/a.tsx": [
          "// ksk-ds-local-fallback", // 理由なし
          "// ksk-ds-local-fallback: DS に ActionTile が追加されたら削除", // 理由あり・issue なし
          "// ksk-ds-local-fallback: DS に ActionTile が追加されたら削除 (issue #5)", // 完全
          "// ksk-ds-local-fallback: 背景は #333 の濃色にする暫定対応", // 色コードは issue ではない
        ].join("\n"),
      },
    })
    const report = buildIgnoreReport([paths.app])
    expect(report.invalid).toEqual([])
    expect(report.incompleteFallbacks.map((i) => i.line)).toEqual([1, 2, 4])
    const fallback = report.byRule.find((r) => r.rule === "ksk-ds-local-fallback")!
    expect(fallback.issues).toEqual([{ number: 5, repos: ["app"] }])
    const text = cli([paths.app]).stdout
    expect(text).toContain("■ 理由・issue 番号が不足した local-fallback: 3 件")
    expect(text).not.toContain("lint 上は無効な ignore")
  })

  it("lint が有効とする入力（閉じ記号付きの短い理由）を理由不足にしない", () => {
    const paths = fixture({
      app: {
        "src/a.tsx": [
          "{/* ksk-ds-allow-custom-ui: abcd */}", // lint は `abcd */}` を見るので有効
          "/* ksk-ds-allow-custom-ui: abcd */", // lint は `abcd */` → 末尾の */ を除いて 4 文字 → 無効
          "// ksk-ds-lint-ignore P008 -- abcd",
        ].join("\n"),
      },
    })
    const report = buildIgnoreReport([paths.app])
    expect(report.invalid.map((i) => i.line)).toEqual([2, 3])
    expect(report.byRule.find((r) => r.rule === "ksk-ds-allow-custom-ui")!.count).toBe(1)
    // 表示用の理由は閉じ記号を外す
    expect(report.invalid[0].reason).toBe("abcd")
  })

  it("lint の既定除外（out / .nuxt / .output / .svelte-kit）と .expo は走査しない", () => {
    const marker = "// ksk-ds-lint-ignore P008 -- 除外ディレクトリの中は数えない\n"
    const paths = fixture({
      app: {
        "out/a.js": marker,
        ".nuxt/a.js": marker,
        ".output/a.js": marker,
        ".svelte-kit/a.js": marker,
        ".expo/a.js": marker,
        "src/ok.ts": "// ksk-ds-lint-ignore P008 -- 走査される通常のソースです\n",
      },
    })
    const report = buildIgnoreReport([paths.app])
    expect(report.byRule[0].files.map((f) => f.file)).toEqual(["src/ok.ts"])
  })

  it("local-fallback は issue 番号を抽出し、同じ理由なら issue 番号違いでも 1 つにまとめる", () => {
    const paths = fixture(REPOS)
    const report = buildIgnoreReport([paths["app-a"], paths["app-b"]])
    const fallback = report.byRule.find((r) => r.rule === "ksk-ds-local-fallback")!
    expect(fallback.count).toBe(2)
    expect(fallback.reasons).toHaveLength(1)
    expect(fallback.reasons[0].count).toBe(2)
    expect(fallback.issues).toEqual([
      { number: 77, repos: ["app-b"] },
      { number: 123, repos: ["app-a"] },
    ])
  })

  it("--min-repos 相当: 既定 2 リポ以上を候補にし、閾値を変えると増減する", () => {
    const paths = fixture(REPOS)
    const all = [paths["app-a"], paths["app-b"], paths["app-c"]]
    const byDefault = buildIgnoreReport(all)
    expect(byDefault.candidates.map((c) => c.rule).sort()).toEqual(["P008", "ksk-ds-local-fallback"].sort())
    const p008 = byDefault.candidates.find((c) => c.rule === "P008")!
    expect(p008.repos).toEqual(["app-a", "app-b"])
    expect(byDefault.candidates.find((c) => c.rule === "ksk-ds-local-fallback")!.issues).toHaveLength(2)

    expect(buildIgnoreReport(all, { minRepos: 1 }).candidates.map((c) => c.rule)).toContain("P099")
    expect(buildIgnoreReport(all, { minRepos: 3 }).candidates).toEqual([])
  })

  it("--rule 相当: 指定ルールだけ集計する（大文字小文字は区別しない）", () => {
    const paths = fixture(REPOS)
    const report = buildIgnoreReport([paths["app-a"], paths["app-b"]], { rule: "p008" })
    expect(report.byRule.map((r) => r.rule)).toEqual(["P008"])
    expect(report.invalid).toEqual([])
  })

  it("同名ディレクトリが複数あっても別リポとして数える", () => {
    const a = fixture({ web: { "src/a.ts": "// ksk-ds-lint-ignore P008 -- 一つ目のリポの理由です\n" } })
    const b = fixture({ web: { "src/a.ts": "// ksk-ds-lint-ignore P008 -- 二つ目のリポの理由です\n" } })
    const report = buildIgnoreReport([a.web, b.web])
    expect(report.byRule[0].repos).toHaveLength(2)
  })
})

describe("ksk-ds report-ignores（CLI）", () => {
  it("テキスト出力: ルール別集計・理由不足・DS issue 候補を出し exit 0", () => {
    const paths = fixture(REPOS)
    const result = cli([paths["app-a"], paths["app-b"], paths["app-c"]])
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("3 リポ")
    expect(result.stdout).toContain("■ P008  件数 4 / リポ 2（app-a, app-b）")
    expect(result.stdout).toContain("ブランドロゴの規定色")
    expect(result.stdout).toContain("理由不足")
    expect(result.stdout).toContain("■ DS issue 候補（2 リポ以上で同じルールが外されている）")
    expect(result.stdout).toContain("P008 — app-a, app-b")
    expect(result.stdout).toContain("#123（app-a）")
    expect(result.stdout).toContain("#77（app-b）")
  })

  it("--json: { repos, byRule, candidates, invalid } の形で出力する", () => {
    const paths = fixture(REPOS)
    const result = cli([paths["app-a"], paths["app-b"], paths["app-c"], "--json"])
    expect(result.status).toBe(0)
    const json = JSON.parse(result.stdout)
    expect(Object.keys(json).sort()).toEqual(["byRule", "candidates", "incompleteFallbacks", "invalid", "repos"])
    expect(json.repos).toHaveLength(3)
    const p008 = json.byRule.find((r: { rule: string }) => r.rule === "P008")
    expect(p008).toMatchObject({ rule: "P008", count: 4, repos: ["app-a", "app-b"] })
    expect(p008.reasons[0]).toEqual({ text: expect.any(String), count: 3 })
    expect(p008.files[0]).toEqual({ repo: "app-a", file: "src/consts.ts", line: 1 })
    expect(json.invalid).toHaveLength(3)
    expect(json.incompleteFallbacks).toHaveLength(1)
    expect(json.candidates.map((c: { rule: string }) => c.rule)).toContain("P008")
  })

  it("--min-repos / --rule をそのまま受ける", () => {
    const paths = fixture(REPOS)
    const all = [paths["app-a"], paths["app-b"], paths["app-c"]]
    const min3 = JSON.parse(cli([...all, "--json", "--min-repos", "3"]).stdout)
    expect(min3.candidates).toEqual([])
    const min1 = JSON.parse(cli([...all, "--json", "--min-repos=1"]).stdout)
    expect(min1.candidates.map((c: { rule: string }) => c.rule)).toContain("P099")
    const only = JSON.parse(cli([...all, "--json", "--rule", "P099"]).stdout)
    expect(only.byRule.map((r: { rule: string }) => r.rule)).toEqual(["P099"])
  })

  it("symlink のディレクトリを引数に渡しても集計できる（サブディレクトリの symlink は辿らない）", () => {
    const real = fixture({ real: { "src/a.ts": "// ksk-ds-lint-ignore P008 -- 実体側のディレクトリの理由\n" } })
    const linkBase = mkdtempSync(join(tmpdir(), "ksk-report-ignores-link-"))
    dirs.push(linkBase)
    const link = join(linkBase, "linked-app")
    symlinkSync(real.real, link)
    // サブディレクトリの symlink（ループ防止のため辿らない）
    symlinkSync(real.real, join(real.real, "src", "loop"))

    const result = cli([link, "--json"])
    expect(result.status).toBe(0)
    const json = JSON.parse(result.stdout)
    expect(json.repos[0]).toMatchObject({ name: "linked-app", files: 1 })
    expect(json.byRule[0]).toMatchObject({ rule: "P008", count: 1 })
  })

  it("マーカーが 1 件も無くても exit 0", () => {
    const paths = fixture({ empty: { "src/a.ts": "export const a = 1\n" } })
    const result = cli([paths.empty])
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("ignore コメントは見つかりませんでした")
  })

  it("引数不正は exit 2（ディレクトリ無し・存在しない・未知オプション・不正な --min-repos）", () => {
    const paths = fixture({ a: { "src/a.ts": "export const a = 1\n" } })
    expect(cli([]).status).toBe(2)
    expect(cli([join(paths.a, "no-such-dir")]).status).toBe(2)
    expect(cli([paths.a, "--nope"]).status).toBe(2)
    expect(cli([paths.a, "--min-repos", "0"]).status).toBe(2)
    expect(cli([paths.a, "--min-repos", "abc"]).status).toBe(2)
    expect(cli([paths.a, "--rule"]).status).toBe(2)
    expect(cli([paths.a, "--rule", "--json"]).status).toBe(2)
    expect(cli([]).stderr).toContain("report-ignores")
  })

  it("--help と ksk-ds help に載る", () => {
    const help = cli(["--help"])
    expect(help.status).toBe(0)
    expect(help.stdout).toContain("--min-repos")
    const top = spawnSync("node", [join(ROOT, "bin/init.js"), "help"], { cwd: ROOT, encoding: "utf8" })
    expect(top.stdout).toContain("report-ignores")
  })
})
