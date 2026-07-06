import React from "react";
export interface ShareButtonsProps {
    message?: string;
    url?: string;
    title?: string;
    /** カスタム共有先を追加したい場合 */
    extra?: {
        label: string;
        onPress: () => void;
    }[];
}
export declare function ShareButtons({ message, url, title, extra }: ShareButtonsProps): React.JSX.Element;
