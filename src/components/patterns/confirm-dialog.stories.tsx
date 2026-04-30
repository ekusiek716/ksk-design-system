import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ConfirmDialog } from "./confirm-dialog"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof ConfirmDialog> = {
  title: "Patterns/ConfirmDialog",
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
