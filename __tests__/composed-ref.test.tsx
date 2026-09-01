/**
 * @vitest-environment jsdom
 *
 * issue #502 の後追い: consumer の `ref` を内部 ref と合成する経路を
 * `useComposedRef`（src/lib/compose-ref.ts）へ一本化したときの契約を固定する。
 *
 * peer が React 19 専用になった（#502）ため、コールバック ref の cleanup を
 * 前提にしてよい。合成 ref は「常に cleanup を返す」方針なので、
 * detach 時に React は ref(null) を呼ばない。consumer が cleanup を
 * 返さない場合の null 書き戻しは合成 ref 側の責務になる。
 *
 * 以前は Input / Textarea（useValueLength）と QuickActionGrid が
 * consumer のコールバック ref の戻り値を捨てており、cleanup を返す
 * consumer ref が呼ばれないまま消えていた。ここで再発を止める。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Input } from "../src/components/ui/input"
import { Textarea } from "../src/components/ui/textarea"
import { QuickActionGrid, ActionTile } from "../src/components/patterns/quick-action-grid"

let container: HTMLElement
let root: Root

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function mount(ui: React.ReactElement) {
  act(() => {
    root.render(ui)
  })
}

const cases: Array<[string, (ref: React.Ref<never>) => React.ReactElement]> = [
  ["Input", (ref) => <Input ref={ref as React.Ref<HTMLInputElement>} />],
  ["Input(showCount)", (ref) => <Input showCount maxLength={10} ref={ref as React.Ref<HTMLInputElement>} />],
  ["Textarea", (ref) => <Textarea ref={ref as React.Ref<HTMLTextAreaElement>} />],
  [
    "QuickActionGrid",
    (ref) => (
      <QuickActionGrid ref={ref as React.Ref<HTMLDivElement>}>
        <ActionTile label="a" />
      </QuickActionGrid>
    ),
  ],
]

describe.each(cases)("%s の合成 ref", (_name, render) => {
  it("object ref に DOM が入り、アンマウントで null に戻る", () => {
    const ref = React.createRef<HTMLElement>()
    mount(render(ref as React.Ref<never>))
    expect(ref.current).toBeInstanceOf(HTMLElement)

    act(() => root.unmount())
    root = createRoot(container)
    expect(ref.current).toBeNull()
  })

  it("cleanup を返さないコールバック ref には null が書き戻される", () => {
    const seen: Array<HTMLElement | null> = []
    mount(render(((node: HTMLElement | null) => {
      seen.push(node)
    }) as unknown as React.Ref<never>))
    expect(seen.filter(Boolean)).toHaveLength(1)

    act(() => root.unmount())
    root = createRoot(container)
    expect(seen).toContain(null)
  })

  // 以前はここが落ちていた（戻り値が捨てられ cleanup が呼ばれなかった）。
  it("cleanup を返すコールバック ref は cleanup が呼ばれる", () => {
    const cleanup = vi.fn()
    mount(render((() => cleanup) as unknown as React.Ref<never>))
    expect(cleanup).not.toHaveBeenCalled()

    act(() => root.unmount())
    root = createRoot(container)
    expect(cleanup).toHaveBeenCalledTimes(1)
  })
})
