/**
 * @file SearchBar のストーリー
 * @description 検索入力コンポーネント。プレースホルダー付きのデフォルト表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { SearchBar } from "./search-bar"

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
}
export default meta

type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  args: {
    placeholder: "キーワードで検索",
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: "デザインシステム",
    placeholder: "検索",
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "検索できません",
    disabled: true,
  },
}

export const WithOnSearch: Story = {
  args: {
    placeholder: "Enterキーで検索",
    onSearch: (value: string) => alert(`検索: ${value}`),
  },
}
