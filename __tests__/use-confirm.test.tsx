/**
 * @vitest-environment jsdom
 */
/**
 * useConfirm / ConfirmDialogProvider（stract-ui #179 の逆輸入）。
 *
 * window.confirm() の置き換え。固定すること:
 * - 確認で true、キャンセルで false に resolve する
 * - 同時に呼ばれたら順番待ちで 1 件ずつ表示する（先の確定で次の要求を誤って resolve しない）
 * - Provider unmount 時の未解決は false で resolve する
 * - Provider の外で使うと分かりやすい例外を投げる
 *
 * 閉じた後のフォーカス復帰はレイアウトとアニメーション完了が要るため、
 * Storybook の interaction ストーリー（confirm-dialog.stories.tsx の UseConfirm）で見る。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it } from "vitest"

import {
  ConfirmDialogProvider,
  useConfirm,
  type ConfirmFn,
} from "../src/components/patterns/confirm-dialog"
import * as PublicApi from "../src/index"

let host: HTMLElement | null = null
let root: Root | null = null
let confirmRef: ConfirmFn | null = null

function setConfirm(fn: ConfirmFn) {
  confirmRef = fn
}

function Capture() {
  const confirm = useConfirm()
  React.useEffect(() => setConfirm(confirm), [confirm])
  return null
}

function mount(ui: React.ReactElement) {
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => {
    root!.render(ui)
  })
}

function buttonByText(text: string) {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent === text)
  if (!btn) throw new Error(`button "${text}" not found`)
  return btn
}

async function click(el: HTMLElement) {
  await act(async () => {
    el.click()
  })
}

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  host = null
  root = null
  confirmRef = null
})

describe("useConfirm", () => {
  it("公開 API から export されている", () => {
    expect(PublicApi.useConfirm).toBe(useConfirm)
    expect(PublicApi.ConfirmDialogProvider).toBe(ConfirmDialogProvider)
  })

  it("確認で true、キャンセルで false に resolve する", async () => {
    mount(
      <ConfirmDialogProvider>
        <Capture />
      </ConfirmDialogProvider>,
    )

    let p!: Promise<boolean>
    await act(async () => {
      p = confirmRef!({ title: "削除しますか？", confirmLabel: "削除する" })
    })
    expect(document.querySelector('[role="alertdialog"]')?.textContent).toContain("削除しますか？")
    await click(buttonByText("削除する"))
    await expect(p).resolves.toBe(true)

    let q!: Promise<boolean>
    await act(async () => {
      q = confirmRef!({ title: "やめますか？" })
    })
    await click(buttonByText("キャンセル"))
    await expect(q).resolves.toBe(false)
  })

  it("同時に呼ばれたら順番に表示し、それぞれの結果で resolve する", async () => {
    mount(
      <ConfirmDialogProvider>
        <Capture />
      </ConfirmDialogProvider>,
    )

    let first!: Promise<boolean>
    let second!: Promise<boolean>
    await act(async () => {
      first = confirmRef!({ title: "1件目", confirmLabel: "はい" })
      second = confirmRef!({ title: "2件目", confirmLabel: "はい" })
    })

    expect(document.querySelector('[role="alertdialog"]')?.textContent).toContain("1件目")
    await click(buttonByText("はい"))
    await expect(first).resolves.toBe(true)

    // 1件目の確定後に ConfirmDialog が続けて呼ぶ onOpenChange(false) で
    // 2件目を誤って false にしていないこと
    expect(document.querySelector('[role="alertdialog"]')?.textContent).toContain("2件目")
    await click(buttonByText("キャンセル"))
    await expect(second).resolves.toBe(false)
  })

  it("Provider unmount 時の未解決は false で resolve する", async () => {
    mount(
      <ConfirmDialogProvider>
        <Capture />
      </ConfirmDialogProvider>,
    )
    let p!: Promise<boolean>
    await act(async () => {
      p = confirmRef!({ title: "離脱しますか？" })
    })
    act(() => root!.unmount())
    root = null
    await expect(p).resolves.toBe(false)
  })

  it("閉じるアニメーション中に次の confirm を呼んでも、閉じた後は元の呼び出し元へフォーカスが戻る", async () => {
    mount(
      <ConfirmDialogProvider>
        <button type="button">呼び出し元</button>
        <Capture />
      </ConfirmDialogProvider>,
    )
    const opener = buttonByText("呼び出し元")
    opener.focus()

    let first!: Promise<boolean>
    await act(async () => {
      first = confirmRef!({ title: "1件目", confirmLabel: "はい" })
    })
    // 開いている間はフォーカスがダイアログ内にある（jsdom では自動フォーカスの時機が
    // 実ブラウザと違うので、キーボード利用者が確認ボタンへ移った状態を明示的に作る）
    buttonByText("はい").focus()
    expect(document.activeElement?.closest('[role="alertdialog"]')).not.toBeNull()

    // 確認 → 閉じ始めた（open=false・active は残る）直後に、ダイアログ内にフォーカスが
    // ある状態のまま次の confirm を呼ぶ
    let second!: Promise<boolean>
    await act(async () => {
      buttonByText("はい").click()
      second = confirmRef!({ title: "2件目" })
    })
    await expect(first).resolves.toBe(true)
    expect(document.querySelector('[role="alertdialog"]')?.textContent).toContain("2件目")

    await act(async () => {
      buttonByText("キャンセル").click()
      // Radix FocusScope の unmount 時フォーカス移動は setTimeout(0) 後に走る
      await new Promise((r) => setTimeout(r, 20))
    })
    await expect(second).resolves.toBe(false)
    expect(document.activeElement).toBe(opener)
  })

  it("Provider unmount 後に呼んだ confirm は即 false で resolve する", async () => {
    mount(
      <ConfirmDialogProvider>
        <Capture />
      </ConfirmDialogProvider>,
    )
    const stale = confirmRef!
    act(() => root!.unmount())
    root = null
    await expect(stale({ title: "遷移後" })).resolves.toBe(false)
  })

  it("Provider の外で使うと例外を投げる", () => {
    function Outside() {
      useConfirm()
      return null
    }
    const spy = console.error
    console.error = () => {}
    try {
      expect(() => mount(<Outside />)).toThrow(/ConfirmDialogProvider/)
    } finally {
      console.error = spy
    }
  })
})
