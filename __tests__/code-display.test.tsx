/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { describe, expect, it, vi } from "vitest"

import { CodeDisplay } from "../src/components/patterns/code-display"

// issue #686: コード表示 + コピー。
async function mount(ui: React.ReactElement) {
  const host = document.createElement("div")
  document.body.append(host)
  const root = createRoot(host)
  await act(async () => root.render(ui))
  return { host, unmount: () => act(() => root.unmount()) }
}

describe("CodeDisplay（#686）", () => {
  it("コードを等幅・広めの字間で見せ、見出しを出す", async () => {
    const { host, unmount } = await mount(<CodeDisplay code="AB12-CD34" label="招待コード" />)
    const code = host.querySelector<HTMLElement>('[data-slot="code-display-code"]')!
    expect(code.textContent).toBe("AB12-CD34")
    expect(code.className.split(" ")).toEqual(expect.arrayContaining(["font-mono", "tracking-wider", "break-all"]))
    expect(host.querySelector('[data-slot="code-display-label"]')?.textContent).toBe("招待コード")
    unmount()
  })

  it("コピーで clipboard に書き、文言を「コピーしました」に変えて live region で伝える", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    const onCopy = vi.fn()
    const { host, unmount } = await mount(<CodeDisplay code="AB12" onCopy={onCopy} />)
    const button = host.querySelector<HTMLButtonElement>('[data-slot="code-display-copy"]')!
    expect(button.textContent).toBe("コピー")
    await act(async () => button.click())
    expect(writeText).toHaveBeenCalledWith("AB12")
    expect(onCopy).toHaveBeenCalledWith("success")
    expect(button.textContent).toBe("コピーしました")
    expect(button.querySelector('[aria-live="polite"]')).not.toBeNull()
    unmount()
  })

  it("clipboard が使えないときは失敗を伝える", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true })
    const onCopy = vi.fn()
    const { host, unmount } = await mount(<CodeDisplay code="AB12" onCopy={onCopy} />)
    const button = host.querySelector<HTMLButtonElement>('[data-slot="code-display-copy"]')!
    await act(async () => button.click())
    expect(onCopy).toHaveBeenCalledWith("error")
    expect(button.textContent).toBe("コピーできませんでした")
    unmount()
  })

  it("copyable=false はボタンを出さない", async () => {
    const { host, unmount } = await mount(<CodeDisplay code="AB12" copyable={false} />)
    expect(host.querySelector('[data-slot="code-display-copy"]')).toBeNull()
    unmount()
  })

  it("native CodeDisplay は onCopy を渡したときだけコピーボタンを出す", () => {
    const src = readFileSync(join(__dirname, "..", "src/native/components/CodeDisplay.tsx"), "utf8")
    expect(src).toContain("{onCopy ? (")
    expect(src).toContain("selectable")
  })
})
