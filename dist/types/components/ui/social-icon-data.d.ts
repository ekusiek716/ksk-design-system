import * as React from "react";
export interface SocialIconEntry {
    viewBox: string;
    body: React.ReactNode;
}
export type SocialIconTone = "mono" | "brand" | "gray";
export type SocialIconShape = "original" | "square" | "rounded-square" | "rounded";
export declare const SOCIAL_ICON_DATA: Record<string, Partial<Record<SocialIconShape, Partial<Record<SocialIconTone, SocialIconEntry>>>>>;
export declare const SOCIAL_ICON_PLATFORMS: readonly ["apple", "dribbble", "github", "medium", "messenger", "pinterest", "qiita", "reddit", "spotify", "telegram", "tiktok", "vimeo", "wantedly", "whatsapp"];
