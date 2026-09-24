# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- **Sidebar sections are now collapsible.** Click a section title (Providers, Open Sessions,
  Discovered Sessions) to collapse or expand it. The state is persisted in `localStorage`, so it
  survives a page reload.

- **herdr and aoe providers rewritten for their actual CLIs.** Both used verbs that do not exist
  in the installed versions — `herdr init -y <name>` (herdr 0.9.1 answered "unknown command:
  init") and `aoe new -n <name>` ("unrecognized subcommand 'new'") — so every create from those
  providers failed. They now use the real surfaces:
  - herdr: `herdr session list --json` to discover, `herdr --session <name>` to create-or-attach.
  - aoe: `aoe list --json` to discover, `aoe add --scratch -t <name>` + `aoe session start <name>`
    to create, `aoe session attach <name>` to attach. Filtered to omit trashed sessions.

  The `aoe session start` step requires one-time hook-path approval in the aoe TUI before aoe
  may launch agent sessions — the error message reports this clearly instead of "unrecognized
  subcommand 'new'".

- **One session per screen, navigated from the sidebar.** The terminal area was a CSS grid
  (`repeat(auto-fill, minmax(340px, 1fr))`) that tiled every open pane, so each pane was sized
  by how many were open. The pane area is now a single view filling everything the create form
  does not use, and the sidebar gained an **Open Sessions** list that switches between them.
  `min-height: 0` runs down the flex chain so the terminal well actually fills the pane.

- **Closing a view and killing a session are now different actions.** `✕` (pane header and
  sidebar row) only detaches this app's mirror — the host session keeps running. **Kill** asks
  the provider to terminate the real session, behind a confirmation. `agents.md` invariant #1
  previously banned `kill-session` outright; it is rewritten to keep the intent (nothing
  destructive happens implicitly) while allowing the explicit, confirmed kill.

- **Session identity is `provider:native-key`.** The native key is the session name for
  tmux/zellij and the **pid** for screen, which allows two sessions to share a name. Discovered
  sessions are now opened by sending their provider `ref` rather than replaying their command.

- `MAX_BUFFER` raised 400 → 2000 chunks, since switching sessions unmounts the pane and the
  backend replay is what restores its scrollback.

- README provider/API tables updated; `create-command` documented as name-optional, `DELETE`
  and the kill semantics added.
- **UI rebuilt**: Ran `npm install && npm run build` in `ui/` to sync uncommitted frontend changes to the installed app copy.

### Added

- **`DELETE /api/sessions/:ref`** — drops the mirror (detach). `?kill=1` additionally
  terminates the host session and returns `{ killed, reason }`.
- **`Provider#canKill()` / `Provider#kill()`** — opt-in per provider. Implemented for tmux
  (`kill-session -t '=<name>'`), screen (`-S <pid> -X quit`) and zellij
  (`delete-session --force`); herdr/aoe report `canKill: false` and the UI hides the button.
- **Server-side session naming.** `GET /providers/:id/create-command` no longer requires a
  name: it returns the lowest free `<provider>-<nn>` derived from the provider's live session
  list, plus `taken`/`suggested` when the requested name is in use. `POST /sessions` creates
  with a generated name when none is given and answers **409 + `suggested`** when the requested
  name already exists.
- **Provider `killable` flag and `known[]`** in the `/providers` payload, so the UI can gate
  the Kill button and tell "forgotten by the backend" apart from "restore still running"
  without a second request.
- Ended-session state in the pane with **Restart** / **Close view**, instead of a dead terminal
  or a silently pruned pane.
- A duplicate-name warning in the create form with a one-click "Use <suggested>".
- **Backend health verification**: Verified `/health` endpoint returns `{"ok":true,"name":"kiro-herdr-views"}` and `/api/apps/kiro-herdr-views/providers` returns all 5 providers (tmux, screen, zellij, herdr, aoe) with correct availability status.

### Fixed

- **Terminal resize was never sent to the PTY.** `server.mjs` called `sessionManager.write(ref, null,
  {cols, rows})` to signal a resize, but the manager destructured its third argument as `{resize}`
  (`write(ref, data, { resize } = {})`) — so `resize` was always `undefined`, the resize branch
  was never entered, and the PTY stayed at its spawn-time 120×36 default forever. Now proven by
  `stty size` read back over the mirror's replay buffer: the PTY changes from 36×120 → 44×111
  → 25×90 in response to `POST /resize`, tracking the xterm's actual grid rather than some
  fixed size.

- **Provider rows rendered as invisible boxes and the filter did nothing.**
  `ProviderRegistry.listAll()` returned `{ provider, label, available }` while the UI read
  `p.id`, so every row's label and key were `undefined` (five empty, hoverable boxes) and
  `p.id === selectedProvider` could never match. `listAll()` now builds rows from
  `provider.toInfo()`, the single source of the `id` field. The provider `<select>` in the
  create form had the same bug and only worked because React omits an undefined `<option
  value>` and the browser fell back to the option text.

- **Every new session came out named "tmux-session".** The create form wrote its default into
  the name input as a real value (`setName(provider + '-session')`), so the field was never
  empty again and switching provider kept the first name. The default now lives in component
  state and is shown as a placeholder; it is never written into the input, and selecting a
  different provider clears it.

- **The command box could show another provider's command.** The default-command fetch was
  guarded on the session name alone, so switching provider with an unchanged name skipped the
  fetch and left the previous provider's argv on screen ("Auto-filled from zellij" above a tmux
  command); editing it submitted the wrong command. The guard is now keyed on provider + name,
  the fetch is debounced, and a failed fetch clears the box rather than leaving stale argv.

- **The same session could be opened twice**, producing two React children with the same key
  and two xterms writing to one PTY — every keystroke doubled. `openPane` dedupes by ref.

- **Duplicate names silently attached to the existing session.** `TmuxProvider.create()`
  discarded the result of `new-session -d`, so a rejected duplicate still returned an attach
  command for the session that already existed. `create()` now throws with the CLI's own
  message, and the route pre-checks the name and answers 409.

- **The zellij provider never created a session on zellij 0.45.** It ran
  `zellij --session <name> --detach`, but 0.45 removed `--detach` ("unexpected argument") and
  the failure was swallowed. Creation now uses `zellij attach --create-background`, falls back
  to the legacy spelling, waits for the session to register (a background session takes a moment
  to appear), and attaches with `-c` so the PTY cannot lose that race.

- **Discovered zellij sessions carried a formatting suffix.** `list-sessions -n` strips colour
  but keeps ` [Created 6m 20s ago]`, so every name arrived with it glued on. Now parsed with
  `list-sessions --short`.

- **tmux sessions were identified by `#{session_id}` (`$0`)** rather than the session name,
  which is what `attach` and `kill-session` target and what a created session is keyed by.
  Discovered and created views of one tmux session also deduped against each other only after
  this change.

- **A successful kill could be reported as a failure.** `zellij delete-session --force` exits
  non-zero when it force-kills a session that has a client attached — which is the normal case
  here, because our mirror is the client — while actually deleting it. All three providers now
  confirm the outcome against `list()` instead of trusting the exit code.

- **Provider failures were silent.** Every provider's `run()` discarded stderr, so a mux's own
  explanation ("session not found", "unexpected argument") was dropped. stderr is captured and
  included in the thrown/returned error, and `herdr`/`aoe` creation no longer reports success
  after a failed create.

- **The terminal never re-fit when the layout changed.** `fit()` ran only on mount and on
  `window.resize`, so a pane whose box changed without a window resize (form wraps, sidebar
  scrolls, tab switch) kept stale `cols`/`rows` and rendered into part of its box. A
  `ResizeObserver` on the container now refits and re-sends the grid only when the dimensions
  actually changed. xterm instances are also disposed on unmount — previously every tab switch
  stranded a live terminal and its listeners.

- **Open panes could be wiped by polling.** `refresh()` pruned panes against live sessions
  only, and its guard was dead logic (`if (closed.length) return open` ≡ `return open`). A pane
  whose backend had not finished `restore()` yet was dropped from state *and* localStorage.
  Pruning now uses `sessions ∪ known`, and panes that exited on their own are kept so they can
  be restarted.

- **Polling loaded the host every 8 seconds.** `/providers` ran `execFileSync('which')`
  synchronously for all five providers per request, plus five session-list commands. `haveBin`
  is memoised with a 30s TTL and polling pauses while the page is hidden.

- **Server error messages were thrown away by the client.** `apiGet`/`apiPost` reported a bare
  status code, discarding the 409 message, the failed-kill reason and the suggestion. All three
  verb helpers now surface the server's `error`/`reason`.

- `SessionManager#detach` (dead code, never called) replaced by `#close`, and the manager raises
  its listener limit, since each web viewer adds one `exit` listener and ten concurrent viewers
  triggered a `MaxListenersExceededWarning`.

- **Backend dependency installation path (app.json:38-39)**: The `onInstall` and `onUpdate` scripts incorrectly used `cd ..` after building the UI, which walked above the app root directory (`/home/raymondcoetzee/.kiro/crew/apps/`). This caused `npm install --omit=dev` to fail silently (no package.json in parent directory), leaving `backend/node_modules` empty. Fixed to `cd ../backend` so dependencies (`ws`, `express`, `node-pty`) are properly installed.

- **Provider import paths (backend/providers/*.mjs)**: All 5 provider files (`tmux.mjs`, `screen.mjs`, `zellij.mjs`, `herdr.mjs`, `aoe.mjs`) had incorrect relative imports:
  - `import { Provider } from './registry.mjs'` → `import { Provider } from '../lib/registry.mjs'`
  - `import { findBin } from './paths.mjs'` → `import { findBin } from '../lib/paths.mjs'`
  This caused `ERR_MODULE_NOT_FOUND` errors when the backend started, as the modules don't exist in the `providers/` directory.

- **Missing `createCommand()` methods (backend/providers/*.mjs)**: The base `Provider` class in `backend/lib/registry.mjs` declares an abstract `createCommand(name)` method. All 5 providers were missing this implementation, which would cause runtime errors when the API endpoint `/providers/:id/create-command` is called. Added proper implementations to each provider.

- **UI entry paths in app.json**: Changed `ui/dist/index.mjs` to `dist/index.mjs` in both `ui.entry` and `ui.pages[0].entryPoint` to match the actual build output location.