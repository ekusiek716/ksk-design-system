import { describe, expect, it, vi } from "vitest"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { runLintCli } from "../bin/lint.js"

/**
 * lint CLI の信頼性回帰（issue #405 / #406 / #407 / #408）。
 *
 * - #405 ファイル全体 escape が文字列リテラルからも発火し、理由1文字で無期限に効く
 * - #406 warning が exit code に影響せず、未知フラグが黙って捨てられる
 * - #407 P049 が DS 自身 / ベンダリング DS のトークン CSS を誤検知する
 * - #408 P008 が自動生成物とブランド規定色を撃ち抜く
 */

const PKG_ROOT = resolve(process.cwd())

type Finding = { file: string; line: number; ruleId: string; severity: string }

async function lint(files: Record<string, string>, args: string[] = []) {
  const cwd = mkdtempSync(join(tmpdir(), "ksk-ds-lint-escape-"))
  for (const [name, content] of Object.entries(files)) {
    const abs = join(cwd, name)
    mkdirSync(join(abs, ".."), { recursive: true })
    writeFileSync(abs, content)
  }
  const stdout: string[] = []
  const stderr: string[] = []
  const logSpy = vi.spyOn(console, "log").mockImplementation((...a) => void stdout.push(a.join(" ")))
  const errSpy = vi.spyOn(console, "error").mockImplementation((...a) => void stderr.push(a.join(" ")))
  try {
    const status = await runLintCli([cwd, "--format", "json", ...args], { cwd, pkgRoot: PKG_ROOT })
    const raw = stdout.join("\n")
    return {
      status,
      stderr: stderr.join("\n"),
      results: (raw ? (JSON.parse(raw).results as Finding[]) : []),
    }
  } finally {
    logSpy.mockRestore()
    errSpy.mockRestore()
  }
}

const ids = (results: Finding[]) => results.map((f) => f.ruleId)

const VIOLATIONS = `export function Example() {
  return (
    <div style={{ color: "#FF0000" }}>
      <button>a</button>
    </div>
  )
}
`

describe("issue #405 — escape の暴発と過剰スコープ", () => {
  it("文字列リテラル内の ksk-ds-allow-custom-ui では発火しない", async () => {
    const { status, results } = await lint({
      "Example.tsx": `const DOC_URL = "https://example.com/ksk-ds-allow-custom-ui: see docs"\n${VIOLATIONS}`,
    })
    expect(status).toBe(1)
    expect(ids(results)).toEqual(expect.arrayContaining(["P001", "P008"]))
  })

  it("コメントに書かれた十分な理由付き escape はこれまでどおりファイル全体を外す", async () => {
    const { status, results } = await lint({
      "Example.tsx": `// ksk-ds-allow-custom-ui: medical chart requires bespoke interaction\n${VIOLATIONS}`,
    })
    expect(status).toBe(0)
    expect(results).toEqual([])
  })

  it("空虚な理由（1文字）の escape は無効で ESCAPE001 になる", async () => {
    const { status, results } = await lint({
      "Example.tsx": `// ksk-ds-allow-custom-ui: x\n${VIOLATIONS}`,
    })
    expect(status).toBe(1)
    expect(ids(results)).toContain("ESCAPE001")
    expect(ids(results)).toContain("P001")
  })

  it("ルール単位・行単位の escape は指定ルールだけを近傍行で外す", async () => {
    const { status, results } = await lint({
      "Example.tsx": `export const C = {
  // ksk-ds-lint-ignore P008 -- ブランドロゴの規定色のため
  brand: "#FF0000",
}
export function Example() {
  return <button style={{ color: "#00FF00" }}>a</button>
}
`,
    })
    expect(status).toBe(1)
    // 1件目の hex は ignore されるが、離れた行の hex と P001 は残る
    expect(ids(results)).toContain("P001")
    expect(ids(results)).toContain("P008")
    expect(results.filter((f) => f.ruleId === "P008")).toHaveLength(1)
  })

  it("ルール単位 escape に理由が無ければ ESCAPE002 になり ignore は効かない", async () => {
    const { status, results } = await lint({
      "Example.tsx": `export const C = {
  // ksk-ds-lint-ignore P008
  brand: "#FF0000",
}
`,
    })
    expect(status).toBe(1)
    expect(ids(results)).toContain("ESCAPE002")
    expect(ids(results)).toContain("P008")
  })

  it("ファイルスコープの ksk-ds-lint-ignore-file は指定ルールだけを全体で外す", async () => {
    const { status, results } = await lint({
      "brand.tsx": `// ksk-ds-lint-ignore-file P008 -- 各社のブランドロゴ規定色
export const BRAND = { x: "#000000", line: "#06C755" }
export function Example() {
  return <button>a</button>
}
`,
    })
    expect(status).toBe(1)
    expect(ids(results)).not.toContain("P008")
    expect(ids(results)).toContain("P001")
  })
})

describe("issue #406 — warning の exit code と未知フラグ", () => {
  const WARN_ONLY = `export function Example() {\n  return <img src="/a.png" />\n}\n`

  it("既定では warning のみなら exit 0", async () => {
    const { status, results } = await lint({ "Example.tsx": WARN_ONLY })
    expect(status).toBe(0)
    expect(ids(results)).toContain("P025")
  })

  it("--strict なら warning でも exit 1", async () => {
    const { status } = await lint({ "Example.tsx": WARN_ONLY }, ["--strict"])
    expect(status).toBe(1)
  })

  it("--max-warnings=0 なら warning 1件で exit 1", async () => {
    const { status } = await lint({ "Example.tsx": WARN_ONLY }, ["--max-warnings=0"])
    expect(status).toBe(1)
  })

  it("--max-warnings が件数以上なら exit 0", async () => {
    const { status } = await lint({ "Example.tsx": WARN_ONLY }, ["--max-warnings", "5"])
    expect(status).toBe(0)
  })

  it("未知フラグは黙って捨てず exit 1 + 使い方表示", async () => {
    const { status, stderr } = await lint({ "Example.tsx": WARN_ONLY }, ["--typo"])
    expect(status).toBe(1)
    expect(stderr).toContain("未知のオプションです: --typo")
    expect(stderr).toContain("--max-warnings")
  })

  it("--max-warnings の不正値はエラー終了", async () => {
    const { status, stderr } = await lint({ "Example.tsx": WARN_ONLY }, ["--max-warnings=abc"])
    expect(status).toBe(1)
    expect(stderr).toContain("--max-warnings")
  })

  it("severity 語彙は contract 側の warning に揃っている", async () => {
    const { results } = await lint({ "Example.tsx": WARN_ONLY })
    expect([...new Set(results.map((f) => f.severity))]).toEqual(["warning"])
  })
})

describe("issue #407 — P049 が DS 自身 / ベンダリング DS を誤検知しない", () => {
  it("DS 正本と同内容のベンダリング CSS は P049 の対象外", async () => {
    const semantic = readFileSync(join(PKG_ROOT, "src/styles/semantic.css"), "utf8")
    const { results } = await lint({ "vendor/ksk-design-system/src/styles/semantic.css": semantic })
    expect(ids(results)).not.toContain("P049")
  })

  it("古いバージョンのベンダリング（同名 ＋ DS 署名ヘッダ）も対象外", async () => {
    const { results } = await lint({
      "vendor/ksk-design-system/src/styles/primitive.css": `/* =============================================================
   KSK Design System — Primitive Color Tokens

   ============================================================= */
:root { --Primitive-Gray-50: #F9FAFB; }
`,
    })
    expect(ids(results)).not.toContain("P049")
  })

  it("consumer 自身の許可リスト外の上書きは引き続き P049 になる", async () => {
    const { results } = await lint({
      "src/theme.css": `:root { --Surface-Primary: #fff; --Z-Modal: 999; }\n`,
    })
    expect(ids(results)).toContain("P049")
  })
})

describe("issue #408 — 自動生成物は全ルールを skip", () => {
  it("日本語の自動生成ヘッダを持つファイルは lint されない", async () => {
    const { status, results } = await lint({
      "tokens.ts": `// =============================================================
// このファイルは scripts/generate-platform-tokens.mjs により自動生成されています。
// 直接編集しないでください。
// =============================================================
export const t = { primary: "#3B82F6" }
`,
    })
    expect(status).toBe(0)
    expect(results).toEqual([])
  })

  it("AUTO-GENERATED / DO NOT EDIT ヘッダも同様に skip", async () => {
    const { results } = await lint({
      "icons.tsx": `// AUTO-GENERATED by scripts/generate-social-icons.mjs — DO NOT EDIT.\nexport const c = "#FF0000"\n`,
    })
    expect(results).toEqual([])
  })

  it("本文の遠くに同じ文言があるだけの手書きファイルは skip されない", async () => {
    const { results } = await lint({
      "Example.tsx": `${"\n".repeat(20)}// DO NOT EDIT\nexport const c = "#FF0000"\n`,
    })
    expect(ids(results)).toContain("P008")
  })
})

describe("DS 自身の self-lint", () => {
  it("src への lint で P008 / P049 の誤検知が 0 件", async () => {
    const stdout: string[] = []
    const logSpy = vi.spyOn(console, "log").mockImplementation((...a) => void stdout.push(a.join(" ")))
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    try {
      await runLintCli(["src", "--format", "json"], { cwd: PKG_ROOT, pkgRoot: PKG_ROOT })
    } finally {
      logSpy.mockRestore()
      errSpy.mockRestore()
    }
    const results = JSON.parse(stdout.join("\n")).results as Finding[]
    expect(results.filter((f) => f.ruleId === "P008")).toEqual([])
    expect(results.filter((f) => f.ruleId === "P049")).toEqual([])
  })
})
