import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { isLiteralOnlyInterpolation, isP029TemplateLiteralExempt } from "../bin/lint.js"

// issue #464 の回帰テスト。
// P029 は className={`...`} のテンプレートリテラルを一律検出していたが、
// 補間部（${...}）が「文字列リテラルのみで構成される式」（三項・&&・ネスト三項）
// なら Tailwind の静的クラス抽出を壊さないため対象外にする。
// 識別子・関数呼び出し・メンバーアクセスの補間は引き続き検出する。

function runKskLint(source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-p029-literal-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, "Example.tsx")
  writeFileSync(file, source)
  const result = spawnSync(process.execPath, ["bin/init.js", "lint", file, "--format", "json"], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
  return (JSON.parse(result.stdout).results as { ruleId: string; line: number }[]).map(
    (finding) => finding.ruleId,
  )
}

describe("issue #464: isLiteralOnlyInterpolation 単体", () => {
  it("単純な文字列リテラルはそのまま許可", () => {
    expect(isLiteralOnlyInterpolation('"a"')).toBe(true)
  })
  it("単純三項は許可", () => {
    expect(isLiteralOnlyInterpolation('cond ? "a" : "b"')).toBe(true)
  })
  it("&& は許可", () => {
    expect(isLiteralOnlyInterpolation('active && "on"')).toBe(true)
  })
  it("ネスト三項は許可", () => {
    expect(isLiteralOnlyInterpolation('a ? "x" : b ? "y" : "z"')).toBe(true)
  })
  it("識別子は禁止", () => {
    expect(isLiteralOnlyInterpolation("color")).toBe(false)
  })
  it("関数呼び出しは禁止", () => {
    expect(isLiteralOnlyInterpolation("getColor()")).toBe(false)
  })
  it("三項の分岐に識別子が混ざるのは禁止", () => {
    expect(isLiteralOnlyInterpolation("cond ? color : \"b\"")).toBe(false)
  })
})

describe("issue #464: isP029TemplateLiteralExempt", () => {
  it("安全形: 単純三項", () => {
    expect(isP029TemplateLiteralExempt('className={`base ${cond ? "a" : "b"}`}')).toBe(true)
  })
  it("安全形: &&", () => {
    expect(isP029TemplateLiteralExempt('className={`base ${active && "on"}`}')).toBe(true)
  })
  it("安全形: ネスト三項", () => {
    expect(
      isP029TemplateLiteralExempt('className={`base ${a ? "x" : b ? "y" : "z"}`}'),
    ).toBe(true)
  })
  it("危険形: 識別子補間", () => {
    expect(isP029TemplateLiteralExempt("className={`bg-${color}`}")).toBe(false)
  })
  it("危険形: テンプレート内テンプレート", () => {
    expect(
      isP029TemplateLiteralExempt("className={`base ${`inner-${x}`}`}"),
    ).toBe(false)
  })
  it("危険形: 関数呼び出し", () => {
    expect(isP029TemplateLiteralExempt("className={`base ${getColor()}`}")).toBe(false)
  })
})

describe("issue #464: P029 lint CLI 統合", () => {
  it("安全形3種は P029 を検出しない", () => {
    const ids = runKskLint(`
      export function Example({ cond, active, a, b }: any) {
        return (
          <>
            <div className={\`base \${cond ? "a" : "b"}\`}>1</div>
            <div className={\`base \${active && "on"}\`}>2</div>
            <div className={\`base \${a ? "x" : b ? "y" : "z"}\`}>3</div>
          </>
        )
      }
    `)
    expect(ids).not.toContain("P029")
  })

  it("危険形3種は P029 を検出する", () => {
    const ids = runKskLint(`
      export function Example({ color, x }: any) {
        function getColor() { return "red" }
        return (
          <>
            <div className={\`bg-\${color}\`}>1</div>
            <div className={\`base \${\`inner-\${x}\`}\`}>2</div>
            <div className={\`base \${getColor()}\`}>3</div>
          </>
        )
      }
    `)
    const p029Count = ids.filter((id) => id === "P029").length
    expect(p029Count).toBeGreaterThanOrEqual(3)
  })
})

// issue #468 の回帰テスト。
// `${props.className || ""}` は右辺だけ見るとリテラルなので例外扱いされ、
// 機能的に同じ `${props.className ?? ""}` だけが検出される食い違いがあった。
// `||` は左辺が truthy ならその値がそのまま出力されるため、両辺を見る。
describe("issue #468: || 形の className 合成", () => {
  it("|| の左辺が識別子なら例外にしない", () => {
    expect(isLiteralOnlyInterpolation('props.className || ""')).toBe(false)
    expect(isLiteralOnlyInterpolation('className || ""')).toBe(false)
    expect(isLiteralOnlyInterpolation('getClass() || ""')).toBe(false)
  })

  it("|| の両辺がリテラルなら例外のまま", () => {
    expect(isLiteralOnlyInterpolation('"a" || "b"')).toBe(true)
  })

  it("&& は従来どおり右辺だけを見る", () => {
    expect(isLiteralOnlyInterpolation('props.active && "on"')).toBe(true)
  })

  it("行単位の判定でも || 形は例外にならない", () => {
    expect(isP029TemplateLiteralExempt('className={`base ${props.className || ""}`}')).toBe(false)
    expect(isP029TemplateLiteralExempt('className={`base ${props.className ?? ""}`}')).toBe(false)
  })

  it("lint CLI で || 形と ?? 形が同じく P029 を検出する", () => {
    const ids = runKskLint(`
      export function Example(props: any) {
        return (
          <>
            <div className={\`base \${props.className || ""}\`}>1</div>
            <div className={\`base \${props.className ?? ""}\`}>2</div>
          </>
        )
      }
    `)
    expect(ids.filter((id) => id === "P029").length).toBe(2)
  })
})
