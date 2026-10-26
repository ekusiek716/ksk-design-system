import * as React from "react"
import { cn } from "@/lib/utils"
import { SocialIcon } from "./social-icon"
import { useKskLabels } from "./ksk-labels"

type SocialProvider = "line" | "google" | "apple" | "amazon"

/** ボタンの既定文言を引く KskLabels のキー（children を渡さなかったとき） */
type SocialLoginLabelKey = "socialLoginLine" | "socialLoginGoogle" | "socialLoginApple" | "socialLoginAmazon"

interface SocialLoginButtonProps extends React.ComponentProps<"button"> {
  provider: SocialProvider
  loading?: boolean
  fullWidth?: boolean
}

// アイコンは SocialIcon（socialicon/ 由来の共通ブランドアセット）を参照。
// ボタンの配色（罫線・背景）は外部ブランド色トークンを使用。
const PROVIDER_CONFIG: Record<
  SocialProvider,
  { labelKey: SocialLoginLabelKey; platform: string; iconTone: "brand" | "mono"; className: string }
> = {
  line: {
    labelKey: "socialLoginLine",
    platform: "line",
    iconTone: "brand",
    className:
      "border-[var(--Brand-Line)] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Success)]",
  },
  google: {
    labelKey: "socialLoginGoogle",
    platform: "google",
    iconTone: "brand",
    className:
      "border-[var(--Brand-Google-Border)] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]",
  },
  apple: {
    labelKey: "socialLoginApple",
    platform: "apple",
    // Apple HIG: ライトでは黒ボタン（白文字）、ダークでは白ボタン（黒文字）。
    // 面と前景は .dark で反転する専用トークン。ロゴは mono（currentColor）で文字色に追従。
    // --Text-on-Inverse は固定黒の --Brand-Apple と組むとダークで黒地に黒文字になる（issue #595）。
    iconTone: "mono",
    className:
      "border-[var(--Brand-Apple-Surface)] text-[var(--Brand-on-Apple)] bg-[var(--Brand-Apple-Surface)] hover:opacity-90",
  },
  amazon: {
    labelKey: "socialLoginAmazon",
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
  const defaultLabels = useKskLabels()
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
          <svg className="animate-spin motion-reduce:animate-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="30" strokeDashoffset="10" />
          </svg>
        ) : (
          // ボタン自体に可視テキストラベル（既定文言 等）があるため、
          // アイコンの accessible name は読み上げの二重になる。装飾扱いにする。
          <SocialIcon platform={config.platform} tone={config.iconTone} size={22} aria-hidden="true" />
        )}
      </span>
      <span className="flex-1 text-center">
        {children ?? defaultLabels[config.labelKey]}
      </span>
    </button>
  )
}

export { SocialLoginButton }
export type { SocialLoginButtonProps, SocialProvider }
