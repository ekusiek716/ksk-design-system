type AnimationComplete = (finished: boolean) => void
type StartAnimation = (complete: AnimationComplete) => void

/**
 * Modalの表示完了を起点に、入口アニメーション不完了時だけfallbackを実行する。
 * cancel後に古いanimation callbackが到着しても次のopenへ影響させない。
 */
export function createSheetRevealLifecycle(fallbackDelay: number) {
  let generation = 0
  let fallback: ReturnType<typeof setTimeout> | null = null

  const clearFallback = () => {
    if (fallback) {
      clearTimeout(fallback)
      fallback = null
    }
  }

  const cancel = () => {
    generation += 1
    clearFallback()
  }

  const onModalShow = (
    startAnimation: StartAnimation,
    revealAtInitialSnap: () => void,
  ) => {
    cancel()
    const currentGeneration = generation

    fallback = setTimeout(() => {
      if (generation !== currentGeneration) return
      fallback = null
      revealAtInitialSnap()
    }, fallbackDelay)

    startAnimation((finished) => {
      if (generation !== currentGeneration) return
      clearFallback()
      if (!finished) revealAtInitialSnap()
    })
  }

  return { cancel, onModalShow }
}
