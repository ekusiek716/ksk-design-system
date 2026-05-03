import * as React from "react";
interface BottomSheetFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    submitLabel?: string;
    cancelLabel?: string;
    onSubmit: () => void | Promise<void>;
    loading?: boolean;
    /** フォームコンテンツ */
    children: React.ReactNode;
    className?: string;
}
declare function BottomSheetForm({ open, onOpenChange, title, description, submitLabel, cancelLabel, onSubmit, loading, children, className, }: BottomSheetFormProps): import("react/jsx-runtime").JSX.Element;
export { BottomSheetForm };
export type { BottomSheetFormProps };
