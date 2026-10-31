/**
 * @vitest-environment jsdom
 */
/**
 * ConfirmDialog を直接置いたときの「処理中は閉じない」（issue #818）。
 *
 * 処理中（非同期 onConfirm の実行中、または loading={true}）はキャンセルボタンを
 * disabled にしているのに、Esc だけは Radix 経由で onOpenChange(false) が流れて
 * ダイアログが閉じていた。裏では onConfirm が続き、利用者は「取り消せた」と
 * 誤解する。固定すること:
 * - 非同期 onConfirm の実行中に Esc を押しても onOpenChange が呼ばれず、残る
 * - loading={true} のときも Esc で閉じない
 * - 処理完了後は onOpenChange(false) が 1 回だけ呼ばれる
 * - 処理中でないときの Esc は従来どおり閉じる（キャンセル扱い）
 *
 * useConfirm 経由は onConfirm 相当が即時に決着するので use-confirm.test.tsx 側で見る。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ConfirmDialog } from "../src/components/patterns/confirm-dialog"

let host: HTMLElement | null = null
let root: Root | null = null

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

function pressEscape() {
  act(() => {
    const target = document.activeElement ?? document.body
    target.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
    )
  })
}

function alertDialog() {
  return document.querySelector('[role="alertdialog"]')
}

/** open を自前の state で持ち、onOpenChange の呼び出しを記録する（消費側の典型的な置き方）。 */
function Harness({
  onOpenChange,
  onConfirm,
  loading,
}: {
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  loading?: boolean
}) {
  const [open, setOpen] = React.useState(true)
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        setOpen(next)
      }}
      title="削除しますか"
      confirmLabel="削除する"
      cancelLabel="キャンセル"
      loadingLabel="処理中…"
      onConfirm={onConfirm}
      loading={loading}
    />
  )
}

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  host = null
  root = null
})

describe("ConfirmDialog の処理中の閉じ方（#818）", () => {
  it("非同期 onConfirm の実行中は Esc で閉じず、完了後に 1 回だけ閉じる", async () => {
    let resolve: () => void = () => {}
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r
        })
    )
    const onOpenChange = vi.fn()
    mount(<Harness onOpenChange={onOpenChange} onConfirm={onConfirm} />)

    await act(async () => {
      buttonByText("削除する").click()
    })
    expect(onConfirm).toHaveBeenCalledTimes(1)
    // 処理中表示になり、キャンセルは押せない
    expect(buttonByText("処理中…").disabled).toBe(true)
    expect(buttonByText("キャンセル").disabled).toBe(true)

    pressEscape()
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(alertDialog()).not.toBeNull()

    await act(async () => {
      resolve()
    })
    expect(onOpenChange.mock.calls).toEqual([[false]])
  })

  it("loading={true} のときも Esc で閉じない", () => {
    const onOpenChange = vi.fn()
    mount(<Harness onOpenChange={onOpenChange} onConfirm={() => {}} loading />)
    expect(alertDialog()).not.toBeNull()

    pressEscape()
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(alertDialog()).not.toBeNull()
  })

  it("処理中でないときの Esc は従来どおり閉じる（キャンセル扱い）", () => {
    const onOpenChange = vi.fn()
    const onConfirm = vi.fn()
    mount(<Harness onOpenChange={onOpenChange} onConfirm={onConfirm} />)
    expect(alertDialog()).not.toBeNull()

    pressEscape()
    expect(onOpenChange.mock.calls).toEqual([[false]])
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
