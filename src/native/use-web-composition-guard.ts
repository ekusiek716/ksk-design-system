import * as React from "react"
import { Platform, type TextInput } from "react-native"

/**
 * useWebCompositionGuard — react-native-web (RNW) 実行時のみ、DOM の
 * compositionstart/compositionend を TextInput の背後にある実 DOM ノードへ
 * 直接 addEventListener して拾うためのフック。
 *
 * RN の TextInputProps には compositionstart/end に相当する props が無いため、
 * ref 経由で DOM ノード (RNW 上では TextInput の ref が input/textarea 要素を指す) を
 * 取得し、ネイティブイベントを直接購読する。
 * ネイティブ実機 (Platform.OS !== 'web') では何もしない no-op。
 *
 * tsconfig.native.json は DOM lib を含まない構成のため、DOM 型を直接参照せず
 * 必要最小限の構造的インターフェース（WebInputLikeNode）でキャストして扱う。
 *
 * Commit系 (CommitInput / CommitTextarea / CommitAutoGrowTextarea) が共有する。
 */

/** RNW 上で TextInput の ref が指す DOM ノードの、本フックが必要とする最小限の形状。 */
interface WebCompositionEventLike {
  target: { value: string } | null
}
interface WebInputLikeNode {
  value: string
  addEventListener: (type: "compositionstart" | "compositionend", listener: (e: WebCompositionEventLike) => void) => void
  removeEventListener: (type: "compositionstart" | "compositionend", listener: (e: WebCompositionEventLike) => void) => void
}

export function useWebCompositionGuard(
  ref: React.RefObject<TextInput | null>,
  onStart: () => void,
  onEnd: (value: string) => void,
) {
  React.useEffect(() => {
    if (Platform.OS !== "web") return
    // RNW 上では TextInput インスタンス自体が DOM ノードとして振る舞う。
    const node = ref.current as unknown as WebInputLikeNode | null
    if (!node || typeof node.addEventListener !== "function") return

    const handleStart = () => onStart()
    const handleEnd = (e: WebCompositionEventLike) => {
      onEnd(e.target?.value ?? node.value)
    }

    node.addEventListener("compositionstart", handleStart)
    node.addEventListener("compositionend", handleEnd)
    return () => {
      node.removeEventListener("compositionstart", handleStart)
      node.removeEventListener("compositionend", handleEnd)
    }
  }, [ref, onStart, onEnd])
}
