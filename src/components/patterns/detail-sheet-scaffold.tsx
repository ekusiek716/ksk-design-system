import * as React from "react"
import { cn } from "@/lib/utils"

interface DetailSheetScaffoldProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

interface DetailSheetHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode
  titleEditor?: React.ReactNode
  description?: React.ReactNode
  leading?: React.ReactNode
  trailing?: React.ReactNode
}

function DetailSheetScaffold({
  className,
  header,
  footer,
  children,
  ...props
}: DetailSheetScaffoldProps) {
  return (
    <div
      data-slot="detail-sheet-scaffold"
      className={cn(
        "flex max-h-[inherit] min-h-0 flex-col bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
        className
      )}
      {...props}
    >
      {header}
      <div
        data-slot="detail-sheet-body"
        className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
      >
        {children}
      </div>
      {footer}
    </div>
  )
}

function DetailSheetHeader({
  className,
  title,
  titleEditor,
  description,
  leading,
  trailing,
  children,
  ...props
}: DetailSheetHeaderProps) {
  const titleContent = titleEditor ?? title

  return (
    <div
      data-slot="detail-sheet-header"
      className={cn(
        "grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-5 pt-5",
        "border-b border-[var(--Border-Low-Emphasis)] pb-4",
        className
      )}
      {...props}
    >
      <div data-slot="detail-sheet-header-leading" className="flex min-h-10 items-center">
        {leading}
      </div>
      <div data-slot="detail-sheet-header-title" className="min-w-0">
        {typeof titleContent === "string" ? (
          <h2 className="typo-heading-lg text-[var(--Text-High-Emphasis)] break-words">
            {titleContent}
          </h2>
        ) : (
          titleContent
        )}
        {description && (
          typeof description === "string" ? (
            <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </p>
          ) : (
            <div className="mt-1">{description}</div>
          )
        )}
        {children}
      </div>
      <div
        data-slot="detail-sheet-header-trailing"
        className="flex min-h-10 shrink-0 items-center justify-end gap-1"
      >
        {trailing}
      </div>
    </div>
  )
}

function DetailSheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="detail-sheet-body"
      className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  )
}

export { DetailSheetScaffold, DetailSheetHeader, DetailSheetBody }
export type { DetailSheetScaffoldProps, DetailSheetHeaderProps }
