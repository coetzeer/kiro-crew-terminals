---
title: Rename plugin `kiro-herdr-views` to `kiro-crew-terminals`
date: 2026-09-23
theme: infrastructure
status: completed
owner: unassigned
summary: Rename the app identifier and consistent internal branding from `kiro-herdr-views` to `kiro-crew-terminals` across the manifest, backend, UI, and docs.
---

# Rename plugin `kiro-herdr-views` to `kiro-crew-terminals`

## Objective

Rename the app identifier and all consistent internal branding of the plugin
from `kiro-herdr-views` to `kiro-crew-terminals`. The Kiro Crew host keys an
installed app by the manifest `name` and stores its data under
`~/.kiro/crew/apps/<name>/`, so the renamed manifest is treated as a new app.

## Context

The plugin was originally shipped as `kiro-herdr-views` with display strings
`Herdr Views` and a data directory `.herdr-views`. The name no longer matches
the product identity (`Crew Terminals`) and the npm package names still carried
the old identifier. The rename touches the manifest, backend, UI bundle, and
documentation in lockstep. `ui/dist/index.mjs` is a committed build artifact, so
the bundle must be regenerated after any source edits.

## Scope

### In scope

- `app.json`: `name`, `routes`, `permissions.api`, `ui.pages[].route` ->
  `kiro-crew-terminals`; `displayName` + page `label` -> `Crew Terminals`.
- npm package names: `kiro-herdr-views-backend` -> `kiro-crew-terminals-backend`,
  `kiro-herdr-views-ui` -> `kiro-crew-terminals-ui` (both `package.json` and
  `package-lock.json`).
- Log prefix `[herdr-views]` -> `[crew-terminals]`.
- `APP`, postMessage `source`, localStorage key `kiro-herdr-views:panes` ->
  `kiro-crew-terminals:panes`.
- Data dir `.herdr-views` -> `.crew-terminals` (in `paths.mjs appDataDir`,
  `session-manager.mjs`, `.gitignore`, README, agents.md).
- Rebuild `ui/dist/index.mjs` after source edits.

### Out of scope

- Operational, live host work: renaming the installed app directory
  `~/.kiro/crew/apps/kiro-herdr-views` and its `.app_secret` path, or
  reinstalling via the gateway. The host treats the renamed app as new; the
  operator migrates the directory + secret manually if existing state must be
  preserved.

## Plan

- [x] `app.json`: set `name`, `routes`, `permissions.api`, `ui.pages[].route`
      to `kiro-crew-terminals`; set `displayName` and page `label` to
      `Crew Terminals`.
- [x] `backend/package.json` + `backend/package-lock.json`: rename package to
      `kiro-crew-terminals-backend`; update description.
- [x] `backend/server.mjs`: set `APP_NAME = 'kiro-crew-terminals'`; update log
      prefixes `[herdr-views]` -> `[crew-terminals]`.
- [x] `backend/lib/session-manager.mjs`: use `appDataDir('kiro-crew-terminals')`.
- [x] `backend/lib/paths.mjs`: rename `.herdr-views` -> `.crew-terminals`.
- [x] `ui/package.json` + `ui/package-lock.json`: rename package to
      `kiro-crew-terminals-ui`.
- [x] `ui/src/index.jsx`: update `APP`, `PANE_KEY`, postMessage `source`, and
      console prefix to `kiro-crew-terminals`; brand `Herdr Views` ->
      `Crew Terminals`.
- [x] `.gitignore`: rename `.herdr-views/` -> `.crew-terminals/`.
- [x] `README.md`: update title to `Kiro Crew Terminals` and path/data-dir/brand
      references.
- [x] `agents.md`: update `appDataDir('kiro-crew-terminals')`, `.crew-terminals/`,
      and the provider invariant.
- [x] Rebuild `ui/dist/index.mjs` (`cd ui && npm run build`) and commit the
      regenerated artifact.
- [x] (Optional) `cd backend && npm install --omit=dev` to refresh the lockfile.
      (Done as a direct edit of the lockfile `name` fields instead — no
      `npm install` needed, which would have compiled node-pty pointlessly.)
- [x] Also renamed (required by the completion criteria, not listed above):
      `backend/lib/config.mjs` `appDataDir` argument, the root `package.json` /
      `package-lock.json` name, `Makefile` `APP_NAME` + header comment,
      `.github/workflows/ci.yml` header comment, and the old-name literals in
      `backend/test/{paths,proxy-verify,server-routes}.test.mjs` and
      `ui/test/{api,actions,pane-state,toast-bus}.test.mjs`.

## Implementation order

1. Rename the manifest identifiers and display strings in `app.json`.
2. Rename the npm package names in `backend/` and `ui/` package manifests and
   lockfiles.
3. Update the backend source (`server.mjs`, `session-manager.mjs`, `paths.mjs`)
   and log prefixes.
4. Update the UI source (`index.jsx`) and branding.
5. Update docs (`.gitignore`, `README.md`, `agents.md`).
6. Rebuild the UI bundle and commit the artifact.
7. Verify with grep and `node --check`.

## Validation

- Grep the repo for `kiro-herdr-views`, `herdr-views`, `Herdr Views`,
  `.herdr-views` (remaining hits only in unrelated KiroCrew host docs, if any).
- `node --check backend/server.mjs backend/lib/*.mjs backend/providers/*.mjs`.
- `cd ui && npm run build` succeeds and `ui/dist/index.mjs` exports default +
  mount with the new strings present.
- (Live, optional) `KIRO_HERRD_ALLOW_UNSIGNED=1 PORT=8787 node backend/server.mjs`
  then `curl http://127.0.0.1:8787/api/apps/kiro-crew-terminals/providers`.

## Risks and mitigations

- Existing open panes and `known-sessions.json` persist under the OLD data dir;
  renaming loses them unless migrated. If preserving, copy `.herdr-views/` ->
  `.crew-terminals/` before running.
- A stale installed app under the old directory causes 502 on
  `/apps/kiro-crew-terminals/api` until the gateway reinstalls the renamed app.

## Completion criteria

- No tracked source file references the old `kiro-herdr-views` identifier,
  `herdr-views` slug, `Herdr Views` display string, or `.herdr-views` data dir.
- `app.json` exposes the app at `kiro-crew-terminals` with display name
  `Crew Terminals`.
- `node --check` passes on all backend modules and the rebuilt UI bundle
  exports both `default` and `mount`.