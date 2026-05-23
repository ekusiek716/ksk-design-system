/**
 * @file Toast のストーリー
 * @description トースト通知コンポーネント。default, success, caution, warning, info の全バリアントを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Toaster, useToast, toast } from "./toast"
import { Button } from "./button"

const meta: Meta = {
  title: "Components/Toast",
}
export default meta

type Story = StoryObj

function DefaultToastDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          title: "通知",
          description: "デフォルトのトーストメッセージです",
        })
      }
    >
      Default トースト
    </Button>
  )
}

function SuccessToastDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          title: "成功",
          description: "操作が正常に完了しました",
          variant: "success",
        })
      }
    >
      Success トースト
    </Button>
  )
}

function CautionToastDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          title: "注意",
          description: "この操作には注意が必要です",
          variant: "caution",
        })
      }
    >
      Caution トースト
    </Button>
  )
}

function WarningToastDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          title: "警告",
          description: "重大な問題が発生する可能性があります",
          variant: "warning",
        })
      }
    >
      Warning トースト
    </Button>
  )
}

function InfoToastDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          title: "情報",
          description: "参考情報をお知らせします",
          variant: "info",
        })
      }
    >
      Info トースト
    </Button>
  )
}

function AllToastsDemo() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() => toast({ title: "通知", description: "デフォルトのトーストです" })}
      >
        Default
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "成功", description: "操作が完了しました", variant: "success" })}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "注意", description: "注意が必要です", variant: "caution" })}
      >
        Caution
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "警告", description: "警告メッセージです", variant: "warning" })}
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "情報", description: "情報メッセージです", variant: "info" })}
      >
        Info
      </Button>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <Toaster>
      <DefaultToastDemo />
    </Toaster>
  ),
}

export const Success: Story = {
  render: () => (
    <Toaster>
      <SuccessToastDemo />
    </Toaster>
  ),
}

export const Caution: Story = {
  render: () => (
    <Toaster>
      <CautionToastDemo />
    </Toaster>
  ),
}

export const Warning: Story = {
  render: () => (
    <Toaster>
      <WarningToastDemo />
    </Toaster>
  ),
}

export const Info: Story = {
  render: () => (
    <Toaster>
      <InfoToastDemo />
    </Toaster>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <Toaster>
      <AllToastsDemo />
    </Toaster>
  ),
}

/**
 * Fire-and-forget API。`<Toaster />` を一切設置せず、
 * モジュールレベルの `toast()` だけで動作することを確認するストーリー。
 * 初回呼び出し時に `document.body` 直下に portal root が自動挿入される。
 */
function FireAndForgetDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => toast("カスタム", { duration: 2500 })}>
        toast(...)
      </Button>
      <Button variant="secondary" onClick={() => toast.success("保存しました")}>
        toast.success
      </Button>
      <Button variant="secondary" onClick={() => toast.error("ネットワークエラー")}>
        toast.error
      </Button>
      <Button variant="secondary" onClick={() => toast.info("お知らせがあります")}>
        toast.info
      </Button>
      <Button variant="secondary" onClick={() => toast.warning("警告メッセージ")}>
        toast.warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("操作完了", {
            description: "description 付きトーストも OK",
            duration: 4000,
          })
        }
      >
        with description
      </Button>
    </div>
  )
}

export const FireAndForget: Story = {
  name: "Fire-and-forget (no <Toaster />)",
  render: () => <FireAndForgetDemo />,
}
