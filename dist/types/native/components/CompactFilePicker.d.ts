import React from "react";
import { type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";
export interface CompactFilePickerProps {
    label?: React.ReactNode;
    description?: React.ReactNode;
    triggerLabel?: string;
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}
export interface NativeImageAttachment {
    id: string;
    uri?: string;
    source?: ImageSourcePropType;
    alt?: string;
    name?: string;
}
export interface ImageAttachmentPickerProps extends Omit<CompactFilePickerProps, "icon"> {
    images?: NativeImageAttachment[];
    onRemove?: (id: string) => void;
    removeLabel?: (image: NativeImageAttachment) => string;
    previewVariant?: "grid" | "list";
}
export declare function CompactFilePicker({ label, description, triggerLabel, icon, loading, disabled, onPress, style, }: CompactFilePickerProps): React.JSX.Element;
export declare function ImageAttachmentPicker({ images, onRemove, removeLabel, previewVariant, label, description, triggerLabel, ...props }: ImageAttachmentPickerProps): React.JSX.Element;
