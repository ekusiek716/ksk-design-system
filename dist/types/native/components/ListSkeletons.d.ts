import React from "react";
export interface ListSkeletonsProps {
    count?: number;
    /** アイテムの形 */
    variant?: "row" | "card" | "list";
}
export interface ListSkeletonProps {
    rows?: number;
    hasFilter?: boolean;
    rowHeight?: number;
}
export interface GridSkeletonProps {
    rows?: number;
    columns?: number;
    cardHeight?: number;
}
export declare function ListSkeletons({ count, variant }: ListSkeletonsProps): React.JSX.Element;
export declare function ListSkeleton({ rows, hasFilter, rowHeight, }: ListSkeletonProps): React.JSX.Element;
export declare function GridSkeleton({ rows, columns, cardHeight, }: GridSkeletonProps): React.JSX.Element;
