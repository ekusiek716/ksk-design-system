/**
 * Sheet — bottom sheet キーボード追従の snap 除外ロジック（Issue #150）
 *
 * bottom-anchored なシートはキーボード表示時に「持ち上げ（bottom）」と
 * 「高さ制限（maxHeight）」を行うが、snap モード（data-snap-active）のシートは
 * 自前で高さを制御するため max-height 補正の対象外にする必要がある
 * （consumer 側 belle-todo の `:not([data-snap-active])` 分岐と等価）。
 *
 * ここではその純粋な分岐ロジック `resolveBottomSheetKeyboardStyle` を検証する
 * （DOM 非依存・SSR 構成のまま実行できる）。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { resolveBottomSheetKeyboardStyle } from "../src/components/ui/sheet"

describe("resolveBottomSheetKeyboardStyle — キーボード追従と snap 除外", () => {
  it("キーボード非表示（inset<=0）では追従スタイルを付けない", () => {
    expect(resolveBottomSheetKeyboardStyle(0, null, false)).toBeUndefined()
    expect(resolveBottomSheetKeyboardStyle(0, 500, false)).toBeUndefined()
    // 異常系（負の inset）でも undefined
    expect(resolveBottomSheetKeyboardStyle(-10, 500, false)).toBeUndefined()
  })

  it("非 snap では持ち上げ + 可視高さで高さ制限する", () => {
    expect(resolveBottomSheetKeyboardStyle(300, 500, false)).toEqual({
      bottom: 300,
      maxHeight: 500,
    })
  })

  it("snap モードでは持ち上げのみで max-height 補正は行わない", () => {
    // maxHeight を含めない（snap は activeSnapPoint で高さを持つ）
    expect(resolveBottomSheetKeyboardStyle(300, 500, true)).toEqual({
      bottom: 300,
    })
  })

  it("visibleHeight が null のときは maxHeight を省く（既定 max-h に委ねる）", () => {
    expect(resolveBottomSheetKeyboardStyle(300, null, false)).toEqual({
      bottom: 300,
      maxHeight: undefined,
    })
  })
})
