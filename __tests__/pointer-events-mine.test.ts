/**
 * pointer-events「none 親 + auto 子」地雷の非再導入 静的検査
 *
 * PR #134 (Calendar) / PR #138 (Toast, MobileAppShell) / PR #143 (Celebration) で、
 * `pointer-events-none` の親と `pointer-events-auto` の子を組み合わせて
 * クリック領域を「穴あけ」する構造を除去した。
 *
 * この構造は consumer 側 Tailwind v4 の `@source` スキャンが
 * minified dist から `pointer-events-auto` を拾えないと該当 CSS が生成されず、
 * 子のクリックが背後へ貫通して操作不能になる地雷（belle-todo で実発生）。
 *
 * ファイル内容の静的検査で、`pointer-events-auto` ユーティリティが
 * src/components 配下に再導入されていないことを保証する。
 * クリック透過制御が必要な場合は inline style (`style={{ pointerEvents: "auto" }}`)
 * を使うこと — inline style は consumer 側の CSS 生成に依存しない
 * (Celebration が実例。全画面 overlay のため構造除去でなく inline style 化した)。
 * lint-scratch.test.ts と同様のロジックテスト（DOM 非依存）。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const COMPONENTS_DIR = "src/components"

/** 地雷除去済みで、以後 pointer-events-auto を持ってはならないファイル */
const CLEANED_FILES = [
  "src/components/ui/calendar.tsx",
  "src/components/ui/toast.tsx",
  "src/components/patterns/mobile-app-shell.tsx",
  "src/components/patterns/celebration.tsx",
]

const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8")

/** `//` 行コメント（解説文）を除いたコード行から pointer-events-auto の出現行を列挙する */
function findAutoUtilityLines(rel: string) {
  return read(rel)
    .split("\n")
    .map((line, index) => ({ line, lineNo: index + 1 }))
    .filter(({ line }) => line.includes("pointer-events-auto") && !line.trimStart().startsWith("//"))
    .map(({ lineNo }) => `${rel}:${lineNo}`)
}

function collectTsxFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(join(ROOT, dir))) {
    const rel = join(dir, entry)
    if (statSync(join(ROOT, rel)).isDirectory()) {
      files.push(...collectTsxFiles(rel))
    } else if (entry.endsWith(".tsx") && !entry.endsWith(".stories.tsx")) {
      files.push(rel)
    }
  }
  return files
}

describe("pointer-events 地雷の非再導入（PR #134 / #138 / #143 の回帰防止）", () => {
  it.each(CLEANED_FILES)(
    "%s は pointer-events-auto を含まない（consumer dist スキャン漏れで貫通する地雷）",
    (rel) => {
      expect(findAutoUtilityLines(rel)).toEqual([])
    }
  )

  it("Calendar は nav / ボタンで pointer-events-none も持たない（個別 absolute 配置で依存を除去済み）", () => {
    const src = read("src/components/ui/calendar.tsx")
    expect(src).not.toContain("pointer-events-none")
    expect(src).not.toContain("pointer-events-auto")
  })

  it("Toast は viewport / item で pointer-events ユーティリティに依存しない", () => {
    const src = read("src/components/ui/toast.tsx")
    expect(src).not.toContain("pointer-events-none")
    expect(src).not.toContain("pointer-events-auto")
  })

  it("走査対象に celebration.tsx を含む", () => {
    const targets = collectTsxFiles(COMPONENTS_DIR)
    expect(targets).toContain(join(COMPONENTS_DIR, "patterns", "celebration.tsx"))
    expect(targets.length).toBeGreaterThan(50)
  })

  it("src/components 全体で Tailwind の pointer-events-auto クラスを使っていない（inline style を使う）", () => {
    const violations = collectTsxFiles(COMPONENTS_DIR).flatMap(findAutoUtilityLines)
    expect(
      violations,
      `pointer-events-auto クラスは consumer の @source スキャン漏れでクリック不能地雷になる。inline style (style={{ pointerEvents: "auto" }}) を使うこと: ${violations.join(", ")}`
    ).toEqual([])
  })
})
