import * as React from "react"

/**
 * FormField as="group" のラベルの id（内部用・public export しない。issue #734）。
 * 中の ChipSelector（single = radiogroup）は、外側の group がこのラベルで名前を持つので、
 * 名前なしの警告を出さない（内側へ同じ名前を結ばない = 二重読み上げにしない）。
 * PillToggle（ui/）も参照するため lib/ に置く（ui/ は patterns/ に依存できない。issue #741）。
 */
const FormFieldGroupLabelContext = React.createContext<string | undefined>(undefined)

export { FormFieldGroupLabelContext }
