import * as React from "react"
import { cn } from "@/lib/utils"

// ─── FormRoot: <form> with DS styling ───
interface FormRootProps extends React.ComponentProps<"form"> {
  /** Prevent default form submission */
  preventDefault?: boolean
}

function FormRoot({ className, preventDefault = true, onSubmit, ...props }: FormRootProps) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    if (preventDefault) e.preventDefault()
    onSubmit?.(e as never)
  }

  return (
    <form
      data-slot="form"
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    />
  )
}

// ─── FormSection: Group related fields ───
interface FormSectionProps extends React.ComponentProps<"fieldset"> {
  title?: string
  description?: string
}

/**
 * 関連する入力を fieldset で束ねる簡易 API。
 *
 * `title` は fieldset の直下の最初の `<legend>` として描き、fieldset の名前（accessible name）になる。
 * `<div>` で包むと legend が fieldset の名前にならず、読み上げで見出しがグループ名として
 * 伝わらなかった（issue #792）。title が無いときは legend を描かず、名前なしになる（想定内）。
 * `description` は legend の後ろの兄弟 `<p>` として描き、fieldset の `aria-describedby` に結ぶ
 * （利用者が渡した `aria-describedby` は後ろに連結して残す）。
 *
 * legend は fieldset の枠側に描かれ flex の並びに入らないため、旧 `<div>` の gap と同じ間隔を
 * legend の margin-bottom で付ける（description あり=4px、無し=16px）。
 */
function FormSection({
  className,
  title,
  description,
  children,
  "aria-describedby": ariaDescribedby,
  ...props
}: FormSectionProps) {
  const descriptionId = React.useId()
  const describedBy = [description ? descriptionId : undefined, ariaDescribedby]
    .filter(Boolean)
    .join(" ")
  return (
    <fieldset
      data-slot="form-section"
      className={cn("flex min-w-0 flex-col gap-4", className)}
      aria-describedby={describedBy || undefined}
      {...props}
    >
      {title && (
        <legend
          className={cn(
            "typo-heading-md text-[var(--Text-High-Emphasis)]",
            description ? "mb-1" : "mb-4"
          )}
        >
          {title}
        </legend>
      )}
      {description && (
        <p id={descriptionId} className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          {description}
        </p>
      )}
      {children}
    </fieldset>
  )
}

// ─── FormActions: Button row at form bottom ───
function FormActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-actions"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 pt-4",
        className
      )}
      {...props}
    />
  )
}

export { FormRoot, FormSection, FormActions }
