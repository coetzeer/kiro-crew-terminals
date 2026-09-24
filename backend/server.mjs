#!/usr/bin/env node
import http from 'node:http';
import { WebSocketServer } from 'ws';
import express from 'express';
import { SessionManager } from './lib/session-manager.mjs';
import { ProviderRegistry } from './lib/registry.mjs';
import { TmuxProvider } from './providers/tmux.mjs';
import { ScreenProvider } from './providers/screen.mjs';
import { ZellijProvider } from './providers/zellij.mjs';
import { HerdrProvider } from './providers/herdr.mjs';
import { AoeProvider } from './providers/aoe.mjs';
import { verifyProxyRequest } from './lib/proxy-verify.mjs';

const APP_NAME = 'kiro-herdr-views';
// The gateway reverse-proxies /apps/{name}/api/{path} → backend /api/{path}
// (routes.py handle_app_api_proxy).  The backend's route prefix must match
// what the proxy forwards, so use /api here.
const BASE = '/api';
const DEFAULT_PORT = Number(process.env.KIRO_HERRD_PORT || 8787);

function p(path) {
  if (path === '/') return BASE;
  return BASE + path;
}

// Provider-native identity for a hand-written attach command, so a manual
// `tmux attach -t work` maps onto the same mirror as the discovered "work"
// session instead of opening a second view of it. Only flags that name a
// session are considered; anything else falls through to the caller's default.
function keyFromCmd(cmd) {
  if (!Array.isArray(cmd)) return '';
  const named = ['-t', '-S', '-s', '-r'];
  for (let i = 0; i < cmd.length - 1; i++) {
    if (named.includes(cmd[i]) && cmd[i + 1] && !cmd[i + 1].startsWith('-')) return cmd[i + 1];
  }
  const verb = cmd.findIndex((a) => a === 'attach');
  if (verb >= 0 && cmd[verb + 1] && !cmd[verb + 1].startsWith('-')) return cmd[verb + 1];
  return '';
}

function nextFreeName(id, taken) {
  for (let i = 1; i <= 99; i++) {
    const candidate = id + '-' + String(i).padStart(2, '0');
    if (!taken.has(candidate)) return candidate;
  }
  return id + '-' + Math.random().toString(36).slice(2, 6);
}

// Custom shells have no host-side namespace to check, so the only names that
// matter are the ones this backend already has mirrors for.
function nextFreeCustomName(taken) {
  return nextFreeName('custom', taken);
}

// Pick a session name that does not collide with a live one. Names are checked
// against the provider's own list(), which is the same set the UI shows, so a
// generated name can never land on top of an existing session — that collision
// is what made every "new" session come out as tmux-session.
async function freeName(prov, wanted) {
  const sessions = await prov.list().catch(() => []);
  const taken = new Set((sessions || []).map((s) => s && s.name).filter(Boolean));
  return {
    name: wanted || nextFreeName(prov.id, taken),
    taken: Boolean(wanted) && taken.has(wanted),
    suggested: nextFreeName(prov.id, taken),
  };
}

export function createServer(opts) {
  const app = express();
  const server = http.createServer(app);
  const sessionManager = new SessionManager();
  const allowUnsigned = (process.env.KIRO_HERRD_ALLOW_UNSIGNED === '1');

  const registry = new ProviderRegistry();
  registry.register(new TmuxProvider());
  registry.register(new ScreenProvider());
  registry.register(new ZellijProvider());
  registry.register(new HerdrProvider());
  registry.register(new AoeProvider());

  // Keep the raw bytes alongside the parsed body: the gateway's proxy HMAC is
  // computed over sha256(body) as sent, so verification must hash the original
  // bytes, not a re-serialization of the parsed object.
  app.use(express.json({
    verify: function (req, res, buf) { req.rawBody = buf; },
  }));

  function guard(req, res, next) {
    if (allowUnsigned) return next();
    if (verifyProxyRequest(req, APP_NAME)) return next();
    res.status(403).json({ error: 'forbidden' });
  }

  app.get('/health', function (req, res) {
    res.json({ ok: true, name: APP_NAME });
  });
  app.get(p('/health'), function (req, res) {
    res.json({ ok: true, name: APP_NAME });
  });

  app.get(p('/providers'), guard, function (req, res) {
    registry.listAll().then(function (groups) {
      // `known` rides along so the UI can tell "the backend has forgotten this
      // session" from "the backend has not finished restoring it yet" without a
      // second round trip — it was pruning panes on the latter.
      res.json({ providers: groups, sessions: sessionManager.list(), known: sessionManager.knownList() });
    }, function (err) {
      res.status(500).json({ error: String(err) });
    });
  });

  app.get(p('/sessions'), guard, function (req, res) {
    res.json({ sessions: sessionManager.list() });
  });

  app.get(p('/known'), guard, function (req, res) {
    res.json({ sessions: sessionManager.knownList() });
  });

  // `name` is optional now: without it the server proposes a free one, so the
  // UI never has to invent a default (the old client-side `provider + '-session'`
  // default is what produced three sessions all called tmux-session).
  app.get(p('/providers/:id/create-command'), guard, function (req, res) {
    const prov = registry.get(req.params.id);
    if (!prov) {
      return res.status(404).json({ error: 'provider not found' });
    }
    const wanted = (req.query.name || '').trim();
    freeName(prov, wanted).then(function (picked) {
      res.json({ name: picked.name, cmd: prov.createCommand(picked.name), taken: picked.taken, suggested: picked.suggested });
    }, function (err) {
      res.status(500).json({ error: String(err) });
    });
  });

  app.post(p('/sessions'), guard, async function (req, res) {
    const body = req.body || {};
    const providerVal = body.provider;
    const ref = body.ref;
    const name = body.name && String(body.name).trim();
    const cmd = body.cmd;
    const cwd = body.cwd;

    try {
      // Attach to a session the provider already knows about. The UI sends the
      // provider's own ref for this (a screen pid, for instance) because the
      // name is not enough to identify a screen session.
      if (providerVal && ref && !cmd) {
        const prov = registry.get(providerVal);
        if (!prov) return res.status(404).json({ error: 'provider not found' });
        const sessions = await prov.list().catch(() => []);
        const found = (sessions || []).find(function (s) {
          return s.ref === ref || s.name === ref;
        });
        if (!found || !found.cmd) {
          return res.status(404).json({ error: 'no such ' + providerVal + ' session: ' + ref });
        }
        return res.json({
          session: sessionManager.createSession({
            providerId: providerVal,
            name: found.name || ref,
            key: found.ref || found.name,
            cmd: found.cmd,
            cwd: cwd,
          }),
        });
      }

      // Create a provider session, attaching to it. Without a name the server
      // picks a free one, so "attach / new session" with an untouched form can
      // never collide with what is already running.
      if (providerVal && !cmd) {
        const prov = registry.get(providerVal);
        if (!prov) return res.status(404).json({ error: 'provider not found' });
        const picked = await freeName(prov, name);
        if (name && picked.taken) {
          return res.status(409).json({
            error: 'a ' + prov.id + ' session named "' + name + '" already exists',
            suggested: picked.suggested,
          });
        }
        const created = await prov.create(picked.name);
        if (!created || !created.cmd || created.cmd.length === 0) {
          return res.status(500).json({ error: 'provider returned no attach command for "' + picked.name + '"' });
        }
        return res.json({
          session: sessionManager.createSession({
            providerId: providerVal,
            name: created.name || picked.name,
            key: created.ref || created.name || picked.name,
            cmd: created.cmd,
            cwd: cwd,
          }),
        });
      }

      // A hand-written command: a custom shell, or an explicit attach. Derive
      // the identity from the command where it names one.
      if (!cmd || cmd.length === 0) {
        return res.status(400).json({ error: 'cmd required' });
      }
      const derived = keyFromCmd(cmd);
      let finalName = name || derived;
      let finalKey = derived || name;
      if (!finalName) {
        // Nothing in the command names a session (plain `bash`, say). Give it a
        // free generated name rather than the shared fallback: mirrors are
        // deduped by ref, so two "bash" attaches would otherwise collapse into
        // one shell, which is not what a second attach asks for.
        finalName = nextFreeCustomName(new Set(sessionManager.list().map((s) => s.name)));
        finalKey = finalName;
      }
      return res.json({
        session: sessionManager.createSession({
          providerId: providerVal || 'custom',
          name: finalName,
          key: finalKey || undefined,
          cmd: cmd,
          cwd: cwd,
        }),
      });
    } catch (err) {
      const message = String((err && err.message) || err);
      res.status(500).json({ error: message });
    }
  });

  // Drop a session. Always detaches this app's mirror; `?kill=1` additionally
  // terminates the underlying host session, and only for providers that declare
  // canKill(). Destructive-by-request, so the UI confirms before sending it.
  app.delete(p('/sessions/:ref'), guard, function (req, res) {
    const ref = req.params.ref;
    const session = sessionManager.get(ref);
    const wantKill = req.query.kill === '1';
    if (!session) {
      // A host session can be discovered before the dashboard has created a
      // mirror for it. Killing must use its provider-native identity instead
      // of requiring an otherwise unnecessary attach first.
      const separator = ref.indexOf(':');
      const providerId = separator > 0 ? ref.slice(0, separator) : '';
      const nativeRef = separator > 0 ? ref.slice(separator + 1) : '';
      const prov = registry.get(providerId);
      if (wantKill && prov && prov.canKill() && nativeRef) {
        return Promise.resolve(prov.list()).then(function (sessions) {
          const found = (sessions || []).find(function (item) {
            return item.ref === nativeRef || item.name === nativeRef;
          });
          if (!found) return res.status(404).json({ error: 'no such ' + providerId + ' session: ' + nativeRef });
          return Promise.resolve(prov.kill({ key: found.ref || nativeRef, name: found.name || nativeRef })).then(function (result) {
            res.json({ ok: true, killed: Boolean(result && result.ok), reason: (result && result.reason) || '' });
          }, function (err) {
            res.json({ ok: true, killed: false, reason: String(err) });
          });
        }, function () {
          res.status(404).json({ error: 'no such ' + providerId + ' session: ' + nativeRef });
        });
      }
      return res.status(404).json({ error: 'no such session: ' + ref });
    }
    if (!wantKill) {
      sessionManager.close(ref);
      return res.json({ ok: true, killed: false });
    }
    const prov = registry.get(session.providerId);
    if (!prov || !prov.canKill()) {
      sessionManager.close(ref);
      return res.json({
        ok: true,
        killed: false,
        reason: prov ? prov.id + ' sessions can only be stopped from ' + prov.id + ' itself' : 'unknown provider',
      });
    }
    Promise.resolve(prov.kill({ key: session.key, name: session.name })).then(function (result) {
      // The mirror's own attach process exits once the host session is gone;
      // closing it here also covers the case where the kill only half worked.
      sessionManager.close(ref);
      res.json({
        ok: true,
        killed: Boolean(result && result.ok),
        reason: (result && result.reason) || '',
      });
    }, function (err) {
      sessionManager.close(ref);
      res.json({ ok: true, killed: false, reason: String(err) });
    });
  });

	 app.post(p('/input'), guard, function (req, res) {
    const body = req.body || {};
    const ref = body.ref;
    const data = body.data;
    if (!ref || typeof data !== 'string') {
      res.status(400).json({ error: 'ref and data required' });
      return;
    }
    const ok = sessionManager.write(ref, data);
    res.json({ ok: ok });
  });

	 app.post(p('/resize'), guard, function (req, res) {
    const body = req.body || {};
    const ref = body.ref;
    const cols = body.cols;
    const rows = body.rows;
    if (!ref) {
      res.status(400).json({ error: 'ref required' });
      return;
    }
    const ok = sessionManager.write(ref, null, { resize: true, cols: cols, rows: rows });
    res.json({ ok: ok });
  });

	 app.get(p('/sse'), guard, function (req, res) {
    const ref = req.query.ref;
    const session = sessionManager.get(ref);
    if (!ref || !session) {
      res.status(404).json({ error: 'no such session' });
      return;
    }
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
    if (res.socket && res.socket.setTimeout) res.socket.setTimeout(0);

    function send(data) {
      const payload = JSON.stringify({ type: 'chunk', data: data });
      res.write('data: ' + payload + '\n\n');
    }
    const sub = [send];
    session.viewers.add(sub);
    for (const chunk of session.buffer) {
      send(chunk);
    }
    function onExit() {
      res.end();
    }
    sessionManager.once('exit', onExit);
    const ping = setInterval(function () {
      res.write(': ping\n\n');
    }, 15000);
    req.on('close', function () {
      clearInterval(ping);
      const cur = sessionManager.get(ref);
      if (cur) cur.viewers.delete(sub);
      sessionManager.off('exit', onExit);
    });
  });

	const wss = new WebSocketServer({ noServer: true });
 const clients = new Map();

  server.on('upgrade', function (req, socket, head) {
    const url = new URL(req.url || '', 'http://localhost');
    const wsPath = p('/ws');
    if (!url.pathname.startsWith(wsPath)) {
      socket.destroy();
      return;
    }
    if (!allowUnsigned) {
      if (!verifyProxyRequest(req, APP_NAME)) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }
    }
    wss.handleUpgrade(req, socket, head, function (ws) {
      const ref = url.searchParams.get('ref');
      const session = sessionManager.get(ref);
      if (!ref || !session) {
        ws.send(JSON.stringify({ type: 'error', message: 'no such session' }));
        ws.close();
        return;
      }
      let subs = clients.get(session);
      if (!subs) {
        subs = new Set();
        clients.set(session, subs);
      }
      subs.add(ws);

      for (const chunk of session.buffer) {
        ws.send(JSON.stringify({ type: 'chunk', data: chunk }));
      }

      function onData(data) {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'chunk', data: data }));
        }
      }
      const viewer = [onData];
      session.viewers.add(viewer);

      function onExit() {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'exit' }));
        }
        ws.close();
      }
      sessionManager.once('exit', onExit);

      ws.on('message', function (raw) {
        let msg = null;
        try {
          msg = JSON.parse(raw.toString());
        } catch (e) {
          return;
        }
        if (!msg) return;
        if ((msg.type === 'input') && (typeof msg.data === 'string')) {
          sessionManager.write(ref, msg.data);
        } else if (msg.type === 'resize') {
          const cols = msg.cols;
          const rows = msg.rows;
          sessionManager.write(ref, null, { resize: true, cols: cols, rows: rows });
        }
      });

      ws.on('close', function () {
        session.viewers.delete(viewer);
        sessionManager.off('exit', onExit);
        subs.delete(ws);
        if (subs.size === 0) clients.delete(session);
      });
    });
  });

  return { app: app, server: server, sessionManager: sessionManager, registry: registry, wss: wss };
}

async function main() {
  const created = createServer({});
  const server = created.server;
  const sessionManager = created.sessionManager;
  const registry = created.registry;
  const port = Number(process.env.PORT || process.env.APP_PORT || process.env.KIRO_HERRD_PORT || 8787);

  // Re-attach persisted sessions after a restart. For multiplexer providers the
  // session id can change across restarts, so ask the provider to re-resolve a
  // fresh attach command against the live host state first.
  const resolveCmd = async (known) => {
    const prov = registry.get(known.providerId);
    if (!prov) return null;
    const groups = await prov.list().catch(() => []);
    const found = (groups || []).find(
      (s) => s.name === known.name || s.ref === known.ref || s.ref === known.name
    );
    // Hand back the fresh identity too: a screen session's key is its pid, which
    // the persisted record cannot be trusted to still have.
    return found && found.cmd ? { cmd: found.cmd, key: found.ref || found.name } : null;
  };
  await sessionManager.restore({ resolveCmd }).catch((err) => {
    console.warn('[herdr-views] restore incomplete:', err);
  });

  await new Promise(function (resolve, reject) {
    const onError = function (err) {
      if (err.code === 'EADDRINUSE') reject(err);
      else reject(err);
    };
    server.once('error', onError);
    server.listen(port, '127.0.0.1', function () {
      server.removeListener('error', onError);
      resolve();
    });
  });

  const addr = server.address();
  console.log('[herdr-views] listening on 127.0.0.1:' + addr.port + ' (proxy base ' + BASE + ', restored ' + sessionManager.sessions.size + ' session(s))');
}

// Run when executed directly (gateway spawn, `node server.mjs`, `make dev`) —
// this is the standard ESM main-module check, so the gateway's subprocess spawn
// (which does not set KIRO_HERRD_MAIN) still boots the listener. Keep the
// createServer export usable by importers (tests, embedding).
import { pathToFileURL } from 'node:url';

const isMain = process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch(function (err) {
    console.error(err);
    process.exit(1);
  });
}