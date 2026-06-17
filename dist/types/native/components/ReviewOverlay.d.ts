export interface ReviewOverlayProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    onSubmit?: (rating: number, comment: string) => void;
}
export declare function ReviewOverlay({ open, onClose, title, onSubmit, }: ReviewOverlayProps): import("react/jsx-runtime").JSX.Element;
