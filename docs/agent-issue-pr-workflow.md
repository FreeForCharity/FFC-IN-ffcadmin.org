# Agent Issue-to-PR Workflow

## Purpose

FreeForCharity agent contributors use an issue -> branch -> pull request workflow so multiple agents and maintainers can work in the same repository without collisions. This convention is especially important as FFC accepts work from heterogeneous agents, including GitHub-native agents, local CLI agents, and other non-GitHub-native automation.

The workflow gives maintainers a clear audit trail: what issue authorized the work, what files were claimed, what changed, what validation was run, and who is responsible for review and merge.

## When to Use

Use this workflow for any agent-created change to `FreeForCharity/FFC-IN-ffcadmin.org`, including documentation-only changes, small fixes, generated assets, tests, scripts, and configuration updates.

Do not bypass this workflow for "quick" changes unless a maintainer explicitly directs a different process in the issue.

## Required Workflow

1. Start from a GitHub issue that describes the requested work.
2. Read the issue, existing comments, linked PRs, and relevant repository files before editing.
3. Comment on the issue with the intended scope and file claims before making changes.
4. Create a branch for that issue.
5. Make the smallest practical change that satisfies the issue.
6. Run appropriate validation and record the evidence.
7. Open a pull request linked to the issue.
8. Leave merge decisions to maintainers.

## File-Claim Rules

- Claim only the files or directories needed for the issue.
- Keep claims narrow and specific, for example `docs/agent-workflow.md` instead of `docs/**` when possible.
- Check the issue and open PRs for existing claims before editing.
- Do not edit files claimed by another active agent unless the issue thread shows coordination.
- If the work expands, update the issue comment with the additional files before editing them.
- Release or narrow claims if the PR is abandoned, superseded, or split.
- File claims are coordination signals, not ownership. Maintainers may override or redirect claims.

## Branch Naming

Use a branch name that includes the issue number and a short slug:

```text
agent/433-issue-pr-workflow
docs/433-agent-runbook
fix/433-short-description
```

Prefer `agent/<issue>-<slug>` for general agent work. Use a more specific prefix such as `docs/`, `fix/`, or `test/` when it makes the change easier to identify.

Keep one issue per branch unless a maintainer asks for a combined PR.

## PR Requirements

Each PR must include:

- A link to the issue, for example `Refs #433` or `Closes #433` when the PR fully resolves it.
- A concise summary of the change.
- The claimed files or directories.
- Validation evidence with commands run and results.
- Any known limitations, skipped validation, or follow-up work.

Keep PRs focused. Do not mix unrelated cleanup, formatting, dependency changes, or repository setting changes into an agent PR.

## Validation Evidence

Validation should match the risk of the change. For documentation-only PRs, acceptable evidence usually includes:

```text
git diff --check
manual markdown review
```

When relevant and available, also run repository-specific checks such as markdown linting, tests, type checks, or builds. If a check cannot be run, state why in the PR instead of omitting it silently.

Do not invent validation results. Paste or summarize the actual commands and outcomes.

## No-Merge Policy

Agents must not merge their own PRs unless a maintainer explicitly authorizes that action for the specific PR.

The default agent responsibility ends after the PR is opened, validation evidence is provided, and review feedback is addressed. Maintainers decide when and whether to merge.

## Issue Template

Agents should use this structure when creating or updating an issue for agent work:

```markdown
## Goal

What should change, and why?

## Scope

Files, directories, or behavior expected to change.

## Out of Scope

Related work that should not be included in this issue.

## File Claims

- `path/to/file`
- `path/to/directory/`

## Validation

Expected checks or evidence for the PR.

## Notes

Relevant context, constraints, links, or maintainer instructions.
```

## PR Checklist

- [ ] PR is linked to the issue.
- [ ] Branch name includes the issue number.
- [ ] File claims are listed in the issue or PR.
- [ ] Change is limited to the stated scope.
- [ ] No secrets, credentials, or private configuration were added.
- [ ] No repository settings or workflow automation were changed unless explicitly requested.
- [ ] Validation evidence is included.
- [ ] Known limitations or skipped checks are documented.
- [ ] PR is left for maintainer review and merge.
