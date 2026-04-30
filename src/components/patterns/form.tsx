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

function FormSection({ className, title, description, children, ...props }: FormSectionProps) {
  return (
    <fieldset
      data-slot="form-section"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title && <legend className="typo-heading-md text-[var(--Text-High-Emphasis)]">{title}</legend>}
          {description && <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">{description}</p>}
        </div>
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
