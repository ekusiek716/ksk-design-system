import { useEffect, useState } from "react"
import { AccessibilityInfo } from "react-native"

export interface ReduceMotionState {
  reduceMotion: boolean
  /** 初回取得または設定変更イベントで OS 設定を確認できたか。 */
  resolved: boolean
}

/**
 * OS の「視差効果を減らす」設定を購読する。
 * !resolved || reduceMotion の間はアニメーションを開始せず、実行中なら停止すること。
 * 取得失敗時は未解決を維持し、後続の設定変更イベントで解決できる。
 */
export function useReduceMotionState(): ReduceMotionState {
  const [state, setState] = useState<ReduceMotionState>({ reduceMotion: false, resolved: false })

  useEffect(() => {
    let mounted = true
    let receivedEvent = false
    // react-native-web は matchMedia の無い環境（jsdom など）で購読を返さない（undefined）。
    // 型は常に返す前提なので、ここで undefined もあり得る形に広げ、後片付けで落ちないようにする（#757）。
    const subscription: { remove: () => void } | undefined = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        if (!mounted) return
        receivedEvent = true
        setState({ reduceMotion: enabled, resolved: true })
      },
    )
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      // 設定変更後に届いた初回取得結果で、新しい設定を巻き戻さない。
      if (mounted && !receivedEvent) setState({ reduceMotion: enabled, resolved: true })
    }).catch(() => {
      // 未取得のままにして、consumer の motion gate を閉じる。
    })
    return () => {
      mounted = false
      subscription?.remove()
    }
  }, [])

  return state
}

/** 既存内部呼び出し用。初回取得前は従来どおり false を返す。 */
export function useReduceMotion(): boolean {
  return useReduceMotionState().reduceMotion
}
