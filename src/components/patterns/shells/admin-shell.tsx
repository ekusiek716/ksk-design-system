import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "../../ui/container"
import { ScrollArea } from "../../ui/scroll-area"
import { SkipLink } from "../../ui/skip-link"

interface AdminShellProps extends React.ComponentProps<"div"> {
  sidebar: React.ReactNode
  header?: React.ReactNode
  sidebarWidth?: string
  mainId?: string
  skipLink?: boolean
  skipLinkLabel?: string | null
}

/**
 * AdminShell — 管理画面のレイアウトシェル
 *
 * `sidebar` / `header` は slot なので、中身の合成規範は利用側が守る。
 * 合成の実例は `admin-shell.stories.tsx` を参照（出典: #253 / #254）。
 *
 * 1. サイドバー内のロゴ行に下罫線を入れない。コンテンツヘッダーの下線と
 *    横一直線に並び、サイドバー右端の縦線と十字に交差してしまう。罫線は
 *    「サイドバー右端の縦線」「ヘッダー下の横線」の 2 本に絞り、T 字で突き当てる。
 * 2. サイドバーの開閉トリガーはサイドバー自身（SidebarHeader の右端、折りたたみ時は
 *    レール内）に置く。コンテンツヘッダー左端に置くとページタイトルのバーに
 *    アプリ全体の操作が混ざり、近接の原則にも反する。
 * 3. フッターのユーザーブロックは、アバターのイニシャルを円の 44% 目安にする
 *    （32px 円なら 14px = `typo-label-md`）。12px（37%）だと字が円の中で泳ぐ。
 * 4. サイドバーのフッターにも上罫線を入れない。サイドバーは頭からつま先まで
 *    1 枚のパネルとして読ませ、分離は余白が担う。
 * 5. シェルヘッダーにページタイトルを複製しない。ページ名の正は本文の
 *    SectionHeader。ヘッダーには Breadcrumb やグローバル操作を置き、
 *    置くものが無ければ `header` を渡さずヘッダーバーごと省略する。
 * 6. ヘッダーと本文はいずれも `Container size="fluid"`（gutter 24px）を通すため
 *    左の面が揃う。片側だけ水平 padding を上書きすると基準線が二重になる。
 * 7. サイドナビ項目は縦 padding 12px = 項目高 44px（`h-11`）を確保する。
 *    20px アイコン + 24px でちょうど 44px に乗る。44×44 は本 DS のポリシー
 *    （WCAG 2.5.5 Target Size (Enhanced) = AAA 相当）で、AA の最小要件は
 *    2.5.8 Target Size (Minimum) の 24×24 であることに注意。
 * 8. `sidebar` slot の直下は `flex grow flex-col` にし、フッターは `mt-auto` で
 *    下端へ落とす。`h-full` は使わない — slot は Radix ScrollArea の viewport
 *    ラッパー（height:auto）配下に入るため % height が解決されず、フッターが
 *    下端に来ない。shell 側はそのラッパーを min-h-full の縦 flex に矯正して
 *    `grow` が効く状態を用意している。
 */
function AdminShell({
  className,
  sidebar,
  header,
  children,
  sidebarWidth = "w-64",
  mainId = "main-content",
  skipLink = true,
  skipLinkLabel = "コンテンツへ移動",
  ...props
}: AdminShellProps) {
  return (
    <div
      data-slot="admin-shell"
      className={cn("flex h-screen bg-[var(--Surface-Secondary)]", className)}
      {...props}
    >
      {skipLink && skipLinkLabel && <SkipLink targetId={mainId} label={skipLinkLabel} />}
      <aside
        data-slot="admin-sidebar"
        className={cn(
          "hidden lg:flex flex-col border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
          sidebarWidth
        )}
      >
        {/*
          Radix ScrollArea の viewport 直下ラッパーは inline style の display:table +
          auto height。そのままだと sidebar 側の h-full が解決できず（% height は
          親の height:auto に対して解決不能）、ナビが短いときにフッターが下端へ
          落ちない。ラッパーを min-h-full の縦 flex に矯正し、slot 直下が
          `flex grow flex-col` + `mt-auto` でフッターを下端に置けるようにする。
          display は inline style を上書きする必要があるため `!` を付ける。
        */}
        <ScrollArea
          className={cn(
            "flex-1",
            "[&_[data-radix-scroll-area-viewport]>div]:flex!",
            "[&_[data-radix-scroll-area-viewport]>div]:min-h-full",
            "[&_[data-radix-scroll-area-viewport]>div]:flex-col"
          )}
        >
          {sidebar}
        </ScrollArea>
      </aside>
      <div className="flex flex-1 flex-col min-w-0">
        {header && (
          <header
            data-slot="admin-header"
            className="h-16 shrink-0 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]"
          >
            <Container size="fluid" className="flex h-full items-center gap-4">
              {header}
            </Container>
          </header>
        )}
        <main id={mainId} tabIndex={-1} data-slot="admin-main" className="flex-1 overflow-auto">
          {/* 縦 padding は product theme の --Product-Page-Padding-Y を参照する
              （issue #364 追補）。AppShell / MarketingShell / MobileAppShell は
              本文の padding をシェル自身が持たない（Container の gutter か
              呼び出し側の contentClassName に委ねている）ため対象外。 */}
          <Container size="fluid" className="py-[var(--Product-Page-Padding-Y)]">
            {children}
          </Container>
        </main>
      </div>
    </div>
  )
}

export { AdminShell }
export type { AdminShellProps }
