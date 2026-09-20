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
- **UI** (`ui/`) — React + [xterm.js](https://xtermjs.org/). Built by Vite into a single,
  self-contained `ui/dist/index.mjs` (CSS inlined, exports `mount`).

Transport is **WebSocket-first** with an **SSE fallback** and plain **REST fallback**, so the
viewer works even when the gateway can't upgrade a connection to WebSocket.

---

## Install (as a Kiro Crew app)

Host the repo (or point the Kiro Crew host at this folder) and install the app. The manifest in
[`app.json`](app.json) handles the rest:

```bash
# ...and when installing, the app's onInstall runs:
cd ui && npm install && npm run build && cd ..
npm install --omit=dev      # node-pty, express, ws in backend/
```

Then open **Herdr Views** in the dashboard sidebar (`section: Apps`).

### Manual build (for development)

```bash
# UI (requires Node ≥ 18)
cd ui
npm install
npm run build               # -> dist/index.mjs

# Backend deps (node-pty is a native module)
cd ../backend
npm install
```

### Run the backend standalone (dev / debugging)

```bash
# from backend/:
#     KIRO_HERRD_ALLOW_UNSIGNED=1 allows requests without the gateway HMAC header
#     KIRO_HERRD_PORT (default 8787) overrides the listen port
node server.mjs
```

> On Windows, `node-pty` needs ConPTY, which is only available in an interactive console.
> It won't spawn inside a detached toolhost sandbox (`Cannot launch conpty`). On the actual
> server host (Linux/macOS, or a normal Windows console) `node-pty` uses `forkpty` and works
> as expected.

---

## Providers

| Provider | Discovered sessions | Attach | Create |
|----------|--------------------|--------|--------|
| `tmux`   | `tmux list-sessions -F '#{session_name}:#{session_id}'` | `tmux attach -t <name>` | `tmux new-session -d -s <name>` |
| `screen` | `screen -ls` | `screen -r <pid>` | `screen -d -m -S name /bin/bash -l` |
| `zellij` | `zellij list-sessions -n` | `zellij attach <name>` | — |
| `herdr`  | `herdr sessions --format json` / `herdr status --format json` | `herdr attach <name>` | `herdr init -y <name>` |
| `aoe`    | `aoe status --format json` | `aoe attach <name>` | — |

Each provider is implemented against a common interface in [`backend/lib/registry.mjs`](backend/lib/registry.mjs),
so adding a new session manager (e.g. an SSH/remote tunnelled provider) is just a new file in
[`backend/providers/`](backend/providers).

---

## API (proxied at `/api/apps/kiro-herdr-views`)

All routes except `/health` verify the gateway `X-Crew-Proxy` HMAC (unless
`KIRO_HERRD_ALLOW_UNSIGNED=1`).

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/providers` | List provider groups + currently open mirror sessions |
| GET | `/sessions` | List open mirror sessions |
| GET | `/known` | List persisted (known) sessions across restarts |
| POST | `/sessions` | Attach a session (`{ provider, ref, name, cmd, cwd }`) |
| POST | `/input` | Write input to a session (`{ ref, data }`) |
| POST | `/resize` | Resize a session PTY (`{ ref, cols, rows }`) |
| GET | `/sse?ref=` | SSE output stream (fallback transport) |
| WS | `/ws?ref=` | WebSocket bidirectional stream (primary transport) |

---

## Roadmap

- [ ] Persist scrollback to disk so output history also survives a backend restart
- [ ] SSH / remote-host provider for sessions on other servers
- [ ] Session creation UI for multiplexers that support it

---

## License

[Apache-2.0](LICENSE)
