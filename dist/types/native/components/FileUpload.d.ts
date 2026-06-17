export interface FileUploadProps {
    title?: string;
    description?: string;
    /** ファイル選択を起動するコールバック（Expo: expo-image-picker / DocumentPicker を呼び出す等） */
    onPress?: () => void;
    disabled?: boolean;
}
/**
 * ファイルピッカーをトリガするタッチ領域。実際の選択は consumer 側で
 * expo-image-picker / expo-document-picker を起動して使う。
 */
export declare function FileUpload({ title, description, onPress, disabled, }: FileUploadProps): import("react/jsx-runtime").JSX.Element;
