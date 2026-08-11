/**
 * Sheet side="float" — 仮想キーボード追従（Issue #337）
 *
 * float 系（`float` / `float-glass`）は画面端から 12px 浮いた配置のため、
 * bottom 系の補正（bottom: kbInset / maxHeight: visibleHeight）をそのまま
 * 使うと余白が潰れる。ここでは float 専用の純粋計算と、JS 検知が発火しない
 * 端末向けの CSS フォールバック契約を検証する。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { resolveFloatSheetKeyboardStyle } from "../src/components/ui/sheet"

describe("resolveFloatSheetKeyboardStyle — float シートのキーボード追従", () => {
  it("キーボード非表示ではスタイルを返さない（バリアント既定にフォールバック）", () => {
    expect(resolveFloatSheetKeyboardStyle(0, null)).toBeUndefined()
  })

  it("lift はキーボード高さ + 下マージン 12px", () => {
    expect(resolveFloatSheetKeyboardStyle(300, 500)?.bottom).toBe(312)
  })

  it("高さキャップは可視領域 - 上下マージン 24px - 上部セーフエリア", () => {
    expect(resolveFloatSheetKeyboardStyle(300, 500)?.maxHeight).toBe(
      "max(0px, calc(476px - env(safe-area-inset-top, 0px)))"
    )
  })

  it("可視領域がマージン以下でもキャップは負にならない（0 で下限）", () => {
    expect(resolveFloatSheetKeyboardStyle(700, 10)?.maxHeight).toBe(
      "max(0px, calc(0px - env(safe-area-inset-top, 0px)))"
    )
  })

  it("可視高さが取れないときは lift のみ返す（高さは既定のまま）", () => {
    expect(resolveFloatSheetKeyboardStyle(300, null)).toEqual({ bottom: 312 })
  })
})

describe("sheet-keyboard.css — float フォールバック契約", () => {
  const css = readFileSync(
    join(__dirname, "..", "src/styles/sheet-keyboard.css"),
    "utf8"
  )

  it("float / float-glass の両方をスコープする", () => {
    expect(css).toMatch(/\[data-side="float"\]/)
    expect(css).toMatch(/\[data-side="float-glass"\]/)
  })

  it("lift に下マージン 0.75rem を足している", () => {
    expect(css).toMatch(/bottom:\s*calc\(var\(--kb-h,\s*0px\)\s*\+\s*0\.75rem\)/)
  })

  it("max-height で上下マージンと上部セーフエリアを差し引き、0 で下限を切る", () => {
    expect(css).toMatch(/max-height:\s*max\(0px,\s*calc\(/)
    expect(css).toMatch(/1\.5rem/)
    expect(css).toMatch(/env\(safe-area-inset-top,\s*0px\)/)
  })

  // float-glass は `.glass-specular { overflow: hidden }`（glass.css・非レイヤー）が
  // Tailwind の overflow-y-auto を踏み潰すため、高さキャップだけ入れると
  // 溢れた内容へ到達できなくなる。非レイヤー規則での上書きが要る。
  it("float-glass のスクロールを非レイヤー規則で確保している", () => {
    expect(css).toMatch(
      /\[data-slot="sheet-content"\]\[data-side="float-glass"\]\s*\{\s*overflow-y:\s*auto/
    )
  })
})
