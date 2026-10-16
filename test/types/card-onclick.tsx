// issue #665 レビュー: 押せる Card にしても、以前の「div に付く onClick」の型で書かれた
// ハンドラがそのまま型チェックを通ること（tsconfig.type-tests.json → npm run check で検査）。
import * as React from "react"
import { Card, CardTitle } from "../../src/components/ui/card"

// 以前の Card（React.ComponentProps<"div">）の onClick と同じ型
const divHandler: React.MouseEventHandler<HTMLDivElement> = (event) => {
  event.currentTarget.getBoundingClientRect()
}
const inlineDivHandler = (event: React.MouseEvent<HTMLDivElement>) => event.preventDefault()
// 新しく書くコードの button / 汎用の型
const buttonHandler: React.MouseEventHandler<HTMLButtonElement> = () => {}
const elementHandler = (event: React.MouseEvent<HTMLElement>) => event.stopPropagation()

export const cards = (
  <>
    <Card onClick={divHandler}><CardTitle>a</CardTitle></Card>
    <Card onClick={inlineDivHandler}><CardTitle>b</CardTitle></Card>
    <Card onClick={buttonHandler}><CardTitle>c</CardTitle></Card>
    <Card onClick={elementHandler}><CardTitle>d</CardTitle></Card>
    <Card onClick={(event) => event.currentTarget.focus()}><CardTitle>e</CardTitle></Card>
    <Card href="/x" aria-label="f" />
  </>
)
