import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "relative w-fit",
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 items-center h-9",
        caption_label: "typo-label-md text-[var(--Text-High-Emphasis)]",
        nav: "absolute top-[16px] inset-x-0 flex justify-between px-1 z-10 pointer-events-none",
        button_previous: cn(
          "h-7 w-7 flex items-center justify-center rounded-lg pointer-events-auto",
          "text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)]",
          "hover:bg-[var(--Surface-Secondary)] transition-colors"
        ),
        button_next: cn(
          "h-7 w-7 flex items-center justify-center rounded-lg pointer-events-auto",
          "text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)]",
          "hover:bg-[var(--Surface-Secondary)] transition-colors"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-[var(--Text-Low-Emphasis)] typo-label-xs w-9 font-normal text-center",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center relative p-0 focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-9 w-9 typo-body-sm rounded-full transition-colors",
          "hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]"
        ),
        // 通常選択（単一 or range の start/end）
        selected:
          "[&>button]:bg-[var(--Brand-Primary)] [&>button]:text-[var(--Text-on-Inverse)] [&>button]:hover:bg-[var(--Brand-Primary)] [&>button]:hover:text-[var(--Text-on-Inverse)]",
        // range の start: 右半分を帯で塗る
        range_start:
          "bg-gradient-to-r from-transparent from-50% to-[var(--Brand-Ultra-Light)] to-50%",
        // range の end: 左半分を帯で塗る
        range_end:
          "bg-gradient-to-l from-transparent from-50% to-[var(--Brand-Ultra-Light)] to-50%",
        // range の中間: 全幅を帯で塗り、ボタンの円を消す
        range_middle:
          "bg-[var(--Brand-Ultra-Light)] [&>button]:!bg-transparent [&>button]:!text-[var(--Text-High-Emphasis)] [&>button]:rounded-none [&>button]:hover:!bg-[var(--Brand-Ultra-Light)]",
        today: "[&>button]:font-semibold [&>button]:text-[var(--Brand-Primary)]",
        outside: "opacity-30",
        disabled: "text-[var(--Text-Low-Emphasis)] opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={cn(orientation === "left" ? "rotate-90" : "-rotate-90")}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
