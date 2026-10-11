# Kiro Crew Terminals

A **Kiro Crew** app that puts long-lived, interactive terminal sessions into your
dashboard — a *Herdr* or *agent-of-empires*-style view, rendered right in a web page.

Attach to real sessions running on your host — **tmux**, **GNU screen**, **zellij**,
**herdr**, and **agent-of-empires (aoe)** are all first-class. Keep several sessions open
at once and switch between full-size terminal views from the sidebar.

## Current state

- Five provider integrations: tmux, screen, zellij, Herdr, and agent-of-empires.
- Provider discovery plus create/attach flows with collision-free generated names.
- One active terminal fills the content area; open and discovered sessions live in the
  collapsible sidebar, with the active view restored after reload.
- Closing detaches only the app's PTY mirror. Killing a host session is a separate,
  confirmed action and is available only when the provider implements it.
- PTY mirrors survive browser navigation, are restored from the known-session registry
  after backend restarts, and replay an in-memory 2,000-chunk buffer to new viewers.
- WebSocket transport with SSE fallback, responsive PTY resizing, theme-token styling,
  provider icons, and deduplicated persistent error toasts.
- `make test` is green: 221 unit tests across the backend and UI, a production UI build
  with bundle-contract checks, and syntax checks for the backend and every provider; CI
  runs the same suite plus coverage on pushes and pull requests.

---

## Why sessions stay alive

Your sessions have two independent lives, and the view survives both kinds of "leaving":

1. **The real session** — a tmux / screen / zellij / herdr / aoe process on the host.
   It is a host process, so it survives tab reloads, page navigation, and app restarts.
2. **The view of it** — a backend PTY mirror that runs the *attach* command
   (`tmux attach`, `screen -r`, `zellij attach`, `herdr --session`, `aoe session attach`), plus one
   or more web panes subscribed to it.

The backend owns the mirrors, so **navigating away from the view, closing a tab, or even
closing every browser window never kills your session**. When you come back, the sessions
are still there.

That persistence is layered:

- **Known-session registry** — every created session is written to
  `known-sessions.json` in the app data dir (`.crew-terminals/`).
- **Auto-restore on restart** — on backend startup, stored sessions are re-attached
  automatically (re-resolving a fresh attach command, because provider state can change and
  screen PIDs are not stable across restarts). Mirrors that can no longer attach are dropped instead of
  failing forever.
- **Views in the browser** — open sessions and the active session are remembered in
  `localStorage` and restored on reload; sessions that are no longer known are pruned.

---

## Architecture

```
[yourtmux/screen/zellij/herdr/aoe agent]
        ▲  (real host session, independent of the app)
        │
[node-pty mirror]  ← runs `attach` , stays alive on the backend
        │
   WebSocket ─────────────┐
   SSE (fallback) ────────┼──>  xterm.js panes in the Crew dashboard
   POST /input+/resize ──┘
```

- **Backend** (`backend/`) — Node.js (Express + `ws` + `node-pty`).
  - `lib/session-manager.mjs` — owns the PTY mirrors, persists known sessions, auto-restores on start.
  - `lib/registry.mjs` — provider abstraction so every session manager is interchangeable.
  - `providers/` — `tmux`, `screen`, `zellij`, `herdr`, `aoe`.
  - `lib/proxy-verify.mjs` — verifies the gateway's HMAC-signed `X-KiroCrew-Proxy` header.
- **UI** (`ui/`) — React + [xterm.js](https://xtermjs.org/). Built by Vite into
  `ui/dist/index.mjs` which:
  - **Externalizes** `react`, `react-dom`, `react-dom/client`, `react/jsx-runtime` to share the host's React instance (avoids duplicate React and invariant #306).
  - **Bundles** `xterm` and `xterm-addon-fit` + inlines CSS via `?inline` imports.
  - Exports a **default React component** (`App`) for `React.lazy()` compatibility with `AppHost`.
  - Exports a **named `mount(el)` function** for `app.json` `mountFunction` compatibility.

Transport is **WebSocket-first** with an **SSE fallback** and plain **REST fallback**, so the
viewer works even when the gateway can't upgrade a connection to WebSocket.

---

## Build, install & lifecycle

The manifest in [`app.json`](app.json) declares the app's identity, UI bundle, backend,
permissions and lifecycle hooks. Everything below is driven by that one file.

### Build

```bash
# UI (requires Node ≥ 18)
cd ui
npm install
npm run build               # -> ui/dist/index.mjs (default export + named `mount`)

# Backend deps (node-pty is a native module)
cd ../backend
npm install --omit=dev
```

Or use the bundled `Makefile`, which wraps the whole build/test/install cycle:

| Target | What it does |
|--------|--------------|
| `make build`    | UI build + backend deps (same as above) |
| `make test`     | 221 Node unit tests + production UI build/bundle checks + `node --check` on every backend/provider file |
| `make test-coverage` | the same suite with per-file coverage (also `npm run test:coverage`) |
| `make install`  | build, then install into the Crew app dir. Uninstalls a prior copy first (the gateway rejects re-installing an already-installed app), stages the tree, and provisions `backend/` + `ui/` deps (the gateway often skips the `onInstall` npm hooks) |
| `make uninstall`| remove the app (best-effort) |
| `make dev`      | run the backend standalone on `:8787` with HMAC verification off |
| `make health`   | `curl http://127.0.0.1:8787/health` |

`make install` uses `scripts/kirocrew.sh` to find the `kirocrew` CLI from `KIROCREW`,
`PATH`, or a running Kiro Crew mount. As a last resort it temporarily mounts the AppImage
at `~/apps/KiroCrew-x86_64.AppImage` and invokes the CLI bundled inside it. After staging it runs
`npm install --omit=dev` in the installed `backend/` and `npm install && npm run build`
in the installed `ui/`, so the app dir is fully provisioned even when the gateway skips
the lifecycle hooks. Override the AppImage path with `KIRO_APP=...` and the app name/data
dir with `APP_NAME=...` / `APP_DIR=...`. Because install/uninstall leave the app
**disabled**, the final step is always: enable it from the dashboard
(**App Store → Library → Crew Terminals**) — the CLI and AppImage cannot enable from outside
the dashboard.

### Install & enable

```bash
make install
```

Then enable **Crew Terminals** from **App Store → Library**. You can also install from the
dashboard via **App Store → Sources → Install from local path**.
Installing and enabling runs the manifest's lifecycle hooks, which build the app:

```bash
# what onInstall / onUpdate run:
cd ui && npm install && npm run build && cd ../backend && npm install --omit=dev
```

Once enabled, **Crew Terminals** appears in the dashboard sidebar (`section: Apps`) at
`/apps/kiro-crew-terminals`. The gateway launches `backend/server.mjs` as a subprocess and
reverse-proxies browser requests from `/apps/kiro-crew-terminals/api/*` to backend `/api/*`.

### Disable / uninstall

```bash
kirocrew app disable kiro-crew-terminals     # stops pages, backend, agents/skills/crons; keeps data
kirocrew app uninstall kiro-crew-terminals   # removes the app; keeps per-app data by default
kirocrew app uninstall kiro-crew-terminals --purge-data   # deletes data too (not reversible)
```

### Iterating (dev mode)

```bash
kirocrew app dev kiro-crew-terminals
```

Dev mode watches `ui/` (no-store UI serving) and broadcasts an `app_reload` event on any
change, so the dashboard hot-reloads the page after each `npm run build`. Backend and
agent/skill changes take effect on the next app invocation — no rebuild needed. To skip the
build step entirely, symlink the source tree so file deltas appear directly:

```bash
ln -sfn /path/to/kiro-crew-terminals/ui ~/.kiro/crew/apps/kiro-crew-terminals/ui
```

### Run the backend standalone (dev / debugging)

Useful when you want to hit the HTTP API directly without the gateway:

```bash
# from backend/:
#     KIRO_HERRD_ALLOW_UNSIGNED=1 allows requests without the gateway HMAC header
#     KIRO_HERRD_PORT (default 8787) overrides the listen port
node server.mjs
```

(`server.mjs` boots automatically when run directly — ESM main-module detection
in the tail of the file. The `KIRO_HERRD_MAIN=1` env var is honored for backward
compat but no longer required.)

> On Windows, `node-pty` needs ConPTY, which is only available in an interactive console.
> It won't spawn inside a detached toolhost sandbox (`Cannot launch conpty`). On the actual
> server host (Linux/macOS, or a normal Windows console) `node-pty` uses `forkpty` and works
> as expected.

### Per-app data & the proxy secret

When installed as a Crew app, the backend stores its state under the app data dir:

- `~/.kiro/crew/apps/kiro-crew-terminals/.crew-terminals/` — `known-sessions.json` and any
  per-provider state. Overridable for standalone runs with `KIRO_HERRD_DATA_DIR`.
- `~/.kiro/crew/apps/kiro-crew-terminals/.app_secret` — the HMAC secret the gateway uses to
  sign `X-KiroCrew-Proxy` headers (injected as `KIROCREW_PROXY_SECRET`; the legacy
  `KIRO_HERRD_APP_SECRET` fallback is also accepted). The backend
  verifies it via [`backend/lib/proxy-verify.mjs`](backend/lib/proxy-verify.mjs); set
  `KIRO_HERRD_ALLOW_UNSIGNED=1` only for local development.

---

## Providers

| Provider | Discovered sessions | Attach | Create | Kill |
|----------|--------------------|--------|--------|------|
| `tmux`   | `tmux list-sessions -F '#{session_name}'` | `tmux attach -t <name>` | `tmux new-session -d -s <name>` | `tmux kill-session -t '=<name>'` |
| `screen` | `screen -ls` | `screen -r <pid>` | `screen -d -m -S name /bin/bash -l` | `screen -S <pid> -X quit` |
| `zellij` | `zellij list-sessions --short` | `zellij attach <name>` | `zellij attach --create-background <name>` | `zellij delete-session --force <name>` |
| `herdr`  | `herdr session list --json` | `herdr --session <name>` | `herdr --session <name>` | `herdr session stop <name>` |
| `aoe`    | `aoe list --json` | `aoe session attach <name>` | `aoe add --scratch -t <name>` + `aoe session start <name>` | — (not supported) |

Identity: a session is keyed by `provider:native-key`, where the native key is the session
name for tmux/zellij and the **pid** for screen — screen allows two sessions to share a name,
so the name alone cannot identify one. Kill is opt-in per provider (`canKill()`); the UI only
offers it where it can work, and tmux/zellij use exact-match targets so killing `work` cannot
hit `workshop`. Note that `zellij delete-session` exits non-zero when it force-kills a session
that has a client attached (ours is), so the providers confirm against `list()` rather than
trusting the exit code.

Each provider is implemented against a common interface in [`backend/lib/registry.mjs`](backend/lib/registry.mjs)
(`available` / `list` / `create` / `createCommand`, plus optional `canKill` / `kill`), so adding
a new session manager (e.g. an SSH/remote tunnelled provider) is just a new file in
[`backend/providers/`](backend/providers).

---

## API

The browser calls `/apps/kiro-crew-terminals/api/*`; the gateway forwards that to the
backend's `/api/*` routes listed below.

All routes except `/health` verify the gateway `X-KiroCrew-Proxy` HMAC (unless
`KIRO_HERRD_ALLOW_UNSIGNED=1`).

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/providers` | List provider groups (`id`/`label`/`available`/`killable`), open mirror sessions, and `known` (persisted) sessions |
| GET | `/sessions` | List open mirror sessions |
| GET | `/known` | List persisted (known) sessions across restarts |
| GET | `/providers/:id/create-command?name=` | Provider-specific creation command, plus the session name to use. `name` is optional: without it the server generates the lowest free `<provider>-<nn>` from the provider's live session list, and reports `taken`/`suggested` when the requested name is in use |
| POST | `/sessions` | Attach a session. `provider`+`ref` attaches an existing discovered session by its provider-native ref; `provider` without `ref` creates a provider session, generating a free name when none is given (409 with `suggested` if the requested name exists). Custom command arrays are rejected |
| DELETE | `/sessions/:ref` | Drop this app's mirror for a session (detach — the host session keeps running). `?kill=1` additionally terminates the underlying session for providers where `killable` is true, and reports `{ killed, reason }` |
| POST | `/input` | Write input to a session (`{ ref, data }`) |
| POST | `/resize` | Resize a session PTY (`{ ref, cols, rows }`) |
| GET | `/sse?ref=` | SSE output stream (fallback transport) |
| WS | `/ws?ref=` | WebSocket bidirectional stream (primary transport) |

### Creating sessions

Selecting a provider asks `GET /providers/:id/create-command` for a collision-free generated
name and shows it as the input placeholder. The name field stays empty unless the user types
one, so the default is per-provider instead of sticking across provider changes. Creation is
restricted to registered providers; arbitrary command attachment is intentionally unsupported.

### Closing vs killing

Closing a view (`✕`, or `DELETE /sessions/:ref`) only detaches this app's mirror: the host
session keeps running. Killing is a separate, explicitly confirmed action that asks the
provider to terminate the host session. tmux, screen, zellij, and Herdr implement this;
agent-of-empires reports `canKill: false`, so the UI does not offer it there.

---

## Roadmap

- [ ] Persist scrollback to disk so output history also survives a backend restart
- [ ] SSH / remote-host provider for sessions on other servers
- [x] Session creation UI for multiplexers that support it (provider create commands, auto-populated on select)

---

## License

[Apache-2.0](LICENSE)
