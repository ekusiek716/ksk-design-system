import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { stripComments } from "../scripts/lib/strip-comments.mjs"

describe("stripComments", () => {
  it("行コメント / ブロックコメント / JSDoc を空白にする", () => {
    const out = stripComments(
      [
        "const a = 1 // !bg-red-500",
        "/* !bg-blue-500 */",
        "/**",
        " * consumer が `[&>[data-slot=header]]:!grid` のように上書きする",
        " */",
        'const b = "!bg-green-500"',
      ].join("\n"),
    )
    expect(out).not.toContain("!bg-red-500")
    expect(out).not.toContain("!bg-blue-500")
    expect(out).not.toContain(":!grid")
    // 実コード（文字列リテラル）は残る
    expect(out).toContain("!bg-green-500")
  })

  it("行番号を保存する（file:line 報告のため）", () => {
    const src = "/* a\nb\nc */\nconst x = 1\n"
    expect(stripComments(src).split("\n")).toHaveLength(src.split("\n").length)
    expect(stripComments(src).split("\n")[3]).toBe("const x = 1")
  })

  it("正規表現リテラル内の /* をブロックコメント開始と誤認しない", () => {
    // 誤認すると以降のファイル全体が空白化し、違反を静かに取りこぼす
    const out = stripComments(['const RE = /[/*]/', 'const cls = "!bg-red-500"'].join("\n"))
    expect(out).toContain("!bg-red-500")
  })

  it("JSX 閉じタグの / を正規表現開始と誤認しない", () => {
    const out = stripComments('const A = <div><span>ok</span>{/* docs: !bg-red-500 */}</div>')
    expect(out).not.toContain("!bg-red-500")
    expect(out).toContain("</span>")
  })

  it("アロー関数の式本体の正規表現も認識する（=> の > は JSX ではない）", () => {
    const out = stripComments('const f = () => /[/*]/\nconst cls = "!bg-red-500"')
    expect(out).toContain("!bg-red-500")
  })

  it("JSX テキスト中の URL を行コメント開始と誤認しない", () => {
    const out = stripComments(
      'const A = <span>https://example.com</span>\nconst cls = "!bg-red-500"',
    )
    expect(out).toContain("https://example.com")
    expect(out).toContain("!bg-red-500")
  })

  it("URL が同じ行にあっても以降を空白化しない", () => {
    const out = stripComments('const A = <a href="https://x.dev">x</a> // メモ')
    expect(out).toContain("https://x.dev")
    expect(out).not.toContain("メモ")
  })

  it("除算はそのまま通す", () => {
    const out = stripComments('const r = width / 2\nconst cls = "!bg-red-500"')
    expect(out).toContain("width / 2")
    expect(out).toContain("!bg-red-500")
  })

  it("テンプレートリテラルの ${} 内のコメントは潰す", () => {
    const out = stripComments("const s = `x ${ /* !bg-red-500 */ y } z`")
    expect(out).not.toContain("!bg-red-500")
    expect(out).toContain("x ")
  })

  it("テンプレートリテラル本文のクラス名は残す", () => {
    const out = stripComments("const s = `!bg-red-500 ${x}`")
    expect(out).toContain("!bg-red-500")
  })

  it("${} を抜けたあとテンプレート本文として読み続ける", () => {
    const out = stripComments("const s = `a${ { k: 1 } }!bg-red-500`")
    expect(out).toContain("!bg-red-500")
  })
})

describe("check-tailwind-v4.mjs", () => {
  const ROOT = process.cwd()

  function runOnFixture(source: string) {
    const dir = mkdtempSync(join(tmpdir(), "ksk-ds-tw-"))
    const file = join(ROOT, "src", `__tw_fixture_${dir.split("-").pop()}.tsx`)
    writeFileSync(file, source)
    try {
      return spawnSync("node", [join(ROOT, "scripts/check-tailwind-v4.mjs")], {
        cwd: ROOT,
        encoding: "utf8",
      })
    } finally {
      rmSync(file, { force: true })
      rmSync(dir, { recursive: true, force: true })
    }
  }

  it("実コードの先頭 ! を検出する", () => {
    const result = runOnFixture(`export const A = <div className="!bg-[var(--x)]" />\n`)
    expect(result.status).toBe(1)
  })

  it("実コードの空白なし calc() を検出する", () => {
    const result = runOnFixture(`export const A = <div className="w-[calc(100%-2rem)]" />\n`)
    expect(result.status).toBe(1)
  })

  it("JSDoc 内の記法例は検出しない", () => {
    const result = runOnFixture(
      `/**\n * 例: \`!bg-[var(--x)]\` / \`w-[calc(100%-2rem)]\`\n */\nexport const A = 1\n`,
    )
    expect(result.status).toBe(0)
  })

  it("正規表現リテラルのあとの違反を取りこぼさない", () => {
    const result = runOnFixture(
      `const RE = /[/*]/\nexport const A = <div className="!bg-[var(--x)]" />\n`,
    )
    expect(result.status).toBe(1)
  })

  it("アロー関数の式本体の正規表現のあとの違反を取りこぼさない", () => {
    const result = runOnFixture(
      `const f = () => /[/*]/\nexport const A = <div className="!bg-[var(--x)]" />\n`,
    )
    expect(result.status).toBe(1)
  })

  it("JSX テキストの URL のあとの違反を取りこぼさない", () => {
    const result = runOnFixture(
      `export const A = <div><span>https://example.com</span><div className="!bg-[var(--x)]" /></div>\n`,
    )
    expect(result.status).toBe(1)
  })

  it("JSX 閉じタグの直後の JSX コメントは検出しない", () => {
    const result = runOnFixture(
      `export const A = <div><span>ok</span>{/* 例: !bg-[var(--x)] */}</div>\n`,
    )
    expect(result.status).toBe(0)
  })
})
