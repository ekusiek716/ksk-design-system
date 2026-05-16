import * as React from "react";
import type { Label as LabelPrimitive } from "radix-ui";
import { Slot } from "@radix-ui/react-slot";
import { type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";
/**
 * Form — react-hook-form 統合フォームラッパー
 *
 * FormProvider のラッパー。useForm() の戻り値を渡すことで、
 * ネストされた FormField が自動的にフォーム状態にアクセスできる。
 *
 * ### 使用例
 * ```tsx
 * const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
 *
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormField
 *       control={form.control}
 *       name="email"
 *       render={({ field }) => (
 *         <FormItem>
 *           <FormLabel>メールアドレス</FormLabel>
 *           <FormControl>
 *             <Input placeholder="example@email.com" {...field} />
 *           </FormControl>
 *           <FormMessage />
 *         </FormItem>
 *       )}
 *     />
 *     <Button type="submit">送信</Button>
 *   </form>
 * </Form>
 * ```
 *
 * ### AI 向け使用ルール
 * - react-hook-form + zod での使用を推奨
 * - FormControl でラップしたコンポーネントに自動的に aria-describedby / aria-invalid が付与される
 * - FormMessage はエラー時のみ表示される
 */
declare const Form: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>(props: import("react-hook-form").FormProviderProps<TFieldValues, TContext, TTransformedValues>) => React.JSX.Element;
declare function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ ...props }: ControllerProps<TFieldValues, TName>): import("react/jsx-runtime").JSX.Element;
declare const useFormField: () => {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isValidating: boolean;
    error?: import("react-hook-form").FieldError;
    id: string;
    name: string;
    formItemId: string;
    formDescriptionId: string;
    formMessageId: string;
};
declare function FormItem({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function FormLabel({ className, required, children, ...props }: React.ComponentProps<typeof LabelPrimitive.Root> & {
    required?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function FormControl({ ...props }: React.ComponentProps<typeof Slot>): import("react/jsx-runtime").JSX.Element;
declare function FormDescription({ className, ...props }: React.ComponentProps<"p">): import("react/jsx-runtime").JSX.Element;
declare function FormMessage({ className, ...props }: React.ComponentProps<"p">): import("react/jsx-runtime").JSX.Element;
export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, };
