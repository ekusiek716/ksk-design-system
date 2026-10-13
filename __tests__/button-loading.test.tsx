/**
 * @vitest-environment jsdom
 */
/**
 * Button の loading / loadingLabel（stract-ui #181 / baseconnect #183 #184 の逆輸入）。
 *
 * 固定すること:
 * - loading 未指定の出力は従来と同一（opt-in・既定の見た目を変えない）
 * - loading 中は aria-busy / aria-disabled を持ち、disabled 属性は付けない（フォーカスを保つ）
 * - クリックは握り潰され、type="submit" でもフォームを送信しない
 * - ラベルは DOM に残す（幅を保つ・アクセシブルネームを保つ）。loadingLabel 指定時は差し替え
 * - asChild 併用時はスピナーを出さず、aria-busy と disabled 相当だけを子へ渡す
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Button } from "../src/components/ui/button"

function parse(markup: string) {
  const container = document.createElement("div")
  container.innerHTML = markup
  return container.querySelector<HTMLElement>('[data-slot="button"]')!
}

let host: HTMLElement | null = null
let root: Root | null = null

function mount(ui: React.ReactElement) {
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => {
    root!.render(ui)
  })
  return host
}

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  host = null
  root = null
})

describe("Button loading", () => {
  it("loading 未指定 / false の出力は従来と同一", () => {
    const plain = renderToStaticMarkup(<Button>保存</Button>)
    expect(renderToStaticMarkup(<Button loading={false}>保存</Button>)).toBe(plain)
    expect(plain).not.toContain("aria-busy")
    expect(plain).not.toContain("button-spinner")
  })

  it("loading 中は aria-busy / aria-disabled を持ち、disabled 属性は付けない", () => {
    const btn = parse(renderToStaticMarkup(<Button loading>保存</Button>))
    expect(btn.getAttribute("aria-busy")).toBe("true")
    expect(btn.getAttribute("aria-disabled")).toBe("true")
    expect(btn.hasAttribute("disabled")).toBe(false)
  })

  it("ラベルは透明にして残し、スピナーは aria-hidden で重ねる（アクセシブルネームはラベル）", () => {
    const btn = parse(renderToStaticMarkup(<Button loading>保存</Button>))
    const spinner = btn.querySelector('[data-slot="button-spinner"]')
    expect(spinner?.getAttribute("aria-hidden")).toBe("true")
    expect(btn.textContent).toBe("保存")
    // ラベル側は opacity-0（visibility を消すと accessible name まで消える）で aria-hidden ではない
    const label = btn.querySelector('[data-slot="button-loading"] > span')
    expect(label?.className).toContain("opacity-0")
    expect(label?.hasAttribute("aria-hidden")).toBe(false)
  })

  it("loadingLabel 指定時は元のラベルを読み上げから外して文言を出す", () => {
    const btn = parse(renderToStaticMarkup(<Button loading loadingLabel="保存中…">保存</Button>))
    const label = btn.querySelector('[data-slot="button-loading"] > span')
    expect(label?.getAttribute("aria-hidden")).toBe("true")
    expect(btn.textContent).toContain("保存中…")
  })

  it("loading 中のクリックは onClick を呼ばず、フォームも送信しない", () => {
    const onClick = vi.fn()
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    const el = mount(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading onClick={onClick}>
          送信
        </Button>
      </form>,
    )
    const btn = el.querySelector("button")!
    act(() => btn.click())
    expect(onClick).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("フォーカス中に loading になってもフォーカスを保つ", () => {
    function Demo({ loading }: { loading: boolean }) {
      return <Button loading={loading}>保存</Button>
    }
    const el = mount(<Demo loading={false} />)
    const btn = el.querySelector("button")!
    btn.focus()
    expect(document.activeElement).toBe(btn)
    act(() => root!.render(<Demo loading />))
    expect(document.activeElement).toBe(btn)
  })

  it("asChild 併用時はスピナーを出さず aria-busy と disabled 相当を子へ渡す", () => {
    const markup = renderToStaticMarkup(
      <Button asChild loading>
        <a href="/next">次へ</a>
      </Button>,
    )
    const a = parse(markup)
    expect(a.tagName).toBe("A")
    expect(a.getAttribute("aria-busy")).toBe("true")
    expect(a.getAttribute("aria-disabled")).toBe("true")
    expect(a.getAttribute("tabindex")).toBe("-1")
    expect(a.hasAttribute("href")).toBe(false)
    expect(a.querySelector('[data-slot="button-spinner"]')).toBeNull()
    expect(a.textContent).toBe("次へ")
  })
})
