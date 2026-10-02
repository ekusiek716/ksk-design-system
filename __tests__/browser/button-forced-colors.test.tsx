import { describe, expect, it, afterEach } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import { cdp, userEvent } from "vitest/browser"
import { Button } from "@/components/ui/button"
import "@/index.css"

/**
 * issue #620: 強制配色（forced-colors / Windows ハイコントラスト等）モードで
 * キーボードフォーカス時の枠が見えるかを実ブラウザ（chromium）で検証する。
 *
 * DS のフォーカス表示は `focus-visible:ring-*`（box-shadow）だが、box-shadow は
 * forced-colors モードで描画されない。Button は `focus-visible:outline-hidden` を
 * 併用しており、これは Tailwind v4 で `@media (forced-colors: active)` のときだけ
 * `outline: 2px solid transparent` になる（OS が transparent をシステム色へ置換する
 * ため、box-shadow が死んでいてもこの outline で枠が残る）。`outline-none` では
 * このメディアクエリ自体が生成されないため、forced-colors モードでは
 * ring も outline も両方消え、キーボード操作中の現在地が完全に見えなくなる。
 *
 * CDP (`Emulation.setEmulatedMedia`) で forced-colors を有効化し、Tab で
 * フォーカスを当てた Button の `getComputedStyle(...).outlineStyle` が
 * `"none"` ではないこと（= 枠が出る状態になっていること）を確認する。
 * 対比として、同じ条件で `outline-none` を強制した要素は `"none"` のままに
 * なることも確認し、両者の差分が実際に意味を持つことを示す。
 */

// @testing-library 系を使わず react-dom/client で直接マウントするため、
// act() の警告を避けるために明示する。
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(async () => {
  await cdp().send("Emulation.setEmulatedMedia", { features: [] })
  if (root) {
    act(() => root!.unmount())
    root = undefined
  }
  if (container) {
    container.remove()
    container = undefined
  }
})

async function mount(node: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(node)
  })
}

describe("forced-colors モードでのフォーカス表示 (issue #620)", () => {
  it("Button は forced-colors 時、キーボードフォーカスで outline が none でなくなる", async () => {
    await cdp().send("Emulation.setEmulatedMedia", {
      features: [{ name: "forced-colors", value: "active" }],
    })

    await mount(<Button>送信</Button>)
    const button = container!.querySelector("button")!

    await userEvent.tab() // ドキュメント先頭から Tab で button へフォーカス

    expect(document.activeElement).toBe(button)
    const style = getComputedStyle(button)
    // outline-hidden は forced-colors 時のみ `outline: 2px solid transparent` を
    // 生成する。transparent は OS 側でシステムの強制配色に置換されるため、
    // outlineStyle 自体は transparent 指定時点で "solid" になっている。
    expect(style.outlineStyle).not.toBe("none")
  })

  it("対比: outline-none のままだと forced-colors 時も outline が none のまま", async () => {
    await cdp().send("Emulation.setEmulatedMedia", {
      features: [{ name: "forced-colors", value: "active" }],
    })

    await mount(
      <button className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50">
        比較用
      </button>,
    )
    const button = container!.querySelector("button")!

    await userEvent.tab()

    expect(document.activeElement).toBe(button)
    const style = getComputedStyle(button)
    expect(style.outlineStyle).toBe("none")
  })
})
