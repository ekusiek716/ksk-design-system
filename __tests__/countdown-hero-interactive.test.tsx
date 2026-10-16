/**
 * @vitest-environment jsdom
 *
 * issue #672: CountdownHero を押せるヒーローにする（onClick / href）。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CountdownHero } from "../src/components/patterns/countdown-hero"

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
const hero = () => container.querySelector<HTMLElement>('[data-slot="countdown-hero"]')!
const action = () => container.querySelector<HTMLElement>('[data-slot="countdown-hero-action"]')

describe("CountdownHero の押せる状態（#672）", () => {
  it("onClick でヒーロー全面を覆う button を重ね、クリックで発火する", () => {
    const onClick = vi.fn()
    mount(<CountdownHero targetDate="2099-01-01" onClick={onClick} />)
    const btn = action()!
    expect(btn.tagName).toBe("BUTTON")
    expect(btn.getAttribute("type")).toBe("button")
    expect(btn.className).toContain("absolute inset-0")
    expect(btn.className).toContain("focus-visible:ring-[3px]")
    act(() => btn.click())
    expect(onClick).toHaveBeenCalledTimes(1)
    // 本文（p / div）は button の子にしない（不正な HTML 回避）
    expect(btn.children.length).toBe(0)
    expect(hero().dataset.interactive).toBe("true")
    expect(hero().className).toContain("active:opacity-70")
  })

  it("名前は既定で表示中の文言（aria-labelledby で本文を指す）", () => {
    mount(<CountdownHero targetDate="2099-01-01" dateLabel="2099.01.01" onClick={() => {}} />)
    const id = action()!.getAttribute("aria-labelledby")!
    const labelled = document.getElementById(id)!
    expect(labelled.textContent).toContain("残り")
    expect(labelled.textContent).toContain("days")
    expect(labelled.textContent).toContain("2099.01.01")
  })

  it("aria-label 指定時はそれが名前になる", () => {
    mount(<CountdownHero targetDate="2099-01-01" aria-label="挙式日を編集" onClick={() => {}} />)
    expect(action()!.getAttribute("aria-label")).toBe("挙式日を編集")
    expect(action()!.hasAttribute("aria-labelledby")).toBe(false)
  })

  it("href で a を重ねる。disabled なら遷移しない", () => {
    mount(<CountdownHero targetDate="2099-01-01" href="/edit" disabled />)
    const a = action()!
    expect(a.tagName).toBe("A")
    expect(a.getAttribute("href")).toBe("/edit")
    expect(a.getAttribute("aria-disabled")).toBe("true")
    const event = new MouseEvent("click", { bubbles: true, cancelable: true })
    act(() => { a.dispatchEvent(event) })
    expect(event.defaultPrevented).toBe(true)
  })

  it("disabled の button は押せない", () => {
    const onClick = vi.fn()
    mount(<CountdownHero targetDate="2099-01-01" onClick={onClick} disabled />)
    expect((action() as HTMLButtonElement).disabled).toBe(true)
    act(() => action()!.click())
    expect(onClick).not.toHaveBeenCalled()
  })

  it("onClick / href が無ければ従来どおり表示専用（後方互換）", () => {
    const html = renderToStaticMarkup(<CountdownHero targetDate="2099-01-01" />)
    expect(html).not.toContain("countdown-hero-action")
    expect(html).not.toContain("data-interactive")
    expect(html).not.toContain(" id=")
  })
})

describe("native CountdownHero の押せる状態（#672）", () => {
  const source = readFileSync(join(__dirname, "..", "src/native/components/CountdownHero.tsx"), "utf8")
  it("onPress で Pressable（role=button）になり、押下中だけ薄くなる", () => {
    expect(source).toContain("onPress?: () => void")
    expect(source).toContain('accessibilityRole="button"')
    expect(source).toContain("opacity: disabled ? 0.5 : pressed ? 0.7 : 1")
  })
  it("読み上げ名の既定は表示中の文言", () => {
    expect(source).toContain("accessibilityLabel={accessibilityLabel ??")
  })
})
