import * as React from "react";
interface NotificationItem {
    id: string;
    message: string;
    date: string;
    isUnread?: boolean;
    href?: string;
}
interface NotificationListProps extends React.ComponentProps<"div"> {
    notifications: NotificationItem[];
    variant?: "vertical" | "horizontal";
    emptyMessage?: string;
}
declare function NotificationList({ notifications, variant, emptyMessage, className, ...props }: NotificationListProps): React.JSX.Element;
export { NotificationList };
export type { NotificationItem };
