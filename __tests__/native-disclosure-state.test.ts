import { describe, expect, it } from "vitest"
import {
  isControlledOpen,
  nextAccordionKeys,
  normalizeAccordionKeys,
  resolveOpenState,
} from "../src/native/disclosure-state"

describe("native Collapsible/Accordion controlled state (#298②)", () => {
  it("open が undefined のときだけ内部 state を使う（非制御）", () => {
    expect(resolveOpenState(undefined, true)).toBe(true)
    expect(resolveOpenState(undefined, false)).toBe(false)
    expect(isControlledOpen(undefined)).toBe(false)
  })

  it("open が渡されている間は内部 state を完全に無視する（制御）", () => {
    // 内部 state が true でも、外から false を渡されたら閉じたまま
    expect(resolveOpenState(false, true)).toBe(false)
    expect(resolveOpenState(true, false)).toBe(true)
    expect(isControlledOpen(false)).toBe(true)
    expect(isControlledOpen(true)).toBe(true)
  })

  it("single: 別のキーを開くと前のキーは閉じる / 同じキーで閉じる", () => {
    expect(nextAccordionKeys([], "a", "single")).toEqual(["a"])
    expect(nextAccordionKeys(["a"], "b", "single")).toEqual(["b"])
    expect(nextAccordionKeys(["a"], "a", "single")).toEqual([])
  })

  it("multiple: 複数同時に開け、元の並び順を保つ", () => {
    expect(nextAccordionKeys([], "a", "multiple")).toEqual(["a"])
    expect(nextAccordionKeys(["a"], "b", "multiple")).toEqual(["a", "b"])
    expect(nextAccordionKeys(["a", "b", "c"], "b", "multiple")).toEqual(["a", "c"])
  })

  it("nextAccordionKeys は入力配列を破壊しない（制御モードで props をそのまま渡せる）", () => {
    const prev = ["a", "b"]
    nextAccordionKeys(prev, "c", "multiple")
    expect(prev).toEqual(["a", "b"])
  })

  it("normalizeAccordionKeys: 重複を除去し、single では先頭1件に丸める", () => {
    expect(normalizeAccordionKeys(["a", "a", "b"], "multiple")).toEqual(["a", "b"])
    expect(normalizeAccordionKeys(["a", "b"], "single")).toEqual(["a"])
    expect(normalizeAccordionKeys([], "single")).toEqual([])
  })
})
