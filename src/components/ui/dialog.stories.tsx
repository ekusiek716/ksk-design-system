/**
 * @file Dialog のストーリー
 * @description モーダルダイアログコンポーネント。トリガーボタン、ヘッダー、説明、フッターアクション付き
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
}
export default meta

type Story = StoryObj<typeof Dialog>

export const WithTrigger: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確認</DialogTitle>
          <DialogDescription>
            この操作を実行してもよろしいですか？この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button variant="destructive">削除する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>プロジェクトを作成</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規プロジェクト</DialogTitle>
          <DialogDescription>
            プロジェクトの基本情報を入力してください。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-name">プロジェクト名</Label>
            <Input id="project-name" placeholder="プロジェクト名を入力" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-desc">説明</Label>
            <Input id="project-desc" placeholder="プロジェクトの説明" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>作成する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
