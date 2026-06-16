import * as React from "react";
import { type CoachMarkVariant } from "@/components/ui/coach-mark";
export interface CoachStep {
    /** querySelector で要素を特定。要素が無ければ画面中央にフォールバック表示。 */
    selector: string;
    title: string;
    desc: string;
    /** ツールチップ位置。auto = 下に余白があれば下、なければ上 */
    placement?: "auto" | "top" | "bottom" | "left" | "right";
    /** spotlight outline の余白 (px、既定 8) */
    padding?: number;
}
export interface CoachMarkOverlayProps {
    steps: CoachStep[];
    open: boolean;
    onComplete: () => void;
    onSkip?: () => void;
    /** CoachMark の見た目（default / brand） */
    variant?: CoachMarkVariant;
    /** spotlight ring 色（CSS variable も可、既定 var(--Brand-Primary)） */
    ringColor?: string;
    /** content の最大幅 (px、既定 280) */
    maxWidth?: number;
}
/**
 * CoachMarkOverlay — 初回ユーザー向けの多ステップ onboarding ツアー。
 *
 * DS の単発 `<CoachMark>` をベースに、selector で複数要素を順番に
 * spotlight + tooltip 表示するツアー orchestrator。
 *
 * 仕組み:
 * 1. 各 step の DOM 要素を querySelector で取得 → BoundingRect の位置に
 *    invisible target を fixed 配置し `<CoachMark>` をアタッチ
 * 2. spotlight 効果は `outline + box-shadow: 0 0 0 9999px rgba(0,0,0,0.55)`
 *    で対象だけを切り抜き表示
 * 3. ツールチップは auto placement（下に余白あれば下、なければ上）
 * 4. 要素が見つからない step は画面中央に dark overlay 付きで表示
 *
 * 完了状態の永続化は `isCoachCompleted` / `markCoachCompleted` を使う:
 * ```tsx
 * import { CoachMarkOverlay, isCoachCompleted, markCoachCompleted } from "ksk-design-system"
 *
 * const [open, setOpen] = useState(false)
 * useEffect(() => {
 *   if (!isCoachCompleted()) setOpen(true)
 * }, [])
 *
 * <CoachMarkOverlay
 *   open={open}
 *   steps={[
 *     { selector: 'header', title: 'ここに日付', desc: '...' },
 *     { selector: '.fab-fixed', title: 'クイック追加', desc: '...' },
 *   ]}
 *   onComplete={() => { markCoachCompleted(); setOpen(false) }}
 *   onSkip={() => { markCoachCompleted(); setOpen(false) }}
 * />
 * ```
 */
export declare function CoachMarkOverlay({ steps, open, onComplete, onSkip, variant, ringColor, maxWidth, }: CoachMarkOverlayProps): React.ReactPortal;
/**
 * Onboarding 完了状態を localStorage で管理するヘルパー。
 * 複数アプリで使う際は keys を別にできるよう引数化可能。
 */
export declare function isCoachCompleted(key?: string, version?: string): boolean;
export declare function markCoachCompleted(key?: string, version?: string): void;
export declare function resetCoach(key?: string): void;
