interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /**
     * 処理中に表示するラベル。
     * i18n 対応: 英語では "Processing…" など任意文字列を渡す。
     * @default "処理中…"
     */
    loadingLabel?: string;
    /** destructive にすると確認ボタンが赤くなる */
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
}
declare function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, cancelLabel, loadingLabel, variant, onConfirm, loading, }: ConfirmDialogProps): import("react/jsx-runtime").JSX.Element;
export { ConfirmDialog };
export type { ConfirmDialogProps };
