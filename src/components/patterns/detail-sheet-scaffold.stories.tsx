import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import * as React from "react"
import { More } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea"
import { KebabMenu } from "@/components/patterns/admin/kebab-menu"
import { DetailSheetBody, DetailSheetHeader, DetailSheetScaffold } from "./detail-sheet-scaffold"
import { KeyboardAwareSheetFooter } from "./keyboard-aware-sheet-footer"
import { BottomSheetFrame } from "./bottom-sheet-frame"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"

const meta: Meta<typeof DetailSheetScaffold> = {
  title: "Components/DetailSheetScaffold",
  component: DetailSheetScaffold,
}
export default meta

type Story = StoryObj<typeof DetailSheetScaffold>

export const ReadOnlyTitle: Story = {
  render: () => (
    <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]">
      <DetailSheetScaffold
        header={
          <DetailSheetHeader
            title="ゲスト詳細"
            description="招待状・席次・メモをまとめて確認します。"
            trailing={
              <KebabMenu items={[{ label: "編集" }, { label: "削除", destructive: true }]} />
            }
          />
        }
        footer={
          <KeyboardAwareSheetFooter>
            <Button className="w-full">保存する</Button>
          </KeyboardAwareSheetFooter>
        }
      >
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
          本文だけがスクロールし、header と footer の配置は固定されます。
        </p>
      </DetailSheetScaffold>
    </div>
  ),
}

export const EditableTitle: Story = {
  render: () => {
    const [title, setTitle] = React.useState("新郎側 友人リスト")

    return (
      <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]">
        <DetailSheetScaffold
          header={
            <DetailSheetHeader
              leading={<Button variant="ghost" size="icon" aria-label="戻る">‹</Button>}
              titleEditor={
                <AutoGrowTextarea
                  aria-label="タイトル"
                  value={title}
                  onChange={setTitle}
                  minRows={1}
                  density="compact"
                  className="typo-heading-md"
                />
              }
              trailing={<Button variant="ghost" size="icon" aria-label="メニュー"><More size={18} /></Button>}
            />
          }
        >
          <DetailSheetBody className="px-0 py-0">
            <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
              title editor は minmax(0, 1fr) 内に収まり、trailing action を押し出しません。
            </p>
          </DetailSheetBody>
        </DetailSheetScaffold>
      </div>
    )
  },
}

/**
 * 閉じるボタンを DS が出す（issue #722）。`onClose` に閉じる処理を渡すと、trailing の右端に
 * 40px の閉じるボタン（閉じるアイコン 20px・読み上げ名は closeLabel、既定「閉じる」）が出る。
 * trailing の KebabMenu 等はそのまま左に並ぶ。閉じるボタンを trailing に自作しない。
 */
export const WithCloseButton: Story = {
  tags: ["interaction"],
  render: function Render() {
    const [closed, setClosed] = React.useState(0)
    return (
      <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]">
        <DetailSheetScaffold
          header={
            <DetailSheetHeader
              title="ゲスト詳細"
              trailing={<KebabMenu items={[{ label: "編集" }, { label: "削除", destructive: true }]} />}
              onClose={() => setClosed((n) => n + 1)}
            />
          }
        >
          <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">閉じた回数: {closed}</p>
        </DetailSheetScaffold>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const close = canvas.getByRole("button", { name: "閉じる" })
    await expect(close.getAttribute("data-slot")).toBe("detail-sheet-header-close")
    // trailing の末尾（右端）に置く
    await expect(close.parentElement?.lastElementChild).toBe(close)
    await userEvent.click(close)
    await expect(canvas.getByText("閉じた回数: 1")).toBeInTheDocument()
  },
}

/**
 * Sheet の中の文字列 title はシートの名前になる（issue #727）。sr-only の SheetTitle を別に置かない。
 * 閉じるボタンは onClose（issue #722）。
 */
export const InSheetTitleIsSheetName: Story = {
  tags: ["interaction"],
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>ゲスト詳細を開く</Button>
        </SheetTrigger>
        <BottomSheetFrame description="招待状・席次・メモをまとめて確認します。">
          <DetailSheetScaffold
            header={<DetailSheetHeader title="ゲスト詳細" onClose={() => setOpen(false)} />}
          >
            <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">本文</p>
          </DetailSheetScaffold>
        </BottomSheetFrame>
      </Sheet>
    )
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "ゲスト詳細を開く" }))
    const dialog = await within(document.body).findByRole("dialog", { name: "ゲスト詳細" })
    await waitFor(() => expect(dialog.getAttribute("data-state")).toBe("open"))
    const title = document.getElementById(dialog.getAttribute("aria-labelledby") ?? "")
    await expect(title?.getAttribute("data-slot")).toBe("sheet-title")
    await userEvent.click(within(dialog).getByRole("button", { name: "閉じる" }))
    // CI の WebKit は退場アニメーションの待ちが既定 1000ms を超えることがあるので 5000ms 待つ
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull(), { timeout: 5000 })
  },
}
