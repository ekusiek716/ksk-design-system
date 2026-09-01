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

import { useComposedRef } from "../src/lib/compose-ref"
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

/**
 * issue #516: 合成 ref の identity が render のたびに変わると、React は
 * detach → re-attach を繰り返す。内部 setter がそのたびに state を
 * 更新する構成（ResponsiveOverlayFrame の実効キャップ計測など）では
 * これが無限ループの燃料になるため、identity は固定する契約にした。
 */
describe("useComposedRef の identity（#516）", () => {
  it("external が毎 render 変わってもコールバック ref の identity は変わらない", () => {
    const identities = new Set<unknown>()
    const internalCalls: Array<HTMLDivElement | null> = []
    let rerender: (() => void) | null = null

    function Probe() {
      const [, setTick] = React.useState(0)
      React.useEffect(() => {
        rerender = () => setTick((t) => t + 1)
      })
      const internal = React.useCallback((node: HTMLDivElement | null) => {
        internalCalls.push(node)
      }, [])
      // 毎 render 新しい関数（Radix の composeRefs が返す合成関数と同じ形）。
      const composed = useComposedRef<HTMLDivElement>(internal, (node) => void node)
      identities.add(composed)
      return <div ref={composed} />
    }

    mount(<Probe />)
    act(() => rerender?.())
    act(() => rerender?.())

    expect(identities.size).toBe(1)
    // attach は最初の 1 回だけ（detach/attach を繰り返していない）。
    expect(internalCalls).toHaveLength(1)
    expect(internalCalls[0]).toBeInstanceOf(HTMLDivElement)
  })

  it("external を差し替えると新しい ref へ node が渡り、旧 ref は解除される", () => {
    const seenA: Array<HTMLDivElement | null> = []
    const seenB: Array<HTMLDivElement | null> = []

    function Probe({ which }: { which: "a" | "b" }) {
      const internal = React.useCallback(() => {}, [])
      const a = React.useCallback((node: HTMLDivElement | null) => {
        seenA.push(node)
      }, [])
      const b = React.useCallback((node: HTMLDivElement | null) => {
        seenB.push(node)
      }, [])
      const composed = useComposedRef<HTMLDivElement>(internal, which === "a" ? a : b)
      return <div ref={composed} />
    }

    mount(<Probe which="a" />)
    expect(seenA.filter(Boolean)).toHaveLength(1)
    expect(seenB).toHaveLength(0)

    mount(<Probe which="b" />)
    expect(seenA).toContain(null)
    expect(seenB.filter(Boolean)).toHaveLength(1)
  })

  // PR #517 の Codex レビュー指摘: internal も差し替え時に旧 setter へ null →
  // 新 setter へ node を渡す。渡さないと旧 setter 側の状態（DialogContent の
  // setContentNode が積む appliedRef 等）が stale なまま残る。
  it("internal を差し替えると旧 setter に null・新 setter に node が渡る", () => {
    const seenA: Array<HTMLDivElement | null> = []
    const seenB: Array<HTMLDivElement | null> = []

    function Probe({ which }: { which: "a" | "b" }) {
      const a = React.useCallback((node: HTMLDivElement | null) => {
        seenA.push(node)
      }, [])
      const b = React.useCallback((node: HTMLDivElement | null) => {
        seenB.push(node)
      }, [])
      const composed = useComposedRef<HTMLDivElement>(which === "a" ? a : b, undefined)
      return <div ref={composed} />
    }

    mount(<Probe which="a" />)
    expect(seenA.filter(Boolean)).toHaveLength(1)
    expect(seenB).toHaveLength(0)

    mount(<Probe which="b" />)
    expect(seenA[seenA.length - 1]).toBeNull()
    expect(seenB.filter(Boolean)).toHaveLength(1)

    // アンマウントでは新 setter（現在 attach 中の側）にだけ null が渡る
    act(() => root.unmount())
    root = createRoot(container)
    expect(seenB[seenB.length - 1]).toBeNull()
  })
})
