#!/usr/bin/env node
import { pathToFileURL } from 'node:url';

export const DS_REPO = 'ekusiek716/ksk-design-system';
const REGISTRY = 'https://registry.npmjs.org/ksk-design-system/latest';
const API = 'https://api.github.com';
const SHA = /^[a-f0-9]{40}$/i;
const ID = (value) => Number.isSafeInteger(value) && value > 0;
class NoticeError extends Error {}
const fail = (message) => { throw new NoticeError(message); };

export function validateRepo(repo, githubRepository) {
  if (typeof repo !== 'string' || !/^ekusiek716\/[a-zA-Z0-9_.-]+$/.test(repo)
    || ['.', '..'].includes(repo.split('/')[1])) fail('対象repoはekusiek716配下で指定してください');
  if (githubRepository && githubRepository.toLowerCase() !== repo.toLowerCase()) fail('GITHUB_REPOSITORYと--repoが一致しません');
  return repo;
}

export function parseArgs(args) {
  let repo;
  let apply = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--repo' && repo === undefined && args[i + 1]) repo = args[++i];
    else if (args[i] === '--apply' && !apply) apply = true;
    else fail('使用法: --repo owner/repo [--apply]');
  }
  validateRepo(repo);
  return { repo, apply };
}

export function parseConsumerIssue(value) {
  const match = typeof value === 'string' && /^https:\/\/github\.com\/(ekusiek716\/[a-zA-Z0-9_.-]+)\/issues\/([1-9]\d*)$/.exec(value);
  if (!match || !ID(Number(match[2]))) fail('consumerIssue URLが不正です');
  validateRepo(match[1]);
  return { repo: match[1], number: Number(match[2]) };
}

/** Validate the published JSON contract. Strict by default for contract/CLI checks.
 * The runner uses partial mode to continue independent entries after an error.
 */
export function validateContract(contract, { partial = false } = {}) {
  if (contract?.schemaVersion !== 1 || !Array.isArray(contract.requests)) fail('未対応のconsumer-requests schemaです');
  const requests = [];
  const errors = [];
  const keys = new Set();
  for (const [index, entry] of contract.requests.entries()) {
    try {
      if (!entry || !ID(entry.dsIssue) || !(entry.fixPr === null || ID(entry.fixPr))) fail('依頼entryが不正です');
      const target = parseConsumerIssue(entry.consumerIssue);
      const key = `${entry.dsIssue}:${target.repo.toLowerCase()}:${target.number}`;
      if (keys.has(key)) fail('同一DS依頼・consumerIssueの重複entryです');
      keys.add(key);
      requests.push({ entry, index });
    } catch (error) {
      if (!partial) throw error;
      errors.push({ entry: index, message: error instanceof NoticeError ? error.message : '依頼entryが不正です' });
    }
  }
  return { requests, errors };
}

export function validateRelease(value) {
  if (!value || typeof value.version !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value.version)
    || typeof value.gitHead !== 'string' || !SHA.test(value.gitHead)
    || typeof value.dist?.integrity !== 'string'
    || !/^(sha256|sha384|sha512)-[A-Za-z0-9+/]+={0,2}$/.test(value.dist.integrity)) fail('npm公開metadataが不正です');
  return { version: value.version, gitHead: value.gitHead, integrity: value.dist.integrity };
}

export const noticeMarker = (dsIssue, consumerIssue) => `<!-- ksk-ds-release-notice:${dsIssue}:${consumerIssue} -->`;
export function noticeBody(entry, number, release, commit) {
  return `${noticeMarker(entry.dsIssue, number)}\nDS側の修正がv${release.version}で公開済み。アプリ取り込み・動作確認待ちです。\n\n`
    + `- DS依頼: https://github.com/${DS_REPO}/issues/${entry.dsIssue}\n`
    + `- 修正PR: https://github.com/${DS_REPO}/pull/${entry.fixPr}\n`
    + `- npm: [ksk-design-system@${release.version}](https://www.npmjs.com/package/ksk-design-system/v/${release.version})\n`
    + `- 修正commit: ${commit}\n- 公開gitHead: ${release.gitHead}\n- dist.integrity: ${release.integrity}\n\n`
    + 'アプリへの取り込みと動作確認が終わったら、この依頼issueで結果を確認してください。';
}

/** Network and environment are injectable. The caller sets process.exitCode from the result.
 * Local invocations are dry-run only. Use workflow_dispatch for manual writes;
 * --apply requires GITHUB_ACTIONS=true and a workflow-provided GH_TOKEN.
 * Schedule this runner with a per-repository Actions concurrency group: GitHub comments
 * have no atomic create-if-marker-absent API, so overlapping writers must be serialized.
 */
export async function run({ repo, apply = false, env = process.env, fetchImpl = globalThis.fetch, timeoutMs = 15000 } = {}) {
  const results = [];
  const errors = [];
  const safeMessage = (error) => {
    const message = error instanceof NoticeError ? error.message : '処理に失敗しました';
    return env.GH_TOKEN ? message.split(env.GH_TOKEN).join('[REDACTED]') : message;
  };
  try {
    validateRepo(repo, env.GITHUB_REPOSITORY);
    if (apply && env.GITHUB_ACTIONS !== 'true') fail('--applyはGitHub Actions専用です。ローカルでは--applyを省略し、書込はworkflow_dispatchで実行してください');
    if (!env.GH_TOKEN) fail('GH_TOKENが必要です');
    if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) fail('timeoutMsが不正です');
    const own = `/repos/${repo}`;
    async function request(path, { method = 'GET', body, allow404 = false, allow422 = false, registry = false } = {}) {
      if (method !== 'GET' && (!apply || !(path === `${own}/labels` || path.startsWith(`${own}/issues/`)))) fail('書込対象が許可されていません');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl(registry ? REGISTRY : `${API}${path}`, {
          method, redirect: 'error', signal: controller.signal,
          headers: registry ? { Accept: 'application/json' } : {
            Accept: 'application/vnd.github+json', Authorization: `Bearer ${env.GH_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json',
          },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        });
        if ((allow404 && response.status === 404) || (allow422 && response.status === 422)) return { status: response.status };
        if (!response.ok) fail(`API処理失敗 (HTTP ${response.status})`);
        return { status: response.status, data: response.status === 204 ? null : await response.json(),
          next: /rel="next"/.test(response.headers.get('link') || '') };
      } catch (error) {
        if (error instanceof NoticeError) throw error;
        fail(controller.signal.aborted ? 'APIタイムアウト' : 'API通信またはJSON解析に失敗しました');
      } finally { clearTimeout(timer); }
    }
    async function pages(path) {
      const values = [];
      for (let page = 1; ; page++) {
        const response = await request(`${path}?per_page=100&page=${page}`);
        if (!Array.isArray(response.data)) fail('API一覧形式が不正です');
        values.push(...response.data);
        if (!response.next && response.data.length < 100) return values;
      }
    }
    const release = validateRelease((await request('', { registry: true })).data);
    const manifest = await request(`/repos/${DS_REPO}/contents/contracts/consumer-requests.json?ref=${release.gitHead}`, { allow404: true });
    if (manifest.status === 404) {
      // Contents 404 can also hide an unknown commit or an inaccessible repository.
      const commit = (await request(`/repos/${DS_REPO}/commits/${release.gitHead}`)).data;
      if (typeof commit?.sha !== 'string' || commit.sha.toLowerCase() !== release.gitHead.toLowerCase()) fail('公開gitHeadの存在を確認できません');
      return { exitCode: 0, results: [{ status: 'legacy-release' }], errors };
    }
    let contract;
    try {
      if (manifest.data?.encoding !== 'base64' || typeof manifest.data.content !== 'string') fail('公開contract形式が不正です');
      contract = JSON.parse(Buffer.from(manifest.data.content, 'base64').toString('utf8'));
    } catch { fail('公開contractを解析できません'); }
    const validated = validateContract(contract, { partial: true });
    errors.push(...validated.errors.map((error) => ({ ...error, message: safeMessage(new NoticeError(error.message)) })));
    const seen = new Set();
    let labelReady = false;
    for (const { index, entry } of validated.requests) {
      try {
        if (!entry || !ID(entry.dsIssue) || !(entry.fixPr === null || ID(entry.fixPr))) fail('依頼entryが不正です');
        const target = parseConsumerIssue(entry.consumerIssue);
        if (target.repo.toLowerCase() !== repo.toLowerCase()) continue;
        const result = { dsIssue: entry.dsIssue, consumerIssue: target.number };
        if (entry.fixPr === null) { results.push({ ...result, status: 'unfixed' }); continue; }
        const pr = (await request(`/repos/${DS_REPO}/pulls/${entry.fixPr}`)).data;
        if (pr?.merged !== true) { results.push({ ...result, status: 'unmerged' }); continue; }
        if (typeof pr.merge_commit_sha !== 'string' || !SHA.test(pr.merge_commit_sha)) fail('修正PRのcommit SHAが不正です');
        const comparison = (await request(`/repos/${DS_REPO}/compare/${pr.merge_commit_sha}...${release.gitHead}`)).data;
        if (!['ahead', 'identical', 'behind', 'diverged'].includes(comparison?.status)) fail('commit比較結果が不正です');
        if (!['ahead', 'identical'].includes(comparison.status)) { results.push({ ...result, status: 'unreleased' }); continue; }
        const issuePath = `${own}/issues/${target.number}`;
        const issue = (await request(issuePath)).data;
        if (!issue || issue.pull_request) fail('通知先は通常のissueである必要があります');
        if (issue.state === 'closed') { results.push({ ...result, status: 'closed' }); continue; }
        if (issue.state !== 'open') fail('通知先issueの状態が不正です');
        const marker = noticeMarker(entry.dsIssue, target.number);
        const comments = await pages(`${issuePath}/comments`);
        const exists = seen.has(marker) || comments.some((comment) => comment.user?.login === 'github-actions[bot]'
          && comment.user?.type === 'Bot' && typeof comment.body === 'string' && comment.body.includes(marker));
        if (!apply) { results.push({ ...result, status: exists ? 'would-repair-labels' : 'would-notify' }); continue; }
        if (!exists) await request(`${issuePath}/comments`, { method: 'POST', body: { body: noticeBody(entry, target.number, release, pr.merge_commit_sha) } });
        seen.add(marker);
        if (!labelReady) {
          const labelPath = `${own}/labels/${encodeURIComponent('ds:released')}`;
          if ((await request(labelPath, { allow404: true })).status === 404) {
            const created = await request(`${own}/labels`, { method: 'POST', body: { name: 'ds:released', color: '0e8a16', description: 'DS修正版公開済み・アプリ取り込みと動作確認待ち' }, allow422: true });
            if (created.status === 422) await request(labelPath); // Another run may have created it.
          }
          labelReady = true;
        }
        const labels = await pages(`${issuePath}/labels`);
        if (!labels.some((label) => label.name === 'ds:released')) await request(`${issuePath}/labels`, { method: 'POST', body: { labels: ['ds:released'] } });
        if (labels.some((label) => label.name === 'ds:waiting')) await request(`${issuePath}/labels/${encodeURIComponent('ds:waiting')}`, { method: 'DELETE', allow404: true });
        results.push({ ...result, status: exists ? 'labels-repaired' : 'notified' });
      } catch (error) { errors.push({ entry: index, message: safeMessage(error) }); }
    }
  } catch (error) { errors.push({ message: safeMessage(error) }); }
  return { exitCode: errors.length ? 1 : 0, results, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await run(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.exitCode;
  } catch { console.error('引数が不正です。使用法: --repo owner/repo [--apply]'); process.exitCode = 1; }
}
