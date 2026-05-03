export interface UploadedFile {
    file: File;
    url: string;
}
export interface FileUploadProps {
    /** 受け付けるファイル形式。例: "image/*", ".pdf,.doc" */
    accept?: string;
    /** 最大ファイルサイズ（バイト）。例: 5 * 1024 * 1024 = 5MB */
    maxSize?: number;
    /** 複数ファイルを許可するか @default false */
    multiple?: boolean;
    /** 最大ファイル数（multiple=true 時）@default 10 */
    maxFiles?: number;
    onUpload?: (files: File[]) => void;
    disabled?: boolean;
    className?: string;
    /** ドラッグエリアのメインラベル @default "ここにファイルをドロップ" */
    dragLabel?: string;
    /** またはテキスト @default "または" */
    orLabel?: string;
    /** ブラウズボタンのラベル @default "ファイルを選択" */
    browseLabel?: string;
    /** ファイルサイズ超過エラーメッセージ生成関数 */
    maxSizeLabel?: (maxBytes: number) => string;
    /** 最大ファイル数超過エラーメッセージ生成関数 */
    maxFilesLabel?: (max: number) => string;
    /** 削除ボタンの aria-label @default "削除" */
    removeLabel?: string;
}
declare function FileUpload({ accept, maxSize, multiple, maxFiles, onUpload, disabled, className, dragLabel, orLabel, browseLabel, maxSizeLabel, maxFilesLabel, removeLabel, }: FileUploadProps): import("react/jsx-runtime").JSX.Element;
export { FileUpload };
