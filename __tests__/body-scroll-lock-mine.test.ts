/**
 * 手動 body scroll-lock 地雷の非再導入 静的検査
 *
 * Dialog / Sheet はかつて `useBodyScrollLock` で
 *   document.body.style.overflow = "hidden"
 * を自前で設定していた。だが DialogContent / SheetContent は
 * **開閉に関係なく毎回レンダリングされる**（Radix の Presence が unmount するのは
 * 内側の DialogPrimitive.Content だけで、これらの関数コンポーネント自体は常に走る）。
 * そのためフックが常時 enabled で走り、Dialog / Sheet が「閉じていても」
 * body に overflow:hidden を出しっぱなしにしていた。
 *
 * html の overflow が visible のとき viewport のスクロールは body の overflow に
 * 従う（CSS overflow propagation）ため、これは結果としてページ／Storybook 全体の
 * スクロールを殺す（「Storybook のコンテンツがスクロールできない」の実原因）。
 *
 * body scroll の抑止は modal Dialog（Radix）標準の react-remove-scroll が
 * 「開いている間だけ」正しく行う（`data-scroll-locked` を付与し close で復元、
 * ref-counted）。自前で body.style.overflow を触ってはならない。
 *
 * lint-scratch.test.ts / pointer-events-mine.test.ts と同じ DOM 非依存の静的検査。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const COMPONENTS_DIR = "src/components"

const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8")

/**
 * `//` 行コメント（解説文）を除いたコード行から、body の overflow を直接
 * 触る記述の出現行を列挙する。`document.body.style.overflow = ...` /
 * `body.style.overflow = ...` を対象にする。
 */
function findBodyOverflowWrites(rel: string) {
  const re = /\bbody\s*\.\s*style\s*\.\s*overflow\s*=/
  return read(rel)
    .split("\n")
    .map((line, index) => ({ line, lineNo: index + 1 }))
    .filter(({ line }) => re.test(line) && !line.trimStart().startsWith("//") && !line.trimStart().startsWith("*"))
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

describe("手動 body scroll-lock 地雷の非再導入（Storybook コンテンツがスクロール不能になる回帰の防止）", () => {
  it.each(["src/components/ui/dialog.tsx", "src/components/ui/sheet.tsx"])(
    "%s は body.style.overflow を自前で書き換えない（Radix の modal scroll lock に委ねる）",
    (rel) => {
      const violations = findBodyOverflowWrites(rel)
      expect(
        violations,
        `body.style.overflow を自前で触ると、Content が閉じていても走って body を overflow:hidden に固定し、ページ全体のスクロールを殺す。scroll lock は modal Dialog（Radix）に委ねること: ${violations.join(", ")}`
      ).toEqual([])
    }
  )

  it("Dialog / Sheet は useBodyScrollLock フックを持たない", () => {
    expect(read("src/components/ui/dialog.tsx")).not.toContain("useBodyScrollLock")
    expect(read("src/components/ui/sheet.tsx")).not.toContain("useBodyScrollLock")
  })

  it("src/components 全体で body.style.overflow を直接書き換えていない", () => {
    const violations = collectTsxFiles(COMPONENTS_DIR).flatMap(findBodyOverflowWrites)
    expect(
      violations,
      `body.style.overflow の直接操作は scroll-lock 地雷。Radix の modal scroll lock に委ねること: ${violations.join(", ")}`
    ).toEqual([])
  })
})
