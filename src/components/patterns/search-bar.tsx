import * as React from "react"
import { cn } from "@/lib/utils"
import { isImeComposing } from "@/lib/ime"

interface SearchBarProps extends Omit<React.ComponentProps<"input">, "type"> {
  onSearch?: (value: string) => void
  /**
   * true の場合、ルート要素を `<form>` にし、Enter / 送信ボタンでの送信を
   * ネイティブの submit イベントに任せる（`onSubmit` で `preventDefault` してページ遷移を防ぐ）。
   * 既定は `false`（現行互換。ルートは `<div>` のまま、Enter は input の keydown で処理）。
   *
   * `true` のときは keydown 側の Enter 判定を止め、submit と二重発火しないようにする。
   */
  asForm?: boolean
}

function SearchBar({
  className,
  onSearch,
  asForm = false,
  ...props
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // asForm=true のときは submit イベントに任せるため、ここでは何もしない（二重発火防止）
    if (asForm) return
    // 変換確定の Enter で未確定文字のまま検索が走らないようにする（issue #301 と同一原因）
    if (e.key === "Enter" && !isImeComposing(e) && onSearch) {
      onSearch(e.currentTarget.value)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSearch) {
      const input = e.currentTarget.elements.namedItem("search") as HTMLInputElement | null
      onSearch(input?.value ?? "")
    }
  }

  const icon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--Object-Medium-Emphasis)]"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  const input = (
    <input
      type="search"
      name="search"
      data-slot="input"
      enterKeyHint="search"
      className={cn(
        "flex h-12 w-full rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] pl-10 pr-4 typo-body-md text-[var(--Text-High-Emphasis)]",
        "placeholder:text-[var(--Text-Low-Emphasis)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )

  if (asForm) {
    return (
      <form
        data-slot="search-bar"
        role="search"
        className={cn("relative w-full", className)}
        onSubmit={handleSubmit}
      >
        {icon}
        {input}
      </form>
    )
  }

  // role="search" は付けない: 消費側が既に外側のラッパーに role="search" を
  // 持っているケースがあり、二重ランドマークになるため（ランドマークとしての価値より
  // 誤重複の実害を避ける安全側の判断）。form 化する asForm=true 時は消費側の
  // 既存ラッパーと衝突しない前提が明確なため role="search" を付ける。
  return (
    <div data-slot="search-bar" className={cn("relative w-full", className)}>
      {icon}
      {input}
    </div>
  )
}

export { SearchBar }
