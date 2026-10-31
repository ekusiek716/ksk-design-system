// issue #828: consumer 自身の react-hook-form と DS の Form 部品を混ぜて使うケース。
// DS の dist が react-hook-form を同梱していると Context が別インスタンスになり、
//   1. DS の <Form>（= FormProvider）配下で consumer の useFormContext() が null を返す
//   2. consumer の <FormProvider> 配下で DS の RhfFormField + FormLabel が
//      useFormField の分割代入で TypeError になる
// test-packed-web-consumer.mjs が packed tarball を install した consumer で Node SSR する。
import React from "react"
import { renderToString } from "react-dom/server"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Form, FormControl, FormItem, FormLabel, Input, RhfFormField } from "ksk-design-system"

const h = React.createElement

function ConsumerContextProbe() {
  const context = useFormContext()
  return h("output", { "data-consumer-context": context ? "shared" : "null" }, context?.getValues("name") ?? "")
}

function FieldRow() {
  const { control } = useFormContext()
  return h(RhfFormField, {
    control,
    name: "name",
    render: ({ field }) =>
      h(FormItem, null, h(FormLabel, null, "名前"), h(FormControl, null, h(Input, { ...field }))),
  })
}

// 1. DS の <Form> に consumer の useForm() を展開し、子で consumer の useFormContext() を呼ぶ
function DsFormWithConsumerHook() {
  const form = useForm({ defaultValues: { name: "山田" } })
  return h(Form, form, h(ConsumerContextProbe))
}

// 2. consumer の <FormProvider> 配下で DS の RhfFormField + FormLabel を描く
function ConsumerProviderWithDsField() {
  const form = useForm({ defaultValues: { name: "佐藤" } })
  return h(FormProvider, form, h(FieldRow), h(ConsumerContextProbe))
}

export function renderReactHookFormCases() {
  return {
    dsForm: renderToString(h(DsFormWithConsumerHook)),
    consumerProvider: renderToString(h(ConsumerProviderWithDsField)),
  }
}
