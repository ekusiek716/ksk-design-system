/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { ShareButtons } from "../src/components/patterns/share-buttons"

// issue #685: message（任意本文）・labels・layout="block"（全幅・大サイズの主ボタン）。
function clickAndCapture(ui: React.ReactElement, provider: string) {
  const open = vi.spyOn(window, "open").mockImplementation(() => null)
  const host = document.createElement("div")
  document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(ui))
  const button = host.querySelector<HTMLButtonElement>(`button[aria-label="${provider}"]`)!
  act(() => button.click())
  const url = String(open.mock.calls[0]?.[0] ?? "")
  act(() => root.unmount())
  host.remove()
  open.mockRestore()
  return url
}

describe("ShareButtons message（#685）", () => {
  it("LINE は message + url を line.me/R/share の text に渡す", () => {
    const url = clickAndCapture(<ShareButtons url="https://ex.com/i" message="招待コード: AB12" providers={["line"]} />, "LINE")
    expect(url.startsWith("https://line.me/R/share?text=")).toBe(true)
    expect(decodeURIComponent(url.split("text=")[1])).toBe("招待コード: AB12 https://ex.com/i")
  })
  it("message 未指定の LINE は従来どおり lineit/share", () => {
    const url = clickAndCapture(<ShareButtons url="https://ex.com/i" title="t" providers={["line"]} />, "LINE")
    expect(url).toContain("social-plugins.line.me/lineit/share?url=")
  })
  it("X は message を text に使う", () => {
    const url = clickAndCapture(<ShareButtons url="https://ex.com/i" title="t" message="本文" providers={["x"]} />, "X")
    expect(url).toContain(`&text=${encodeURIComponent("本文")}`)
  })
})

describe("ShareButtons layout=block / labels（#685）", () => {
  const html = (ui: React.ReactElement) => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(ui)
    return host
  }
  it("全幅・大サイズの主ボタンを縦に積み、LINE は公式色の塗りと AA を満たす前景・トークンの hover", () => {
    const host = html(<ShareButtons layout="block" url="u" providers={["line", "copy"]} labels={{ line: "LINE で招待を送る" }} />)
    const group = host.querySelector<HTMLElement>('[data-slot="share-buttons"]')!
    expect(group.dataset.layout).toBe("block")
    expect(group.className).toContain("flex-col")
    const line = host.querySelector<HTMLButtonElement>('button[data-provider="line"]')!
    expect(line.getAttribute("aria-label")).toBe("LINE で招待を送る")
    expect(line.textContent).toContain("LINE で招待を送る")
    const cls = line.className.split(" ")
    expect(cls).toEqual(
      expect.arrayContaining([
        "w-full",
        "h-[var(--Control-Height-Lg)]",
        "bg-[var(--Brand-Line)]",
        "text-[var(--Brand-on-Line)]",
        "hover:bg-[var(--Brand-Line-Hover)]",
        "active:bg-[var(--Brand-Line-Pressed)]",
      ]),
    )
    const copy = host.querySelector<HTMLButtonElement>('button[data-provider="copy"]')!
    expect(copy.className).toContain("bg-[var(--Surface-Primary)]")
  })
  it("labels は circle / inline のラベルとアクセシブルネームにも効く", () => {
    const host = html(<ShareButtons layout="inline" url="u" providers={["line"]} labels={{ line: "Send via LINE" }} />)
    expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Send via LINE")
  })
})

describe("ShareButtons layout=block のコピー結果の通知（レビュー指摘）", () => {
  it("ボタンの外の role=status で成功を伝え、ボタン内に live region を持たない", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    const host = document.createElement("div")
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<ShareButtons layout="block" url="https://ex.com" providers={["copy"]} />))
    const button = host.querySelector<HTMLButtonElement>('button[data-provider="copy"]')!
    expect(button.querySelector("[aria-live]")).toBeNull()
    await act(async () => button.click())
    const status = host.querySelector('[role="status"][data-slot="share-buttons-status"]')!
    expect(button.contains(status)).toBe(false)
    expect(status.textContent).toBe("コピーしました")
    act(() => root.unmount())
    host.remove()
  })
})
