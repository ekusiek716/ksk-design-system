#!/usr/bin/env node
// =============================================================
// KSK Design System — DESIGN.md contract check
//
// Google DESIGN.md の良い検査観点（front matter + rationale、
// broken reference、section order、agent-readable findings）を
// KSK の正本（tokens / contracts / CSS）に合わせて検査する。
// 外部 CLI には依存しない。
//
// Usage:
//   node scripts/check-design-md.mjs
//   node scripts/check-design-md.mjs --format json
//   node scripts/check-design-md.mjs --design /tmp/DESIGN.md
// =============================================================
import { existsSync, readFileSync } from "node:fs"
import { dirname, isAbsolute, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const args = process.argv.slice(2)

function argValue(name, fallback = null) {
  const eq = args.find((arg) => arg.startsWith(`${name}=`))
  if (eq) return eq.slice(name.length + 1)
  const index = args.indexOf(name)
  if (index >= 0) return args[index + 1] ?? fallback
  return fallback
}

const designArg = argValue("--design", "DESIGN.md")
const designPath = isAbsolute(designArg) ? designArg : resolve(ROOT, designArg)
const outputFormat = args.includes("--json") ? "json" : argValue("--format", "text")

const findings = []

function addFinding(severity, path, message) {
  findings.push({ severity, path, message })
}

function addError(path, message) {
  addFinding("error", path, message)
}

function addWarning(path, message) {
  addFinding("warning", path, message)
}

function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT, path), "utf8"))
}

const tokens = readJson("tokens.json")
const components = readJson("contracts/components.json")
const designContext = readJson("contracts/design-context.json")
const presetCss = readFileSync(join(ROOT, "src/preset.css"), "utf8")

function extractFrontMatter(source) {
  const lines = source.split(/\r?\n/)
  if (lines[0]?.trim() !== "---") {
    addError("DESIGN.md", "YAML front matter の開始 `---` がありません")
    return null
  }
  const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---")
  if (endIndex < 0) {
    addError("DESIGN.md", "YAML front matter の終了 `---` がありません")
    return null
  }
  return {
    yaml: lines.slice(1, endIndex).join("\n"),
    body: lines.slice(endIndex + 1).join("\n"),
  }
}

function stripInlineComment(value) {
  let quote = null
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i]
    if (quote) {
      if (char === "\\" && quote === "\"") i += 1
      else if (char === quote) quote = null
      continue
    }
    if (char === "\"" || char === "'") {
      quote = char
      continue
    }
    if (char === "#") return value.slice(0, i).trimEnd()
  }
  return value.trimEnd()
}

function splitInlineObjectEntries(value) {
  const body = value.slice(1, -1)
  const entries = []
  let start = 0
  let quote = null
  for (let i = 0; i < body.length; i += 1) {
    const char = body[i]
    if (quote) {
      if (char === "\\" && quote === "\"") i += 1
      else if (char === quote) quote = null
      continue
    }
    if (char === "\"" || char === "'") {
      quote = char
      continue
    }
    if (char === ",") {
      entries.push(body.slice(start, i).trim())
      start = i + 1
    }
  }
  const last = body.slice(start).trim()
  if (last) entries.push(last)
  return entries
}

function unquote(value) {
  const trimmed = String(value).trim()
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseFrontMatterScalars(yaml) {
  const scalars = new Map()
  const containers = new Set()
  const stack = []

  for (const line of yaml.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#") || line.trimStart().startsWith("- ")) continue
    const indent = line.match(/^ */)?.[0].length ?? 0
    const trimmed = line.trim()
    const match = trimmed.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/)
    if (!match) continue

    while (stack.length && indent <= stack[stack.length - 1].indent) stack.pop()

    const key = match[1]
    const path = [...stack.map((item) => item.key), key].join(".")
    const raw = stripInlineComment(match[2] ?? "").trim()

    if (!raw || raw === ">-" || raw === ">" || raw === "|-" || raw === "|") {
      containers.add(path)
      stack.push({ key, indent })
      continue
    }

    if (raw.startsWith("{") && raw.endsWith("}")) {
      containers.add(path)
      for (const entry of splitInlineObjectEntries(raw)) {
        const entryMatch = entry.match(/^([A-Za-z0-9_-]+):\s*(.+)$/)
        if (entryMatch) scalars.set(`${path}.${entryMatch[1]}`, unquote(entryMatch[2]))
      }
      continue
    }

    scalars.set(path, unquote(raw))
  }

  return { scalars, containers }
}

function normalizeHex(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : value
}

function comparable(value) {
  return normalizeHex(String(value).trim())
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ",")
}

function comparableShadow(value) {
  return String(value).replace(/\s+/g, "")
}

function pascalDash(key) {
  return key
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-")
}

const primitiveDict = {}
for (const [family, value] of Object.entries(tokens.colors.primitive)) {
  const cssFamily = pascalDash(family)
  if (typeof value === "string") {
    primitiveDict[cssFamily] = value
  } else {
    for (const [shade, shadeValue] of Object.entries(value)) {
      primitiveDict[`${cssFamily}-${shade}`] = shadeValue
    }
  }
}

function resolveColor(value) {
  if (typeof value !== "string") return value
  const direct = value.trim()
  if (direct.startsWith("#") || direct.startsWith("rgb")) return normalizeHex(direct)

  const match = direct.match(/^var\(--Primitive-(.+?)\)$/)
  if (!match) return direct

  const key = match[1]
  if (key.startsWith("Brand-")) {
    const shade = key.replace("Brand-", "")
    const brandValue = tokens.colors.brand?.[shade]
    if (!brandValue) throw new Error(`Unresolved brand token: ${direct}`)
    return resolveColor(brandValue)
  }

  const primitive = primitiveDict[key]
  if (!primitive) throw new Error(`Unresolved primitive token: ${direct}`)
  return normalizeHex(primitive)
}

function semantic(group, role) {
  return resolveColor(tokens.colors.semantic[group][role])
}

function cssVar(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = presetCss.match(new RegExp(`${escaped}:\\s*([^;]+);`))
  if (!match) throw new Error(`Missing CSS custom property: ${name}`)
  return match[1].trim()
}

function cssLengthToPx(value) {
  const trimmed = value.trim()
  if (trimmed.endsWith("rem")) return `${parseFloat(trimmed) * 16}px`
  if (trimmed.endsWith("px")) return trimmed
  return trimmed
}

function validateRequiredFiles() {
  for (const source of designContext.canonicalSources) {
    if (source.path.includes("*")) continue
    if (!existsSync(join(ROOT, source.path))) {
      addError(`contracts/design-context.json:${source.path}`, "canonicalSources の path が存在しません")
    }
  }
}

function validateSections(body) {
  const required = designContext.guardrails.requiredSections
  const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim())

  for (const section of required) {
    if (!headings.includes(section)) {
      addError(`DESIGN.md#${section}`, "required section がありません")
    }
  }

  const presentRequired = headings.filter((heading) => required.includes(heading))
  const expectedPrefix = required.filter((heading) => presentRequired.includes(heading))
  if (presentRequired.join("\n") !== expectedPrefix.join("\n")) {
    addError(
      "DESIGN.md:sections",
      `section order が guardrails と一致しません: ${presentRequired.join(" > ")}`
    )
  }

  for (const mention of designContext.guardrails.requiredSourceMentions) {
    if (!body.includes(mention)) {
      addError("DESIGN.md:source-mentions", `${mention} への言及がありません`)
    }
  }
}

function validateFrontMatterPaths(scalars) {
  for (const path of designContext.guardrails.requiredFrontMatterPaths) {
    if (!scalars.has(path)) addError(`frontMatter.${path}`, "required front matter path がありません")
  }
}

function validateTokenReferences(scalars, containers) {
  for (const [path, value] of scalars) {
    const refs = String(value).matchAll(/\{([^}]+)\}/g)
    for (const ref of refs) {
      const target = ref[1]
      if (!scalars.has(target) && !containers.has(target)) {
        addError(`frontMatter.${path}`, `解決できない token reference: {${target}}`)
      }
    }
  }
}

function validateDesignValues(scalars) {
  const expected = [
    ["colors.primary", semantic("brand", "primary")],
    ["colors.primaryAction", semantic("brand", "action")],
    ["colors.onPrimary", semantic("text", "on-inverse")],
    ["colors.neutral0", tokens.colors.primitive.white],
    ["colors.neutral50", tokens.colors.primitive.gray["50"]],
    ["colors.neutral100", tokens.colors.primitive.gray["100"]],
    ["colors.neutral200", tokens.colors.primitive.gray["200"]],
    ["colors.neutral500", tokens.colors.primitive.gray["500"]],
    ["colors.neutral900", tokens.colors.primitive.gray["900"]],
    ["colors.surface", semantic("surface", "primary")],
    ["colors.surfaceMuted", semantic("surface", "secondary")],
    ["colors.textHigh", semantic("text", "high-emphasis")],
    ["colors.textMedium", semantic("text", "medium-emphasis")],
    ["colors.textLow", semantic("text", "low-emphasis")],
    ["colors.border", semantic("border", "low-emphasis")],
    ["colors.focus", semantic("focus", "high-emphasis")],
    ["colors.success", semantic("success", "base")],
    ["colors.warning", semantic("warning", "base")],
    ["colors.error", semantic("caution", "base")],
    ["colors.info", semantic("info", "base")],
    ["typography.display.fontSize", tokens.typography.display.xl.size],
    ["typography.display.lineHeight", tokens.typography.display.xl.lineHeight],
    ["typography.display.fontWeight", tokens.typography.display.xl.weight],
    ["typography.heading.fontSize", tokens.typography.heading.lg.size],
    ["typography.heading.lineHeight", tokens.typography.heading.lg.lineHeight],
    ["typography.body.fontSize", tokens.typography.body.md.size],
    ["typography.body.lineHeight", tokens.typography.body.md.lineHeight],
    ["typography.label.fontSize", tokens.typography.label.sm.size],
    ["typography.label.fontWeight", tokens.typography.label.sm.weight],
    ["typography.caption.fontSize", tokens.typography.caption.size],
    ["rounded.sm", tokens.borderRadius.sm],
    ["rounded.surface", cssLengthToPx(cssVar("--Radius-Surface"))],
    ["rounded.modal", cssLengthToPx(cssVar("--Radius-Modal"))],
    ["rounded.sheet", cssLengthToPx(cssVar("--Radius-Sheet"))],
    ["rounded.full", tokens.borderRadius.full],
    ["spacing.unit", tokens.spacing.unit],
    ["elevation.sm", tokens.shadows.sm, "shadow"],
    ["elevation.md", tokens.shadows.md, "shadow"],
    ["elevation.lg", tokens.shadows.lg, "shadow"],
    ["elevation.dialog", tokens.shadows.dialog, "shadow"],
  ]

  for (const [path, expectedValue, mode] of expected) {
    const actual = scalars.get(path)
    if (actual == null) continue
    const actualComparable = mode === "shadow" ? comparableShadow(actual) : comparable(actual)
    const expectedComparable = mode === "shadow" ? comparableShadow(expectedValue) : comparable(expectedValue)
    if (actualComparable !== expectedComparable) {
      addError(
        `frontMatter.${path}`,
        `tokens / CSS と不一致です: actual=${actual} expected=${expectedValue}`
      )
    }
  }
}

function validateComponentReferences(containers) {
  const contractNames = new Set(
    ["ui", "patterns", "commerce", "admin", "shells"]
      .flatMap((group) => components[group] ?? [])
      .flatMap((component) => String(component.name).split("/"))
      .map((name) => name.trim().toLowerCase())
  )

  for (const path of containers) {
    const match = path.match(/^components\.([^.]+)$/)
    if (!match) continue
    if (!contractNames.has(match[1].toLowerCase())) {
      addWarning(`frontMatter.${path}`, "contracts/components.json に同名 component がありません")
    }
  }
}

function printFindings() {
  const summary = {
    errors: findings.filter((finding) => finding.severity === "error").length,
    warnings: findings.filter((finding) => finding.severity === "warning").length,
    info: findings.filter((finding) => finding.severity === "info").length,
  }

  if (outputFormat === "json") {
    console.log(JSON.stringify({ findings, summary }, null, 2))
    return summary
  }

  console.log("🧭 KSK — DESIGN.md contract check")
  console.log("=======================================")
  console.log(`target: ${relative(ROOT, designPath) || "DESIGN.md"}`)
  if (findings.length === 0) {
    console.log("\x1b[32m✓ DESIGN.md は正本と同期しています\x1b[0m")
    return summary
  }

  for (const finding of findings) {
    const label = finding.severity === "error" ? "\x1b[31m[ERROR]\x1b[0m" : "\x1b[33m[WARN]\x1b[0m "
    console.log(`${label} ${finding.path}: ${finding.message}`)
  }
  console.log("=======================================")
  if (summary.errors > 0) console.error(`\x1b[31m✗ ${summary.errors} errors, ${summary.warnings} warnings\x1b[0m`)
  else console.log(`\x1b[32m✓ 0 errors, ${summary.warnings} warnings\x1b[0m`)
  return summary
}

if (!existsSync(designPath)) {
  addError("DESIGN.md", `file not found: ${designPath}`)
} else {
  validateRequiredFiles()
  const source = readFileSync(designPath, "utf8")
  const extracted = extractFrontMatter(source)
  if (extracted) {
    const { scalars, containers } = parseFrontMatterScalars(extracted.yaml)
    validateSections(extracted.body)
    validateFrontMatterPaths(scalars)
    validateTokenReferences(scalars, containers)
    validateDesignValues(scalars)
    validateComponentReferences(containers)
  }
}

const summary = printFindings()
if (summary.errors > 0) process.exit(1)
