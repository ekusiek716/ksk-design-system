import * as React from "react"
import { cn } from "@/lib/utils"

type SettingsSectionVariant = "group" | "card" | "danger"

interface SettingsSectionProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: SettingsSectionVariant
}

interface SettingsListRowProps
  extends Omit<React.ComponentProps<"div">, "title" | "onClick"> {
  title: React.ReactNode
  description?: React.ReactNode
  leading?: React.ReactNode
  rightSlot?: React.ReactNode
  interactive?: boolean
  disabled?: boolean
  destructive?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

function SettingsSection({
  className,
  title,
  description,
  action,
  variant = "group",
  children,
  ...props
}: SettingsSectionProps) {
  const isCard = variant === "card" || variant === "danger"
  return (
    <section
      data-slot="settings-section"
      data-variant={variant}
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {(title || description || action) && (
        <div
          data-slot="settings-section-header"
          className="flex items-start justify-between gap-3 px-1"
        >
          <div className="min-w-0 flex-1">
            {title && (
              <h2
                className={cn(
                  "typo-heading-sm text-[var(--Text-High-Emphasis)]",
                  variant === "danger" && "text-[var(--Text-Caution)]"
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div data-slot="settings-section-action" className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      <div
        data-slot="settings-section-content"
        className={cn(
          "flex flex-col",
          isCard && [
            "overflow-hidden rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
            variant === "danger"
              ? "border-[var(--Border-Caution)]"
              : "border-[var(--Border-Low-Emphasis)]",
          ],
          !isCard && "gap-2"
        )}
      >
        {children}
      </div>
    </section>
  )
}

function SettingsListRow({
  className,
  title,
  description,
  leading,
  rightSlot,
  interactive = false,
  disabled = false,
  destructive = false,
  onClick,
  children,
  ...props
}: SettingsListRowProps) {
  const content = (
    <>
      {leading && (
        <div data-slot="settings-list-row-leading" className="flex size-10 shrink-0 items-center justify-center">
          {leading}
        </div>
      )}
      <div data-slot="settings-list-row-body" className="min-w-0 flex-1">
        {typeof title === "string" ? (
          <p
            className={cn(
              "typo-label-md truncate",
              destructive
                ? "text-[var(--Text-Caution)]"
                : "text-[var(--Text-High-Emphasis)]"
            )}
          >
            {title}
          </p>
        ) : (
          title
        )}
        {description &&
          (typeof description === "string" ? (
            <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </p>
          ) : (
            <div className="mt-1">{description}</div>
          ))}
        {children}
      </div>
      {rightSlot && (
        <div data-slot="settings-list-row-right" className="shrink-0">
          {rightSlot}
        </div>
      )}
    </>
  )
  const classes = cn(
    "flex min-h-14 w-full items-center gap-3 border-b border-[var(--Border-Low-Emphasis)] px-4 py-3 text-left last:border-b-0",
    interactive && !disabled && "cursor-pointer transition-colors hover:bg-[var(--Surface-Secondary)]",
    destructive && interactive && !disabled && "hover:bg-[var(--Surface-Caution-Subtle)]",
    disabled && "cursor-not-allowed opacity-50",
    className
  )

  if (interactive || onClick) {
    return (
      <button
        data-slot="settings-list-row"
        data-destructive={destructive || undefined}
        type="button"
        className={classes}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    )
  }

  return (
    <div
      data-slot="settings-list-row"
      data-destructive={destructive || undefined}
      className={classes}
      {...props}
    >
      {content}
    </div>
  )
}

export { SettingsSection, SettingsListRow }
export type { SettingsListRowProps, SettingsSectionProps, SettingsSectionVariant }
