import type { Meta } from "@storybook/react"
import legacy, { ChoiceGroupSpacing, RadioCardRows } from "./native-components.stories"

export default { ...legacy, title: "Native/ChoiceGroup", parameters: { ...legacy.parameters, docs: { description: { component: "NativeのChoiceGroup。既存の状態検証例を再利用しています。実OSでの確認状況はNative対応表を参照してください。" } } } } satisfies Meta
export const Default = { ...ChoiceGroupSpacing, name: "代表例" }

export const CardRows = { ...RadioCardRows, name: "右端ラジオのカード行" }
