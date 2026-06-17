export interface AlertDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    destructive?: boolean;
}
export declare function AlertDialog({ open, onClose, title, description, confirmLabel, cancelLabel, onConfirm, destructive, }: AlertDialogProps): import("react/jsx-runtime").JSX.Element;
