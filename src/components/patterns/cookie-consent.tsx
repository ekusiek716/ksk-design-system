import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DEFAULT_STORAGE_KEY = "ksk-cookie-consent"
const DEFAULT_EVENT_NAME = "ksk:cookie-decided"

export type CookieConsentChoice = "accept" | "essential"

export interface CookieConsentProps {
  /**
   * 表示文言。i18n はアプリ側で解決して string で渡す。
   * 未指定キーは英語デフォルトを使う。
   */
  labels?: {
    title?: string
    description?: string
    /** "必要なもののみ" ボタン */
    essentialOnly?: string
    /** "了解" / "すべて受け入れる" ボタン */
    accept?: string
    /** aria-label */
    ariaLabel?: string
  }
  /** 表示前の遅延 (ms)。レイアウトシフト回避用。既定 1500ms */
  showDelay?: number
  /** localStorage キー名（マルチアプリの衝突回避に） */
  storageKey?: string
  /** 同意決定時に dispatch する CustomEvent 名 */
  eventName?: string
  /** 装飾アイコン（既定: 🍪） */
  icon?: React.ReactNode
  /** 同意決定時のコールバック */
  onDecide?: (choice: CookieConsentChoice) => void
  className?: string
}

const DEFAULT_LABELS = {
  title: "Cookies",
  description:
    "This site uses cookies for analytics and feature improvement. You can choose essential-only or accept all.",
  essentialOnly: "Essential only",
  accept: "Accept",
  ariaLabel: "Cookie consent",
} as const

/** 同意済かどうかを判定（SSR セーフ） */
export function isCookieDecided(storageKey: string = DEFAULT_STORAGE_KEY): boolean {
  if (typeof window === "undefined") return true
  try {
    return !!localStorage.getItem(storageKey)
  } catch {
    return true
  }
}

function safeGet(key: string): string | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value)
  } catch {
    /* noop */
  }
}

/**
 * CookieConsent — GDPR / APPI 準拠の汎用クッキー同意バナー。
 *
 * 動作:
 *  - 未決定なら `showDelay` 後に画面下に表示
 *  - 「必要なもののみ」「了解」の 2 択。どちらでも localStorage に記録
 *  - 決定時に `CustomEvent(eventName)` を window に dispatch
 *    （CoachMark 等、同意後に出すべき UI が listen できる）
 *
 * 文言は labels prop で完全に上書き可能。i18n はアプリ側で解決して渡す。
 *
 * ### 使用例
 * ```tsx
 * import { CookieConsent, isCookieDecided } from "ksk-design-system"
 * import { t } from "./i18n"
 *
 * <CookieConsent
 *   labels={{
 *     title: t("cookie.title"),
 *     description: t("cookie.desc"),
 *     essentialOnly: t("cookie.essential_only"),
 *     accept: t("cookie.accept"),
 *     ariaLabel: t("cookie.aria_label"),
 *   }}
 *   storageKey="myapp-cookie-consent"
 *   eventName="myapp:cookie-decided"
 *   onDecide={(choice) => analytics.track("cookie_consent", { choice })}
 * />
 * ```
 */
export function CookieConsent({
  labels,
  showDelay = 1500,
  storageKey = DEFAULT_STORAGE_KEY,
  eventName = DEFAULT_EVENT_NAME,
  icon = <span aria-hidden="true" className="text-xl flex-shrink-0">🍪</span>,
  onDecide,
  className,
}: CookieConsentProps) {
  const [visible, setVisible] = React.useState(false)
  const resolved = { ...DEFAULT_LABELS, ...labels }

  React.useEffect(() => {
    const decided = safeGet(storageKey)
    if (!decided) {
      const timer = setTimeout(() => setVisible(true), showDelay)
      return () => clearTimeout(timer)
    }
  }, [storageKey, showDelay])

  const decide = (choice: CookieConsentChoice) => {
    safeSet(storageKey, choice)
    safeSet(`${storageKey}-at`, new Date().toISOString())
    setVisible(false)
    onDecide?.(choice)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(eventName, { detail: { choice } }))
    }
  }

  if (!visible) return null

  return (
    <div
      data-slot="cookie-consent"
      role="dialog"
      aria-modal="false"
      aria-label={resolved.ariaLabel}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="max-w-2xl mx-auto bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] rounded-2xl p-4 shadow-[var(--shadow-dialog)]">
        <div className="flex items-start gap-3 mb-3">
          {icon}
          <div className="flex-1">
            <p className="typo-heading-sm text-[var(--Text-High-Emphasis)] mb-1">{resolved.title}</p>
            <p className="typo-body-xs text-[var(--Text-Medium-Emphasis)] leading-relaxed">
              {resolved.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => decide("essential")}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            {resolved.essentialOnly}
          </Button>
          <Button
            onClick={() => decide("accept")}
            variant="default"
            size="lg"
            className="flex-1"
          >
            {resolved.accept}
          </Button>
        </div>
      </div>
    </div>
  )
}
