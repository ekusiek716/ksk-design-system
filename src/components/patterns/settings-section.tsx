import * as React from "react"
import { ArrowRight2 } from "iconsax-reactjs"
import { cn } from "@/lib/utils"

type SettingsSectionVariant = "group" | "card" | "danger"

interface SettingsSectionProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: SettingsSectionVariant
  /**
   * 見出しの左に置くアイコン（issue #690）。装飾扱い（aria-hidden）で、20px・Object-Medium-Emphasis
   * （danger は Object-Caution）に揃える。意味は title で伝える。
   */
  icon?: React.ReactNode
}

interface SettingsListRowProps
  extends Omit<React.ComponentProps<"div">, "title" | "onClick"> {
  title: React.ReactNode
  description?: React.ReactNode
  /** 行頭のアイコンやアバター。寸法は渡した要素を保ち、装飾用の余白を追加しない。 */
  leading?: React.ReactNode
  rightSlot?: React.ReactNode
  interactive?: boolean
  disabled?: boolean
  destructive?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /**
   * 右端に「次の画面へ進む」矢印（ArrowRight2・16px・Object-Low-Emphasis・aria-hidden）を出す（issue #690）。
   * 遷移する行に付ける。トグル・その場で完結する操作の行には付けない。rightSlot（現在値など）の右に並ぶ。
   * native SettingsListRow / native ListItem と同じ名前。
   */
  showChevron?: boolean
}

function SettingsSection({
  className,
  title,
  description,
  action,
  variant = "group",
  icon,
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
          className="flex items-start justify-between gap-3 px-4"
        >
          <div className="min-w-0 flex-1">
            {title && (
              <h2
                className={cn(
                  "typo-heading-sm text-[var(--Text-High-Emphasis)]",
                  icon != null && "flex items-center gap-2",
                  variant === "danger" && "text-[var(--Text-Caution)]"
                )}
              >
                {icon != null && (
                  <span
                    data-slot="settings-section-icon"
                    aria-hidden="true"
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center [&_svg]:size-5",
                      variant === "danger" ? "text-[var(--Object-Caution)]" : "text-[var(--Object-Medium-Emphasis)]"
                    )}
                  >
                    {icon}
                  </span>
                )}
                {icon != null ? <span className="min-w-0 flex-1">{title}</span> : title}
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
  showChevron = false,
  children,
  ...props
}: SettingsListRowProps) {
  const content = (
    <>
      {leading && (
        <div data-slot="settings-list-row-leading" className="flex shrink-0 items-center justify-center">
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
      {showChevron && (
        <ArrowRight2
          data-slot="settings-list-row-chevron"
          aria-hidden="true"
          size={16}
          color="currentColor"
          className="shrink-0 text-[var(--Object-Low-Emphasis)]"
        />
      )}
    </>
  )
  const classes = cn(
    "flex min-h-[max(2.75rem,var(--Settings-Row-Min-Height))] w-full items-center gap-[var(--Settings-Row-Gap)] border-b border-[var(--Border-Low-Emphasis)] px-[var(--Settings-Row-Padding-X)] py-[var(--Settings-Row-Padding-Y)] text-left last:border-b-0",
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
