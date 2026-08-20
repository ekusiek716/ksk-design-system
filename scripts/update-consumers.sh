#!/bin/bash
# =============================================================
# KSK Design System — 消費リポを npm registry 経由で一括 bump
#
# 使い方: bash scripts/update-consumers.sh <version> [repo...]
#   例:   bash scripts/update-consumers.sh 1.46.0
#         bash scripts/update-consumers.sh 1.46.0 belle-todo
#         bash scripts/update-consumers.sh 1.46.0 "$HOME/LocalDev/pawly"
#         DRY_RUN=1 bash scripts/update-consumers.sh 1.46.0 belle-todo
#         KSK_GH_ACCOUNT=other-account bash scripts/update-consumers.sh 1.46.0
#
# 前提: ksk-design-system@<version> が npm registry に publish 済み
#
# 対象リポ（既定）:
#   引数を省略すると下の DEFAULT_REPOS（フルパス20箇所）が対象。
#   単体リポと monorepo が混在し、~/LocalDev/ 直下と ~/LocalDev/Examination/
#   配下にまたがる。ディレクトリ名が日本語でも、PR は各リポ内で
#   `gh pr create` するため GitHub remote から英語リポ名が自動解決される。
#
# 引数で repo を渡した場合の解決:
#   - "/" を含む or 実在ディレクトリ → そのままパスとして扱う
#   - それ以外 → $HOME/LocalDev/<name>、次に $HOME/LocalDev/Examination/<name>
#     の順で探索。見つからなければ FAIL 記録して次へ。
#
# 処理方式（stash 方式は廃止・origin/main の一時 worktree 方式）:
#   ローカルの作業ツリー（dirty 状態）には一切触れない。各リポで
#     git fetch origin main
#     git worktree add -B chore/bump-ds-<version> <tmp> <安全な開始点>
#   と一時 worktree を切り、その中で全作業を行う。remote に同名 branch が
#   ある場合はその HEAD から再開し、人手の追い commit を保持したまま通常の
#   fast-forward push を行う。無い場合だけ origin/main から開始する。
#   成功・失敗どちらでも worktree を必ず掃除する。
#
# monorepo 対応:
#   worktree 内の `git ls-files '*package.json'` を全走査し、
#   dependencies/devDependencies/peerDependencies に ksk-design-system
#   （旧名 @ksk/design-system 含む）を持つ package.json を全部書き換える。
#   ただし値が "*" や "workspace:" で始まるものは触らない
#   （例: okuno-todo-suite の packages/todo-shared が "*" 参照）。
#
# DRY_RUN=1:
#   push / gh pr create をスキップ。package.json 書換・npm install・commit
#   までは実行し、`git show --stat HEAD` 相当を表示して worktree を掃除。
#
# 終了コード:
#   FAIL が1件でもあれば 1、それ以外は 0。PR URL を取れなかったリポは OK ではなく
#   FAIL (pr create) として数える（branch は push 済みなので手動 PR で復旧できる）。
#
# gh アカウント:
#   実行中に gh の active account が振れると private リポが見えず失敗するため、
#   冒頭で GH_TOKEN を固定する（既定 ekusiek716 / KSK_GH_ACCOUNT で変更可）。
#   git の credential helper も gh 経由なので fetch / push にも効く。
# =============================================================

set -uo pipefail

VERSION="${1:?usage: update-consumers.sh <version> [repos...]}"
shift || true
ARGS=("$@")

# ── 既定対象リポ（フルパス21箇所）──
# 2026-08-20 全面更新（issue #403）: ローカル再編（~/localdev/exam-kit-apps/ 等への集約）に追従。
# 正本の考え方: 「package.json に ksk-design-system 依存を持つ全リポ」。一覧の検算は
#   grep -l '"ksk-design-system"' ~/localdev/*/package.json ~/localdev/*/*/package.json ~/localdev/*/*/*/package.json
# で行う（node_modules と ksk-design-system 自身を除く）。
DEFAULT_REPOS=(
  "$HOME/localdev/todo-apps/belle-todo"
  "$HOME/localdev/todo-apps/trip-todo"
  "$HOME/localdev/todo-apps/ninshin-todo"
  "$HOME/localdev/todo-apps/okuno-todo-suite"
  "$HOME/localdev/yokoku-app"
  "$HOME/localdev/pawly"
  # 2026-08-20 追加（issue #403）: 一覧から漏れて 1.53.0 のまま8バージョン取り残されていた
  "$HOME/localdev/camera-app"
  "$HOME/localdev/exam-kit-apps/exam-kit"
  "$HOME/localdev/exam-kit-apps/itpassport-app"
  "$HOME/localdev/exam-kit-apps/hcd-basic-app"
  "$HOME/localdev/exam-kit-apps/denki1-app"
  "$HOME/localdev/exam-kit-apps/denki2-app"
  "$HOME/localdev/exam-kit-apps/ap-app"
  "$HOME/localdev/exam-kit-apps/fe-app"
  "$HOME/localdev/exam-kit-apps/sg-app"
  "$HOME/localdev/exam-kit-apps/sharoshi-app"
  "$HOME/localdev/exam-kit-apps/fp-app"
  "$HOME/localdev/exam-kit-apps/takken-app"
  "$HOME/localdev/exam-kit-apps/dental-hygienist-exam-app"
  "$HOME/localdev/exam-kit-apps/registered-dietitian-exam-app"
  "$HOME/localdev/ai-partner/aikoibito"
)

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; YELLOW='\033[0;33m'; NC='\033[0m'
RESULTS=()

# ── gh のアカウント固定 ──
# gh の active account が実行中に別アカウント（keisukeokuno-cpu 等）へ振れると、
# private リポが見えず gh pr create が
# "Could not resolve to a Repository with the name ..." で失敗する。
# 1.60.0 配布で歯科衛生士用、1.61.0 配布で ninshin-todo が実際にこれで落ちた
# （毎回別のリポに当たるレースなので、リポ側の問題と見分けがつきにくい）。
# GH_TOKEN を固定すると gh だけでなく git も従う
# （credential.https://github.com.helper が `gh auth git-credential` のため、
#   fetch / push の 403 も一緒に防げる）。
GH_ACCOUNT="${KSK_GH_ACCOUNT:-ekusiek716}"
if [ -z "${GH_TOKEN:-}" ]; then
  GH_TOKEN="$(gh auth token -u "$GH_ACCOUNT" 2>/dev/null)" || true
  if [ -z "$GH_TOKEN" ]; then
    echo -e "${RED}✗ gh のトークンを取得できません（アカウント: $GH_ACCOUNT）${NC}" >&2
    echo "  gh auth login で $GH_ACCOUNT にログインするか、別アカウントなら" >&2
    echo "  KSK_GH_ACCOUNT=<account> か GH_TOKEN=<token> を指定してください" >&2
    exit 1
  fi
  export GH_TOKEN
  echo -e "${CYAN}gh アカウントを $GH_ACCOUNT に固定しました${NC}"
fi

# 中断（Ctrl-C 等）時も処理中リポの一時 worktree を残さない。
# cleanup はループ内で毎回 $repo / $wt を掴んで再定義される。
cleanup() { :; }
trap 'cleanup' EXIT
trap 'cleanup; trap - INT TERM EXIT; exit 130' INT TERM

# ── 引数 → 対象リポのパス解決 ──
resolve_repo() {
  local arg="$1"
  # "/" を含む or 実在ディレクトリならそのまま
  if [[ "$arg" == */* ]] || [ -d "$arg" ]; then
    printf '%s' "$arg"
    return 0
  fi
  # 再編後のカテゴリフォルダを順に探す（issue #403）
  local base
  for base in "$HOME/localdev" "$HOME/localdev/exam-kit-apps" "$HOME/localdev/todo-apps" "$HOME/localdev/trading-bots" "$HOME/localdev/ai-partner" "$HOME/localdev/devtools"; do
    if [ -d "$base/$arg" ]; then
      printf '%s' "$base/$arg"
      return 0
    fi
  done
  return 1
}

REPOS=()
if [ ${#ARGS[@]} -eq 0 ]; then
  REPOS=("${DEFAULT_REPOS[@]}")
else
  for arg in "${ARGS[@]}"; do
    if path="$(resolve_repo "$arg")"; then
      REPOS+=("$path")
    else
      echo -e "${RED}FAIL: '$arg' が見つからない（LocalDev / Examination 配下に無い）${NC}"
      RESULTS+=("$arg: FAIL (not found)")
    fi
  done
fi

# 引数が全部解決できないと REPOS が空のまま。set -u 配下で "${REPOS[@]}" を展開すると
# unbound variable で落ち、下の要約も終了コードも出ないまま終わる（FAIL が握り潰される）。
if [ ${#REPOS[@]} -eq 0 ]; then
  echo ""
  echo -e "${RED}対象リポが1つも解決できませんでした${NC}"
  exit 1
fi

for repo in "${REPOS[@]}"; do
  # 前リポの cleanup（$repo/$wt/$branch を掴んだまま）が trap 経由で誤発火しないよう毎回リセット
  cleanup() { :; }
  name="$(basename "$repo")"
  echo ""
  echo -e "${CYAN}=== $name ===${NC}"
  echo "   $repo"

  # monorepo worktree 対策で -d でなく -e（.git はファイルの場合もある）
  # ディレクトリ自体が無い＝DEFAULT_REPOS と実態がズレている。黄色の SKIP だと
  # 19 個の緑 OK に埋もれて見落とすので FAIL 扱いにする（v1.58.0 配布で
  # 情報セキュリティマネジメント用 が消えていたのを SKIP のまま流し、v1.57.0 も
  # 未適用だったと後から気づいた）。
  if [ ! -e "$repo/.git" ]; then
    if [ ! -d "$repo" ]; then
      echo -e "${RED}FAIL: ディレクトリが存在しない（DEFAULT_REPOS の掃除か clone し直しが必要）${NC}"
      RESULTS+=("$name: FAIL (missing dir: $repo)")
    else
      echo -e "${RED}FAIL: git リポジトリではない${NC}"
      RESULTS+=("$name: FAIL (no git)")
    fi
    continue
  fi

  # ── gh の active account を repo owner に合わせる ──
  # active account が業務側に flip していると private リポが "Repository not found"
  # になり、fetch も gh pr create も静かに失敗する（実際に大量 FAIL を起こした）。
  # リポごとに揃え直してから進める。ガードが無い環境では素通りする。
  if [ -x "$HOME/.claude/scripts/gh-account-guard.sh" ]; then
    bash "$HOME/.claude/scripts/gh-account-guard.sh" "$repo" || true
  fi

  # ── origin/main から一時 worktree を切る ──
  if ! git -C "$repo" fetch origin main >/dev/null 2>&1; then
    echo -e "${RED}FAIL: git fetch origin main（gh の active account が想定と違う可能性。gh auth status を確認）${NC}"
    RESULTS+=("$name: FAIL (fetch)")
    continue
  fi

  branch="chore/bump-ds-$VERSION"
  start_point="origin/main"
  remote_head=""
  if remote_head="$(git -C "$repo" ls-remote --heads origin "refs/heads/$branch" | awk '{print $1}')"; then
    if [ -n "$remote_head" ]; then
      if ! git -C "$repo" fetch origin "$branch:refs/remotes/origin/$branch" >/dev/null 2>&1; then
        echo -e "${RED}FAIL: existing branch fetch${NC}"
        RESULTS+=("$name: FAIL (existing branch fetch)")
        continue
      fi
      start_point="origin/$branch"
      echo "→ 既存 branch を $remote_head から再開"
    fi
  fi
  wt="$(mktemp -d "${TMPDIR:-/tmp}/ds-bump-XXXXXX")"

  cleanup() {
    git -C "$repo" worktree remove --force "$wt" >/dev/null 2>&1
    git -C "$repo" worktree prune >/dev/null 2>&1
    # worktree add -B で作ったローカルブランチも残さない（push 済みなら remote にある）
    git -C "$repo" branch -D "$branch" >/dev/null 2>&1
    rm -rf "$wt"
  }

  if ! git -C "$repo" worktree add -B "$branch" "$wt" "$start_point" >/dev/null 2>&1; then
    echo -e "${RED}FAIL: worktree add${NC}"
    cleanup
    RESULTS+=("$name: FAIL (worktree)")
    continue
  fi

  # ── package.json 群を書き換え（monorepo 対応）──
  # ksk-design-system / 旧名 @ksk/design-system を deps/devDeps/peerDeps に
  # 持つファイルを全部書き換え。値が "*" / "workspace:" 始まりは除外。
  CHANGED_COUNT=0
  while IFS= read -r pkgrel; do
    [ -z "$pkgrel" ] && continue
    if node -e '
      const fs = require("fs");
      const [file, version] = process.argv.slice(1);
      const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
      let changed = false;
      for (const k of ["dependencies", "devDependencies", "peerDependencies"]) {
        if (!pkg[k]) continue;
        const cur = pkg[k]["ksk-design-system"];
        const old = pkg[k]["@ksk/design-system"];
        // 値が "*" / "workspace:" 始まりのものは触らない
        const skip = (v) => typeof v === "string" && (v === "*" || v.startsWith("workspace:"));
        if (old !== undefined) {
          if (skip(old)) continue;
          delete pkg[k]["@ksk/design-system"];
          pkg[k]["ksk-design-system"] = "^" + version;
          changed = true;
        } else if (cur !== undefined) {
          if (skip(cur)) continue;
          pkg[k]["ksk-design-system"] = "^" + version;
          changed = true;
        }
      }
      if (!changed) process.exit(2);
      fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
    ' "$wt/$pkgrel" "$VERSION" 2>/dev/null; then
      CHANGED_COUNT=$((CHANGED_COUNT + 1))
      echo "→ 書換: $pkgrel"
    fi
  done < <(git -C "$wt" ls-files '*package.json')

  if [ "$CHANGED_COUNT" -eq 0 ]; then
    echo -e "${RED}FAIL: ksk-design-system 依存を持つ package.json が無い${NC}"
    cleanup
    RESULTS+=("$name: FAIL (deps)")
    continue
  fi
  echo "→ $CHANGED_COUNT 個の package.json を書き換え"

  # ── vendor tgz 削除（worktree ルート）──
  REMOVED=$(find "$wt/vendor" -maxdepth 1 -name 'ksk-design-system-*.tgz' 2>/dev/null | wc -l | tr -d ' ')
  if [ "$REMOVED" -gt 0 ]; then
    find "$wt/vendor" -maxdepth 1 -name 'ksk-design-system-*.tgz' -exec git -C "$wt" rm -f {} \; >/dev/null 2>&1
    echo "→ $REMOVED 個の vendor/ksk-design-system-*.tgz を削除"
  fi

  # ── npm install（worktree ルート）──
  echo "→ npm install (npm registry から取得)"
  if ! (cd "$wt" && npm install --no-audit --no-fund >/dev/null 2>&1); then
    echo -e "${RED}FAIL: npm install${NC}"
    cleanup
    RESULTS+=("$name: FAIL (npm install)")
    continue
  fi

  # ── インストール検証 ──
  # monorepo は root node_modules に hoist されるのでまずルートで確認。
  # 無ければ書き換えた package.json のあるディレクトリでも試す。
  INSTALLED="$(cd "$wt" && node -p "require('ksk-design-system/package.json').version" 2>/dev/null)"
  if [ "$INSTALLED" != "$VERSION" ]; then
    while IFS= read -r pkgrel; do
      [ -z "$pkgrel" ] && continue
      pkgdir="$wt/$(dirname "$pkgrel")"
      INSTALLED="$(cd "$pkgdir" && node -p "require('ksk-design-system/package.json').version" 2>/dev/null)"
      [ "$INSTALLED" = "$VERSION" ] && break
    done < <(git -C "$wt" ls-files '*package.json')
  fi
  if [ "$INSTALLED" != "$VERSION" ]; then
    echo -e "${RED}FAIL: 期待 $VERSION / 実際 ${INSTALLED:-未検出}${NC}"
    cleanup
    RESULTS+=("$name: FAIL (version mismatch: ${INSTALLED:-none})")
    continue
  fi
  echo "→ ksk-design-system@$INSTALLED 取得確認"

  # ── stage / commit ──
  # 書き換えた package.json 群・全 lockfile・vendor の git rm はいずれも
  # 追跡ファイルの変更なので git add -u で拾える。
  git -C "$wt" add -u >/dev/null 2>&1
  # lockfile が新規生成された場合は -u で拾えないので明示的に add
  git -C "$wt" add -- 'package-lock.json' ':(glob)**/package-lock.json' >/dev/null 2>&1
  if git -C "$wt" diff --staged --quiet; then
    existing_pr="$(cd "$wt" && gh pr list --state open --head "$branch" --json url -q '.[0].url' 2>/dev/null)"
    echo -e "${YELLOW}→ 変更なし${NC} ${existing_pr:-}"
    cleanup
    RESULTS+=("$name: SKIP (no-op${existing_pr:+: $existing_pr})")
    continue
  fi

  if ! git -C "$wt" commit -m "chore: ksk-design-system を v$VERSION に bump

- package.json の ksk-design-system 依存を ^$VERSION に更新（monorepo は全 package.json）
- package-lock.json を npm registry のメタ情報で更新
- vendor/ksk-design-system-*.tgz が残っていれば削除（過去版は git history で追える）" >/dev/null 2>&1; then
    echo -e "${RED}FAIL: commit（pre-commit hook / git identity 等）${NC}"
    cleanup
    RESULTS+=("$name: FAIL (commit)")
    continue
  fi

  # ── DRY_RUN: push/PR せず要約して掃除 ──
  if [ -n "${DRY_RUN:-}" ]; then
    echo -e "${YELLOW}→ DRY_RUN: push / gh pr create はスキップ${NC}"
    git -C "$wt" show --stat HEAD | sed 's/^/   /'
    cleanup
    RESULTS+=("$name: DRY_RUN (commit のみ・push なし)")
    continue
  fi

  # ── push ──
  # 既存 branch から開始しているため、通常 push が fast-forward の場合だけ更新する。
  # 実行中に remote が進んだ場合は失敗させ、force-push で人手の commit を潰さない。
  #
  # gh の active account はループの途中でも flip する。リポ単位のガードを通った後に
  # flip すると push だけが 403 で落ち、"non-fast-forward push" と紛らわしい失敗になる
  # （1.53.0 の配布で宅建用が実際にこれで落ちた）。push の直前で揃え直す。
  if [ -x "$HOME/.claude/scripts/gh-account-guard.sh" ]; then
    bash "$HOME/.claude/scripts/gh-account-guard.sh" "$repo" >/dev/null 2>&1 || true
  fi
  if ! git -C "$wt" push -u origin "$branch" >/dev/null 2>&1; then
    existing_pr="$(cd "$wt" && gh pr list --state open --head "$branch" --json url -q '.[0].url' 2>/dev/null)"
    echo -e "${RED}FAIL: push（remote が進んだ可能性。再実行で安全に再開）${NC} ${existing_pr:-}"
    cleanup
    RESULTS+=("$name: FAIL (non-fast-forward push${existing_pr:+: $existing_pr})")
    continue
  fi

  # ── PR 作成 ──
  pr_body_file="$(mktemp)"
  cat > "$pr_body_file" <<'EOF'
ksk-design-system を v__VERSION__ に bump。

## 変更
- `package.json` の `ksk-design-system` 依存を `^__VERSION__` に更新（monorepo は対象の全 `package.json`）
- `package-lock.json` を npm registry のメタ情報で更新
- `vendor/ksk-design-system-*.tgz` が残っていれば削除（過去版は git history で復元可能）

## メリット
- 配布が npm 標準フローに統一（dependabot / renovate も使える）
- ロールバックは `npm install ksk-design-system@<旧バージョン>` で可能

詳細は DS リポのリリースノート参照。
EOF
  node -e '
    const fs = require("fs");
    const [file, version] = process.argv.slice(1);
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replaceAll("__VERSION__", version));
  ' "$pr_body_file" "$VERSION"

  # gh pr create が失敗しても branch は push 済みなので、ここを成功扱いにすると
  # 配布漏れがログを目視するまで気づけない（2026-08-20 の 1.60.0 配布で
  # 歯科衛生士用が「OK（PR URL 未取得）」のまま PR 不在になった）。
  # PR URL を取れなかったら FAIL として集計する。
  pr_err="$(mktemp)"
  pr_note="既存"
  pr_url="$(cd "$wt" && gh pr list --state open --head "$branch" --json url -q '.[0].url' 2>/dev/null)"
  if [ -z "$pr_url" ]; then
    pr_note="新規"
    pr_url="$(cd "$wt" && gh pr create \
      --title "chore: ksk-design-system v${VERSION} に bump" \
      --body-file "$pr_body_file" \
      2>"$pr_err" | tail -1)"
    # closed / merged 済みの同名ブランチ PR がある場合 gh pr create は失敗するので拾い直す
    if [ -z "$pr_url" ]; then
      pr_url="$(cd "$wt" && gh pr list --head "$branch" --json url -q '.[0].url' 2>/dev/null)"
      pr_note="既存"
    fi
  fi
  rm -f "$pr_body_file"

  # gh pr create は成功時に PR URL を最終行へ出す。URL の形をしていなければ失敗扱い
  # （空文字だけでなく、警告行などを掴んだケースもここで弾く）。
  case "$pr_url" in
    https://github.com/*) ;;
    *)
      echo -e "${RED}FAIL: PR を作成できませんでした${NC}"
      echo "   branch $branch は push 済みなので、手動で PR を作れば復旧できる"
      [ -s "$pr_err" ] && sed 's/^/   /' "$pr_err"
      rm -f "$pr_err"
      cleanup
      RESULTS+=("$name: FAIL (pr create; branch $branch は push 済)")
      continue
      ;;
  esac
  rm -f "$pr_err"

  cleanup
  RESULTS+=("$name: OK ($pr_note) $pr_url")
  echo -e "${GREEN}OK${NC} $pr_url"
done

echo ""
echo "======================================="
for r in "${RESULTS[@]}"; do echo "$r"; done

# FAIL が1件でもあれば非ゼロで終わる。全件 OK の体裁で exit 0 を返すと、
# 呼び出し側（人・CI）が要約を目視しない限り配布漏れに気づけない。
failed=0
for r in "${RESULTS[@]}"; do
  case "$r" in *": FAIL"*) failed=$((failed + 1)) ;; esac
done
if [ "$failed" -gt 0 ]; then
  echo ""
  echo -e "${RED}FAIL: $failed 件${NC}（上の一覧を確認してリトライすること）"
  exit 1
fi
