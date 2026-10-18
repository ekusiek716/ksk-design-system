import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormFieldGroupLabelContext } from "@/lib/form-field-group-context"
import { warnOnceInDev } from "@/lib/dev-warn"
import { cn } from "@/lib/utils"

interface PillToggleOption<T extends string = string> {
  label: string
  value: T
  icon?: React.ReactNode
}

/**
 * onChange / onValueChange のどちらか一方は必須（両方 optional にすると
 * どちらも渡さずコンパイルが通り、全トリガーが無反応になる退行が起きるため、
 * ユニオン型で「少なくとも一方は必須」を型レベルで強制する）。
 *
 * 各 union メンバーに options/value/size/className を重複させているのは、
 * `BaseProps & (A | B)` の交差型にすると scripts/check-native-parity.mjs の
 * 正規表現ベースの props 抽出（型チェックまではしない軽量設計）が最初の
 * `{` だけを own-props body として読み、base 側のフィールドを見失うため。
 * 型レベルでは交差でも union 展開でも等価だが、抽出のしやすさを優先した。
 */
type PillToggleProps<T extends string = string> =
  | {
      options: PillToggleOption<T>[]
      value: T
      size?: "sm" | "md"
      /**
       * 横幅いっぱいに広げ、各項目を等幅にする（既定 false = ラベル幅のまま `w-fit`）。
       * 「全幅」と「等幅」を別 prop に分けていないのは、1 行固定の segmented control では
       * 全幅に広げた瞬間に余りをどう配るかを決める必要があり、等幅以外の配り方
       * （ラベル比で配る等）は選択肢の当たり判定がバラつくため採らないから（issue #500）。
       */
      fullWidth?: boolean
      className?: string
      /**
       * 読み上げ名（issue #741）。「何を選ぶ欄か」を伝える。見える見出しがあるなら aria-labelledby を使う。
       * FormField `as="group"` の中では省いてよい（`semantics="radio"` は radiogroup をそのラベルで名付ける）
       */
      "aria-label"?: string
      /** 見える見出しの id（issue #741）。aria-label より優先して読まれる */
      "aria-labelledby"?: string
      /**
       * 読み上げの役割（issue #741）。
       * - "tabs"（既定・従来どおり）: tablist / tab。画面内の表示の切り替え（一覧の絞り込み・週/月）
       * - "radio": radiogroup / radio。フォームの値選び（性別・単位など）。FormField `as="group"` の中ではこちらを推奨
       * どちらも矢印キーで選択が移り、Tab キーでは選択中の 1 つにだけ止まる。見た目は同じ
       */
      semantics?: "tabs" | "radio"
      onChange: (value: T) => void
      /**
       * @deprecated `onChange` を使ってください。後方互換のために残しているエイリアスで、
       * `onChange` が指定されている場合はそちらが優先されます。将来のメジャーバージョンで削除予定。
       */
      onValueChange?: (value: T) => void
    }
  | {
      options: PillToggleOption<T>[]
      value: T
      size?: "sm" | "md"
      /**
       * 横幅いっぱいに広げ、各項目を等幅にする（既定 false = ラベル幅のまま `w-fit`）。
       * 「全幅」と「等幅」を別 prop に分けていないのは、1 行固定の segmented control では
       * 全幅に広げた瞬間に余りをどう配るかを決める必要があり、等幅以外の配り方
       * （ラベル比で配る等）は選択肢の当たり判定がバラつくため採らないから（issue #500）。
       */
      fullWidth?: boolean
      className?: string
      /**
       * 読み上げ名（issue #741）。「何を選ぶ欄か」を伝える。見える見出しがあるなら aria-labelledby を使う。
       * FormField `as="group"` の中では省いてよい（`semantics="radio"` は radiogroup をそのラベルで名付ける）
       */
      "aria-label"?: string
      /** 見える見出しの id（issue #741）。aria-label より優先して読まれる */
      "aria-labelledby"?: string
      /**
       * 読み上げの役割（issue #741）。
       * - "tabs"（既定・従来どおり）: tablist / tab。画面内の表示の切り替え（一覧の絞り込み・週/月）
       * - "radio": radiogroup / radio。フォームの値選び（性別・単位など）。FormField `as="group"` の中ではこちらを推奨
       * どちらも矢印キーで選択が移り、Tab キーでは選択中の 1 つにだけ止まる。見た目は同じ
       */
      semantics?: "tabs" | "radio"
      onChange?: undefined
      /**
       * @deprecated `onChange` を使ってください。後方互換のために残しているエイリアスで、
       * `onChange` が指定されている場合はそちらが優先されます。将来のメジャーバージョンで削除予定。
       */
      onValueChange: (value: T) => void
    }

/**
 * PillToggle — ピル型セグメントコントロール（値トグル）
 *
 * フィルタの「すべて / 進行中 / 完了」のような **値の切り替え** に使う。
 * 見た目・実装ともに `Tabs` の `variant="pill"` を基盤にしており、
 * Tabs とトークン（角丸・余白・アクティブ表現）を共有する。
 *
 * パネルを切り替えたい（コンテンツ連動）場合は `Tabs` を直接使う。
 *
 * ### 選択肢数の上限（issue #418）
 * **2〜4 択の segmented control 専用**。1 行固定で折り返せない（`TabsList` は
 * 横並びの segmented control で、選択肢が増えると各ピルが潰れるか横に溢れる）。
 *
 * **5 択以上・折り返しが要る単一選択は
 * `ChipSelector` の単一選択モード（`selectionMode="single"`）を使う**
 * （`flex-wrap` で自動的に複数行になる。支出カテゴリ 9 択など）。
 * 選択中の 1 つだけ見せて畳みたい場合は `CollapsibleChipField`（issue #419）。
 * パネル連動が要るなら `Tabs`。
 *
 * ### 全幅・等幅（issue #500）
 * 既定は `w-fit` でラベル幅。行いっぱいに広げて各項目を等幅にしたいときは
 * `fullWidth` を渡す（`className="grid w-full grid-cols-3"` のような内部構造
 * 依存の回避策は不要）。列数に応じた動的クラスは作らず、各 trigger を
 * `flex-1`（basis 0）にして等分するので選択肢数に依存しない。枠に収まらない
 * 長いラベルは省略記号で畳まれる（折り返しはしない）ので、`fullWidth` では
 * 短いラベルを使うこと。
 *
 * ### 名前と読み上げの役割（issue #741）
 * `aria-label` / `aria-labelledby` で「何を選ぶ欄か」を名付ける。FormField `as="group"` の中では
 * 省いてよい（`semantics="radio"` は radiogroup をそのラベルで名付ける。tabs は外側の group の名前に任せる）。
 * フォームの値選び（性別・単位など）は `semantics="radio"`（radiogroup / radio）で読ませる。
 * 既定の `"tabs"`（tablist / tab）は画面内の表示の切り替え向けで、従来どおり。
 * ```tsx
 * <FormField as="group" label="表示単位">
 *   <PillToggle semantics="radio" options={UNITS} value={unit} onChange={setUnit} />
 * </FormField>
 * <PillToggle aria-label="表示の切り替え" options={VIEWS} value={view} onChange={setView} />
 * ```
 *
 * ### 高さを外から足さないこと
 * pill の trigger は見た目の高さ（`h-9`/`h-8`）を保ったまま、透明な `before`
 * 擬似要素で当たり判定だけをトラック全高 44px に広げている。消費側で
 * `[role="tab"]` に追加の `min-height` を当てると、見えている面がトラック
 * （`h-11`）より高くなって崩れる。タップ領域は DS 側で確保済みなので足さない。
 */
const TRIGGER_SIZE = {
  sm: "h-8 px-3 typo-label-xs",
  md: "h-9 px-4 typo-label-sm",
} as const

// semantics="radio"（issue #741）の見た目は TabsList / TabsTrigger の variant="pill" と同じにする
// （tabs.tsx の pill の class と揃えること）。選択状態の属性だけが違う（Tabs: data-state=active / radio: checked）
const RADIO_LIST =
  "inline-flex w-fit max-w-full overflow-x-auto items-center gap-1 bg-[var(--Surface-Tertiary)] p-1 text-[var(--Text-Medium-Emphasis)] h-11 rounded-[var(--Control-Radius)]"
const RADIO_ITEM = cn(
  "inline-flex items-center justify-center whitespace-nowrap typo-label-sm transition-all",
  "relative rounded-[var(--Control-Radius)] px-[var(--Control-Padding-X-Md)] py-1.5 gap-1.5",
  "before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-11 before:content-['']",
  "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
  "disabled:pointer-events-none disabled:opacity-50",
  "data-[state=checked]:bg-[var(--Surface-Primary)] data-[state=checked]:text-[var(--Text-High-Emphasis)] data-[state=checked]:shadow-sm",
  "forced-colors:data-[state=checked]:bg-[Highlight] forced-colors:data-[state=checked]:text-[HighlightText]",
  "data-[state=unchecked]:hover:text-[var(--Text-High-Emphasis)]"
)

function PillToggle<T extends string = string>({
  options,
  value,
  onChange,
  onValueChange,
  size = "md",
  fullWidth = false,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  semantics = "tabs",
}: PillToggleProps<T>) {
  const handleChange = onChange ?? onValueChange
  // issue #741: FormField as="group" の中で名前が未指定なら、radiogroup 自身もそのラベルで名付ける
  // （WAI-ARIA の radio group パターンは radiogroup 自体が見える見出しを参照することを求める。
  // 外側の group の名前は内側へ継承されない）。tabs は従来どおり外側の group の名前に任せる
  const groupLabelId = React.useContext(FormFieldGroupLabelContext)
  const radioLabelledby = ariaLabelledby ?? (ariaLabel ? undefined : groupLabelId)
  const isUnnamedRadiogroup = semantics === "radio" && !ariaLabel && !radioLabelledby
  React.useEffect(() => {
    if (!isUnnamedRadiogroup) return
    warnOnceInDev(
      "pill-toggle-radio-unnamed",
      'PillToggle: semantics="radio"（role="radiogroup"）には名前が必要です。見出しの id を aria-labelledby に渡すか、aria-label を指定してください（FormField as="group" の中なら不要。issue #741）。'
    )
  }, [isUnnamedRadiogroup])

  const renderContent = (opt: PillToggleOption<T>) => (
    <>
      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
      {/* fullWidth では枠幅がラベル長で決まらないため、長いラベルは省略記号で畳む。
          TabsTrigger は既定で whitespace-nowrap なので折り返して高さが崩れることはなく、
          truncate を足すことで枠外へはみ出す代わりに「…」で収める。 */}
      <span className={cn(fullWidth && "truncate")}>{opt.label}</span>
    </>
  )

  if (semantics === "radio") {
    return (
      <RadioGroupPrimitive.Root
        data-slot="pill-toggle"
        data-semantics="radio"
        value={value}
        onValueChange={(v) => handleChange?.(v as T)}
        aria-label={ariaLabel}
        aria-labelledby={radioLabelledby}
        className={cn(RADIO_LIST, fullWidth && "flex w-full", className)}
      >
        {options.map((opt) => (
          <RadioGroupPrimitive.Item
            key={opt.value}
            value={opt.value}
            data-slot="pill-toggle-item"
            className={cn(RADIO_ITEM, TRIGGER_SIZE[size], fullWidth && "flex-1 min-w-0 overflow-hidden")}
          >
            {renderContent(opt)}
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
    )
  }

  return (
    <Tabs
      data-slot="pill-toggle"
      value={value}
      onValueChange={(v) => handleChange?.(v as T)}
    >
      <TabsList
        variant="pill"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn(fullWidth && "flex w-full", className)}
      >
        {options.map((opt) => (
          <TabsTrigger
            key={opt.value}
            value={opt.value}
            className={cn(TRIGGER_SIZE[size], fullWidth && "flex-1 min-w-0 overflow-hidden")}
          >
            {renderContent(opt)}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* PillToggle はパネル切り替えを行わない（値トグル専用）が、Radix Tabs は
          アクティブな trigger に aria-controls で存在しない id を指してしまう
          （TabsContent が無いため）。空の TabsContent を用意して参照先を実在させる
          （axe: aria-valid-attr-value）。TabsContent は既定で非アクティブ時に
          アンマウントされるため、forceMount で常時マウントし続けて参照切れを防ぐ
          （PR #271 CodeRabbit 指摘 / issue #275）。 */}
      {options.map((opt) => (
        <TabsContent forceMount key={opt.value} value={opt.value} className="hidden" />
      ))}
    </Tabs>
  )
}

export { PillToggle }
export type { PillToggleProps, PillToggleOption }
