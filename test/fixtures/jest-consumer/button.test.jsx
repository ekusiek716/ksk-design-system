import * as React from "react"
import { render, screen } from "@testing-library/react"
import { Button } from "ksk-design-system"

test("packed KSK component renders without a component mock", () => {
  render(<Button>保存</Button>)
  expect(screen.getByRole("button", { name: "保存" })).toBeTruthy()
})
