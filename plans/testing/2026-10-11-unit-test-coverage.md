---
title: Unit test coverage improvements
date: 2026-10-11
theme: testing
status: completed
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

- [x] Correct the malformed-header test so the colonless request is actually
  passed to `verifyProxyRequest()`.
- [x] Correct the malformed-header test so the non-numeric timestamp request is
  actually passed to `verifyProxyRequest()`.
- [x] Reject a signature with an invalid or truncated digest length.
- [x] Reject a timestamp beyond the allowed skew in the future as well as in
  the past.
- [x] Verify signatures for an empty body, a raw `Buffer`, and a string
  `rawBody`.
- [x] Verify that `KIRO_HERRD_APP_SECRET` is used when
  `KIROCREW_PROXY_SECRET` is absent.
- [x] Verify that `KIROCREW_PROXY_SECRET` takes precedence over the legacy
  secret variable.
- [x] Verify that an unusual raw query string is authenticated without URL
  re-encoding.

### 2. Make `SessionManager` independently testable

Refactor `SessionManager` to accept a PTY spawn function, persistence path, or
equivalent small dependency object. Tests should use an in-memory fake PTY and
must not require a compiled `node-pty` installation or a real terminal.

#### Mirror creation

- [x] Reject an empty or missing attach command.
- [x] Spawn the expected executable and arguments.
- [x] Pass the expected terminal name, dimensions, working directory, and
  environment to the PTY.
- [x] Default the working directory to the app data directory.
- [x] Use the provider-native key in the canonical session reference.
- [x] Fall back to the session name when no provider-native key is supplied.
- [x] Reuse an existing mirror for the same reference without spawning a second
  PTY.
- [x] Add a newly created mirror to the live-session map and known-session
  persistence exactly once.
- [x] Emit one `spawn` event containing the canonical session description.

#### Output and viewers

- [x] Append PTY output to the replay buffer.
- [x] Retain no more than 2,000 output chunks and discard the oldest first.
- [x] Fan each output chunk out to every registered viewer callback.
- [x] Emit the manager-level `data` event with the correct reference and data.
- [x] Tolerate a mirror with no viewers.

#### Input, resize, and close

- [x] Forward input data to the PTY associated with the requested reference.
- [x] Return `false` and perform no work for input to an unknown reference.
- [x] Forward explicit resize dimensions to the PTY.
- [x] Use the default 120x36 dimensions when resize dimensions are absent.
- [x] Ignore a PTY resize exception while still reporting that the session was
  found.
- [x] `close()` kills only the mirror PTY and never invokes a provider kill
  operation.
- [x] Tolerate an exception from `pty.kill()`.
- [x] Return `false` when closing an unknown or already-retired mirror.

#### Exit and persistence

- [x] Remove an exited mirror from the live-session map.
- [x] Remove the exited mirror from known-session persistence.
- [x] Persist the updated known-session list.
- [x] Emit one `exit` event with the reference and exit code.
- [x] Clear all viewer callback collections after exit.
- [x] Keep separate sessions intact when one mirror exits.
- [x] Preserve valid session records across a persist/load round trip.
- [x] Reject non-array state files, malformed JSON, empty commands, and garbage
  entries without crashing.
- [x] Treat persistence write or rename failures as non-fatal.

#### Restore

- [x] Restore every valid persisted session when no resolver is supplied.
- [x] Use an attach-command array returned by the resolver.
- [x] Use a `{ cmd, key }` result and update a stale provider-native key.
- [x] Skip a record when the resolver returns `false`.
- [x] Fall back to the persisted command when the resolver throws.
- [x] Remove and persist a record whose PTY cannot be spawned.
- [x] Emit `restore-failed` with the failed reference and useful error text.
- [x] Return the resulting number of live mirrors.

### 3. Add server route tests

Allow `createServer()` to accept an injected registry, session manager, and
authentication verifier. Start the HTTP server on an ephemeral loopback port in
tests and use stub providers; never invoke real terminal tools.

#### Authentication and health

- [x] Serve both `/health` and `/api/health` without proxy authentication.
- [x] Return `403` for an unsigned protected REST request by default.
- [x] Permit a correctly signed protected request.
- [x] Permit unsigned protected requests only when the explicit development
  flag is enabled.
- [x] Reject an unsigned WebSocket upgrade with `403`.

#### Providers and naming

- [x] Return provider metadata, live sessions, and known sessions from
  `GET /api/providers`.
- [x] Return `404` for an unknown provider's create-command request.
- [x] Return the requested name when it is free.
- [x] Mark an existing requested name as taken and return a free suggestion.
- [x] Generate the first available `provider-NN` name when no name is supplied.
- [x] Skip occupied generated names.
- [x] Exercise the fallback suffix after all numbered names are occupied with a
  deterministic random source.
- [x] Return a provider's exact create command for the selected name.

#### Creating and attaching sessions

- [x] Return `400` when the provider is missing.
- [x] Return `400` when a custom command is supplied.
- [x] Return `404` for an unknown provider.
- [x] Attach to a discovered session by provider-native reference.
- [x] Fall back to matching a discovered session by name.
- [x] Return `404` when the requested discovered session does not exist or has
  no attach command.
- [x] Create a new provider session with a generated free name.
- [x] Return `409` and a suggestion when a requested name already exists.
- [x] Return `500` when provider creation throws and preserve its useful error
  message.
- [x] Return `500` when a provider reports success without an attach command.
- [x] Pass the created provider identity, native key, command, and working
  directory to `SessionManager.createSession()`.

#### Detach and kill safety

- [x] Deleting a live mirror without `?kill=1` calls only
  `SessionManager.close()` and never calls `Provider.kill()`.
- [x] Deleting an unknown mirror without a kill request returns `404`.
- [x] A kill request for a non-killable provider closes the mirror but never
  calls the provider's `kill()` method.
- [x] A kill request for a killable provider passes the native key and name to
  `Provider.kill()` and then closes the mirror.
- [x] A provider kill rejection is reported as `killed: false` and still closes
  the mirror.
- [x] A discovered host session can be killed without first creating a mirror.
- [x] A discovered session kill resolves the provider-native identity before
  invoking `kill()`.
- [x] A discovered-session kill returns `404` when no live provider session
  matches.
- [x] Malformed references and unknown providers cannot trigger a host kill.

#### REST input and resize

- [x] Reject input without both a reference and string data.
- [x] Forward valid input and return the manager's result.
- [x] Reject resize without a reference.
- [x] Forward resize dimensions and return the manager's result.

### 4. Add transport tests

These tests may share the injected fake session manager from the route tests.

#### Server-Sent Events

- [x] Return `404` when the requested session does not exist.
- [x] Set the expected event-stream and no-buffering headers.
- [x] Replay buffered chunks in order when a viewer connects.
- [x] Stream newly emitted chunks to the connected viewer.
- [x] End the stream when the matching session exits.
- [x] Remove the viewer and exit listener when the request closes.
- [x] Clear the keepalive interval during cleanup.

#### WebSocket

- [x] Destroy upgrades for paths outside `/api/ws`.
- [x] Send an error and close when the requested session does not exist.
- [x] Replay buffered chunks in order after connection.
- [x] Forward live PTY data as chunk messages.
- [x] Forward valid input messages to the session manager.
- [x] Forward valid resize messages to the session manager.
- [x] Ignore malformed JSON and unsupported message types.
- [x] Send an exit message and close when the session exits.
- [x] Remove viewers, listeners, and empty client sets when a socket closes.

### 5. Add provider behavior tests

Refactor providers to accept a command runner and delay/clock dependency. Use a
scripted fake runner so tests can assert command arguments, output parsing,
fallbacks, retries, and errors without requiring tmux, screen, zellij, Herdr,
or Agent of Empires.

#### Tmux

- [x] Parse trimmed non-empty session names into canonical descriptors.
- [x] Return an empty list when `list-sessions` fails.
- [x] Return the expected descriptor after successful creation.
- [x] Throw creation errors that include tmux stderr.
- [x] Refuse a kill request with no target.
- [x] Kill using the exact-name `=target` syntax.
- [x] Treat a failed kill as success when the session is already gone.
- [x] Report failure and stderr when the target still exists.

#### Screen

- [x] Parse PIDs and names from representative `screen -ls` output.
- [x] Exclude internal or invalid entries such as `_` names and `pts`.
- [x] Preserve PID as the provider-native identity and attach target.
- [x] Throw creation errors that include screen stderr.
- [x] Prefer the newly discovered PID after creation.
- [x] Fall back to the requested name when discovery has not caught up.
- [x] Kill using `-S <native-ref> -X quit`.
- [x] Distinguish an already-gone session from a genuine kill failure.

#### Zellij

- [x] Parse `list-sessions --short` output without suffixes or blank entries.
- [x] Try `attach --create-background` first.
- [x] Fall back to the legacy `--session NAME --detach` form.
- [x] Throw an error with stderr when both creation forms fail.
- [x] Return an attach command using `attach -c` after creation.
- [x] Report ready when the session appears during polling.
- [x] Time out readiness polling without throwing.
- [x] Try force-delete before the legacy kill command.
- [x] Treat a non-zero delete result as success when the session disappeared.
- [x] Retry supported kill forms and report the final useful error.

#### Herdr

- [x] Parse JSON session output, including the running state.
- [x] Ignore malformed or nameless JSON entries.
- [x] Fall back to the plain table listing when JSON is invalid or unavailable.
- [x] Ignore the plain-list header and blank lines.
- [x] Return the materializing attach command from `create()`.
- [x] Stop a session using its provider-native identity.
- [x] Treat a failed stop as success when the session is gone or no longer
  running.
- [x] Report stderr when a failed stop leaves the session running.

#### Agent of Empires

- [x] Parse both an array response and a `{ sessions: [] }` response.
- [x] Exclude trashed and nameless sessions.
- [x] Prefer title, then name, then ID for the displayed identity.
- [x] Create with `add --scratch -t NAME` and then start the session.
- [x] Throw an error with stderr when the add step fails.
- [x] Remove the retained record when the start step fails.
- [x] Return the specialized hook-approval guidance when applicable.
- [x] Return the correct attach descriptor after successful creation.

#### Registry

- [x] Replacing an existing provider ID has deterministic behavior.
- [x] `available()` returns only providers whose availability check succeeds.
- [x] One provider's rejected or synchronously thrown `list()` call does not
  prevent other provider groups from being returned.
- [x] `listAll()` preserves provider metadata and session descriptors.

### 6. Extract and test UI state logic

Move non-rendering logic from `ui/src/index.jsx` into small framework-free
modules where practical. Keep component-level tests focused on wiring and
cleanup rather than xterm internals.

#### Persistence and pane state

- [x] Load valid persisted panes and return an empty list for malformed or
  non-array data.
- [x] Handle unavailable or throwing `localStorage` reads and writes.
- [x] Load and save the active pane reference.
- [x] Prevent opening two panes for the same mirror reference.
- [x] Select a newly opened pane as active.
- [x] Select a remaining pane when the active pane closes.
- [x] Clear the active reference when the final pane closes.
- [x] Prune panes only when a reference is absent from both live and known
  backend sessions.
- [x] Preserve explicitly ended panes during refresh.
- [x] Flatten and filter discovered provider sessions deterministically.

#### API helpers and user actions

- [x] Include same-origin credentials on GET, POST, and DELETE requests.
- [x] Serialize POST bodies and set the JSON content type.
- [x] Prefer an API-provided `error` or `reason` in thrown errors.
- [x] Fall back to method, path, and HTTP status when an error body is invalid.
- [x] Open a discovered session by provider-native reference rather than by
  replaying a command.
- [x] On restart conflict, fall back from create-by-name to attach-by-reference.
- [x] Construct kill URLs with an encoded reference and `?kill=1`.
- [x] Never issue a kill request when the confirmation is declined.
- [x] Keep detach actions separate from kill actions.

#### Terminal transport state

- [x] Prefer WebSocket when it opens successfully.
- [x] Fall back to SSE when WebSocket construction, connection, or protocol
  handling fails.
- [x] Fall back to REST for input and resize while WebSocket is unavailable.
- [x] Replay chunk messages into the terminal.
- [x] Mark a pane ended only once for repeated exit signals.
- [x] Avoid duplicate resize messages when terminal dimensions do not change.
- [x] Ignore fitting while the terminal container has zero dimensions.
- [x] Dispose the terminal, sockets, observers, animation frame, and event
  listeners on unmount.

#### Toast bus additions

- [x] Ignore `clearToast()` calls with an empty key.
- [x] Continue notifying other subscribers when one subscriber throws.
- [x] Exercise the default host `postMessage` path with a fake parent window.
- [x] Exercise the no-host and throwing-host fallbacks.

### 7. Improve the test command and coverage reporting

- [x] Add explicit `test` and `test:coverage` package scripts, or document the
  Make targets as the single supported entry point.
- [x] Make the unit suite runnable without first compiling `node-pty`.
- [x] Ensure test setup restores every environment variable it modifies.
- [x] Run files that mutate `process.env` safely to prevent cross-test leakage.
- [x] Add coverage reporting that includes `server.mjs`, `session-manager.mjs`,
  and extracted UI logic; do not report only modules imported by the existing
  tests as whole-project coverage.
- [x] Add a CI check that runs unit tests, backend syntax checks, the UI build,
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
