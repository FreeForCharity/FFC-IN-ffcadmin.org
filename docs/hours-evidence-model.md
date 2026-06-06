# CE hours evidence model (#360)

The shared "system of record" schema for volunteer + training hours that FFC
certifies toward continuing-education credit (#356), the FFC documentation
artifact (#358), the MOVSM funnel (#335), and recognition badges (#359/#336).

This is the **model** — the TypeScript source of truth is
[`src/data/hours-model.ts`](../src/data/hours-model.ts). **Where/how** entries are
stored and automated is the separate backend epic (#361/#362); whichever backend
is chosen must emit records matching `HoursEntry` (ideally as committed JSON, per
the #337 scheduled-Actions pattern) so everything downstream consumes one shape.

## Principles

- **Hybrid evidence.** GitHub activity is auto-evidenced; non-code work is
  self-logged.
- **No self-claim for credit.** Every entry is certified by a mentor / program
  lead before it counts. The certifying authority is the named `approver`.
- **One engine, three consumers.** The same approved hours feed CE conversion,
  MOVSM documentation, and recognition badges — reusing the validation approach
  already used by #335 and #336.

## `HoursEntry` schema

| Field                        | Meaning                                                     |
| ---------------------------- | ----------------------------------------------------------- |
| `id`                         | Stable unique id.                                           |
| `volunteer` / `githubHandle` | Who.                                                        |
| `date` / `endDate`           | When (single day or range).                                 |
| `activityType`               | One of the GitHub-auto or self-log activity types below.    |
| `activity`                   | Human description.                                          |
| `channel`                    | CE credit channel: `education` / `teaching` / `work`.       |
| `rawHours`                   | Hours logged, **before** per-body caps.                     |
| `source`                     | `github` or `self-log`.                                     |
| `evidenceUrl`                | PR/commit/issue URL, or a doc/notes reference.              |
| `moduleId`                   | For `training-received`: the #320 module completed.         |
| `domainRelevant`             | Whether it passes a body's profession-relevance test.       |
| `firstDelivery`              | Teaching de-dup: `true` only for first delivery of content. |
| `dedupKey`                   | Stable key so the same activity is never counted twice.     |
| `approver` / `status`        | Certifier + `pending` / `approved` / `rejected`.            |

## What auto-counts vs needs a self-log

- **GitHub auto-evidence** (`source: github`): `pull_request`, `commit`,
  `issue`, `review`. These can be derived automatically from repo activity (cf.
  recognition's commit-history validation #336 and the #337 pipeline).
- **Self-logged** (`source: self-log`): `design`, `admin`, `meeting`,
  `mentoring`, `training-received`, `training-delivered`, `other` — things GitHub
  can't see. The volunteer logs date, activity, channel, and hours.

`requiresSelfLog(activityType)` encodes this split.

## Approval workflow

1. **Intake** — GitHub activity is ingested automatically; non-code work is
   self-logged.
2. **Certify** — an entry routes to a mentor / program lead who sets
   `status: approved` and records themselves as `approver`. Nothing counts while
   `pending`.
3. **De-dup** — `approvedEntries()` drops duplicates by `dedupKey`.
4. **Total** — `hoursByChannel()` sums approved raw hours per channel.

## Mapping to credit

`creditability(entry, body)` applies the compliance-matrix (#356) channel
support + relevance rules to decide whether an approved entry is _eligible_ for a
given body (e.g. CompTIA credits no `work`; ISC2 needs domain-relevant work;
teaching is first-delivery only). Precise **numeric caps** stay as prose in
`ce-bodies.ts` — they vary by cert and change over time — and are applied by the
documentation step (#358), not machine-parsed, so figures never silently drift.

## Channel sources of hours

- `training-received` → hours from the completed #320 module's published
  CE-eligible hours (`moduleId`).
- `training-delivered` / `work` → hours from approved self-log or GitHub
  evidence, carrying `firstDelivery` / `domainRelevant` flags through to
  conversion.
