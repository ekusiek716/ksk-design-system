import { describe, expect, it, afterEach } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import { userEvent } from "vitest/browser"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import "@/index.css"

/**
 * inline 入力欄（variant="inline"）のエラー枠。
 * `aria-invalid:ring-2 aria-invalid:ring-[var(--Border-Caution)]` が実際に描かれ、
 * エラー中にフォーカスしても（Focus の 3px リングに戻らず）不透明な Caution のリングのままで、
 * 面（Surface-Primary / Surface-Secondary）に対して 3:1 以上の色であることを実ブラウザで確認する。
 * 色の比の数値は scripts/check-contrast.mjs（Border-Caution / Surface-Primary・Secondary）。
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(() => {
  document.documentElement.classList.remove("dark")
  if (root) {
    act(() => root!.unmount())
    root = undefined
  }
  container?.remove()
  container = undefined
})

function mount(node: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(node)
  })
}

/** CSS 変数を実色（rgb(...)）に解決する */
function resolveColor(variable: string) {
  const probe = document.createElement("i")
  probe.style.color = `var(${variable})`
  container!.appendChild(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color
}

describe("inline 入力欄のエラー枠", () => {
  for (const mode of ["light", "dark"] as const) {
    it(`Input inline（${mode}）: エラー中は不透明な Border-Caution の 2px リング。フォーカスしても同じ`, async () => {
      if (mode === "dark") document.documentElement.classList.add("dark")
      mount(<Input variant="inline" aria-invalid="true" defaultValue="入力" aria-label="タイトル" />)
      const input = container!.querySelector("input")!
      const caution = resolveColor("--Border-Caution")
      // 不透明（rgb(...)。rgba(...) なら半透明）
      expect(caution).toMatch(/^rgb\(/)

      // フォーカス前
      expect(getComputedStyle(input).boxShadow).toContain(`${caution} 0px 0px 0px 2px`)

      await userEvent.tab()
      expect(document.activeElement).toBe(input)
      const focused = getComputedStyle(input).boxShadow
      // エラー中にフォーカスしても Caution のリングのまま（Focus の 3px リングに戻らない）
      expect(focused).toContain(`${caution} 0px 0px 0px 2px`)
      expect(focused).not.toContain(resolveColor("--Focus-High-Emphasis"))
    })
  }

  it("Textarea inline: エラー中のリングも Border-Caution", async () => {
    mount(<Textarea variant="inline" aria-invalid="true" defaultValue="入力" aria-label="メモ" />)
    const textarea = container!.querySelector("textarea")!
    const caution = resolveColor("--Border-Caution")
    await userEvent.tab()
    expect(document.activeElement).toBe(textarea)
    expect(getComputedStyle(textarea).boxShadow).toContain(`${caution} 0px 0px 0px 2px`)
  })
})
