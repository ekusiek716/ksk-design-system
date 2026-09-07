import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const script = readFileSync(new URL('../scripts/update-consumers.sh', import.meta.url), 'utf8');
const helper = script.match(/notify_release\(\) \{[\s\S]*?\n\}/)?.[0];
// Execute the real notification helper/control-flow with shell-function doubles.
// Never execute the updater's worktree, install, commit or push operations.
function shell(code) {
  return spawnSync('bash', ['--noprofile', '--norc'], {
    input: code, encoding: 'utf8', env: { PATH: process.env.PATH },
  });
}
test('通知helperは明示repo/version/PRをruntimeへ渡す', () => {
  assert.ok(helper);
  const result = shell(`
    VERSION=2.1.2
    NOTICE_RUNTIME=/runtime/check-ds-release.mjs
    gh() { printf '%s' ekusiek716/trip-todo; }
    node() { printf '%s\\n' "$@"; }
    ${helper}
    notify_release . https://github.com/ekusiek716/trip-todo/pull/200
  `);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.stdout.trim().split('\n'), ['/runtime/check-ds-release.mjs', '--repo', 'ekusiek716/trip-todo', '--version', '2.1.2', '--bump-pr', 'https://github.com/ekusiek716/trip-todo/pull/200', '--apply']);
});
test('dry-runではhelperはgh/nodeを呼ばず通知失敗は非ゼロを返す', () => {
  const dry = shell(`DRY_RUN=1; gh() { exit 90; }; node() { exit 91; }; ${helper}
    notify_release . anything`);
  assert.equal(dry.status, 0);
  const failed = shell(`VERSION=2.1.2; NOTICE_RUNTIME=/runtime;
    gh() { printf '%s' ekusiek716/trip-todo; }; node() { return 7; }; ${helper}
    notify_release . https://github.com/ekusiek716/trip-todo/pull/200`);
  assert.equal(failed.status, 7);
});
const noOp = script.slice(script.indexOf('  if git -C "$wt" diff --staged --quiet; then'), script.indexOf('  if ! git -C "$wt" commit'));
test('existingPR no-opは通知を再実行し、通知失敗をPR URL付きで別報告', () => {
  for (const status of [0, 1]) {
    const result = shell(`
      wt=.; branch=chore/bump-ds-2.1.2; name=app; YELLOW=; NC=; RESULTS=()
      git() { return 0; }
      gh() { printf '%s' https://github.com/ekusiek716/trip-todo/pull/200; }
      cleanup() { :; }
      notify_release() { echo 'NOTICE'; return ${status}; }
      for task in one; do
      ${noOp}
      done
      printf '%s\\n' "\${RESULTS[@]}"
    `);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /NOTICE/);
    assert.match(result.stdout, status ? /FAIL \(release notice; PR保持:/ : /SKIP \(no-op/);
    assert.match(result.stdout, /https:\/\/github.com\/ekusiek716\/trip-todo\/pull\/200/);
  }
});
test('既存のinstall/version/push失敗分岐は通知前にcontinueする', () => {
  const noOpIndex = script.indexOf('  if git -C "$wt" diff --staged --quiet; then');
  for (const failure of ['npm install', 'version mismatch:']) {
    const index = script.indexOf(`FAIL (${failure}`);
    assert.ok(index > 0 && index < noOpIndex);
    assert.match(script.slice(index, noOpIndex), /continue/);
  }
  const successNotice = script.indexOf('  if ! notify_release "$wt" "$pr_url"; then');
  assert.ok(successNotice > script.indexOf('FAIL (pr create;'));
  const pushFailure = script.indexOf('FAIL (non-fast-forward push');
  assert.match(script.slice(pushFailure, successNotice), /continue/);
  assert.match(script, /if ! mkdir "\$RUN_LOCK"/);
});
