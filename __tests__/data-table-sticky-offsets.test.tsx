import { describe, it, expect } from "vitest"
import {
  resolveStickyOffsets,
  DATA_TABLE_WIDTH_PX,
  dataTableWidthVariants,
  type DataTableColumn,
} from "@/components/patterns/admin/data-table"

/**
 * 固定列オフセットの自動計算（issue #359）。
 *
 * 最重要の制約は非破壊: `stickyOffset` を明示している既存の呼び出しは 1px も動かない。
 */

type Row = { id: number }

const column = (over: Partial<DataTableColumn<Row>> & { key: string }): DataTableColumn<Row> => ({
  header: over.key,
  ...over,
})

const offsetOf = (map: ReturnType<typeof resolveStickyOffsets>, key: string) =>
  map.get(key)?.offset

describe("DATA_TABLE_WIDTH_PX", () => {
  it("dataTableWidthVariants の Tailwind クラスと一致する", () => {
    for (const [name, className] of Object.entries(dataTableWidthVariants)) {
      // "min-w-[240px]" を拾わないよう、単独の `w-[Npx]` だけを見る
      const match = /(?:^|\s)w-\[(\d+)px\]/.exec(className)
      const px = DATA_TABLE_WIDTH_PX[name as keyof typeof DATA_TABLE_WIDTH_PX]
      if (match) {
        expect(px, `width="${name}"`).toBe(Number(match[1]))
      } else {
        // auto / flex は幅が確定しないので null
        expect(px, `width="${name}"`).toBeNull()
      }
    }
  })
})

describe("resolveStickyOffsets", () => {
  it("先頭の左固定列は 0（stickyOffset 無しの既存呼び出しと一致する）", () => {
    const map = resolveStickyOffsets([
      column({ key: "a", sticky: true, width: "sm" }),
      column({ key: "b" }),
    ])
    expect(offsetOf(map, "a")).toBe(0)
  })

  it("表示順の先行固定列の幅を積算する", () => {
    const map = resolveStickyOffsets([
      column({ key: "check", sticky: true, width: "checkbox" }), // 40
      column({ key: "name", sticky: "left", width: "md" }), // 200
      column({ key: "code", sticky: true, width: "sm" }),
      column({ key: "misc" }),
    ])
    expect(offsetOf(map, "check")).toBe(0)
    expect(offsetOf(map, "name")).toBe(40)
    expect(offsetOf(map, "code")).toBe(240)
  })

  it("固定でない列は積算に含めない", () => {
    const map = resolveStickyOffsets([
      column({ key: "a", sticky: true, width: "sm" }), // 120
      column({ key: "scroll", width: "xl" }),
      column({ key: "b", sticky: true, width: "sm" }),
    ])
    expect(offsetOf(map, "b")).toBe(120)
  })

  it("右固定列は末尾から積算する", () => {
    const map = resolveStickyOffsets([
      column({ key: "name" }),
      column({ key: "edit", sticky: "right", width: "action" }), // 48
      column({ key: "menu", sticky: "right", width: "narrow" }), // 48
    ])
    expect(offsetOf(map, "menu")).toBe(0)
    expect(offsetOf(map, "edit")).toBe(48)
  })

  it("左右の固定列は互いに干渉しない", () => {
    const map = resolveStickyOffsets([
      column({ key: "l1", sticky: true, width: "sm" }),
      column({ key: "l2", sticky: "left", width: "sm" }),
      column({ key: "r1", sticky: "right", width: "action" }),
    ])
    expect(offsetOf(map, "l1")).toBe(0)
    expect(offsetOf(map, "l2")).toBe(120)
    expect(offsetOf(map, "r1")).toBe(0)
  })

  it("stickyOffset の明示指定は自動計算より優先される（非破壊）", () => {
    const map = resolveStickyOffsets([
      column({ key: "a", sticky: true, width: "sm", stickyOffset: 0 }),
      column({ key: "b", sticky: true, width: "sm", stickyOffset: 130 }),
    ])
    expect(map.get("a")).toEqual({ offset: 0, explicit: true })
    expect(map.get("b")).toEqual({ offset: 130, explicit: true })
  })

  it("明示指定と自動計算が混在しても、明示値を基点に積み直す", () => {
    const map = resolveStickyOffsets([
      column({ key: "a", sticky: true, width: "sm", stickyOffset: 8 }), // 8 + 120
      column({ key: "b", sticky: true, width: "sm" }),
    ])
    expect(offsetOf(map, "b")).toBe(128)
  })

  it("先行固定列の幅が不定（auto / flex）なら自動計算しない", () => {
    const map = resolveStickyOffsets([
      column({ key: "a", sticky: true }), // width 未指定 = auto
      column({ key: "b", sticky: true, width: "sm" }),
    ])
    // 先頭は幅に依存しないので 0 で確定できる
    expect(offsetOf(map, "a")).toBe(0)
    expect(offsetOf(map, "b")).toBeUndefined()
  })

  it("幅不定でも stickyOffset 明示があれば従来どおりその値を使う", () => {
    const map = resolveStickyOffsets([
      column({ key: "a", sticky: true }),
      column({ key: "b", sticky: true, stickyOffset: 200 }),
    ])
    expect(offsetOf(map, "b")).toBe(200)
  })

  it("固定列が無ければ空", () => {
    expect(resolveStickyOffsets([column({ key: "a" }), column({ key: "b" })]).size).toBe(0)
  })
})
