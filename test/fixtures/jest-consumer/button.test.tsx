import * as React from "react"
import { render, screen } from "@testing-library/react"
import { Button } from "ksk-design-system"

test("packed KSK component renders without a component mock", () => {
  const label: string = "保存"
  render(<Button>{label}</Button>)
  expect(screen.getByRole("button", { name: label })).toBeTruthy()
})
