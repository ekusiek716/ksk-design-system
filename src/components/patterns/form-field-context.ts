import * as React from "react"

/**
 * FormField as="group" のラベルの id（内部用・public export しない。issue #734）。
 * 中の ChipSelector（single = radiogroup）は、外側の group がこのラベルで名前を持つので、
 * 名前なしの警告を出さない（内側へ同じ名前を結ばない = 二重読み上げにしない）。
 */
const FormFieldGroupLabelContext = React.createContext<string | undefined>(undefined)

export { FormFieldGroupLabelContext }
