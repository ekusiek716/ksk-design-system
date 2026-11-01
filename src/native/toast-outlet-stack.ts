import { useEffect, useSyncExternalStore } from "react"

/**
 * マウント中の `ToastOutlet`（通知の出口）を開いた順に積むスタック（issue #820）。
 *
 * iOS の RN では、すでに Sheet / Dialog を present している画面の上に、ルート直下の兄弟の `<Modal>` を
 * もう 1 枚 present できない（UIKit が "already presenting" で拒否する）。そのため通知用の Modal は作らず、
 * DS の Modal 系部品が自分の `<Modal>` の中身の最前面に `ToastOutlet` を置き、`ToastProvider` は
 * 一番最後に開いた出口（スタックの先頭）にだけ通知を描く。出口が 1 つも無ければ Provider 直下に描く。
 *
 * 登録は effect の登録と後始末の対で行う。StrictMode の二重 effect（登録→後始末→登録）でも、
 * 後始末で外して登録で末尾へ積み直すので、数も順序もずれない。
 * 同じ commit で入れ子の 2 つが同時に開いた場合は、React が子の effect を先に走らせるため
 * 外側が先頭になる（実際の UI では内側の Modal は外側を開いた後の操作で開くので、通常は起きない）。
 */
let stack: number[] = []
let nextId = 0
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

const getTop = () => (stack.length > 0 ? stack[stack.length - 1] : null)
const getServerTop = () => null

/** 出口ごとの一意な番号を払い出す（`useState` の lazy initializer で 1 回だけ呼ぶ）。 */
export function createToastOutletId(): number {
  nextId += 1
  return nextId
}

/** `enabled` の間だけ、出口 `id` をスタックの末尾（最前面）へ積む。 */
export function useToastOutletRegistration(id: number, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return
    stack = [...stack.filter((x) => x !== id), id]
    emit()
    return () => {
      stack = stack.filter((x) => x !== id)
      emit()
    }
  }, [id, enabled])
}

/** 最前面の出口の番号。出口が無ければ null。 */
export function useTopToastOutlet(): number | null {
  return useSyncExternalStore(subscribe, getTop, getServerTop)
}

/** テスト専用: 現在のスタック（開いた順）。 */
export function getToastOutletStackForTest(): readonly number[] {
  return stack
}
