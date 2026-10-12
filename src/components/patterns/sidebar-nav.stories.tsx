import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"
import { Home2, Home3, People, Setting2, TaskSquare } from "iconsax-reactjs"
import { SidebarNav, type SidebarNavItem } from "./sidebar-nav"

const meta: Meta<typeof SidebarNav> = {
  title: "Components/SidebarNav",
  component: SidebarNav,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "PC 表示の左サイドバーに縦に並べるナビ項目（issue #611）。",
          "",
          "- 行の高さ 44px・角丸・選択中の面と文字色・アイコン位置・`aria-current=\"page\"` は部品が持つ。Button を行の形へ上書きして代用しない。",
          "- `items` は `BottomTabBarItem` と同じ形。モバイルの BottomTabBar と同じ配列を `MobileAppShell` の `desktopSidebar` に渡せる。",
          "- `collapsed` でアイコンだけのレール表示。ラベルは aria-label と title に移る。",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-[var(--Surface-Primary)] p-3">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof SidebarNav>

const items: SidebarNavItem[] = [
  { label: "ホーム", icon: <Home2 />, activeIcon: <Home3 variant="Bold" />, isActive: true, tabKey: "home" },
  { label: "タスク", icon: <TaskSquare />, badgeCount: 4, tabKey: "tasks" },
  { label: "ゲスト", icon: <People />, badgeCount: 128, tabKey: "guests" },
  { label: "設定", icon: <Setting2 />, tabKey: "settings" },
]

export const Default: Story = {
  args: { items },
}

export const Collapsed: Story = {
  args: { items, collapsed: true },
  decorators: [
    (Story) => (
      <div className="w-16 bg-[var(--Surface-Primary)] py-3">
        <Story />
      </div>
    ),
  ],
}

export const Links: Story = {
  args: {
    items: items.map((item) => ({ ...item, href: `#${item.tabKey}` })),
  },
}

export const LongLabel: Story = {
  args: {
    items: [
      { label: "とても長いメニュー名が入ったときは末尾を省略する", icon: <TaskSquare />, badgeCount: 2 },
      ...items.slice(1),
    ],
  },
}

/**
 * 項目ごとの `render` スロットでフレームワークのリンク部品（next/link 等）に差し替える。
 * 渡された props（className・aria-current・data-*・children）をそのまま転送すれば、
 * 通常の `<a>` と同じ見た目・現在地表示になる。ここでは `data-router` を付ける
 * だけのスタブで代用している。
 */
export const RouterLinkRender: Story = {
  tags: ["interaction"],
  args: {
    items: items.map((item) => ({
      ...item,
      href: `#${item.tabKey}`,
      render: (p) => (
        <a {...p} data-router="1">
          {p.children}
        </a>
      ),
    })),
  },
  play: async ({ canvasElement }) => {
    const links = canvasElement.querySelectorAll<HTMLElement>("a[data-router]")
    await expect(links).toHaveLength(4)
    await expect(links[0].getAttribute("aria-current")).toBe("page")
    await expect(links[0].getAttribute("data-tab-key")).toBe("home")
    await expect(links[0].className).toContain("min-h-11")
  },
}
