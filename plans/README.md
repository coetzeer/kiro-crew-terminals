# Plans

This directory is the single home for repository plans. Plans are organized by
theme so related work stays discoverable and plan filenames remain useful in
history and review.

## Plan index

| Theme | Plan | Created | Status |
| --- | --- | --- | --- |
| Testing | [Unit test coverage improvements](testing/2026-10-11-unit-test-coverage.md) | 2026-10-11 | Proposed |

## Location and naming

Every plan must use this path shape:

```text
plans/<theme>/<YYYY-MM-DD>-<slug>.md
```

Rules:

- `<theme>` is a stable, lowercase kebab-case subject such as `testing`,
  `backend`, `frontend`, `security`, `release`, or `infrastructure`.
- Group by subject, not by author, assignee, status, sprint, or date.
- The filename date is the date the plan was first created and must use ISO
  `YYYY-MM-DD` format. Do not change it when updating the plan.
- `<slug>` is a concise lowercase kebab-case description.
- Do not put plan documents directly in `plans/` other than this schema and
  index file.
- Do not create plan documents elsewhere in the repository.

Examples:

```text
plans/testing/2026-10-11-unit-test-coverage.md
plans/security/2026-10-15-proxy-secret-rotation.md
plans/frontend/2026-11-02-terminal-accessibility.md
```

## Required schema

Every themed plan must begin with this YAML frontmatter:

```yaml
---
title: Human-readable title
date: YYYY-MM-DD
theme: theme-directory-name
status: proposed
owner: unassigned
summary: One-sentence description of the intended outcome.
---
```

Field rules:

| Field | Requirement |
| --- | --- |
| `title` | Required; concise, human-readable plan name. |
| `date` | Required; must match the filename's date prefix. |
| `theme` | Required; must exactly match the parent directory. |
| `status` | Required; one of `proposed`, `active`, `blocked`, `completed`, or `superseded`. |
| `owner` | Required; use a person/team identifier or `unassigned`. |
| `summary` | Required; one sentence describing the intended outcome. |

After the frontmatter, every plan must contain these headings in this order:

1. `# <title>`
2. `## Objective`
3. `## Context`
4. `## Scope`, including `### In scope` and `### Out of scope`
5. `## Plan`
6. `## Implementation order`
7. `## Validation`
8. `## Risks and mitigations`
9. `## Completion criteria`

The `Plan` section should use checkboxes for actionable work. Completion
criteria describe observable outcomes rather than implementation activity.

## Lifecycle

- New plans start as `proposed` unless work has already begun.
- Set the status to `active` when implementation begins.
- A `blocked` plan must state the blocker in `Context` or the relevant plan
  item.
- Set the status to `completed` only after validation and completion criteria
  pass.
- When replacing a plan, mark the old plan `superseded` and link to its
  replacement. Do not delete historical plans merely because they are done.
- Update existing plans in place; do not create a new dated copy for routine
  progress updates.

## Agent requirements

Before creating or editing a plan, agents must read this file and validate the
location, filename, frontmatter, heading order, and status values. If a user
requests a format that conflicts with this schema, follow the user's explicit
request and note the exception in the plan.
