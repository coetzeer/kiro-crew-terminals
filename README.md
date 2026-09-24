# Kiro Herdr Views

A **Kiro Crew** app that puts long-lived, interactive terminal sessions into your
dashboard — a *Herdr* or *agent-of-empires*-style view, rendered right in a web page.

Attach to real sessions running on your host — **tmux**, **GNU screen**, **zellij**,
**herdr**, and **agent-of-empires (aoe)** are all first-class. You can have sessions from
several of them open at once, side by side, and chop and change freely.

![?](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20web%20dashboard%20showing%20a%20grid%20of%20multiple%20interactive%20terminal%20windows%20for%20tmux%20herdr%20screen%20zellij%20and%20agent-of-empires%20sessions%2C%20left%20sidebar%20listing%20session%20managers%2C%20sleek%20modern%20UI&image_size=landscape_4_3)

---

## Why sessions stay alive

Your sessions have two independent lives, and the view survives both kinds of "leaving":

1. **The real session** — a tmux / screen / zellij / herdr / aoe process on the host.
   It is a host process, so it survives tab reloads, page navigation, and app restarts.
2. **The view of it** — a backend PTY mirror that runs the *attach* command
   (`tmux attach`, `screen -r`, `zellij attach`, `herdr attach`, `aoe attach`), plus one
   or more web panes subscribed to it.

The backend owns the mirrors, so **navigating away from the view, closing a tab, or even
closing every browser window never kills your session**. When you come back, the sessions
are still there.

That persistence is layered:

- **Known-session registry** — every created session is written to
  `known-sessions.json` in the app data dir (`.herdr-views/`).
- **Auto-restore on restart** — on backend startup, stored sessions are re-attached
  automatically (re-resolving a fresh attach command, because tmux ids and herdr refs can
  change between restarts). Mirrors that can no longer attach are dropped instead of
  failing forever.
- **Panes in the browser** — open panes are remembered in `localStorage` and restored on
  reload; gone sessions drop out of the grid.

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
  - `lib/proxy-verify.mjs` — verifies the gateway's HMAC-signed `X-Crew-Proxy` header.
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
| `make test`     | `node --check` on every backend file + UI bundle checks (default export, `mount` export, `react` external, no `process.env`) |
| `make install`  | build, then install into the Crew app dir. Uninstalls a prior copy first (the gateway rejects re-installing an already-installed app), stages the tree, and provisions `backend/` + `ui/` deps (the gateway often skips the `onInstall` npm hooks) |
| `make uninstall`| remove the app (best-effort) |
| `make dev`      | run the backend standalone on `:8787` with HMAC verification off |
| `make health`   | `curl http://127.0.0.1:8787/health` |

`make install` installs through the `kirocrew` CLI (FUSE-free), falling back to the
AppImage at `~/apps/KiroCrew-x86_64.AppImage --app-install` when the CLI isn't on PATH
(the AppImage needs FUSE to mount, which many sandboxes disallow). After staging it runs
`npm install --omit=dev` in the installed `backend/` and `npm install && npm run build`
in the installed `ui/`, so the app dir is fully provisioned even when the gateway skips
the lifecycle hooks. Override the AppImage path with `KIRO_APP=...` and the app name/data
dir with `APP_NAME=...` / `APP_DIR=...`. Because install/uninstall leave the app
**disabled**, the final step is always: enable it from the dashboard
(**App Store → Library → Herdr Views**) — the CLI and AppImage cannot enable from outside
the dashboard.

### Install & enable

```bash
kirocrew app install /path/to/kiro-crew-terminals
kirocrew app enable kiro-herdr-views
```

You can also install from the dashboard **App Store → Sources → Install from local path**.
Installing and enabling runs the manifest's lifecycle hooks, which build the app:

```bash
# what onInstall / onUpdate run:
cd ui && npm install && npm run build && cd ../backend && npm install --omit=dev
```

Once enabled, **Herdr Views** appears in the dashboard sidebar (`section: Apps`) at
`/apps/kiro-herdr-views`. The gateway launches `backend/server.mjs` as a subprocess and
reverse-proxies `/api/apps/kiro-herdr-views/*` to it.

### Disable / uninstall

```bash
kirocrew app disable kiro-herdr-views     # stops pages, backend, agents/skills/crons; keeps data
kirocrew app uninstall kiro-herdr-views   # removes the app; keeps per-app data by default
kirocrew app uninstall kiro-herdr-views --purge-data   # deletes data too (not reversible)
```

### Iterating (dev mode)

```bash
kirocrew app dev kiro-herdr-views
```

Dev mode watches `ui/` (no-store UI serving) and broadcasts an `app_reload` event on any
change, so the dashboard hot-reloads the page after each `npm run build`. Backend and
agent/skill changes take effect on the next app invocation — no rebuild needed. To skip the
build step entirely, symlink the source tree so file deltas appear directly:

```bash
ln -sfn /path/to/kiro-crew-terminals/ui ~/.kiro/crew/apps/kiro-herdr-views/ui
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

- `~/.kiro/crew/apps/kiro-herdr-views/.herdr-views/` — `known-sessions.json` and any
  per-provider state. Overridable for standalone runs with `KIRO_HERRD_DATA_DIR`.
- `~/.kiro/crew/apps/kiro-herdr-views/.app_secret` — the HMAC secret the gateway uses to
  sign `X-Crew-Proxy` headers (also available as `KIRO_HERRD_APP_SECRET`). The backend
  verifies it via [`backend/lib/proxy-verify.mjs`](backend/lib/proxy-verify.mjs); set
  `KIRO_HERRD_ALLOW_UNSIGNED=1` only for local development.

---

## Providers

| Provider | Discovered sessions | Attach | Create | Kill |
|----------|--------------------|--------|--------|------|
| `tmux`   | `tmux list-sessions -F '#{session_name}'` | `tmux attach -t <name>` | `tmux new-session -d -s <name>` | `tmux kill-session -t '=<name>'` |
| `screen` | `screen -ls` | `screen -r <pid>` | `screen -d -m -S name /bin/bash -l` | `screen -S <pid> -X quit` |
| `zellij` | `zellij list-sessions --short` | `zellij attach <name>` | `zellij attach --create-background <name>` | `zellij delete-session --force <name>` |
| `herdr`  | `herdr session list --json` | `herdr --session <name>` | `herdr --session <name>` | — (not supported) |
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

## API (proxied at `/api/apps/kiro-herdr-views`)

All routes except `/health` verify the gateway `X-Crew-Proxy` HMAC (unless
`KIRO_HERRD_ALLOW_UNSIGNED=1`).

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/providers` | List provider groups (`id`/`label`/`available`/`killable`), open mirror sessions, and `known` (persisted) sessions |
| GET | `/sessions` | List open mirror sessions |
| GET | `/known` | List persisted (known) sessions across restarts |
| GET | `/providers/:id/create-command?name=` | Provider-specific creation command, plus the session name to use. `name` is optional: without it the server generates the lowest free `<provider>-<nn>` from the provider's live session list, and reports `taken`/`suggested` when the requested name is in use |
| POST | `/sessions` | Attach a session. `provider`+`ref` attaches an existing discovered session by its provider-native ref; `provider` (no `ref`/`cmd`) creates a provider session, generating a free name when none is given (409 with `suggested` if the requested name exists); `cmd` (array) attaches manually/custom |
| DELETE | `/sessions/:ref` | Drop this app's mirror for a session (detach — the host session keeps running). `?kill=1` additionally terminates the underlying session for providers where `killable` is true, and reports `{ killed, reason }` |
| POST | `/input` | Write input to a session (`{ ref, data }`) |
| POST | `/resize` | Resize a session PTY (`{ ref, cols, rows }`) |
| GET | `/sse?ref=` | SSE output stream (fallback transport) |
| WS | `/ws?ref=` | WebSocket bidirectional stream (primary transport) |

### Creating sessions

Selecting a provider in the UI auto-populates its provider-specific creation command
(served by `GET /providers/:id/create-command`) and shows the generated session name as a
placeholder — the name field stays empty unless the user types one, so the generated default
is per-provider instead of a value that sticks across provider changes. Editing the command
switches to manual attach mode and sends it as `cmd` to `POST /sessions`.

### Closing vs killing

Closing a view (`✕`, or `DELETE /sessions/:ref`) only detaches this app's mirror: the tmux /
screen / zellij session keeps running on the host, exactly as before. Killing is a separate,
explicitly confirmed action that asks the provider to terminate the host session. Providers
that have no stable stop verb (`herdr`, `aoe`) report `canKill: false` and the UI does not
offer it.

---

## Roadmap

- [ ] Persist scrollback to disk so output history also survives a backend restart
- [ ] SSH / remote-host provider for sessions on other servers
- [x] Session creation UI for multiplexers that support it (provider create commands, auto-populated on select)

---

## License

[Apache-2.0](LICENSE)
