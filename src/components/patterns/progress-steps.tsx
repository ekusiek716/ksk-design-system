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
      className={cn("flex flex-col gap-2", className)}
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      {...props}
    >
      {/* サークル + ライン行 */}
      <div className="flex items-center">
        {steps.map((_, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <div
                  className={cn(
                    "flex-1 h-0.5",
                    isCompleted
                      ? "bg-[var(--Brand-Primary)]"
                      : "bg-[var(--Border-Low-Emphasis)]"
                  )}
                />
              )}
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-full typo-label-sm transition-colors shrink-0",
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
            </React.Fragment>
          )
        })}
      </div>
      {/* ラベル行 */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep
          return (
            <span
              key={index}
              className={cn(
                "typo-label-xs whitespace-nowrap text-center",
                index === 0 ? "text-left" : index === steps.length - 1 ? "text-right" : "text-center",
                isCurrent
                  ? "text-[var(--Text-High-Emphasis)]"
                  : "text-[var(--Text-Low-Emphasis)]"
              )}
              style={{ width: `${100 / steps.length}%` }}
            >
              {step}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export { ProgressSteps }
