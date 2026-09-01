import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

function PillToggle<T extends string = string>({
  options,
  value,
  onChange,
  onValueChange,
  size = "md",
  fullWidth = false,
  className,
}: PillToggleProps<T>) {
  const handleChange = onChange ?? onValueChange
  return (
    <Tabs
      data-slot="pill-toggle"
      value={value}
      onValueChange={(v) => handleChange?.(v as T)}
    >
      <TabsList
        variant="pill"
        className={cn(fullWidth && "flex w-full", className)}
      >
        {options.map((opt) => (
          <TabsTrigger
            key={opt.value}
            value={opt.value}
            className={cn(TRIGGER_SIZE[size], fullWidth && "flex-1 min-w-0 overflow-hidden")}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {/* fullWidth では枠幅がラベル長で決まらないため、長いラベルは省略記号で畳む。
                TabsTrigger は既定で whitespace-nowrap なので折り返して高さが崩れることはなく、
                truncate を足すことで枠外へはみ出す代わりに「…」で収める。 */}
            <span className={cn(fullWidth && "truncate")}>{opt.label}</span>
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
