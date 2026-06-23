import type { Meta, StoryObj } from "@storybook/react"
import { More } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KebabMenu } from "@/components/patterns/admin/kebab-menu"
import { DetailSheetBody, DetailSheetHeader, DetailSheetScaffold } from "./detail-sheet-scaffold"
import { KeyboardAwareSheetFooter } from "./keyboard-aware-sheet-footer"

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
  render: () => (
    <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]">
      <DetailSheetScaffold
        header={
          <DetailSheetHeader
            leading={<Button variant="ghost" size="icon" aria-label="戻る">‹</Button>}
            titleEditor={<Input aria-label="タイトル" defaultValue="新郎側 友人リスト" />}
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
  ),
}
