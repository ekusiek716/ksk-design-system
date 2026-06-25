#!/usr/bin/env node
/**
 * Guardrail for Web/RN component parity.
 *
 * contracts/components.json is the source of truth for reusable component names.
 * Native does not mirror every Web implementation: admin data grids, hover-only
 * surfaces, browser-only persistence, and RHF form roots are intentionally
 * Web-only. Everything else should have a native export or an explicit gap here.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const CONTRACTS = path.join(ROOT, "contracts/components.json")
const NATIVE_INDEX = path.join(ROOT, "src/native/components/index.ts")

const INTENTIONAL_NATIVE_GAPS = new Map([
  ["AdminShell", "admin shell is Web dashboard layout; native apps use AppShell or MarketingShell"],
  ["BulkActions", "admin table bulk action toolbar is Web-only"],
  ["ChartControls", "admin analytics controls are Web-only"],
  ["CookieConsent", "browser cookie consent is Web-only"],
  ["DataTable", "complex admin table editing is Web-only"],
  ["ErrorBoundary", "React DOM error boundary surface is Web-only"],
  ["Form", "native uses FormField plus native inputs instead of RHF form root"],
  ["HoverCard", "hover interaction is Web-only"],
  ["ImageUploader", "admin image uploader is Web-only; native uses CompactFilePicker/ImageAttachmentPicker adapters"],
  ["KebabMenu", "admin action menu is Web-only; native uses MenuDrawer/DropdownMenu patterns"],
  ["NotificationList", "admin notification list is Web-only"],
  ["SearchPanel", "admin search panel is Web-only"],
  ["StatusTabs", "admin status tabs are Web-only"],
  ["Toast", "native exposes ToastProvider/useToast instead of a Toast component export"],
  ["Tooltip", "hover/focus tooltip is Web-only"],
])

const REQUIRED_NATIVE_EXPORTS = [
  "Screen",
  "PhotoHero",
  "MediaActionCluster",
  "ListSkeleton",
  "GridSkeleton",
  "SettingsSection",
  "SettingsListRow",
  "CompactFilePicker",
  "ImageAttachmentPicker",
  "ActionTile",
  "QuickActionGrid",
  "MobileAppShell",
  "MobileFloatingActionButton",
  "MobileAppHeader",
  "StatusActionBadge",
  "SyncStatusButton",
  "DetailSheetScaffold",
  "KeyboardAwareSheetFooter",
  "BottomSheetFrame",
]

function componentNamesFromContracts() {
  const json = JSON.parse(fs.readFileSync(CONTRACTS, "utf8"))
  const categories = ["ui", "patterns", "commerce", "admin", "shells"]
  const names = []

  for (const category of categories) {
    for (const item of json[category] ?? []) {
      if (!item?.name) continue
      for (const name of item.name.split("/")) {
        const trimmed = name.trim()
        if (/^[A-Z]/.test(trimmed)) names.push(trimmed)
      }
    }
  }

  return [...new Set(names)].sort()
}

function nativeValueExports() {
  const source = fs.readFileSync(NATIVE_INDEX, "utf8")
  const names = []

  for (const match of source.matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["']/g)) {
    for (const raw of match[1].split(",")) {
      const part = raw.trim()
      if (!part || part.startsWith("type ")) continue
      const name = part.split(/\s+as\s+/).pop().trim()
      if (/^[A-Z]/.test(name)) names.push(name)
    }
  }

  return new Set(names)
}

const contractNames = componentNamesFromContracts()
const nativeExports = nativeValueExports()
const missing = contractNames.filter((name) => !nativeExports.has(name) && !INTENTIONAL_NATIVE_GAPS.has(name))
const requiredMissing = REQUIRED_NATIVE_EXPORTS.filter((name) => !nativeExports.has(name))

if (missing.length > 0 || requiredMissing.length > 0) {
  if (missing.length > 0) {
    console.error("[native-parity] Missing native exports for contract components:")
    for (const name of missing) console.error(`  - ${name}`)
  }

  if (requiredMissing.length > 0) {
    console.error("[native-parity] Missing required native guardrail exports:")
    for (const name of requiredMissing) console.error(`  - ${name}`)
  }

  console.error("\nAdd a native implementation/export, or document an intentional gap in scripts/check-native-parity.mjs.")
  process.exit(1)
}

const staleAllowlist = [...INTENTIONAL_NATIVE_GAPS.keys()].filter((name) => !contractNames.includes(name))
if (staleAllowlist.length > 0) {
  console.warn(`[native-parity] stale intentional gaps: ${staleAllowlist.join(", ")}`)
}

console.log(
  `[native-parity] OK: ${contractNames.length} contract names checked, ${INTENTIONAL_NATIVE_GAPS.size} intentional native gaps`,
)
