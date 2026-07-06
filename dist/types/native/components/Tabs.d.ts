import React from "react";
export interface TabsProps {
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
}
export declare function Tabs({ value, onChange, children }: TabsProps): React.JSX.Element;
export interface TabsListProps {
    scrollable?: boolean;
    children: React.ReactNode;
}
export declare function TabsList({ scrollable, children }: TabsListProps): React.JSX.Element;
export interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    disabled?: boolean;
}
export declare function TabsTrigger({ value, children, disabled }: TabsTriggerProps): React.JSX.Element;
export interface TabsContentProps {
    value: string;
    children: React.ReactNode;
}
export declare function TabsContent({ value, children }: TabsContentProps): React.JSX.Element;
