/**
 * FormField 同名衝突の契約テスト（issue #260）
 *
 * `ui/form` の react-hook-form 統合版 FormField と `patterns/form-field` の
 * 非 RHF 版 FormField が同名で共存しているため、バレル（src/index.ts）では
 * 前者を `RhfFormField` として別名 export している。
 *
 * このテストは、両方が index.ts から解決でき、かつ別々の関数であることを保証する。
 * 将来どちらかの export が消えたり、別名付けが外れて再び同名衝突が起きた場合に
 * ここで検知する。
 */
import { describe, it, expect } from "vitest"

import { FormField, RhfFormField } from "../src/index"

describe("FormField naming contract (#260)", () => {
  it("patterns 版 FormField が index から解決できる", () => {
    expect(FormField).toBeTypeOf("function")
  })

  it("ui/form 版 FormField が RhfFormField として index から解決できる", () => {
    expect(RhfFormField).toBeTypeOf("function")
  })

  it("2つの FormField 実体は別物である（衝突していない）", () => {
    expect(FormField).not.toBe(RhfFormField)
  })
})
