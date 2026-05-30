import * as React from "react"
import { cn } from "@/lib/utils"

type SocialProvider = "line" | "google" | "apple" | "amazon"

interface SocialLoginButtonProps extends React.ComponentProps<"button"> {
  provider: SocialProvider
  loading?: boolean
  fullWidth?: boolean
}

const PROVIDER_CONFIG: Record<
  SocialProvider,
  { label: string; icon: React.ReactNode; className: string }
> = {
  line: {
    label: "LINEでログイン",
    icon: (
      /* LINE ブランドアイコン（緑角丸 + 白い吹き出し）。提供アセット
         LINE_APP_iOS_RGB.ai を基に手で SVG 化。ボタン上の小サイズ用に、
         潰れて読めない "LINE" ワードマークは省き、識別性の高い
         「緑スクエア + 白吹き出し」に簡略化している。 */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="5.5" fill="#06C755" />
        <path
          fill="#fff"
          d="M20 11.02c0-3.58-3.59-6.5-8-6.5s-8 2.92-8 6.5c0 3.21 2.85 5.9 6.69 6.41.26.06.62.17.71.4.08.2.05.52.03.73l-.11.69c-.03.2-.16.8.7.43 .86-.36 4.62-2.72 6.3-4.66h0C19.45 13.74 20 12.45 20 11.02z"
        />
      </svg>
    ),
    className: "border-[#06C755] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Success)]",
  },
  google: {
    label: "Googleでログイン",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
    ),
    className: "border-[#DADCE0] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]",
  },
  apple: {
    label: "Appleでログイン",
    icon: (
      /* Apple logo — standard path in 24x24 */
      <svg width="18" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    className: "border-black text-white bg-black hover:bg-gray-900",
  },
  amazon: {
    label: "Amazonでログイン",
    icon: (
      /* Amazon: dark rounded square + "a" path + orange smile arc */
      <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="8" fill="#232F3E"/>
        {/* "a" as path */}
        <path d="M22 13.5c0-2-1.2-3-3.5-3-1.2 0-2.2.3-3 .8-.8.5-1.2 1.2-1.2 2h2.4c0-.3.1-.5.4-.7.2-.2.5-.2.9-.2.8 0 1.2.4 1.2 1v.6c-1.6 0-2.9.3-3.8.9-.9.6-1.4 1.4-1.4 2.4 0 .9.3 1.6 1 2.1.6.5 1.4.8 2.3.8 1 0 1.9-.4 2.6-1.2.1.3.2.7.5.9h2.5c-.4-.5-.6-1.1-.6-1.8V13.5zm-2.8 4.2c-.3.7-.9 1-1.6 1-.4 0-.8-.1-1-.3-.3-.2-.4-.5-.4-.9 0-.5.2-.9.7-1.2.5-.3 1.2-.4 2.2-.4v1.8z" fill="white"/>
        {/* orange smile */}
        <path d="M11 27.5 Q20 32 29 27.5" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M26.5 26.5 L29 27.5 L28 30" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    className: "border-[#232F3E] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]",
  },
}

function SocialLoginButton({
  provider,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: SocialLoginButtonProps) {
  const config = PROVIDER_CONFIG[provider]

  return (
    <button
      data-slot="social-login-button"
      data-provider={provider}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center gap-3 border-[1.5px] rounded-xl px-4 py-3",
        "typo-label-md font-semibold transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth && "w-full",
        config.className,
        className
      )}
      {...props}
    >
      <span className="flex-shrink-0 w-6 flex items-center justify-center">
        {loading ? (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="30" strokeDashoffset="10" />
          </svg>
        ) : (
          config.icon
        )}
      </span>
      <span className="flex-1 text-center">
        {children ?? config.label}
      </span>
    </button>
  )
}

export { SocialLoginButton }
export type { SocialLoginButtonProps, SocialProvider }
