/**
 * @vitest-environment jsdom
 *
 * issue #820: native の ToastProvider は通知を children の兄弟の absolute View（zIndex 9999）に描いていたため、
 * RN の `<Modal>`（Sheet / Dialog / Popover）を開いている間はその下に隠れて見えなかった。
 *
 * iOS の RN は、すでに Sheet を present している画面の上にルート直下の兄弟 `<Modal>` をもう 1 枚出せないため、
 * 通知用の Modal は作らない。DS の Modal 系部品が自分の `<Modal>` の中身の最前面に `ToastOutlet` を置き、
 * Provider は一番最後に開いた出口にだけ通知を描く。その描画先の構造をここで固定する。
 *
 * react-native は react-native-web に差し替え、`Modal` だけを「visible の間だけ中身を div に描く」host に、
 * `Pressable` だけを DOM の button に置き換えて、どの Modal の中に何が描かれたかを確かめる。
 * 実機の UIKit / Android ウィンドウの重なりはここでは再現できない。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { Modal as RNModal } from "react-native"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const rn = vi.hoisted(() => ({ nextModalId: 0, mounted: 0 }))

vi.mock("react-native", async () => {
  const ReactModule = await import("react")
  const actual = await vi.importActual<Record<string, unknown>>("react-native-web")
  function Modal({ visible, children }: { visible?: boolean; children?: React.ReactNode }) {
    const [id] = ReactModule.useState(() => ++rn.nextModalId)
    ReactModule.useEffect(() => {
      rn.mounted += 1
      return () => {
        rn.mounted -= 1
      }
    }, [])
    if (visible === false) return null
    return ReactModule.createElement("div", { "data-rn-modal": String(id) }, children)
  }
  function Pressable({
    children,
    onPress,
    accessibilityLabel,
  }: {
    children?: React.ReactNode
    onPress?: () => void
    accessibilityLabel?: string
  }) {
    return ReactModule.createElement(
      "button",
      { type: "button", "aria-label": accessibilityLabel, onClick: onPress },
      children,
    )
  }
  return { ...actual, Modal, Pressable }
})

import { Dialog } from "../src/native/components/Dialog"
import { Popover } from "../src/native/components/Popover"
import { Sheet } from "../src/native/components/Sheet"
import { ToastOutlet, ToastProvider, toast, type ToastPresentation } from "../src/native/components/Toast"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { getToastOutletStackForTest } from "../src/native/toast-outlet-stack"

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
  expect(getToastOutletStackForTest()).toEqual([])
})

function render(node: React.ReactNode, presentation?: ToastPresentation) {
  act(() =>
    root.render(
      <ThemeProvider>
        <ToastProvider presentation={presentation}>{node}</ToastProvider>
      </ThemeProvider>,
    ),
  )
}

function modalElements(): HTMLElement[] {
  return Array.from(host.querySelectorAll<HTMLElement>("[data-rn-modal]"))
}

/** 文字列を含む最も内側の Modal（無ければ null）。 */
function innermostModalContaining(text: string): HTMLElement | null {
  const hits = modalElements().filter((el) => el.textContent?.includes(text))
  return hits.find((el) => !hits.some((other) => other !== el && el.contains(other))) ?? null
}

/** 通知のタイトルが画面に何回描かれているか（Provider 直下と出口の二重描画を検出する）。 */
function occurrences(text: string): number {
  return Array.from(host.querySelectorAll('[role="alert"]')).filter((el) => el.textContent?.includes(text)).length
}

function show(title: string, options?: Parameters<typeof toast>[1]) {
  act(() => {
    toast(title, options)
  })
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe("native Toast の描画先（#820）", () => {
  it("Modal 系を開いていなければ Provider 直下に描き、Modal を描かない", () => {
    render(<span>本文</span>)
    show("保存しました")
    expect(occurrences("保存しました")).toBe(1)
    expect(modalElements()).toHaveLength(0)
    expect(rn.mounted).toBe(0)
  })

  it("Dialog を開いている間は Dialog の Modal の中（出口）に描き、Provider 直下には描かない。通知用の Modal は増やさない", () => {
    render(<Dialog open onClose={() => {}} title="下書きを保存" />)
    expect(rn.mounted).toBe(1)
    show("保存に失敗しました")

    expect(occurrences("保存に失敗しました")).toBe(1)
    const modal = innermostModalContaining("保存に失敗しました")
    expect(modal?.textContent).toContain("下書きを保存")
    expect(modalElements()).toHaveLength(1)
    expect(rn.mounted).toBe(1)
  })

  it("Sheet を開いている間は Sheet の Modal の中に描く", () => {
    render(
      <Sheet open onClose={() => {}} title="編集">
        <span>シート本文</span>
      </Sheet>,
    )
    show("保存に失敗しました")
    expect(occurrences("保存に失敗しました")).toBe(1)
    expect(innermostModalContaining("保存に失敗しました")?.textContent).toContain("シート本文")
    expect(rn.mounted).toBe(1)
  })

  it("入れ子（Dialog の上に Popover）では最後に開いた Popover にだけ描き、Popover を閉じたら Dialog へ戻る", () => {
    const tree = (popover: boolean) => (
      <>
        <Dialog open onClose={() => {}} title="下書き" />
        <Popover open={popover} onClose={() => {}} anchor={{ x: 0, y: 0 }}>
          <span>メニュー</span>
        </Popover>
      </>
    )
    render(tree(false))
    render(tree(true))
    show("コピーしました", { duration: 0 })

    expect(occurrences("コピーしました")).toBe(1)
    expect(innermostModalContaining("コピーしました")?.textContent).toContain("メニュー")

    render(tree(false))
    expect(occurrences("コピーしました")).toBe(1)
    expect(innermostModalContaining("コピーしました")?.textContent).toContain("下書き")
  })

  it("通知の表示中に Dialog を閉じたら Provider 直下へ戻り、通知もタイマーも途切れない", () => {
    const tree = (open: boolean) => <Dialog open={open} onClose={() => {}} title="下書き" />
    render(tree(true))
    show("保存しました")
    expect(innermostModalContaining("保存しました")).not.toBeNull()

    advance(1000)
    render(tree(false))
    expect(modalElements()).toHaveLength(0)
    expect(occurrences("保存しました")).toBe(1)

    // 表示開始から既定 3000ms で消える（描き先の切り替えでタイマーが巻き戻らない）
    advance(1999)
    expect(occurrences("保存しました")).toBe(1)
    advance(1)
    expect(occurrences("保存しました")).toBe(0)
  })

  it("通知の表示中に Dialog を開いたら Dialog の中へ移る", () => {
    const tree = (open: boolean) => <Dialog open={open} onClose={() => {}} title="確認" />
    render(tree(false))
    show("同期しました", { duration: 0 })
    expect(innermostModalContaining("同期しました")).toBeNull()
    render(tree(true))
    expect(occurrences("同期しました")).toBe(1)
    expect(innermostModalContaining("同期しました")?.textContent).toContain("確認")
  })

  it("Dialog を開いたまま通知の action と閉じるボタンを押せる", () => {
    const retry = vi.fn()
    render(<Dialog open onClose={() => {}} title="送信" />)
    show("送信に失敗しました", { duration: 0, action: { label: "再試行", onPress: retry } })

    const modal = innermostModalContaining("送信に失敗しました")
    const buttons = Array.from(modal?.querySelectorAll("button") ?? [])
    act(() => buttons.find((b) => b.textContent === "再試行")?.click())
    expect(retry).toHaveBeenCalledTimes(1)
    expect(occurrences("送信に失敗しました")).toBe(1)

    act(() => buttons.find((b) => b.getAttribute("aria-label") === "閉じる")?.click())
    expect(occurrences("送信に失敗しました")).toBe(0)
  })

  it("consumer の自前の RN Modal に ToastOutlet を置けば、その中に描く", () => {
    render(
      <RNModal visible transparent>
        <span>自前のパネル</span>
        <ToastOutlet />
      </RNModal>,
    )
    show("送信しました")
    expect(occurrences("送信しました")).toBe(1)
    expect(innermostModalContaining("送信しました")?.textContent).toContain("自前のパネル")
  })

  it("ToastOutlet の active=false は出口として使わない（閉じかけの Modal に描かない）", () => {
    render(
      <RNModal visible transparent>
        <span>閉じかけ</span>
        <ToastOutlet active={false} />
      </RNModal>,
    )
    show("送信しました")
    expect(getToastOutletStackForTest()).toEqual([])
    expect(innermostModalContaining("送信しました")).toBeNull()
    expect(occurrences("送信しました")).toBe(1)
  })

  it("ToastProvider の外の ToastOutlet は何も描かず、落ちない", () => {
    act(() =>
      root.render(
        <ThemeProvider>
          <ToastOutlet />
        </ThemeProvider>,
      ),
    )
    expect(host.textContent).toBe("")
    expect(getToastOutletStackForTest()).toEqual([])
  })

  it('presentation="inline" は出口を使わず常に Provider 直下に描く', () => {
    render(<Dialog open onClose={() => {}} title="下書き" />, "inline")
    show("保存しました")
    expect(occurrences("保存しました")).toBe(1)
    expect(innermostModalContaining("保存しました")).toBeNull()
    expect(getToastOutletStackForTest()).toEqual([])
  })

  it("StrictMode の二重 effect でも出口の数と順序がずれない", () => {
    const tree = (dialog: boolean, popover: boolean) => (
      <React.StrictMode>
        <ThemeProvider>
          <ToastProvider>
            <Dialog open={dialog} onClose={() => {}} title="下書き" />
            <Popover open={popover} onClose={() => {}} anchor={{ x: 0, y: 0 }}>
              <span>メニュー</span>
            </Popover>
          </ToastProvider>
        </ThemeProvider>
      </React.StrictMode>
    )
    act(() => root.render(tree(true, false)))
    expect(getToastOutletStackForTest()).toHaveLength(1)
    act(() => root.render(tree(true, true)))
    const stack = getToastOutletStackForTest()
    expect(stack).toHaveLength(2)
    expect(new Set(stack).size).toBe(2)

    show("コピーしました", { duration: 0 })
    expect(occurrences("コピーしました")).toBe(1)
    expect(innermostModalContaining("コピーしました")?.textContent).toContain("メニュー")

    act(() => root.render(tree(true, false)))
    expect(getToastOutletStackForTest()).toEqual([stack[0]])
    expect(innermostModalContaining("コピーしました")?.textContent).toContain("下書き")
    act(() => root.render(tree(false, false)))
    expect(getToastOutletStackForTest()).toEqual([])
    expect(occurrences("コピーしました")).toBe(1)
  })
})
