import * as React from "react"

// ============================================================================
// フォーカストラップ（#504）
// ----------------------------------------------------------------------------
// Dialog / Sheet は Radix の FocusScope がトラップを担うが、画面全体を暗転させて
// 対象だけを切り抜く CoachMarkOverlay のような面は Dialog の content に収まらず、
// Radix のトラップに乗れない。さらにこの手の面は「枠（overlay）」と「操作子
// （Portal 済みの吹き出し）」が DOM 上で別の場所に居るため、単一コンテナ前提の
// 実装では操作子を拾えない。
//
// そこで複数コンテナを 1 つのトラップとして扱えるフックを DS 側に持つ。
// consumer が同じものを自前で書かなくて済むように公開 API にしている。
// ============================================================================

/** トラップ対象のコンテナ。ref / 生ノードのどちらでも渡せる。 */
export type FocusTrapContainer =
  | HTMLElement
  | null
  | undefined
  | React.RefObject<HTMLElement | null>

export interface UseFocusTrapOptions {
  /** トラップを有効にするか（面が開いている間だけ true にする）。 */
  active: boolean
  /**
   * トラップ対象。Portal で DOM 上バラける面を 1 つのトラップにまとめられるよう
   * 複数受ける。配列は毎レンダー新しくなってよい（内部で ref に退避する）。
   * 中身が後から生える（Portal のマウント待ち）場合も、active になってから
   * 数フレームは探し直す。
   */
  containers: FocusTrapContainer[]
  /**
   * 有効化時に最初の focusable へフォーカスを移すか（既定 true）。
   * ref を渡すとその要素へ移す。false で自動フォーカスしない。
   */
  autoFocus?: boolean | React.RefObject<HTMLElement | null>
  /** 無効化時に、有効化前のフォーカス位置へ戻すか（既定 true）。 */
  restoreFocusOnClose?: boolean
  /** Escape で閉じたいときに渡す。未指定なら Escape を拾わない。 */
  onEscape?: () => void
}

// Radix / Dialog 側と同じ範囲。disabled と tabindex="-1" は除く。
const FOCUSABLE_SELECTOR = [
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ")

function resolveContainer(c: FocusTrapContainer): HTMLElement | null {
  if (!c) return null
  if (c instanceof HTMLElement) return c
  return c.current ?? null
}

function isVisible(el: HTMLElement): boolean {
  // jsdom には getClientRects の実体が無く常に 0 件になるため、
  // レイアウト計測ではなく「表示を消す指定が無いか」で判定する。
  if (el.hidden) return false
  if (el.closest("[hidden]")) return false
  if (typeof window === "undefined") return true
  const style = window.getComputedStyle(el)
  return style.visibility !== "hidden" && style.display !== "none"
}

function collectFocusable(containers: FocusTrapContainer[]): HTMLElement[] {
  const nodes: HTMLElement[] = []
  for (const c of containers) {
    const el = resolveContainer(c)
    if (!el) continue
    if (el.matches(FOCUSABLE_SELECTOR) && isVisible(el)) nodes.push(el)
    nodes.push(
      ...Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible)
    )
  }
  // コンテナが複数あると DOM 順が配列順と一致しないので、実際の文書順に並べ直す
  // （Tab の進む向きを DOM 順に合わせる）。
  return Array.from(new Set(nodes)).sort((a, b) => {
    const pos = a.compareDocumentPosition(b)
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

function containsTarget(containers: FocusTrapContainer[], target: EventTarget | null): boolean {
  if (!(target instanceof Node)) return false
  return containers.some((c) => resolveContainer(c)?.contains(target) ?? false)
}

/**
 * 複数コンテナをまとめて 1 つのフォーカストラップにするフック（#504）。
 *
 * `aria-modal="true"` を名乗る面は「外は不活性」と支援技術に宣言しているので、
 * Tab で背面へ抜けられてはいけない。Dialog / Sheet に収まらない自前の面
 * （スポットライト型のオンボーディング等）で使う。
 *
 * ```tsx
 * const rootRef = React.useRef<HTMLDivElement>(null)
 * const [balloon, setBalloon] = React.useState<HTMLElement | null>(null)
 * useFocusTrap({
 *   active: open,
 *   containers: [rootRef, balloon],   // Portal で外に出る面も一緒に閉じ込める
 *   onEscape: () => setOpen(false),
 * })
 * ```
 */
export function useFocusTrap({
  active,
  containers,
  autoFocus = true,
  restoreFocusOnClose = true,
  onEscape,
}: UseFocusTrapOptions): void {
  // 配列・コールバックは毎レンダー作り直されるのが普通なので、effect の再実行
  // （= トラップの張り直しと初期フォーカスのやり直し）を避けるため ref に退避する。
  // 代入は render 中ではなく effect で行う（render 中の ref 書き換えは React の
  // 規約違反で、並行レンダリング下では捨てられるレンダーの値が残りうる）。
  const containersRef = React.useRef(containers)
  const onEscapeRef = React.useRef(onEscape)
  const autoFocusRef = React.useRef(autoFocus)
  const restoreRef = React.useRef(restoreFocusOnClose)
  React.useEffect(() => {
    containersRef.current = containers
    onEscapeRef.current = onEscape
    autoFocusRef.current = autoFocus
    restoreRef.current = restoreFocusOnClose
  })

  React.useEffect(() => {
    if (!active || typeof document === "undefined") return

    const previouslyFocused = document.activeElement as HTMLElement | null

    // 初期フォーカス。Portal 側の操作子は 1〜2 フレーム遅れて生えることがある
    // ので、見つかるまで数フレームだけ探し直す（無ければ諦めて何もしない）。
    let raf = 0
    let attempts = 0
    const focusInitial = () => {
      const target = autoFocusRef.current
      if (target === false) return
      if (target !== true && target?.current) {
        target.current.focus()
        return
      }
      const first = collectFocusable(containersRef.current)[0]
      if (first) {
        first.focus()
        return
      }
      if (attempts++ < 5) raf = requestAnimationFrame(focusInitial)
    }
    raf = requestAnimationFrame(focusInitial)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!onEscapeRef.current) return
        event.preventDefault()
        onEscapeRef.current()
        return
      }
      if (event.key !== "Tab") return
      const focusable = collectFocusable(containersRef.current)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeEl = document.activeElement as HTMLElement | null

      // 面の外に居る（別 Portal に逃げた / 背面をクリックした後）なら引き戻す。
      if (!containsTarget(containersRef.current, activeEl)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
        return
      }
      if (!event.shiftKey && activeEl === last) {
        event.preventDefault()
        first.focus()
        return
      }
      if (event.shiftKey && activeEl === first) {
        event.preventDefault()
        last.focus()
      }
    }

    // capture: 背面のコンポーネントが keydown を止めていてもトラップは効かせる。
    document.addEventListener("keydown", onKeyDown, true)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("keydown", onKeyDown, true)
      if (restoreRef.current && previouslyFocused?.isConnected) {
        previouslyFocused.focus()
      }
    }
  }, [active])
}
