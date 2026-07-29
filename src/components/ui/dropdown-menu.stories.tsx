import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu"
import { Button } from "./button"

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">メニューを開く</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>アクション</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          プロフィールを見る
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>設定</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">ログアウト</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">表示設定</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>表示する列</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>名前</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>メール</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>電話番号</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>住所</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithRadio: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">並び替え</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>並び替え順</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="newest">
          <DropdownMenuRadioItem value="newest">新しい順</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">古い順</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-asc">価格が安い順</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-desc">価格が高い順</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">詳細メニュー</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>コピー</DropdownMenuItem>
        <DropdownMenuItem>貼り付け</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>共有</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>LINE</DropdownMenuItem>
            <DropdownMenuItem>Twitter</DropdownMenuItem>
            <DropdownMenuItem>メール</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">削除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/** 開いた直後にクリックで項目を選べ、選択でメニューが閉じる。 */
export const OpensAndSelectsItem: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const onSelect = fn()
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" data-testid="trigger">メニューを開く</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>アクション</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onSelect}>プロフィールを見る</DropdownMenuItem>
          <DropdownMenuItem onSelect={onSelect}>設定</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByTestId("trigger")

    await userEvent.click(trigger)
    const menu = await body.findByRole("menu")

    // 入場アニメーション中でも操作できること
    await expect(getComputedStyle(menu).pointerEvents).not.toBe("none")
    await userEvent.click(within(menu).getByRole("menuitem", { name: "設定" }))

    await waitFor(() => expect(body.queryByRole("menu")).toBeNull())
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  },
}

/** キーボード（矢印キー + Enter）で項目を選べる。 */
export const NavigatesWithKeyboard: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" data-testid="trigger">メニューを開く</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>1つ目</DropdownMenuItem>
        <DropdownMenuItem>2つ目</DropdownMenuItem>
        <DropdownMenuItem>3つ目</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByTestId("trigger")

    trigger.focus()
    await userEvent.keyboard("{Enter}")
    const menu = await body.findByRole("menu")

    // Enter で開いた時点で先頭項目にフォーカスが乗る（WAI-ARIA menu パターン）
    await waitFor(() =>
      expect(within(menu).getByRole("menuitem", { name: "1つ目" })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowDown}")
    await expect(within(menu).getByRole("menuitem", { name: "2つ目" })).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(within(menu).getByRole("menuitem", { name: "3つ目" })).toHaveFocus()

    // Esc で閉じ、フォーカスがトリガーに戻る
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}
