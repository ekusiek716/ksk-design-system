/**
 * @vitest-environment jsdom
 *
 * issue #665: 押せる Card（onClick / href）。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"

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
const mount = (ui: React.ReactElement) => act(() => root.render(ui))
const card = () => container.querySelector<HTMLElement>('[data-slot="card"]')!
const overlay = () => container.querySelector<HTMLElement>('[data-slot="card-overlay"]')!

describe("押せる Card（#665）", () => {
  it("onClick で全面を覆う button を重ね、名前・説明を CardTitle / CardDescription に結ぶ", () => {
    const onClick = vi.fn()
    mount(
      <Card onClick={onClick}>
        <CardHeader>
          <CardTitle><s>打ち消し線のタイトル</s></CardTitle>
        </CardHeader>
        <CardDescription>期限 10/20</CardDescription>
      </Card>,
    )
    const btn = overlay()
    expect(btn.tagName).toBe("BUTTON")
    expect(btn.getAttribute("type")).toBe("button")
    expect(document.getElementById(btn.getAttribute("aria-labelledby")!)!.textContent).toBe("打ち消し線のタイトル")
    expect(document.getElementById(btn.getAttribute("aria-describedby")!)!.textContent).toBe("期限 10/20")
    expect(btn.className).toContain("focus-visible:ring-[3px]")
    act(() => btn.click())
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(card().dataset.interactive).toBe("true")
    expect(card().className).toContain("has-[>[data-slot=card-overlay]:active]:scale-[0.98]")
  })

  it("CardAction のボタンは overlay と兄弟（入れ子 button にならない）で、前面に出る", () => {
    const onClick = vi.fn()
    const onMenu = vi.fn()
    mount(
      <Card onClick={onClick}>
        <CardHeader>
          <CardTitle>t</CardTitle>
          <CardAction><button type="button" onClick={onMenu}>menu</button></CardAction>
        </CardHeader>
      </Card>,
    )
    expect(container.querySelectorAll("button button").length).toBe(0)
    expect(overlay().children.length).toBe(0)
    expect(card().className).toContain("[&_[data-slot=card-action]]:z-[2]")
    act(() => (container.querySelector("button:not([data-slot])") as HTMLButtonElement).click())
    expect(onMenu).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("aria-label は overlay の名前になり、ルート div には付かない", () => {
    mount(<Card onClick={() => {}} aria-label="タスクを開く"><p>x</p></Card>)
    expect(overlay().getAttribute("aria-label")).toBe("タスクを開く")
    expect(overlay().hasAttribute("aria-labelledby")).toBe(false)
    expect(overlay().hasAttribute("aria-describedby")).toBe(false)
    expect(card().hasAttribute("aria-label")).toBe(false)
  })

  it("href で a を重ね、variant=media でも使える。disabled なら遷移しない", () => {
    mount(<Card href="/notes" variant="media" disabled aria-label="メモ"><p>x</p></Card>)
    const a = overlay()
    expect(a.tagName).toBe("A")
    expect(a.getAttribute("href")).toBe("/notes")
    expect(a.getAttribute("aria-disabled")).toBe("true")
    expect(card().dataset.variant).toBe("media")
    const event = new MouseEvent("click", { bubbles: true, cancelable: true })
    act(() => { a.dispatchEvent(event) })
    expect(event.defaultPrevented).toBe(true)
  })

  it("押せる面は DOM の先頭（Tab 順がカード本体 → 内側の CardAction の視覚順になる）", () => {
    mount(
      <Card onClick={() => {}}>
        <CardHeader>
          <CardTitle>t</CardTitle>
          <CardAction><button type="button">menu</button></CardAction>
        </CardHeader>
      </Card>,
    )
    expect(card().firstElementChild).toBe(overlay())
    const focusables = Array.from(card().querySelectorAll("button"))
    expect(focusables[0]).toBe(overlay())
    expect(focusables[1].textContent).toBe("menu")
  })

  it("CardTitle / CardDescription に自前の id を付けても名前・説明に結ばれる", () => {
    mount(
      <Card onClick={() => {}}>
        <CardTitle id="my-title">自前 id のタイトル</CardTitle>
        <CardDescription id="my-desc">説明</CardDescription>
      </Card>,
    )
    expect(overlay().getAttribute("aria-labelledby")).toBe("my-title")
    expect(overlay().getAttribute("aria-describedby")).toBe("my-desc")
  })

  it("aria-labelledby を Card に渡すとそれが押せる面の名前になる", () => {
    mount(<><p id="ext">外の見出し</p><Card onClick={() => {}} aria-labelledby="ext"><p>x</p></Card></>)
    expect(overlay().getAttribute("aria-labelledby")).toBe("ext")
    expect(card().hasAttribute("aria-labelledby")).toBe(false)
  })

  it("名前が無い押せる Card は開発ビルドで 1 回だけ警告する。名前があれば警告しない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<Card onClick={() => {}}><p>名前なし</p></Card>)
    mount(<Card onClick={() => {}}><p>名前なし（再レンダー）</p></Card>)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("アクセシブルネーム"))
    warn.mockClear()
    act(() => root.unmount())
    root = createRoot(container)
    mount(<Card onClick={() => {}}><CardTitle>t</CardTitle></Card>)
    mount(<Card href="/x" aria-label="y" />)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("入れ子の Card の CardTitle は外側の押せる Card に登録されない", () => {
    mount(
      <Card onClick={() => {}}>
        <CardTitle>外側</CardTitle>
        <Card>
          <CardTitle>内側</CardTitle>
          <CardDescription>内側の説明</CardDescription>
        </Card>
      </Card>,
    )
    const outer = overlay()
    const labelled = outer.getAttribute("aria-labelledby")!.split(" ")
    expect(labelled).toHaveLength(1)
    expect(document.getElementById(labelled[0])!.textContent).toBe("外側")
    expect(outer.hasAttribute("aria-describedby")).toBe(false)
    // 押せない内側の Card のタイトル・説明には id を振らない（従来どおりの DOM）
    const innerTitle = Array.from(container.querySelectorAll('[data-slot="card-title"]'))[1]
    expect(innerTitle.hasAttribute("id")).toBe(false)
  })

  it("onClick / href が無ければ従来と同じ DOM（後方互換）", () => {
    const html = renderToStaticMarkup(
      <Card className="x"><CardTitle>t</CardTitle><CardDescription>d</CardDescription></Card>,
    )
    expect(html).not.toContain("card-overlay")
    expect(html).not.toContain("data-interactive")
    expect(html).not.toContain(" id=")
  })
})

describe("native Card の onPress（#665）", () => {
  const source = readFileSync(join(__dirname, "..", "src/native/components/Card.tsx"), "utf8")
  it("onPress で Pressable（role=button）になり、押下表現を持つ", () => {
    expect(source).toContain("onPress?: () => void")
    expect(source).toContain('accessibilityRole="button"')
    expect(source).toContain("transform: [{ scale: 0.98 }]")
  })
})
