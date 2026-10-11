# AGENTS.md

Guidance for AI coding agents working in this repo. Read this before editing.

## What this project is

A Kiro Crew **app** (`app.json` manifest) that renders long-lived, interactive terminal
sessions (tmux / screen / zellij / herdr / agent-of-empires) in a web view. It has two
independent parts:

- `backend/` — Node.js (Express + `ws` + `node-pty`). Owns PTY mirrors, persists known
  sessions, and re-attaches them on restart.
- `ui/` — React + xterm.js, bundled by Vite into `ui/dist/index.mjs` which:
  - Externalizes `react`, `react-dom`, `react-dom/client`, `react/jsx-runtime` to share the host's React instance.
  - Bundles `xterm` and inlines CSS.
  - Exports a **default React component** (`App`) for `React.lazy()` / `AppHost` compatibility.
  - Exports a **named `mount(el)` function** for `app.json` `ui.pages[].mountFunction` compatibility.
- `app.json` — the Kiro Crew app manifest (backend entry, UI page + mount, permissions,
  setup hooks).

The UI keeps several sessions open but renders exactly one active terminal at a time. The
sidebar owns navigation between open/discovered sessions; do not reintroduce tiled panes
without deliberately revisiting the resize, persistence, and active-session model.

## Critical invariants — do not break

1. **Closing a view never kills the real session; killing is a separate, explicit request.**
   The backend runs *attach* commands (`tmux attach`, `screen -r`, `herdr --session`, ...).
   Closing a pane — or `DELETE /sessions/:ref` without `?kill=1` — only tears down this app's
   mirror PTY, and the host session keeps running. Terminating a host session happens *only*
   through `DELETE /sessions/:ref?kill=1`, *only* for a provider that declares `canKill()`, and
   *only* from an action the user confirmed in the UI. Never kill as a side effect of closing,
   never kill on a timeout or cleanup path, and never kill a session the user did not name.
   (This replaces an earlier blanket ban on `kill-session`; the ban's intent — that nothing
   destructive happens implicitly — is the part that still holds.)
2. **`mount` must stay the exported UI entry.** `app.json` → `ui.pages[].mountFunction` is
   `"mount"`, and the page `entryPoint` is `ui/dist/index.mjs`. If `mount` is renamed or the
   file moved, the app won't render.
3. **Default export must stay for React.lazy.** `AppHost` uses `React.lazy(() => import(...))`
   and expects a default export. The bundle must export `App` as default.
4. **React/ReactDOM must remain external.** The bundle must not bundle React/ReactDOM; they
   are provided by the Kiro Crew host via import map. Duplicate React causes invariant #306.
5. **The signature must stay accurate.** `lib/proxy-verify.mjs` checks the gateway's
   `X-KiroCrew-Proxy` HMAC. The `KIRO_HERRD_ALLOW_UNSIGNED=1` flag bypasses it — **only** for local dev/debug, never in production default.
6. **Persistence path must stay under the app data dir.** `lib/session-manager.mjs` writes
   `known-sessions.json` under `appDataDir('kiro-crew-terminals')` (`.crew-terminals/`). Keep session
   state out of the repo — it's gitignored.
7. **Only registered providers may spawn commands.** `POST /api/sessions` rejects caller-supplied
   `cmd` arrays. Preserve this boundary: the server resolves create/attach commands through a
   provider after validating its native session identity.
8. **Keep the proxy path split straight.** The browser calls
   `/apps/kiro-crew-terminals/api/*`; the gateway forwards `/api/*` to the backend. UI helpers use
   the former and Express routes use the latter.

## Build steps that MUST be repeated after UI changes

`ui/dist/index.mjs` is the committed artifact the manifest points at. **After changing any
UI source, always rebuild:**

```bash
cd ui && npm run build
```

and commit the regenerated `ui/dist/index.mjs`. A stale bundle that doesn't match `ui/src/`
is a bug. CSS is inlined into the bundle (via `?inline` imports); the page loads a single file.

## Verification

Run the full repository check before handing off code changes:

```bash
make test
```

This runs the backend/UI tests with Node's built-in test runner, rebuilds the production UI,
checks the bundle's default and `mount` exports plus React externalization, and syntax-checks
the backend and all provider modules. CI runs the same suite plus coverage on every pull
request and push to `main`. For a UI-only edit, `cd ui && npm run build` is still the
minimum check because it also refreshes the committed bundle.

## Backend environment

- Node ≥ 18, `"type": "module"` (all `.mjs` / ESM).
- `node-pty` is a **native** module. It cannot spawn ConPTY inside a detached/non-console
  sandbox on Windows (`Cannot launch conpty`) — verify plain logic through the
  `SessionManager` methods with a stubbed `buildMirror` / temp `KIRO_HERRD_DATA_DIR` rather
  than relying on a live `pty.spawn` in CI or toolhosts.
- Dependencies: `express`, `ws`, `node-pty` only. Do not add frameworks without a reason.

## Providers

Each provider in `backend/providers/` subclasses [`lib/registry.mjs`](backend/lib/registry.mjs)'s
`Provider` and implements `available()` / `list()` / `create()` / `createCommand()` and exposes an
attach command, plus optional `canKill()` / `kill()` for providers with a stable stop verb.
`createCommand(name)` returns the argv used to create a new session (e.g.
`zellij attach --create-background <name>`, `aoe add --scratch -t <name>`); the
`GET /providers/:id/create-command` endpoint serves it to the UI. `create(name)` actually runs
creation and returns the attach command for the new session — it must **throw** when creation
fails rather than returning an attach command for a session that was never made. `list()`
returns `{ ref, name, provider, cmd }` per session, where `ref` is the provider-native identity
(the name for tmux/zellij, the pid for screen). Capture stderr in `run()` and put it in the
thrown `Error`: swallowing a CLI's message is how a broken flag went unnoticed for months.

All five (tmux, screen, zellij, herdr, aoe) are first-class; keep them interchangeable so the
registry can pick any. New providers (e.g. SSH/remote) are new files here — don't special-case
them in `server.mjs`.

Kill support is currently opt-in for tmux, screen, zellij, and Herdr; aoe deliberately inherits
the non-killable base behavior. A provider kill must target the provider-native identity and
confirm the resulting provider state when the CLI's exit status is unreliable.

## Transport chain

WebSocket is primary, SSE is fallback, REST `POST /input` + `POST /resize` is last resort.
If you touch `server.mjs`, keep all three working — the UI auto-falls back.

All non-health HTTP and WebSocket routes fail closed unless the gateway HMAC verifies.
`express.json()` must retain the original body bytes for this check, and `req.url` must remain
the raw request target; reserializing either changes the signed value. Unsigned mode is only
for standalone development via `KIRO_HERRD_ALLOW_UNSIGNED=1`.

## Repo conventions

- ESM only. Use `node:`-prefixed built-ins.
- UI is React 18 + xterm.js; CSS imported with `?inline` and injected by `mount`.
- Tests use `node:test`; keep pure UI state logic in small DOM-free modules when practical.
- Use dashboard CSS custom properties for surfaces and text so every theme remains readable.
- Keep provider CLI stderr in user-visible errors; silent command failures are not actionable.
- `.gitignore` excludes `node_modules/`, `*.log`, `.env*`, `known-sessions.json`, `.herdr-views/`.

## Plans

All repository plans must live under `plans/<theme>/` and follow the naming,
metadata, section, and lifecycle schema in [`plans/README.md`](plans/README.md).
Before creating or editing any plan, read that schema in full. Do not place a
plan at the repository root or directly under `plans/`, and do not invent an
alternate plan format. Plan filenames must retain their ISO creation-date
prefix.
