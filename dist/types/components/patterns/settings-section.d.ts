import * as React from "react";
type SettingsSectionVariant = "group" | "card" | "danger";
interface SettingsSectionProps extends Omit<React.ComponentProps<"section">, "title"> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    variant?: SettingsSectionVariant;
}
interface SettingsListRowProps extends Omit<React.ComponentProps<"div">, "title" | "onClick"> {
    title: React.ReactNode;
    description?: React.ReactNode;
    leading?: React.ReactNode;
    rightSlot?: React.ReactNode;
    interactive?: boolean;
    disabled?: boolean;
    destructive?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
declare function SettingsSection({ className, title, description, action, variant, children, ...props }: SettingsSectionProps): React.JSX.Element;
declare function SettingsListRow({ className, title, description, leading, rightSlot, interactive, disabled, destructive, onClick, children, ...props }: SettingsListRowProps): React.JSX.Element;
export { SettingsSection, SettingsListRow };
export type { SettingsListRowProps, SettingsSectionProps, SettingsSectionVariant };
