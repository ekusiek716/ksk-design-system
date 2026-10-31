import { describe, expect, it } from "vitest"
import { isLibExternal } from "../vite.config.lib"

/**
 * issue #828: react-hook-form / react-day-picker が dist に同梱され、
 * DS の Form と consumer の react-hook-form で Context が分かれていた。
 * lib ビルドの external 判定がサブパスを含めて外部化することを固定する
 * （dist 全体での同梱検出は scripts/check-published-deps.mjs、
 *  consumer 実機での Context 共有は scripts/test-packed-web-consumer.mjs）。
 */
describe("lib ビルドの external 判定 (#828)", () => {
  it.each(["react-hook-form", "react-day-picker", "react-day-picker/locale"])("%s を external にする", (id) => {
    expect(isLibExternal(id)).toBe(true)
  })

  it("既存の external（#504 の radix-ui/internal など）を保つ", () => {
    for (const id of ["react", "react/jsx-runtime", "radix-ui", "radix-ui/internal", "@radix-ui/react-slot", "react-native-svg"]) {
      expect(isLibExternal(id)).toBe(true)
    }
  })

  it("名前が前方一致するだけの別パッケージや src 内のモジュールは同梱する", () => {
    expect(isLibExternal("react-hook-form-extra")).toBe(false)
    expect(isLibExternal("react-day-pickers")).toBe(false)
    expect(isLibExternal("/repo/src/components/ui/form.tsx")).toBe(false)
    expect(isLibExternal("@/lib/utils")).toBe(false)
  })
})
