import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

/**
 * フォーム全体 / 大きな入力セクションを fieldset semantics で束ねる。
 * legend・description・FieldGroup を 24px の縦リズムで配置する。
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("m-0 flex min-w-0 flex-col gap-6 border-0 p-0", className)}
      {...props}
    />
  )
}

/** FieldSet のアクセシブルな見出し。 */
function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("typo-heading-md text-[var(--Text-High-Emphasis)]", className)}
      {...props}
    />
  )
}

/** 関連する FormField 群を 16px の縦リズムで束ねる。 */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="field-group"
      role="group"
      className={cn("flex min-w-0 flex-col gap-4", className)}
    />
  )
}

/** FieldSet / FieldGroup に対する補足文。 */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("typo-body-sm text-[var(--Text-Low-Emphasis)]", className)}
      {...props}
    />
  )
}

/** グループ単位のエラー。空なら不要な alert DOM を出さない。 */
function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  if (React.Children.toArray(children).length === 0) return null

  return (
    <p
      {...props}
      data-slot="field-error"
      role="alert"
      className={cn("typo-body-sm text-[var(--Text-Caution)]", className)}
    >
      {children}
    </p>
  )
}

/** FieldGroup 間の区切り。children がある場合は中央ラベルとして表示する。 */
function FieldSeparator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const hasLabel = React.Children.toArray(children).length > 0

  return (
    <div
      data-slot="field-separator"
      className={cn("flex items-center py-2", className)}
      {...props}
    >
      <Separator className="flex-1" />
      {hasLabel && (
        <>
          <span className="mx-3 shrink-0 typo-caption text-[var(--Text-Low-Emphasis)]">
            {children}
          </span>
          <Separator className="flex-1" />
        </>
      )}
    </div>
  )
}

export {
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldDescription,
  FieldError,
  FieldSeparator,
}
export type FieldSetProps = React.ComponentProps<"fieldset">
export type FieldLegendProps = React.ComponentProps<"legend">
export type FieldGroupProps = React.ComponentProps<"div">
export type FieldDescriptionProps = React.ComponentProps<"p">
export type FieldErrorProps = React.ComponentProps<"p">
export type FieldSeparatorProps = React.ComponentProps<"div">
