/**
 * @file Toast のストーリー
 * @description トースト通知コンポーネント。default, success, caution, warning, info の全バリアントを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"
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

/**
 * viewport の下端 offset（issue #503）
 *
 * 下部タブバーや FAB を `position: fixed` で下端に置くプロダクトでは、既定の
 * `bottom: 1rem` だとトーストがそれらと重なる。位置は product theme の公開変数
 * `--Toast-Viewport-Offset-Bottom` で持ち上げる（`<Toaster>` を置かない
 * fire-and-forget 経路にも効く）。
 *
 * viewport は `document.body` へ portal されるので、変数は `:root` など
 * **portal の祖先**に置くこと（story のプレビュー div に当てても届かない）。
 * 消費側は自分の CSS に書く:
 *
 * ```css
 * :root { --Toast-Viewport-Offset-Bottom: calc(env(safe-area-inset-bottom) + 6.5rem); }
 * @media (min-width: 1024px) { :root { --Toast-Viewport-Offset-Bottom: 1rem; } }
 * ```
 */
function ViewportOffsetDemo() {
  const [lifted, setLifted] = React.useState(false)
  React.useEffect(() => {
    const root = document.documentElement
    if (lifted) root.style.setProperty("--Toast-Viewport-Offset-Bottom", "6.5rem")
    else root.style.removeProperty("--Toast-Viewport-Offset-Bottom")
    return () => {
      root.style.removeProperty("--Toast-Viewport-Offset-Bottom")
    }
  }, [lifted])

  return (
    <div className="p-6 flex flex-col gap-3">
      <Toaster />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setLifted((v) => !v)}>
          {lifted ? "既定（1rem）に戻す" : "下部ナビ分だけ持ち上げる（6.5rem）"}
        </Button>
        <Button onClick={() => toast.success("保存しました", { action: { label: "元に戻す", onClick: () => {} } })}>
          トーストを出す
        </Button>
      </div>
      <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
        下部の擬似ナビとトーストの重なりを比べる。
      </p>
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--Surface-Secondary)] border-t border-[var(--Border-Low-Emphasis)] flex items-center justify-center typo-label-sm text-[var(--Text-Medium-Emphasis)]">
        下部ナビ（擬似）
      </div>
    </div>
  )
}

export const ViewportOffset: Story = {
  name: "viewport の下端 offset（--Toast-Viewport-Offset-Bottom）",
  render: () => <ViewportOffsetDemo />,
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/**
 * トーストが表示され、live region 経由でスクリーンリーダーに通知されること。
 * viewport は常設 + aria-live="polite"、caution だけ role="alert" で割り込む設計。
 */
export const AnnouncesViaLiveRegion: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <div className="p-6">
      <Toaster />
      <Button
        data-testid="fire"
        onClick={() => toast.success("保存しました", { description: "変更が反映されました" })}
      >
        トーストを出す
      </Button>
      <Button
        data-testid="fire-caution"
        variant="destructive"
        onClick={() => toast.caution("エラー")}
      >
        caution トースト
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // live region はトーストが出る前から常設されていること
    // （後から挿入された live region は読み上げられない SR があるため）
    const viewport = body.getByRole("region", { name: "通知" })
    await expect(viewport).toHaveAttribute("aria-live", "polite")

    await userEvent.click(canvas.getByTestId("fire"))
    const toastEl = await body.findByText("保存しました")
    await expect(viewport.contains(toastEl)).toBe(true)
    await expect(await body.findByText("変更が反映されました")).toBeInTheDocument()

    // caution は割り込み通知として role="alert" が付く
    await userEvent.click(canvas.getByTestId("fire-caution"))
    const alert = await body.findByRole("alert")
    await expect(alert).toHaveTextContent("エラー")
  },
}
