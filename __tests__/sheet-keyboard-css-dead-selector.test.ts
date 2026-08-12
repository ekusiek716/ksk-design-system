/**
 * sheet-keyboard.css の死んだセレクタ回帰テスト（Issue #339）
 *
 * `BottomSheetFrame` は SheetContent を介して常に `data-slot="sheet-content"`
 * を出し、フレーム識別には別属性 `data-frame="bottom-sheet-frame"` を使う
 * （#139 / __tests__/sheet-frame-data-slot.test.tsx）。そのため
 * `[data-slot="bottom-sheet-frame"]` という属性値は DOM 上に一度も現れず、
 * これを対象にした CSS ルールは常にマッチしない死んだセレクタだった。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const css = readFileSync(
  join(__dirname, "..", "src/styles/sheet-keyboard.css"),
  "utf8"
)
// ファイル先頭のブロックコメント（先頭の /* ... */）はドキュメントとして
// 経緯説明に `data-slot="bottom-sheet-frame"` という文字列そのものへ言及する
// ため、実際のセレクタ（コメント除去後の本体）だけを対象に検査する。
const cssWithoutLeadingComment = css.replace(/^\/\*[\s\S]*?\*\//, "")

describe("sheet-keyboard.css — 死んだセレクタの除去（Issue #339）", () => {
  it('[data-slot="bottom-sheet-frame"] を対象にしたセレクタが存在しない', () => {
    expect(cssWithoutLeadingComment).not.toContain(
      'data-slot="bottom-sheet-frame"'
    )
  })

  it('[data-slot="sheet-content"] だけで bottom lift / max-height 補正をスコープする', () => {
    expect(css).toMatch(
      /html\[data-kb-open\] \[data-slot="sheet-content"\]\[data-side="bottom"\] \{/
    )
    expect(css).toMatch(
      /\[data-slot="sheet-content"\]\[data-side="bottom"\]:not\(\[data-snap-active\]\)/
    )
  })

  it('#149 の footer 隠しフォールバックも [data-slot="sheet-content"] のみをスコープする', () => {
    expect(css).toMatch(/\[data-slot="sheet-content"\]:has\(/)
  })
})
