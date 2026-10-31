/**
 * @vitest-environment jsdom
 *
 * issue #786: native の NumberInput は 1 文字打つたびに範囲へ補正して onChange していたため、
 * 欄を消して打ち直すと空欄が 0 → min に置き換わり、続けて打った数字が min の後ろに付いた
 * （min=1, max=12, 値 5 で Backspace → 8 が 12 になる）。
 * Web 版と同じく、入力中は下書きだけを持ち、確定（入力終了・送信・フォーカス外し）のときに
 * 一度だけ範囲へ補正して onChange することを固定する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

type HostProps = Record<string, unknown> & { children?: React.ReactNode }
const hosts = vi.hoisted(() => ({ records: [] as { host: string; props: HostProps }[] }))
vi.mock("react-native", async () => {
  const R = await import("react")
  const host = (name: string) => ({ children, ...props }: HostProps) => {
    hosts.records.push({ host: name, props })
    return R.createElement(R.Fragment, null, children)
  }
  return {
    View: host("View"),
    Text: host("Text"),
    Pressable: host("Pressable"),
    TextInput: host("TextInput"),
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: 1 }),
  }
})

import { NumberInput } from "../src/native/components/NumberInput"
import { QuantitySelector } from "../src/native/components/QuantitySelector"
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

/** 最後に描かれた TextInput の props（最新の表示値とハンドラ） */
const input = () => [...hosts.records].reverse().find((r) => r.host === "TextInput")!.props
/** 最後に描かれた ± ボタン（0: −, 1: ＋） */
const buttons = () => {
  const presses = hosts.records.filter((r) => r.host === "Pressable")
  return presses.slice(-2).map((r) => r.props)
}
const call = (fn: unknown, ...args: unknown[]) => act(() => (fn as (...a: unknown[]) => void)?.(...args))

/** onChange で value を更新する、利用側と同じ制御の仕方で描く */
function Controlled({
  initial,
  onChange,
  as = "number",
  ...rest
}: { initial: number; onChange: (v: number) => void; as?: "number" | "quantity"; min?: number; max?: number }) {
  const [v, setV] = React.useState(initial)
  const handle = (n: number) => {
    onChange(n)
    setV(n)
  }
  return as === "quantity" ? (
    <QuantitySelector value={v} onChange={handle} {...rest} />
  ) : (
    <NumberInput value={v} onChange={handle} {...rest} />
  )
}

function render(node: React.ReactElement) {
  act(() => root.render(<ThemeProvider>{node}</ThemeProvider>))
}

describe("native NumberInput: 入力中は下書き、確定時に一度だけ補正 (#786)", () => {
  it("Backspace → 8 を打っても確定前は onChange せず、確定で 8 を 1 回だけ通知する", () => {
    const onChange = vi.fn()
    render(<Controlled initial={5} min={1} max={12} onChange={onChange} />)
    call(input().onFocus)
    call(input().onChangeText, "")
    expect(input().value).toBe("")
    call(input().onChangeText, "8")
    expect(input().value).toBe("8")
    expect(onChange).not.toHaveBeenCalled()
    call(input().onEndEditing)
    call(input().onBlur)
    expect(onChange).toHaveBeenCalledExactlyOnceWith(8)
    expect(input().value).toBe("8")
  })

  it("送信キー（onSubmitEditing）でも確定し、続く入力終了で二重に通知しない", () => {
    const onChange = vi.fn()
    render(<Controlled initial={5} min={1} max={12} onChange={onChange} />)
    call(input().onChangeText, "9")
    call(input().onSubmitEditing)
    call(input().onEndEditing)
    call(input().onBlur)
    expect(onChange).toHaveBeenCalledExactlyOnceWith(9)
  })

  it("max を超える値は確定時に max へ補正する", () => {
    const onChange = vi.fn()
    render(<Controlled initial={5} min={1} max={12} onChange={onChange} />)
    call(input().onChangeText, "18")
    expect(input().value).toBe("18")
    expect(onChange).not.toHaveBeenCalled()
    call(input().onBlur)
    expect(onChange).toHaveBeenCalledExactlyOnceWith(12)
    expect(input().value).toBe("12")
  })

  it("min=10 でも 1 桁目の途中値で min に戻らず、確定時に補正する", () => {
    const onChange = vi.fn()
    render(<Controlled initial={10} min={10} max={99} onChange={onChange} />)
    call(input().onChangeText, "")
    call(input().onChangeText, "2")
    call(input().onChangeText, "25")
    expect(input().value).toBe("25")
    call(input().onBlur)
    expect(onChange).toHaveBeenCalledExactlyOnceWith(25)
  })

  it("空欄のまま確定すると元の値に戻り、onChange を呼ばない", () => {
    const onChange = vi.fn()
    render(<Controlled initial={5} min={1} max={12} onChange={onChange} />)
    call(input().onChangeText, "")
    call(input().onBlur)
    expect(onChange).not.toHaveBeenCalled()
    expect(input().value).toBe("5")
  })

  it("「-」だけで確定しても元の値に戻る", () => {
    const onChange = vi.fn()
    render(<Controlled initial={5} min={-5} max={12} onChange={onChange} />)
    call(input().onChangeText, "-")
    call(input().onBlur)
    expect(onChange).not.toHaveBeenCalled()
    expect(input().value).toBe("5")
  })

  it("同じ値で確定しても onChange を呼ばない", () => {
    const onChange = vi.fn()
    render(<Controlled initial={5} min={1} max={12} onChange={onChange} />)
    call(input().onChangeText, "5")
    call(input().onBlur)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("± ボタンと外部からの value 変更が欄の表示に反映される", () => {
    const onChange = vi.fn()
    render(<Controlled initial={5} min={1} max={12} onChange={onChange} />)
    call(buttons()[1].onPress)
    expect(onChange).toHaveBeenLastCalledWith(6)
    expect(input().value).toBe("6")
    call(buttons()[0].onPress)
    expect(onChange).toHaveBeenLastCalledWith(5)
    expect(input().value).toBe("5")
    render(<NumberInput value={7} min={1} max={12} />)
    expect(input().value).toBe("7")
  })

  it("打ちかけの値があるときの ± は、その値を基準に増減する", () => {
    const onChange = vi.fn()
    render(<Controlled initial={5} min={1} max={12} onChange={onChange} />)
    call(input().onChangeText, "8")
    call(buttons()[1].onPress)
    expect(onChange).toHaveBeenCalledExactlyOnceWith(9)
    expect(input().value).toBe("9")
    call(input().onBlur)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it("QuantitySelector（min=1）でも同じく打ち直せる", () => {
    const onChange = vi.fn()
    render(<Controlled as="quantity" initial={5} max={12} onChange={onChange} />)
    call(input().onChangeText, "")
    call(input().onChangeText, "8")
    expect(onChange).not.toHaveBeenCalled()
    call(input().onBlur)
    expect(onChange).toHaveBeenCalledExactlyOnceWith(8)
  })
})
