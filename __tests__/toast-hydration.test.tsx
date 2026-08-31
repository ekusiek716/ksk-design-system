/**
 * @vitest-environment jsdom
 *
 * Toaster の SSR/SSG hydration 整合（issue #489）
 *
 * consumer（trip-todo / Next.js `output: "export"` + React 19）で、root layout に
 * `<Toaster>` を置くと初回ロードのたびに
 * `Hydration failed because the server rendered HTML didn't match the client.`
 * が出て、ツリー全体がクライアント再レンダーされていた。
 *
 * 原因は ToastViewport が render 中に `typeof document === "undefined"` で分岐し、
 * サーバーでは null・クライアントでは初回 render からいきなり portal を返していたこと。
 * React の hydration では「サーバー出力とクライアント初回 render が一致すること」が
 * 契約なので、環境分岐そのものが違反になる。
 *
 * ここで固定するのは 3 点:
 *   1. サーバー出力（renderToStaticMarkup）に viewport が含まれない
 *   2. その HTML への hydrateRoot が recoverable error を出さない
 *   3. hydration 後に viewport が（portal 先に）現れ、toast が表示できる
 *
 * 併せて getServerSnapshot が毎回同じ参照を返すこと（"The result of
 * getServerSnapshot should be cached to avoid an infinite loop" 警告の原因）も見る。
 *
 * なお jsdom では `document` が常に定義済みなので、修正前のコードは
 * renderToStaticMarkup の時点で "Portals are not currently supported by the
 * server renderer" で落ちる（本番の Node 実行では代わりに hydration mismatch に
 * なる）。壊れ方は環境で違うが、どちらも原因は同じ「render 中の環境分岐」で、
 * このテストは修正前に確実に落ちる（revert して確認済み）。
 */
import { describe, it, expect, afterEach, vi } from "vitest"
import * as React from "react"
import { act } from "react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"

import { Toaster, toast, useToast } from "../src/components/ui/toast"

let root: Root | null = null
let host: HTMLElement | null = null

afterEach(() => {
  act(() => {
    root?.unmount()
  })
  root = null
  host?.remove()
  host = null
  document.querySelectorAll("[data-slot='toast-viewport']").forEach((n) => n.remove())
})

function hydrate(ui: React.ReactElement) {
  const html = renderToStaticMarkup(ui)
  host = document.createElement("div")
  host.innerHTML = html
  document.body.appendChild(host)

  const recoverable: unknown[] = []
  act(() => {
    root = hydrateRoot(host!, ui, {
      onRecoverableError: (err) => recoverable.push(err),
    })
  })
  return { html, recoverable }
}

describe("Toaster hydration (issue #489)", () => {
  it("サーバー出力には toast viewport が含まれない", () => {
    const html = renderToStaticMarkup(
      <Toaster regionLabel="通知" closeLabel="閉じる">
        <main id="app">hello</main>
      </Toaster>
    )
    expect(html).toContain('id="app"')
    expect(html).not.toContain("toast-viewport")
  })

  it("その HTML への hydration が mismatch を起こさない", () => {
    const { recoverable } = hydrate(
      <Toaster regionLabel="通知" closeLabel="閉じる">
        <main id="app">hello</main>
      </Toaster>
    )
    expect(recoverable.map(String)).toEqual([])
  })

  it("hydration 後に viewport が document.body へ現れ、toast を表示できる", () => {
    hydrate(
      <Toaster regionLabel="通知" closeLabel="閉じる">
        <main id="app">hello</main>
      </Toaster>
    )
    const viewport = document.querySelector("[data-slot='toast-viewport']")
    expect(viewport).not.toBeNull()
    expect(viewport?.parentElement).toBe(document.body)

    act(() => {
      toast("保存しました", { duration: 0 })
    })
    expect(document.body.textContent).toContain("保存しました")
    act(() => {
      toast.dismiss(
        document.querySelector("[data-slot='toast']")?.getAttribute("data-id") ?? ""
      )
    })
  })

  it("hydration 中に getServerSnapshot 由来の警告が出ない", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    try {
      hydrate(
        <Toaster>
          <main id="app">hello</main>
        </Toaster>
      )
      const messages = errorSpy.mock.calls.map((c) => String(c[0]))
      expect(messages.filter((m) => m.includes("getServerSnapshot"))).toEqual([])
      expect(messages.filter((m) => m.includes("Hydration"))).toEqual([])
    } finally {
      errorSpy.mockRestore()
    }
  })

  it("Provider 不在でも useToast は動く（後方互換）", () => {
    function Probe() {
      const { toast: t } = useToast()
      return <button onClick={() => t({ title: "ping", duration: 0 })}>go</button>
    }
    const html = renderToStaticMarkup(<Probe />)
    expect(html).toContain("go")
  })
})
