/**
 * pointer-events「none 親 + auto 子」地雷の非再導入 静的検査
 *
 * PR #134 (Calendar) / PR #138 (Toast, MobileAppShell) で、
 * `pointer-events-none` の親と `pointer-events-auto` の子を組み合わせて
 * クリック領域を「穴あけ」する構造を除去した。
 *
 * この構造は consumer 側 Tailwind v4 の `@source` スキャンが
 * minified dist から `pointer-events-auto` を拾えないと該当 CSS が生成されず、
 * 子のクリックが背後へ貫通して操作不能になる地雷（belle-todo で実発生）。
 *
 * ファイル内容の静的検査で、地雷を除去済みのコンポーネントに
 * `pointer-events-auto` が再導入されていないことを保証する。
 * lint-scratch.test.ts と同様のロジックテスト（DOM 非依存）。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()

/** 地雷除去済みで、以後 pointer-events-auto を持ってはならないファイル */
const CLEANED_FILES = [
  "src/components/ui/calendar.tsx",
  "src/components/ui/toast.tsx",
  "src/components/patterns/mobile-app-shell.tsx",
]

const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8")

describe("pointer-events 地雷の非再導入（PR #134 / #138 の回帰防止）", () => {
  it.each(CLEANED_FILES)(
    "%s は pointer-events-auto を含まない（consumer dist スキャン漏れで貫通する地雷）",
    (rel) => {
      const src = read(rel)
      expect(src).not.toContain("pointer-events-auto")
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
})
