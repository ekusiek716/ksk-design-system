import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/patterns/section-header"
import { AdminShell } from "./admin-shell"

const meta: Meta<typeof AdminShell> = {
  title: "Shells/AdminShell",
  component: AdminShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "管理画面の骨組み。sidebar / header は slot なので、合成の規範は本ストーリーが示す（#253 / #254）。",
          "",
          "- サイドバーは頭からつま先まで 1 枚のパネル。ロゴ行の下罫線 / フッター行の上罫線は入れず、分離は余白が担う。罫線はサイドバー右端の縦線とヘッダー下の横線の 2 本だけにする。",
          "- サイドバーの開閉トリガーは SidebarHeader の右端に置く（コンテンツヘッダー左端に置かない）。折りたたみ時はアイコンレール内に残す。",
          "- フッターのアバターはイニシャルを円の 44% 目安に（32px 円 = `typo-label-md` の 14px）。",
          "- シェルヘッダーにページタイトルを複製しない。パンくず・グローバル操作を置き、置くものが無ければ header を省略する。",
          '- ヘッダーと本文は同じ `Container size="fluid"`（gutter 24px）で左の面が揃う。片方だけ padding を上書きしない。',
          "- サイドナビ項目は 44px（`h-11`）。44×44 は本 DS のポリシー（WCAG 2.5.5 Target Size (Enhanced) = AAA 相当。AA の最小要件は 2.5.8 の 24×24）。",
          "- サイドバー slot の最上位は `flex grow flex-col` にする。フッターは `mt-auto` で下端に落ちる。`h-full` は Radix ScrollArea の viewport ラッパー（height:auto）に対して解決されず効かないので使わない。",
        ].join("\n"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof AdminShell>

const NAV_ITEMS = ["ダッシュボード", "注文管理", "商品管理", "顧客管理", "設定"]
const ACTIVE_INDEX = 1

interface SidebarContentProps {
  collapsed: boolean
  onToggle: () => void
}

const SidebarContent = ({ collapsed, onToggle }: SidebarContentProps) => (
  // slot 直下は grow + flex-col。shell 側が ScrollArea の viewport ラッパーを
  // min-h-full の縦 flex に矯正しているので、フッターの mt-auto が下端で効く
  <div className="flex grow flex-col">
    {/* ロゴ行はコンテンツヘッダーと同じ 64px。下罫線は入れない（#253-1） */}
    <div
      className={
        collapsed
          ? "flex h-16 shrink-0 items-center justify-center px-2"
          : "flex h-16 shrink-0 items-center justify-between gap-2 px-3"
      }
    >
      {!collapsed && (
        <span className="typo-label-md text-[var(--Text-High-Emphasis)]">KSK Admin</span>
      )}
      {/* 開閉トリガーはサイドバー側に置き、折りたたみ時もレール内に残す（#253-2）。44px */}
      <Button
        variant="ghost"
        size="icon-xl"
        aria-label={collapsed ? "サイドバーを開く" : "サイドバーを折りたたむ"}
        aria-expanded={!collapsed}
        onClick={onToggle}
        className="text-[var(--Text-Medium-Emphasis)]"
      >
        {collapsed ? <ArrowRight2 size={20} /> : <ArrowLeft2 size={20} />}
      </Button>
    </div>

    <div className={collapsed ? "flex flex-col gap-1 px-2" : "flex flex-col gap-1 px-3"}>
      {!collapsed && (
        <div className="px-3 py-2 typo-label-xs uppercase tracking-wider text-[var(--Text-Low-Emphasis)]">
          メニュー
        </div>
      )}
      {NAV_ITEMS.map((item, i) => {
        const active = i === ACTIVE_INDEX
        // 生 <a> / <button> は使わず Button asChild。h-11 = 44px（#254-4）
        return (
          <Button
            key={item}
            asChild
            variant="ghost"
            className={[
              "h-11 rounded-lg typo-body-sm",
              collapsed ? "w-11 justify-center px-0" : "w-full justify-start gap-3 px-3",
              active
                ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]"
                : "text-[var(--Text-High-Emphasis)]",
            ].join(" ")}
          >
            <a
              href="#main-content"
              aria-current={active ? "page" : undefined}
              aria-label={collapsed ? item : undefined}
              title={collapsed ? item : undefined}
            >
              <span className="size-5 shrink-0 rounded-full bg-[var(--Surface-Secondary)]" />
              {!collapsed && item}
            </a>
          </Button>
        )
      })}
    </div>

    {/* フッターにも上罫線を入れない（#254-1）。分離は余白が担う */}
    <div
      className={
        collapsed
          ? "mt-auto flex shrink-0 items-center justify-center px-2 py-4"
          : "mt-auto flex shrink-0 items-center gap-3 px-6 py-4"
      }
    >
      <Avatar className="size-8">
        {/*
          イニシャルは円の 44%（32px × 0.44 ≒ 14px = typo-label-md）（#253-3）。
          AvatarFallback の既定は typo-label-sm(12px = 37%) で、typo-* 同士は
          twMerge の解決対象外のため CSS 順で既定が勝つ。上書きには `!` を付ける。
        */}
        <AvatarFallback className="typo-label-md!">KO</AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate typo-label-sm text-[var(--Text-High-Emphasis)]">高尾 由季</p>
          <p className="truncate typo-body-xs text-[var(--Text-Medium-Emphasis)]">
            manager@example.com
          </p>
        </div>
      )}
    </div>
  </div>
)

// ヘッダーにはページタイトルを複製せず、現在地（パンくず）と全体操作を置く（#254-2）
const HeaderContent = () => (
  <div className="flex w-full items-center justify-between gap-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#main-content">運営</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>注文管理</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Button variant="secondary" size="sm">
      エクスポート
    </Button>
  </div>
)

/** 開閉状態は利用側が持つ。折りたたみ時は w-16 のアイコンレールにする。 */
const CollapsibleAdminShell = ({
  withHeader = true,
  description,
}: {
  withHeader?: boolean
  description: string
}) => {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <AdminShell
      sidebarWidth={collapsed ? "w-16" : "w-64"}
      sidebar={<SidebarContent collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />}
      header={withHeader ? <HeaderContent /> : undefined}
    >
      {/* ページ名の正はここ 1 か所だけ。ヘッダーと同じ Container gutter で左の面が揃う（#254-3） */}
      <SectionHeader title="注文一覧" description={description} />
    </AdminShell>
  )
}

export const Default: Story = {
  render: () => <CollapsibleAdminShell description="ページタイトルは本文側で 1 回だけ配置する。" />,
}

/** header に置くものが無ければヘッダーバー自体を省略してよい（#254-2）。 */
export const WithoutHeader: Story = {
  render: () => (
    <CollapsibleAdminShell
      withHeader={false}
      description="グローバル操作もパンくずも無い画面では header を渡さない。"
    />
  ),
}
