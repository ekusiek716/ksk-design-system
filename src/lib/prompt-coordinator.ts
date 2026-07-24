import * as React from "react"

export const AUTO_PROMPT_SUPPRESSION_EVENT = "ksk:auto-prompt-suppression"

export type PromptSlotStatus = "idle" | "queued" | "active"

export interface PromptSlotOptions {
  priority?: number
}

export interface PromptSlot {
  status: PromptSlotStatus
  active: boolean
  request: () => void
  release: () => void
  cancel: () => void
}

export interface PromptCoordinatorSnapshot {
  activeId: string | null
  queuedIds: string[]
  suppressed: boolean
  suppress: (reason?: string) => () => void
}

export interface PromptCoordinatorProviderProps {
  children: React.ReactNode
  gapMs?: number
}

export interface AutoPromptRenderProps {
  open: boolean
  status: PromptSlotStatus
  close: () => void
}

export interface AutoPromptProps extends PromptSlotOptions {
  id: string
  when: boolean
  children: (props: AutoPromptRenderProps) => React.ReactNode
}

interface QueueEntry {
  id: string
  priority: number
  sequence: number
}

interface CoordinatorState {
  entries: QueueEntry[]
  activeId: string | null
}

interface PromptCoordinatorContextValue extends PromptCoordinatorSnapshot {
  request: (id: string, priority: number) => void
  release: (id: string) => void
  cancel: (id: string) => void
  statusOf: (id: string) => PromptSlotStatus
}

const PromptCoordinatorContext =
  React.createContext<PromptCoordinatorContextValue | null>(null)

let suppressionVersion = 0
const suppressionTokens = new Set<symbol>()
const suppressionListeners = new Set<() => void>()
const coordinatorWakeups = new Set<() => void>()

function notifySuppressionChanged() {
  suppressionVersion += 1
  suppressionListeners.forEach((listener) => listener())
  coordinatorWakeups.forEach((wake) => wake())
}

function subscribeSuppression(listener: () => void) {
  suppressionListeners.add(listener)
  return () => suppressionListeners.delete(listener)
}

function suppressionSnapshot() {
  void suppressionVersion
  return suppressionTokens.size > 0
}

function dispatchSuppressionEvent(detail: {
  suppressed: boolean
  reason: string
}) {
  const target = globalThis as unknown as {
    dispatchEvent?: (event: unknown) => void
    CustomEvent?: new (
      type: string,
      init: { detail: { suppressed: boolean; reason: string } },
    ) => unknown
  }
  if (!target.dispatchEvent || !target.CustomEvent) return
  target.dispatchEvent(
    new target.CustomEvent(AUTO_PROMPT_SUPPRESSION_EVENT, { detail }),
  )
}

export function isAutoPromptSuppressed() {
  return suppressionSnapshot()
}

export function suppressAutoPrompts(reason = "unspecified") {
  const token = Symbol(reason)
  let released = false
  suppressionTokens.add(token)
  notifySuppressionChanged()
  dispatchSuppressionEvent({ suppressed: true, reason })
  return () => {
    if (released) return
    released = true
    suppressionTokens.delete(token)
    notifySuppressionChanged()
    dispatchSuppressionEvent({
      suppressed: suppressionTokens.size > 0,
      reason,
    })
  }
}

function sortQueue(entries: QueueEntry[]) {
  return [...entries].sort(
    (left, right) =>
      right.priority - left.priority || left.sequence - right.sequence,
  )
}

export function PromptCoordinatorProvider({
  children,
  gapMs = 400,
}: PromptCoordinatorProviderProps) {
  const [state, setState] = React.useState<CoordinatorState>({
    entries: [],
    activeId: null,
  })
  const sequenceRef = React.useRef(0)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressed = React.useSyncExternalStore(
    subscribeSuppression,
    suppressionSnapshot,
    () => false,
  )

  const clearPromotionTimer = React.useCallback(() => {
    if (timerRef.current === null) return
    clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  const promote = React.useCallback(() => {
    if (suppressionSnapshot()) return
    setState((current) => {
      if (current.activeId !== null) return current
      const next = sortQueue(current.entries)[0]
      return next ? { ...current, activeId: next.id } : current
    })
  }, [])

  const schedulePromotion = React.useCallback(
    (delay: number) => {
      clearPromotionTimer()
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        promote()
      }, Math.max(0, delay))
    },
    [clearPromotionTimer, promote],
  )

  React.useEffect(() => clearPromotionTimer, [clearPromotionTimer])
  React.useEffect(() => {
    const wake = () => {
      if (!suppressionSnapshot()) schedulePromotion(0)
    }
    coordinatorWakeups.add(wake)
    return () => {
      coordinatorWakeups.delete(wake)
    }
  }, [schedulePromotion])

  const request = React.useCallback(
    (id: string, priority: number) => {
      setState((current) => {
        const existing = current.entries.find((entry) => entry.id === id)
        if (existing) {
          if (existing.priority === priority) return current
          return {
            ...current,
            entries: current.entries.map((entry) =>
              entry.id === id ? { ...entry, priority } : entry,
            ),
          }
        }
        sequenceRef.current += 1
        return {
          ...current,
          entries: [
            ...current.entries,
            { id, priority, sequence: sequenceRef.current },
          ],
        }
      })
      if (!suppressionSnapshot()) schedulePromotion(0)
    },
    [schedulePromotion],
  )

  const remove = React.useCallback(
    (id: string) => {
      setState((current) => ({
        activeId: current.activeId === id ? null : current.activeId,
        entries: current.entries.filter((entry) => entry.id !== id),
      }))
      schedulePromotion(gapMs)
    },
    [gapMs, schedulePromotion],
  )

  const statusOf = React.useCallback(
    (id: string): PromptSlotStatus => {
      if (state.activeId === id && !suppressed) return "active"
      return state.entries.some((entry) => entry.id === id) ? "queued" : "idle"
    },
    [state, suppressed],
  )

  const queuedIds = React.useMemo(
    () =>
      sortQueue(state.entries)
        .filter((entry) => entry.id !== state.activeId || suppressed)
        .map((entry) => entry.id),
    [state, suppressed],
  )

  const value = React.useMemo<PromptCoordinatorContextValue>(
    () => ({
      activeId: suppressed ? null : state.activeId,
      queuedIds,
      suppressed,
      suppress: suppressAutoPrompts,
      request,
      release: remove,
      cancel: remove,
      statusOf,
    }),
    [queuedIds, remove, request, state.activeId, statusOf, suppressed],
  )

  return React.createElement(PromptCoordinatorContext.Provider, { value }, children)
}

export function usePromptSlot(
  id: string,
  { priority = 0 }: PromptSlotOptions = {},
): PromptSlot {
  const coordinator = React.useContext(PromptCoordinatorContext)
  const [fallbackRequested, setFallbackRequested] = React.useState(false)
  const coordinatorRequest = coordinator?.request
  const coordinatorRelease = coordinator?.release
  const coordinatorCancel = coordinator?.cancel

  const request = React.useCallback(() => {
    if (coordinatorRequest) coordinatorRequest(id, priority)
    else setFallbackRequested(true)
  }, [coordinatorRequest, id, priority])
  const release = React.useCallback(() => {
    if (coordinatorRelease) coordinatorRelease(id)
    else setFallbackRequested(false)
  }, [coordinatorRelease, id])
  const cancel = React.useCallback(() => {
    if (coordinatorCancel) coordinatorCancel(id)
    else setFallbackRequested(false)
  }, [coordinatorCancel, id])

  React.useEffect(
    () => () => coordinatorCancel?.(id),
    [coordinatorCancel, id],
  )

  const status = coordinator
    ? coordinator.statusOf(id)
    : fallbackRequested
      ? "active"
      : "idle"
  return {
    status,
    active: status === "active",
    request,
    release,
    cancel,
  }
}

export function usePromptCoordinator(): PromptCoordinatorSnapshot {
  const coordinator = React.useContext(PromptCoordinatorContext)
  return coordinator ?? {
    activeId: null,
    queuedIds: [],
    suppressed: isAutoPromptSuppressed(),
    suppress: suppressAutoPrompts,
  }
}

export function AutoPrompt({
  id,
  priority = 0,
  when,
  children,
}: AutoPromptProps) {
  const { active, status, request, release, cancel } = usePromptSlot(id, {
    priority,
  })
  React.useEffect(() => {
    if (when) request()
    else cancel()
  }, [when, request, cancel])
  return children({
    open: active,
    status,
    close: release,
  })
}
