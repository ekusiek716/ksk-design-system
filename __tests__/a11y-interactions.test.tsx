/**
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ListItem } from "../src/components/patterns/list-item"
import { ShareButtons } from "../src/components/patterns/share-buttons"
import { AppShell } from "../src/components/patterns/shells/app-shell"

let container: HTMLElement | null = null
let root: Root | null = null

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(ui)
  })
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  })
})

afterEach(() => {
  if (root) {
    act(() => {
      root!.unmount()
    })
    root = null
  }
  container?.remove()
  container = null
  document.body.innerHTML = ""
  vi.restoreAllMocks()
})

describe("SkipLink / AppShell", () => {
  it("本文 landmark へ実リンクで移動してフォーカスする", () => {
    mount(
      <AppShell mainId="primary-content" skipLinkLabel="本文へ">
        本文
      </AppShell>,
    )

    const link = document.querySelector<HTMLAnchorElement>('[data-slot="skip-link"]')
    const main = document.querySelector<HTMLElement>('[data-slot="app-main"]')

    expect(link?.getAttribute("href")).toBe("#primary-content")
    expect(main?.id).toBe("primary-content")
    expect(main?.tabIndex).toBe(-1)

    act(() => {
      link?.click()
    })

    expect(document.activeElement).toBe(main)
    expect(main?.scrollIntoView).toHaveBeenCalled()
  })

  it("skipLink=false で内蔵リンクを無効化できる", () => {
    mount(<AppShell skipLink={false}>本文</AppShell>)
    expect(document.querySelector('[data-slot="skip-link"]')).toBeNull()
  })
})

describe("ListItem semantics", () => {
  it("href は anchor、onClick は button、静的項目は div で描画する", () => {
    const onClick = vi.fn()
    mount(
      <>
        <ListItem href="/settings" title="設定" />
        <ListItem onClick={onClick} title="再読み込み" />
        <ListItem title="説明" />
      </>,
    )

    const items = document.querySelectorAll<HTMLElement>('[data-slot="list-item"]')
    expect(items[0]?.tagName).toBe("A")
    expect(items[0]?.getAttribute("href")).toBe("/settings")
    expect(items[1]?.tagName).toBe("BUTTON")
    expect((items[1] as HTMLButtonElement).type).toBe("button")
    expect(items[2]?.tagName).toBe("DIV")

    act(() => {
      items[1]?.click()
    })
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("disabled link は遷移を抑止して aria-disabled を付ける", () => {
    const onClick = vi.fn()
    mount(<ListItem href="/danger" disabled onClick={onClick} title="無効" />)

    const link = document.querySelector<HTMLAnchorElement>('[data-slot="list-item"]')
    const event = new MouseEvent("click", { bubbles: true, cancelable: true })
    act(() => {
      link?.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(true)
    expect(link?.getAttribute("aria-disabled")).toBe("true")
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe("ShareButtons copy feedback", () => {
  it("コピー成功を live region と onCopy に通知する", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const onCopy = vi.fn()
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    mount(
      <ShareButtons
        url="https://example.com"
        providers={["copy"]}
        onCopy={onCopy}
      />,
    )

    await act(async () => {
      document.querySelector<HTMLButtonElement>("button")?.click()
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledWith("https://example.com")
    expect(onCopy).toHaveBeenCalledWith("success")
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe("コピーしました")
  })

  it("Clipboard API の失敗を error として通知する", async () => {
    const onCopy = vi.fn()
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    })
    mount(
      <ShareButtons
        url="https://example.com"
        providers={["copy"]}
        onCopy={onCopy}
      />,
    )

    await act(async () => {
      document.querySelector<HTMLButtonElement>("button")?.click()
      await Promise.resolve()
    })

    expect(onCopy).toHaveBeenCalledWith("error")
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe("コピーできませんでした")
  })
})
