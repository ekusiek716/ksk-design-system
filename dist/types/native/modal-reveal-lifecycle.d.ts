type AnimationComplete = (finished: boolean) => void;
type StartAnimation = (complete: AnimationComplete) => void;
export interface RevealLifecycleDelays {
    /** 入口アニメーションが完了しなかった場合に最終状態へ復旧するまでの猶予 */
    animationFallbackDelay: number;
    /** Modal の onShow が届かなかった場合に最終状態へ復旧するまでの猶予 */
    showFallbackDelay: number;
}
/**
 * Modal の表示完了（onShow）を起点に入口アニメーションを開始し、
 * 「不可視な Modal だけが残って操作を遮断する」状態に落ちないよう二重に保険を張る。
 *
 * - onShow は来たがアニメーションが完了しない  → animationFallbackDelay 後に最終状態へ復旧（#248）
 * - onShow がそもそも届かない                  → showFallbackDelay 後に最終状態へ復旧（#250）
 *
 * cancel 後に古い animation callback / timer が到着しても次の open へ影響させない。
 */
export declare function createRevealLifecycle({ animationFallbackDelay, showFallbackDelay, }: RevealLifecycleDelays): {
    cancel: () => void;
    onOpen: (revealAtFinalState: () => void) => void;
    onModalShow: (startAnimation: StartAnimation, revealAtFinalState: () => void) => void;
};
/**
 * Modal のライフサイクルには依存しないが、途中で落ちると要素が不可視のまま残る
 * 単発アニメーション（emoji のバウンス等）用の保険。
 * 戻り値を cleanup で呼ぶと保険ごと解除する。
 */
export declare function startAnimationWithFallback(fallbackDelay: number, startAnimation: StartAnimation, revealAtFinalState: () => void): () => void;
export {};
