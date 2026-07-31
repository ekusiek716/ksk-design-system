import { Linter } from "eslint"
import { describe, expect, it } from "vitest"
import kskA11y from "../eslint/icon-button-aria-label.js"

const linter = new Linter()

function lint(code: string) {
  return linter.verify(code, [
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      plugins: { "ksk-a11y": kskA11y },
      rules: { "ksk-a11y/icon-button-aria-label": "error" },
    },
  ])
}

describe("icon-button-aria-label", () => {
  it("spread propsだけではaccessible nameを証明済みと扱わない", () => {
    expect(lint('const view = <Button {...props} size="icon"><Icon /></Button>')).toHaveLength(1)
  })

  it("spread propsがあっても明示した非空labelを許可する", () => {
    expect(
      lint('const view = <Button {...props} size="icon" aria-label="閉じる"><Icon /></Button>'),
    ).toHaveLength(0)
  })

  it.each([
    'aria-label=""',
    'aria-label="   "',
    'aria-label={""}',
    "aria-label={'   '}",
    "aria-labelledby={''}",
  ])("空のaccessible nameを拒否する: %s", (attribute) => {
    expect(lint(`const view = <Button size="icon" ${attribute}><Icon /></Button>`)).toHaveLength(1)
  })

  it("非空のaria-labelledbyと動的labelを許可する", () => {
    expect(
      lint(
        'const view = <><Button size="icon" aria-labelledby="close-label"><Icon /></Button><Button size="icon" aria-label={label}><Icon /></Button></>',
      ),
    ).toHaveLength(0)
  })
})
