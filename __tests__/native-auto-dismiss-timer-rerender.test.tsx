/**
 * @vitest-environment jsdom
 *
 * issue #812（native 版）: 自動で閉じる・隠れるタイマーの effect が、呼び出し側の
 * コールバック（onDone / onOpenChange / onVisibleChange）を依存配列に持っていた。
 * その場の関数で渡し、親が期限より短い間隔で再描画し続けると、タイマーが巻き戻って
 * 期限が一度も来なかった。react-native を react-native-web に差し替えて描画して確かめる。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("react-native", async () => await vi.importActual("react-native-web"))

import { Celebration } from "../src/native/components/Celebration"
import { CelebrationDialog } from "../src/native/components/CelebrationDialog"
import { MediaActionCluster } from "../src/native/components/MediaActionCluster"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

let host: HTMLDivElement
let root: Root

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  vi.useFakeTimers()
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.useRealTimers()
})

/** `every` ms ごとに自分を再描画する親。子にはその回の tick を渡す。 */
function Ticker({ every, children }: { every: number; children: (tick: number) => React.ReactNode }) {
  const [tick, setTick] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), every)
    return () => clearInterval(id)
  }, [every])
  return <>{children(tick)}</>
}

function render(node: React.ReactNode) {
  act(() => root.render(<ThemeProvider>{node}</ThemeProvider>))
}

/** act は抜けるときにまとめて描画するので、親の再描画が毎回反映されるよう 10ms ずつ進める。 */
function advance(ms: number) {
  for (let left = ms; left > 0; left -= 10) {
    act(() => {
      vi.advanceTimersByTime(Math.min(10, left))
    })
  }
}

describe("Celebration（native）: 親の再描画でタイマーが巻き戻らない（#812）", () => {
  it("その場の onDone を渡したまま 250ms ごとに再描画しても、durationMs 後に 1 回だけ最新の onDone が呼ばれる", () => {
    const calls: number[] = []
    render(
      <Ticker every={250}>
        {(tick) => (
          <Celebration
            active
            trigger="emoji"
            placement="inline"
            durationMs={1500}
            onDone={() => calls.push(tick)}
          />
        )}
      </Ticker>,
    )
    advance(1490)
    expect(calls).toEqual([])
    advance(10)
    // 期限の時点で最後に描画された回（tick=5）のコールバックが呼ばれる
    expect(calls).toEqual([5])
    advance(4000)
    expect(calls).toEqual([5])
  })
})

describe("CelebrationDialog（native）: 親の再描画でタイマーが巻き戻らない（#812）", () => {
  it("その場の onOpenChange を渡したまま 100ms ごとに再描画しても、autoDismissMs 後に 1 回だけ呼ばれる", () => {
    const calls: [boolean, number][] = []
    render(
      <Ticker every={100}>
        {(tick) => (
          <CelebrationDialog
            open
            autoDismissMs={300}
            title="達成"
            onOpenChange={(open) => calls.push([open, tick])}
          />
        )}
      </Ticker>,
    )
    advance(290)
    expect(calls).toEqual([])
    advance(10)
    expect(calls).toEqual([[false, 2]])
    advance(1500)
    expect(calls).toEqual([[false, 2]])
  })
})

describe("MediaActionCluster（native）: 親の再描画でタイマーが巻き戻らない（#812）", () => {
  const items = [{ id: "like", label: "いいね", icon: null }]
  const toolbarOpacity = () => {
    const toolbar = host.querySelector<HTMLElement>('[role="toolbar"]')
    if (!toolbar) throw new Error("toolbar が見つからない")
    return Number(getComputedStyle(toolbar).opacity)
  }

  it("その場の onVisibleChange を渡したまま 250ms ごとに再描画しても、autoHideMs 後に減光し、通知は 1 回だけ", () => {
    const calls: [boolean, number][] = []
    render(
      <Ticker every={250}>
        {(tick) => (
          <MediaActionCluster
            items={items}
            autoHideMs={1000}
            onVisibleChange={(visible) => calls.push([visible, tick])}
          />
        )}
      </Ticker>,
    )
    expect(toolbarOpacity()).toBe(1)
    advance(1000)
    expect(toolbarOpacity()).toBe(0.4)
    expect(calls).toEqual([[false, 3]])
    advance(2000)
    expect(calls).toEqual([[false, 3]])
  })
})
