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
  const needsUpdate = !pr.draft && behindBy > 0
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
  const stuck = results.filter(
    (r) => !blocked.includes(r) && r.old && !r.progressing && r.outcome !== 'skipped'
  )
  const reasons = []
  for (const r of blocked) reasons.push(`#${r.number} (${r.headRef}): ${r.reason}`)
  for (const r of stuck) {
    const hours = Math.round(r.ageMs / 3600000)
    reasons.push(
      r.behindBy > 0 || !r.autoMergeEnabled || r.unapprovedRuns > 0
        ? `#${r.number} (${r.headRef}): still un-reconciled after ${hours}h ` +
            `(behind=${r.behindBy}, autoMerge=${r.autoMergeEnabled}, ` +
            `unapprovedRuns=${r.unapprovedRuns || 0})`
        : `#${r.number} (${r.headRef}): open ${hours}h, now current and armed but not merged — ` +
            `check the required checks and review gate on it`
    )
  }
  return { failed: !dryRun && reasons.length > 0, reasons }
}

/** Job-summary markdown. Pure. */
export function buildSummary(results, { dryRun = false, verdict } = {}) {
  const lines = [`## Data-PR reconciler${dryRun ? ' (dry-run)' : ''}`, '']
  if (!results.length) {
    lines.push('No open `data/*` PRs. Nothing to reconcile.')
    return lines.join('\n')
  }
  lines.push('| PR | Branch | Behind | Auto-merge | Action | Outcome |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  for (const r of results) {
    lines.push(
      `| #${r.number} | \`${r.headRef}\` | ${r.behindBy} | ${r.autoMergeEnabled ? 'yes' : 'no'} | ` +
        `${r.actions.length ? r.actions.join(', ') : '—'} | ${r.outcome}${r.reason ? ` (${r.reason})` : ''} |`
    )
  }
  if (verdict?.reasons?.length) {
    lines.push('', '### Needs attention', '')
    for (const reason of verdict.reasons) lines.push(`- ${reason}`)
    if (dryRun) lines.push('', '_Dry-run: verdict reported, not enforced._')
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
  const res = await fetch(`${API}${path}`, { ...init, headers: headers() })
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

    // Both lookups are spent only on non-drafts, and only once per PR per cycle.
    const unapproved = await unapprovedRunsFor(pr.head.sha)
    const plan = planFor(
      { ...base, behindBy: await behindBy(pr), unapprovedRuns: unapproved.length },
      { nowMs, stuckAfterMs }
    )
    const result = { ...plan, actions: [], outcome: 'ok', reason: '', progressing: false }

    // Before update-branch: an update pushes a new head, which abandons these
    // runs and creates fresh ones. Clearing them first means the approval is
    // spent on a head that is about to be replaced, so do the opposite --
    // record the need, and act on it after any branch update below.
    const clearApprovals = async () => {
      if (!plan.needsApproval || result.outcome === 'blocked') return
      if (dryRun) {
        result.actions.push(`would re-run ${unapproved.length} unapproved check run(s)`)
        return
      }
      // Re-read: an update-branch above moved the head, so the runs gathered
      // for the old head are gone and the new head has its own.
      const live = result.actions.some((a) => a === 'update-branch')
        ? await unapprovedRunsFor(pr.head.sha).catch(() => null)
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
        result.actions.push(`re-ran ${live.length} unapproved check run(s)`)
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
