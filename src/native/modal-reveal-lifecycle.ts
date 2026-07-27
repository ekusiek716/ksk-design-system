type AnimationComplete = (finished: boolean) => void
type StartAnimation = (complete: AnimationComplete) => void

export interface RevealLifecycleDelays {
  /** 入口アニメーションが完了しなかった場合に最終状態へ復旧するまでの猶予 */
  animationFallbackDelay: number
  /** Modal の onShow が届かなかった場合に最終状態へ復旧するまでの猶予 */
  showFallbackDelay: number
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
export function createRevealLifecycle({
  animationFallbackDelay,
  showFallbackDelay,
}: RevealLifecycleDelays) {
  let generation = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let revealedWithoutShow = false

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const cancel = () => {
    generation += 1
    revealedWithoutShow = false
    clearTimer()
  }

  const arm = (delay: number, run: () => void) => {
    const currentGeneration = generation
    timer = setTimeout(() => {
      if (generation !== currentGeneration) return
      timer = null
      run()
    }, delay)
  }

  /** open を検知した時点で呼ぶ。onShow が届かない環境のための保険。 */
  const onOpen = (revealAtFinalState: () => void) => {
    cancel()
    arm(showFallbackDelay, () => {
      revealedWithoutShow = true
      revealAtFinalState()
    })
  }

  const onModalShow = (
    startAnimation: StartAnimation,
    revealAtFinalState: () => void,
  ) => {
    // 保険が先に発火して既に最終状態なら、巻き戻して再生し直さない。
    if (revealedWithoutShow) {
      clearTimer()
      return
    }
    cancel()
    const currentGeneration = generation
    arm(animationFallbackDelay, revealAtFinalState)

    startAnimation((finished) => {
      if (generation !== currentGeneration) return
      clearTimer()
      if (!finished) revealAtFinalState()
    })
  }

  return { cancel, onOpen, onModalShow }
}

/**
 * Modal のライフサイクルには依存しないが、途中で落ちると要素が不可視のまま残る
 * 単発アニメーション（emoji のバウンス等）用の保険。
 * 戻り値を cleanup で呼ぶと保険ごと解除する。
 */
export function startAnimationWithFallback(
  fallbackDelay: number,
  startAnimation: StartAnimation,
  revealAtFinalState: () => void,
): () => void {
  let cancelled = false
  let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    timer = null
    if (!cancelled) revealAtFinalState()
  }, fallbackDelay)

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  startAnimation((finished) => {
    clear()
    if (!cancelled && !finished) revealAtFinalState()
  })

  return () => {
    cancelled = true
    clear()
  }
}
