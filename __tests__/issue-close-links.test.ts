/**
 * `Closes #N` 誤リンク検出の純粋ロジック（issue #486 の事故が由来）。
 *
 * PR #488 が `Closes #486` を書きながら別コンポーネントを実装し、
 * issue #486 が未実装のまま自動クローズされて消費側が待ち続けた。
 *
 * ここでは実データで踏んだ**誤検知の形**を回帰として固定する。
 * この検査は「見逃しても誤検知は出さない」方針なので、緩い側を固定する。
 */
import { describe, expect, it } from "vitest"
// @ts-expect-error — .mjs の純関数（型定義なし）
import { namesInText, namesInFiles, isSuspectLink, CLOSES_RE } from "../scripts/check-issue-close-links.mjs"

const COMPONENTS = [
  { name: "Dialog", paths: ["src/components/ui/dialog.tsx"] },
  { name: "Sheet", paths: ["src/components/ui/sheet.tsx"] },
  { name: "Button", paths: ["src/components/ui/button.tsx"] },
  { name: "BottomTabBar", paths: ["src/components/patterns/commerce/bottom-tab-bar.tsx"] },
  { name: "ResponsiveOverlayFrame", paths: ["src/components/patterns/responsive-overlay-frame.tsx"] },
]

describe("コンポーネント名の抽出", () => {
  it("合成名（DialogContent）も親名の言及として数える", () => {
    // 末尾を厳格に見ていたため PR #494 / issue #485 を誤検知した実例
    const names = namesInText("DialogContent/SheetContent: 子に置いた Description が…", COMPONENTS)
    expect([...names].sort()).toEqual(["Dialog", "Sheet"])
  })

  it("先頭の境界は厳格（別語の一部を拾わない）", () => {
    expect([...namesInText("MyDialog は対象外", COMPONENTS)]).toEqual([])
  })

  it("変更ファイルからコンポーネント名を引ける", () => {
    const names = namesInFiles(["src/components/ui/dialog.tsx", "README.md"], COMPONENTS)
    expect([...names]).toEqual(["Dialog"])
  })
})

describe("Closes 参照の抽出", () => {
  it("closes / fixes / resolves を拾う", () => {
    const body = "Closes #486\nfixes #12 and resolved #7"
    const refs = [...body.matchAll(CLOSES_RE)].map((m) => Number(m[1]))
    expect(refs).toEqual([486, 12, 7])
  })

  it("単なる番号参照は拾わない（関連: #123 など）", () => {
    const refs = [...("関連: #123 を参照".matchAll(CLOSES_RE))]
    expect(refs).toEqual([])
  })
})

describe("疑い判定", () => {
  it("共通のコンポーネントが 1 つも無ければ疑う（#488 → #486 の実例）", () => {
    expect(isSuspectLink(new Set(["ResponsiveOverlayFrame"]), new Set(["BottomTabBar"]))).toBe(true)
  })

  it("1 つでも共通なら疑わない", () => {
    expect(isSuspectLink(new Set(["Dialog", "Sheet"]), new Set(["Dialog"]))).toBe(false)
  })

  it("判定材料が無い側があれば疑わない（誤検知を出さない側に倒す）", () => {
    expect(isSuspectLink(new Set(), new Set(["Button"]))).toBe(false)
    expect(isSuspectLink(new Set(["Button"]), new Set())).toBe(false)
  })
})
