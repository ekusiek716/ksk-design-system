import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function runLintScratch(source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-lint-scratch-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, "Example.tsx")
  writeFileSync(file, source)
  return spawnSync("bash", ["scripts/lint-scratch.sh", file], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

function outputOf(result: ReturnType<typeof runLintScratch>) {
  return `${result.stdout}\n${result.stderr}`
}

describe("lint-scratch.sh", () => {
  it("[回帰] top-[16px] を p-[16px] として誤検知しない", () => {
    const result = runLintScratch(`
      export function Example() {
        return <div className="absolute top-[16px]" />
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("✓ 問題なし")
  })

  it("実際の任意値 spacing は引き続き検出する", () => {
    const result = runLintScratch(`
      export function Example() {
        return <div className="p-[16px]" />
      }
    `)
    expect(result.status).toBe(1)
    expect(outputOf(result)).toContain("任意値スペーシング")
  })

  it("[回帰] drop-shadow-md を shadow-md として誤検知しない", () => {
    const result = runLintScratch(`
      export function Example() {
        return <div className="drop-shadow-md" />
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("✓ 問題なし")
  })

  it("Tailwind variant / opacity 付きの標準色は引き続き検出する", () => {
    const result = runLintScratch(`
      export function Example() {
        return <div className="hover:text-blue-500/80" />
      }
    `)
    expect(result.status).toBe(1)
    expect(outputOf(result)).toContain("Tailwind標準色")
  })

  it("[回帰] 属性なしの生 button も検出する", () => {
    const result = runLintScratch(`
      export function Example() {
        return <button>保存</button>
      }
    `)
    expect(result.status).toBe(1)
    expect(outputOf(result)).toContain("生の<button>")
  })

  it("[回帰] コメント内の raw tag を違反として扱わない", () => {
    const result = runLintScratch(`
      // Web では <input> の既定 outline を抑制する
      export function Example() {
        return <div />
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("✓ 問題なし")
  })

  it("[回帰] img の alt が次行にある場合は alt なしと誤検知しない", () => {
    const result = runLintScratch(`
      export function Example() {
        return (
          <img
            src="/photo.jpg"
            alt="説明"
          />
        )
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("✓ 問題なし")
  })

  it("[回帰] header の data-slot が次行にある場合は生 header と誤検知しない", () => {
    const result = runLintScratch(`
      export function Example() {
        return (
          <header
            data-slot="example-header"
          />
        )
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("✓ 問題なし")
  })

  it("default Card 直下の縦 margin を warning 検出する", () => {
    const result = runLintScratch(`
      import { Card } from "ksk-design-system"
      export function Example() {
        return <Card><div className="mt-4">本文</div></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("Card 直下の縦余白")
    expect(outputOf(result)).toContain("mt-4")
  })

  it("conditional rendering された direct child の space-y も検出する", () => {
    const result = runLintScratch(`
      import { Card } from "ksk-design-system"
      export function Example({ show }: { show: boolean }) {
        return <Card>{show && <section className="space-y-4">本文</section>}</Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("Card 直下の縦余白")
    expect(outputOf(result)).toContain("space-y-4")
  })

  it("CardContent 内部の子は direct child として誤検知しない", () => {
    const result = runLintScratch(`
      import { Card, CardContent } from "ksk-design-system"
      export function Example() {
        return <Card><CardContent><div className="mt-4">本文</div></CardContent></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("✓ 問題なし")
  })

  it("media Card は内側で余白を管理できる", () => {
    const result = runLintScratch(`
      import { Card } from "ksk-design-system"
      export function Example() {
        return <Card variant="media"><div className="my-4">本文</div></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("✓ 問題なし")
  })

  it("Card が入れ子でも内側 Card の direct child を検査する", () => {
    const result = runLintScratch(`
      import { Card, CardContent } from "ksk-design-system"
      export function Example() {
        return (
          <Card>
            <CardContent>
              <Card><div className="mb-4">内側</div></Card>
            </CardContent>
          </Card>
        )
      }
    `)
    expect(result.status).toBe(0)
    expect(outputOf(result)).toContain("Card 直下の縦余白")
    expect(outputOf(result)).toContain("mb-4")
  })
})
