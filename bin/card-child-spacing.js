import ts from "typescript"

const SPACING_CLASS =
  /(?:^|[\s"'`:({[])-?(?:mt|mb|my|space-y)-[^\s"'`})\]]+/

function tagNameOf(node, sourceFile) {
  if (ts.isJsxElement(node)) {
    return node.openingElement.tagName.getText(sourceFile)
  }
  if (ts.isJsxSelfClosingElement(node)) {
    return node.tagName.getText(sourceFile)
  }
  return ""
}

function openingOf(node) {
  if (ts.isJsxElement(node)) return node.openingElement
  if (ts.isJsxSelfClosingElement(node)) return node
  return null
}

function hasMediaVariant(opening, sourceFile) {
  const attribute = opening.attributes.properties.find(
    (property) =>
      ts.isJsxAttribute(property) &&
      property.name.getText(sourceFile) === "variant",
  )
  if (!attribute || !ts.isJsxAttribute(attribute) || !attribute.initializer) {
    return false
  }
  if (ts.isStringLiteral(attribute.initializer)) {
    return attribute.initializer.text === "media"
  }
  if (
    ts.isJsxExpression(attribute.initializer) &&
    attribute.initializer.expression &&
    (ts.isStringLiteral(attribute.initializer.expression) ||
      ts.isNoSubstitutionTemplateLiteral(attribute.initializer.expression))
  ) {
    return attribute.initializer.expression.text === "media"
  }
  return false
}

function spacingClassOf(node, sourceFile) {
  const opening = openingOf(node)
  if (!opening) return null
  const className = opening.attributes.properties.find(
    (property) =>
      ts.isJsxAttribute(property) &&
      property.name.getText(sourceFile) === "className",
  )
  if (!className || !ts.isJsxAttribute(className) || !className.initializer) {
    return null
  }
  const raw = className.initializer.getText(sourceFile)
  return raw.match(SPACING_CLASS)?.[0]?.trim() ?? null
}

function directJsxRoots(node, visit) {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    visit(node)
    return
  }
  if (ts.isJsxFragment(node)) {
    for (const child of node.children) directJsxRoots(child, visit)
    return
  }
  if (ts.isJsxExpression(node) && !node.expression) return
  ts.forEachChild(node, (child) => directJsxRoots(child, visit))
}

export function inspectCardChildSpacing(source, filePath = "source.tsx") {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const findings = []

  function walk(node) {
    if (
      ts.isJsxElement(node) &&
      tagNameOf(node, sourceFile) === "Card" &&
      !hasMediaVariant(node.openingElement, sourceFile)
    ) {
      for (const child of node.children) {
        directJsxRoots(child, (root) => {
          const spacingClass = spacingClassOf(root, sourceFile)
          if (!spacingClass) return
          const position = sourceFile.getLineAndCharacterOfPosition(
            root.getStart(),
          )
          findings.push({
            line: position.line + 1,
            tag: tagNameOf(root, sourceFile),
            spacingClass,
          })
        })
      }
      ts.forEachChild(node, walk)
      return
    }
    ts.forEachChild(node, walk)
  }

  walk(sourceFile)
  return findings
}
