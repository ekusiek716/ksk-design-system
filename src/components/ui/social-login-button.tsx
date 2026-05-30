import * as React from "react"
import { cn } from "@/lib/utils"
import { SocialIcon } from "./social-icon"

type SocialProvider = "line" | "google" | "apple" | "amazon"

interface SocialLoginButtonProps extends React.ComponentProps<"button"> {
  provider: SocialProvider
  loading?: boolean
  fullWidth?: boolean
}

// アイコンは SocialIcon（socialicon/ 由来の共通ブランドアセット）を参照。
// ボタンの配色（罫線・背景）は外部ブランド色トークンを使用。
const PROVIDER_CONFIG: Record<
  SocialProvider,
  { label: string; platform: string; iconTone: "brand" | "mono"; className: string }
> = {
  line: {
    label: "LINEでログイン",
    platform: "line",
    iconTone: "brand",
    className:
      "border-[var(--Brand-Line)] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Success)]",
  },
  google: {
    label: "Googleでログイン",
    platform: "google",
    iconTone: "brand",
    className:
      "border-[var(--Brand-Google-Border)] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]",
  },
  apple: {
    label: "Appleでログイン",
    platform: "apple",
    // Apple ロゴは黒背景上に置くため白（mono = currentColor、ボタンの text-on-inverse に追従）
    iconTone: "mono",
    className:
      "border-[var(--Brand-Apple)] text-[var(--Text-on-Inverse)] bg-[var(--Brand-Apple)] hover:opacity-90",
  },
  amazon: {
    label: "Amazonでログイン",
    platform: "amazon",
    iconTone: "brand",
    className:
      "border-[var(--Brand-Amazon)] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]",
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
          <SocialIcon platform={config.platform} tone={config.iconTone} size={22} />
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
