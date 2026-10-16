import * as React from "react"
import { Copy, TickCircle, CloseCircle } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

type CodeDisplaySize = "md" | "lg"
type CodeDisplayTone = "neutral" | "accent"
type CodeDisplayCopyResult = "success" | "error"

interface CodeDisplayProps extends Omit<React.ComponentProps<"div">, "children" | "onCopy"> {
  /** 表示・コピーするコード（招待コード・ログインコード・クーポン等） */
  code: string
  /** コードの上に出す見出し（「招待コード」等）。読み上げではコードの直前に読まれる */
  label?: string
  /** 文字の大きさ。md=typo-heading-lg（既定）/ lg=typo-heading-2xl */
  size?: CodeDisplaySize
  /** 面の色。neutral=Surface-Secondary（既定）/ accent=Surface-Accent-Primary-Light */
  tone?: CodeDisplayTone
  /** コピー操作を出す（既定 true） */
  copyable?: boolean
  /** コピー後に呼ぶ（成功・失敗の両方。計測・トースト用） */
  onCopy?: (result: CodeDisplayCopyResult) => void
  /** コピーボタンの文言。@default "コピー" */
  copyLabel?: string
  /** コピー成功の文言（ボタン表示と読み上げ）。@default "コピーしました" */
  copiedLabel?: string
  /** コピー失敗の文言。@default "コピーできませんでした" */
  copyErrorLabel?: string
  /** 成功・失敗の表示を元に戻すまでの ms。@default 2000 */
  feedbackDuration?: number
}

const CODE_TYPO: Record<CodeDisplaySize, string> = {
  md: "typo-heading-lg",
  lg: "typo-heading-2xl",
}

/**
 * CodeDisplay — 英数字のコードを読みやすく見せ、ワンタップでコピーする（issue #686）
 *
 * 等幅・広めの字間・折り返し（長いコードは途中で改行）を DS が持つ。`tracking-*` /
 * `font-mono` を consumer で指定してコード表示を自作しない。
 *
 * - コピーは `navigator.clipboard.writeText`。結果はボタンの文言とアイコンで示し、
 *   ボタンの外の `role="status"` 領域で読み上げる（色だけで伝えない）
 * - 入力させる側は CodeInput を使う（こちらは表示とコピー専用）
 */
function CodeDisplay({
  code,
  label,
  size = "md",
  tone = "neutral",
  copyable = true,
  onCopy,
  copyLabel = "コピー",
  copiedLabel = "コピーしました",
  copyErrorLabel = "コピーできませんでした",
  feedbackDuration = 2000,
  className,
  ...props
}: CodeDisplayProps) {
  const [result, setResult] = React.useState<CodeDisplayCopyResult | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const copy = async () => {
    let next: CodeDisplayCopyResult = "success"
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) throw new Error("Clipboard API is unavailable")
      await navigator.clipboard.writeText(code)
    } catch {
      next = "error"
    }
    setResult(next)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setResult(null), feedbackDuration)
    onCopy?.(next)
  }

  const buttonText = result === "success" ? copiedLabel : result === "error" ? copyErrorLabel : copyLabel

  return (
    <div
      data-slot="code-display"
      data-size={size}
      data-tone={tone}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3",
        tone === "accent"
          ? "border border-[var(--Border-Accent-Primary)] bg-[var(--Surface-Accent-Primary-Light)]"
          : "border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)]",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        {label && (
          <p data-slot="code-display-label" className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">
            {label}
          </p>
        )}
        <p
          data-slot="code-display-code"
          className={cn(
            "break-all font-mono tabular-nums tracking-wider text-[var(--Text-High-Emphasis)]",
            CODE_TYPO[size]
          )}
        >
          {code}
        </p>
      </div>
      {copyable && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void copy()}
          data-slot="code-display-copy"
          data-result={result ?? undefined}
          className="shrink-0"
        >
          {result === "success" ? (
            <TickCircle size={16} aria-hidden="true" />
          ) : result === "error" ? (
            <CloseCircle size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
          <span>{buttonText}</span>
        </Button>
      )}
      {/* コピー結果の通知はボタンの外の status 領域で行う（ボタン内の live region は、押した直後の
          フォーカス中の名前変化として読まれたり読まれなかったりする SR 差があるため） */}
      {copyable && (
        <span role="status" data-slot="code-display-status" className="sr-only">
          {result === "success" ? copiedLabel : result === "error" ? copyErrorLabel : ""}
        </span>
      )}
    </div>
  )
}

export { CodeDisplay }
export type { CodeDisplayProps, CodeDisplaySize, CodeDisplayTone, CodeDisplayCopyResult }
