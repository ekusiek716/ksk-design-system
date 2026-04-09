import * as React from "react"
import { cn } from "@/lib/utils"

interface NotificationItem {
  id: string
  message: string
  date: string
  isUnread?: boolean
  href?: string
}

interface NotificationListProps extends React.ComponentProps<"div"> {
  notifications: NotificationItem[]
  variant?: "vertical" | "horizontal"
  emptyMessage?: string
}

function NotificationList({ notifications, variant = "vertical", emptyMessage = "新着のお知らせはありません", className, ...props }: NotificationListProps) {
  /* 通知が空の場合の表示 */
  if (notifications.length === 0) {
    return (
      <div data-slot="notification-list" className={cn("flex flex-col items-center justify-center gap-3 py-12", className)} {...props}>
        {/* ベルアイコン */}
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--Text-Low-Emphasis)]">
          <path d="M24 4C17.4 4 12 9.4 12 16v8l-4 4v2h32v-2l-4-4v-8c0-6.6-5.4-12-12-12zM20 34c0 2.2 1.8 4 4 4s4-1.8 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="typo-body-sm text-[var(--Text-Low-Emphasis)]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div data-slot="notification-list" className={cn("w-full divide-y divide-[var(--Border-Low-Emphasis)]", className)} {...props}>
      {notifications.map((item) => {
        const Tag = item.href ? "a" : "div"
        const tagProps = item.href ? { href: item.href } : {}
        return variant === "horizontal" ? (
          /* 横並びレイアウト（管理画面向け） */
          <Tag key={item.id} {...tagProps} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--Surface-Secondary)]">
            <span className="typo-body-sm text-[var(--Text-Low-Emphasis)] shrink-0 w-[88px]">{item.date}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {item.isUnread && <span className="inline-flex w-fit items-center rounded-full bg-[var(--Caution-Base)] px-1.5 py-0.5 typo-label-xs text-[var(--Text-on-Inverse)]">NEW</span>}
              <span className="typo-body-md text-[var(--Text-High-Emphasis)] truncate">{item.message}</span>
            </div>
            {/* 矢印アイコン */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--Text-Low-Emphasis)] shrink-0"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Tag>
        ) : (
          /* 縦並びレイアウト（フロント向け） */
          <Tag key={item.id} {...tagProps} className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--Surface-Secondary)]">
            <div className="flex shrink-0 items-center pt-1.5">
              {item.isUnread ? <span className="size-2 rounded-full bg-[var(--Brand-Primary)]" /> : <span className="size-2" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="typo-body-md text-[var(--Text-High-Emphasis)]">{item.message}</p>
              <p className="mt-0.5 typo-body-sm text-[var(--Text-Low-Emphasis)]">{item.date}</p>
            </div>
          </Tag>
        )
      })}
    </div>
  )
}

export { NotificationList }
export type { NotificationItem }
