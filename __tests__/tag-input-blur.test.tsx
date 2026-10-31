/**
 * @vitest-environment jsdom
 *
 * issue #790: TagInput で Enter 確定 → 次の文字を入力 → Enter を押さずに離脱すると、
 * 最初の blur だけタグ化されず入力が黙って失われていた。
 *
 * Enter のたびに立つ「直後の blur を飛ばす」フラグが、次に文字を打っても下りず、
 * 次の最初の blur まで残っていたのが原因。フラグは入力が変わった時点で下ろす。
 * Enter 直後の blur で二重追加しないこと（ede96b6 が守ろうとした挙動）も併せて固定する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { TagInput } from "../src/components/patterns/tag-input"

let container: HTMLElement
let root: Root

function typeInto(input: HTMLInputElement, value: string) {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!
  act(() => {
    setValue.call(input, value)
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })
}

function enter(input: HTMLInputElement) {
  act(() => {
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }))
  })
}

function blur(input: HTMLInputElement) {
  act(() => {
    input.blur()
  })
}

function focus(input: HTMLInputElement) {
  act(() => {
    input.focus()
  })
}

/** value を state で更新する実際の使い方。onChange の呼び出しは spy で数える。 */
function Demo({
  spy,
  initial = [],
  max,
  allowDuplicates,
}: {
  spy: (tags: string[]) => void
  initial?: string[]
  max?: number
  allowDuplicates?: boolean
}) {
  const [tags, setTags] = React.useState<string[]>(initial)
  return (
    <TagInput
      value={tags}
      onChange={(next) => {
        spy(next)
        setTags(next)
      }}
      max={max}
      allowDuplicates={allowDuplicates}
      inputLabel="タグ"
    />
  )
}

function mountDemo(props: Omit<React.ComponentProps<typeof Demo>, "spy"> = {}) {
  const spy = vi.fn()
  act(() => {
    root.render(<Demo spy={spy} {...props} />)
  })
  const input = container.querySelector<HTMLInputElement>('[data-slot="tag-input"] input')!
  return { spy, input }
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
  vi.restoreAllMocks()
})

describe("TagInput: フォーカスが外れると入力中の文字がタグになる (#790)", () => {
  it("Enter で foo を確定 → bar を入力 → blur で bar もタグになる", () => {
    const { spy, input } = mountDemo()
    focus(input)
    typeInto(input, "foo")
    enter(input)
    expect(spy).toHaveBeenLastCalledWith(["foo"])

    typeInto(input, "bar")
    blur(input)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith(["foo", "bar"])
    expect(input.value).toBe("")
  })

  it("Enter の直後に blur しても二重追加しない（onChange は Enter の 1 回だけ）", () => {
    const { spy, input } = mountDemo()
    focus(input)
    typeInto(input, "foo")
    enter(input)
    blur(input)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(["foo"])
  })

  it("空の Enter の後に入力した文字も最初の blur でタグになる", () => {
    const { spy, input } = mountDemo()
    focus(input)
    enter(input)
    expect(spy).not.toHaveBeenCalled()
    typeInto(input, "bar")
    blur(input)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(["bar"])
  })

  it("重複で弾かれた Enter の後に入力し直した文字も最初の blur でタグになる", () => {
    const { spy, input } = mountDemo({ initial: ["foo"] })
    focus(input)
    typeInto(input, "foo")
    enter(input)
    // 重複は追加されず、入力欄に残る
    expect(spy).not.toHaveBeenCalled()
    expect(input.value).toBe("foo")
    typeInto(input, "bar")
    blur(input)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(["foo", "bar"])
  })

  it("max 到達で弾かれた Enter の後は、blur でも追加しない（max を守る）", () => {
    const { spy, input } = mountDemo({ initial: ["a"], max: 2 })
    focus(input)
    typeInto(input, "b")
    enter(input)
    expect(spy).toHaveBeenLastCalledWith(["a", "b"])
    // max 到達で入力欄は disabled になり、以降の文字はタグにならない
    expect(input.disabled).toBe(true)
    blur(input)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it("Enter を押さずに入力して離脱しても従来どおりタグになる", () => {
    const { spy, input } = mountDemo()
    focus(input)
    typeInto(input, "baz")
    blur(input)
    expect(spy).toHaveBeenCalledWith(["baz"])
  })
})
