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
  it("W13: インライン style の生 ms を検出する（Tailwind クラス以外も見る）", () => {
    const result = runLintScratch(`
      export function Example() {
        const s = { transition: "height 200ms ease-out" }
        return <div style={s} />
      }
    `)
    expect(outputOf(result)).toContain("モーション値の直書き")
  })

  it("W13: テンプレート文字列内の cubic-bezier を検出する", () => {
    const result = runLintScratch(`
      export function Example({ ms }: { ms: number }) {
        const s = { animation: \`pop \${ms}ms cubic-bezier(0.3, 1, 0.3, 1) both\` }
        return <div style={s} />
      }
    `)
    expect(outputOf(result)).toContain("モーション値の直書き")
  })

  it("W13: 秒単位のモーション値を検出する", () => {
    const result = runLintScratch(`
      export function Example() {
        const s = { transition: "stroke-dashoffset 0.4s ease" }
        return <div style={s} />
      }
    `)
    expect(outputOf(result)).toContain("モーション値の直書き")
  })

  it("[回帰] W13: SVG path の smooth-curve コマンド（a.8.8s...）を秒数と誤検知しない", () => {
    const result = runLintScratch(`
      export function Example() {
        return (
          <svg viewBox="0 0 24 24">
            <path d="M12 2a.8.8 0 0 1 .8.8s0 1-.8 1" />
          </svg>
        )
      }
    `)
    expect(outputOf(result)).not.toContain("モーション値の直書き")
  })

  it("W13: Motion トークン参照なら検出しない", () => {
    const result = runLintScratch(`
      export function Example() {
        const s = { transition: "height var(--Motion-Duration-Base) var(--Motion-Easing-Standard)" }
        return <div className="duration-[var(--Motion-Duration-Fast)]" style={s} />
      }
    `)
    expect(outputOf(result)).not.toContain("モーション値の直書き")
  })

  it("W13: ksk-motion-exception コメント（直前行・行内）で除外できる", () => {
    const result = runLintScratch(`
      export function Example() {
        // ksk-motion-exception: 祝祭演出専用の尺
        const a = { animation: "confetti 1400ms linear" }
        const b = { transition: "opacity 250ms linear" } // ksk-motion-exception
        return <div style={{ ...a, ...b }} />
      }
    `)
    expect(outputOf(result)).not.toContain("モーション値の直書き")
  })

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
