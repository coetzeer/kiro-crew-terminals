// Terminal transport controller: WebSocket primary, SSE fallback, REST
// input/resize last resort. Extracted from index.jsx (TerminalPane) so the
// fallback ladder, the once-only exit handling and the input routing are
// unit-testable without xterm or a DOM. The component keeps everything
// rendering-related and drives this controller.

export function createTermTransport(opts) {
  const {
    wsUrl, // () => string, resolved lazily so tests inject static URLs
    sseUrl,
    makeWs = (url) => new WebSocket(url),
    makeEs = (url) => new EventSource(url),
    postInput, // REST fallback for input while WebSocket is unavailable
    postResize,
    onChunk, // (data) => void — replayed and live chunks alike
    onOpen, // () => void — the grid is re-sent once the socket opens
    onExit, // () => void — invoked at most once
  } = opts;

  let mode = 'rest';
  let ws = null;
  let es = null;
  let disposed = false;
  let exited = false;

  // Repeated exit signals (a WebSocket exit message plus an SSE exit event, or
  // a close race) must mark the pane ended exactly once.
  function markExit() {
    if (exited) return;
    exited = true;
    if (onExit) onExit();
  }

  function handleMessage(msg) {
    if (!msg) return;
    if (msg.type === 'chunk' && onChunk) onChunk(msg.data);
    // The server answers a bad ref (or a race where the session died between
    // the view mounting and the socket opening) with an error message.
    if (msg.type === 'error') useSse();
    if (msg.type === 'exit') markExit();
  }

  function useSse() {
    if (disposed || mode === 'sse') return;
    mode = 'sse';
    const source = makeEs(sseUrl());
    es = source;
    source.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'chunk' && onChunk) onChunk(msg.data);
        if (msg.type === 'exit') markExit();
      } catch {}
    };
    source.onerror = () => {};
  }

  function connect() {
    let socket = null;
    try {
      socket = makeWs(wsUrl());
    } catch {
      socket = null;
    }
    if (!socket) {
      useSse();
      return;
    }
    ws = socket;
    mode = 'ws';
    socket.onopen = () => { if (onOpen) onOpen(); };
    socket.onmessage = (ev) => {
      try {
        handleMessage(JSON.parse(ev.data));
      } catch {}
    };
    socket.onerror = () => { useSse(); };
    socket.onclose = () => { useSse(); };
  }

  function input(data) {
    if (ws && ws.readyState === 1) {
      try {
        ws.send(JSON.stringify({ type: 'input', data }));
      } catch {}
    } else if (postInput) {
      postInput(data);
    }
  }

  function resize(cols, rows) {
    if (ws && ws.readyState === 1) {
      try {
        ws.send(JSON.stringify({ type: 'resize', cols, rows }));
      } catch {}
    } else if (postResize) {
      postResize({ cols, rows });
    }
  }

  function dispose() {
    if (disposed) return; // idempotent: unmount races must not double-close
    disposed = true;
    if (ws) { try { ws.close(); } catch {} }
    if (es) { try { es.close(); } catch {} }
  }

  return { connect, input, resize, dispose, mode: () => mode };
}

// Only push a resize when the grid actually changed: this runs from a
// ResizeObserver, which fires on every layout tick while a splitter or the
// window is dragged — and each send is a SIGWINCH the mux has to repaint for.
export function dimsKey(cols, rows) {
  return cols + 'x' + rows;
}

// Nothing to report (or fit) while the terminal box has no size yet, which is
// also what fit() would choke on.
export function hasLayout(el) {
  return Boolean(el && el.clientWidth && el.clientHeight);
}
