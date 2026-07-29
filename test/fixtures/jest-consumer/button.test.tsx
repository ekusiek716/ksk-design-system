import * as React from "react"
import { render, screen } from "@testing-library/react"
import { Button } from "ksk-design-system"
import "ksk-design-system/glass"
import "ksk-design-system/themes/default"
import "ksk-design-system/tokens/semantic"
// CSS 系サブパスは jest.config.cjs の moduleNameMapper で style-mock に落ちる。
// 新しい CSS export を足したら必ずここでも 1 回 import して、mapper の
// 正規表現に載せ忘れていないことを検出する（載せ忘れると Jest が
// .css を JS としてパースして起動前に落ちる）。
import "ksk-design-system/tokens/motion"
import "ksk-design-system/tokens/primitive"
import "ksk-design-system/tokens/typography"
import "ksk-design-system/tokens/categorical"
import { esmValue } from "./esm-value.mjs"

test("packed KSK component renders without a component mock", () => {
  const label: string = "保存"
  render(<Button>{label}</Button>)
  expect(screen.getByRole("button", { name: label })).toBeTruthy()
  expect(esmValue).toBe(42)
})
