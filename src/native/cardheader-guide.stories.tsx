import type { Meta } from "@storybook/react"
import legacy, { CardHeaderTone, CardHeaderTitleLeading } from "./native-components.stories"

export default { ...legacy, title: "Native/CardHeader", parameters: { ...legacy.parameters, docs: { description: { component: "NativeのCardHeader。既存の状態検証例を再利用しています。実OSでの確認状況はNative対応表を参照してください。" } } } } satisfies Meta
export const Default = { ...CardHeaderTone, name: "代表例" }
export const Variant1 = { ...CardHeaderTitleLeading, name: "状態検証" }
