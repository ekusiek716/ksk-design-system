import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function runKskLint(source: string, extraArgs: string[] = []) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-consumer-lint-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, "Example.tsx")
  writeFileSync(file, source)
  return spawnSync(process.execPath, ["bin/init.js", "lint", file, ...extraArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

describe("consumer lint CLI", () => {
  // issue #394: process.exit() は stdout がパイプのとき未フラッシュ分を捨てる。
  // 出力がパイプバッファ（64KB）を超えると途中で切られ、壊れた JSON が相手に渡っていた
  // （belle-todo で `--format json | jq` がパースエラー。ファイルへのリダイレクトでは
  // 書き込みが同期なので再現せず、パイプのときだけ壊れる）。
  it("--format json の出力がパイプバッファ(64KB)を超えても壊れない", () => {
    const dir = mkdtempSync(join(tmpdir(), "ksk-ds-lint-bigout-"))
    const srcDir = join(dir, "src")
    mkdirSync(srcDir)
    // 1ファイルあたり複数違反 × 40ファイルで、JSON が 64KB を確実に超えるようにする
    const body = Array.from(
      { length: 5 },
      () => `  <div className="text-blue-500 bg-red-500" />`,
    ).join("\n")
    for (let i = 0; i < 40; i++) {
      writeFileSync(join(srcDir, `F${i}.tsx`), `export const F${i} = () => (\n<>\n${body}\n</>\n)\n`)
    }

    const result = spawnSync(process.execPath, ["bin/init.js", "lint", srcDir, "--format", "json"], {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    })

    // 前提（これを下回ると truncation を検出できないテストになる）
    expect(result.stdout.length).toBeGreaterThan(65536)
    const payload = JSON.parse(result.stdout)
    expect(payload.results.length).toBeGreaterThan(0)
  })


  // issue #378: ビルド生成物を走査すると、バンドルされた DS 自身の CSS を
  // 「consumer が DS 変数を上書きしている」と誤認して P049 が大量に出る。
  // belle-todo の実測でリポジトリ全体 1,955 件 → 33 件（src 限定と同数）。
  it("ビルド生成物（out / Capacitor の public コピー）を走査しない", () => {
    const dir = mkdtempSync(join(tmpdir(), "ksk-ds-lint-ignore-"))
    // DS 自身の内部変数を含む「バンドル済み CSS」を各生成物ディレクトリに置く
    const bundled = ":root{--Hover-Primary-Button:#123456;--Brand-Light:#654321}"
    for (const rel of [
      "out/_next/static/chunks/app.css",
      "ios/App/App/public/assets/index.css",
      "android/app/src/main/assets/public/assets/index.css",
      ".claude/worktrees/wt/src/styles/theme.css",
    ]) {
      const file = join(dir, rel)
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, bundled)
    }
    // 本物の src だけは検出されること（対照）
    const srcFile = join(dir, "src/styles/theme.css")
    mkdirSync(dirname(srcFile), { recursive: true })
    writeFileSync(srcFile, bundled)

    const result = spawnSync(process.execPath, ["bin/init.js", "lint", dir, "--format", "json"], {
      cwd: process.cwd(),
      encoding: "utf8",
    })
    const payload = JSON.parse(result.stdout)
    const p049 = payload.results.filter((f: { ruleId: string }) => f.ruleId === "P049")
    expect(p049.length).toBeGreaterThan(0)
    for (const f of p049 as { file: string }[]) {
      expect(f.file).toContain("src/styles/theme.css")
      expect(f.file).not.toMatch(/(^|\/)(out|\.claude)\//)
      expect(f.file).not.toContain("App/public")
      expect(f.file).not.toContain("assets/public")
    }
  })


  // issue #374: P032 の否定先読みは「マッチ位置より後ろ」しか見ないため、
  // `border-[var(...)]` の `border` 部分自身にマッチして色指定そのものを違反に
  // 数えていた。ルールの fix が案内する形（色併記 / transparent + 状態クラス）が
  // どちらも消えず、ninshin-todo で 161 件中 148 件が誤検知だった。
  it("P032: 色をトークンで併記した border は違反にしない（自己マッチの回帰）", () => {
    const result = runKskLint(`
      export function Probe() {
        return (
          <>
            <div className="border rounded-lg p-3">A</div>
            <div className="border border-[var(--Border-Low-Emphasis)] rounded-lg p-3">B</div>
            <div className="border border-transparent data-[state=active]:border-[var(--Brand-Primary)]">C</div>
            <div className="border-b border-[var(--Border-Low-Emphasis)]">D</div>
            <div className="border-[var(--Border-Low-Emphasis)] p-2">E</div>
          </>
        )
      }
    `, ["--format", "json"])
    const payload = JSON.parse(result.stdout)
    const p032 = payload.results.filter((f: { ruleId: string; line: number }) => f.ruleId === "P032")
    // 本物の違反は A（5行目）だけ。B〜E は fix が案内する形なので検出しない
    expect(p032.map((f: { line: number }) => f.line)).toEqual([5])
  })


  it("reports contract-backed DS violations with file and fix", () => {
    const result = runKskLint(`
      export function Example() {
        return <button className="text-blue-500">保存</button>
      }
    `)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("P001")
    expect(result.stdout).toContain("Example.tsx")
    expect(result.stdout).toContain("<Button")
  })

  it("supports JSON output for CI", () => {
    const result = runKskLint(`
      export function Example() {
        return <input type="file" />
      }
    `, ["--format", "json"])
    expect(result.status).toBe(1)
    const payload = JSON.parse(result.stdout)
    expect(payload.results.some((finding: { ruleId: string }) => finding.ruleId === "P039")).toBe(true)
    expect(payload.summary.errors).toBeGreaterThan(0)
  })

  it("requires a reason for custom UI escape hatches", () => {
    const result = runKskLint(`
      // ksk-ds-allow-custom-ui
      export function Example() {
        return <button>特殊</button>
      }
    `)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("ESCAPE001")
  })

  it("skips a file when a reasoned escape hatch is present", () => {
    const result = runKskLint(`
      // ksk-ds-allow-custom-ui: domain-specific chart brush
      export function Example() {
        return <button>特殊</button>
      }
    `)
    expect(result.status).toBe(0)
  })

  it("does not flag P047 for a motion-related time mention inside a comment", () => {
    const result = runKskLint(`
      // Recomputing per request is ~300-500ms on the current working set,
      // so we memoize it instead.
      export function Example() {
        return <div>キャッシュ</div>
      }
    `)
    expect(result.stdout).not.toContain("P047")
  })

  it("flags P047 for a raw motion value in real code", () => {
    const result = runKskLint(`
      export function Example() {
        return <div style={{ transition: "all 300ms" }}>アニメーション</div>
      }
    `)
    expect(result.stdout).toContain("P047")
  })
})
