/**
 * @vitest-environment jsdom
 *
 * issue #812: 自動で閉じる・隠れるタイマーの effect が、呼び出し側のコールバック
 * （onDone / onOpenChange / onVisibleChange）を依存配列に持っていた。consumer が
 * その場の関数で渡し、親が期限より短い間隔で再描画し続けると、再描画のたびに
 * タイマーが 0 から数え直しになり、期限が一度も来なかった（Web 版）。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Celebration } from "../src/components/patterns/celebration"
import { CelebrationDialog } from "../src/components/patterns/celebration-dialog"
import { MediaActionCluster } from "../src/components/patterns/media-action-cluster"

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
  vi.restoreAllMocks()
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
  act(() => root.render(node))
}

/** act は抜けるときにまとめて描画するので、親の再描画が毎回反映されるよう 10ms ずつ進める。 */
function advance(ms: number) {
  for (let left = ms; left > 0; left -= 10) {
    act(() => {
      vi.advanceTimersByTime(Math.min(10, left))
    })
  }
}

describe("Celebration（Web）: 親の再描画でタイマーが巻き戻らない（#812）", () => {
  it("その場の onDone を渡したまま 250ms ごとに再描画しても、durationMs 後に 1 回だけ最新の onDone が呼ばれる", () => {
    const calls: number[] = []
    render(
      <Ticker every={250}>
        {(tick) => (
          <Celebration active trigger="emoji" durationMs={1500} onDone={() => calls.push(tick)} />
        )}
      </Ticker>,
    )
    advance(1499)
    expect(calls).toEqual([])
    advance(1)
    // 期限の時点で最後に描画された回（tick=5）の最新のコールバックが呼ばれる
    expect(calls).toEqual([5])
    advance(4000)
    expect(calls).toEqual([5])
  })

  it("onDone が無ければタイマーを張らない（従来どおり）", () => {
    render(<Celebration active trigger="emoji" durationMs={1500} />)
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe("CelebrationDialog（Web）: 親の再描画でタイマーが巻き戻らない（#812）", () => {
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
    advance(299)
    expect(calls).toEqual([])
    advance(1)
    expect(calls).toEqual([[false, 2]])
    advance(1500)
    expect(calls).toEqual([[false, 2]])
  })
})

describe("MediaActionCluster（Web）: 親の再描画でタイマーが巻き戻らない（#812）", () => {
  const items = [{ id: "like", label: "いいね", icon: <span aria-hidden>♥</span> }]
  const cluster = () => host.querySelector<HTMLElement>('[data-slot="media-action-cluster"]')!

  it("その場の onVisibleChange を渡したまま 250ms ごとに再描画しても、autoHideMs 後に隠れ、通知は 1 回だけ", () => {
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
    expect(cluster().dataset.visible).toBe("true")
    advance(1000)
    expect(cluster().dataset.visible).toBe("false")
    expect(calls).toEqual([[false, 3]])
    advance(2000)
    expect(cluster().dataset.visible).toBe("false")
    expect(calls).toEqual([[false, 3]])
  })

  it("再描画のたびに window の操作イベント購読を付け外ししない", () => {
    const add = vi.spyOn(window, "addEventListener")
    render(
      <Ticker every={250}>
        {() => <MediaActionCluster items={items} autoHideMs={5000} onVisibleChange={() => {}} />}
      </Ticker>,
    )
    advance(2000)
    expect(add.mock.calls.filter(([type]) => type === "pointerdown")).toHaveLength(1)
  })

  it("隠れたあとに操作で再表示すると true を 1 回だけ通知する", () => {
    const calls: boolean[] = []
    render(<MediaActionCluster items={items} autoHideMs={1000} onVisibleChange={(v) => calls.push(v)} />)
    advance(1000)
    act(() => {
      window.dispatchEvent(new Event("pointerdown"))
    })
    expect(cluster().dataset.visible).toBe("true")
    expect(calls).toEqual([false, true])
  })
})
