import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTermTransport, dimsKey, hasLayout } from '../src/term-transport.mjs';

// Minimal WebSocket/EventSource stand-ins: enough surface (readyState, send,
// close, on* handlers) to drive the ws→sse→rest ladder deterministically.

class FakeWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 0; // CONNECTING
    this.sent = [];
    this.closeCount = 0;
  }
  open() {
    this.readyState = 1; // OPEN
    if (this.onopen) this.onopen();
  }
  receive(msg) {
    if (this.onmessage) this.onmessage({ data: JSON.stringify(msg) });
  }
  fail() {
    this.readyState = 3; // CLOSED
    if (this.onerror) this.onerror(new Error('boom'));
    if (this.onclose) this.onclose();
  }
  send(data) { this.sent.push(data); }
  close() { this.closeCount++; this.readyState = 3; }
}

class FakeEventSource {
  constructor(url) {
    this.url = url;
    this.closeCount = 0;
  }
  receive(msg) {
    if (this.onmessage) this.onmessage({ data: JSON.stringify(msg) });
  }
  close() { this.closeCount++; }
}

function makeHarness(over = {}) {
  const state = {
    ws: null,
    es: null,
    wsFactoryError: null,
    chunks: [],
    exits: 0,
    opens: 0,
    restInput: [],
    restResize: [],
  };
  const transport = createTermTransport({
    wsUrl: () => 'ws://host/api/ws?ref=tmux:work',
    sseUrl: () => '/api/sse?ref=tmux:work',
    makeWs: over.makeWs || ((url) => {
      if (state.wsFactoryError) throw state.wsFactoryError;
      state.ws = new FakeWebSocket(url);
      return state.ws;
    }),
    makeEs: over.makeEs || ((url) => { state.es = new FakeEventSource(url); return state.es; }),
    postInput: (data) => { state.restInput.push(data); },
    postResize: (dims) => { state.restResize.push(dims); },
    onChunk: (data) => { state.chunks.push(data); },
    onOpen: () => { state.opens++; },
    onExit: () => { state.exits++; },
  });
  return { transport, state };
}

test('a working websocket is preferred: chunks stream through it and input rides it', () => {
  const { transport, state } = makeHarness();
  transport.connect();
  assert.equal(transport.mode(), 'ws');
  assert.ok(state.ws, 'websocket created');

  state.ws.open();
  assert.equal(state.opens, 1, 'onOpen fired to re-send the grid');

  state.ws.receive({ type: 'chunk', data: 'hello' });
  state.ws.receive({ type: 'chunk', data: 'world' });
  assert.deepEqual(state.chunks, ['hello', 'world']); // replayed into the terminal

  transport.input('ls\r');
  transport.resize(90, 25);
  assert.deepEqual(state.ws.sent, [
    JSON.stringify({ type: 'input', data: 'ls\r' }),
    JSON.stringify({ type: 'resize', cols: 90, rows: 25 }),
  ]);
  assert.deepEqual(state.restInput, []); // REST not used while ws is open
  assert.deepEqual(state.restResize, []);
});

test('input and resize fall back to REST while the websocket is not open', () => {
  const { transport, state } = makeHarness();
  transport.connect();
  // still CONNECTING (readyState 0): REST carries input and resize.
  transport.input('x');
  transport.resize(120, 36);
  assert.deepEqual(state.restInput, ['x']);
  assert.deepEqual(state.restResize, [{ cols: 120, rows: 36 }]);
  assert.deepEqual(state.ws.sent, []);
});

test('sse is used when the websocket constructor throws', () => {
  const { transport, state } = makeHarness();
  state.wsFactoryError = new Error('WebSocket blocked');
  transport.connect();
  assert.equal(transport.mode(), 'sse');
  assert.ok(state.es, 'event source created');
  state.es.receive({ type: 'chunk', data: 'via-sse' });
  assert.deepEqual(state.chunks, ['via-sse']);
});

test('sse is used when the websocket connection fails or closes', () => {
  for (const when of ['before-open', 'after-open']) {
    const { transport, state } = makeHarness();
    transport.connect();
    if (when === 'after-open') state.ws.open();
    state.ws.fail();
    assert.equal(transport.mode(), 'sse', 'fell back for ' + when);
    assert.ok(state.es);
  }
});

test('an error message from the server switches to sse', () => {
  const { transport, state } = makeHarness();
  transport.connect();
  state.ws.open();
  state.ws.receive({ type: 'error', message: 'no such session' });
  assert.equal(transport.mode(), 'sse');
  assert.ok(state.es);
});

test('repeated exit signals mark the pane ended exactly once', () => {
  const { transport, state } = makeHarness();
  transport.connect();
  state.ws.open();
  state.ws.receive({ type: 'exit' });
  state.ws.receive({ type: 'exit' }); // duplicate signal
  state.ws.fail(); // close race right after
  if (state.es) state.es.receive({ type: 'exit' }); // and the sse fallback exit
  assert.equal(state.exits, 1);
});

test('dispose closes the websocket and the event source exactly once', () => {
  const { transport, state } = makeHarness();
  transport.connect();
  state.ws.open();
  state.ws.receive({ type: 'error', message: 'x' }); // sse fallback active too
  transport.dispose();
  transport.dispose(); // second dispose is a no-op
  assert.equal(state.ws.closeCount, 1);
  assert.equal(state.es.closeCount, 1);
});

test('dispose stops later fallbacks: nothing reconnects after teardown', () => {
  const { transport, state } = makeHarness();
  transport.connect();
  state.ws.open();
  transport.dispose();
  state.ws.fail(); // late close after unmount
  assert.equal(transport.mode(), 'ws'); // never switched to sse
  assert.equal(state.es, null);
});

test('dimsKey formats the grid and hasLayout ignores zero-sized boxes', () => {
  assert.equal(dimsKey(120, 36), '120x36');
  assert.equal(dimsKey(90, 25), '90x25');
  assert.notEqual(dimsKey(120, 36), dimsKey(121, 36));

  assert.equal(hasLayout(null), false);
  assert.equal(hasLayout({ clientWidth: 0, clientHeight: 100 }), false);
  assert.equal(hasLayout({ clientWidth: 100, clientHeight: 0 }), false);
  assert.equal(hasLayout({ clientWidth: 100, clientHeight: 50 }), true);
});
