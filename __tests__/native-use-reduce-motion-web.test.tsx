/**
 * @vitest-environment jsdom
 *
 * react-native-web は matchMedia の無い環境（jsdom など）で
 * `AccessibilityInfo.addEventListener("reduceMotionChanged")` の購読を返さない（undefined）。
 * useReduceMotionState の後片付けがそれを remove しようとして落ちていた（#757）
 * （#753 の回帰テストを書く途中で発覚。実ブラウザ・iOS / Android には matchMedia / 購読があるので起きない）。
 */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { describe, expect, it, vi } from "vitest"

vi.hoisted(() => {
  // react-native-web の AccessibilityInfo は読み込み時に matchMedia を見るので、import より前に消す
  delete (window as { matchMedia?: unknown }).matchMedia
})
vi.mock("react-native", async () => await vi.importActual("react-native-web"))

import { useReduceMotionState, type ReduceMotionState } from "../src/native/components/use-reduce-motion"

function Probe({ onState }: { onState: (state: ReduceMotionState) => void }) {
  onState(useReduceMotionState())
  return null
}

describe("useReduceMotionState（matchMedia の無い react-native-web）", () => {
  it("unmount しても後片付けで落ちず、初回取得の結果で解決する", async () => {
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    const states: ReduceMotionState[] = []

    await act(async () => {
      root.render(<Probe onState={(state) => states.push(state)} />)
    })
    expect(states.at(-1)?.resolved).toBe(true)

    expect(() =>
      act(() => {
        root.unmount()
      }),
    ).not.toThrow()
    container.remove()
  })
})
