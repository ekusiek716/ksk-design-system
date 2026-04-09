/**
 * @file ResponsiveDialog のストーリー
 * @description デスクトップでは Dialog、モバイルでは Sheet として表示されるレスポンシブダイアログ
 */
import type { Meta, StoryObj } from "@storybook/react"
import {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
} from "./responsive-dialog"
import { Button } from "./button"

const meta: Meta<typeof ResponsiveDialog> = {
  title: "UI/ResponsiveDialog",
  component: ResponsiveDialog,
}
export default meta

type Story = StoryObj<typeof ResponsiveDialog>

export const Default: Story = {
  render: () => (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button>ダイアログを開く</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>確認</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            この操作を実行してもよろしいですか？デスクトップではダイアログ、モバイルではシートとして表示されます。
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="py-4">
          <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
            ここにダイアログのコンテンツが入ります。画面幅に応じて表示形式が自動的に切り替わります。
          </p>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="secondary">閉じる</Button>
          </ResponsiveDialogClose>
          <Button>実行する</Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  ),
}
