/**
 * @vitest-environment jsdom
 *
 * issue #669: CodeInput（認証コード / 招待コードの固定桁入力）。
 * 貼り付け・Backspace・矢印移動・SMS 自動入力・a11y を固定する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CodeInput, type CodeInputProps } from "../src/components/ui/code-input"

let container: HTMLElement
let root: Root
beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function Controlled(props: Partial<CodeInputProps> & { initial?: string; spy?: (v: string) => void }) {
  const { initial = "", spy, ...rest } = props
  const [value, setValue] = React.useState(initial)
  return (
    <CodeInput
      length={6}
      aria-label="認証コード"
      {...rest}
      value={value}
      onChange={(v) => {
        setValue(v)
        spy?.(v)
      }}
    />
  )
}

const mount = (ui: React.ReactElement) => act(() => root.render(ui))
const cells = () => Array.from(container.querySelectorAll<HTMLInputElement>('[data-slot="code-input-cell"]'))
const joined = () => cells().map((c) => c.value).join("")

function typeInto(el: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!
  act(() => {
    setter.call(el, value)
    el.dispatchEvent(new Event("input", { bubbles: true }))
  })
}
function key(el: HTMLElement, k: string) {
  act(() => {
    el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }))
  })
}
function paste(el: HTMLElement, text: string) {
  const event = new Event("paste", { bubbles: true, cancelable: true }) as Event & { clipboardData: unknown }
  event.clipboardData = { getData: () => text }
  act(() => {
    el.dispatchEvent(event)
  })
}

describe("CodeInput cells（#669）", () => {
  it("桁数ぶんのセルを出し、グループ名・桁ごとの名前・SMS 自動入力の属性を持つ", () => {
    mount(<Controlled />)
    const group = container.querySelector('[data-slot="code-input"]')!
    expect(group.getAttribute("role")).toBe("group")
    expect(group.getAttribute("aria-label")).toBe("認証コード")
    expect(cells()).toHaveLength(6)
    expect(cells()[0].getAttribute("aria-label")).toBe("1桁目（全6桁）")
    expect(cells()[5].getAttribute("aria-label")).toBe("6桁目（全6桁）")
    expect(cells()[0].getAttribute("autocomplete")).toBe("one-time-code")
    expect(cells()[1].getAttribute("autocomplete")).toBe("off")
    expect(cells().every((c) => c.getAttribute("inputmode") === "numeric")).toBe(true)
  })

  it("Input と同じフィールドトークン（--Field-* / Border-Control / フォーカス / エラー）を使う", () => {
    mount(<Controlled />)
    const cls = cells()[0].className
    expect(cls).toContain("h-[var(--Field-Height-Md)]")
    expect(cls).toContain("rounded-[var(--Field-Radius)]")
    expect(cls).toContain("border-[var(--Border-Control,var(--Border-Medium-Emphasis))]")
    expect(cls).toContain("focus-visible:ring-[3px]")
    expect(cls).toContain("aria-invalid:border-[var(--Border-Caution)]")
  })

  it("1 文字ずつ入力すると次の桁へ進み、全桁で onComplete が 1 回呼ばれる", () => {
    const onComplete = vi.fn()
    mount(<Controlled onComplete={onComplete} />)
    for (const [i, d] of ["1", "2", "3", "4", "5", "6"].entries()) {
      typeInto(cells()[i], d)
      expect(document.activeElement).toBe(cells()[Math.min(i + 1, 5)])
    }
    expect(joined()).toBe("123456")
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith("123456")
  })

  it("数字以外は受け付けない", () => {
    const spy = vi.fn()
    mount(<Controlled spy={spy} />)
    typeInto(cells()[0], "a")
    expect(joined()).toBe("")
    expect(spy).not.toHaveBeenCalled()
  })

  it("貼り付けで全桁が埋まる（空白・ハイフンは落とす）。どのセルから貼っても先頭から入る", () => {
    const onComplete = vi.fn()
    mount(<Controlled onComplete={onComplete} initial="9" />)
    paste(cells()[1], "123-456 ")
    expect(joined()).toBe("123456")
    expect(onComplete).toHaveBeenCalledWith("123456")
  })

  it("SMS 自動入力（先頭セルに全桁が届く）でも全桁に入る", () => {
    mount(<Controlled />)
    typeInto(cells()[0], "654321")
    expect(joined()).toBe("654321")
  })

  it("Backspace: 入力済みの桁は消し、空の桁では前の桁へ戻って消す", () => {
    mount(<Controlled initial="123" />)
    act(() => cells()[3].focus())
    key(cells()[3], "Backspace")
    expect(joined()).toBe("12")
    expect(document.activeElement).toBe(cells()[2])
    key(cells()[1], "Backspace")
    expect(joined()).toBe("1")
  })

  it("Android の仮想キーボード（keydown 無しで空になる change）も削除として扱う", () => {
    mount(<Controlled initial="123" />)
    typeInto(cells()[2], "")
    expect(joined()).toBe("12")
  })

  it("← → / Home / End で桁を移動する（未入力の桁より先へは進まない）", () => {
    mount(<Controlled initial="123" />)
    act(() => cells()[1].focus())
    key(cells()[1], "ArrowLeft")
    expect(document.activeElement).toBe(cells()[0])
    key(cells()[0], "ArrowRight")
    expect(document.activeElement).toBe(cells()[1])
    key(cells()[1], "End")
    expect(document.activeElement).toBe(cells()[3])
    key(cells()[3], "Home")
    expect(document.activeElement).toBe(cells()[0])
  })

  it("先の空セルにフォーカスしたら次に入力すべきセルへ寄せる", () => {
    mount(<Controlled initial="1" />)
    act(() => cells()[4].focus())
    expect(document.activeElement).toBe(cells()[1])
  })

  it("alphanumeric + uppercase は英字を大文字にそろえ、inputMode は text", () => {
    mount(<Controlled pattern="alphanumeric" uppercase length={4} />)
    paste(cells()[0], "a1b2")
    expect(joined()).toBe("A1B2")
    expect(cells()[0].getAttribute("inputmode")).toBe("text")
  })

  it("RegExp パターン（g フラグ付きでも結果が揺れない）", () => {
    mount(<Controlled pattern={/[0-9A-F]/gi} length={4} />)
    paste(cells()[0], "fz9g1c")
    expect(joined()).toBe("f91c")
  })

  it("invalid で各セルに aria-invalid、name で hidden input に値が入る、id は先頭セル", () => {
    mount(<Controlled invalid name="otp" id="otp" initial="12" />)
    expect(cells().every((c) => c.getAttribute("aria-invalid") === "true")).toBe(true)
    expect(container.querySelector<HTMLInputElement>('input[type="hidden"][name="otp"]')!.value).toBe("12")
    expect(cells()[0].id).toBe("otp")
  })

  it("uncontrolled（defaultValue）でも動く", () => {
    const onChange = vi.fn()
    mount(<CodeInput length={4} defaultValue="12" onChange={onChange} aria-label="x" />)
    expect(joined()).toBe("12")
    typeInto(cells()[2], "3")
    expect(joined()).toBe("123")
    expect(onChange).toHaveBeenCalledWith("123")
  })

  it("cellLabel で桁ごとの読み上げ名を差し替えられる（i18n）", () => {
    mount(<Controlled length={2} cellLabel={(i, n) => `Digit ${i + 1} of ${n}`} />)
    expect(cells()[1].getAttribute("aria-label")).toBe("Digit 2 of 2")
  })
})

describe("CodeInput single（#669）", () => {
  it("1 つの入力で maxLength・one-time-code・等幅大きめ字間広めを持つ", () => {
    mount(<Controlled variant="single" length={24} pattern="alphanumeric" uppercase />)
    const input = container.querySelector<HTMLInputElement>('[data-slot="code-input"]')!
    expect(input.tagName).toBe("INPUT")
    expect(input.maxLength).toBe(24)
    expect(input.getAttribute("autocomplete")).toBe("one-time-code")
    expect(input.getAttribute("aria-label")).toBe("認証コード")
    expect(input.className).toContain("font-mono")
    expect(input.className).toContain("tracking-wider")
    expect(input.className).toContain("h-[var(--Field-Height-Md)]")
    typeInto(input, "a1b2-c3")
    expect(input.value).toBe("A1B2C3")
  })
})

describe("native CodeInput（#669）", () => {
  const source = readFileSync(join(__dirname, "..", "src/native/components/CodeInput.tsx"), "utf8")
  it("SMS 自動入力の属性と Web と同じ API 語彙を持つ", () => {
    expect(source).toContain('textContentType: "oneTimeCode"')
    expect(source).toContain('"sms-otp"')
    expect(source).toContain('export type CodeInputVariant = "cells" | "single"')
    expect(source).toContain("onComplete?.(next)")
    expect(source).toContain('keyboardType: pattern === "numeric" ? "number-pad" : "default"')
  })
})
