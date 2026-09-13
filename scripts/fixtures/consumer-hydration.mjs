import React, { useId, useEffect } from "react"
import { Button, Input, Label, Toaster, toast, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "ksk-design-system"
const h = React.createElement
export function ConsumerFixture({ mismatch = false } = {}) {
  const id = useId()
  useEffect(() => { window.__hydrated = true }, [])
  return h(Toaster, { regionLabel: "通知", closeLabel: "閉じる" },
    h("main", { id: "fixture" },
      h("h1", null, mismatch ? "破損した初期表示" : "固定された初期表示"),
      h(Label, { htmlFor: id }, "名前"),
      h(Input, { id, defaultValue: "山田", name: "name" }),
      h(Dialog, null,
        h(DialogTrigger, { asChild: true }, h(Button, null, "詳細を開く")),
        h(DialogContent, null, h(DialogTitle, null, "詳細"), h(DialogDescription, null, "固定の説明"))),
      h(Select, { defaultValue: "a" },
        h(SelectTrigger, { "aria-label": "種類" }, h(SelectValue, null)),
        h(SelectContent, null, h(SelectItem, { value: "a" }, "選択肢A"), h(SelectItem, { value: "b" }, "選択肢B"))),
      h(Button, { onClick: () => toast("保存しました", { duration: 0 }) }, "通知する")))
}
