import * as React from "react";
interface ImageUploaderImage {
    src: string;
    alt: string;
}
interface ImageUploaderProps extends React.ComponentProps<"div"> {
    images?: ImageUploaderImage[];
    onAdd?: () => void;
    onRemove?: (index: number) => void;
    maxImages?: number;
    columns?: number;
}
declare function ImageUploader({ images, onAdd, onRemove, maxImages, columns, className, ...props }: ImageUploaderProps): React.JSX.Element;
export { ImageUploader };
