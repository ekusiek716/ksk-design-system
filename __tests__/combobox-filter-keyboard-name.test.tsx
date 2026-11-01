/**
 * @vitest-environment jsdom
 *
 * issue #783: Web の Combobox
 * 1. label 以外（keywords / 表記ゆれ / filter）でも絞り込める
 * 2. 検索欄の ArrowDown / ArrowUp / Enter で選べる（WAI-ARIA combobox パターン）
 * 3. トリガーの読み上げ名に選択中の値が入る（triggerLabel・外部 label と両立）
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { fireEvent, getByRole, queryAllByRole, within } from "@testing-library/dom"
import "@testing-library/jest-dom/vitest"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Combobox, type ComboboxOption, type ComboboxProps } from "../src/components/ui/combobox"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const stations: ComboboxOption[] = [
  { value: "ichigaya", label: "市ケ谷" },
  { value: "kasumigaseki", label: "霞ケ関" },
  { value: "sendagaya", label: "千駄ケ谷" },
  { value: "shibuya", label: "渋谷", keywords: ["しぶや", "shibuya"] },
  { value: "shinjuku", label: "新宿", keywords: ["しんじゅく"] },
  { value: "ikebukuro", label: "池袋（休止中）", disabled: true, keywords: ["いけぶくろ"] },
  { value: "cake", label: "ケーキ駅" },
]

let root: Root | null = null
let host: HTMLDivElement | null = null

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  root = null
  host = null
})

function Controlled(props: Partial<ComboboxProps> & { onValue?: (v: string) => void; initial?: string }) {
  const { onValue, initial = "", ...rest } = props
  const [value, setValue] = React.useState(initial)
  return (
    <Combobox
      options={stations}
      placeholder="駅を選択"
      searchPlaceholder="駅名で検索"
      {...rest}
      value={value}
      onChange={(v) => {
        setValue(v)
        onValue?.(v)
      }}
    />
  )
}

function mount(ui: React.ReactElement) {
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => root!.render(ui))
  return host
}

function trigger() {
  return host!.querySelector<HTMLButtonElement>('[data-slot="combobox-trigger"]')!
}

function openAndGetSearch() {
  act(() => {
    fireEvent.click(trigger())
  })
  return getByRole(document.body, "combobox")
}

function type(input: HTMLElement, text: string) {
  act(() => {
    fireEvent.change(input, { target: { value: text } })
  })
}

function key(input: HTMLElement, k: string, init: KeyboardEventInit = {}) {
  act(() => {
    fireEvent.keyDown(input, { key: k, ...init })
  })
}

function optionLabels() {
  return queryAllByRole(document.body, "option").map((o) => o.textContent)
}

describe("issue #783: 絞り込み", () => {
  it("漢字に挟まれた ヶ / ケ / が を同一視する（市ヶ谷 → 市ケ谷、霞が関 → 霞ケ関）", () => {
    mount(<Controlled />)
    const search = openAndGetSearch()
    type(search, "市ヶ谷")
    expect(optionLabels()).toEqual(["市ケ谷"])
    type(search, "霞が関")
    expect(optionLabels()).toEqual(["霞ケ関"])
    type(search, "千駄ヶ")
    expect(optionLabels()).toEqual(["千駄ケ谷"])
  })

  it("ヶ系の同一視は漢字に挟まれたときだけ（語頭のケは が と同一視しない）", () => {
    mount(<Controlled />)
    const search = openAndGetSearch()
    type(search, "がーき")
    expect(optionLabels()).toEqual([])
    type(search, "けーき")
    expect(optionLabels()).toEqual(["ケーキ駅"])
  })

  it("keywords に当たる。ひらがな/カタカナ・大文字小文字を区別しない", () => {
    mount(<Controlled />)
    const search = openAndGetSearch()
    type(search, "しぶや")
    expect(optionLabels()).toEqual(["渋谷"])
    type(search, "シブヤ")
    expect(optionLabels()).toEqual(["渋谷"])
    type(search, "SHIBUYA")
    expect(optionLabels()).toEqual(["渋谷"])
  })

  it("filter を渡すと既定の絞り込みを置き換え、query は trim した入力そのまま渡る", () => {
    const filter = vi.fn((o: ComboboxOption, q: string) => o.value.startsWith(q))
    mount(<Controlled filter={filter} />)
    const search = openAndGetSearch()
    type(search, "  shi  ")
    expect(optionLabels()).toEqual(["渋谷", "新宿"])
    expect(filter).toHaveBeenCalledWith(expect.objectContaining({ value: "shibuya" }), "shi")
  })
})

describe("issue #783: キーボード操作（WAI-ARIA combobox）", () => {
  it("検索欄は role=combobox で listbox を aria-controls で指す", () => {
    mount(<Controlled />)
    const search = openAndGetSearch()
    const listbox = getByRole(document.body, "listbox")
    expect(search).toHaveAttribute("aria-expanded", "true")
    expect(search.getAttribute("aria-controls")).toBe(listbox.id)
    expect(search).toHaveAttribute("aria-autocomplete", "list")
  })

  it("絞り込むと先頭の候補がアクティブになり、Enter で確定して閉じる", () => {
    const onValue = vi.fn()
    mount(<Controlled onValue={onValue} />)
    const search = openAndGetSearch()
    type(search, "しぶや")
    const active = document.getElementById(search.getAttribute("aria-activedescendant")!)
    expect(active).toHaveTextContent("渋谷")
    key(search, "Enter")
    expect(onValue).toHaveBeenCalledWith("shibuya")
    expect(trigger()).toHaveAttribute("aria-expanded", "false")
  })

  it("ArrowDown / ArrowUp で移動し、disabled の候補は飛ばす", () => {
    const onValue = vi.fn()
    mount(<Controlled onValue={onValue} />)
    const search = openAndGetSearch()
    expect(search).not.toHaveAttribute("aria-activedescendant")
    const activeText = () => document.getElementById(search.getAttribute("aria-activedescendant")!)?.textContent

    key(search, "ArrowDown")
    expect(activeText()).toBe("市ケ谷")
    key(search, "ArrowUp") // 先頭から上は末尾へ回る
    expect(activeText()).toBe("ケーキ駅")
    key(search, "ArrowUp") // 池袋（disabled）を飛ばす
    expect(activeText()).toBe("新宿")
    key(search, "Enter")
    expect(onValue).toHaveBeenCalledWith("shinjuku")
  })

  it("disabled しか当たらないときは Enter で何も選ばない", () => {
    const onValue = vi.fn()
    mount(<Controlled onValue={onValue} />)
    const search = openAndGetSearch()
    type(search, "いけぶくろ")
    expect(optionLabels()).toEqual(["池袋（休止中）"])
    expect(search).not.toHaveAttribute("aria-activedescendant")
    key(search, "Enter")
    expect(onValue).not.toHaveBeenCalled()
  })

  it("日本語入力の変換中の Enter では確定しない", () => {
    const onValue = vi.fn()
    mount(<Controlled onValue={onValue} />)
    const search = openAndGetSearch()
    type(search, "しぶや")
    key(search, "Enter", { isComposing: true })
    expect(onValue).not.toHaveBeenCalled()
    key(search, "Enter", { keyCode: 229 })
    expect(onValue).not.toHaveBeenCalled()
  })

  it("開いたとき選択中の候補がアクティブ。候補は role=option + aria-selected", () => {
    mount(<Controlled initial="kasumigaseki" />)
    const search = openAndGetSearch()
    const active = document.getElementById(search.getAttribute("aria-activedescendant")!)!
    expect(active).toHaveAttribute("role", "option")
    expect(active).toHaveAttribute("aria-selected", "true")
    expect(active).toHaveTextContent("霞ケ関")
  })

  it("マウスで候補を押しても従来どおり選べる", () => {
    const onValue = vi.fn()
    mount(<Controlled onValue={onValue} />)
    openAndGetSearch()
    const listbox = getByRole(document.body, "listbox")
    act(() => {
      fireEvent.click(within(listbox).getByRole("option", { name: "新宿" }))
    })
    expect(onValue).toHaveBeenCalledWith("shinjuku")
  })
})

describe("issue #783: トリガーの読み上げ名", () => {
  const name = () => getByRole(host!, "button").getAttribute("aria-labelledby")!
  const accName = (expected: string) => expect(getByRole(host!, "button", { name: expected })).toBe(trigger())

  it("未選択・補足なしは placeholder が名前（従来どおり）", () => {
    mount(<Controlled />)
    accName("駅を選択")
    expect(trigger()).not.toHaveAttribute("aria-label")
  })

  it("triggerLabel は補足として先頭に入り、選択中の値が続く", () => {
    mount(<Controlled triggerLabel="駅を選ぶ" initial="shibuya" />)
    accName("駅を選ぶ 渋谷")
    expect(name().split(" ")).toHaveLength(2)
  })

  it("triggerLabel があって未選択なら、placeholder は名前に重ねない", () => {
    mount(<Controlled triggerLabel="駅を選ぶ" />)
    accName("駅を選ぶ")
  })

  it("選ぶと名前が値に追随する", () => {
    mount(<Controlled triggerLabel="駅を選ぶ" />)
    const search = openAndGetSearch()
    type(search, "新宿")
    key(search, "Enter")
    accName("駅を選ぶ 新宿")
  })

  it("外部の <label htmlFor={id}> は名前の先頭に残る（id の無い label にも付与する）", () => {
    mount(
      <div>
        <label htmlFor="station">最寄り駅</label>
        <Controlled id="station" initial="shibuya" />
      </div>
    )
    accName("最寄り駅 渋谷")
    const label = host!.querySelector("label")!
    expect(label.id).not.toBe("")
    expect(name().split(" ")[0]).toBe(label.id)
  })

  it("外部 label があって未選択なら、名前は label だけ", () => {
    mount(
      <div>
        <label id="lbl" htmlFor="station2">最寄り駅</label>
        <Controlled id="station2" />
      </div>
    )
    accName("最寄り駅")
    expect(name()).toBe("lbl")
  })
})
