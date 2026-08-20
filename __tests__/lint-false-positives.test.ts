import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

// issue #388 / #389 / #390 の誤検知バグ修正の回帰テスト。
// 既存の __tests__/consumer-lint-cli.test.ts と同じ「tmpdir にファイルを書いて
// spawnSync で bin/init.js lint を実行する」パターンを踏襲する。
function runKskLint(source: string, extraArgs: string[] = ["--format", "json"]) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-false-positive-lint-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, "Example.tsx")
  writeFileSync(file, source)
  const result = spawnSync(process.execPath, ["bin/init.js", "lint", file, ...extraArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
  return { result, file }
}

function findingsOf(stdout: string) {
  return (JSON.parse(stdout).results as { ruleId: string; line: number; file: string }[])
}

describe("issue #390: コメント除去を全ルールへ拡張", () => {
  it("行コメントの説明文はどのルールにも該当しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        // 各カードに <img> を後から挿し込む
        return null
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P025")).toHaveLength(0)
    expect(findings).toHaveLength(0)
  })

  it("JSX の単一行コメント {/* ... */} 内の要素名も誤検知しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <div>
            {/* <img src="x" /> を後で差し込む */}
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P025")).toHaveLength(0)
  })
})

describe("issue #388: P026 の同一行 aria-label / aria-labelledby / id 判定", () => {
  it("直前行の <Label htmlFor> と対応する id を持つ Input は違反にしない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <>
            <Label htmlFor="x">名前</Label>
            <Input id="x" placeholder="例" />
          </>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(0)
  })

  it("aria-label を持つ Input は違反にしない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <Input aria-label="名前" placeholder="例" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(0)
  })

  it("id も aria-* も無い placeholder のみの input は違反にする", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <input placeholder="例" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(1)
  })
})

describe("issue #389: P037 / P040 の上限付与と matchAll 化", () => {
  it("P040: ファイル先頭のデータ配列の emoji と数百行離れた aria-pressed は無関係なので誤検知しない", () => {
    const filler = Array.from({ length: 40 }, (_, i) => `  // padding comment number ${i} adds unrelated distance in this source file`).join("\n")
    const { result } = runKskLint(`
      const TAGS = [{ id: 'sweet', label: 'スイート', emoji: '🥰' }]

${filler}

      export function GenderPicker({ gender, setGender }) {
        return (
          <>
            {['male', 'female'].map((g) => (
              <Button key={g} aria-pressed={gender === g} onClick={() => setGender(g)}>
                {g}
              </Button>
            ))}
          </>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P040")).toHaveLength(0)
  })

  it("P040: ActionTile のローカル定義は引き続き検出する", () => {
    const { result } = runKskLint(`
      const ActionTile = ({ label }) => <div>{label}</div>
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P040")).toHaveLength(1)
  })

  it("P037: SheetHeader と KebabMenu が近接していれば検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <div>
            <SheetHeader />
            <KebabMenu />
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P037")).toHaveLength(1)
  })

  it("P037: SheetHeader と KebabMenu が数百文字以上離れていれば無関係とみなし検出しない", () => {
    const filler = Array.from({ length: 40 }, (_, i) => `  // padding comment number ${i} adds unrelated distance in this source file`).join("\n")
    const { result } = runKskLint(`
      export function Example() {
        return (
          <div>
            <SheetHeader />
${filler}
            <KebabMenu />
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P037")).toHaveLength(0)
  })

  it("全ファイル走査ルールは同一ファイル内の複数件をすべて報告する（matchAll 化）", () => {
    // 2つの SheetHeader+KebabMenu ペアそれぞれは窓内（近接）だが、ペア同士は
    // 窓を超えて離れているため、貪欲マッチが2ペアをまたいで1件に融合しない。
    const filler = Array.from({ length: 40 }, (_, i) => `  // padding comment number ${i} adds unrelated distance in this source file`).join("\n")
    const { result } = runKskLint(`
      export function A() {
        return (
          <div>
            <SheetHeader />
            <KebabMenu />
          </div>
        )
      }

${filler}

      export function B() {
        return (
          <div>
            <SheetHeader />
            <KebabMenu />
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    const p037 = findings.filter((f) => f.ruleId === "P037")
    expect(p037).toHaveLength(2)
    expect(p037[0].line).not.toBe(p037[1].line)
  })
})
