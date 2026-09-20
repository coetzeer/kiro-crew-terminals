import * as pty from 'node-pty';
import { EventEmitter } from 'node:events';
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { appDataDir } from './paths.mjs';

const MAX_BUFFER = 400;

// A SessionMirror is one live PTY that runs an attach command to a real,
// long-lived session (tmux attach / screen -r / zellij attach / herdr repl...).
// Multiple web viewers can subscribe; the PTY itself stays alive as long as
// the backend runs, so sessions survive across page reloads and agent restarts.
//
// Persistence: the set of known sessions is written to a JSON file in the
// app data dir. On backend (re)start the known sessions are re-attached, so
// sessions also survive Kiro Crew restarts (as long as the underlying host
// session still exists — tmux / screen / herdr / aoe are host processes).
export class SessionManager extends EventEmitter {
  constructor() {
    super();
    this.sessions = new Map(); // ref -> SessionMirror
    this.dir = null;
    this.stateFile = null;
    this.known = []; // array of { ref, providerId, name, cmd, cwd }
  }

  ensureDir() {
    if (!this.dir) {
      this.dir = appDataDir('kiro-herdr-views');
      this.stateFile = path.join(this.dir, 'known-sessions.json');
    }
    return this.dir;
  }

  persist() {
    try {
      this.ensureDir();
      const tmp = this.stateFile + '.tmp';
      writeFileSync(tmp, JSON.stringify(this.known, null, 2), 'utf8');
      renameSync(tmp, this.stateFile);
    } catch {
      /* non-fatal: best-effort persistence */
    }
  }

  loadKnown() {
    try {
      this.ensureDir();
      if (!existsSync(this.stateFile)) return [];
      const data = JSON.parse(readFileSync(this.stateFile, 'utf8'));
      if (!Array.isArray(data)) return [];
      const valid = data.filter((k) => k && Array.isArray(k.cmd) && k.cmd.length);
      this.known = valid.map((k) => ({ ...k, cmd: Array.isArray(k.cmd) ? k.cmd : [] }));
      return this.known;
    } catch {
      this.known = [];
      return this.known;
    }
  }

  describe(descriptor) {
    return {
      ref: descriptor.ref,
      providerId: descriptor.providerId,
      name: descriptor.name,
      cmd: descriptor.cmd,
      cwd: descriptor.cwd,
    };
  }

  has(ref) {
    return this.sessions.has(ref);
  }

  list() {
    return [...this.sessions.values()].map((s) => s.describe());
  }

  knownList() {
    return this.known.map((k) => this.describe(k));
  }

  get(ref) {
    return this.sessions.get(ref);
  }

  buildMirror({ providerId, name, cmd, cwd }) {
    const ref = `${providerId}:${name}`;
    if (this.sessions.has(ref)) {
      return this.sessions.get(ref);
    }
    this.ensureDir();
    const shell = cmd[0];
    const args = cmd.slice(1);
    const env = { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' };
    const cwdResolved = cwd || this.dir;

    const p = pty.spawn(shell, args, {
      name: 'xterm-256color',
      cols: 120,
      rows: 36,
      cwd: cwdResolved,
      env,
    });

    const self = this;
    const mirror = {
      ref,
      providerId,
      name,
      cmd,
      cwd: cwdResolved,
      pty: p,
      created: Date.now(),
      viewers: new Set(),
      buffer: [],
      describe() {
        return self.describe(this);
      },
    };

    p.onData((data) => {
      mirror.buffer.push(data);
      if (mirror.buffer.length > MAX_BUFFER) mirror.buffer.shift();
      for (const o of mirror.viewers) {
        for (const fn of o) fn(data);
      }
      this.emit('data', ref, data);
    });

    p.onExit(({ exitCode }) => {
      this.sessions.delete(ref);
      this.known = this.known.filter((k) => k.ref !== ref);
      this.persist();
      this.emit('exit', ref, exitCode);
      for (const o of mirror.viewers) o.clear();
    });

    this.sessions.set(ref, mirror);

    // record + persist as a known session when it is created on demand
    if (!this.known.some((k) => k.ref === ref)) {
      this.known.push({ ref, providerId, name, cmd, cwd: cwdResolved });
      this.persist();
    }

    this.emit('spawn', ref, mirror.describe());
    return mirror;
  }

  createSession({ providerId, name, cmd, cwd }) {
    if (!cmd || cmd.length === 0) {
      throw new Error('No attach command provided for session');
    }
    const mirror = this.buildMirror({ providerId, name, cmd, cwd });
    return mirror.describe();
  }

  // Re-attach every persisted session whose command is still eligible. Ran at
  // startup; a session whose underlying host process died will re-exit and be
  // dropped automatically by onExit.
  async restore({ resolveCmd } = {}) {
    const known = this.loadKnown();
    for (const k of known) {
      let cmd = k.cmd;
      if (resolveCmd && typeof resolveCmd === 'function') {
        try {
          const resolved = await resolveCmd(k);
          if (resolved && Array.isArray(resolved) && resolved.length) cmd = resolved;
        } catch {
          /* keep persisted cmd */
        }
      }
      try {
        this.buildMirror({ providerId: k.providerId, name: k.name, cmd, cwd: k.cwd });
      } catch (err) {
        // forget sessions we can no longer attach to rather than erroring forever
        this.known = this.known.filter((x) => x.ref !== k.ref);
        this.persist();
        this.emit('restore-failed', k.ref, String(err));
      }
    }
    return this.sessions.size;
  }

  write(ref, data, { resize } = {}) {
    const s = this.sessions.get(ref);
    if (!s) return false;
    if (resize) {
      try {
        s.pty.resize(data.cols || 120, data.rows || 36);
      } catch {
        /* ignore */
      }
    } else {
      s.pty.write(data);
    }
    return true;
  }

  detach(ref, key) {
    const s = this.sessions.get(ref);
    if (!s) return;
    s.viewers.delete(key);
  }
}
