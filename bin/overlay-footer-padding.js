import ts from "typescript"

/**
 * P051: ResponsiveOverlayFrame + ResponsiveOverlayFooter の padding={false} 付け忘れ（issue #619）
 *
 * `preset="plain"` / `side="float" | "float-glass"` の ResponsiveOverlayFrame は
 * 既定で `p-6` と safe-area 込みの下余白を持つ（#599 / #613）。
 * ResponsiveOverlayFooter も自前で `pb-[max(1rem,env(safe-area-inset-bottom))]` を
 * 持つため、Frame 側を `padding={false}` にしないと下余白が二重になる。
 *
 * 誤検知を出さない方を優先し、静的に確定できるときだけ報告する:
 * - Frame の `side` / `preset` が文字列リテラルで、plain / float 系だと確定している
 * - Frame に spread props（`{...props}`）が無い（padding が来うるため）
 * - `padding` が未指定・値なし（`padding`）・`{true}` のいずれか（`{cond}` 等の式は対象外）
 * - Footer が Frame の JSX 子孫に直接書かれている（別コンポーネントへの切り出しは追えない）
 *
 * preset 経路（mobile-form 等 / BottomSheetFrame 経由）は padding を受け付けず、
 * 余白も持たないので対象外。
 */

const FRAME = "ResponsiveOverlayFrame"
const FOOTER = "ResponsiveOverlayFooter"
const FLOAT_SIDES = new Set(["float", "float-glass"])

/** `Foo` / `ns.Foo` の末尾の名前 */
function tagBaseName(tagName) {
  if (ts.isIdentifier(tagName)) return tagName.text
  if (ts.isPropertyAccessExpression(tagName)) return tagName.name.text
  return ""
}

function openingOf(node) {
  if (ts.isJsxElement(node)) return node.openingElement
  if (ts.isJsxSelfClosingElement(node)) return node
  return null
}

const UNKNOWN = Symbol("unknown")

/**
 * 属性値を静的に読む。
 * - 属性なし → undefined
 * - 値なし（`padding`）→ true
 * - 文字列 / true / false リテラル → その値
 * - それ以外の式 → UNKNOWN
 */
function readAttribute(opening, name) {
  const attribute = opening.attributes.properties.find(
    (property) => ts.isJsxAttribute(property) && property.name.getText() === name,
  )
  if (!attribute) return undefined
  const init = attribute.initializer
  if (!init) return true
  if (ts.isStringLiteral(init)) return init.text
  if (ts.isJsxExpression(init) && init.expression) {
    const expression = init.expression
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
      return expression.text
    }
    if (expression.kind === ts.SyntaxKind.TrueKeyword) return true
    if (expression.kind === ts.SyntaxKind.FalseKeyword) return false
  }
  return UNKNOWN
}

/** padding を持つ経路（plain / float 系）だと静的に確定しているか */
function isPaddedVariant(opening) {
  const side = readAttribute(opening, "side")
  if (side === UNKNOWN) return false
  if (typeof side === "string" && FLOAT_SIDES.has(side)) return true
  if (side !== undefined && side !== "bottom") return false
  return readAttribute(opening, "preset") === "plain"
}

function hasSpread(opening) {
  return opening.attributes.properties.some((property) => ts.isJsxSpreadAttribute(property))
}

/** Frame の子孫に Footer が書かれているか（入れ子の Frame の中は数えない） */
function containsFooter(frame) {
  let found = false
  function visit(node) {
    if (found) return
    const opening = openingOf(node)
    if (opening) {
      const name = tagBaseName(opening.tagName)
      if (name === FOOTER) {
        found = true
        return
      }
      // 入れ子の Frame は自分自身として別途判定される
      if (name === FRAME) return
    }
    ts.forEachChild(node, visit)
  }
  for (const child of frame.children) visit(child)
  return found
}

export function inspectOverlayFooterPadding(source, filePath = "source.tsx") {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const findings = []

  function walk(node) {
    if (ts.isJsxElement(node) && tagBaseName(node.openingElement.tagName) === FRAME) {
      const opening = node.openingElement
      const padding = readAttribute(opening, "padding")
      if (
        isPaddedVariant(opening) &&
        !hasSpread(opening) &&
        (padding === undefined || padding === true) &&
        containsFooter(node)
      ) {
        const position = sourceFile.getLineAndCharacterOfPosition(opening.getStart(sourceFile))
        findings.push({ line: position.line + 1, tag: FRAME })
      }
    }
    ts.forEachChild(node, walk)
  }

  walk(sourceFile)
  return findings
}
