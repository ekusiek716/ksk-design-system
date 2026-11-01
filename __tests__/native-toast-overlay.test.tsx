/**
 * @vitest-environment jsdom
 *
 * issue #820: native の ToastProvider は通知を children の兄弟の absolute View（zIndex 9999）に描いていたため、
 * RN の `<Modal>`（Sheet / Dialog / Popover）を開いている間はその下に隠れて見えなかった。
 * 表示中の通知がある間だけ透明な `<Modal>` の中に描くようにしたので、その描画先の構造を固定する。
 *
 * 実機（iOS / Android）の Modal の重なりはここでは再現できない。react-native は react-native-web に
 * 差し替え、`Modal` だけを props を記録する host に、`Pressable` だけを DOM の button に置き換えて、
 * 「どの Modal の中に何が描かれたか」と「どの props で Modal を出したか」を確かめる。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

type ModalProps = {
  children?: React.ReactNode
  visible?: boolean
  transparent?: boolean
  animationType?: string
  statusBarTranslucent?: boolean
  supportedOrientations?: string[]
  onRequestClose?: () => void
}

const rn = vi.hoisted(() => ({
  os: "ios" as "ios" | "android" | "web",
  /** マウント中の Modal。描画のたびに最新の props で上書きする。 */
  modals: new Map<number, ModalProps>(),
  nextModalId: 0,
}))

vi.mock("react-native", async () => {
  const ReactModule = await import("react")
  const actual = await vi.importActual<Record<string, unknown>>("react-native-web")
  function Modal(props: ModalProps) {
    const [id] = ReactModule.useState(() => ++rn.nextModalId)
    rn.modals.set(id, props)
    ReactModule.useEffect(() => () => void rn.modals.delete(id), [id])
    if (props.visible === false) return null
    return ReactModule.createElement("div", { "data-rn-modal": String(id) }, props.children)
  }
  function Pressable({
    children,
    onPress,
    onPressIn,
    testID,
    accessibilityLabel,
    accessibilityRole,
  }: {
    children?: React.ReactNode
    onPress?: () => void
    onPressIn?: () => void
    testID?: string
    accessibilityLabel?: string
    accessibilityRole?: string
  }) {
    return ReactModule.createElement(
      "button",
      {
        type: "button",
        "data-testid": testID,
        "aria-label": accessibilityLabel,
        "data-role": accessibilityRole,
        onClick: onPress,
        onMouseDown: onPressIn,
      },
      children,
    )
  }
  const Platform = {
    get OS() {
      return rn.os
    },
    select: (spec: Record<string, unknown>) => spec[rn.os] ?? spec.default,
  }
  return { ...actual, Modal, Pressable, Platform }
})

import { Dialog } from "../src/native/components/Dialog"
import { ToastProvider, toast, type ToastPresentation } from "../src/native/components/Toast"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

let host: HTMLDivElement
let root: Root

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  vi.useFakeTimers()
  rn.os = "ios"
  rn.modals.clear()
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.useRealTimers()
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

/** 通知のタイトルを含む Modal（無ければ null）。 */
function modalContaining(text: string): HTMLElement | null {
  return modalElements().find((el) => el.textContent?.includes(text)) ?? null
}

/** 通知の描画先 Modal の最新 props。 */
function toastModalProps(text: string): ModalProps {
  const el = modalContaining(text)
  if (!el) throw new Error(`「${text}」を含む Modal がありません`)
  const props = rn.modals.get(Number(el.dataset.rnModal))
  if (!props) throw new Error("Modal の props が記録されていません")
  return props
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe.each(["ios", "android"] as const)("native Toast の描画先（%s / #820）", (os) => {
  beforeEach(() => {
    rn.os = os
  })

  it("通知が 0 件のあいだは Modal を描かない（下の画面のタッチを奪わない）", () => {
    render(<span>本文</span>)
    expect(modalElements()).toHaveLength(0)
    expect(rn.modals.size).toBe(0)
  })

  it("通知がある間だけ透明・アニメなし・全向き許可の Modal の中に描き、消えたら Modal ごと外す", () => {
    render(<span>本文</span>)
    act(() => {
      toast("保存しました")
    })

    const modal = modalContaining("保存しました")
    expect(modal).not.toBeNull()
    // 本文（children）は Modal の外のまま
    expect(modal?.textContent).not.toContain("本文")
    const props = toastModalProps("保存しました")
    expect(props).toMatchObject({ visible: true, transparent: true, animationType: "none", statusBarTranslucent: true })
    expect(props.supportedOrientations).toEqual(
      expect.arrayContaining(["portrait", "landscape-left", "landscape-right"]),
    )

    // 既定 3000ms で消え、Modal も外れる
    advance(2999)
    expect(modalElements()).toHaveLength(1)
    advance(1)
    expect(modalElements()).toHaveLength(0)
    expect(rn.modals.size).toBe(0)
  })

  it("Dialog（RN の Modal）を開いている間に出した通知は、Dialog の Modal とは別の、後から出した Modal の中に描かれる", () => {
    const onClose = vi.fn()
    render(<Dialog open onClose={onClose} title="下書きを保存" />)
    expect(modalElements()).toHaveLength(1)

    act(() => {
      toast.caution("保存に失敗しました")
    })

    const modals = modalElements()
    expect(modals).toHaveLength(2)
    const [dialogModal, toastModal] = modals
    expect(dialogModal.textContent).toContain("下書きを保存")
    expect(dialogModal.textContent).not.toContain("保存に失敗しました")
    expect(toastModal.textContent).toContain("保存に失敗しました")
    // 後から出した Modal が前面（iOS は後から present した view controller、Android は後から開いたウィンドウ）
    expect(Number(toastModal.dataset.rnModal)).toBeGreaterThan(Number(dialogModal.dataset.rnModal))
  })

  it("Modal を開いたまま通知の action を押せる（押しても通知は自動で閉じない）", () => {
    const retry = vi.fn()
    render(<Dialog open onClose={() => {}} title="送信" />)
    act(() => {
      toast.caution("送信に失敗しました", { action: { label: "再試行", onPress: retry } })
    })

    const toastModal = modalContaining("送信に失敗しました")
    const action = Array.from(toastModal?.querySelectorAll("button") ?? []).find((b) => b.textContent === "再試行")
    expect(action).toBeDefined()
    act(() => action?.click())
    expect(retry).toHaveBeenCalledTimes(1)
    expect(modalContaining("送信に失敗しました")).not.toBeNull()
  })

  it("閉じるボタンはその通知だけを閉じ、残りがある間は Modal を保つ", () => {
    render(<span>本文</span>)
    act(() => {
      toast("1件目")
      toast("2件目")
    })
    const modal = modalContaining("1件目")
    expect(modal?.textContent).toContain("2件目")
    const closeFirst = modal?.querySelector<HTMLButtonElement>('button[aria-label="閉じる"]')
    act(() => closeFirst?.click())
    expect(modalContaining("1件目")).toBeNull()
    expect(modalContaining("2件目")).not.toBeNull()
  })

  it("onRequestClose（Android の戻る）は通知をすべて閉じて Modal を外すだけで、下の Dialog は閉じない", () => {
    const onClose = vi.fn()
    render(<Dialog open onClose={onClose} title="下書きを保存" />)
    act(() => {
      toast("1件目", { duration: 0 })
      toast("2件目", { duration: 0 })
    })
    const { onRequestClose } = toastModalProps("1件目")
    expect(typeof onRequestClose).toBe("function")

    act(() => onRequestClose?.())
    expect(modalContaining("1件目")).toBeNull()
    expect(modalContaining("2件目")).toBeNull()
    // 通知の Modal だけが外れ、Dialog の Modal は開いたまま。Dialog の onClose は呼ばない
    expect(modalElements()).toHaveLength(1)
    expect(modalElements()[0].textContent).toContain("下書きを保存")
    expect(onClose).not.toHaveBeenCalled()
  })

  it("通知以外の場所に触れたら通知をすべて閉じて Modal を外す（次のタッチから下の画面へ届く）", () => {
    render(<span>本文</span>)
    act(() => {
      toast("保存しました", { duration: 0 })
    })
    const outside = modalContaining("保存しました")?.querySelector<HTMLButtonElement>('[data-testid="ksk-toast-outside"]')
    expect(outside).not.toBeNull()
    // 通知本体は外側の押下面より後ろの兄弟＝前面にあり、押下面の子ではない
    expect(outside?.textContent).toBe("")

    act(() => {
      outside?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })
    expect(modalElements()).toHaveLength(0)
  })

  it('presentation="inline" は従来どおり Modal を使わず children の兄弟に描く', () => {
    render(<span>本文</span>, "inline")
    act(() => {
      toast("保存しました")
    })
    expect(modalElements()).toHaveLength(0)
    expect(host.textContent).toContain("保存しました")
  })
})

describe("native Toast の描画先（web / #820）", () => {
  it("react-native-web では Modal を使わない（Modal のフォーカス閉じ込めで下の入力欄のフォーカスを奪わないため）", () => {
    rn.os = "web"
    render(<span>本文</span>)
    act(() => {
      toast("保存しました")
    })
    expect(modalElements()).toHaveLength(0)
    expect(host.textContent).toContain("保存しました")
  })
})
