import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyboardAwareSheetFooter } from "./keyboard-aware-sheet-footer"

const meta: Meta<typeof KeyboardAwareSheetFooter> = {
  title: "Components/KeyboardAwareSheetFooter",
  component: KeyboardAwareSheetFooter,
}
export default meta

type Story = StoryObj<typeof KeyboardAwareSheetFooter>

export const Fixed: Story = {
  render: () => (
    <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]">
      <div className="space-y-4 px-5 py-4">
        <Input aria-label="コメント" placeholder="コメントを追加" />
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          visualViewport の keyboard inset を footer に渡します。
        </p>
      </div>
      <KeyboardAwareSheetFooter>
        <Button className="w-full">保存する</Button>
      </KeyboardAwareSheetFooter>
    </div>
  ),
}

export const HideWhenKeyboardOpen: Story = {
  render: () => (
    <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]">
      <div className="space-y-4 px-5 py-4">
        <Input aria-label="サブタスク" placeholder="サブタスクを追加" />
      </div>
      <KeyboardAwareSheetFooter behavior="hide">
        <Button className="w-full">完了する</Button>
      </KeyboardAwareSheetFooter>
    </div>
  ),
}
