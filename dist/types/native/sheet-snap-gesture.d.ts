/**
 * snap mode bottom sheet のドラッグ判定（純ロジック）。
 *
 * Sheet.tsx の PanResponder は生成時のクロージャを保持し続けるため、
 * 可変値（props / 実測値）は毎回この関数の引数として渡す。
 * ここに閾値を集約してテスト可能にしておく。
 */
/** この量未満の縦移動では responder を奪わない（横スクロール等を邪魔しない） */
export declare const DRAG_THRESHOLD = 6;
/** ラバーバンドで許す最大はみ出し量 (px) */
export declare const RUBBER_MAX = 4;
/** close 判定：minSnap から panelH × この比率を超えて引いたら閉じる */
export declare const CLOSE_DRAG_RATIO = 0.18;
/** 上方向に 1 段階 snap を上げる閾値 */
export declare const UP_SNAP_DY = -20;
/** FULL から minSnap へ collapse する閾値 */
export declare const COLLAPSE_DY = 40;
export interface SnapGestureConfig {
    /** 昇順の snap 比率 */
    points: number[];
    minSnap: number;
    maxSnap: number;
    /** パネル高 = H × maxSnap。完全に閉じた位置の translateY でもある */
    panelH: number;
    /** 画面高 */
    H: number;
    dismissible: boolean;
}
export interface DragCaptureState {
    /** 現在の active snap 比率 */
    active: number;
    maxSnap: number;
    /** ScrollView の contentOffset.y */
    scrollTop: number;
    /** snap アニメーション実行中か */
    animating: boolean;
}
/**
 * ドラッグを sheet 側で受け取るか。
 * アニメーション中は受け取らない（開始位置がアニメ途中の値になり、パネルが飛ぶ）。
 * FULL では ScrollView が先頭にある時の下方向ドラッグだけ受け取る。
 */
export declare function shouldCaptureDrag(dy: number, state: DragCaptureState): boolean;
/** ドラッグ中の translateY（両端はラバーバンド） */
export declare function resolveDragTranslateY(startTY: number, dy: number, config: SnapGestureConfig): number;
export type ReleaseAction = {
    kind: "close";
} | {
    kind: "snap";
    snap: number;
};
/** 指を離した時の着地先。close は dismissible のときだけ返す。 */
export declare function resolveRelease(startTY: number, dy: number, startActive: number, config: SnapGestureConfig): ReleaseAction;
