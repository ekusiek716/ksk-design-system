export interface SectionHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        onPress: () => void;
    };
    variant?: "default" | "subtle";
}
export declare function SectionHeader({ title, description, action, variant }: SectionHeaderProps): import("react/jsx-runtime").JSX.Element;
