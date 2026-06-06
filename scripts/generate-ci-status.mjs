#!/usr/bin/env node
/**
 * Generate public/data/ci-status.json (#337).
 *
 * Fetches the latest GitHub Actions run on `main` for each tracked workflow and
 * writes a small committed JSON file the static /testing dashboard reads.
 *
 * Auth: the workflow's built-in GITHUB_TOKEN (no extra secret). Runs in CI; if
 * the token or network is unavailable it leaves the existing file untouched and
 * exits 0 so the pipeline degrades gracefully.
 */
import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'data', 'ci-status.json')

// Workflows surfaced on the dashboard, by their `name:` in the workflow file.
const TRACKED = ['Build, Test, and Verify']

const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

async function ghJson(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`)
  return res.json()
}

async function main() {
  if (!token) {
    console.warn('No GITHUB_TOKEN; leaving ci-status.json unchanged.')
    return
  }

  const workflows = []
  for (const name of TRACKED) {
    try {
      const data = await ghJson(`/repos/${repo}/actions/runs?branch=main&per_page=20`)
      const run = (data.workflow_runs || []).find((r) => r.name === name)
      if (run) {
        workflows.push({
          name,
          status: run.status,
          conclusion: run.conclusion,
          headBranch: run.head_branch,
          runUrl: run.html_url,
          updatedAt: run.updated_at,
        })
      } else {
        workflows.push({ name, status: 'unknown', conclusion: null, headBranch: 'main' })
      }
    } catch (err) {
      console.warn(`Lookup failed for "${name}": ${err.message}`)
      workflows.push({ name, status: 'unknown', conclusion: null, headBranch: 'main' })
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    seed: false,
    repo,
    workflows,
  }

  const next = JSON.stringify(out, null, 2) + '\n'
  let prev = ''
  try {
    prev = readFileSync(OUT, 'utf8')
  } catch {
    // first run
  }
  // Avoid churn: only the generatedAt differs? Still write — the workflow's
  // create-pull-request step no-ops when the tree is unchanged.
  writeFileSync(OUT, next)
  console.log(`Wrote ${OUT} (${workflows.length} workflow(s))`)
  if (prev === next) console.log('No content change.')
}

main().catch((err) => {
  console.error(err)
  // Degrade gracefully: do not fail the pipeline on data-fetch errors.
  process.exit(0)
})
