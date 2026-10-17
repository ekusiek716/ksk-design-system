import * as React from "react"
import { HamburgerMenu } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { Button } from "../../ui/button"
import { Container } from "../../ui/container"
import { Sheet, SheetContent, SheetTitle } from "../../ui/sheet"
import { ScrollArea } from "../../ui/scroll-area"
import { SkipLink } from "../../ui/skip-link"
import { useKskLabels } from "../../ui/ksk-labels"

interface AdminShellProps extends React.ComponentProps<"div"> {
  sidebar: React.ReactNode
  header?: React.ReactNode
  sidebarWidth?: string
  /**
   * サイドバーの面（issue #680）。"default"（既定）は Surface-Primary、"inverse" は Surface-Inverse の
   * 暗い面。inverse では中のナビを `<SidebarNav tone="inverse">` にし、ロゴ・フッターの文字も
   * Text-on-Inverse 系にする。
   */
  sidebarTone?: "default" | "inverse"
  mainId?: string
  skipLink?: boolean
  skipLinkLabel?: string | null
  /**
   * lg（1024px）未満でサイドバーを引き出し式のメニュー（モバイルドロワー）にする（issue #705）。
   * true のとき lg 未満のヘッダー左端にメニューボタンを出し、押すと左から Sheet で `sidebar` を開く。
   * `header` が無いときも lg 未満ではメニューボタンだけのヘッダーを出す。lg 以上の見た目は変わらない。
   * @default false（従来どおり lg 未満ではサイドバーを出さない）
   */
  mobileDrawer?: boolean
  /** モバイルドロワーの開閉（制御する場合）。onMobileDrawerOpenChange と対で渡す */
  mobileDrawerOpen?: boolean
  /** モバイルドロワーの開閉が変わったとき */
  onMobileDrawerOpenChange?: (open: boolean) => void
  /** メニューボタンのアクセシブルネーム。@default KskLabelsProvider の mobileMenu（無ければ「メニューを開く」） */
  mobileMenuLabel?: string
  /** ドロワーの見出し（読み上げ専用。画面には出さない）。@default KskLabelsProvider の mobileDrawerTitle（無ければ「メニュー」） */
  mobileDrawerTitle?: string
  /**
   * ドロワーの中のリンク（`a[href]`）や SidebarNav の項目を押したら閉じる。
   * 既定 false。画面遷移時の開閉は consumer が制御し、自動で閉じたい場合だけ true にする。
   * サイドバー内の開閉トグル等、それ以外のボタンでは閉じない。
   * @default false
   */
  closeMobileDrawerOnNavigate?: boolean
  /**
   * 上端の safe-area（ステータスバー・ノッチ）を空ける（issue #724）。既定 false。
   * `var(--Safe-Area-Inset-Top, env(safe-area-inset-top, 0px))` をヘッダー（下線込み 64px + 安全領域）・
   * lg 以上のサイドバー・mobileDrawer のドロワーの上に足す。ヘッダーが無い画面では本文の列の上に足す。上端の帯はそれぞれの面の色になる。
   * アプリ内で全画面に重ねて出すときは `className="h-full"` と組み、外枠に safe-area と背景を書かない
   */
  safeAreaTop?: boolean
  /**
   * アプリ内で画面全体に重ねて出す（issue #737）。既定 false。
   * `fixed inset-0 z-[var(--Z-Overlay)] h-full` を DS が持つ（h-screen の代わり。className で
   * 重ねる位置や z-index を書かない）。safeAreaTop と組む。
   * z-index は Sheet / Dialog の overlay と同じ層（--Z-Overlay）。シェルより後に開いた Sheet / Dialog は
   * 暗転ごとシェルの上に出る（--Z-Modal だと、その暗転がシェルの下に隠れる）。
   * **背景は操作不能にしない**（inert / focus trap / aria-modal は付けない）。重ねる側（consumer）が
   * 下のアプリの根に `inert` を付ける。シェル自体は閉じる操作を持たない（閉じるボタンは header に置く）。
   */
  overlay?: boolean
}

/** ドロワーを閉じる対象（ナビゲーションとみなす要素） */
const NAVIGATE_SELECTOR = 'a[href], [data-slot="sidebar-nav-item"]'

/** lg（1024px）以上。ここではドロワーを出さない（desktop の aside が出る） */
const DESKTOP_QUERY = "(min-width: 1024px)"

/**
 * 押された要素がナビゲーション（= ドロワーを閉じてよい）か。
 * 子を持つ親項目（aria-expanded を持つ開閉用）は、押しても画面が移らないので閉じない（issue #705）。
 */
function isNavigationTarget(target: Element | null): boolean {
  const item = target?.closest(NAVIGATE_SELECTOR)
  if (!item) return false
  if (item.hasAttribute("aria-expanded")) return false
  return true
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
 * 9. lg 未満でナビへ辿れるようにするときは `mobileDrawer`（issue #705）。ヘッダー左端の
 *    メニューボタン（44px・aria-expanded）から左の Sheet に同じ `sidebar` を開く。
 *    ハンバーガーと Sheet を consumer で自作しない。
 */
function AdminShell({
  className,
  sidebar,
  header,
  children,
  sidebarWidth = "w-64",
  sidebarTone = "default",
  mainId = "main-content",
  skipLink = true,
  skipLinkLabel,
  mobileDrawer = false,
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
  mobileMenuLabel: mobileMenuLabelProp,
  mobileDrawerTitle: mobileDrawerTitleProp,
  closeMobileDrawerOnNavigate = false,
  safeAreaTop = false,
  overlay = false,
  ...props
}: AdminShellProps) {
  const defaultLabels = useKskLabels()
  const mobileMenuLabel = mobileMenuLabelProp ?? defaultLabels.mobileMenu
  const mobileDrawerTitle = mobileDrawerTitleProp ?? defaultLabels.mobileDrawerTitle
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const drawerOpen = mobileDrawerOpen ?? uncontrolledOpen
  const setDrawerOpen = React.useCallback(
    (open: boolean) => {
      if (mobileDrawerOpen === undefined) setUncontrolledOpen(open)
      onMobileDrawerOpenChange?.(open)
    },
    [mobileDrawerOpen, onMobileDrawerOpenChange]
  )
  const handleDrawerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeMobileDrawerOnNavigate || event.defaultPrevented) return
    if (isNavigationTarget(event.target as Element | null)) setDrawerOpen(false)
  }

  // 開いたまま lg 以上へ広がったら閉じる（lg 以上はドロワーを lg:hidden で隠すため、
  // 開いたままだと見えないモーダルがフォーカスとスクロールを奪う）。SSR では走らない
  React.useEffect(() => {
    if (!mobileDrawer || !drawerOpen) return
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return
    const query = window.matchMedia(DESKTOP_QUERY)
    const closeIfDesktop = () => {
      if (query.matches) setDrawerOpen(false)
    }
    closeIfDesktop()
    query.addEventListener?.("change", closeIfDesktop)
    return () => query.removeEventListener?.("change", closeIfDesktop)
  }, [mobileDrawer, drawerOpen, setDrawerOpen])
  const menuButton = mobileDrawer ? (
    <Button
      variant="ghost"
      size="icon-xl"
      className="-ml-2 shrink-0 lg:hidden"
      aria-label={mobileMenuLabel}
      aria-expanded={drawerOpen}
      aria-haspopup="dialog"
      data-slot="admin-mobile-menu-button"
      onClick={() => setDrawerOpen(true)}
    >
      <HamburgerMenu size={20} aria-hidden="true" />
    </Button>
  ) : null

  return (
    <div
      data-slot="admin-shell"
      data-overlay={overlay ? "" : undefined}
      className={cn(
        "flex bg-[var(--Surface-Secondary)]",
        overlay ? "fixed inset-0 z-[var(--Z-Overlay)] h-full" : "h-screen",
        className
      )}
      {...props}
    >
      {/* skipLinkLabel 未指定は KskLabelsProvider の既定（issue #723）。null / "" は従来どおり出さない */}
      {skipLink && skipLinkLabel !== null && skipLinkLabel !== "" && (
        <SkipLink targetId={mainId} label={skipLinkLabel} />
      )}
      <aside
        data-slot="admin-sidebar"
        data-tone={sidebarTone}
        className={cn(
          sidebarTone === "inverse"
            ? "hidden lg:flex flex-col border-r border-[var(--Surface-Inverse)] bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)]"
            : "hidden lg:flex flex-col border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
          safeAreaTop && "pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]",
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
      {mobileDrawer && (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent
            side="left"
            swipeToClose
            padding={false}
            // data-slot は SheetContent が sheet-content で固定する（#339）ため、識別は別属性
            data-admin-mobile-drawer=""
            data-tone={sidebarTone}
            onClick={handleDrawerClick}
            className={cn(
              "flex w-72 max-w-[85vw] flex-col overflow-y-auto lg:hidden",
              // ドロワーも画面の上端から出るので、同じだけ安全領域を空ける
              safeAreaTop && "pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]",
              sidebarTone === "inverse"
                ? "border-r-0 bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)]"
                : "bg-[var(--Surface-Primary)]"
            )}
          >
            <SheetTitle className="sr-only">{mobileDrawerTitle}</SheetTitle>
            {/* desktop の aside と同じく slot 直下を flex grow flex-col で受ける（フッターの mt-auto が効く） */}
            <div className="flex min-h-full grow flex-col">{sidebar}</div>
          </SheetContent>
        </Sheet>
      )}
      <div
        className={cn(
          "flex flex-1 flex-col min-w-0",
          // header が無い画面は本文の列の上に、lg 以上だけ header が無い（mobileDrawer だけ）画面は lg 以上で足す
          safeAreaTop && !header && !mobileDrawer && "pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]",
          safeAreaTop && !header && mobileDrawer && "lg:pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]"
        )}
      >
        {(header || mobileDrawer) && (
          <header
            data-slot="admin-header"
            className={cn(
              "h-16 shrink-0 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
              // 高さは従来の 64px（下線込み）+ 安全領域。安全領域は padding で空ける（帯もヘッダーの面の色）
              safeAreaTop &&
                "h-[calc(4rem_+_var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px)))] pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]",
              // header を渡していないときは、メニューボタンのための lg 未満だけのヘッダー
              !header && "lg:hidden"
            )}
          >
            <Container size="fluid" className="flex h-full items-center gap-4">
              {menuButton}
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
