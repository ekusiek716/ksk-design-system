import * as React from "react";
export interface SocialIconEntry {
    viewBox: string;
    body: React.ReactNode;
}
export type SocialIconTone = "mono" | "brand";
/** platform slug → 表示用ラベル */
export declare const SOCIAL_ICON_LABELS: Record<string, string>;
export declare const SOCIAL_ICON_DATA: Record<string, Partial<Record<SocialIconTone, SocialIconEntry>>>;
export declare const SOCIAL_ICON_PLATFORMS: readonly ["android", "apple", "apple-music", "apple-podcasts", "artstation", "baidu", "behance", "boosty", "devianart", "discord", "dprofile", "dribbble", "dzen", "facebook", "figma", "github", "gmail", "google", "google-meet", "google-play", "google-podcast", "imo", "instagram", "kickstarter", "line", "linkedin", "medium", "messenger", "microsoft-teams", "notion", "ok", "ok-only-sign", "onlyfans", "patreon", "paypal", "pinterest", "product-hunt", "qiita", "quora", "reddit", "signal", "sina-weibo", "skype", "slack", "snapchat", "soundcloud", "spotify", "stack-overflow", "telegram", "telegram-only-sign", "threads", "tiktok", "tinder", "tumblr", "twitch", "viber", "vimeo", "vk", "vk-music", "vk-only-sign", "wantedly", "wechat", "whatsapp", "x-ex-twitter", "xing", "yandex-music", "yelp", "youtube", "youtube-music", "youtube-shorts", "zoom"];
