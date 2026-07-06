#!/usr/bin/env node
// =============================================================
// KSK Design System — npm ダウンロード数レポート
//
// npm の公開ダウンロード統計 API（api.npmjs.org）を叩いて、
// 直近のインストール数・日別推移・バージョン別内訳を整形表示する。
// npm は匿名集計のため「ユニークユーザー数」ではなく、CI やミラーの
// 重複を含む「install 回数の目安」である点に注意。
//
// 実行:
//   node scripts/download-metrics.mjs            # サマリを表示
//   node scripts/download-metrics.mjs --json     # 生データを JSON で出力
//   node scripts/download-metrics.mjs --range last-year
//
// オフライン / プロキシで api.npmjs.org に到達できない環境では
// 終了コード 1 で失敗する（CI では skip 可）。
// =============================================================
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
const NAME = pkg.name

const args = process.argv.slice(2)
const asJson = args.includes("--json")
const rangeIdx = args.indexOf("--range")
const RANGE = rangeIdx !== -1 ? args[rangeIdx + 1] : "last-month"

const API = "https://api.npmjs.org/downloads"

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return res.json()
}

function fmt(n) {
  return n.toLocaleString("en-US")
}

async function main() {
  let point, range, versions
  try {
    ;[point, range, versions] = await Promise.all([
      Promise.all(
        ["last-day", "last-week", "last-month"].map((p) =>
          fetchJson(`${API}/point/${p}/${NAME}`).then((d) => [p, d.downloads]),
        ),
      ),
      fetchJson(`${API}/range/${RANGE}/${NAME}`),
      fetchJson(`${API}/versions/${NAME}/last-week`).catch(() => null),
    ])
  } catch (err) {
    console.error(`✗ ダウンロード統計を取得できませんでした: ${err.message}`)
    console.error(
      "  api.npmjs.org に到達できない環境（オフライン / プロキシ制限）か、未公開パッケージの可能性があります。",
    )
    process.exit(1)
  }

  if (asJson) {
    console.log(
      JSON.stringify(
        { package: NAME, point: Object.fromEntries(point), range, versions },
        null,
        2,
      ),
    )
    return
  }

  const days = range.downloads ?? []
  const total = days.reduce((s, d) => s + d.downloads, 0)
  const peak = days.reduce((a, b) => (b.downloads > a.downloads ? b : a), {
    downloads: -1,
  })

  console.log(`\n📦 ${NAME}  (npm ダウンロード統計)\n`)
  console.log("  直近のインストール数")
  for (const [label, n] of point) {
    console.log(`    ${label.padEnd(11)} ${fmt(n).padStart(10)}`)
  }
  console.log(`\n  ${RANGE} の推移`)
  console.log(`    合計        ${fmt(total).padStart(10)}`)
  if (peak.downloads >= 0) {
    console.log(`    ピーク日    ${fmt(peak.downloads).padStart(10)}  (${peak.day})`)
  }

  if (versions?.downloads) {
    const rows = Object.entries(versions.downloads)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
    if (rows.length) {
      console.log(`\n  バージョン別（直近 1 週間・上位 8）`)
      for (const [v, n] of rows) {
        console.log(`    ${v.padEnd(11)} ${fmt(n).padStart(10)}`)
      }
    }
  }

  console.log(
    `\n  📊 グラフ: https://npm-stat.com/charts.html?package=${NAME}`,
  )
  console.log(
    "  ※ npm は匿名集計。CI / ミラーの重複を含む install 回数の目安であり、ユニークユーザー数ではない。\n",
  )
}

main()
