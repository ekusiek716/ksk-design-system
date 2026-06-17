export interface TagInputProps {
    value?: string[];
    onChange?: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}
export declare function TagInput({ value, onChange, placeholder, maxTags }: TagInputProps): import("react/jsx-runtime").JSX.Element;
