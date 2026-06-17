export interface CheckboxCardProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    title: string;
    description?: string;
}
export declare function CheckboxCard({ checked, onChange, disabled, title, description, }: CheckboxCardProps): import("react/jsx-runtime").JSX.Element;
