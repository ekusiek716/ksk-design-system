import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog"
import { Button } from "./button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog"

const meta = {
  title: "Components/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">削除する</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消すことができません。データは完全に削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction variant="destructive">削除する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const Small: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>確認ダイアログ（小）</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>送信しますか？</AlertDialogTitle>
          <AlertDialogDescription>内容を確認してから送信してください。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>戻る</AlertDialogCancel>
          <AlertDialogAction>送信する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/**
 * 開いた直後にアクションを押せること（入場アニメーション中の操作不能の回帰）と、
 * 押下でダイアログが閉じることを検証する。
 *
 * 由来: v1.48.1 `fix(native): Modal 表示前の入口アニメーションで操作不能`(eba450b)。
 */
export const ConfirmActionIsImmediatelyClickable: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const onConfirm = fn()
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" data-testid="open">削除する</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel">キャンセル</AlertDialogCancel>
            <AlertDialogAction data-testid="confirm" variant="destructive" onClick={onConfirm}>
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByTestId("open"))

    const dialog = await body.findByRole("alertdialog")
    await expect(getComputedStyle(dialog).pointerEvents).not.toBe("none")

    // 入場アニメーションの完了を待たずに押せること
    await userEvent.click(within(dialog).getByTestId("confirm"))
    await waitFor(() => expect(body.queryByRole("alertdialog")).toBeNull())
  },
}

/** CancelClosesWithoutAction 用の onClick スパイ（play 側から呼び出し有無を検証する）。 */
const cancelStoryConfirmSpy = fn()

/** Esc / キャンセルで閉じ、確定アクションは実行されない。 */
export const CancelClosesWithoutAction: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" data-testid="open">削除する</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="cancel">キャンセル</AlertDialogCancel>
          <AlertDialogAction data-testid="confirm" variant="destructive" onClick={cancelStoryConfirmSpy}>
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    cancelStoryConfirmSpy.mockClear()

    await userEvent.click(canvas.getByTestId("open"))
    const dialog = await body.findByRole("alertdialog")
    await userEvent.click(within(dialog).getByTestId("cancel"))

    await waitFor(() => expect(body.queryByRole("alertdialog")).toBeNull())
    await expect(cancelStoryConfirmSpy).not.toHaveBeenCalled()

    // 再度開いて Esc で閉じられること
    await userEvent.click(canvas.getByTestId("open"))
    await body.findByRole("alertdialog")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("alertdialog")).toBeNull())
  },
}

/**
 * Dialog の中から AlertDialog を開く合成ケース（issue #263）。
 *
 * AlertDialog を Dialog と同じ重なり段（--Z-Modal）に置くと、AlertDialog の scrim が
 * 親 Dialog のコンテンツより下に潜り、親が暗転しないまま確認だけが浮いてしまう
 * （＝どの操作を確認しているのか分からない状態）。AlertDialog は専用の
 * --Z-Alert-Overlay / --Z-Alert に居る必要がある。
 */
export const NestedInDialog: Story = {
  tags: ["interaction"],
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button data-testid="open-dialog">編集ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
          <DialogDescription>
            ここから削除確認を開くと、この Dialog 全体が暗転して背面に退く。
          </DialogDescription>
        </DialogHeader>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" data-testid="open-alert">
              アカウントを削除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。背面の編集ダイアログが暗転していることを確認する。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="alert-cancel">キャンセル</AlertDialogCancel>
              <AlertDialogAction variant="destructive">削除する</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByTestId("open-dialog"))
    const dialog = await body.findByRole("dialog")
    await userEvent.click(within(dialog).getByTestId("open-alert"))
    const alert = await body.findByRole("alertdialog")

    // AlertDialog 本体と、その scrim が親 Dialog のコンテンツより上にあること
    const zOf = (el: Element) => Number(getComputedStyle(el).zIndex)
    const dialogContent = document.querySelector('[data-slot="dialog-content"]')!
    const alertOverlay = document.querySelector('[data-slot="alert-dialog-overlay"]')!

    await expect(zOf(alertOverlay)).toBeGreaterThan(zOf(dialogContent))
    await expect(zOf(alert)).toBeGreaterThan(zOf(alertOverlay))

    await userEvent.click(within(alert).getByTestId("alert-cancel"))
    await waitFor(() => expect(body.queryByRole("alertdialog")).toBeNull())
    // 親 Dialog は開いたまま残る
    await expect(body.queryByRole("dialog")).not.toBeNull()
  },
}
