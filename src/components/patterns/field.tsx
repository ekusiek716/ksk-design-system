import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

/** FieldSet の間隔の段（issue #714）。8 / 16 / 24px */
type FieldSetGap = "sm" | "md" | "lg"

/**
 * gap 指定時のクラス。`<legend>` は fieldset の枠側に描かれ flex の並びに入らないため、
 * 子の間隔（gap）とは別に legend の下にも同じ間隔（margin-bottom）を付ける。
 * クラスは完全な文字列で持つ（safelist の静的抽出のため）。
 */
const fieldSetGapClasses: Record<FieldSetGap, string> = {
  sm: "gap-2 [&>[data-slot=field-legend]]:mb-2",
  md: "gap-4 [&>[data-slot=field-legend]]:mb-4",
  lg: "gap-6 [&>[data-slot=field-legend]]:mb-6",
}

interface FieldSetProps extends React.ComponentProps<"fieldset"> {
  /**
   * 子の間隔（issue #714）。"sm"=8px / "md"=16px / "lg"=24px。
   * 指定すると FieldLegend の下にも同じ間隔を空ける（legend は flex の並びに入らないので gap が効かない）。
   * 未指定は従来どおり gap-6（24px）で、legend の直下は 0px のまま（見た目を変えないため）。
   * 絞り込みシートの選択肢グループのような詰めた並びは `gap="sm"` + `<FieldLegend size="sm">`。
   */
  gap?: FieldSetGap
}

/**
 * フォーム全体 / 大きな入力セクションを fieldset semantics で束ねる。
 * description・FieldGroup を 24px の縦リズムで配置する（legend の下の間隔は `gap` 指定時だけ付く）。
 */
function FieldSet({ className, gap, ...props }: FieldSetProps) {
  return (
    <fieldset
      data-slot="field-set"
      data-gap={gap}
      className={cn("m-0 flex min-w-0 flex-col gap-6 border-0 p-0", gap && fieldSetGapClasses[gap], className)}
      {...props}
    />
  )
}

interface FieldLegendProps extends React.ComponentProps<"legend"> {
  /**
   * 見出しの大きさ（issue #714）。
   * - "md"（既定）: typo-heading-md（フォームのセクション見出し・従来）
   * - "sm": typo-label-md + Text-Medium-Emphasis（絞り込みシートの選択肢グループ等の小見出し）
   */
  size?: "md" | "sm"
}

/** FieldSet のアクセシブルな見出し。 */
function FieldLegend({ className, size = "md", ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-size={size === "sm" ? "sm" : undefined}
      className={cn(
        size === "sm"
          ? "typo-label-md text-[var(--Text-Medium-Emphasis)]"
          : "typo-heading-md text-[var(--Text-High-Emphasis)]",
        className
      )}
      {...props}
    />
  )
}

interface FieldGroupProps extends React.ComponentProps<"div"> {
  /**
   * 並べ方（issue #720）。
   * - "stack"（既定）: 16px の縦リズム（従来）
   * - "rows": 区切り線の一覧。子の間に Border-Low-Emphasis の線（divide-y）を引き、直下の FormField に
   *   上下 12px（py-3）を付ける（issue #733）。FormField だけでなく Switch の行・ImageAttachmentPicker・Banner など
   *   FormField 以外の直下の要素にも付く（行ごとに py-3 / my-2 を手で書かない）。CollapsibleChipField は自前で py-3 を持つので
   *   二重にならない（対象外）。FieldSeparator / FieldLegend / FieldDescription / FieldError にも付けない。
   *   余白は詳細度 0（:where）なので、子の className の py-* が常に勝つ。詳細シートの「ラベル左置きの項目行」（FormField orientation="horizontal"）向け。FormField に className="py-3" を足さない
   */
  variant?: "stack" | "rows"
}

/** 関連する FormField 群を 16px の縦リズム（または区切り線の一覧）で束ねる。 */
function FieldGroup({ className, variant = "stack", ...props }: FieldGroupProps) {
  return (
    <div
      {...props}
      data-slot="field-group"
      data-variant={variant === "rows" ? "rows" : undefined}
      role="group"
      className={cn(
        variant === "rows"
          ? "flex min-w-0 flex-col divide-y divide-[var(--Border-Low-Emphasis)] [:where(&)>:where(:not([data-slot=collapsible-chip-field],[data-slot=field-separator],[data-slot=field-legend],[data-slot=field-description],[data-slot=field-error]))]:py-3"
          : "flex min-w-0 flex-col gap-4",
        className
      )}
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
export type { FieldGroupProps, FieldLegendProps, FieldSetGap, FieldSetProps }
export type FieldDescriptionProps = React.ComponentProps<"p">
export type FieldErrorProps = React.ComponentProps<"p">
export type FieldSeparatorProps = React.ComponentProps<"div">
