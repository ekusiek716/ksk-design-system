import * as React from "react"

// ============================================================================
// モーダル層の「開いた順」スタック（#158 / #166 / #340）
// ----------------------------------------------------------------------------
// Portal に載る Overlay / Content は DOM の親子関係を失うため、重なり順は
// z-index だけが頼りになる。ところが Sheet / Dialog / AlertDialog はそれぞれ
// 固定の z（--Z-Overlay / --Z-Modal、Alert は --Z-Alert-Overlay / --Z-Alert）を
// 使うので、同じ層の 2 枚が同時に開くと勝敗が DOM のマウント順という運任せに
// なる。Sheet だけは #158 でこのスタックを持っていたが、Dialog / AlertDialog は
// 参加していなかったため、
//   - 多段 Sheet（content = 60 + 段数*20）の上に Dialog(60) を開くと必ず隠れる
//   - Sheet(60) と Dialog(60) が並ぶと DOM 順で勝敗が決まる
// という穴が残っていた（#340）。ここを共有モジュールに切り出し、Sheet /
// Dialog / AlertDialog が同じ 1 本のスタックに参加することで「後から開いた
// モーダルが必ず前面」を成立させる。
//
// React Context ではなくモジュールレベルのレジストリを使うのは、2 つのモーダルが
// 同じツリーを共有する保証が無いため（片方の trigger がもう片方の content の
// *外側* に居ることがある）。グローバルな「誰が・いつ開いたか」なら React ツリー上の
// 位置に依存しない。
// ============================================================================

// preset.css の --Z-* と同じ値。インラインの数値 z-index を算術で積むため
// CSS 変数のままでは扱えず、ここに数値で持つ。ズレると多段モーダルの重なりが
// 壊れるので __tests__/z-index-scale-contract.test.ts で preset.css との一致を
// 検査している。
export const MODAL_OVERLAY_BASE_Z = 50
export const MODAL_CONTENT_BASE_Z = 60
export const ALERT_OVERLAY_BASE_Z = 900
export const ALERT_CONTENT_BASE_Z = 910

// 1 段あたりの加算幅と上限。
//
// 通常モーダル（Sheet / Dialog）: --Z-Modal(60) と --Z-Alert-Overlay(900) の間に
// 840 の余白があるので、20 刻み × 8 段（= 220）でも Alert 層には届かない。
// 8 段は「現実的なネストの上限」で、それを超えたぶんは飽和させる（上限を超えて
// 積み続けると Alert / Popover を突き抜け、確認ダイアログが背後に回るという
// もっと悪い壊れ方になる。飽和させれば最悪でも同段どうしの DOM 順勝負に戻るだけ）。
export const MODAL_STACK_STEP = 20
export const MODAL_STACK_MAX_LEVEL = 8

// Alert 層（AlertDialog / ConfirmDialog）: --Z-Alert(910) の上は
// --Z-Coachmark-Overlay(950) までしか余白が無いため刻みを小さく取る。
// 刻みは overlay→content の差（10）より大きくする必要がある。10 以下だと
// 「n 段目の overlay」が「n-1 段目以下の content」と同値以上になり、下の
// アラートの本体が上のアラートの scrim に沈む/同値で並ぶ。12 刻み × 3 段で
// 最大 946 に収まり、Coachmark 層を侵さない。3 段を超えるアラートの入れ子は
// 設計として既に破綻しているので飽和で十分（基底 900 が通常モーダルを常に
// 上回るので、飽和しても「アラートが Sheet/Dialog の下に潜る」ことは無い）。
export const ALERT_STACK_STEP = 12
export const ALERT_STACK_MAX_LEVEL = 3

/**
 * スタック段数から実際の z-index を求める純粋関数。
 * `level` は上限で飽和させる（理由は上のコメント）。
 */
export function resolveStackedZ(
  base: number,
  level: number,
  step: number,
  maxLevel: number
): number {
  const clamped = Math.min(Math.max(0, level), maxLevel)
  return base + clamped * step
}

/** 通常モーダル（Sheet / Dialog）の scrim の z。 */
export function modalOverlayZ(level: number): number {
  return resolveStackedZ(MODAL_OVERLAY_BASE_Z, level, MODAL_STACK_STEP, MODAL_STACK_MAX_LEVEL)
}

/** 通常モーダル（Sheet / Dialog）本体の z。 */
export function modalContentZ(level: number): number {
  return resolveStackedZ(MODAL_CONTENT_BASE_Z, level, MODAL_STACK_STEP, MODAL_STACK_MAX_LEVEL)
}

/** Alert 層（AlertDialog / ConfirmDialog）の scrim の z。 */
export function alertOverlayZ(level: number): number {
  return resolveStackedZ(ALERT_OVERLAY_BASE_Z, level, ALERT_STACK_STEP, ALERT_STACK_MAX_LEVEL)
}

/** Alert 層（AlertDialog / ConfirmDialog）本体の z。 */
export function alertContentZ(level: number): number {
  return resolveStackedZ(ALERT_CONTENT_BASE_Z, level, ALERT_STACK_STEP, ALERT_STACK_MAX_LEVEL)
}

const modalStackOpenIds: string[] = []
const modalStackListeners = new Set<() => void>()

function modalStackNotify() {
  modalStackListeners.forEach((l) => l())
}

function modalStackOpen(id: string) {
  if (!modalStackOpenIds.includes(id)) modalStackOpenIds.push(id)
  modalStackNotify()
}

function modalStackClose(id: string) {
  const idx = modalStackOpenIds.indexOf(id)
  if (idx !== -1) modalStackOpenIds.splice(idx, 1)
  modalStackNotify()
}

function modalStackLevelOf(id: string): number {
  return Math.max(0, modalStackOpenIds.indexOf(id))
}

/**
 * グローバルな open-modal スタックの枠をマウント中だけ確保し、現在の深度
 * （0 = 最初に開いたモーダル）を返す。段は常に 0..n-1 に詰め直されるので、
 * 下のモーダルが先に閉じても z の算出式は安定したままになる。
 *
 * IMPORTANT: 確保/解放は render 中ではなく `useEffect` で行う。Sheet/Dialog の
 * Content コンポーネントは開閉に関係なく毎回レンダリングされるため、render 中に
 * 確保すると「ツリー順」を登録してしまい、かつ StrictMode の擬似再マウントで
 * 確保が落ちる（#158→#166 の不具合）。そのため本フックは
 * {@link ModalStackRegistrar} 専用で、Registrar は Radix の Presence が
 * *実際に開いている間だけ* マウントする Content の子として置く。
 *
 * Exported for unit testing only — not part of the public package API.
 */
export function useModalStackLevel(): number {
  const id = React.useId()
  React.useEffect(() => {
    modalStackOpen(id)
    return () => {
      modalStackClose(id)
    }
  }, [id])
  const subscribe = React.useCallback((onChange: () => void) => {
    modalStackListeners.add(onChange)
    return () => {
      modalStackListeners.delete(onChange)
    }
  }, [])
  const getSnapshot = React.useCallback(() => modalStackLevelOf(id), [id])
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/**
 * 親の `*Primitive.Content` が実際に DOM に居る間だけマウントされる極小
 * コンポーネント。マウント時にスタックの枠を確保し、アンマウントで解放して、
 * 現在の深度を `onLevelChange` で親へ返す。z の確定は open の 1 effect tick 後に
 * なるが、開くアニメーションが見える前に解決する 1 フレームの遅れに収まる。
 */
export function ModalStackRegistrar({
  onLevelChange,
}: {
  onLevelChange: (level: number) => void
}) {
  const level = useModalStackLevel()
  React.useEffect(() => {
    onLevelChange(level)
  }, [level, onLevelChange])
  return null
}
