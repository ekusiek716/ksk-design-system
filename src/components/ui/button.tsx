import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
// 純粋な variants 定義は React に依存しない別ファイルに切り出し。
// 同じ buttonVariants を `ksk-design-system/class-names` から Server Component
// 経由でも参照できるようにするため。詳細は server-variants/button-variants.ts。
import { buttonVariants } from "../../lib/server-variants/button-variants"
import { UNSTYLED_FOCUS_RING } from "../../lib/server-variants/unstyled"

/** navigator.vibrate のパターン (ms) */
const HAPTIC_PATTERNS: Record<string, number | number[]> = {
  light:   10,
  medium:  25,
  heavy:   50,
  warning: [30, 50, 30],
}

type HapticType = keyof typeof HAPTIC_PATTERNS

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** 子要素へ Button の見た目と操作属性を委譲する。リンクを Button として見せる場合に使用。 */
  asChild?: boolean
  /** モバイルでの触覚フィードバック。navigator.vibrate() を使用。未対応環境では無視される。 */
  haptic?: HapticType
  /**
   * 視覚クラスを一切出さず、挙動と a11y だけを提供する（issue #420）。
   *
   * 既存の手書き CSS を持つ画面を段階移行するときに使う。base の
   * `inline-flex / items-center / justify-center / gap / whitespace-nowrap /
   * typo-* / cursor-pointer` と variant / size / layout のクラスは
   * **全て出力されない**。維持されるのは
   * `type` 既定 `"button"` / disabled・aria-disabled 時の
   * preventDefault + stopPropagation / haptic / asChild と、
   * a11y のための focus-visible ring だけ。
   *
   * focus ring は className 側で `focus-visible:ring-0` 等を渡せば上書きできる。
   * `variant` / `size` / `layout` は無視され、`data-variant` / `data-size` は
   * `"unstyled"` になる。
   */
  unstyled?: boolean
  /**
   * 処理中の表現（opt-in・既定 false）。native Button の `loading` と同じ名前・意味。
   *
   * true のとき:
   * - ラベル（children）を透明にしてその上にスピナーを重ねる。ラベルは DOM に
   *   残るのでボタンの幅が変わらない（`loadingLabel` 指定時は幅が広がる場合がある）。
   * - `aria-busy="true"` と `aria-disabled="true"` を付け、クリックを握り潰す
   *   （type="submit" でもフォームを送信しない）。見た目は disabled と同じく半透明。
   * - ネイティブの `disabled` 属性は付けない。付けるとフォーカス中のボタンから
   *   フォーカスが body へ落ち、キーボード / スクリーンリーダー利用者が処理完了後に
   *   操作位置を見失うため（aria-disabled はフォーカスを保ったまま操作だけ止める）。
   * - スピナーは装飾扱い（aria-hidden）。処理中であることは aria-busy で伝え、
   *   アクセシブルネームは透明にしたラベルがそのまま担う。
   *
   * `asChild` 併用時: Slot は子を 1 つしか受け取れないためスピナーは出さず、
   * `aria-busy` と disabled 相当（aria-disabled・クリック抑止・tabIndex=-1）だけを子へ渡す。
   */
  loading?: boolean
  /**
   * loading 中にスピナーの横へ表示する文言（i18n 用。例: "保存中…"）。
   * 未指定ならスピナーのみ（native Button と同じく既定値は持たない）。
   * 指定時は元のラベルを読み上げ対象から外し、この文言がアクセシブルネームになる。
   */
  loadingLabel?: React.ReactNode
}

/**
 * Button — 汎用ボタン
 *
 * バリアントの使い分け:
 * - `default`: 主たる CTA（1 画面に 1〜2 個まで）。
 * - `secondary` / `tertiary`: 並列の選択肢・キャンセル。
 * - `ghost` / `link`: 文字寄りの controls。
 * - `destructive`: 削除・取り消しなど不可逆操作。
 * - `info` / `warning` / `success`: 状態色で種類や意味を伝えるボタン（issue #598）。
 *   ブランドに連動しない固定の状態色で、hover / active / disabled / focus ring まで DS が持つ。
 *   className で背景色を上書きしない。不可逆操作には warning ではなく destructive を使う。
 * - `glass` / `glass-inverse` / `glass-accent` / `accent`: モバイル / ヒーローセクション向け装飾系。
 *   `glass-accent` はブランドカラーをティントした glass。FAB（円形アイコンボタン）等、
 *   中立色の glass より一段強い存在感を出したい主要アクションに使う。
 * - `inverse` / `ghost-inverse`: 暗背景・ヒーローセクション上で使う反転バリアント。
 *
 * サイズ:
 * - `xs` / `sm` / `default` / `lg` / `xl`: 一般用途。
 * - `hero`: トップ hero / final-CTA 向けのピル型特大 CTA。
 * - `icon` / `icon-sm` / `icon-lg` / `icon-xl`: アイコンのみのボタン（aria-label 必須）。
 * - `xs` / `sm` / `icon-sm` は見た目が 44px 未満なので、透明な before 擬似要素で
 *   当たり判定だけ 44×44px に広げる（issue #601）。隣と当たり判定を重ねないには
 *   見た目の端同士を sm / icon-sm で 12px（gap-3）、xs で 20px（gap-5）以上空ける。
 *   glass 系 variant では `.glass-specular` が疑似要素と overflow:hidden を使うため拡張しない。
 *
 * 処理中:
 * - `loading`: 非同期処理の実行中に押せなくし、スピナーを出す（幅は変わらない）。
 *   `loadingLabel` で「保存中…」等の文言も出せる。
 *
 * 段階移行:
 * - `unstyled`: 既存の手書き CSS を持つ画面を移行するとき、見た目を DS 側で一切
 *   持たず挙動と a11y だけを提供する（issue #420）。README「段階移行レシピ」参照。
 */
function Button({
  className,
  variant,
  size,
  layout,
  asChild = false,
  haptic,
  unstyled = false,
  loading = false,
  loadingLabel,
  onClick,
  type,
  disabled,
  tabIndex,
  "aria-disabled": ariaDisabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled || loading || ariaDisabled === true || ariaDisabled === "true"

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (haptic && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(HAPTIC_PATTERNS[haptic])
      }
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
    },
    [haptic, isDisabled, onClick]
  )

  const handleDisabledCapture = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
    },
    []
  )

  const slottedChild = asChild && isDisabled && React.isValidElement<{
    onClick?: React.MouseEventHandler
    onClickCapture?: React.MouseEventHandler
    onAuxClickCapture?: React.MouseEventHandler
    onContextMenuCapture?: React.MouseEventHandler
    "aria-disabled"?: React.AriaAttributes["aria-disabled"]
    tabIndex?: number
    disabled?: boolean
    href?: string
  }>(children)
    ? React.cloneElement(children, {
        onClick: handleClick,
        onClickCapture: handleDisabledCapture,
        onAuxClickCapture: handleDisabledCapture,
        onContextMenuCapture: handleDisabledCapture,
        "aria-disabled": true,
        tabIndex: -1,
        disabled: undefined,
        ...(children.type === "a" ? { href: undefined } : {}),
      })
    : children

  return (
    <Comp
      data-slot="button"
      data-variant={unstyled ? "unstyled" : (variant ?? "default")}
      data-size={unstyled ? "unstyled" : (size ?? "default")}
      // 既定を type="button" にする。生 <button> の既定 "submit" は <form> 内で
      // 意図せぬ送信/リロードを起こす footgun（消費側は皆 type="submit" を明示済みで
      // 暗黙依存ゼロ＝非破壊）。明示された type="submit"/"reset" はそのまま尊重。
      type={asChild ? undefined : (type ?? "button")}
      disabled={asChild ? undefined : disabled}
      // loading は native disabled を使わず aria-disabled で止める（フォーカスを失わせないため。
      // 理由は ButtonProps.loading の JSDoc）。クリック抑止は handleClick の isDisabled 分岐。
      aria-disabled={(asChild && isDisabled) || loading ? true : ariaDisabled}
      aria-busy={loading || undefined}
      tabIndex={asChild && isDisabled ? -1 : tabIndex}
      // unstyled: 寸法・配色・タイポ・radius・flex 配置は一切出さず、
      // a11y のための focus ring だけを残す（issue #420）。
      className={
        unstyled
          ? cn(UNSTYLED_FOCUS_RING, className)
          : cn(buttonVariants({ variant, size, layout, className }))
      }
      onClick={asChild && isDisabled ? undefined : handleClick}
      {...props}
    >
      {loading && !asChild ? (
        <ButtonLoadingContent loadingLabel={loadingLabel}>{children}</ButtonLoadingContent>
      ) : (
        slottedChild
      )}
    </Comp>
  )
}

/**
 * loading 中の中身。元のラベルと「スピナー（+ loadingLabel）」を同じグリッドセルに
 * 重ね、ラベル側を透明にする。グリッドの幅は両者の大きい方になるので、
 * loadingLabel 無し（スピナーのみ）なら元のラベル幅がそのまま保たれる。
 *
 * - ラベル側は `opacity-0`（`invisible` / `display:none` ではない）。visibility を
 *   消すとアクセシビリティツリーからも外れ、ボタンのアクセシブルネームが空になる。
 * - 内側の span はボタン本体と同じ `inline-flex items-center gap-[var(--Control-Gap)]`
 *   を持ち、アイコン + テキストの並びと幅を loading 前と揃える。
 * - スピナーは Spinner 部品ではなく span で描く。Spinner は div（button の中に置けない
 *   フロー要素）で role="status" を持ち、色も Brand 固定で塗りボタン上では見えないため。
 *   色は border-current でボタンの文字色（variant が明示している）に追従させる
 *   （SyncStatusBadge / StatusActionBadge のスピナーと同じ描き方）。
 */
function ButtonLoadingContent({
  loadingLabel,
  children,
}: {
  loadingLabel?: React.ReactNode
  children?: React.ReactNode
}) {
  const hasLabel = loadingLabel != null && loadingLabel !== false && loadingLabel !== ""
  return (
    <span data-slot="button-loading" className="inline-grid items-center justify-items-center">
      <span
        aria-hidden={hasLabel || undefined}
        className="col-start-1 row-start-1 inline-flex items-center justify-center gap-[var(--Control-Gap)] opacity-0"
      >
        {children}
      </span>
      <span className="col-start-1 row-start-1 inline-flex items-center justify-center gap-[var(--Control-Gap)]">
        <span
          data-slot="button-spinner"
          aria-hidden="true"
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        {hasLabel ? <span>{loadingLabel}</span> : null}
      </span>
    </span>
  )
}

export { Button, buttonVariants }
export type { ButtonProps, HapticType }
