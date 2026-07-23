import * as React from "react";
/**
 * フォーム全体 / 大きな入力セクションを fieldset semantics で束ねる。
 * legend・description・FieldGroup を 24px の縦リズムで配置する。
 */
declare function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">): React.JSX.Element;
/** FieldSet のアクセシブルな見出し。 */
declare function FieldLegend({ className, ...props }: React.ComponentProps<"legend">): React.JSX.Element;
/** 関連する FormField 群を 16px の縦リズムで束ねる。 */
declare function FieldGroup({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
/** FieldSet / FieldGroup に対する補足文。 */
declare function FieldDescription({ className, ...props }: React.ComponentProps<"p">): React.JSX.Element;
/** グループ単位のエラー。空なら不要な alert DOM を出さない。 */
declare function FieldError({ className, children, ...props }: React.ComponentProps<"p">): React.JSX.Element;
/** FieldGroup 間の区切り。children がある場合は中央ラベルとして表示する。 */
declare function FieldSeparator({ className, children, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export { FieldSet, FieldLegend, FieldGroup, FieldDescription, FieldError, FieldSeparator, };
export type FieldSetProps = React.ComponentProps<"fieldset">;
export type FieldLegendProps = React.ComponentProps<"legend">;
export type FieldGroupProps = React.ComponentProps<"div">;
export type FieldDescriptionProps = React.ComponentProps<"p">;
export type FieldErrorProps = React.ComponentProps<"p">;
export type FieldSeparatorProps = React.ComponentProps<"div">;
