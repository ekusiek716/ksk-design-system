import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressStepsProps extends React.ComponentProps<"div"> {
  steps: string[]
  currentStep: number
}

function ProgressSteps({
  className,
  steps,
  currentStep,
  ...props
}: ProgressStepsProps) {
  return (
    <div
      data-slot="progress-steps"
      className={cn("flex items-start", className)}
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      {...props}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isLast = index === steps.length - 1
        return (
          <React.Fragment key={index}>
            {/* ステップ（サークル + ラベル） */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-full typo-label-sm transition-colors",
                  isCompleted
                    ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
                    : isCurrent
                      ? "border-2 border-[var(--Brand-Primary)] text-[var(--Text-Accent-Primary)]"
                      : "border border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Low-Emphasis)]"
                )}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M11 4L5.5 9.5L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "typo-label-xs text-center whitespace-nowrap",
                  isCurrent
                    ? "text-[var(--Text-High-Emphasis)] font-medium"
                    : "text-[var(--Text-Low-Emphasis)]"
                )}
              >
                {step}
              </span>
            </div>

            {/* コネクターライン（最後のステップには不要） */}
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-0.5 mt-4 mx-1",
                  isCompleted
                    ? "bg-[var(--Brand-Primary)]"
                    : "bg-[var(--Border-Low-Emphasis)]"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { ProgressSteps }
