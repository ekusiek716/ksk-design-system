/**
 * ESLint プラグイン: icon-only ボタンの aria-label 検出 (A006 / issue #264④)
 *
 * `<Button size="icon" | "icon-sm" | "icon-lg" | "icon-xl">` はアイコンのみを表示する
 * バリアントで、スクリーンリーダー利用者向けのラベルが子要素のテキストとして
 * 存在しない。`aria-label` / `aria-labelledby` の付与が必須（rules.json A006）。
 *
 * axe-core（addon-a11y の自動検査）は実際にレンダリングされた DOM の
 * accessible name を見るため、Storybook に載っているケースは axe 側でも
 * 拾える。本ルールは Storybook を経由しない実装コード（消費側ページ・
 * プロトタイプ等）でも書いた瞬間に検出するための静的な先取りガード。
 *
 * 使い方 (eslint.config.js):
 *   import kskIconButtonAriaLabel from "./eslint/icon-button-aria-label.js"
 *   plugins: { "ksk-a11y": kskIconButtonAriaLabel }
 *   rules: { "ksk-a11y/icon-button-aria-label": "error" }
 */

const ICON_SIZE = /^icon(-sm|-lg|-xl)?$/

function literalSize(node) {
  if (!node) return null
  if (node.type === "Literal" && typeof node.value === "string") return node.value
  if (node.type === "JSXExpressionContainer" && node.expression?.type === "Literal") {
    return typeof node.expression.value === "string" ? node.expression.value : null
  }
  return null
}

function hasNonEmptyAccessibleName(openingElement) {
  return openingElement.attributes.some((attr) => {
    if (attr.type !== "JSXAttribute") return false
    const name = attr.name?.name
    if (name !== "aria-label" && name !== "aria-labelledby") return false
    if (attr.value === null) return false

    if (attr.value.type === "Literal") {
      return typeof attr.value.value === "string" && attr.value.value.trim().length > 0
    }

    if (attr.value.type !== "JSXExpressionContainer") return false
    const expression = attr.value.expression
    if (expression.type === "Literal") {
      return typeof expression.value === "string" && expression.value.trim().length > 0
    }
    if (expression.type === "TemplateLiteral" && expression.expressions.length === 0) {
      return expression.quasis.some((quasi) => quasi.value.cooked?.trim())
    }

    // 識別子・関数呼び出し等の値は静的には確定できないため許可する。
    // 実レンダリング時の空値は axe(button-name) が補完して検出する。
    return expression.type !== "JSXEmptyExpression"
  })
}

/** @type {import('eslint').Rule.RuleModule} */
const iconButtonAriaLabel = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require aria-label/aria-labelledby on icon-only Button (size=icon*) (A006)",
    },
    schema: [],
    messages: {
      missingAriaLabel:
        "[ksk-ds] アイコンのみの Button（size=\"icon\" 系）には aria-label（または aria-labelledby）が必須（A006）。スクリーンリーダー利用者がボタンの目的を認識できない。",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? ""
    if (/\.stories\.[tj]sx?$/.test(filename)) return {}

    return {
      JSXOpeningElement(node) {
        const nameNode = node.name
        if (!nameNode || nameNode.type !== "JSXIdentifier") return
        if (nameNode.name !== "Button") return

        const sizeAttr = node.attributes.find(
          (attr) => attr.type === "JSXAttribute" && attr.name?.name === "size"
        )
        if (!sizeAttr) return
        const size = literalSize(sizeAttr.value)
        if (!size || !ICON_SIZE.test(size)) return

        // spread props に accessible name が含まれるとは証明できないため、
        // 明示された非空の aria-label / aria-labelledby だけを合格にする。
        if (hasNonEmptyAccessibleName(node)) return

        context.report({ node, messageId: "missingAriaLabel" })
      },
    }
  },
}

export default {
  rules: {
    "icon-button-aria-label": iconButtonAriaLabel,
  },
}
