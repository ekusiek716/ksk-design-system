/**
 * @file Pagination のストーリー
 * @description ページ番号を一覧表示する「番号リスト型」ページネーション
 *   （`1 2 3 … 10` を並べて任意ページへ直接ジャンプ）。compose 可能な低レベル
 *   プリミティブ群。
 *
 *   前/次ボタン + 件数カウンタだけのシンプルな形（`3 / 10 ページ`,
 *   `21-40 / 689 件`）が欲しい場合は **SimplePagination**（Patterns）を使う。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "./pagination"
import { buildPageItems } from "@/lib/build-page-items"

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
}
export default meta

type Story = StoryObj<typeof Pagination>

export const FivePages: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const WithEllipsis: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">6</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * `buildPageItems` で「1 … 4 5 6 … 20」のようなページ番号 + 省略記号の並びを組み立てる
 * （issue #357）。畳み方（先頭・末尾は常に表示 / 現在ページの前後を siblingCount 個）は
 * DS 側で決まるので、消費側はページ番号の描画だけを書けばよい。
 *
 * ページ遷移を伴わず画面内の状態だけを切り替えるため `as="button"` を使う。
 */
export const WithBuildPageItems: Story = {
  render: function Render() {
    const pageCount = 20
    const [page, setPage] = useState(6)
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              as="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            />
          </PaginationItem>
          {buildPageItems(page, pageCount).map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  as="button"
                  isActive={item === page}
                  onClick={() => setPage(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              as="button"
              disabled={page === pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
}
