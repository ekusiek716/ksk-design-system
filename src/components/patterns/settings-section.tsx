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
  /**
   * 操作部品の id（title の `<label htmlFor>` と同じ）。interactive / onClick の行（行全体が button）では
   * 結ばないので `{}` で呼ばれ、undefined になる。
   */
  id?: string
  /** description があるときだけ入る（description の要素の id）。 */
  "aria-describedby"?: string
  /** 行に disabled を付けたときだけ true が入る（ラベルを押しても切り替わらないように操作部品も止める）。 */
  disabled?: boolean
}

interface SettingsListRowProps
  extends Omit<React.ComponentProps<"div">, "title" | "onClick"> {
  title: React.ReactNode
  description?: React.ReactNode
  /** 行頭のアイコンやアバター。寸法は渡した要素を保ち、装飾用の余白を追加しない。 */
  leading?: React.ReactNode
  /**
   * 右端の操作部品・表示。関数を渡すと `{ id, "aria-describedby", disabled }` を受け取り、
   * title（`<label htmlFor>`）・description（`aria-describedby`）と結ばれる（issue #759）。
   * 関数が null / undefined / boolean を返したときは結ばない（title は従来どおり `<p>`）。
   * interactive / onClick の行では `{}` で呼ばれ、描画はするが結ばない。
   */
  rightSlot?: React.ReactNode | ((control: SettingsListRowControlProps) => React.ReactNode)
  /**
   * rightSlot の操作部品（Switch / Checkbox 等）の id（issue #759）。指定すると title を
   * `<label htmlFor={controlId}>`、description に `${controlId}-description` の id を付ける。
   * rightSlot に要素を渡すなら、操作部品側に `id={controlId}` と（description があれば）
   * `aria-describedby={`${controlId}-description`}` を自分で付ける（id が見つからないと開発ビルドで警告）。
   * rightSlot に関数を渡すなら省略可（省略時は自動採番）。行全体が button になる interactive / onClick の行では結ばない。
   * title にリンク等の操作要素を入れる行では controlId / 関数の rightSlot を使わない（label の中に操作要素を置けないため）。
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
  const wantsLink = controlId != null || typeof rightSlot === "function"
  // 行全体が button の行は、中に label・操作部品を入れられないので結ばない（issue #759）。
  const canLink = !isButtonRow && wantsLink
  // React 19.1+ の useId は «r1» / _r_1_ 形式なので、id に使える文字だけ残す
  const resolvedControlId = controlId ?? `settings-row-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}-control`
  const candidateDescriptionId = canLink && description ? `${resolvedControlId}-description` : undefined
  if (isButtonRow && wantsLink) {
    warnOnceInDev(
      "settings-list-row-control-in-button",
      "SettingsListRow: interactive / onClick の行（行全体が button）では controlId / 関数の rightSlot による結び付けは行いません。操作部品は button の中に置けないため、トグルの行は interactive / onClick を外してください。"
    )
  }
  let resolvedRightSlot: React.ReactNode
  if (typeof rightSlot === "function") {
    resolvedRightSlot = rightSlot(
      canLink
        ? {
            id: resolvedControlId,
            ...(candidateDescriptionId ? { "aria-describedby": candidateDescriptionId } : {}),
            ...(disabled ? { disabled: true } : {}),
          }
        : {}
    )
  } else {
    resolvedRightSlot = rightSlot
  }
  // 関数が何も描かなかったときは label[for] が宙に浮くので結ばない
  const linked =
    canLink &&
    (typeof rightSlot !== "function" || (resolvedRightSlot != null && typeof resolvedRightSlot !== "boolean"))
  const descriptionId = linked ? candidateDescriptionId : undefined
  const checkMissingControl = linked && typeof rightSlot !== "function" && controlId != null
  React.useEffect(() => {
    if (!checkMissingControl || !controlId || typeof document === "undefined") return
    if (!document.getElementById(controlId)) {
      warnOnceInDev(
        `settings-list-row-missing-control:${controlId}`,
        `SettingsListRow: controlId="${controlId}" の要素が見つかりません。rightSlot に要素を渡すときは、操作部品に id="${controlId}"（description があれば aria-describedby="${controlId}-description"）を付けるか、rightSlot={(control) => <Switch {...control} />} の形にしてください。`
      )
    }
  }, [checkMissingControl, controlId])
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
