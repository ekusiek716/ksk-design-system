import * as React from "react"
import { cn } from "@/lib/utils"

interface SearchBarProps extends Omit<React.ComponentProps<"input">, "type"> {
  onSearch?: (value: string) => void
}

function SearchBar({
  className,
  onSearch,
  ...props
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(e.currentTarget.value)
    }
  }

  return (
    <div data-slot="search-bar" className={cn("relative w-full", className)}>
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
      <input
        type="search"
        data-slot="input"
        className={cn(
          "flex h-12 w-full rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] pl-10 pr-4 typo-body-md text-[var(--Text-High-Emphasis)]",
          "placeholder:text-[var(--Text-Low-Emphasis)]",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  )
}

export { SearchBar }
