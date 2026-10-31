import { afterEach, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { cdp, userEvent } from "vitest/browser"
import { SwipeRow } from "@/components/patterns/swipe-row"
import "@/index.css"

/**
 * SwipeRow のポインタ操作を実ブラウザで固定する（issue #794）。
 *
 * jsdom は pointer capture を実装しないため、「pointerdown で行がポインタを握ると
 * children のボタン・リンクに click が届かない」不具合は jsdom では原理的に再現できない。
 * chromium の実マウス入力（CDP の Input.dispatchMouseEvent）で、
 * (a) 子のボタンのクリックが届く (b) 横ドラッグで開き、直後に子の onClick が誤発火しない
 * (c) 右ボタンのドラッグでは開かない、の 3 点を確かめる。
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(() => {
  if (root) act(() => root!.unmount())
  root = undefined
  container?.remove()
})

function mount(onChildClick: () => void, onAction = vi.fn()) {
  container = document.createElement("div")
  container.style.cssText = "position:absolute;left:200px;top:40px;width:320px"
  document.body.appendChild(container)
  root = createRoot(container)
  act(() =>
    root!.render(
      <SwipeRow actions={[{ label: "削除", onClick: onAction, variant: "destructive" }]}>
        <button type="button" data-testid="child" onClick={onChildClick} style={{ display: "block", width: "100%", height: 48 }}>
          行を開く
        </button>
      </SwipeRow>,
    ),
  )
  const child = container.querySelector<HTMLButtonElement>('[data-testid="child"]')!
  const main = child.parentElement as HTMLElement
  return { child, main }
}

type Button = "left" | "right"

/**
 * CDP の座標はテスト実行 iframe の外側（親ページ）基準で、iframe は縮小表示されている。
 * 2 点に mouseMoved を送って iframe 内の clientX/Y との一次変換を求める。
 */
let toPage: ((x: number, y: number) => [number, number]) | undefined
async function calibrate() {
  if (toPage) return toPage
  const seen: Array<[number, number]> = []
  const onMove = (e: PointerEvent) => seen.push([e.clientX, e.clientY])
  window.addEventListener("pointermove", onMove, true)
  for (const p of [100, 200]) {
    await cdp().send("Input.dispatchMouseEvent", { type: "mouseMoved", x: p, y: p, button: "none", buttons: 0 })
  }
  await new Promise((r) => setTimeout(r, 20))
  window.removeEventListener("pointermove", onMove, true)
  const [[x1, y1], [x2, y2]] = seen.slice(-2)
  const sx = (x2 - x1) / 100
  const sy = (y2 - y1) / 100
  const ox = x1 - 100 * sx
  const oy = y1 - 100 * sy
  toPage = (x, y) => [(x - ox) / sx, (y - oy) / sy]
  return toPage
}

async function mouse(type: "mousePressed" | "mouseMoved" | "mouseReleased", clientX: number, clientY: number, button: Button | "none" = "left") {
  const buttons = button === "left" ? 1 : button === "right" ? 2 : 0
  const [x, y] = (await calibrate())(clientX, clientY)
  await cdp().send("Input.dispatchMouseEvent", {
    type,
    x,
    y,
    button,
    buttons: type === "mouseReleased" ? 0 : buttons,
    clickCount: type === "mouseMoved" ? 0 : 1,
  })
}

/** 要素中央から dx だけ横にドラッグする（途中の move を数回挟む） */
async function drag(el: HTMLElement, dx: number, button: Button = "left") {
  const r = el.getBoundingClientRect()
  const x = r.left + r.width / 2
  const y = r.top + r.height / 2
  await mouse("mouseMoved", x, y, "none")
  await mouse("mousePressed", x, y, button)
  const steps = 5
  for (let i = 1; i <= steps; i++) {
    await mouse("mouseMoved", x + (dx * i) / steps, y, button)
  }
  await mouse("mouseReleased", x + dx, y, button)
}

const translateX = (el: HTMLElement) => el.style.transform

it("children のボタンを単純にクリックすると onClick が呼ばれる（行がポインタを握らない）", async () => {
  const onClick = vi.fn()
  const { child, main } = mount(onClick)
  await userEvent.click(child)
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(translateX(main)).toBe("translateX(0px)")
})

it("横ドラッグで行が開き、直後に children の onClick は呼ばれない", async () => {
  const onClick = vi.fn()
  const { child, main } = mount(onClick)
  await drag(child, -120)
  await new Promise((r) => setTimeout(r, 50))
  expect(translateX(main)).toBe("translateX(-72px)")
  expect(onClick).not.toHaveBeenCalled()
  // 閾値未満の小さな揺れはクリック扱いのまま届く
  await drag(child, 3)
  expect(onClick).toHaveBeenCalledTimes(1)
})

it("右ボタンのドラッグでは行が開かない", async () => {
  const onClick = vi.fn()
  const { child, main } = mount(onClick)
  container!.addEventListener("contextmenu", (e) => e.preventDefault())
  await drag(child, -120, "right")
  await new Promise((r) => setTimeout(r, 50))
  expect(translateX(main)).toBe("translateX(0px)")
  expect(onClick).not.toHaveBeenCalled()
})
