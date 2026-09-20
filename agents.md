# Agents.md

Guidance for AI coding agents working in this repo. Read this before editing.

## What this project is

A Kiro Crew **app** (`app.json` manifest) that renders long-lived, interactive terminal
sessions (tmux / screen / zellij / herdr / agent-of-empires) in a web view. It has two
independent parts:

- `backend/` — Node.js (Express + `ws` + `node-pty`). Owns PTY mirrors, persists known
  sessions, and re-attaches them on restart.
- `ui/` — React + xterm.js, bundled by Vite into a self-contained `ui/dist/index.mjs`.
- `app.json` — the Kiro Crew app manifest (backend entry, UI page + mount, permissions,
  setup hooks).

## Critical invariants — do not break

1. **The mirror never kills the real session.** The backend runs *attach* commands
   (`tmux attach`, `screen -r`, `herdr attach`, ...). It must **never** run `tmux kill-session`
   or terminate the underlying host process. "Close" only detaches viewers.
2. **`mount` must stay the exported UI entry.** `app.json` → `ui.pages[].mountFunction` is
   `"mount"`, and the page `entryPoint` is `ui/dist/index.mjs`. If `mount` is renamed or the
   file moved, the app won't render.
3. **The signature must stay accurate.** `lib/proxy-verify.mjs` checks the gateway's
   `X-Crew-Proxy` HMAC. Run gauge of "signed vs unsigned": `KIRO_HERRD_ALLOW_UNSIGNED=1`
   bypasses it — **only** for local dev/debug, never in production default.
4. **Persistence path must stay under the app data dir.** `lib/session-manager.mjs` writes
   `known-sessions.json` under `appDataDir('kiro-herdr-views')` (`.herdr-views/`). Keep session
   state out of the repo — it's gitignored.

## Build steps that MUST be repeated after UI changes

`ui/dist/index.mjs` is the committed artifact the manifest points at. **After changing any
UI source, always rebuild:**

```bash
cd ui && npm run build
```

and commit the regenerated `ui/dist/index.mjs`. A stale bundle that doesn't match `ui/src/`
is a bug. CSS is inlined into the bundle (via `?inline` imports); the page loads a single file.

## Backend environment

- Node ≥ 18, `"type": "module"` (all `.mjs` / ESM).
- `node-pty` is a **native** module. It cannot spawn ConPTY inside a detached/non-console
  sandbox on Windows (`Cannot launch conpty`) — verify plain logic through the
  `SessionManager` methods with a stubbed `buildMirror` / temp `KIRO_HERRD_DATA_DIR` rather
  than relying on a live `pty.spawn` in CI or toolhosts.
- Dependencies: `express`, `ws`, `node-pty` only. Do not add frameworks without a reason.

## Providers

Each provider in `backend/providers/` subclasses [`lib/registry.mjs`](backend/lib/registry.mjs)'s
`Provider` and implements `available()` / `list()` / `create()` and exposes an attach command.
All five (tmux, screen, zellij, herdr, aoe) are first-class; keep them interchangeable so the
registry can pick any. New providers (e.g. SSH/remote) are new files here — don't special-case
them in `server.mjs`.

## Transport chain

WebSocket is primary, SSE is fallback, REST `POST /input` + `POST /resize` is last resort.
If you touch `server.mjs`, keep all three working — the UI auto-falls back.

## Repo conventions

- ESM only. Use `node:`-prefixed built-ins.
- UI is React 18 + xterm.js; CSS imported with `?inline` and injected by `mount`.
- `.gitignore` excludes `node_modules/`, `*.log`, `.env*`, `known-sessions.json`, `.herdr-views/`.
