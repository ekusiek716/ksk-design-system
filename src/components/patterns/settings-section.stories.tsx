import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Notification, Setting2, ShieldSecurity } from "iconsax-reactjs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PillToggle } from "@/components/ui/pill-toggle"
import { Switch } from "@/components/ui/switch"
import { ChipSelector } from "./chip-selector"
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
          rightSlot={(control) => <Switch checked {...control} />}
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

function LinkedControlDemo() {
  const [notify, setNotify] = React.useState(false)
  const [mail, setMail] = React.useState(true)
  return (
    <div className="w-full max-w-md">
      <SettingsSection variant="card" title="通知">
        <SettingsListRow
          title="プッシュ通知"
          description="毎日 9 時にリマインダーを送ります"
          rightSlot={(control) => <Switch {...control} checked={notify} onCheckedChange={setNotify} />}
        />
        <SettingsListRow
          title="メール通知"
          controlId="settings-mail"
          rightSlot={<Switch id="settings-mail" checked={mail} onCheckedChange={setMail} />}
        />
      </SettingsSection>
    </div>
  )
}

/**
 * 項目名・説明を右の操作部品と結ぶ（issue #759）。rightSlot に関数を渡すと `{ id, "aria-describedby" }`
 * を受け取り、title がその部品のラベル（押すと切り替わる）、description が説明になる。
 * 自分で id を決めるなら `controlId` と、部品側の `id` / `aria-describedby`（`${controlId}-description`）。
 * Switch に title と同じ aria-label を重ねて書かない。
 */
export const LinkedControl: Story = {
  tags: ["interaction"],
  render: () => <LinkedControlDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const push = canvas.getByRole("switch", { name: "プッシュ通知" })
    await expect(push).toHaveAccessibleDescription("毎日 9 時にリマインダーを送ります")
    await expect(push).toHaveAttribute("aria-checked", "false")
    // 項目名を押すと 1 回だけ切り替わる（二重発火で元に戻らない）
    await userEvent.click(canvas.getByText("プッシュ通知"))
    await expect(push).toHaveAttribute("aria-checked", "true")
    await userEvent.click(push)
    await expect(push).toHaveAttribute("aria-checked", "false")
    const mail = canvas.getByRole("switch", { name: "メール通知" })
    await expect(mail).toHaveAttribute("aria-checked", "true")
    await userEvent.click(canvas.getByText("メール通知"))
    await expect(mail).toHaveAttribute("aria-checked", "false")
  },
}

const THEMES = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
  { value: "system", label: "端末に合わせる" },
] as const
type Theme = (typeof THEMES)[number]["value"]

const LANGUAGES = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
] as const
type Language = (typeof LANGUAGES)[number]["value"]

function LinkedRadioGroupDemo() {
  const [theme, setTheme] = React.useState<Theme | null>("system")
  const [language, setLanguage] = React.useState<Language>("ja")
  return (
    <div className="w-full max-w-md">
      <SettingsSection variant="card" title="表示">
        <SettingsListRow
          title="テーマ"
          description="画面の明るさ"
          rightSlot={(control) => (
            <ChipSelector
              {...control}
              selectionMode="single"
              size="sm"
              options={[...THEMES]}
              value={theme}
              onChange={setTheme}
            />
          )}
        />
        <SettingsListRow
          title="言語"
          rightSlot={(control) => (
            <PillToggle
              aria-labelledby={control["aria-labelledby"]}
              semantics="radio"
              size="sm"
              options={[...LANGUAGES]}
              value={language}
              onChange={setLanguage}
            />
          )}
        />
      </SettingsSection>
    </div>
  )
}

/**
 * 右に選択肢の並び（radiogroup）を置く行（issue #763）。`<label>` は div の radiogroup を名付けられないので、
 * 関数の rightSlot が渡す `aria-labelledby`（title の id）で title を名前にする。ChipSelector は
 * `{...control}` をそのまま、id / aria-describedby を受け取らない部品は `aria-labelledby` だけ渡す。
 * title と同じ aria-label を重ねて書かない。
 */
export const LinkedRadioGroup: Story = {
  tags: ["interaction"],
  render: () => <LinkedRadioGroupDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const theme = canvas.getByRole("radiogroup", { name: "テーマ" })
    await expect(theme).toHaveAccessibleDescription("画面の明るさ")
    await userEvent.click(within(theme).getByRole("radio", { name: "ダーク" }))
    await expect(within(theme).getByRole("radio", { name: "ダーク" })).toHaveAttribute("aria-checked", "true")
    const language = canvas.getByRole("radiogroup", { name: "言語" })
    await userEvent.click(within(language).getByRole("radio", { name: "English" }))
    await expect(within(language).getByRole("radio", { name: "English" })).toHaveAttribute("aria-checked", "true")
  },
}
