/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { useReduceMotion, useReduceMotionState, type ReduceMotionState } from "../src/native/components/use-reduce-motion"

const os = vi.hoisted(() => ({ query: vi.fn(), subscribe: vi.fn(), remove: vi.fn() }))
vi.mock("react-native", () => ({ AccessibilityInfo: { isReduceMotionEnabled: os.query, addEventListener: os.subscribe } }))
let resolve: (value: boolean) => void
let reject: (error: Error) => void
let listener: (value: boolean) => void
let state: ReduceMotionState
let legacy: boolean
let host: HTMLDivElement
let root: ReturnType<typeof createRoot>
function Probe() {
  state = useReduceMotionState()
  legacy = useReduceMotion()
  return null
}
beforeEach(() => {
  os.query.mockReset(); os.subscribe.mockReset(); os.remove.mockReset()
  const pending = new Promise<boolean>((yes, no) => { resolve = yes; reject = no })
  os.query.mockReturnValue(pending)
  // Probe has two independent subscriptions; dispatch to both.
  const listeners: ((value: boolean) => void)[] = []
  os.subscribe.mockImplementation((_event, callback) => {
    listeners.push(callback); listener = value => listeners.forEach(fn => fn(value))
    return { remove: os.remove }
  })
  host = document.createElement("div"); root = createRoot(host)
  act(() => root.render(<Probe />))
})
afterEach(() => { act(() => root.unmount()) })
it("keeps motion gated until the initial query resolves while preserving the legacy boolean", async () => {
  expect(state).toEqual({ reduceMotion: false, resolved: false }); expect(legacy).toBe(false)
  await act(async () => resolve(true))
  expect(state).toEqual({ reduceMotion: true, resolved: true }); expect(legacy).toBe(true)
  act(() => listener(false))
  expect(state).toEqual({ reduceMotion: false, resolved: true }); expect(legacy).toBe(false)
})
it("does not overwrite a newer event with the stale initial response", async () => {
  act(() => listener(true))
  await act(async () => resolve(false))
  expect(state).toEqual({ reduceMotion: true, resolved: true }); expect(legacy).toBe(true)
})
it("leaves a failed query unresolved and can recover through an event", async () => {
  await act(async () => reject(new Error("unavailable")))
  expect(state.resolved).toBe(false)
  act(() => listener(false))
  expect(state).toEqual({ reduceMotion: false, resolved: true })
})
it("removes subscriptions and ignores late responses and events after unmount", async () => {
  act(() => root.unmount())
  expect(os.remove).toHaveBeenCalledTimes(2)
  const previous = state
  await act(async () => { listener(true); resolve(true) })
  expect(state).toBe(previous)
})
