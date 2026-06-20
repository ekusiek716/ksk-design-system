import * as React from "react"
import { cn } from "@/lib/utils"

type ShareProvider = "line" | "x" | "facebook" | "copy" | "instagram" | "email" | "whatsapp" | "telegram"
type ShareLayout = "circle" | "inline"
type ShareRegion = "global" | "jp" | "us"

interface ShareButtonsProps {
  url: string
  title?: string
  providers?: ShareProvider[]
  region?: ShareRegion
  layout?: ShareLayout
  className?: string
  onShare?: (provider: ShareProvider) => void
  onCopy?: () => void
}

const REGION_PROVIDERS: Record<ShareRegion, ShareProvider[]> = {
  global: ["line", "x", "facebook", "copy"],
  jp: ["line", "x", "copy"],
  us: ["whatsapp", "x", "copy"],
}

function shareText(url: string, title?: string) {
  return title ? `${title} ${url}` : url
}

const PROVIDER_META: Record<
  ShareProvider,
  {
    label: string
    buildUrl?: (url: string, title?: string) => string
    webShare?: boolean
    icon: React.ReactNode
    circleClass: string
    inlineClass: string
  }
> = {
  line: {
    label: "LINE",
    buildUrl: (url, title) =>
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}${title ? `&text=${encodeURIComponent(title)}` : ""}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2C6.6 2 3 5 3 8.8c0 3.3 2.7 6.1 6.5 6.7l.9 1.9 3.1-1.9c3.8-.4 6.5-3.1 6.5-6.7C20 5 16.4 2 11 2z" fill="currentColor" />
      </svg>
    ),
    // SNS 公式色は固定値のため、文字も静的白（--Text-on-Inverse はダークで反転するため不可）
    circleClass: "bg-[#06C755] text-white",
    inlineClass: "border-[#06C755] text-[#06C755] hover:bg-[#F0FFF4]",
  },
  x: {
    label: "X",
    buildUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}${title ? `&text=${encodeURIComponent(title)}` : ""}`,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
        <path d="M14.2 1h2.5L10.8 7.8 17.5 17h-5.3l-3.9-5.1L4 17H1.5l6.3-7.2L1 1h5.4l3.5 4.6L14.2 1zm-.9 14.3h1.4L5.7 2.4H4.2l9.1 12.9z" />
      </svg>
    ),
    circleClass: "bg-[#000] text-white",
    inlineClass: "border-[#000] text-[#000] hover:bg-gray-50",
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
    circleClass: "bg-[#1877F2] text-white",
    inlineClass: "border-[#1877F2] text-[#1877F2] hover:bg-blue-50",
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
    circleClass: "bg-[#E4405F] text-white",
    inlineClass: "border-[#E4405F] text-[#E4405F] hover:bg-[#FFF1F5]",
  },
  email: {
    label: "メール",
    buildUrl: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title ?? "")}&body=${encodeURIComponent(shareText(url, title))}`,
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
    buildUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(shareText(url, title))}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4.1 15.9l.8-2.9a7 7 0 111.9 2l-2.7.9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7.8 6.9c.2-.4.3-.4.6-.4h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2.1.3 0 .5l-.4.5c-.1.1-.2.2-.1.4.4.8 1 1.5 1.8 1.9.2.1.3.1.5-.1l.5-.6c.1-.2.3-.2.5-.1l1.4.7c.2.1.3.2.3.4 0 .5-.3 1.3-.9 1.5-.6.2-1.8.1-3.1-.7-1.5-.8-2.7-2-3.4-3.4-.7-1.3-.7-2.1-.5-2.6z" fill="currentColor" />
      </svg>
    ),
    circleClass: "bg-[#25D366] text-white",
    inlineClass: "border-[#25D366] text-[#128C7E] hover:bg-[#F0FFF8]",
  },
  telegram: {
    label: "Telegram",
    buildUrl: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}${title ? `&text=${encodeURIComponent(title)}` : ""}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M17.3 3.2L2.7 8.8c-1 .4-1 1-.2 1.3l3.7 1.2 1.4 4.2c.2.6.4.8.8.8s.6-.2.9-.5l2-2 4.1 3c.8.4 1.3.2 1.5-.7l2.6-12.2c.2-1-.4-1.4-1.2-1zM7 10.9l8.1-5.1c.4-.2.7-.1.4.2l-6.9 6.2-.3 2.7L7 10.9z" />
      </svg>
    ),
    circleClass: "bg-[#229ED9] text-white",
    inlineClass: "border-[#229ED9] text-[#229ED9] hover:bg-[#F0FAFF]",
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
  providers,
  region = "global",
  layout = "circle",
  className,
  onShare,
  onCopy,
}: ShareButtonsProps) {
  const [copiedProvider, setCopiedProvider] = React.useState<ShareProvider | null>(null)
  const activeProviders = providers ?? REGION_PROVIDERS[region]

  const markCopied = (provider: ShareProvider) => {
    setCopiedProvider(provider)
    onCopy?.()
    setTimeout(() => setCopiedProvider(null), 2000)
  }

  const copyUrl = async (provider: ShareProvider) => {
    await navigator.clipboard.writeText(url)
    markCopied(provider)
  }

  const handleClick = async (provider: ShareProvider) => {
    onShare?.(provider)

    if (provider === "copy") {
      await copyUrl(provider)
      return
    }
    const meta = PROVIDER_META[provider]
    if (meta.webShare && typeof navigator !== "undefined" && "share" in navigator) {
      await navigator.share({ title, url })
      return
    }
    if (meta.webShare) {
      await copyUrl(provider)
      return
    }
    if (meta.buildUrl) {
      window.open(meta.buildUrl(url, title), "_blank", "noopener,noreferrer,width=600,height=500")
    }
  }

  if (layout === "circle") {
    return (
      <div
        data-slot="share-buttons"
        data-layout="circle"
        className={cn("flex items-center gap-4", className)}
        role="group"
        aria-label="シェア"
        data-region={region}
      >
        {activeProviders.map((p) => {
          const meta = PROVIDER_META[p]
          const isCopied = copiedProvider === p
          return (
            <button
              key={p}
              onClick={() => handleClick(p)}
              aria-label={meta.label}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <span className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95",
                meta.circleClass
              )}>
                {isCopied ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : meta.icon}
              </span>
              <span className="typo-label-xs text-[var(--Text-Medium-Emphasis)]">
                {isCopied ? "コピー済" : meta.label}
              </span>
            </button>
          )
        })}
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
      aria-label="シェア"
      data-region={region}
    >
      {activeProviders.map((p) => {
        const meta = PROVIDER_META[p]
        const isCopied = copiedProvider === p
        return (
          <button
            key={p}
            onClick={() => handleClick(p)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border typo-label-xs font-semibold transition-colors",
              meta.inlineClass
            )}
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
              {isCopied ? (
                <svg viewBox="0 0 12 12" fill="none"><path d="M1 6l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              ) : meta.icon}
            </span>
            {isCopied ? "コピー済み" : meta.label}
          </button>
        )
      })}
    </div>
  )
}

export { ShareButtons }
export type { ShareButtonsProps, ShareProvider, ShareLayout, ShareRegion }
