import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { BreadcrumbLink } from "../src/components/ui/breadcrumb"
import { PaginationLink, PaginationNext, PaginationPrevious } from "../src/components/ui/pagination"
import { SidebarNav, type SidebarNavItem } from "../src/components/patterns/sidebar-nav"

/**
 * ナビ系リンク部品を、フレームワークのリンク部品（next/link 等）へ差し替えられること。
 *
 * - 単体リンク（BreadcrumbLink / PaginationLink / PaginationPrevious・Next）は Button と同じ
 *   `asChild`（Radix Slot）。
 * - 配列で項目を受ける SidebarNav は Footer / AppHeader と同じ項目ごとの `render` スロット。
 * - どちらも未指定なら DOM・クラスは従来と同一。
 *
 * 実際の Link の代わりに、`RouterLink`（props をそのまま <a> へ流すスタブ）を使う。
 */
const RouterLink = ({ to, children, ...rest }: React.ComponentProps<"a"> & { to: string }) => (
  <a data-router="1" {...rest} href={`/app${to}`}>
    {children}
  </a>
)

describe("BreadcrumbLink asChild", () => {
  it("未指定は従来どおり <a> を描画する", () => {
    const html = renderToStaticMarkup(<BreadcrumbLink href="/x">ホーム</BreadcrumbLink>)
    expect(html).toBe(
      '<a data-slot="breadcrumb-link" class="hover:text-[var(--Text-High-Emphasis)] transition-colors" href="/x">ホーム</a>'
    )
  })

  it("asChild は子へ className と data-slot を渡し、<a> を二重にしない", () => {
    const html = renderToStaticMarkup(
      <BreadcrumbLink asChild>
        <RouterLink to="/x">ホーム</RouterLink>
      </BreadcrumbLink>
    )
    expect(html.match(/<a /g)).toHaveLength(1)
    expect(html).toContain('data-router="1"')
    expect(html).toContain('href="/app/x"')
    expect(html).toContain('data-slot="breadcrumb-link"')
    expect(html).toContain("hover:text-[var(--Text-High-Emphasis)]")
  })
})

describe("PaginationLink asChild", () => {
  it("未指定（as=a）の出力は従来どおり", () => {
    const html = renderToStaticMarkup(<PaginationLink href="/p/2">2</PaginationLink>)
    expect(html).toContain('<a href="/p/2"')
    expect(html).toContain('data-slot="pagination-link"')
  })

  it("asChild は子の要素に見た目と aria-current を渡す", () => {
    const html = renderToStaticMarkup(
      <PaginationLink asChild isActive>
        <RouterLink to="/p/2">2</RouterLink>
      </PaginationLink>
    )
    expect(html.match(/<a /g)).toHaveLength(1)
    expect(html).toContain('data-router="1"')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('data-slot="pagination-link"')
    // buttonVariants の見た目（active = default variant）が子へ載る
    expect(html).toContain("inline-flex")
  })

  it("asChild + disabled は aria-disabled / tabIndex=-1 / pointer-events-none を付ける", () => {
    const html = renderToStaticMarkup(
      <PaginationLink asChild disabled>
        <RouterLink to="/p/0">0</RouterLink>
      </PaginationLink>
    )
    expect(html).toContain('aria-disabled="true"')
    expect(html).toContain('tabindex="-1"')
    expect(html).toContain("pointer-events-none")
  })

  it("PaginationNext / Previous の asChild は子のラベルとアイコンを子の中へ入れ直す", () => {
    const next = renderToStaticMarkup(
      <PaginationNext asChild label="次へ">
        <RouterLink to="/p/3">次のページ</RouterLink>
      </PaginationNext>
    )
    expect(next.match(/<a /g)).toHaveLength(1)
    expect(next).toContain('aria-label="次へ"')
    expect(next).toContain("<span>次のページ</span>")
    expect(next).toContain("<svg")

    const prev = renderToStaticMarkup(
      <PaginationPrevious asChild>
        <RouterLink to="/p/1" />
      </PaginationPrevious>
    )
    // 子が children を持たないときは label（既定「前へ」）を使う
    expect(prev).toContain("<span>前へ</span>")
    expect(prev.indexOf("<svg")).toBeLessThan(prev.indexOf("<span>"))
  })

  it("PaginationNext / Previous の既定描画（asChild なし）は変わらない", () => {
    const html = renderToStaticMarkup(<PaginationNext href="/p/3" />)
    expect(html).toContain("<span>次へ</span>")
    expect(html).toContain('href="/p/3"')
    expect(html.match(/<a /g)).toHaveLength(1)
  })
})

describe("SidebarNav item.render", () => {
  const base: SidebarNavItem[] = [
    { label: "ホーム", href: "/home", isActive: true, tabKey: "home" },
    { label: "タスク", href: "/tasks", badgeCount: 3 },
  ]

  it("render 未指定の DOM は従来どおり（<a> / <button>）", () => {
    const html = renderToStaticMarkup(
      <SidebarNav items={[...base, { label: "設定", onClick: () => {} }]} />
    )
    expect(html).toContain('<a data-slot="sidebar-nav-item"')
    expect(html).toMatch(/<button data-slot="sidebar-nav-item"[^>]*type="button"/)
  })

  it("render を指定した項目だけ差し替わり、className・aria・data が渡る", () => {
    const items: SidebarNavItem[] = [
      {
        ...base[0],
        render: (p) => (
          <RouterLink to={p.href!} {...p}>
            {p.children}
          </RouterLink>
        ),
      },
      base[1],
    ]
    const html = renderToStaticMarkup(<SidebarNav items={items} />)
    expect(html.match(/data-router="1"/g)).toHaveLength(1)
    // 渡された href が子の to に使われる
    expect(html).toContain('href="/app/home"')
    // 差し替えた項目にも現在地・アンカー・見た目が載る
    const first = html.slice(html.indexOf("<a "), html.indexOf("</a>"))
    expect(first).toContain('aria-current="page"')
    expect(first).toContain('data-tab-key="home"')
    expect(first).toContain("min-h-11")
    expect(first).toContain('data-slot="sidebar-nav-item"')
    // 中身（ラベル）も渡る
    expect(first).toContain("ホーム")
    // 差し替えていない項目は通常の <a>
    expect(html).toContain('href="/tasks"')
  })

  it("render の children は collapsed でも icon / ラベルの構成を保つ", () => {
    const html = renderToStaticMarkup(
      <SidebarNav
        collapsed
        items={[
          {
            label: "ホーム",
            href: "/home",
            icon: <svg data-icon="home" />,
            render: (p) => <RouterLink to={p.href!} {...p}>{p.children}</RouterLink>,
          },
        ]}
      />
    )
    expect(html).toContain('aria-label="ホーム"')
    expect(html).toContain('title="ホーム"')
    expect(html).toContain('data-icon="home"')
    expect(html).not.toContain('data-slot="sidebar-nav-item-label"')
  })
})
