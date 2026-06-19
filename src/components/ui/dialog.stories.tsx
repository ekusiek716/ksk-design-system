/**
 * @file Dialog のストーリー
 * @description モーダルダイアログコンポーネント。トリガーボタン、ヘッダー、説明、フッターアクション付き
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { RadioGroup, RadioGroupItem } from "./radio-group"

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
        <div className="flex flex-col gap-4">
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

export const FocusOptions: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>フォーカス制御を開く</Button>
      </DialogTrigger>
      <DialogContent
        autoFocus="first-input"
        closeOnEsc={false}
        restoreFocusOnClose
        bodyScrollLock
        description="初期フォーカスと閉じた後のフォーカス復帰を指定したダイアログです。"
      >
        <DialogHeader>
          <DialogTitle>招待メールを送信</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invite-email">メールアドレス</Label>
          <Input id="invite-email" type="email" placeholder="name@example.com" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>送信する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * 既定の `orientation="split"`。2 アクションを均等幅（各 flex-1）で横並びにする。
 * モバイルのボトムシートやアプリ風 UI 向け。左=セカンダリ / 右=プライマリ。
 */
export const ReportShop: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ショップを報告</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ショップを報告</DialogTitle>
          <DialogDescription>報告する理由を選択してください。</DialogDescription>
        </DialogHeader>
        <RadioGroup defaultValue="misleading">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="misleading" id="report-misleading" />
            <Label htmlFor="report-misleading">誤解を招く内容</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="inappropriate" id="report-inappropriate" />
            <Label htmlFor="report-inappropriate">不適切なコンテンツ</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="other" id="report-other" />
            <Label htmlFor="report-other">その他</Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>次へ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * `orientation="stacked"` で旧来のレイアウトに戻す。モバイルは縦積み、
 * デスクトップは右寄せの hug 幅。3 つ以上のアクションや、右寄せにしたい
 * フォーム系ダイアログで使う。
 */
export const StackedFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>変更を保存</DialogTitle>
          <DialogDescription>
            編集内容を保存しますか？保存せずに閉じると変更は失われます。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter orientation="stacked">
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>保存する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
