---
title: Unit test coverage improvements
date: 2026-10-11
theme: testing
status: proposed
owner: unassigned
summary: Add reliable regression coverage for session safety, providers, transports, and UI state.
---

# Unit test coverage improvements

## Objective

Add deterministic tests around the project's critical invariants: closing a
view must never kill its host session, destructive actions must be explicit,
session state must survive restarts, and all three terminal transports must
remain usable.

## Context

The current suite covers several pure helpers, persistence basics, command
construction, and proxy signing. The most important lifecycle branches remain
untested, provider coverage is limited largely to command construction, and the
main server and UI orchestration paths are not loaded by the existing coverage
run. The session-manager suite also currently requires `node-pty` merely to
import the module.

## Scope

### In scope

- Backend unit and route-level behavioral tests.
- Fake PTY, provider runner, clock, and server dependency seams.
- Provider parsing, error, retry, and lifecycle behavior.
- WebSocket, SSE, and REST transport behavior.
- Extraction and testing of framework-free UI state and transport logic.
- Reproducible test and coverage commands.

### Out of scope

- Tests that create, attach to, or kill real host terminal sessions.
- Tests that depend on installed tmux, screen, zellij, Herdr, or AoE binaries.
- Full browser end-to-end testing beyond the focused component and transport
  behavior described here.

## Plan

### 1. Fix the existing proxy verification tests

- [ ] Correct the malformed-header test so the colonless request is actually
  passed to `verifyProxyRequest()`.
- [ ] Correct the malformed-header test so the non-numeric timestamp request is
  actually passed to `verifyProxyRequest()`.
- [ ] Reject a signature with an invalid or truncated digest length.
- [ ] Reject a timestamp beyond the allowed skew in the future as well as in
  the past.
- [ ] Verify signatures for an empty body, a raw `Buffer`, and a string
  `rawBody`.
- [ ] Verify that `KIRO_HERRD_APP_SECRET` is used when
  `KIROCREW_PROXY_SECRET` is absent.
- [ ] Verify that `KIROCREW_PROXY_SECRET` takes precedence over the legacy
  secret variable.
- [ ] Verify that an unusual raw query string is authenticated without URL
  re-encoding.

### 2. Make `SessionManager` independently testable

Refactor `SessionManager` to accept a PTY spawn function, persistence path, or
equivalent small dependency object. Tests should use an in-memory fake PTY and
must not require a compiled `node-pty` installation or a real terminal.

#### Mirror creation

- [ ] Reject an empty or missing attach command.
- [ ] Spawn the expected executable and arguments.
- [ ] Pass the expected terminal name, dimensions, working directory, and
  environment to the PTY.
- [ ] Default the working directory to the app data directory.
- [ ] Use the provider-native key in the canonical session reference.
- [ ] Fall back to the session name when no provider-native key is supplied.
- [ ] Reuse an existing mirror for the same reference without spawning a second
  PTY.
- [ ] Add a newly created mirror to the live-session map and known-session
  persistence exactly once.
- [ ] Emit one `spawn` event containing the canonical session description.

#### Output and viewers

- [ ] Append PTY output to the replay buffer.
- [ ] Retain no more than 2,000 output chunks and discard the oldest first.
- [ ] Fan each output chunk out to every registered viewer callback.
- [ ] Emit the manager-level `data` event with the correct reference and data.
- [ ] Tolerate a mirror with no viewers.

#### Input, resize, and close

- [ ] Forward input data to the PTY associated with the requested reference.
- [ ] Return `false` and perform no work for input to an unknown reference.
- [ ] Forward explicit resize dimensions to the PTY.
- [ ] Use the default 120x36 dimensions when resize dimensions are absent.
- [ ] Ignore a PTY resize exception while still reporting that the session was
  found.
- [ ] `close()` kills only the mirror PTY and never invokes a provider kill
  operation.
- [ ] Tolerate an exception from `pty.kill()`.
- [ ] Return `false` when closing an unknown or already-retired mirror.

#### Exit and persistence

- [ ] Remove an exited mirror from the live-session map.
- [ ] Remove the exited mirror from known-session persistence.
- [ ] Persist the updated known-session list.
- [ ] Emit one `exit` event with the reference and exit code.
- [ ] Clear all viewer callback collections after exit.
- [ ] Keep separate sessions intact when one mirror exits.
- [ ] Preserve valid session records across a persist/load round trip.
- [ ] Reject non-array state files, malformed JSON, empty commands, and garbage
  entries without crashing.
- [ ] Treat persistence write or rename failures as non-fatal.

#### Restore

- [ ] Restore every valid persisted session when no resolver is supplied.
- [ ] Use an attach-command array returned by the resolver.
- [ ] Use a `{ cmd, key }` result and update a stale provider-native key.
- [ ] Skip a record when the resolver returns `false`.
- [ ] Fall back to the persisted command when the resolver throws.
- [ ] Remove and persist a record whose PTY cannot be spawned.
- [ ] Emit `restore-failed` with the failed reference and useful error text.
- [ ] Return the resulting number of live mirrors.

### 3. Add server route tests

Allow `createServer()` to accept an injected registry, session manager, and
authentication verifier. Start the HTTP server on an ephemeral loopback port in
tests and use stub providers; never invoke real terminal tools.

#### Authentication and health

- [ ] Serve both `/health` and `/api/health` without proxy authentication.
- [ ] Return `403` for an unsigned protected REST request by default.
- [ ] Permit a correctly signed protected request.
- [ ] Permit unsigned protected requests only when the explicit development
  flag is enabled.
- [ ] Reject an unsigned WebSocket upgrade with `403`.

#### Providers and naming

- [ ] Return provider metadata, live sessions, and known sessions from
  `GET /api/providers`.
- [ ] Return `404` for an unknown provider's create-command request.
- [ ] Return the requested name when it is free.
- [ ] Mark an existing requested name as taken and return a free suggestion.
- [ ] Generate the first available `provider-NN` name when no name is supplied.
- [ ] Skip occupied generated names.
- [ ] Exercise the fallback suffix after all numbered names are occupied with a
  deterministic random source.
- [ ] Return a provider's exact create command for the selected name.

#### Creating and attaching sessions

- [ ] Return `400` when the provider is missing.
- [ ] Return `400` when a custom command is supplied.
- [ ] Return `404` for an unknown provider.
- [ ] Attach to a discovered session by provider-native reference.
- [ ] Fall back to matching a discovered session by name.
- [ ] Return `404` when the requested discovered session does not exist or has
  no attach command.
- [ ] Create a new provider session with a generated free name.
- [ ] Return `409` and a suggestion when a requested name already exists.
- [ ] Return `500` when provider creation throws and preserve its useful error
  message.
- [ ] Return `500` when a provider reports success without an attach command.
- [ ] Pass the created provider identity, native key, command, and working
  directory to `SessionManager.createSession()`.

#### Detach and kill safety

- [ ] Deleting a live mirror without `?kill=1` calls only
  `SessionManager.close()` and never calls `Provider.kill()`.
- [ ] Deleting an unknown mirror without a kill request returns `404`.
- [ ] A kill request for a non-killable provider closes the mirror but never
  calls the provider's `kill()` method.
- [ ] A kill request for a killable provider passes the native key and name to
  `Provider.kill()` and then closes the mirror.
- [ ] A provider kill rejection is reported as `killed: false` and still closes
  the mirror.
- [ ] A discovered host session can be killed without first creating a mirror.
- [ ] A discovered session kill resolves the provider-native identity before
  invoking `kill()`.
- [ ] A discovered-session kill returns `404` when no live provider session
  matches.
- [ ] Malformed references and unknown providers cannot trigger a host kill.

#### REST input and resize

- [ ] Reject input without both a reference and string data.
- [ ] Forward valid input and return the manager's result.
- [ ] Reject resize without a reference.
- [ ] Forward resize dimensions and return the manager's result.

### 4. Add transport tests

These tests may share the injected fake session manager from the route tests.

#### Server-Sent Events

- [ ] Return `404` when the requested session does not exist.
- [ ] Set the expected event-stream and no-buffering headers.
- [ ] Replay buffered chunks in order when a viewer connects.
- [ ] Stream newly emitted chunks to the connected viewer.
- [ ] End the stream when the matching session exits.
- [ ] Remove the viewer and exit listener when the request closes.
- [ ] Clear the keepalive interval during cleanup.

#### WebSocket

- [ ] Destroy upgrades for paths outside `/api/ws`.
- [ ] Send an error and close when the requested session does not exist.
- [ ] Replay buffered chunks in order after connection.
- [ ] Forward live PTY data as chunk messages.
- [ ] Forward valid input messages to the session manager.
- [ ] Forward valid resize messages to the session manager.
- [ ] Ignore malformed JSON and unsupported message types.
- [ ] Send an exit message and close when the session exits.
- [ ] Remove viewers, listeners, and empty client sets when a socket closes.

### 5. Add provider behavior tests

Refactor providers to accept a command runner and delay/clock dependency. Use a
scripted fake runner so tests can assert command arguments, output parsing,
fallbacks, retries, and errors without requiring tmux, screen, zellij, Herdr,
or Agent of Empires.

#### Tmux

- [ ] Parse trimmed non-empty session names into canonical descriptors.
- [ ] Return an empty list when `list-sessions` fails.
- [ ] Return the expected descriptor after successful creation.
- [ ] Throw creation errors that include tmux stderr.
- [ ] Refuse a kill request with no target.
- [ ] Kill using the exact-name `=target` syntax.
- [ ] Treat a failed kill as success when the session is already gone.
- [ ] Report failure and stderr when the target still exists.

#### Screen

- [ ] Parse PIDs and names from representative `screen -ls` output.
- [ ] Exclude internal or invalid entries such as `_` names and `pts`.
- [ ] Preserve PID as the provider-native identity and attach target.
- [ ] Throw creation errors that include screen stderr.
- [ ] Prefer the newly discovered PID after creation.
- [ ] Fall back to the requested name when discovery has not caught up.
- [ ] Kill using `-S <native-ref> -X quit`.
- [ ] Distinguish an already-gone session from a genuine kill failure.

#### Zellij

- [ ] Parse `list-sessions --short` output without suffixes or blank entries.
- [ ] Try `attach --create-background` first.
- [ ] Fall back to the legacy `--session NAME --detach` form.
- [ ] Throw an error with stderr when both creation forms fail.
- [ ] Return an attach command using `attach -c` after creation.
- [ ] Report ready when the session appears during polling.
- [ ] Time out readiness polling without throwing.
- [ ] Try force-delete before the legacy kill command.
- [ ] Treat a non-zero delete result as success when the session disappeared.
- [ ] Retry supported kill forms and report the final useful error.

#### Herdr

- [ ] Parse JSON session output, including the running state.
- [ ] Ignore malformed or nameless JSON entries.
- [ ] Fall back to the plain table listing when JSON is invalid or unavailable.
- [ ] Ignore the plain-list header and blank lines.
- [ ] Return the materializing attach command from `create()`.
- [ ] Stop a session using its provider-native identity.
- [ ] Treat a failed stop as success when the session is gone or no longer
  running.
- [ ] Report stderr when a failed stop leaves the session running.

#### Agent of Empires

- [ ] Parse both an array response and a `{ sessions: [] }` response.
- [ ] Exclude trashed and nameless sessions.
- [ ] Prefer title, then name, then ID for the displayed identity.
- [ ] Create with `add --scratch -t NAME` and then start the session.
- [ ] Throw an error with stderr when the add step fails.
- [ ] Remove the retained record when the start step fails.
- [ ] Return the specialized hook-approval guidance when applicable.
- [ ] Return the correct attach descriptor after successful creation.

#### Registry

- [ ] Replacing an existing provider ID has deterministic behavior.
- [ ] `available()` returns only providers whose availability check succeeds.
- [ ] One provider's rejected or synchronously thrown `list()` call does not
  prevent other provider groups from being returned.
- [ ] `listAll()` preserves provider metadata and session descriptors.

### 6. Extract and test UI state logic

Move non-rendering logic from `ui/src/index.jsx` into small framework-free
modules where practical. Keep component-level tests focused on wiring and
cleanup rather than xterm internals.

#### Persistence and pane state

- [ ] Load valid persisted panes and return an empty list for malformed or
  non-array data.
- [ ] Handle unavailable or throwing `localStorage` reads and writes.
- [ ] Load and save the active pane reference.
- [ ] Prevent opening two panes for the same mirror reference.
- [ ] Select a newly opened pane as active.
- [ ] Select a remaining pane when the active pane closes.
- [ ] Clear the active reference when the final pane closes.
- [ ] Prune panes only when a reference is absent from both live and known
  backend sessions.
- [ ] Preserve explicitly ended panes during refresh.
- [ ] Flatten and filter discovered provider sessions deterministically.

#### API helpers and user actions

- [ ] Include same-origin credentials on GET, POST, and DELETE requests.
- [ ] Serialize POST bodies and set the JSON content type.
- [ ] Prefer an API-provided `error` or `reason` in thrown errors.
- [ ] Fall back to method, path, and HTTP status when an error body is invalid.
- [ ] Open a discovered session by provider-native reference rather than by
  replaying a command.
- [ ] On restart conflict, fall back from create-by-name to attach-by-reference.
- [ ] Construct kill URLs with an encoded reference and `?kill=1`.
- [ ] Never issue a kill request when the confirmation is declined.
- [ ] Keep detach actions separate from kill actions.

#### Terminal transport state

- [ ] Prefer WebSocket when it opens successfully.
- [ ] Fall back to SSE when WebSocket construction, connection, or protocol
  handling fails.
- [ ] Fall back to REST for input and resize while WebSocket is unavailable.
- [ ] Replay chunk messages into the terminal.
- [ ] Mark a pane ended only once for repeated exit signals.
- [ ] Avoid duplicate resize messages when terminal dimensions do not change.
- [ ] Ignore fitting while the terminal container has zero dimensions.
- [ ] Dispose the terminal, sockets, observers, animation frame, and event
  listeners on unmount.

#### Toast bus additions

- [ ] Ignore `clearToast()` calls with an empty key.
- [ ] Continue notifying other subscribers when one subscriber throws.
- [ ] Exercise the default host `postMessage` path with a fake parent window.
- [ ] Exercise the no-host and throwing-host fallbacks.

### 7. Improve the test command and coverage reporting

- [ ] Add explicit `test` and `test:coverage` package scripts, or document the
  Make targets as the single supported entry point.
- [ ] Make the unit suite runnable without first compiling `node-pty`.
- [ ] Ensure test setup restores every environment variable it modifies.
- [ ] Run files that mutate `process.env` safely to prevent cross-test leakage.
- [ ] Add coverage reporting that includes `server.mjs`, `session-manager.mjs`,
  and extracted UI logic; do not report only modules imported by the existing
  tests as whole-project coverage.
- [ ] Add a CI check that runs unit tests, backend syntax checks, the UI build,
  and committed-bundle invariant checks.

## Implementation order

1. Fix the malformed proxy-test assertions.
2. Inject the PTY dependency and complete `SessionManager` lifecycle tests.
3. Inject server dependencies and cover detach/kill route behavior.
4. Inject provider command runners and cover parsing and failure paths.
5. Cover SSE and WebSocket behavior.
6. Extract UI state and transport logic, then test it independently.
7. Add reproducible test and coverage commands to CI.

## Validation

- Run the complete unit suite without terminal multiplexer binaries installed.
- Run backend syntax checks and the UI build and bundle invariant checks.
- Run coverage against the server, session manager, providers, and extracted UI
  modules, not only modules already imported by legacy tests.
- Verify through spies that no unit test invokes a real PTY spawn or provider
  kill command.

## Risks and mitigations

- Dependency injection can accidentally alter runtime defaults. Preserve the
  existing production dependencies as constructor or factory defaults and add
  tests for those defaults.
- Timing-based transport tests can become flaky. Inject clocks and delays, and
  use explicit events instead of wall-clock sleeps.
- Route tests could perform destructive provider actions if real providers leak
  into the fixture. Require stub registries and assert the injected registry is
  used.
- UI extraction can drift from component behavior. Keep extracted functions
  small and have components call the tested functions directly.

## Completion criteria

- The complete unit suite runs without installed terminal multiplexer binaries.
- Unit tests do not start or kill real host sessions.
- Unit tests do not require an interactive terminal or native PTY process.
- Every detach/kill safety branch has an explicit regression test.
- Provider stderr and fallback behavior are covered.
- Session restoration, output buffering, and viewer cleanup are covered.
- WebSocket, SSE, and REST transport behavior is covered.
- Coverage includes all core logic rather than only already-tested helper
  modules.
