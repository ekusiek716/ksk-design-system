import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { ConfirmDialog, ConfirmDialogProvider, useConfirm } from "./confirm-dialog"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ConfirmDialog>

function Demo(props: Partial<React.ComponentProps<typeof ConfirmDialog>>) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={props.title ?? "確認"}
        description={props.description}
        confirmLabel={props.confirmLabel}
        cancelLabel={props.cancelLabel}
        variant={props.variant}
        onConfirm={props.onConfirm ?? (() => {})}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <Demo title="保存しますか？" description="この操作は元に戻せません。" />
  ),
}

export const Destructive: Story = {
  render: () => (
    <Demo
      title="削除しますか？"
      description="このアイテムは完全に削除されます。この操作は元に戻せません。"
      confirmLabel="削除する"
      variant="destructive"
    />
  ),
}

export const WithLoading: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>開く（非同期確認）</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="送信しますか？"
          description="サーバーに送信されます。"
          confirmLabel="送信"
          onConfirm={() => new Promise((r) => setTimeout(r, 2000))}
        />
      </div>
    )
  },
}

function UseConfirmDemo() {
  const confirm = useConfirm()
  const [result, setResult] = React.useState("未操作")
  return (
    <div className="flex flex-col items-start gap-3 p-4">
      <Button
        data-testid="open-confirm"
        variant="destructive"
        onClick={async () => {
          const ok = await confirm({
            title: "このメモを削除しますか？",
            description: "削除したメモは元に戻せません。",
            confirmLabel: "削除する",
            variant: "destructive",
          })
          setResult(ok ? "削除した" : "やめた")
        }}
      >
        メモを削除
      </Button>
      <p data-testid="confirm-result" className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
        結果: {result}
      </p>
    </div>
  )
}

/**
 * useConfirm — `window.confirm()` の置き換え。
 *
 * `<ConfirmDialogProvider>` をアプリのルートに 1 つ置き、
 * `const ok = await confirm({ title, ... })` で結果（確認 true / キャンセル・Esc false）を受け取る。
 * 閉じた後は呼び出し元のボタンへフォーカスが戻る。
 */
export const UseConfirm: Story = {
  tags: ["interaction"],
  render: () => (
    <ConfirmDialogProvider>
      <UseConfirmDemo />
    </ConfirmDialogProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByTestId("open-confirm")

    // 確認 → true
    await userEvent.click(trigger)
    const dialog = await body.findByRole("alertdialog")
    await expect(dialog).toHaveTextContent("このメモを削除しますか？")
    await userEvent.click(within(dialog).getByRole("button", { name: "削除する" }))
    await waitFor(() => expect(canvas.getByTestId("confirm-result")).toHaveTextContent("削除した"))
    // Trigger を持たない部品だが、呼び出し元へフォーカスが戻る
    await waitFor(() => expect(trigger).toHaveFocus())

    // Esc → false
    await userEvent.click(trigger)
    await body.findByRole("alertdialog")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(canvas.getByTestId("confirm-result")).toHaveTextContent("やめた"))
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
