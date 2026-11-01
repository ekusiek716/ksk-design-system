import { useEffect, useSyncExternalStore } from "react"

/**
 * DS の native 部品が描いている RN `<Modal>` のうち、いま表示中のものの数（issue #820）。
 *
 * `ToastProvider` の既定 `presentation="auto"` が「Modal を開いている間だけ通知を Modal に描く」
 * 判断に使う。数えるのは src/native 配下で `<Modal>` を描く部品（Sheet / Dialog / Popover /
 * CoachMarkOverlay / CelebrationDialog / Celebration の overlay / ImageGallery のビューア）だけで、
 * consumer が自前で描く RN `<Modal>` は数えない（その場合は `presentation="modal"` を指定する）。
 *
 * 数は effect の登録と後始末の対で増減する。StrictMode の二重 effect（登録→後始末→登録）でも
 * 差し引き 1 になり、ずれない。
 */
let visibleCount = 0
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => visibleCount > 0
const getServerSnapshot = () => false

/**
 * `<Modal>` を描く部品が、その Modal の `visible` と同じ値を渡して呼ぶ。visible の間だけ 1 つ数える。
 */
export function useModalPresence(visible: boolean): void {
  useEffect(() => {
    if (!visible) return
    visibleCount += 1
    emit()
    return () => {
      visibleCount -= 1
      emit()
    }
  }, [visible])
}

/** DS の native Modal が 1 つ以上表示中か。開閉に追従して再描画される。 */
export function useAnyModalVisible(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** テスト専用: 現在の表示中の数。 */
export function getVisibleModalCountForTest(): number {
  return visibleCount
}
