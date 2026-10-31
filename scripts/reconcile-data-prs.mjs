#!/usr/bin/env node
/**
 * Keep the long-lived data-refresh PRs moving on their own
 * (FFC-Cloudflare-Automation#908).
 *
 * Every data workflow in this repo pushes to a long-lived `data/*` branch via
 * peter-evans/create-pull-request and (mostly) arms auto-merge. Ruleset
 * "Merge Queue + Branch Up-to-Date" requires the branch be current with `main`,
 * so while one data PR waits, the others merge into `main` and it falls behind.
 * Auto-merge stays armed but never enqueues, and nothing issues an "Update
 * branch" — the PR hangs indefinitely at `mergeable_state: unstable`: mergeable,
 * all checks green, no conflicts. That is why it went unseen for six hours.
 *
 * The race is lost AFTER the creating workflow has exited, so the creating
 * workflow is the wrong place to watch from. This is a periodic reconciler
 * instead. Per cycle, for each open PR on a `data/*` branch:
 *
 *   1. behind `main`       -> PUT /pulls/{n}/update-branch
 *   2. auto-merge not set  -> enablePullRequestAutoMerge (GraphQL)
 *   3. CI never ran        -> POST /actions/runs/{id}/rerun
 *
 * Step 2 is not redundant with the workflows: `update-sites-data.yml`,
 * `sync-applications.yml` and `whmcs-intake.yml` open data PRs and never arm
 * auto-merge at all, so those could not merge themselves even from behind=0.
 * Arming centrally also covers the next data workflow that forgets.
 *
 * Step 3 is the gap this reconciler had, and it is the one that hurt. These PRs
 * are authored by `github-actions[bot]`, so `CI - Build and Test` lands in
 * `action_required` and simply never runs: no failure, no timeout, a required
 * check that is permanently absent. Auto-merge stays armed with nothing to fire
 * on. Measured 2026-09-07: #1036 (`data/roadmap`) sat exactly that way for THREE
 * DAYS, armed since creation, while this reconciler reported it accurately on
 * every 30-minute sweep — `open 79h, now current and armed but not merged` — and
 * nothing consumed the report. Clearing it by hand took one API call.
 *
 * A re-run request from an actor with write access clears `action_required` and
 * the run proceeds (verified on #1036 and #1052 the same day: run_attempt 2 and
 * 3, both green). Whether the ambient GITHUB_TOKEN carries that authority is NOT
 * yet proven — the manual clearances were made as a user. So a refusal here is
 * reported as `blocked`, never swallowed: the worst case is today's behaviour
 * plus an explicit reason, which is strictly better than today's silence.
 *
 * Reporting: a PR that is still un-reconciled after STUCK_AFTER_HOURS fails
 * this run. That is deliberate — a red scheduled run is what the existing
 * failure-alert layer (FFC-Cloudflare-Automation#843 / #832) already watches,
 * so this builds no second alerting path.
 *
 *   4. unresolved review threads -> ESCALATE ONCE, then stop re-reporting (#1388)
 *
 * The fourth cause is the one the three remedies above cannot touch, and it is
 * why this script needed changing rather than extending. The org-level ruleset
 * `FFC Branch Protection - Default Branch` sets
 * `required_review_thread_resolution: true` alongside `copilot_code_review`
 * with `review_on_push: true`. So a data PR that does not merge within the few
 * seconds before Copilot's first comment lands acquires an unresolved thread,
 * and `mergeStateStatus` goes BLOCKED with every check green — a state visible
 * only in `/rulesets/<id>`, never in the checks list a reader looks at first.
 *
 * Measured on #1379: open since 2026-10-05, 0 behind, auto-merge armed, 4/4
 * checks green, 6 unresolved Copilot threads, and `Reconcile Data PRs` red on
 * every ~30-minute sweep for 26 days — the last success was 2026-10-05T12:16Z.
 * Each sweep printed one accurate line, `open 630h, now current and armed but
 * not merged — check the required checks and review gate on it`, which names
 * neither the cause nor an action, and which no human was subscribed to: the
 * alert layer this script defers to above (740) watches four satellite
 * workflows, all of them `Security Audit`, and not this one.
 *
 * Two consequences, and they are the whole of this change:
 *
 *  - **A push cannot clear a thread, and it re-arms the reviewer.** With
 *    `review_on_push: true`, update-branching a thread-blocked PR produces a
 *    fresh review, which can file fresh threads. So the remedy for cause 1 is
 *    actively counter-productive here and is suppressed.
 *  - **A red that means "working as intended" is not a signal.** The escalation
 *    is delivered where a human reads it — a comment on the PR naming each
 *    unresolved thread and what it asks for — exactly once per (PR, head), and
 *    the run is then green. It goes red only if the escalation itself fails,
 *    which is the one state the operator can act on by reading this job.
 *
 * Deliberately NOT done: resolving a thread, and disarming auto-merge. #1379's
 * threads are substantive (a missing `domain-expiry.json` entry; a Tier 6
 * reclassification that `scripts/generate-sites-alerts.mjs:35` drops from health
 * alerts, tracked in #1460), and resolving the last thread on an armed PR merges
 * it instantly. Both are human judgement; this script only makes the condition
 * legible.
 *
 * Auth: the workflow's built-in GITHUB_TOKEN (contents: write, pull-requests:
 * write). Unlike the data generators, this script does NOT degrade to exit 0 on
 * an API failure — silence is the failure mode it exists to remove.
 */

import { pathToFileURL } from 'url'

const API = 'https://api.github.com'

/** Long-lived data-refresh branches all share this prefix. */
export const DATA_BRANCH_PREFIX = 'data/'

/** A PR un-reconciled for longer than this is reported rather than left silent. */
export const DEFAULT_STUCK_AFTER_MS = 3 * 60 * 60 * 1000

/** Where the thread-block mechanism itself is tracked, for the escalation body. */
export const THREAD_BLOCK_ISSUE = 1388

/**
 * Makes the thread-block escalation once-per-(PR, head).
 *
 * Keyed on the head SHA rather than the PR: a new head is a new state a human
 * has not been told about, and its thread set can differ. Keyed on the PR alone,
 * a push that added a thread would never be escalated; keyed on nothing, this
 * would comment every 30 minutes, which is the loop in a louder costume.
 */
export function threadBlockMarker(headSha) {
  return `<!-- reconcile-data-prs:thread-block:${headSha} -->`
}

/**
 * The escalation comment. Pure, so its wording is testable.
 *
 * Every claim in here is threaded from the caller's measurement rather than
 * written as prose. The first draft hard-coded "0 behind `main`, auto-merge
 * armed, every check green" — true of #1379 and of nothing else, since the
 * trigger is `unresolvedThreads > 0` alone. Copilot caught it on this PR:
 * a thread-blocked PR that is 12 behind would have been told it was current, in
 * the one artefact whose whole job is to be the thing a human trusts. An
 * escalation that misstates the state is worse than the silence it replaces.
 *
 * `every check green` is gone rather than parameterised: this script never reads
 * check conclusions, so it has no business asserting them either way.
 */
export function buildThreadBlockComment({
  headSha,
  hours,
  threads,
  behindBy = 0,
  autoMergeEnabled = false,
}) {
  const lines = [
    threadBlockMarker(headSha),
    '## This data PR is blocked on review threads, not on anything this reconciler can fix',
    '',
    `Open ${hours}h, ${behindBy} behind \`main\`, auto-merge ` +
      `${autoMergeEnabled ? 'armed' : '**not** armed'} — and not mergeable whatever the checks ` +
      'say, because the org ruleset `FFC Branch Protection - Default Branch` sets ' +
      '`required_review_thread_resolution: true`. That gate reports nowhere in the checks list, ' +
      'which is why this can look healthy.',
    '',
    `**${threads.length} unresolved review thread${threads.length === 1 ? '' : 's'}:**`,
    '',
  ]
  for (const t of threads) {
    const where = t.line ? `${t.path}:${t.line}` : t.path
    const who = t.author ? `@${t.author}` : 'reviewer'
    const asks = (t.body || '').replace(/\s+/g, ' ').trim().slice(0, 220)
    lines.push(`- \`${where}\` — ${who}: ${asks}${t.url ? ` ([thread](${t.url}))` : ''}`)
  }
  lines.push(
    '',
    'A human has to answer each one. Two things this reconciler deliberately does **not** do:',
    '',
    `- **It will not update-branch this PR**${behindBy > 0 ? `, though it is ${behindBy} behind` : ''}. ` +
      'The same ruleset sets `review_on_push: true`, so a push re-triggers the reviewer and can ' +
      'file fresh threads — the remedy would extend the block.',
    autoMergeEnabled
      ? '- **It will not resolve a thread or disarm auto-merge.** Auto-merge **is** armed, so ' +
          'resolving the last thread merges this PR immediately. That sequencing is a human decision.'
      : '- **It will not resolve a thread.** Auto-merge is not armed on this PR, so clearing the ' +
          'threads will not merge it on its own — it still needs a merge after that.',
    '',
    `This comment is posted once per head (\`${headSha.slice(0, 8)}\`). Later sweeps will pass ` +
      'green rather than re-reporting, so a recurring red no longer stands in for this message. ' +
      `Mechanism: #${THREAD_BLOCK_ISSUE}.`
  )
  return lines.join('\n')
}

/** True for the long-lived data-refresh branches this reconciler owns. */
export function isDataBranch(ref) {
  return typeof ref === 'string' && ref.startsWith(DATA_BRANCH_PREFIX)
}

/**
 * What a single PR needs, before anything is attempted. Pure.
 *
 * `draft` matters because auto-merge cannot be armed on a draft: a draft data PR
 * is a human deliberately holding it, so it is skipped rather than forced.
 */
export function planFor(pr, { nowMs, stuckAfterMs = DEFAULT_STUCK_AFTER_MS } = {}) {
  const ageMs = Number.isFinite(pr.createdAtMs) ? nowMs - pr.createdAtMs : 0
  const behindBy = Number.isFinite(pr.behindBy) ? pr.behindBy : 0
  const unapprovedRuns = Number.isFinite(pr.unapprovedRuns) ? pr.unapprovedRuns : 0
  const unresolvedThreads = Number.isFinite(pr.unresolvedThreads) ? pr.unresolvedThreads : 0
  // No remedy, by design (#1388): resolving a thread is human judgement, and on
  // an armed PR resolving the last one merges it. So this is a DIAGNOSIS, not a
  // `needs*` action -- its only effect on the plan is to suppress the push below.
  const threadBlocked = !pr.draft && unresolvedThreads > 0
  // `review_on_push: true` means an update-branch re-triggers the reviewer, so
  // the cause-1 remedy extends the block instead of clearing it.
  //
  // `main()` also short-circuits a thread-blocked PR before reaching the remedy,
  // so today this clause changes no behaviour and is pinned only by a unit test.
  // It is here because this function's contract is to say what a PR needs on its
  // own terms: a later refactor that drops the short-circuit must not silently
  // get the push back.
  const needsUpdate = !pr.draft && behindBy > 0 && !threadBlocked
  const needsAutoMerge = !pr.draft && !pr.autoMergeEnabled
  // A required check stuck in `action_required` never reports, so auto-merge has
  // nothing to fire on however current and armed the PR is. Drafts are skipped
  // for the same reason as everything else here: a human is holding it.
  const needsApproval = !pr.draft && unapprovedRuns > 0
  return {
    number: pr.number,
    headRef: pr.headRef,
    draft: Boolean(pr.draft),
    behindBy,
    autoMergeEnabled: Boolean(pr.autoMergeEnabled),
    unapprovedRuns,
    unresolvedThreads,
    threadBlocked,
    ageMs,
    needsUpdate,
    needsAutoMerge,
    needsApproval,
    // Age only. Whether it is actually stuck is decided from the state AFTER
    // this cycle's remedies — judging it from the plan would flag a PR the
    // reconciler had just rescued.
    old: ageMs >= stuckAfterMs,
  }
}

/**
 * Whether the run should fail, from the post-action results. Pure.
 *
 * Two ways a data PR earns a human's attention:
 *
 *  - `blocked` — a conflict, or an API refusal we do not understand. Needs a
 *    human by definition, at any age.
 *  - still open past the stuck threshold. Note this fires even when every
 *    remedy succeeded: a data PR that has been open for hours was stuck for
 *    hours, and the producer workflow that let it happen is worth knowing about.
 *    Reconciliation makes the dashboards current again; it does not make the
 *    stall un-happen.
 *
 * A PR the merge queue already owns is `progressing`, not stuck — the queue is
 * mid-merge and an update would fight it. In dry-run nothing was attempted, so
 * the verdict is reported but not enforced.
 */
export function decideRunOutcome(results, { dryRun = false } = {}) {
  const blocked = results.filter((r) => r.outcome === 'blocked')
  // `escalated` is a THIRD state beside reconciled and stuck: a human has been
  // told, in a place they read, exactly once for this head. Re-reporting it each
  // sweep is the defect (#1388) -- 26 days of red that meant "working as
  // intended" is what made the one line it printed unreadable.
  const escalated = results.filter((r) => r.outcome === 'escalated')
  const stuck = results.filter(
    (r) =>
      !blocked.includes(r) &&
      !escalated.includes(r) &&
      r.old &&
      !r.progressing &&
      r.outcome !== 'skipped'
  )
  const reasons = []
  for (const r of blocked) reasons.push(`#${r.number} (${r.headRef}): ${r.reason}`)
  for (const r of stuck) {
    const hours = Math.round(r.ageMs / 3600000)
    reasons.push(
      r.behindBy > 0 || !r.autoMergeEnabled || r.unapprovedRuns > 0 || r.unresolvedThreads > 0
        ? `#${r.number} (${r.headRef}): still un-reconciled after ${hours}h ` +
            `(behind=${r.behindBy}, autoMerge=${r.autoMergeEnabled}, ` +
            `unapprovedRuns=${r.unapprovedRuns || 0}, ` +
            `unresolvedThreads=${r.unresolvedThreads || 0})`
        : `#${r.number} (${r.headRef}): open ${hours}h, now current and armed but not merged — ` +
            `check the required checks and review gate on it`
    )
  }
  const escalations = escalated.map(
    (r) =>
      `#${r.number} (${r.headRef}): ${r.unresolvedThreads} unresolved review thread(s) — ` +
      `${r.reason || 'escalated on the PR'}`
  )
  return { failed: !dryRun && reasons.length > 0, reasons, escalations }
}

/** Job-summary markdown. Pure. */
export function buildSummary(results, { dryRun = false, verdict } = {}) {
  const lines = [`## Data-PR reconciler${dryRun ? ' (dry-run)' : ''}`, '']
  if (!results.length) {
    lines.push('No open `data/*` PRs. Nothing to reconcile.')
    return lines.join('\n')
  }
  lines.push('| PR | Branch | Behind | Auto-merge | Threads | Action | Outcome |')
  lines.push('| --- | --- | --- | --- | --- | --- | --- |')
  for (const r of results) {
    lines.push(
      `| #${r.number} | \`${r.headRef}\` | ${r.behindBy} | ${r.autoMergeEnabled ? 'yes' : 'no'} | ` +
        `${r.unresolvedThreads || 0} | ` +
        `${r.actions.length ? r.actions.join(', ') : '—'} | ${r.outcome}${r.reason ? ` (${r.reason})` : ''} |`
    )
  }
  if (verdict?.reasons?.length) {
    lines.push('', '### Needs attention', '')
    for (const reason of verdict.reasons) lines.push(`- ${reason}`)
    if (dryRun) lines.push('', '_Dry-run: verdict reported, not enforced._')
  }
  // Rendered even though the run passes: a green run that says nothing is how a
  // thread-blocked PR would go quiet in the other direction (#1388).
  if (verdict?.escalations?.length) {
    lines.push('', '### Escalated to a human (run passes)', '')
    for (const line of verdict.escalations) lines.push(`- ${line}`)
  }
  return lines.join('\n')
}

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'

function headers() {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function gh(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers || {}) },
  })
  const text = await res.text()
  let body = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = { message: text.slice(0, 200) }
    }
  }
  return { ok: res.ok, status: res.status, body }
}

async function ghJson(path) {
  const { ok, status, body } = await gh(path)
  if (!ok) throw new Error(`GitHub API ${path} -> ${status} ${body?.message || ''}`.trim())
  return body
}

/** Open PRs on `data/*` branches. One page: this repo never has 100 open PRs. */
async function listDataPulls() {
  const pulls = await ghJson(`/repos/${repo}/pulls?state=open&per_page=100`)
  return pulls.filter((p) => isDataBranch(p.head?.ref))
}

async function behindBy(pr) {
  const cmp = await ghJson(
    `/repos/${repo}/compare/${encodeURIComponent(pr.base.ref)}...${encodeURIComponent(pr.head.ref)}`
  )
  return Number.isFinite(cmp.behind_by) ? cmp.behind_by : 0
}

/**
 * Workflow runs on this head that are waiting for a maintainer to press
 * "Approve and run workflows". GitHub models that as a COMPLETED run whose
 * conclusion is `action_required` — not as a pending or queued one, which is
 * why it never shows up as something in flight and never times out.
 *
 * One page: a PR head with more than 100 runs is not a case this reconciler is
 * for, and the REST budget is shared org-wide (hub AGENTS.md).
 */
async function unapprovedRunsFor(headSha) {
  const runs = await ghJson(
    `/repos/${repo}/actions/runs?head_sha=${encodeURIComponent(headSha)}&per_page=100`
  )
  return (runs.workflow_runs || []).filter((r) => r.conclusion === 'action_required')
}

/**
 * Unresolved review threads on a PR, with enough of each to name what it asks.
 *
 * GraphQL-only: REST exposes review *comments* but not thread resolution, which
 * is the field the ruleset gates on (hub CLAUDE.md, "Review threads are
 * GraphQL-only").
 *
 * Fails closed on a second page rather than paginating. An unresolved count
 * taken from one page can only ever come out LOW, and a low count reads as
 * "not thread-blocked" -- which routes the PR straight back into the catch-all
 * this check exists to replace. A data PR with >100 threads is not a case this
 * reconciler is for.
 */
async function unresolvedThreadsFor(number) {
  const [owner, name] = repo.split('/')
  const query =
    'query($owner:String!,$name:String!,$number:Int!){repository(owner:$owner,name:$name)' +
    '{pullRequest(number:$number){reviewThreads(first:100){totalCount pageInfo{hasNextPage}' +
    'nodes{isResolved path line comments(first:1){nodes{author{login} body url}}}}}}}'
  const res = await fetch(`${API}/graphql`, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { owner, name, number } }),
  })
  const body = await res.json().catch(() => null)
  const threads = body?.data?.repository?.pullRequest?.reviewThreads
  if (!res.ok || body?.errors || !threads) {
    const message = body?.errors?.map((e) => e.message).join('; ') || `HTTP ${res.status}`
    throw new Error(`could not read review threads on #${number}: ${message}`)
  }
  if (threads.pageInfo?.hasNextPage) {
    throw new Error(
      `#${number} has more than 100 review threads (totalCount=${threads.totalCount}); ` +
        'a count from one page can only under-report, and under-reporting hides the block'
    )
  }
  return threads.nodes
    .filter((t) => !t.isResolved)
    .map((t) => {
      const first = t.comments?.nodes?.[0] || {}
      return {
        path: t.path,
        line: t.line,
        author: first.author?.login || '',
        body: first.body || '',
        url: first.url || '',
      }
    })
}

/** Whether this exact head has already been escalated. One page: see above. */
async function alreadyEscalated(number, marker) {
  const comments = await ghJson(`/repos/${repo}/issues/${number}/comments?per_page=100`)
  return (comments || []).some((c) => typeof c.body === 'string' && c.body.includes(marker))
}

async function postComment(number, text) {
  const { ok, status, body } = await gh(`/repos/${repo}/issues/${number}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: text }),
  })
  return { ok, status, message: body?.message || '' }
}

/** Re-requesting a run is what clears `action_required`; there is no "approve" verb for it. */
async function rerunRun(runId) {
  const { ok, status, body } = await gh(`/repos/${repo}/actions/runs/${runId}/rerun`, {
    method: 'POST',
  })
  return { ok, status, message: body?.message || '' }
}

async function enableAutoMerge(nodeId) {
  const query =
    'mutation($id:ID!){enablePullRequestAutoMerge(input:{pullRequestId:$id,mergeMethod:MERGE})' +
    '{pullRequest{number}}}'
  const res = await fetch(`${API}/graphql`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query, variables: { id: nodeId } }),
  })
  const body = await res.json().catch(() => null)
  const message = body?.errors?.map((e) => e.message).join('; ') || ''
  return { ok: res.ok && !body?.errors, message }
}

export async function main() {
  if (!token) throw new Error('GITHUB_TOKEN is required — refusing to report a silent success.')
  const dryRun = /^(1|true)$/i.test(process.env.DRY_RUN || '')
  const stuckAfterMs = process.env.STUCK_AFTER_HOURS
    ? Number(process.env.STUCK_AFTER_HOURS) * 3600000
    : DEFAULT_STUCK_AFTER_MS
  const nowMs = Date.now()

  const pulls = await listDataPulls()
  const results = []

  for (const pr of pulls) {
    const base = {
      number: pr.number,
      headRef: pr.head.ref,
      draft: pr.draft,
      autoMergeEnabled: Boolean(pr.auto_merge),
      createdAtMs: new Date(pr.created_at).getTime(),
    }

    // Drafts are skipped whatever the answer, so do not spend a compare call
    // on them — the REST budget is shared org-wide (hub AGENTS.md).
    if (pr.draft) {
      results.push({
        ...planFor({ ...base, behindBy: 0 }, { nowMs, stuckAfterMs }),
        actions: [],
        outcome: 'skipped',
        reason: 'draft — left for its author',
        progressing: false,
      })
      continue
    }

    // Both lookups are spent only on non-drafts. One each per cycle, plus a
    // re-read of the runs (and one PR fetch) in the single case where an
    // update-branch moved the head out from under the first one.
    const unapproved = await unapprovedRunsFor(pr.head.sha)
    const threads = await unresolvedThreadsFor(pr.number)
    const plan = planFor(
      {
        ...base,
        behindBy: await behindBy(pr),
        unapprovedRuns: unapproved.length,
        unresolvedThreads: threads.length,
      },
      { nowMs, stuckAfterMs }
    )
    const result = { ...plan, actions: [], outcome: 'ok', reason: '', progressing: false }

    // Cause 4 (#1388). Handled before every remedy, because the cause-1 remedy
    // makes this worse: `review_on_push: true` turns an update-branch into a
    // fresh review. Escalate once per head and let the run pass; go red only if
    // the escalation itself could not be delivered, which is the one state an
    // operator reading this job can act on.
    if (plan.threadBlocked) {
      const marker = threadBlockMarker(pr.head.sha)
      const comment = buildThreadBlockComment({
        headSha: pr.head.sha,
        hours: Math.round(plan.ageMs / 3600000),
        threads,
        // From the plan, never assumed: the trigger is `unresolvedThreads > 0`,
        // which says nothing about either of these.
        behindBy: plan.behindBy,
        autoMergeEnabled: plan.autoMergeEnabled,
      })
      if (dryRun) {
        result.outcome = 'escalated'
        result.actions.push(`would escalate ${threads.length} unresolved thread(s) on the PR`)
        result.reason = 'dry-run: not posted'
      } else {
        const posted = await alreadyEscalated(pr.number, marker).catch(() => null)
        if (posted === null) {
          result.outcome = 'blocked'
          result.reason = 'could not read PR comments to check for an existing escalation'
        } else if (posted) {
          result.outcome = 'escalated'
          result.reason = 'already escalated on this head'
        } else {
          const { ok, status, message } = await postComment(pr.number, comment)
          if (ok) {
            result.outcome = 'escalated'
            result.actions.push(`escalated ${threads.length} unresolved thread(s) on the PR`)
            result.reason = 'escalation comment posted'
          } else {
            // Named, never swallowed: with no comment delivered, a green run
            // would be the silence this whole script exists to remove.
            result.outcome = 'blocked'
            result.reason = `escalation comment ${status}: ${message.slice(0, 120)}`
          }
        }
      }
      results.push(result)
      continue
    }

    // Before update-branch: an update pushes a new head, which abandons these
    // runs and creates fresh ones. Clearing them first means the approval is
    // spent on a head that is about to be replaced, so do the opposite --
    // record the need, and act on it after any branch update below.
    const clearApprovals = async () => {
      const headMoved = result.actions.some((a) => a === 'update-branch')
      // Gate on the head having MOVED as well as on the pre-update plan. An
      // update-branch replaces the head, and the new head can carry
      // `action_required` runs even when the old one carried none — which is the
      // common case, since the update pushes a fresh commit whose checks have to
      // be approved all over again. Gating on `plan.needsApproval` alone skips
      // the re-read in exactly that case and reports the PR reconciled while it
      // is still stalled: the failure mode this whole remedy exists to remove.
      // (Copilot, second review on #1054.)
      if ((!plan.needsApproval && !headMoved) || result.outcome === 'blocked') return
      if (dryRun) {
        result.actions.push(
          headMoved
            ? 'would re-read workflow runs after update-branch and re-run any unapproved'
            : `would re-run ${unapproved.length} unapproved workflow run(s)`
        )
        return
      }
      // Re-read: an update-branch above moved the head, so the runs gathered
      // for the old head are gone and the new head has its own.
      //
      // `pr.head.sha` is from the listing at the top of the cycle and is STALE
      // here — re-reading with it just fetches the dead head's runs again, which
      // is the very mistake this branch exists to avoid. Ask the PR for its
      // current head first. (Caught in review on this PR: the first version used
      // `pr.head.sha`, and the test asserted only that two lookups happened, so
      // it passed while approving nothing.)
      const live = headMoved
        ? await ghJson(`/repos/${repo}/pulls/${pr.number}`)
            .then((fresh) => unapprovedRunsFor(fresh.head.sha))
            .catch(() => null)
        : unapproved
      if (live === null) {
        result.outcome = 'blocked'
        result.reason = 'could not re-read workflow runs after update-branch'
        return
      }
      if (!live.length) {
        result.unapprovedRuns = 0
        return
      }
      const failures = []
      for (const run of live) {
        const { ok, status, message } = await rerunRun(run.id)
        if (!ok) failures.push(`${run.id}: ${status} ${message}`.trim())
      }
      if (failures.length) {
        result.outcome = 'blocked'
        // Named explicitly: if the ambient GITHUB_TOKEN cannot re-request a run,
        // that is the finding, and it must not read as "nothing needed doing".
        result.reason = `re-run refused (${failures.length}/${live.length}) — ${failures[0].slice(0, 100)}`
      } else {
        result.actions.push(`re-ran ${live.length} unapproved workflow run(s)`)
        result.unapprovedRuns = 0
      }
    }

    if (plan.needsUpdate) {
      if (dryRun) {
        result.actions.push('would update-branch')
      } else {
        const { ok, status, body } = await gh(`/repos/${repo}/pulls/${pr.number}/update-branch`, {
          method: 'PUT',
        })
        const message = body?.message || ''
        if (ok) {
          result.actions.push('update-branch')
          result.behindBy = 0
        } else if (/queue/i.test(message)) {
          // Already in the merge queue: the queue owns the branch and rejects an
          // update. Not a failure — the PR is progressing (hub AGENTS.md).
          result.actions.push('skipped update-branch (in merge queue)')
          result.progressing = true
        } else {
          // A 422 can also mean the branch is already current: another actor (a
          // human clicking "Update branch", the queue) got there between our
          // compare and this call. Re-read the comparison rather than pattern-
          // matching a message string we have never observed — behind=0 means
          // there was nothing to do, and anything else (including a comparison
          // we cannot re-read) stays blocked rather than being swallowed.
          const recheck = await behindBy(pr).catch(() => null)
          if (recheck === 0) {
            result.actions.push('branch already current, nothing to update')
            result.behindBy = 0
          } else {
            result.outcome = 'blocked'
            result.reason = `update-branch ${status}: ${message.slice(0, 120)}`
          }
        }
      }
    }

    await clearApprovals()

    if (plan.needsAutoMerge && result.outcome !== 'blocked') {
      if (dryRun) {
        result.actions.push('would enable auto-merge')
      } else {
        const { ok, message } = await enableAutoMerge(pr.node_id)
        if (ok || /already enabled/i.test(message)) {
          result.actions.push('enable auto-merge')
          result.autoMergeEnabled = true
        } else {
          result.outcome = 'blocked'
          result.reason = `enable auto-merge: ${message.slice(0, 120)}`
        }
      }
    }

    if (result.outcome === 'ok' && result.actions.length) result.outcome = 'reconciled'
    results.push(result)
  }

  const verdict = decideRunOutcome(results, { dryRun })
  const summary = buildSummary(results, { dryRun, verdict })
  console.log(summary)
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFileSync } = await import('fs')
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`)
  }
  if (verdict.failed) {
    throw new Error(`Data PRs need attention:\n${verdict.reasons.map((r) => `- ${r}`).join('\n')}`)
  }
}

// Only run when executed directly, so the pure helpers can be unit-tested.
// pathToFileURL, not `file://${argv[1]}`: import.meta.url percent-encodes the
// path, so a checkout containing a space made the naive comparison false and
// this script exit 0 having done nothing — matching the repo idiom in
// fleet-audit.mjs and gate3-validate.mjs. Guarded by a spawn test.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err.message)
    process.exitCode = 1
  })
}
