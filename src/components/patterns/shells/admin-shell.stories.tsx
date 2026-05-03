import type { Meta, StoryObj } from "@storybook/react"
import { AdminShell } from "./admin-shell"

const meta: Meta<typeof AdminShell> = {
  title: "Shells/AdminShell",
  component: AdminShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof AdminShell>

const SidebarContent = () => (
  <div className="flex flex-col gap-1 p-3">
    <div className="px-3 py-2 typo-label-xs text-[var(--Text-Low-Emphasis)] uppercase tracking-wider">メニュー</div>
    {["ダッシュボード", "注文管理", "商品管理", "顧客管理", "設定"].map((item) => (
      <button key={item} className="w-full text-left px-3 py-2 rounded-lg typo-body-sm text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors">
        {item}
      </button>
    ))}
  </div>
)

const HeaderContent = () => (
  <div className="flex items-center justify-between w-full">
    <span className="typo-heading-md text-[var(--Text-High-Emphasis)]">ダッシュボード</span>
    <div className="size-8 rounded-full bg-[var(--Brand-Primary)] flex items-center justify-center text-white typo-label-sm">管</div>
  </div>
)

export const Default: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    children: (
      <div className="p-6 typo-body-md text-[var(--Text-Medium-Emphasis)]">
        メインコンテンツエリア
      </div>
    ),
  },
}
