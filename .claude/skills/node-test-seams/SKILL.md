---
name: node-test-seams
description: Write and debug this repo's dependency-injected Node test suites (server, session manager, providers, extracted UI modules) and avoid the node:test, WebSocket-upgrade, SSE-reader and fake-PTY landmines. Use when adding or fixing tests under backend/test or ui/test, when a test hangs or times out, or when testing code that spawns processes or owns sockets.
user-invocable: true
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Bash(node --test *)
  - Bash(node --check *)
  - Bash(npm test)
  - Bash(make test)
  - Bash(make test-unit)
  - Bash(make test-coverage)
---

# Testing this app without real terminals

The suite runs on Node's built-in runner — no test framework, no real PTY, no
tmux/screen/zellij/herdr/aoe. Everything is injected at the boundary and driven
by in-memory fakes.

## Run it

```bash
node --test "backend/test/*.test.mjs" "ui/test/*.test.mjs"   # globs stay quoted; node expands them
make test-unit          # same
make test-coverage      # + per-file coverage
make test               # unit + backend syntax checks + UI build + bundle invariants
```

Debugging flags (verified on node 26):

- `--test-force-exit` — stop the runner outliving its tests
- `--test-timeout=5000` — turn a hang into a labelled failure instead of a stall
- `--test-reporter=spec` — per-test lines
- `--experimental-test-coverage` — the coverage flag; there is **no** `--coverage`

The full suite must pass with `backend/node_modules/node-pty` removed. If it
does not, something reached a real native PTY.

## The seam recipe

Injection points take a small dependency object and **default to the production
value**, so runtime behaviour is unchanged:

- `SessionManager({ pty, dataDir })`
- `createServer({ registry, sessionManager, verify, allowUnsigned })`
- providers: `new TmuxProvider({ run, findBin, delay })`
- UI transport: `createTermTransport({ makeWs, makeEs, postInput, postResize })`

Rules that keep it working:

- **Native modules load best-effort.** `node-pty` is imported in a try/catch
  dynamic import so importing the module never fails before the native build.
- **Share fakes** from `backend/test/helpers.mjs`. A `.mjs` file without
  `.test.` in the name is not collected by the `*.test.mjs` glob — that is how
  helpers stay out of the run.
- **Scripted runner**: a queue of `{ ok, out, err }` results that *rejects on
  exhaustion*. An unexpected command is the regression you want to catch —
  never default to a benign result.
- **Assert safety with spies.** Record `close()` and `Provider.kill()` calls and
  assert *which* ran, not just the HTTP status. Detach-vs-kill is the invariant
  this repo cares most about.

## Landmines (each cost a real debugging cycle)

- **Upgraded sockets survive `server.close()`.** `closeAllConnections()` does not
  cover WebSocket upgrades; teardown then hangs and the runner reports
  `Promise resolution is still pending but the event loop has already resolved`.
  Terminate them: `for (const c of wss.clients) c.terminate()`.
- **Attach ws listeners before connecting.** The server sends error/replay
  messages *synchronously inside* `handleUpgrade`, so a listener attached after
  the client's `open` event misses them — you get `expected message not
  received; got: []`. Build the collector first, then connect.
- **One reader per fetch `Response` body, ever.** A second `getReader()` throws.
  SSE tests need one long-lived reader that serves replay, live, and end phases.
- **Fake PTY factory**: record `shell`/`args`/`opts`/writes/resizes/kills, expose
  `emit(rec, data)` and `exit(rec, code)`; drive lifecycle through the handles
  rather than poking manager internals.
- **Prove cleanup by counting**: `sessionManager.listenerCount('exit')` returns
  to baseline, `mirror.viewers.size === 0`, and wrap `setInterval`/`clearInterval`
  to prove the SSE keepalive interval was cleared.
- **Restore every global you touch.** `process.env` in `beforeEach`/`afterEach`
  (files run in separate processes, but be explicit); monkeypatched `Math.random`
  and `globalThis.setInterval` in `try/finally`.
- **Guard zero-size layout.** Skip fit/resize when the terminal box has no size
  (`clientWidth`/`clientHeight` are 0); dedupe resize sends by a `dimsKey` so a
  drag does not emit a SIGWINCH per tick.
- **Verify the object you actually mutated.** A proxy test once asserted against
  the original request while mutating a clone, so the branch it meant to cover
  never ran and it passed for the wrong reason.

## Don't

- spawn real multiplexers or a real PTY, or shell out to `which` beyond what is
  unavoidable;
- use wall-clock sleeps for timing — inject `delay` and pass an explicit
  timeout/deadline;
- fake the module under test — inject at the boundary and let the real logic run;
- assert against the fake's own bookkeeping when you can assert through real
  observed behaviour instead.
