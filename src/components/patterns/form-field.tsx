import * as React from "react"
import { cn } from "@/lib/utils"
import { useKskLabels } from "../ui/ksk-labels"
import { warnOnceInDev } from "@/lib/dev-warn"
import { FormFieldGroupLabelContext } from "./form-field-context"

/**
 * `required` の見た目をどう出すか。
 * - "asterisk"（既定）: `*` 1 文字。コンパクト・国際標準。
 * - "pill"   : 「必須」/「任意」のバッジ。日本語フォーム慣習。
 *              required=false でも「任意」を明示するため、optional 側の表示も
 *              この prop が制御する。
 * - "none"   : 何も出さない。required 単独で aria 属性のみ意味を持つ。
 */
type RequiredStyle = "asterisk" | "pill" | "none"

interface FormFieldProps extends React.ComponentProps<"div"> {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  description?: string
  /**
   * required の表示形式。詳細は RequiredStyle の JSDoc。
   * 既定: "asterisk"。
   */
  requiredStyle?: RequiredStyle
  /**
   * ラベル右側に置くメタ情報（バッジ / 文字数カウンタ / ヘルプアイコン等）。
   * 「タイトル + 字数 12/200」「タイトル + 種別バッジ」のような用途。
   */
  endLabel?: React.ReactNode
  /**
   * ラベルと入力欄の並べ方（issue #712）。
   * - "vertical"（既定）: ラベルを入力欄の上に置く（従来）
   * - "horizontal": ラベルを左の列、入力欄を右の列に置く「項目行」。説明文・エラーは入力欄の下
   *   （右の列）に出す。詳細シートの「かな / 肩書き / 住所」のような短い属性の一覧向け。
   *   枠の無い入力欄（`variant="inline"`）と組むときは `targetSize="comfortable"` で 44px の当たり判定を持たせる。
   *   置かれた場所の幅（@container）が 15rem（既定 labelWidth の 3 倍）未満なら縦積みに戻る。
   *   `endLabel` はラベル列ではなく入力欄の右に置く（狭いラベル列で潰れないため）。
   *   行の区切り線・行間は呼び出し側の並べ方（divide-y 等）に任せる
   */
  orientation?: "vertical" | "horizontal"
  /**
   * `orientation="horizontal"` の左のラベル列の幅（CSS の長さ）。既定 "5rem"（80px）。
   * 長いラベルは列の中で折り返す（切らない）。vertical では効かない。
   */
  labelWidth?: string
  /**
   * `orientation="horizontal"` のラベルの縦位置。
   * - "center"（既定）: 入力欄の行の中央にそろえる（1 行の入力欄）
   * - "start": 上端にそろえる（複数行の入力欄・チップの並び等、高さが伸びる中身）
   * 説明文・エラーは入力欄の下の行に出るので、center でもラベルは入力欄の行にそろったまま動かない。
   */
  labelAlign?: "center" | "start"
  /**
   * 右（下）に置く中身の種類（issue #720）。
   * - "field"（既定）: 入力欄 1 つ。ラベルは `<label htmlFor>`、子の要素に aria-invalid / aria-describedby を足す（従来）
   * - "group": チップ・トグル・ラジオ等の選択肢のまとまり。ラベルを `<span id>` で描き、中身の列を
   *   `role="group"` + `aria-labelledby`（説明文・エラーは aria-describedby）にする。htmlFor は使わない
   *   （渡すと開発ビルドで警告）。`<span>` + `<div role="group">` + `w-20` のラベルで行を自作しない。
   *   中の ChipSelector（single）は aria-label / aria-labelledby を省いても名前なしの警告を出さない（外側の group がこのラベルで名前を持つ。内側へ同じ名前は結ばない = 二重読み上げにしない。issue #734）。
   *   **required は読み上げに伝わらない**（role=group は aria-required を持てず、* / 必須バッジは aria-hidden）。
   *   必須であることは description（例: 「1 つ以上選んでください」）か label の文言で補う
   */
  as?: "field" | "group"
}

function FormField({
  className,
  label,
  htmlFor,
  required,
  error,
  description,
  requiredStyle = "asterisk",
  endLabel,
  orientation = "vertical",
  labelWidth = "5rem",
  labelAlign = "center",
  as = "field",
  children,
  style,
  ...props
}: FormFieldProps) {
  const hasLabelRow = endLabel != null
  // pill の「必須」「任意」は KskLabelsProvider の既定（無ければ日本語。issue #723）
  const defaultLabels = useKskLabels()

  // error / description を子フィールドへ aria で紐付ける。
  const reactId = React.useId()
  const descId = `${reactId}-desc`
  const errId = `${reactId}-err`
  const labelId = `${reactId}-label`
  const isGroup = as === "group"
  const groupWithHtmlFor = isGroup && htmlFor != null
  React.useEffect(() => {
    if (!groupWithHtmlFor) return
    warnOnceInDev(
      "form-field-group-html-for",
      'FormField as="group" では htmlFor は使われません（ラベルは span[id] で、中身の列を aria-labelledby で結びます）。htmlFor を外してください（issue #720）。'
    )
  }, [groupWithHtmlFor])
  const showDesc = description != null && !error
  const describedBy =
    [error ? errId : null, showDesc ? descId : null].filter(Boolean).join(" ") || undefined

  // 単一の要素 children のときだけ aria を注入（複数 / テキストはそのまま）。
  // as="group" では中身を role=group の列で包み、aria は列に付ける（子へは注入しない）。
  const field = isGroup
    ? <FormFieldGroupLabelContext.Provider value={labelId}>{children}</FormFieldGroupLabelContext.Provider>
    : React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        "aria-invalid": error
          ? true
          : (children as React.ReactElement<Record<string, unknown>>).props["aria-invalid"],
        "aria-describedby":
          [
            (children as React.ReactElement<Record<string, unknown>>).props["aria-describedby"],
            describedBy,
          ]
            .filter(Boolean)
            .join(" ") || undefined,
      })
    : children

  const LabelTag = isGroup ? "span" : "label"
  const labelOnly = (
    <LabelTag
      {...(isGroup ? { id: labelId } : { htmlFor })}
      className="typo-label-md text-[var(--Text-High-Emphasis)] inline-flex items-center gap-1.5"
    >
      {label}
      {requiredStyle === "asterisk" && required && (
        // required の * は Brand 色を使う。
        // Caution は「誤入力アラート」と視覚的に紛らわしく
        // フォームの「目立たせポイント」としては強すぎるため、
        // Brand 色で「ここは記入必須」と促す方が読みやすい。
        <span className="text-[var(--Brand-Primary)]" aria-hidden="true">
          *
        </span>
      )}
      {requiredStyle === "pill" && (
        <span
          className={cn(
            "typo-label-xs px-1.5 py-0.5 rounded",
            required
              ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Brand-Primary)]"
              : "bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)]"
          )}
          aria-hidden="true"
        >
          {required ? defaultLabels.required : defaultLabels.optional}
        </span>
      )}
    </LabelTag>
  )
  const groupProps = isGroup
    ? { role: "group" as const, "aria-labelledby": labelId, "aria-describedby": describedBy }
    : undefined
  const endLabelNode = (
    <div
      data-slot="form-field-end-label"
      className="typo-body-sm text-[var(--Text-Medium-Emphasis)] flex items-center"
    >
      {endLabel}
    </div>
  )
  const labelBlock = (
    <div
      className={cn(
        // endLabel が無いときは <label> 単体（既存の見た目を維持）。
        // 在るときだけ row 化して right に寄せる。
        hasLabelRow && "flex items-center justify-between gap-2"
      )}
    >
      {labelOnly}
      {endLabel && endLabelNode}
    </div>
  )

  const messages = (
    <>
      {description && !error && (
        <p id={descId} className="typo-body-sm text-[var(--Text-Low-Emphasis)]">
          {description}
        </p>
      )}
      {error && (
        <p
          id={errId}
          className="typo-body-sm text-[var(--Text-Caution)] flex items-center gap-1"
          role="alert"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4V7.5M7 9.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </>
  )

  if (orientation === "horizontal") {
    // 狭い置き場所（コンテナ幅 15rem = 既定 labelWidth の 3 倍未満）では縦積みに戻す（@container）。
    // 画面幅ではなく置かれた場所の幅で判定するので、シート・2 カラム等どこに置いても潰れない。
    // 2 列のときは 1 行目 = ラベル | 入力欄、2 行目以降 = (空) | 説明文・エラー。
    // ラベルは入力欄の行だけにそろうので、エラーが出てもラベルの位置は動かない。
    // endLabel（字数・バッジ等）は狭いラベル列で潰れないよう、入力欄の右に置く。
    return (
      <div
        data-slot="form-field"
        data-orientation="horizontal"
        className={cn("@container", className)}
        style={{ ...style, "--ksk-form-field-label-width": labelWidth } as React.CSSProperties}
        {...props}
      >
        <div
          data-slot="form-field-grid"
          className={cn(
            "grid grid-cols-1 gap-x-4 gap-y-1.5 @[15rem]:grid-cols-[var(--ksk-form-field-label-width)_minmax(0,1fr)]",
            labelAlign === "start" ? "items-start" : "items-center"
          )}
        >
          <div data-slot="form-field-label-cell" className="min-w-0 break-words">
            {labelOnly}
          </div>
          <div
            data-slot="form-field-control"
            className={cn("min-w-0", endLabel != null && "flex items-center gap-2")}
            {...groupProps}
          >
            {endLabel != null ? <div className="min-w-0 flex-1">{field}</div> : field}
            {endLabel != null && endLabelNode}
          </div>
          {((description && !error) || error) && (
            <div data-slot="form-field-messages" className="flex min-w-0 flex-col gap-1.5 @[15rem]:col-start-2">
              {messages}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="form-field"
      className={cn("flex flex-col gap-1.5", className)}
      style={style}
      {...props}
    >
      {labelBlock}
      {isGroup ? (
        <div data-slot="form-field-control" {...groupProps}>
          {field}
        </div>
      ) : (
        field
      )}
      {messages}
    </div>
  )
}

export { FormField }
export type { FormFieldProps, RequiredStyle }
