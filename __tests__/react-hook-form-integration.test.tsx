/**
 * @vitest-environment jsdom
 *
 * react-hook-form の実利用パターンを、DS のフォーム部品に対して通す統合テスト。
 *
 * 背景: `react-hook-form` を通常 dependencies に持っているのに、
 * `useForm` / `register()` / `reset()` を通るテストが 1 つも無かった。
 * 姉妹 DS はこの穴で、非制御（register）時に初期値を数えない文字数カウンタを
 * 出し、consumer の 22 コールサイトが全部壊れるまで気付けなかった。
 *
 * `register()` は `name` / `onChange` / `onBlur` / `ref` しか渡さない非制御
 * パターンで、初期値は `defaultValues` / `reset()` により **ref 経由で DOM の
 * value に直接書き込まれる**（onChange は発火しない）。制御前提の実装だと
 * 「入力欄に文字が見えているのに内部 state は空」になる。
 *
 * 各部品について次の 3 点を固定する:
 *   1. defaultValues が UI に反映される
 *   2. reset() に UI が追従する
 *   3. UI 操作で form の値が更新される
 *
 * contracts/components.json の formBinding が register / controller の部品は、
 * このファイルに登場していることを __tests__/form-binding-contract.test.ts が強制する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { Controller, useForm, type UseFormReturn } from "react-hook-form"

import { Input } from "../src/components/ui/input"
import { Textarea } from "../src/components/ui/textarea"
import { Checkbox } from "../src/components/ui/checkbox"
import { Switch } from "../src/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "../src/components/ui/radio-group"
import { NumberInput } from "../src/components/ui/number-input"
import { DateField } from "../src/components/ui/date-field"
import { Slider } from "../src/components/ui/slider"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

// Radix の Checkbox / Switch / RadioGroup / Slider は内部で要素サイズを購読する。
// jsdom には ResizeObserver が無いので最小実装を入れる（サイズは常に 0 で問題ない）。
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function render(ui: React.ReactElement) {
  act(() => root.render(ui))
}

/** ネイティブ setter 経由で値を入れて input イベントを発火（React の onChange に届く） */
function typeInto(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype =
    element.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")!.set!
  act(() => {
    setter.call(element, value)
    element.dispatchEvent(new Event("input", { bubbles: true }))
  })
}

function click(element: Element) {
  act(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))
  })
}

/**
 * useForm の戻り値を外から掴めるようにするハーネス。
 * reset() をテスト側から叩き、form.getValues() で実値を観測する。
 */
type Harness<T extends Record<string, unknown>> = {
  form: UseFormReturn<T>
}

function makeHarness<T extends Record<string, unknown>>(
  defaultValues: T,
  render: (form: UseFormReturn<T>) => React.ReactNode,
) {
  const captured: Harness<T> = { form: undefined as unknown as UseFormReturn<T> }
  function Wrapper() {
    const form = useForm<T>({ defaultValues: defaultValues as never })
    captured.form = form
    return <form>{render(form)}</form>
  }
  return { captured, Wrapper }
}

describe("register 経路（非制御）", () => {
  it("Input: defaultValues の初期表示 / reset() 追従 / 入力での値更新", () => {
    const { captured, Wrapper } = makeHarness({ title: "初期タイトル" }, (form) => (
      <Input {...form.register("title")} maxLength={40} showCount />
    ))
    render(<Wrapper />)

    const input = container.querySelector("input")!
    // 1. defaultValues が DOM に届いている（ref 経由なので onChange は発火しない）
    expect(input.value).toBe("初期タイトル")
    // showCount が非制御の初期値を数えている（姉妹 DS が落とした穴）
    expect(container.querySelector('[data-slot="input-count"]')!.textContent).toBe("6/40")

    // 2. reset() に追従する
    act(() => captured.form.reset({ title: "リセット後" }))
    expect(input.value).toBe("リセット後")
    expect(container.querySelector('[data-slot="input-count"]')!.textContent).toBe("5/40")

    // 3. 入力が form の値に反映される
    typeInto(input, "手入力")
    expect(captured.form.getValues("title")).toBe("手入力")
    expect(container.querySelector('[data-slot="input-count"]')!.textContent).toBe("3/40")
  })

  it("Input: startAdornment / endAdornment があっても register の ref が届く", () => {
    const { captured, Wrapper } = makeHarness({ amount: "1200" }, (form) => (
      <Input {...form.register("amount")} startAdornment="¥" endAdornment="円" />
    ))
    render(<Wrapper />)

    const input = container.querySelector("input")!
    expect(input.value).toBe("1200")
    act(() => captured.form.reset({ amount: "3400" }))
    expect(input.value).toBe("3400")
  })

  it("Textarea: defaultValues の初期表示 / reset() 追従 / 入力での値更新", () => {
    const { captured, Wrapper } = makeHarness({ memo: "初期メモ" }, (form) => (
      <Textarea {...form.register("memo")} maxLength={100} showCount />
    ))
    render(<Wrapper />)

    const textarea = container.querySelector("textarea")!
    expect(textarea.value).toBe("初期メモ")
    expect(container.querySelector('[data-slot="textarea-count"]')?.textContent).toBe("4/100")

    act(() => captured.form.reset({ memo: "リセットされたメモ" }))
    expect(textarea.value).toBe("リセットされたメモ")

    typeInto(textarea, "打ち直し")
    expect(captured.form.getValues("memo")).toBe("打ち直し")
  })
})

describe("controller 経路", () => {
  it("Checkbox: defaultValues の初期表示 / reset() 追従 / クリックでの値更新", () => {
    const { captured, Wrapper } = makeHarness({ agreed: true }, (form) => (
      <Controller
        control={form.control}
        name="agreed"
        render={({ field }) => (
          <Checkbox checked={field.value} onCheckedChange={field.onChange} aria-label="同意する" />
        )}
      />
    ))
    render(<Wrapper />)

    const checkbox = container.querySelector('[role="checkbox"]')!
    expect(checkbox.getAttribute("data-state")).toBe("checked")

    act(() => captured.form.reset({ agreed: false }))
    expect(checkbox.getAttribute("data-state")).toBe("unchecked")

    click(checkbox)
    expect(captured.form.getValues("agreed")).toBe(true)
  })

  it("Switch: defaultValues の初期表示 / reset() 追従 / クリックでの値更新", () => {
    const { captured, Wrapper } = makeHarness({ notify: false }, (form) => (
      <Controller
        control={form.control}
        name="notify"
        render={({ field }) => (
          <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="通知" />
        )}
      />
    ))
    render(<Wrapper />)

    const sw = container.querySelector('[role="switch"]')!
    expect(sw.getAttribute("data-state")).toBe("unchecked")

    act(() => captured.form.reset({ notify: true }))
    expect(sw.getAttribute("data-state")).toBe("checked")

    click(sw)
    expect(captured.form.getValues("notify")).toBe(false)
  })

  it("RadioGroup: defaultValues の初期表示 / reset() 追従 / クリックでの値更新", () => {
    const { captured, Wrapper } = makeHarness({ size: "m" }, (form) => (
      <Controller
        control={form.control}
        name="size"
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            <RadioGroupItem value="s" aria-label="S" />
            <RadioGroupItem value="m" aria-label="M" />
            <RadioGroupItem value="l" aria-label="L" />
          </RadioGroup>
        )}
      />
    ))
    render(<Wrapper />)

    const items = container.querySelectorAll('[role="radio"]')
    expect(items[1].getAttribute("data-state")).toBe("checked")

    act(() => captured.form.reset({ size: "l" }))
    expect(items[2].getAttribute("data-state")).toBe("checked")

    click(items[0])
    expect(captured.form.getValues("size")).toBe("s")
  })

  it("NumberInput: defaultValues の初期表示 / reset() 追従 / 加算での値更新", () => {
    const { captured, Wrapper } = makeHarness({ qty: 2 }, (form) => (
      <Controller
        control={form.control}
        name="qty"
        render={({ field }) => <NumberInput value={field.value} onChange={field.onChange} min={0} />}
      />
    ))
    render(<Wrapper />)

    const readValue = () =>
      container.querySelector<HTMLInputElement>('[data-slot="number-input"] input')!.value
    expect(readValue()).toBe("2")

    act(() => captured.form.reset({ qty: 7 }))
    expect(readValue()).toBe("7")

    const increment = container.querySelector('button[aria-label="増やす"]')!
    click(increment)
    expect(captured.form.getValues("qty")).toBe(8)
  })

  it("DateField: defaultValues の初期表示 / reset() 追従", () => {
    const { captured, Wrapper } = makeHarness({ due: "2026-07-25" }, (form) => (
      <Controller
        control={form.control}
        name="due"
        render={({ field }) => <DateField value={field.value} onChange={field.onChange} />}
      />
    ))
    render(<Wrapper />)

    expect(container.textContent).toContain("2026")
    act(() => captured.form.reset({ due: "2027-01-09" }))
    expect(container.textContent).toContain("2027")
  })

  it("Slider: defaultValues の初期表示 / reset() 追従 / キーボードでの値更新", () => {
    const { captured, Wrapper } = makeHarness({ volume: 30 }, (form) => (
      <Controller
        control={form.control}
        name="volume"
        render={({ field }) => (
          <Slider
            value={[field.value]}
            onValueChange={(next: number[]) => field.onChange(next[0])}
            min={0}
            max={100}
            step={1}
          />
        )}
      />
    ))
    render(<Wrapper />)

    const thumb = container.querySelector('[role="slider"]')!
    expect(thumb.getAttribute("aria-valuenow")).toBe("30")

    act(() => captured.form.reset({ volume: 80 }))
    expect(thumb.getAttribute("aria-valuenow")).toBe("80")

    act(() => {
      ;(thumb as HTMLElement).focus()
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }),
      )
    })
    expect(captured.form.getValues("volume")).toBe(81)
  })
})
