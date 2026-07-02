import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PresenceIndicatorProps {
  /** 表示名。イニシャル（先頭1文字）が Avatar フォールバックに使われる */
  name: string
  /** 名前の下に表示する補足テキスト（例: "編集中" "〇〇を閲覧中"） */
  statusText?: string
  /** 指定時、右側に Badge（variant="success"）を表示する */
  badgeLabel?: string
  /** ステータスドットの色。true: --Object-Success / false: 中立色（既定 true） */
  online?: boolean
  className?: string
}

function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed.slice(0, 1).toUpperCase() : "?"
}

/**
 * PresenceIndicator — 「誰か（何か）が今いる/見ている」ことを示す汎用インジケーター。
 *
 * belle-todo の PartnerPresenceIndicator を汎用化。Supabase realtime・
 * タブラベル辞書・i18n・420px 未満の自動非表示は持ち込まず、表示に必要な
 * 値（name/statusText/badgeLabel/online）のみを props で受ける。
 * null ガード（presence オブジェクト全体を受けて null なら非描画）もやめ、
 * 呼び出し側が条件付きレンダリングするかどうかを判断する。
 */
function PresenceIndicator({ name, statusText, badgeLabel, online = true, className }: PresenceIndicatorProps) {
  return (
    <div
      data-slot="presence-indicator"
      role="status"
      aria-label={statusText ? `${name}: ${statusText}` : name}
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-2 py-1 shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <div className="relative">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="typo-label-sm bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]">
            {getInitial(name)}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-[var(--Surface-Primary)]",
            online ? "bg-[var(--Object-Success)]" : "bg-[var(--Object-Low-Emphasis)]"
          )}
          aria-hidden
        />
      </div>
      {statusText && (
        <span className="max-w-24 truncate typo-caption text-[var(--Text-Medium-Emphasis)]">{statusText}</span>
      )}
      {badgeLabel && <Badge variant="success">{badgeLabel}</Badge>}
    </div>
  )
}

export { PresenceIndicator }
export type { PresenceIndicatorProps }
