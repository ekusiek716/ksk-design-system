import * as React from "react";
interface CompactFilePickerProps extends Omit<React.ComponentProps<"input">, "children" | "onChange" | "type"> {
    label?: React.ReactNode;
    description?: React.ReactNode;
    triggerLabel?: React.ReactNode;
    icon?: React.ReactNode;
    loading?: boolean;
    onFilesChange?: (files: File[]) => void;
    inputClassName?: string;
}
interface ImageAttachment {
    id: string;
    src: string;
    alt?: string;
    name?: string;
}
interface ImageAttachmentPickerProps extends Omit<CompactFilePickerProps, "accept" | "icon"> {
    images?: ImageAttachment[];
    accept?: string;
    onRemove?: (id: string) => void;
    removeLabel?: (image: ImageAttachment) => string;
    previewVariant?: "grid" | "list";
}
declare function CompactFilePicker({ className, inputClassName, label, description, triggerLabel, icon, loading, disabled, id, multiple, onFilesChange, ...inputProps }: CompactFilePickerProps): React.JSX.Element;
declare function ImageAttachmentPicker({ className, images, accept, previewVariant, triggerLabel, label, description, onRemove, removeLabel, ...props }: ImageAttachmentPickerProps): React.JSX.Element;
export { CompactFilePicker, ImageAttachmentPicker };
export type { CompactFilePickerProps, ImageAttachment, ImageAttachmentPickerProps };
