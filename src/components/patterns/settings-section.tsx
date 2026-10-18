import * as React from "react"
import { ArrowRight2 } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { warnOnceInDev } from "@/lib/dev-warn"

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

/**
 * rightSlot に関数を渡したときに受け取る、操作部品へ展開する属性（issue #759）。
 * `<Switch {...control} />` のように渡すと、title がその部品のラベル、description が説明になる。
 */
interface SettingsListRowControlProps {
  id: string
  /** description があるときだけ入る（description の要素の id）。 */
  "aria-describedby"?: string
}

interface SettingsListRowProps
  extends Omit<React.ComponentProps<"div">, "title" | "onClick"> {
  title: React.ReactNode
  description?: React.ReactNode
  /** 行頭のアイコンやアバター。寸法は渡した要素を保ち、装飾用の余白を追加しない。 */
  leading?: React.ReactNode
  /**
   * 右端の操作部品・表示。関数を渡すと `{ id, "aria-describedby" }` を受け取り、
   * title（`<label htmlFor>`）・description（`aria-describedby`）と結ばれる（issue #759）。
   */
  rightSlot?: React.ReactNode | ((control: SettingsListRowControlProps) => React.ReactNode)
  /**
   * rightSlot の操作部品（Switch / Checkbox 等）の id（issue #759）。指定すると title を
   * `<label htmlFor={controlId}>`、description に `${controlId}-description` の id を付ける。
   * 操作部品側に `id={controlId}` と `aria-describedby` を付けるか、rightSlot に関数を渡す
   * （関数を渡すなら省略可。省略時は自動採番）。行全体が button になる interactive / onClick の行では結ばない。
   */
  controlId?: string
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
  controlId,
  children,
  ...props
}: SettingsListRowProps) {
  const autoId = React.useId()
  const isButtonRow = interactive || onClick != null
  // 行全体が button の行は、中に label・操作部品を入れられないので結ばない（issue #759）。
  const linked = !isButtonRow && (controlId != null || typeof rightSlot === "function")
  const resolvedControlId = controlId ?? `settings-row-${autoId.replace(/:/g, "")}-control`
  const descriptionId = linked && description ? `${resolvedControlId}-description` : undefined
  if (isButtonRow && (controlId != null || typeof rightSlot === "function")) {
    warnOnceInDev(
      "settings-list-row-control-in-button",
      "SettingsListRow: interactive / onClick の行（行全体が button）では controlId / 関数の rightSlot による結び付けは行いません。操作部品は button の中に置けないため、トグルの行は interactive / onClick を外してください。"
    )
  }
  const resolvedRightSlot =
    typeof rightSlot === "function"
      ? rightSlot({ id: resolvedControlId, ...(descriptionId ? { "aria-describedby": descriptionId } : {}) })
      : rightSlot
  const titleClassName = cn(
    "typo-label-md truncate",
    destructive ? "text-[var(--Text-Caution)]" : "text-[var(--Text-High-Emphasis)]"
  )
  const content = (
    <>
      {leading && (
        <div data-slot="settings-list-row-leading" className="flex shrink-0 items-center justify-center">
          {leading}
        </div>
      )}
      <div data-slot="settings-list-row-body" className="min-w-0 flex-1">
        {linked ? (
          <label
            data-slot="settings-list-row-label"
            htmlFor={resolvedControlId}
            className={cn("block", !disabled && "cursor-pointer", typeof title === "string" && titleClassName)}
          >
            {title}
          </label>
        ) : typeof title === "string" ? (
          <p className={titleClassName}>{title}</p>
        ) : (
          title
        )}
        {description &&
          (typeof description === "string" ? (
            <p id={descriptionId} className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </p>
          ) : (
            <div id={descriptionId} className="mt-1">{description}</div>
          ))}
        {children}
      </div>
      {resolvedRightSlot && (
        <div data-slot="settings-list-row-right" className="shrink-0">
          {resolvedRightSlot}
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

  if (isButtonRow) {
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
export type {
  SettingsListRowControlProps,
  SettingsListRowProps,
  SettingsSectionProps,
  SettingsSectionVariant,
}
