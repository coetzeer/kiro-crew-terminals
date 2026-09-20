import React from 'react';
import { createRoot } from 'react-dom/client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import xtermCss from 'xterm/css/xterm.css?inline';
import appCss from './index.css?inline';

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
const px = (p) => PROXY_BASE + p;

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

async function apiGet(path) {
  const r = await fetch(path, { credentials: 'same-origin' });
  if (!r.ok) throw new Error('GET ' + path + ' -> ' + r.status);
  return r.json();
}

async function apiPost(path, body) {
  const r = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!r.ok) throw new Error('POST ' + path + ' -> ' + r.status);
  return r.json();
}

function notify(text, type) {
  try {
    // best-effort host toast; ignore failures when running without the host SDK
    if (window.parent && typeof window.parent.postMessage === 'function' && window.parent !== window) {
      window.parent.postMessage({ source: 'kiro-herdr-views', type: 'notify', text, severity: type === 'error' ? 'error' : 'info' }, '*');
    }
  } catch {}
  console.log('[herdr-views]', text);
}

function TerminalPane({ session, onClose }) {
  const containerRef = React.useRef(null);
  const modeRef = React.useRef('ws');
  const wsRef = React.useRef(null);
  const sseRef = React.useRef(null);

  React.useEffect(() => {
    let disposed = false;
    const term = new Terminal({
      convertEol: true,
      fontSize: 13,
      fontFamily: 'Menlo, Consolas, "DejaVu Sans Mono", monospace',
      cursorBlink: true,
      theme: { background: '#0f1117', foreground: '#d7dae0' },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    try { fit.fit(); } catch {}

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

    const onWin = () => { try { fit.fit(); sendResize(); } catch {} };
    window.addEventListener('resize', onWin);

    term.onData((data) => {
      if (wsRef.current && wsRef.current.readyState === 1) {
        wsRef.current.send(JSON.stringify({ type: 'input', data }));
      } else {
        apiPost(px('/input'), { ref: session.ref, data }).catch(() => {});
      }
    });

    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      if (wsRef.current) { try { wsRef.current.close(); } catch {} }
      if (sseRef.current) { try { sseRef.current.close(); } catch {} }
      window.removeEventListener('resize', onWin);
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
          if (msg.type === 'exit') cleanup();
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
      ws.onopen = () => { onWin(); };
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'chunk') term.write(msg.data);
          if (msg.type === 'error') { if (!disposed) useSse(); }
          if (msg.type === 'exit') cleanup();
        } catch {}
      };
      ws.onerror = () => { if (!disposed) useSse(); };
      ws.onclose = () => { if (!disposed) useSse(); };
    } else {
      useSse();
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.ref]);

  return (
    <div className="hv-pane">
      <div className="hv-pane-top">
        <span className="hv-pane-title">{session.providerId}:{session.name} — {(session.cmd || []).join(' ')}</span>
        <button className="hv-close" onClick={onClose}>Detach</button>
      </div>
      <div className="hv-term" ref={containerRef} />
    </div>
  );
}

function CreateForm({ providers, onCreated }) {
  const [provider, setProvider] = React.useState('');
  const [name, setName] = React.useState('');
  const [cmd, setCmd] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const avail = (providers || []).filter((p) => p.available);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = {};
      if (cmd && cmd.trim()) {
        body.cmd = cmd.trim().split(/\s+/).filter(Boolean);
        body.provider = provider || 'custom';
      } else if (provider) {
        body.provider = provider;
        body.ref = name || provider + '-session';
        if (name) body.name = name;
      } else {
        body.cmd = ['bash'];
        body.provider = 'custom';
      }
      if (name && !body.name) body.name = name;
      const res = await apiPost(px('/sessions'), body);
      onCreated && onCreated(res.session);
      notify('Session attached: ' + (res.session.name || ''));
    } catch (err) {
      notify('Failed to attach: ' + String(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="hv-form" onSubmit={submit}>
      <div className="hv-form-row">
        <select className="hv-inp" value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="">Custom command</option>
          {avail.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <input className="hv-inp" placeholder="session name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="hv-form-row">
        <input className="hv-inp hv-wide" placeholder="attach command e.g. tmux attach -t myagent — or bash" value={cmd} onChange={(e) => setCmd(e.target.value)} />
      </div>
      <button className="hv-btn" type="submit" disabled={busy}>{busy ? 'Attaching…' : 'Attach / New Session'}</button>
    </form>
  );
}

function App() {
  const [providers, setProviders] = React.useState([]);
  const [live, setLive] = React.useState([]);
  const [panes, setPanes] = React.useState(loadPanes);
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [discovered, setDiscovered] = React.useState([]);
  const [err, setErr] = React.useState('');

  React.useEffect(() => {
    savePanes(panes);
  }, [panes]);

  const refresh = React.useCallback(async () => {
    try {
      const r = await apiGet(px('/providers'));
      setProviders(r.providers || []);
      setLive(r.sessions || []);
      setErr('');
      const sessions = r.sessions || [];
      setPanes((prev) => {
        const open = prev.filter((p) => sessions.some((s) => s.ref === p.ref));
        const closed = prev.filter((p) => !sessions.some((s) => s.ref === p.ref));
        if (closed.length) return open;
        return prev;
      });
    } catch (e) { setErr(String(e)); }
  }, []);

  React.useEffect(() => {
    refresh();
    const i = setInterval(() => { refresh(); }, 8000);
    return () => clearInterval(i);
  }, [refresh]);

  React.useEffect(() => {
    const groups = (providers || []).filter((p) => !selectedProvider || p.id === selectedProvider);
    const found = [];
    for (const g of groups) for (const s of (g.sessions || [])) found.push({ providerId: g.id, ...s });
    setDiscovered(found);
  }, [providers, selectedProvider]);

  const openSession = async (s) => {
    try {
      const body = s.cmd
        ? { provider: s.providerId || s.provider, name: s.name, cmd: s.cmd }
        : { provider: s.providerId || s.provider, ref: s.ref };
      const r = await apiPost(px('/sessions'), body);
      const created = r.session;
      setPanes((p) => [...p, created]);
      setLive((prev) => prev.some((x) => x.ref === created.ref) ? prev : [...prev, created]);
    } catch (e) {
      notify('Failed to open: ' + String(e), 'error');
    }
  };

  const closePane = (ref) => setPanes((p) => p.filter((x) => x.ref !== ref));

  return (
    <div className="hv-root">
      <div className="hv-sidebar">
        <div className="hv-brand">Herdr Views</div>
        {err && <div className="hv-err">{err}</div>}
        <div className="hv-section-title">Providers</div>
        <div className="hv-prov-list">
          <div className={'hv-prov' + (selectedProvider === '' ? ' hv-active' : '')} onClick={() => setSelectedProvider('')}>All</div>
          {providers.map((p) => (
            <div key={p.id} className={'hv-prov' + (selectedProvider === p.id ? ' hv-active' : '')} onClick={() => setSelectedProvider(p.id)}>
              {p.id} {p.available ? '' : <span className="hv-na">(n/a)</span>}
            </div>
          ))}
        </div>
        <div className="hv-section-title">Discovered Sessions</div>
        <div className="hv-disc">
          {discovered.length === 0
            ? <div className="hv-empty sm">No sessions discovered</div>
            : discovered.map((s) => (
                <div key={s.providerId + ':' + s.ref} className="hv-disc-item" onClick={() => openSession(s)}>
                  <span className="hv-disc-dot" />
                  <span className="hv-disc-name">{s.name}</span>
                  <span className="hv-disc-prov">{s.providerId}</span>
                </div>
              ))}
        </div>
      </div>
      <div className="hv-main">
        <CreateForm providers={providers} onCreated={(s) => setPanes((p) => [...p, s])} />
        <div className="hv-panes">
          {panes.length === 0
            ? <div className="hv-welcome">Attach to a session to start viewing. Sessions are real tmux/screen/zellij/herdr/aoe processes — detaching here leaves them running on the host.</div>
            : panes.map((s) => <TerminalPane key={s.ref} session={s} onClose={() => closePane(s.ref)} />)}
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

export { mount };