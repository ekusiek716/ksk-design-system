import type { Meta, StoryObj } from "@storybook/react"
import { Notification, Setting2, ShieldSecurity } from "iconsax-reactjs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SettingsListRow, SettingsSection } from "./settings-section"

const meta: Meta<typeof SettingsSection> = {
  title: "Components/SettingsSection",
  component: SettingsSection,
}
export default meta

type Story = StoryObj<typeof SettingsSection>

export const Group: Story = {
  render: () => (
    <div className="max-w-md space-y-6 bg-[var(--Surface-Secondary)] p-4">
      <SettingsSection title="基本情報" description="プロフィールと表示設定を管理します">
        <SettingsListRow
          title="プロフィール"
          description="名前、アイコン、紹介文"
          leading={<Setting2 size={22} className="text-[var(--Object-Medium-Emphasis)]" />}
          rightSlot={<Badge variant="secondary">任意</Badge>}
          interactive
        />
        <SettingsListRow
          title="通知"
          description="毎日のリマインダー"
          leading={<Notification size={22} className="text-[var(--Object-Medium-Emphasis)]" />}
          rightSlot={<Switch checked aria-label="通知" />}
        />
      </SettingsSection>
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div className="max-w-md bg-[var(--Surface-Secondary)] p-4">
      <SettingsSection
        title="アカウント"
        description="ログインとバックアップ"
        action={<Button variant="ghost" size="sm">編集</Button>}
        variant="card"
      >
        <SettingsListRow title="メールアドレス" description="user@example.com" rightSlot={<Badge>確認済み</Badge>} />
        <SettingsListRow title="自動バックアップ" rightSlot={<Switch aria-label="自動バックアップ" />} />
      </SettingsSection>
    </div>
  ),
}

export const Danger: Story = {
  render: () => (
    <div className="max-w-md bg-[var(--Surface-Secondary)] p-4">
      <SettingsSection title="危険な操作" description="取り消せない操作です" variant="danger">
        <SettingsListRow
          title="データを削除"
          description="ローカルとクラウドの履歴を削除します"
          leading={<ShieldSecurity size={22} className="text-[var(--Text-Caution)]" />}
          rightSlot={<Button variant="destructive" size="sm">削除する</Button>}
          destructive
        />
      </SettingsSection>
    </div>
  ),
}

/** Public spacing overrides keep a 44px floor even when a product requests a shorter row. */
export const CompactSpacing: Story = {
  render: () => (
    <div className="max-w-md bg-[var(--Surface-Primary)] [--Settings-Row-Min-Height:2rem] [--Settings-Row-Gap:0.5rem] [--Settings-Row-Padding-X:0.75rem] [--Settings-Row-Padding-Y:0.5rem]">
      <SettingsSection title="コンパクトな設定行" description="余白を調整しても操作領域は44px以上を保ちます" variant="card">
        <SettingsListRow title="通知" leading={<Notification size={20} className="text-[var(--Text-Medium-Emphasis)]" />} rightSlot={<Switch aria-label="通知" />} />
        <SettingsListRow title="プロフィール" description="長い説明文はアイコンと操作の間で折り返します" leading={<Setting2 size={20} className="text-[var(--Text-Medium-Emphasis)]" />} rightSlot={<Button size="sm" variant="secondary">編集</Button>} />
      </SettingsSection>
    </div>
  ),
}

/**
 * 見出しアイコンと遷移の矢印（issue #690）。`icon` は見出しの左（装飾）、`showChevron` は
 * 次の画面へ進む行の右端。トグルの行には付けない。
 */
export const WithIconAndChevron: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <SettingsSection variant="card" title="アカウント" icon={<Setting2 />}>
        <SettingsListRow title="プロフィール" description="名前・アイコン" showChevron onClick={() => {}} />
        <SettingsListRow title="ログイン方法" rightSlot={<Badge variant="info">メール</Badge>} showChevron onClick={() => {}} />
        <SettingsListRow title="通知" rightSlot={<Switch aria-label="通知" />} />
      </SettingsSection>
    </div>
  ),
}
