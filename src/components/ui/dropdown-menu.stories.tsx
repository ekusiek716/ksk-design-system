import type { Meta, StoryObj } from "@storybook/react"
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
