import * as React from "react"
import { cn } from "@/lib/utils"
import { CloseCircle, TickCircle } from "iconsax-reactjs"
import { useKskLabels } from "../ui/ksk-labels"

type ShareProvider = "line" | "x" | "facebook" | "copy" | "instagram" | "email" | "whatsapp" | "telegram"
type ShareLayout = "circle" | "inline" | "block"
type ShareRegion = "global" | "jp" | "us"
type ShareCopyResult = "success" | "error"

interface ShareButtonsProps {
  url: string
  title?: string
  /**
   * 共有する本文（issue #685・native ShareButtons と同名）。招待コード入りの案内文など。
   * 指定時は LINE（line.me/R/share?text=）・WhatsApp・メール本文に「message + url」を、
   * X・Telegram の text に message を渡す。Web Share（Instagram）にも text として渡す。
   * copy は従来どおり url をコピーする。未指定時は従来どおり title を使う。
   */
  message?: string
  /**
   * 表示ラベルの上書き（issue #685）。`layout="block"` の「LINE で招待を送る」のような
   * 主ボタンの文言や i18n に使う。ボタンのアクセシブルネームも同じ文言になる。
   */
  labels?: Partial<Record<ShareProvider, string>>
  providers?: ShareProvider[]
  region?: ShareRegion
  layout?: ShareLayout
  className?: string
  onShare?: (provider: ShareProvider) => void
  onCopy?: (result: ShareCopyResult) => void
  /** コピー成功の文言。省略時は KskLabelsProvider の `shareCopied`（Provider 無しは "コピーしました"。locale="en" で "Copied"） */
  copiedLabel?: string
  /** コピー失敗の文言。省略時は KskLabelsProvider の `shareCopyError`（Provider 無しは "コピーできませんでした"） */
  copyErrorLabel?: string
  feedbackDuration?: number
  /** 全体を囲む role="group" の aria-label。省略時は KskLabelsProvider の `share`（Provider 無しは "シェア"） */
  groupLabel?: string
}

const REGION_PROVIDERS: Record<ShareRegion, ShareProvider[]> = {
  global: ["line", "x", "facebook", "copy"],
  jp: ["line", "x", "copy"],
  us: ["whatsapp", "x", "copy"],
}

function shareText(url: string, title?: string) {
  return title ? `${title} ${url}` : url
}

/** message 指定時の本文（native ShareButtons と同じく message と url を空白でつなぐ） */
function messageText(url: string, message: string) {
  return `${message} ${url}`
}

const PROVIDER_META: Record<
  ShareProvider,
  {
    label: string
    buildUrl?: (url: string, title?: string, message?: string) => string
    webShare?: boolean
    icon: React.ReactNode
    circleClass: string
    inlineClass: string
    /**
     * layout="block"（全幅・大サイズの主ボタン）の色（issue #685）。未指定のサービスは inline と同じ
     * 枠線スタイルを全幅で使う。塗りは文字との AA を満たすトークンの組だけにする。
     */
    blockClass?: string
  }
> = {
  line: {
    label: "LINE",
    buildUrl: (url, title, message) =>
      message
        ? `https://line.me/R/share?text=${encodeURIComponent(messageText(url, message))}`
        : `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}${title ? `&text=${encodeURIComponent(title)}` : ""}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2C6.6 2 3 5 3 8.8c0 3.3 2.7 6.1 6.5 6.7l.9 1.9 3.1-1.9c3.8-.4 6.5-3.1 6.5-6.7C20 5 16.4 2 11 2z" fill="currentColor" />
      </svg>
    ),
    circleClass: "bg-[var(--Brand-Line)] text-[var(--Text-on-Media)]",
    // 白文字は #06C755 上で約 2.2:1 と AA 未達のため、前景は --Brand-on-Line（黒）。hover / 押下も公式色の段階トークン
    blockClass: "border border-[var(--Brand-Line)] bg-[var(--Brand-Line)] text-[var(--Brand-on-Line)] hover:border-[var(--Brand-Line-Hover)] hover:bg-[var(--Brand-Line-Hover)] active:border-[var(--Brand-Line-Pressed)] active:bg-[var(--Brand-Line-Pressed)]",
    // ラベル文字に --Brand-Line(#06C755) を使うと白背景で 2.25:1 と AA 未達。
    // 文字は Text-Success(緑700系)、アイコンだけ公式色を維持する。
    inlineClass: "border-[var(--Brand-Line)] text-[var(--Text-Success)] [&_svg]:text-[var(--Brand-Line)] hover:bg-[var(--Surface-Success-Subtle)]",
  },
  x: {
    label: "X",
    buildUrl: (url, title, message) => {
      const text = message ?? title
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}${text ? `&text=${encodeURIComponent(text)}` : ""}`
    },
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
        <path d="M14.2 1h2.5L10.8 7.8 17.5 17h-5.3l-3.9-5.1L4 17H1.5l6.3-7.2L1 1h5.4l3.5 4.6L14.2 1zm-.9 14.3h1.4L5.7 2.4H4.2l9.1 12.9z" />
      </svg>
    ),
    circleClass: "bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)]",
    inlineClass: "border-[var(--Border-High-Emphasis)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]",
    blockClass: "border border-[var(--Surface-Inverse)] bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)] hover:opacity-90",
  },
  facebook: {
    label: "Facebook",
    buildUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M20 10C20 4.5 15.5 0 10 0S0 4.5 0 10c0 5 3.7 9.1 8.4 9.9v-7H5.9V10h2.5V7.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.5V10h2.8l-.4 2.9h-2.3v7C16.3 19.1 20 15 20 10z" />
      </svg>
    ),
    circleClass: "bg-[var(--Info-Base)] text-[var(--Text-on-Media)]",
    inlineClass: "border-[var(--Info-Base)] text-[var(--Text-Info)] hover:bg-[var(--Surface-Info-Subtle)]",
  },
  instagram: {
    label: "Instagram",
    webShare: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="14.3" cy="5.8" r="1" fill="currentColor" />
      </svg>
    ),
    circleClass: "bg-[var(--Categorical-9)] text-[var(--Text-on-Media)]",
    inlineClass: "border-[var(--Categorical-9)] text-[var(--Categorical-9-Bold)] hover:bg-[var(--Categorical-9-Subtle)]",
  },
  email: {
    label: "メール",
    buildUrl: (url, title, message) =>
      `mailto:?subject=${encodeURIComponent(title ?? "")}&body=${encodeURIComponent(message ? messageText(url, message) : shareText(url, title))}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 6l6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    circleClass: "bg-[var(--Surface-Tertiary)] text-[var(--Object-Medium-Emphasis)]",
    inlineClass: "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]",
  },
  whatsapp: {
    label: "WhatsApp",
    buildUrl: (url, title, message) =>
      `https://wa.me/?text=${encodeURIComponent(message ? messageText(url, message) : shareText(url, title))}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4.1 15.9l.8-2.9a7 7 0 111.9 2l-2.7.9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7.8 6.9c.2-.4.3-.4.6-.4h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2.1.3 0 .5l-.4.5c-.1.1-.2.2-.1.4.4.8 1 1.5 1.8 1.9.2.1.3.1.5-.1l.5-.6c.1-.2.3-.2.5-.1l1.4.7c.2.1.3.2.3.4 0 .5-.3 1.3-.9 1.5-.6.2-1.8.1-3.1-.7-1.5-.8-2.7-2-3.4-3.4-.7-1.3-.7-2.1-.5-2.6z" fill="currentColor" />
      </svg>
    ),
    circleClass: "bg-[var(--Success-Base)] text-[var(--Text-on-Media)]",
    inlineClass: "border-[var(--Success-Base)] text-[var(--Text-Success)] hover:bg-[var(--Surface-Success-Subtle)]",
  },
  telegram: {
    label: "Telegram",
    buildUrl: (url, title, message) => {
      const text = message ?? title
      return `https://t.me/share/url?url=${encodeURIComponent(url)}${text ? `&text=${encodeURIComponent(text)}` : ""}`
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M17.3 3.2L2.7 8.8c-1 .4-1 1-.2 1.3l3.7 1.2 1.4 4.2c.2.6.4.8.8.8s.6-.2.9-.5l2-2 4.1 3c.8.4 1.3.2 1.5-.7l2.6-12.2c.2-1-.4-1.4-1.2-1zM7 10.9l8.1-5.1c.4-.2.7-.1.4.2l-6.9 6.2-.3 2.7L7 10.9z" />
      </svg>
    ),
    circleClass: "bg-[var(--Categorical-2)] text-[var(--Text-on-Media)]",
    inlineClass: "border-[var(--Categorical-2)] text-[var(--Categorical-2-Bold)] hover:bg-[var(--Categorical-2-Subtle)]",
  },
  copy: {
    label: "リンク",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M8.5 11.5a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.7 1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11.5 8.5a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.7-1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    circleClass: "bg-[var(--Surface-Tertiary)] text-[var(--Object-Medium-Emphasis)]",
    inlineClass: "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]",
  },
}

function ShareButtons({
  url,
  title,
  message,
  labels,
  providers,
  region = "global",
  layout = "circle",
  className,
  onShare,
  onCopy,
  copiedLabel: copiedLabelProp,
  copyErrorLabel: copyErrorLabelProp,
  feedbackDuration = 2000,
  groupLabel: groupLabelProp,
}: ShareButtonsProps) {
  const defaultLabels = useKskLabels()
  const copiedLabel = copiedLabelProp ?? defaultLabels.shareCopied
  const copyErrorLabel = copyErrorLabelProp ?? defaultLabels.shareCopyError
  const groupLabel = groupLabelProp ?? defaultLabels.share
  const defaultProviderLabel = (p: ShareProvider, fallback: string) =>
    p === "email" ? defaultLabels.shareEmail : p === "copy" ? defaultLabels.shareLink : fallback
  const [copyFeedback, setCopyFeedback] = React.useState<{
    provider: ShareProvider
    result: ShareCopyResult
  } | null>(null)
  const feedbackTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyRequestRef = React.useRef(0)
  const activeProviders = providers ?? REGION_PROVIDERS[region]

  React.useEffect(() => {
    return () => {
      copyRequestRef.current += 1
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    }
  }, [])

  const markCopyResult = (provider: ShareProvider, result: ShareCopyResult) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    setCopyFeedback({ provider, result })
    feedbackTimerRef.current = setTimeout(() => {
      setCopyFeedback(null)
      feedbackTimerRef.current = null
    }, feedbackDuration)
  }

  const copyUrl = async (provider: ShareProvider) => {
    const request = ++copyRequestRef.current
    let result: ShareCopyResult = "success"
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is unavailable")
      }
      await navigator.clipboard.writeText(url)
      // Only clipboard failures belong to the error result.
    } catch {
      result = "error"
    }
    if (request === copyRequestRef.current) markCopyResult(provider, result)
    // Analytics receives every completed attempt; only visual feedback is latest-only.
    onCopy?.(result)
  }

  const handleClick = async (provider: ShareProvider) => {
    onShare?.(provider)

    if (provider === "copy") {
      await copyUrl(provider)
      return
    }
    const meta = PROVIDER_META[provider]
    if (meta.webShare && typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(message ? { title, text: message, url } : { title, url })
      } catch {
        // ユーザーのキャンセルを含むため、コピー成功/失敗には変換しない。
      }
      return
    }
    if (meta.webShare) {
      await copyUrl(provider)
      return
    }
    if (meta.buildUrl) {
      window.open(meta.buildUrl(url, title, message), "_blank", "noopener,noreferrer,width=600,height=500")
    }
  }

  if (layout === "circle") {
    return (
      <div
        data-slot="share-buttons"
        data-layout="circle"
        className={cn("flex items-center gap-4", className)}
        role="group"
        aria-label={groupLabel}
        data-region={region}
      >
        {activeProviders.map((p) => {
          const meta = PROVIDER_META[p]
          const feedback = copyFeedback?.provider === p ? copyFeedback.result : null
          const label = labels?.[p] ?? defaultProviderLabel(p, meta.label)
          const feedbackLabel =
            feedback === "success" ? copiedLabel : feedback === "error" ? copyErrorLabel : label
          return (
            <button
              key={p}
              type="button"
              onClick={() => void handleClick(p)}
              aria-label={label}
              className="flex min-h-11 shrink-0 flex-col items-center gap-2 rounded-lg cursor-pointer focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50"
            >
              <span className={cn(
                "size-12 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95",
                meta.circleClass
              )}>
                {feedback === "success" && <TickCircle size={18} aria-hidden="true" />}
                {feedback === "error" && <CloseCircle size={18} aria-hidden="true" />}
                {!feedback && meta.icon}
              </span>
              <span
                aria-live="polite"
                aria-atomic="true"
                className="typo-label-xs text-[var(--Text-Medium-Emphasis)]"
              >
                {feedbackLabel}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  // block layout（issue #685）: 1 つ（または少数）のサービスを全幅・大サイズの主ボタンとして縦に積む。
  // 招待シートの「LINE で送る」のように共有そのものが画面の主操作のときに使う。
  if (layout === "block") {
    return (
      <div
        data-slot="share-buttons"
        data-layout="block"
        className={cn("flex w-full flex-col gap-3", className)}
        role="group"
        aria-label={groupLabel}
        data-region={region}
      >
        {activeProviders.map((p) => {
          const meta = PROVIDER_META[p]
          const feedback = copyFeedback?.provider === p ? copyFeedback.result : null
          const label = labels?.[p] ?? defaultProviderLabel(p, meta.label)
          const feedbackLabel =
            feedback === "success" ? copiedLabel : feedback === "error" ? copyErrorLabel : label
          return (
            <button
              key={p}
              type="button"
              data-provider={p}
              onClick={() => void handleClick(p)}
              aria-label={label}
              className={cn(
                "inline-flex h-[var(--Control-Height-Lg)] w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--Control-Radius)] px-[var(--Control-Padding-X-Lg)] typo-label-lg",
                "transition-colors duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)] active:scale-[0.98]",
                "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
                meta.blockClass ?? cn("border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]", meta.inlineClass)
              )}
            >
              <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-full">
                {feedback === "success" && <TickCircle size={20} aria-hidden="true" />}
                {feedback === "error" && <CloseCircle size={20} aria-hidden="true" />}
                {!feedback && meta.icon}
              </span>
              <span>{feedbackLabel}</span>
            </button>
          )
        })}
        {/* コピー結果はボタンの外の status 領域で読み上げる（ボタン名は labels の固定値のため、
            名前の変化では結果が伝わらない） */}
        <span role="status" data-slot="share-buttons-status" className="sr-only">
          {copyFeedback ? (copyFeedback.result === "success" ? copiedLabel : copyErrorLabel) : ""}
        </span>
      </div>
    )
  }

  // inline layout
  return (
    <div
      data-slot="share-buttons"
      data-layout="inline"
      className={cn("flex items-center gap-2 flex-wrap", className)}
      role="group"
      aria-label={groupLabel}
      data-region={region}
    >
      {activeProviders.map((p) => {
        const meta = PROVIDER_META[p]
        const feedback = copyFeedback?.provider === p ? copyFeedback.result : null
        const label = labels?.[p] ?? defaultProviderLabel(p, meta.label)
        const feedbackLabel =
          feedback === "success" ? copiedLabel : feedback === "error" ? copyErrorLabel : label
        return (
          <button
            key={p}
            type="button"
            onClick={() => void handleClick(p)}
            aria-label={label}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 px-3 py-2 rounded-full border border-[var(--Border-Medium-Emphasis)] typo-label-xs transition-colors focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
              meta.inlineClass
            )}
          >
            <span className="size-4 flex items-center justify-center [&>svg]:size-full">
              {feedback === "success" && <TickCircle size={16} aria-hidden="true" />}
              {feedback === "error" && <CloseCircle size={16} aria-hidden="true" />}
              {!feedback && meta.icon}
            </span>
            <span aria-live="polite" aria-atomic="true">
              {feedbackLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { ShareButtons }
export type { ShareButtonsProps, ShareProvider, ShareLayout, ShareRegion, ShareCopyResult }
