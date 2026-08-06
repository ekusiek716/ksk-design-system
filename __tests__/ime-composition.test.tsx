/**
 * @vitest-environment jsdom
 *
 * issue #301: 日本語 IME の「変換を確定する Enter」を「確定操作の Enter」と
 * 取り違える不具合の回帰テスト。
 *
 * 変換中の keydown は `nativeEvent.isComposing === true`（一部 Android WebView は
 * `keyCode === 229` のみ）で見分けられる。この判定を落とすと、未確定文字が
 * そのままタグ化・検索実行されて以降の変換操作が失われる。
 */
import * as React from "react"
import { act } from "react"
import { readFileSync } from "node:fs"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { isImeComposing } from "../src/lib/ime"
import { TagInput } from "../src/components/patterns/tag-input"
import { SearchBar } from "../src/components/patterns/search-bar"
import { NumberInput } from "../src/components/ui/number-input"
import * as PublicApi from "../src/index"

let container: HTMLElement
let root: Root

function mount(ui: React.ReactElement) {
  act(() => {
    root.render(ui)
  })
}

/** 実 DOM の input へ文字を入れて React の controlled state を更新する。 */
function typeInto(input: HTMLInputElement, value: string) {
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )!.set!
  act(() => {
    setValue.call(input, value)
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })
}

/**
 * keydown を発火する。
 * - `composing: true` → 変換中（IME が確定のために送る Enter）
 * - `legacyOnly: true` → isComposing を立てず keyCode 229 だけ送る古い WebView
 */
function keyDown(
  el: HTMLElement,
  key: string,
  opts: { composing?: boolean; legacyOnly?: boolean } = {},
) {
  act(() => {
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
        isComposing: opts.composing === true && opts.legacyOnly !== true,
        keyCode: opts.legacyOnly ? 229 : undefined,
      } as KeyboardEventInit),
    )
  })
}

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
  document.body.innerHTML = ""
  vi.restoreAllMocks()
})

describe("isImeComposing", () => {
  it("React 合成イベント（nativeEvent 経由）の isComposing を見る", () => {
    expect(isImeComposing({ nativeEvent: { isComposing: true } })).toBe(true)
    expect(isImeComposing({ nativeEvent: { isComposing: false } })).toBe(false)
  })

  it("DOM の KeyboardEvent をそのまま渡しても判定できる", () => {
    expect(isImeComposing({ isComposing: true })).toBe(true)
    expect(isImeComposing({ isComposing: false })).toBe(false)
  })

  it("isComposing を立てない環境の keyCode 229 を変換中とみなす", () => {
    // 一部の Android WebView / 旧 IME は isComposing を立てず 229 だけ送る
    expect(isImeComposing({ nativeEvent: { keyCode: 229 } })).toBe(true)
    expect(isImeComposing({ keyCode: 229 })).toBe(true)
  })

  it("通常の Enter（keyCode 13）は変換中とみなさない", () => {
    expect(isImeComposing({ nativeEvent: { isComposing: false, keyCode: 13 } })).toBe(false)
    expect(isImeComposing({})).toBe(false)
  })

  it("消費側が独自の入力欄に張れるよう public API から公開されている", () => {
    expect(PublicApi.isImeComposing).toBe(isImeComposing)
  })
})

describe("TagInput の IME ガード (#301)", () => {
  function mountTagInput() {
    const onChange = vi.fn()
    mount(<TagInput onChange={onChange} />)
    const input = container.querySelector<HTMLInputElement>('[data-slot="tag-input"] input')!
    return { onChange, input }
  }

  it("変換中の Enter ではタグ化しない（未確定文字を確定操作に使わない）", () => {
    const { onChange, input } = mountTagInput()
    typeInto(input, "にほんご")

    keyDown(input, "Enter", { composing: true })

    expect(onChange).not.toHaveBeenCalled()
    expect(input.value).toBe("にほんご")
  })

  it("isComposing を立てない環境（keyCode 229）の Enter でもタグ化しない", () => {
    const { onChange, input } = mountTagInput()
    typeInto(input, "にほんご")

    keyDown(input, "Enter", { composing: true, legacyOnly: true })

    expect(onChange).not.toHaveBeenCalled()
    expect(input.value).toBe("にほんご")
  })

  it("変換確定後の Enter ではタグ化する（確定 → 送信の2打鍵が成立する）", () => {
    const { onChange, input } = mountTagInput()
    typeInto(input, "にほんご")

    // 1打鍵目 = 変換確定（無視される）
    keyDown(input, "Enter", { composing: true })
    // 2打鍵目 = 送信
    keyDown(input, "Enter")

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(["にほんご"])
  })

  it("変換中の `,` ではタグ化しない（読点「、」入力で発火する）", () => {
    const { onChange, input } = mountTagInput()
    typeInto(input, "にほんご")

    keyDown(input, ",", { composing: true })

    expect(onChange).not.toHaveBeenCalled()
    expect(input.value).toBe("にほんご")
  })

  it("英字入力の Enter / `,` は従来どおりタグ化する（非破壊確認）", () => {
    const { onChange, input } = mountTagInput()

    typeInto(input, "react")
    keyDown(input, "Enter")
    expect(onChange).toHaveBeenNthCalledWith(1, ["react"])

    typeInto(input, "vite")
    keyDown(input, ",")
    expect(onChange).toHaveBeenNthCalledWith(2, ["vite"])
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it("入力が空のときの Backspace は変換に関係なく最後のタグを消す（非破壊確認）", () => {
    const onChange = vi.fn()
    mount(<TagInput value={["react", "vite"]} onChange={onChange} />)
    const input = container.querySelector<HTMLInputElement>('[data-slot="tag-input"] input')!

    keyDown(input, "Backspace")

    expect(onChange).toHaveBeenCalledWith(["react"])
  })
})

describe("SearchBar の IME ガード (#301 と同一原因)", () => {
  function mountSearchBar() {
    const onSearch = vi.fn()
    mount(<SearchBar onSearch={onSearch} defaultValue="" />)
    const input = container.querySelector<HTMLInputElement>('[data-slot="search-bar"] input')!
    return { onSearch, input }
  }

  it("変換中の Enter では検索しない（未確定文字で検索が走らない）", () => {
    const { onSearch, input } = mountSearchBar()
    typeInto(input, "けんさく")

    keyDown(input, "Enter", { composing: true })
    keyDown(input, "Enter", { composing: true, legacyOnly: true })

    expect(onSearch).not.toHaveBeenCalled()
  })

  it("変換確定後の Enter では確定済みの文字列で検索する", () => {
    const { onSearch, input } = mountSearchBar()
    typeInto(input, "検索")

    keyDown(input, "Enter")

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith("検索")
  })

  it("英字入力の Enter は従来どおり検索する（非破壊確認）", () => {
    const { onSearch, input } = mountSearchBar()
    typeInto(input, "design system")

    keyDown(input, "Enter")

    expect(onSearch).toHaveBeenCalledWith("design system")
  })
})

describe("NumberInput の IME ガード (#301 と同一原因)", () => {
  function mountNumberInput() {
    const onChange = vi.fn()
    mount(<NumberInput value={3} onChange={onChange} />)
    const input = container.querySelector<HTMLInputElement>('[data-slot="number-input"] input')!
    return { onChange, input }
  }

  it("変換中の ArrowUp/ArrowDown で値を増減しない（変換候補の選択を横取りしない）", () => {
    const { onChange, input } = mountNumberInput()

    keyDown(input, "ArrowUp", { composing: true })
    keyDown(input, "ArrowDown", { composing: true })
    keyDown(input, "ArrowUp", { composing: true, legacyOnly: true })

    expect(onChange).not.toHaveBeenCalled()
  })

  it("変換中の Enter では blur しない（全角数字の変換が中断されない）", () => {
    const { input } = mountNumberInput()
    act(() => input.focus())
    expect(document.activeElement).toBe(input)

    keyDown(input, "Enter", { composing: true })

    expect(document.activeElement).toBe(input)
  })

  it("変換していない ArrowUp/ArrowDown / Enter は従来どおり動く（非破壊確認）", () => {
    const { onChange, input } = mountNumberInput()

    keyDown(input, "ArrowUp")
    expect(onChange).toHaveBeenLastCalledWith(4)
    keyDown(input, "ArrowDown")
    expect(onChange).toHaveBeenLastCalledWith(2)

    act(() => input.focus())
    keyDown(input, "Enter")
    expect(document.activeElement).not.toBe(input)
  })
})

describe("native TagInput の IME ガード契約 (#301)", () => {
  // ネイティブ実機では compositionstart/end が無く no-op、
  // react-native-web 上でのみ効く。RN のレンダリングは本テスト環境に無いため
  // 他の native テスト（native-button-elevation 等）と同じくソース契約で検証する。
  const source = readFileSync("src/native/components/TagInput.tsx", "utf8")

  it("TextInput の実 DOM ノードへ composition イベントを張る", () => {
    expect(source).toContain("useWebCompositionGuard")
    expect(source).toContain("ref={inputRef}")
  })

  it("変換中は onSubmitEditing の追加処理を実行しない", () => {
    expect(source).toMatch(/const add = \(\) => \{\s*\n\s*if \(composingRef\.current\) return/)
  })
})
