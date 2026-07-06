import React from "react";
export interface TagInputProps {
    value?: string[];
    onChange?: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}
export declare function TagInput({ value, onChange, placeholder, maxTags }: TagInputProps): React.JSX.Element;
