import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from '../../src/components/patterns/chip'
import { Button } from '../../src/components/ui/button'
import { SettingsListRow, SettingsSection } from '../../src/components/patterns/settings-section'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../../src/components/ui/sheet'

const meta = { title: 'Verification/Visual Fixtures', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const ChipLongLabel: Story = {
  render: () => <div className="flex flex-wrap gap-2"><Chip selected removable onRemove={() => {}}>仕事とプロジェクトの予定</Chip><Chip>家族</Chip><Chip>未選択</Chip></div>,
}
export const SettingsLongDescription: Story = {
  render: () => <SettingsSection title="危険な操作" description="実行前に対象を確認してください" variant="danger"><SettingsListRow title="データを削除" description="この端末とクラウドに保存したすべての履歴を削除します。この操作は取り消せません。" rightSlot={<Button variant="destructive" size="sm">削除する</Button>} destructive /></SettingsSection>,
}
export const SheetLongDescription: Story = {
  render: () => <Sheet open><SheetContent side="float"><SheetHeader><SheetTitle>申込内容の確認</SheetTitle><SheetDescription>入力した内容を確認してください。長い日本語の説明でも画面幅に応じて折り返され、操作ボタンが隠れないことを確認します。</SheetDescription></SheetHeader><SheetFooter><Button variant="secondary">あとで</Button><Button>送信する</Button></SheetFooter></SheetContent></Sheet>,
}
