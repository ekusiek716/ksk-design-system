import * as React from "react"

/**
 * FormField as="group" のラベルの id（内部用・public export しない。issue #734 / #741）。
 * 方針（#741 で #734 から変更）: radiogroup は WAI-ARIA 1.2 で accessible name が必須で、外側の
 * role="group" の名前は内側へ継承されない。そのため中の radiogroup（ChipSelector の単一選択・
 * PillToggle semantics="radio"）は、aria-label / aria-labelledby が未指定ならこの id を aria-labelledby に結ぶ。
 * 複数選択（ChipSelector multiple = role="group"）と PillToggle の tabs は結ばない（外側の group が名前を持つ）。
 * PillToggle（ui/）も参照するため lib/ に置く（ui/ は patterns/ に依存できない）。
 */
const FormFieldGroupLabelContext = React.createContext<string | undefined>(undefined)

export { FormFieldGroupLabelContext }
