/**
 * @vitest-environment jsdom
 *
 * issue #516: ResponsiveOverlayFrame の PC 幅（DialogContent）分岐が
 * "Maximum update depth exceeded" で落ちる無限レンダリングループの回帰テスト。
 *
 * 原因は #492（5a285c2）で入った `useEffectiveMaxHeight` の「世代カウンタ」。
 * Radix の DismissableLayer / FocusScope には composeRefs へ *毎 render 新しい
 * arrow* を渡す版があり（consumer が古い @radix-ui/react-* を解決している
 * ケース。belle-todo は focus-scope@1.1.7 / compose-refs@1.1.2）、その場合
 * React は render のたびに面の ref chain を detach → attach し直す。
 * 面の setter がカウンタを +1 するだけだと detach(null) + attach(node) で
 * 必ず +2 されて state が変わり、再 render → また detach/attach … と発散する。
 *
 * DS 自身の node_modules は composeRefs へ安定な setter を渡す新しい Radix を
 * 解決するので、Dialog 経由では再現しない（consumer 側の解決結果に依存する）。
 * ここでは churn の形そのもの ——「毎 render 新しいコールバック ref が
 * 面の DOM に付く」—— を再現して、DS 側の不変条件だけを固定する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ResponsiveDialog } from "../src/components/ui/responsive-dialog"
import {
  ResponsiveOverlayFrame,
  useEffectiveMaxHeight,
} from "../src/components/patterns/responsive-overlay-frame"

/** viewport 幅を px で与え、matchMedia を `(min-width: Npx)` に応答させる。 */
function stubViewport(width: number) {
  vi.stubGlobal("matchMedia", (query: string) => {
    const match = /min-width:\s*(\d+(?:\.\d+)?)px/.exec(query)
    const min = match ? Number(match[1]) : Number.POSITIVE_INFINITY
    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe("useEffectiveMaxHeight — ref churn 下で state が発散しない（#516）", () => {
  let renders = 0

  /**
   * 面の DOM に「毎 render 新しいコールバック ref」を付ける。React は
   * identity が変わるとその commit で detach(null) → attach(node) を行うので、
   * 旧 Radix（composeRefs が毎 render 作り直される版）と同じ churn になる。
   */
  function Churning() {
    renders += 1
    const { setElement } = useEffectiveMaxHeight(false, "", "sig")
    // 意図的に毎 render 新しい関数を作る（安定化してはいけない）。
    const churningRef = (node: HTMLDivElement | null) => setElement(node)
    return <div ref={churningRef} style={{ maxHeight: "640px" }} />
  }

  it("毎 render 付け替わるコールバック ref でも render が収束する", () => {
    renders = 0
    // 修正前（世代カウンタ）はここで "Maximum update depth exceeded" になる。
    expect(() => act(() => root.render(<Churning />))).not.toThrow()
    // 初回 mount + 実測 state の反映で数回。発散していないことだけ見る。
    expect(renders).toBeLessThan(10)
  })
})

describe("ResponsiveOverlayFrame — consumer ref の identity が毎 render 変わる場合（#516）", () => {
  // 合成 ref の identity が consumer の ref に引きずられると、
  // DialogContent → Radix の ref chain まで毎 render 付け替わり、
  // 面の setter がそのたびに呼ばれて発散する。
  function ChurningConsumer() {
    const [, setTick] = React.useState(0)
    React.useEffect(() => {
      // マウント直後に 1 回だけ再 render させ、identity 変化を必ず起こす。
      setTick(1)
    }, [])
    return (
      <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
        <ResponsiveOverlayFrame
          description="テスト"
          preset="mobile-form"
          // 毎 render 新しい関数（安定化してはいけない）。
          ref={(node: HTMLDivElement | null) => void node}
        >
          <input data-testid="field" />
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  }

  it("PC 幅の中央モーダルが無限ループせずに描画される", () => {
    stubViewport(1024)
    expect(() => act(() => root.render(<ChurningConsumer />))).not.toThrow()

    const el = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')
    expect(el).not.toBeNull()
    expect(el?.querySelector('[data-testid="field"]')).not.toBeNull()
  })

  it("object ref は churn 下でも面の DOM を保持する", () => {
    stubViewport(1024)
    const consumerRef = React.createRef<HTMLDivElement>()
    act(() =>
      root.render(
        <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
          <ResponsiveOverlayFrame
            description="テスト"
            preset="mobile-form"
            ref={consumerRef}
          >
            <input data-testid="field" />
          </ResponsiveOverlayFrame>
        </ResponsiveDialog>
      )
    )
    expect(consumerRef.current).toBe(
      document.querySelector('[data-slot="dialog-content"]')
    )
  })
})
