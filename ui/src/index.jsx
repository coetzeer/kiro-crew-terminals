import React from 'react';
import { createRoot } from 'react-dom/client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import xtermCss from 'xterm/css/xterm.css?inline';
import appCss from './index.css?inline';
import { ProviderIcon } from './icons.jsx';

let cssInjected = false;
function injectCss() {
  if (cssInjected) return;
  cssInjected = true;
  const s = document.createElement('style');
  s.textContent = xtermCss + '\n' + appCss;
  document.head.appendChild(s);
}

const APP = 'kiro-herdr-views';
const PROXY_BASE = '/apps/' + APP + '/api';
const PANE_KEY = 'kiro-herdr-views:panes';
const ACTIVE_KEY = 'kiro-herdr-views:active';
const px = (p) => PROXY_BASE + p;

const cmdText = (cmd) => (Array.isArray(cmd) ? cmd.join(' ') : String(cmd || ''));

function loadPanes() {
  try {
    const raw = window.localStorage.getItem(PANE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((s) => s && s.ref && s.cmd) : [];
  } catch {
    return [];
  }
}

function savePanes(panes) {
  try {
    window.localStorage.setItem(PANE_KEY, JSON.stringify(panes));
  } catch {}
}

function loadActive() {
  try {
    return window.localStorage.getItem(ACTIVE_KEY) || '';
  } catch {
    return '';
  }
}

function saveActive(ref) {
  try {
    window.localStorage.setItem(ACTIVE_KEY, ref || '');
  } catch {}
}

// Surface the server's own message where there is one. A 409 "name already
// exists" and a failed-kill reason are the only things that tell the user what
// to do next, and reporting a bare status code threw both away.
async function readError(res, label) {
  let detail = '';
  try {
    const body = await res.json();
    detail = (body && (body.error || body.reason)) || '';
  } catch {}
  return new Error(detail || label + ' -> ' + res.status);
}

async function apiGet(path) {
  const r = await fetch(path, { credentials: 'same-origin' });
  if (!r.ok) throw await readError(r, 'GET ' + path);
  return r.json();
}

async function apiPost(path, body) {
  const r = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!r.ok) throw await readError(r, 'POST ' + path);
  return r.json();
}

async function apiDelete(path) {
  const r = await fetch(path, { method: 'DELETE', credentials: 'same-origin' });
  if (!r.ok) throw await readError(r, 'DELETE ' + path);
  return r.json();
}

// In-app toast bus — extracted to toast-bus.mjs (framework-free) so the dedupe
// logic is unit-testable. Errors must survive on screen until the user
// dismisses them, but the host toast's lifetime is out of our control
// (best-effort postMessage), so errors are also pushed to a persistent,
// dismissible overlay rendered outside the form/top-bar layout — see ToastHost.
import { toastBus, reduceToasts } from './toast-bus.mjs';
import { pickNameToSuggest } from './name-suggest.mjs';
const { pushToast, clearToast, notify } = toastBus;

function ToastHost() {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = toastBus.subscribe((evt) => setToasts((prev) => reduceToasts(prev, evt)));
    return unsubscribe;
  }, []);
  const dismiss = (id) => {
    // Releasing the dedupe key on a manual dismiss does two things: the source
    // isn't still shown as on-screen, and a later, genuinely new error for the
    // same key is allowed to notify the host again instead of being swallowed.
    const t = toasts.find((x) => x.id === id);
    if (t && t.dedupeKey) clearToast(t.dedupeKey);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  };
  if (toasts.length === 0) return null;
  return (
    <div className="hv-toasts" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={'hv-toast hv-toast-' + t.severity} role="alert">
          <span className="hv-toast-msg">{t.text}</span>
          <button type="button" className="hv-toast-close" aria-label="Dismiss" title="Dismiss" onClick={() => dismiss(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

// The dashboard's active palette lives on <html> as CSS custom properties, and
// this bundle runs in the dashboard's own document, so the terminal can borrow
// the live theme instead of hardcoding a near-black that fights it.
function cssVar(name, fallback) {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  } catch {
    return fallback;
  }
}

// getPropertyValue on a custom property returns the token stream with var()
// already substituted, so a stack whose leading alias is unset comes back as
// ",JetBrains Mono,…". xterm would reject that as a font-family, so drop the
// empty entries before handing it over.
function fontStack(name, fallback) {
  const parts = cssVar(name, '').split(',').map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts.join(', ') : fallback;
}

function terminalTheme() {
  const bg = cssVar('--bg', '#0b0e14');
  const strong = cssVar('--text-strong', '#eee8d5');
  return {
    background: bg,
    foreground: cssVar('--text', '#d7dae0'),
    cursor: cssVar('--accent', '#3b82f6'),
    cursorAccent: bg,
    selectionBackground: cssVar('--accent-subtle', 'rgba(59,130,246,0.3)'),
    black: cssVar('--bg-accent', '#073642'),
    red: cssVar('--danger', '#dc322f'),
    green: cssVar('--ok', '#859900'),
    yellow: cssVar('--warn', '#b58900'),
    blue: cssVar('--info', '#268bd2'),
    magenta: cssVar('--term-magenta', '#c678dd'),
    cyan: cssVar('--term-cyan', '#56b6c2'),
    white: strong,
    brightBlack: cssVar('--muted-strong', '#586e75'),
    brightRed: cssVar('--danger', '#dc322f'),
    brightGreen: cssVar('--ok', '#859900'),
    brightYellow: cssVar('--warn', '#b58900'),
    brightBlue: cssVar('--info', '#268bd2'),
    brightMagenta: cssVar('--term-magenta', '#c678dd'),
    brightCyan: cssVar('--term-cyan', '#56b6c2'),
    brightWhite: strong,
  };
}

function TerminalPane({ session, ended, killable, onExit, onClose, onKill, onRestart }) {
  const containerRef = React.useRef(null);
  const modeRef = React.useRef('ws');
  const wsRef = React.useRef(null);
  const sseRef = React.useRef(null);
  const onExitRef = React.useRef(onExit);

  React.useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  React.useEffect(() => {
    // A pane whose session already ended shows the restart prompt instead of a
    // terminal, so there is nothing to attach to.
    if (ended) return undefined;

    let disposed = false;
    let exited = false;
    const term = new Terminal({
      convertEol: true,
      fontSize: 13,
      fontFamily: fontStack('--mono', 'Menlo, Consolas, "DejaVu Sans Mono", monospace'),
      cursorBlink: true,
      theme: terminalTheme(),
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);

    // A theme switch (mode, colour theme, freshly installed pack) arrives as an
    // attribute change on <html> or a new stylesheet in <head> — not as a React
    // render this component could subscribe to — so watch the host document.
    let themeObs = null;
    try {
      themeObs = new MutationObserver(() => {
        try { term.options.theme = terminalTheme(); } catch {}
      });
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-color-theme', 'style'] });
      themeObs.observe(document.head, { childList: true });
    } catch {}

    const sendResize = () => {
      try {
        const dims = { cols: term.cols, rows: term.rows };
        if (wsRef.current && wsRef.current.readyState === 1) {
          wsRef.current.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }));
        } else {
          apiPost(px('/resize'), { ref: session.ref, cols: dims.cols, rows: dims.rows }).catch(() => {});
        }
      } catch {}
    };

    // Only push a resize when the grid actually changed. This runs from a
    // ResizeObserver, which fires on every layout tick while a splitter or the
    // window is dragged — and each send is a SIGWINCH the mux has to repaint
    // for. Nothing to report while the box has no size yet, which is also what
    // fit() would choke on.
    let lastDims = '';
    const applyFit = () => {
      const el = containerRef.current;
      if (!el || !el.clientWidth || !el.clientHeight) return;
      try { fit.fit(); } catch { return; }
      const dims = term.cols + 'x' + term.rows;
      if (dims === lastDims) return;
      lastDims = dims;
      sendResize();
    };

    const onWin = () => applyFit();
    window.addEventListener('resize', onWin);

    // The pane's own box changes with no window resize at all: the create form
    // wraps, the sidebar scrolls, the pane is revealed by a tab switch. Fit was
    // only ever driven by window resize, so the terminal kept a stale
    // cols/rows and rendered into part of its box.
    let ro = null;
    try {
      ro = new ResizeObserver(() => applyFit());
      ro.observe(containerRef.current);
    } catch {}

    term.onData((data) => {
      if (wsRef.current && wsRef.current.readyState === 1) {
        wsRef.current.send(JSON.stringify({ type: 'input', data }));
      } else {
        apiPost(px('/input'), { ref: session.ref, data }).catch(() => {});
      }
    });

    const markExit = () => {
      if (exited) return;
      exited = true;
      if (onExitRef.current) onExitRef.current(session.ref);
    };

    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      if (wsRef.current) { try { wsRef.current.close(); } catch {} }
      if (sseRef.current) { try { sseRef.current.close(); } catch {} }
      if (themeObs) { try { themeObs.disconnect(); } catch {} }
      if (ro) { try { ro.disconnect(); } catch {} }
      window.removeEventListener('resize', onWin);
      // Switching sessions unmounts this pane and mounts the next, so without
      // disposing, every tab switch would strand a live xterm with its listeners.
      try { term.dispose(); } catch {}
    };

    const useSse = () => {
      if (disposed || modeRef.current === 'sse') return;
      modeRef.current = 'sse';
      const es = new EventSource(px('/sse?ref=' + encodeURIComponent(session.ref)));
      sseRef.current = es;
      es.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'chunk') term.write(msg.data);
          if (msg.type === 'exit') { markExit(); cleanup(); }
        } catch {}
      };
      es.onerror = () => {};
    };

    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = proto + '://' + window.location.host + px('/ws?ref=' + encodeURIComponent(session.ref));
    let ws = null;
    try { ws = new WebSocket(wsUrl); } catch {}
    wsRef.current = ws;

    if (ws) {
      // On open, re-send the grid: the replayed buffer puts a fresh xterm back
      // where the session was, and the resize makes the mux repaint its screen
      // so a full-screen TUI is not left half-drawn.
      ws.onopen = () => { applyFit(); };
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'chunk') term.write(msg.data);
          if (msg.type === 'error') { if (!disposed) useSse(); }
          if (msg.type === 'exit') { markExit(); cleanup(); }
        } catch {}
      };
      ws.onerror = () => { if (!disposed) useSse(); };
      ws.onclose = () => { if (!disposed) useSse(); };
    } else {
      useSse();
    }

    // Effects run after commit, but the browser may not have laid the box out
    // yet; a fit at zero size would leave the grid at the default 80x24.
    applyFit();
    const raf = requestAnimationFrame(() => applyFit());

    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.ref, ended]);

  return (
    <div className="hv-pane">
      <div className="hv-pane-top">
        <span className="hv-pane-title" title={session.providerId + ' · ' + session.name}>
          <ProviderIcon id={session.providerId} className="hv-pane-ico" />
          <span className="hv-pane-name">{session.name}</span>
          <span className="hv-pane-prov">{session.providerId}</span>
        </span>
        <span className="hv-pane-cmd" title={cmdText(session.cmd)}>{cmdText(session.cmd)}</span>
        <span className="hv-pane-actions">
          {killable && !ended && (
            <button
              className="hv-btn-sm hv-danger"
              onClick={onKill}
              title={'Force-stop this ' + session.providerId + ' session on the host — cannot be undone'}
            >
              Kill
            </button>
          )}
          {/* ✕ = detach (view close, host session survives) */}
          <button
            className="hv-x"
            onClick={onClose}
            aria-label="Detach from session"
            title="Detach — close this view, session keeps running on the host"
          >
            ✕
          </button>
        </span>
      </div>
      {ended ? (
        <div className="hv-ended">
          <div className="hv-ended-title">This session has ended</div>
          <div className="hv-ended-note">
            <span className="hv-mono">{cmdText(session.cmd)}</span> is no longer running on the host.
          </div>
          <div className="hv-ended-actions">
            <button className="hv-btn" onClick={onRestart}>Restart session</button>
            <button className="hv-btn hv-btn-ghost" onClick={onClose}>Close view</button>
          </div>
        </div>
      ) : (
        <div className="hv-term" ref={containerRef} />
      )}
    </div>
  );
}

function CreateForm({ providers, onCreated }) {
  const [provider, setProvider] = React.useState('');
  const [name, setName] = React.useState('');
  const [suggested, setSuggested] = React.useState('');
  const [taken, setTaken] = React.useState(false);
  const [cmd, setCmd] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [cmdTouched, setCmdTouched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const cmdTouchedRef = React.useRef(false);
  const reqSeqRef = React.useRef(0);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    cmdTouchedRef.current = cmdTouched;
  }, [cmdTouched]);

  // Unmount-only guard: a response that settles after unmount must not setState.
  React.useEffect(() => () => { mountedRef.current = false; }, []);

  const avail = (providers || []).filter((p) => p.available);
  const typed = name.trim();
  const effName = typed || suggested;

  // The default name lives in state here and never in the name input. Writing
  // it into the input as a value is what made all three sessions come out as
  // "tmux-session": once the field held that value it was never empty again, so
  // switching provider to screen or zellij kept it.
  React.useEffect(() => {
    if (!provider) {
      reqSeqRef.current += 1; // invalidate any in-flight default-command fetch
      setSuggested('');
      setTaken(false);
      setLoading(false);
      clearToast('create-command');
      if (!cmdTouchedRef.current) setCmd('');
      return undefined;
    }

    const wanted = (name || '').trim();
    const seq = ++reqSeqRef.current;
    let cancelled = false;
    // The name is part of the create command, so typing one re-derives it —
    // debounced, to keep it to one request per pause in typing.
    const timer = setTimeout(() => {
      setLoading(true);
      const url = px('/providers/' + encodeURIComponent(provider) + '/create-command')
        + (wanted ? '?name=' + encodeURIComponent(wanted) : '');
      apiGet(url)
        .then((res) => {
          if (cancelled || seq !== reqSeqRef.current || !mountedRef.current) return;
          // The create-command response carries name (the name that would be
          // used) and suggested (a free alternative) — when the typed name is
          // taken they differ. The "Use" button must propose the free one,
          // otherwise it just re-suggests the colliding name.
          setSuggested(pickNameToSuggest(res));
          setTaken(Boolean(res && res.taken));
          if (!cmdTouchedRef.current) setCmd((res && res.cmd ? res.cmd : []).join(' '));
          clearToast('create-command');
        })
        .catch((e) => {
          if (cancelled || seq !== reqSeqRef.current || !mountedRef.current) return;
          notify('Could not load the default command: ' + String(e), 'error', 'create-command');
          setSuggested('');
          // Clear rather than keep the previous provider's argv: leaving a
          // stale command in the box is how "Auto-filled from zellij" came to
          // sit above a tmux command, and submitting it used the wrong one.
          if (!cmdTouchedRef.current) setCmd('');
        })
        .finally(() => {
          if (!cancelled && seq === reqSeqRef.current && mountedRef.current) setLoading(false);
        });
    }, wanted ? 300 : 0);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [provider, name]);

  const pickProvider = (value) => {
    setProvider(value);
    // A name typed for the previous provider is not carried over: that is how
    // three sessions ended up sharing one name. The effect above re-derives the
    // default name and command for the new provider.
    setName('');
    setSuggested('');
    setTaken(false);
    setCmdTouched(false);
    cmdTouchedRef.current = false;
    setCmd('');
    clearToast('create-command');
    clearToast('create-session');
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    clearToast('create-session');
    try {
      const hasCmd = cmd && cmd.trim();
      const body = {};
      if (provider) {
        if (cmdTouched && hasCmd) {
          body.provider = provider;
          body.cmd = cmd.trim().split(/\s+/).filter(Boolean);
        } else {
          body.provider = provider;
        }
      } else if (hasCmd) {
        body.provider = 'custom';
        body.cmd = cmd.trim().split(/\s+/).filter(Boolean);
      } else {
        body.provider = 'custom';
        body.cmd = ['bash'];
      }
      // Sent only when the user typed one: with no name the server generates a
      // free one from the provider's live session list, so an untouched form
      // can never collide with what is already running.
      if (typed) body.name = typed;
      const res = await apiPost(px('/sessions'), body);
      onCreated && onCreated(res.session);
      notify('Attached: ' + ((res.session && res.session.name) || ''));
      // Reset so the next attach starts from a freshly generated name rather
      // than walking straight into "already exists" on the one just used.
      setName('');
      setCmd('');
      setCmdTouched(false);
      cmdTouchedRef.current = false;
      setTaken(false);
    } catch (err) {
      notify(String(err && err.message ? err.message : err), 'error', 'create-session');
    } finally {
      setBusy(false);
    }
  };

  const hint = provider
    ? 'Attach / New Session creates the ' + provider + ' session'
      + (effName ? ' "' + effName + '"' : '')
      + ' if it does not exist, then opens it. Editing the command switches to manual attach.'
    : 'Pick a provider to create a managed session, or type any command — e.g. tmux attach -t myagent, or bash.';

  return (
    <form className="hv-form" onSubmit={submit}>
      <div className="hv-form-row">
        <select className="hv-inp" value={provider} onChange={(e) => pickProvider(e.target.value)}>
          <option value="">Custom command</option>
          {avail.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <input
          className="hv-inp"
          placeholder={suggested ? 'auto: ' + suggested : 'session name (optional)'}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="hv-form-row">
        <input
          className="hv-inp hv-wide"
          placeholder="attach command e.g. tmux attach -t myagent — or bash"
          value={cmd}
          onChange={(e) => {
            const v = e.target.value;
            setCmd(v);
            if (!cmdTouched) {
              setCmdTouched(true);
              cmdTouchedRef.current = true;
            }
          }}
        />
        {loading && <span className="hv-empty sm">loading default command…</span>}
        <button type="button" className="hv-hint-icon" title={hint} aria-label={hint} tabIndex={0}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" />
            <line x1="8" y1="7" x2="8" y2="11" />
            <circle cx="8" cy="5" r="0.6" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>
      {taken && (
        <div className="hv-warn">
          A {provider} session called "{typed}" already exists.{' '}
          <button type="button" className="hv-link" onClick={() => setName(suggested)}>Use "{suggested}"</button>
        </div>
      )}
      <button className="hv-btn" type="submit" disabled={busy || loading}>
        {busy ? 'Attaching…' : loading ? 'Loading…' : 'Attach / New Session'}
      </button>
    </form>
  );
}

function App() {
  const [providers, setProviders] = React.useState([]);
  const [panes, setPanes] = React.useState(loadPanes);
  const [activeRef, setActiveRef] = React.useState(loadActive);
  const [ended, setEnded] = React.useState({});
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [discovered, setDiscovered] = React.useState([]);
  const [collapsed, setCollapsed] = React.useState(function () {
    try { return JSON.parse(localStorage.getItem('hv-collapsed-sections') || '{}'); }
    catch { return {}; }
  });

  const toggleSection = function (k) {
    setCollapsed(function (prev) {
      const next = Object.assign({}, prev, { [k]: !prev[k] });
      try { localStorage.setItem('hv-collapsed-sections', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const endedRef = React.useRef(ended);
  React.useEffect(() => { endedRef.current = ended; }, [ended]);

  const markEnded = React.useCallback((ref, value) => {
    setEnded((prev) => {
      if (value && prev[ref]) return prev;
      if (!value && !prev[ref]) return prev;
      const next = { ...prev };
      if (value) next[ref] = true; else delete next[ref];
      return next;
    });
  }, []);

  const refresh = React.useCallback(async () => {
    try {
      const r = await apiGet(px('/providers'));
      setProviders(r.providers || []);
      clearToast('providers');
      const alive = new Set([...(r.sessions || []), ...(r.known || [])].map((s) => s.ref));
      setPanes((prev) => {
        // Drop a pane only when the backend has genuinely forgotten the
        // session. Pruning against live sessions alone wiped every open pane
        // during the window after a backend restart, before restore() finished.
        const next = prev.filter((p) => alive.has(p.ref) || endedRef.current[p.ref]);
        return next.length === prev.length ? prev : next;
      });
    } catch (e) {
      // Dedupe-keyed so the 8s poll failing repeatedly shows one toast, and it
      // clears itself the next time the poll succeeds.
      notify('Could not load sessions — ' + String(e), 'error', 'providers');
    }
  }, []);

  React.useEffect(() => {
    refresh();
    // Poll only while the page is visible: a hidden dashboard tab was running
    // five session-list commands and five `which` probes every 8 seconds.
    const i = setInterval(() => { if (!document.hidden) refresh(); }, 8000);
    const onVisible = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(i);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  React.useEffect(() => { savePanes(panes); }, [panes]);
  React.useEffect(() => { saveActive(activeRef); }, [activeRef]);

  // The active session can be closed, pruned or killed out from under the view.
  React.useEffect(() => {
    if (activeRef && panes.some((p) => p.ref === activeRef)) return;
    setActiveRef(panes.length ? panes[panes.length - 1].ref : '');
  }, [panes, activeRef]);

  React.useEffect(() => {
    const groups = (providers || []).filter((p) => !selectedProvider || p.id === selectedProvider);
    const found = [];
    for (const g of groups) for (const s of (g.sessions || [])) found.push({ providerId: g.id, ...s });
    setDiscovered(found);
  }, [providers, selectedProvider]);

  const openPane = React.useCallback((session) => {
    if (!session || !session.ref) return;
    // One pane per mirror: two panes on the same ref means two xterms sending
    // input to a single PTY, so every keystroke would be written twice.
    setPanes((prev) => (prev.some((p) => p.ref === session.ref) ? prev : [...prev, session]));
    markEnded(session.ref, false);
    setActiveRef(session.ref);
  }, [markEnded]);

  const closePane = React.useCallback((ref) => {
    setPanes((prev) => prev.filter((p) => p.ref !== ref));
    markEnded(ref, false);
  }, [markEnded]);

  const openDiscovered = async (s) => {
    const providerId = s.providerId || s.provider;
    try {
      // Send the provider's own ref (a screen pid, say) instead of replaying
      // its command: the ref is what keeps two same-named screen sessions
      // apart, and the server resolves it against the live list.
      const res = await apiPost(px('/sessions'), { provider: providerId, ref: s.ref });
      openPane(res.session);
    } catch (e) {
      notify('Could not open ' + providerId + ':' + s.name + ' — ' + String(e), 'error');
      refresh();
    }
  };

  const restartPane = async (session) => {
    const isProvider = Boolean(session.providerId && session.providerId !== 'custom');
    try {
      const res = await apiPost(px('/sessions'), isProvider
        ? { provider: session.providerId, name: session.name }
        : { provider: 'custom', cmd: session.cmd, name: session.name });
      closePane(session.ref);
      openPane(res.session);
    } catch (e) {
      // The usual restart failure is that only our mirror died while the host
      // session is still there, so creating it again is refused. Attach to what
      // is already running instead of leaving the pane stuck on an error.
      if (isProvider) {
        try {
          const res = await apiPost(px('/sessions'), { provider: session.providerId, ref: session.key || session.name });
          closePane(session.ref);
          openPane(res.session);
          return;
        } catch {}
      }
      notify('Could not restart ' + session.name + ' — ' + String(e), 'error');
    }
  };

  const killDiscoveredSession = async (session) => {
    const ok = window.confirm(
      'Kill the ' + session.providerId + ' session "' + session.name + '"?\n\n'
      + 'This terminates it on the host and cannot be undone.'
    );
    if (!ok) return;
    const ref = session.providerId + ':' + (session.ref || session.name);
    try {
      const res = await apiDelete(px('/sessions/' + encodeURIComponent(ref)) + '?kill=1');
      notify(res.killed
        ? 'Killed ' + session.providerId + ':' + session.name
        : 'Could not kill ' + session.providerId + ':' + session.name + '. ' + (res.reason || ''), res.killed ? 'info' : 'error');
    } catch (e) {
      notify('Kill failed — ' + String(e), 'error');
    }
    refresh();
  };

  const killSession = async (session) => {
    const ok = window.confirm(
      'Kill the ' + session.providerId + ' session "' + session.name + '"?\n\n'
      + 'This terminates it on the host and cannot be undone. To leave it running, use ✕ instead.'
    );
    if (!ok) return;
    try {
      const res = await apiDelete(px('/sessions/' + encodeURIComponent(session.ref)) + '?kill=1');
      if (res.killed) {
        notify('Killed ' + session.providerId + ':' + session.name);
      } else {
        notify('Closed the view. ' + (res.reason || 'The host session could not be killed.'), 'error');
      }
    } catch (e) {
      notify('Kill failed — ' + String(e), 'error');
    }
    closePane(session.ref);
    refresh();
  };

  const killableFor = (providerId) => {
    const p = (providers || []).find((x) => x.id === providerId);
    return Boolean(p && p.killable);
  };

  const openRefs = new Set(panes.map((p) => p.ref));
  const active = panes.find((p) => p.ref === activeRef) || null;

  return (
    <div className="hv-root">
      <ToastHost />
      <div className="hv-sidebar">
        <div className="hv-brand">Herdr Views</div>
        <div className={'hv-section-title' + (collapsed.providers ? ' hv-collapsed' : '')} onClick={function () { toggleSection('providers'); }}>
          <svg className="hv-chevron" viewBox="0 0 24 24" width="14" height="14"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Providers
        </div>
        {!collapsed.providers ? <div className="hv-prov-list">
          <div className={'hv-prov' + (selectedProvider === '' ? ' hv-active' : '')} onClick={() => setSelectedProvider('')}>
            <svg className="hv-prov-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <line x1="9" y1="8" x2="9" y2="16" />
              <line x1="15" y1="8" x2="15" y2="16" />
              <line x1="12" y1="10.5" x2="12" y2="13.5" />
            </svg>
            <span>All</span>
          </div>
          {providers.map((p) => (
            <div
              key={p.id}
              className={'hv-prov' + (selectedProvider === p.id ? ' hv-active' : '') + (p.available ? '' : ' hv-prov-na')}
              onClick={() => setSelectedProvider(p.id)}
              title={p.available ? 'Show only ' + p.label + ' sessions' : p.label + ' is not installed'}
            >
              <ProviderIcon id={p.id} className="hv-prov-ico" />
              <span>{p.id}</span>
              {p.available ? '' : <span className="hv-na">n/a</span>}
            </div>
          ))}
        </div> : null}

        <div className={'hv-section-title' + (collapsed['open'] ? ' hv-collapsed' : '')} onClick={function () { toggleSection('open'); }}>
          <svg className="hv-chevron" viewBox="0 0 24 24" width="14" height="14"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Open Sessions
          {panes.length > 0 && <span className="hv-count">{panes.length}</span>}
        </div>
        {!collapsed['open'] ? <div className="hv-pset">
          {panes.length === 0
            ? <div className="hv-empty sm">Nothing open — pick a session below.</div>
            : panes.map((p) => (
              <div
                key={p.ref}
                className={'hv-sess' + (p.ref === activeRef ? ' hv-active' : '') + (ended[p.ref] ? ' hv-sess-ended' : '')}
                onClick={() => setActiveRef(p.ref)}
                title={cmdText(p.cmd)}
              >
                <ProviderIcon id={p.providerId} className="hv-sess-ico" />
                <span className="hv-sess-name">{p.name}</span>
                <span className="hv-sess-prov">{p.providerId}</span>
                {/* ✕ = detach (view close, host session survives) */}
                <button
                  className="hv-x"
                  aria-label="Detach from session"
                  title="Detach — close this view, session keeps running on the host"
                  onClick={(e) => { e.stopPropagation(); closePane(p.ref); }}
                >
                  ✕
                </button>
              </div>
            ))}
        </div> : null}

        <div className={'hv-section-title' + (collapsed['discovered'] ? ' hv-collapsed' : '')} onClick={function () { toggleSection('discovered'); }}>
          <svg className="hv-chevron" viewBox="0 0 24 24" width="14" height="14"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Discovered Sessions
          {selectedProvider && <span className="hv-count">{discovered.length}</span>}
        </div>
        {!collapsed['discovered'] ? <div className="hv-disc">
          {discovered.length === 0
            ? <div className="hv-empty sm">No sessions discovered</div>
            : discovered.map((s) => {
              const ref = (s.providerId || s.provider) + ':' + (s.ref || s.name);
              const isOpen = openRefs.has(ref);
              return (
                <div
                  key={ref}
                  className={'hv-disc-item' + (isOpen ? ' hv-disc-open' : '')}
                  onClick={() => openDiscovered(s)}
                  title={isOpen ? 'Already open — click to focus' : 'Open ' + s.name}
                >
                  <span className="hv-disc-dot" />
                  <span className="hv-disc-name">{s.name}</span>
                  <span className="hv-disc-prov"><ProviderIcon id={s.providerId} className="hv-disc-ico" />{s.providerId}</span>
                  {killableFor(s.providerId) && (
                    <button
                      className="hv-kill"
                      onClick={(e) => { e.stopPropagation(); killDiscoveredSession(s); }}
                      title={'Force-stop this ' + s.providerId + ' session on the host — cannot be undone'}
                    >
                      Kill
                    </button>
                  )}
                </div>
              );
            })}
        </div> : null}
      </div>

      <div className="hv-main">
        <CreateForm providers={providers} onCreated={openPane} />
        <div className="hv-panes">
          {active ? (
            <TerminalPane
              key={active.ref}
              session={active}
              ended={Boolean(ended[active.ref])}
              killable={killableFor(active.providerId)}
              onExit={(ref) => { markEnded(ref, true); refresh(); }}
              onClose={() => closePane(active.ref)}
              onKill={() => killSession(active)}
              onRestart={() => restartPane(active)}
            />
          ) : (
            <div className="hv-welcome">
              Nothing open yet. Create a session above, or pick one from Discovered Sessions on the left.
              Sessions are real tmux/screen/zellij processes — closing a view leaves them running on the host.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function mount(el) {
  injectCss();
  const root = createRoot(el);
  root.render(<App />);
  return () => root.unmount();
}

injectCss();
export default App;
export { mount };
