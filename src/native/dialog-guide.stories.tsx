import type { Meta } from "@storybook/react"
import legacy, { DialogFullscreen } from "./native-components.stories"

export default { ...legacy, title: "Native/Dialog", parameters: { ...legacy.parameters, docs: { description: { component: "NativeのDialog。既存の状態検証例を再利用しています。実OSでの確認状況はNative対応表を参照してください。" } } } } satisfies Meta
export const Default = { ...DialogFullscreen, name: "代表例" }
