/**
 * @file Sheet のストーリー
 * @description サイドパネルコンポーネント。右側シートをコンテンツ付きで表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "./sheet"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
}
export default meta

type Story = StoryObj<typeof Sheet>

export const RightSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">シートを開く</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>プロフィール編集</SheetTitle>
          <SheetDescription>
            プロフィール情報を変更できます。完了したら保存してください。
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-name">名前</Label>
            <Input id="sheet-name" defaultValue="山田太郎" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-email">メールアドレス</Label>
            <Input id="sheet-email" defaultValue="yamada@example.com" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </SheetClose>
          <Button>保存する</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">左シートを開く</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>ナビゲーション</SheetTitle>
          <SheetDescription>メニューを選択してください。</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 py-4">
          <a href="#" className="typo-label-md text-[var(--Text-High-Emphasis)] px-2 py-1.5 rounded-lg hover:bg-[var(--Surface-Secondary)]">ダッシュボード</a>
          <a href="#" className="typo-label-md text-[var(--Text-High-Emphasis)] px-2 py-1.5 rounded-lg hover:bg-[var(--Surface-Secondary)]">プロジェクト</a>
          <a href="#" className="typo-label-md text-[var(--Text-High-Emphasis)] px-2 py-1.5 rounded-lg hover:bg-[var(--Surface-Secondary)]">設定</a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
}
