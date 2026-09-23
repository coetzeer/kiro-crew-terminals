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
const BASE = '/api/apps/' + APP_NAME;
const DEFAULT_PORT = Number(process.env.KIRO_HERRD_PORT || 8787);

function p(path) {
  if (path === '/') return BASE;
  return BASE + path;
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

  app.use(express.json());

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
      res.json({ providers: groups, sessions: sessionManager.list() });
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

  app.get(p('/providers/:id/create-command'), guard, function (req, res) {
    const provId = req.params.id;
    const name = req.query.name;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name required' });
    }
    const prov = registry.get(provId);
    if (!prov) {
      return res.status(404).json({ error: 'provider not found' });
    }
    try {
      const cmd = prov.createCommand(name.trim());
      res.json({ cmd: cmd });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

	 app.post(p('/sessions'), guard, function (req, res) {
    const body = req.body || {};
    const providerVal = body.provider;
    const ref = body.ref;
    const name = body.name;
    const cmd = body.cmd;
    const cwd = body.cwd;

    if (providerVal && ref && !cmd) {
      const prov = registry.get(providerVal);
      if (prov) {
        prov.list().then(function (sessions) {
          const found = sessions.find(function (s) {
            return (s.ref === ref) || (s.name === ref);
          });
          if (found && found.cmd) {
            const created = sessionManager.createSession({
              providerId: providerVal,
              name: found.name || ref,
              cmd: found.cmd,
              cwd: cwd,
            });
            return res.json({ session: created });
          }
          if (!cmd) {
            return res.status(400).json({ error: 'no attach command available for that session' });
          }
        }, function (err) {
          res.status(500).json({ error: String(err) });
        });
        return;
      }
    }

    if (providerVal && name && !ref && !cmd) {
      const prov = registry.get(providerVal);
      if (prov) {
        prov.create(name).then(function (created) {
          if (!created || !created.cmd || created.cmd.length === 0) {
            return res.status(400).json({ error: 'no attach command returned for that session' });
          }
          const session = sessionManager.createSession({
            providerId: providerVal,
            name: created.name || name,
            cmd: created.cmd,
            cwd: cwd,
          });
          res.json({ session: session });
        }, function (err) {
          res.status(500).json({ error: String(err) });
        });
        return;
      }
    }

    if (!cmd || cmd.length === 0) {
      res.status(400).json({ error: 'cmd required' });
      return;
    }

    try {
      const created = sessionManager.createSession({
        providerId: providerVal || 'custom',
        name: name || ref || 'session',
        cmd: cmd,
        cwd: cwd,
      });
      res.json({ session: created });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
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
    const ok = sessionManager.write(ref, null, { cols: cols, rows: rows });
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
          sessionManager.write(ref, null, { cols: cols, rows: rows });
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
    return found && found.cmd ? found.cmd : null;
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