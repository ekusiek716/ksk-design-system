import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.ComponentProps<"div"> {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  description?: string
}

function FormField({
  className,
  label,
  htmlFor,
  required,
  error,
  description,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div
      data-slot="form-field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <label
        htmlFor={htmlFor}
        className="typo-label-md text-[var(--Text-High-Emphasis)]"
      >
        {label}
        {required && (
          <span className="text-[var(--Text-Caution)] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {description && !error && (
        <p className="typo-body-sm text-[var(--Text-Low-Emphasis)]">
          {description}
        </p>
      )}
      {error && (
        <p
          className="typo-body-sm text-[var(--Text-Caution)] flex items-center gap-1"
          role="alert"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4V7.5M7 9.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export { FormField }
