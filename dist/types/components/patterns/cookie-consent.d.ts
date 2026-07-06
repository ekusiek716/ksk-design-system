import * as React from "react";
export type CookieConsentChoice = "accept" | "essential";
export interface CookieConsentProps {
    /**
     * 表示文言。i18n はアプリ側で解決して string で渡す。
     * 未指定キーは英語デフォルトを使う。
     */
    labels?: {
        title?: string;
        description?: string;
        /** "必要なもののみ" ボタン */
        essentialOnly?: string;
        /** "了解" / "すべて受け入れる" ボタン */
        accept?: string;
        /** aria-label */
        ariaLabel?: string;
    };
    /** 表示前の遅延 (ms)。レイアウトシフト回避用。既定 1500ms */
    showDelay?: number;
    /** localStorage キー名（マルチアプリの衝突回避に） */
    storageKey?: string;
    /** 同意決定時に dispatch する CustomEvent 名 */
    eventName?: string;
    /** 装飾アイコン（既定: 🍪） */
    icon?: React.ReactNode;
    /** 同意決定時のコールバック */
    onDecide?: (choice: CookieConsentChoice) => void;
    className?: string;
}
/** 同意済かどうかを判定（SSR セーフ） */
export declare function isCookieDecided(storageKey?: string): boolean;
/**
 * CookieConsent — GDPR / APPI 準拠の汎用クッキー同意バナー。
 *
 * 動作:
 *  - 未決定なら `showDelay` 後に画面下に表示
 *  - 「必要なもののみ」「了解」の 2 択。どちらでも localStorage に記録
 *  - 決定時に `CustomEvent(eventName)` を window に dispatch
 *    （CoachMark 等、同意後に出すべき UI が listen できる）
 *
 * 文言は labels prop で完全に上書き可能。i18n はアプリ側で解決して渡す。
 *
 * ### 使用例
 * ```tsx
 * import { CookieConsent, isCookieDecided } from "ksk-design-system"
 * import { t } from "./i18n"
 *
 * <CookieConsent
 *   labels={{
 *     title: t("cookie.title"),
 *     description: t("cookie.desc"),
 *     essentialOnly: t("cookie.essential_only"),
 *     accept: t("cookie.accept"),
 *     ariaLabel: t("cookie.aria_label"),
 *   }}
 *   storageKey="myapp-cookie-consent"
 *   eventName="myapp:cookie-decided"
 *   onDecide={(choice) => analytics.track("cookie_consent", { choice })}
 * />
 * ```
 */
export declare function CookieConsent({ labels, showDelay, storageKey, eventName, icon, onDecide, className, }: CookieConsentProps): React.JSX.Element;
