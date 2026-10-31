/**
 * @vitest-environment jsdom
 *
 * issue #799: native の MultiSelect は、行の Pressable の内側に onChange も decorative も
 * 持たない Checkbox（それ自体が Pressable）を置いていた。入れ子の Pressable では内側が
 * タッチを取るため、チェック枠を押しても行の onPress が呼ばれず、選択が切り替わらなかった。
 * 読み上げでも、名前の無い・押しても反応しない checkbox が行ごとに現れた。
 * CheckboxField と同じく、チェック枠を装飾にして支援技術から隠し、行が role / 状態 / 名前を
 * 持つことを固定する。同じ入れ子だった CheckboxCard も合わせて確かめる。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

type HostProps = Record<string, unknown> & { children?: React.ReactNode }
type Rec = { host: string; props: HostProps; children: Rec[]; parent: Rec | null }
const hosts = vi.hoisted(() => ({ records: [] as Rec[], stack: [] as Rec[] }))

vi.mock("react-native", async () => {
  const R = await import("react")
  // 描画のたびに host の入れ子関係を記録する（親を辿って包みの属性を確かめるため）
  const host = (name: string) => ({ children, ...props }: HostProps) => {
    const parent = R.useContext(Parent)
    const rec: Rec = { host: name, props, children: [], parent }
    hosts.records.push(rec)
    parent?.children.push(rec)
    return R.createElement(Parent.Provider, { value: rec }, children)
  }
  const Parent = R.createContext<Rec | null>(null)
  const FlatList = ({ data, renderItem, keyExtractor, ...props }: HostProps & {
    data: unknown[]
    renderItem: (info: { item: unknown; index: number }) => React.ReactNode
    keyExtractor: (item: unknown) => string
  }) =>
    R.createElement(
      host("FlatList"),
      props,
      data.map((item, index) => R.createElement(R.Fragment, { key: keyExtractor(item) }, renderItem({ item, index }))),
    )
  return {
    View: host("View"),
    Text: host("Text"),
    Pressable: host("Pressable"),
    TextInput: host("TextInput"),
    FlatList,
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: 1 }),
  }
})
// Sheet は Modal / Animated を使うため、開いているときに中身をそのまま描く代用品にする
vi.mock("../src/native/components/Sheet", () => ({
  Sheet: ({ open, children }: { open: boolean; children?: React.ReactNode }) => (open ? children : null),
}))
vi.mock("../src/native/components/Input", () => ({ Input: () => null }))
vi.mock("../src/native/components/Button", () => ({
  Button: ({ onPress, children }: { onPress?: () => void; children?: React.ReactNode }) => (
    <button onClick={onPress}>{children}</button>
  ),
}))

import { CheckboxCard } from "../src/native/components/CheckboxCard"
import { MultiSelect } from "../src/native/components/MultiSelect"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

let container: HTMLElement
let root: Root

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  hosts.records = []
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function render(node: React.ReactElement) {
  act(() => root.render(<ThemeProvider>{node}</ThemeProvider>))
}

/** Checkbox 本体（width:20 の Pressable）を探す */
const isCheckboxBox = (r: Rec) => {
  const style = r.props.style as Record<string, unknown> | undefined
  return r.host === "Pressable" && typeof style === "object" && style !== null && style.width === 20 && style.height === 20
}
const ancestors = (r: Rec) => {
  const out: Rec[] = []
  for (let p = r.parent; p; p = p.parent) out.push(p)
  return out
}

const options = [
  { value: "a", label: "東京" },
  { value: "b", label: "大阪" },
]

function openMultiSelect(values: string[] = [], onChange = vi.fn()) {
  render(<MultiSelect options={options} values={values} onChange={onChange} />)
  const trigger = hosts.records.find((r) => r.host === "Pressable" && r.props.accessibilityRole === "button")!
  act(() => (trigger.props.onPress as () => void)())
  return onChange
}

/**
 * 開いたシートの行（accessibilityRole="checkbox" を持つ Pressable）を返す。
 * 再描画のたびに records が積み増しされるため、末尾の描画分だけを数える。
 */
const rows = () =>
  hosts.records.filter((r) => r.host === "Pressable" && r.props.accessibilityRole === "checkbox").slice(-options.length)

describe("native MultiSelect: チェック枠は装飾、行が checkbox (#799)", () => {
  it("行が role=checkbox・選択状態・名前（item.label）を持つ", () => {
    openMultiSelect(["b"])
    const [tokyo, osaka] = rows()
    expect(tokyo.props.accessibilityLabel).toBe("東京")
    expect(tokyo.props.accessibilityState).toEqual({ checked: false })
    expect(tokyo.props["aria-checked"]).toBe(false)
    expect(osaka.props.accessibilityLabel).toBe("大阪")
    expect(osaka.props.accessibilityState).toEqual({ checked: true })
    expect(osaka.props["aria-checked"]).toBe(true)
  })

  it("行の中のチェック枠は decorative で、タッチと支援技術から外した包みの中にある", () => {
    openMultiSelect()
    const boxes = hosts.records.filter(isCheckboxBox).slice(-options.length)
    expect(boxes).toHaveLength(options.length)
    for (const box of boxes) {
      // decorative の Checkbox は role も状態も持たず、タブ順から外れる
      expect(box.props.accessibilityRole).toBeUndefined()
      expect(box.props.accessibilityState).toBeUndefined()
      expect(box.props.tabIndex).toBe(-1)
      const wrapper = box.parent!
      expect(wrapper.host).toBe("View")
      expect(wrapper.props.pointerEvents).toBe("none")
      expect(wrapper.props.accessibilityElementsHidden).toBe(true)
      expect(wrapper.props.importantForAccessibility).toBe("no-hide-descendants")
      expect(wrapper.props["aria-hidden"]).toBe(true)
      // 行の中で、checkbox の役割を持つのは外側の行だけ
      expect(ancestors(box).some((a) => a.props.accessibilityRole === "checkbox")).toBe(true)
    }
  })

  it("行を押すと選択が切り替わり、適用で onChange に渡る", () => {
    const onChange = openMultiSelect()
    act(() => (rows()[0].props.onPress as () => void)())
    expect(rows()[0].props.accessibilityState).toEqual({ checked: true })
    const apply = [...container.querySelectorAll("button")].find((b) => b.textContent === "適用")!
    act(() => apply.click())
    expect(onChange).toHaveBeenCalledExactlyOnceWith(["a"])
  })
})

describe("native CheckboxCard: 同じ入れ子を装飾にそろえる (#799)", () => {
  it("カードが role=checkbox・状態・名前を持ち、チェック枠は装飾として隠す", () => {
    const onChange = vi.fn()
    render(<CheckboxCard title="通知を受け取る" description="毎朝 8 時" checked onChange={onChange} />)
    const accessible = hosts.records.filter((r) => r.props.accessibilityRole === "checkbox")
    expect(accessible).toHaveLength(1)
    const card = accessible[0]
    expect(card.props.accessibilityLabel).toBe("通知を受け取る")
    expect(card.props.accessibilityHint).toBe("毎朝 8 時")
    expect(card.props.accessibilityState).toEqual({ checked: true, disabled: false })
    expect(card.props["aria-checked"]).toBe(true)
    const box = hosts.records.find(isCheckboxBox)!
    expect(box.props.tabIndex).toBe(-1)
    expect(box.parent!.props.pointerEvents).toBe("none")
    expect(box.parent!.props["aria-hidden"]).toBe(true)
    act(() => (card.props.onPress as () => void)())
    expect(onChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it("無効のカードは押しても切り替わらない", () => {
    const onChange = vi.fn()
    render(<CheckboxCard title="通知を受け取る" disabled onChange={onChange} />)
    const card = hosts.records.find((r) => r.props.accessibilityRole === "checkbox")!
    expect(card.props.accessibilityState).toEqual({ checked: false, disabled: true })
    act(() => (card.props.onPress as () => void)())
    expect(onChange).not.toHaveBeenCalled()
  })
})
